Validate.$inject = ['Cards', 'Common', '$parse'];
export function Validate(Cards, Common, $parse) {

    var __indexOf = [].indexOf || function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
        }
        return -1;
    };

    var _luhnCheck = function (num) {
        var digit, digits, odd, sum, i, len;

        odd = true;
        sum = 0;
        digits = (num + '').split('').reverse();

        for (i = 0, len = digits.length; i < len; i++) {

            digit = digits[i];
            digit = parseInt(digit, 10);

            if ((odd = !odd)) {
                digit *= 2;
            }

            if (digit > 9) {
                digit -= 9;
            }

            sum += digit;

        }

        return sum % 10 === 0;
    };

    var _validators = {};

    _validators['cvc'] = function (cvc, ctrl, scope, attr) {
        var ref, ref1;

        // valid if empty - let ng-required handle empty
        if (cvc == null || cvc.length === 0) {
            return true;
        }

        if (!/^\d+$/.test(cvc)) {
            return false;
        }
        var type;
        if (attr.paymentsTypeModel) {
            var typeModel = $parse(attr.paymentsTypeModel);
            type = typeModel(scope);
        }

        return cvc.length === Cards.getCard().cvv;
    };

    _validators['card'] = function (num, ctrl, scope, attr) {
        var card = Cards.getCard();
        var typeModel;
        if (card.brand !== 'default') {
            num = (num + '').replace(/\D/g, '');
            var ret = (__indexOf.call(card.lenghts, num.length) >= 0) && (_luhnCheck(num));
            if (attr.paymentsTypeModel) {
                typeModel = $parse(attr.paymentsTypeModel);
                typeModel.assign(scope, card.brand);
            }
            return ret;
        } else if (num) {
            ctrl.$card = null;
        }
        return false;
    };

    _validators['expiry'] = function (val) {
        // valid if empty - let ng-required handle empty
        if (val == null || val.length === 0) {
            return true;
        }

        var obj = Common.parseExpiry(val);

        var month = obj.month;
        var year = obj.year;

        var currentTime, expiry, prefix, lessThan13;

        if (!(month && year)) {
            return false;
        }

        if (!/^\d+$/.test(month)) {
            return false;
        }

        if (!/^\d+$/.test(year)) {
            return false;
        }

        if (parseInt(month, 10) > 12) {
            return false;
        }

        if (year.length === 2) {
            prefix = (new Date()).getFullYear();
            prefix = prefix.toString().slice(0, 2);
            year = prefix + year;
        }

        expiry = new Date(year, month);
        currentTime = new Date();
        expiry.setMonth(expiry.getMonth() - 1);
        expiry.setMonth(expiry.getMonth() + 1, 1);
        lessThan13 = expiry.getFullYear() - currentTime.getFullYear() <= 13;

        return expiry > currentTime && lessThan13;
    };

    return function (type, val, ctrl, scope, attr) {
        if (!_validators[type]) {

            var types = Object.keys(_validators);

            var errstr = 'Unknown type for validation: "' + type + '". ';
            errstr += 'Should be one of: "' + types.join('", "') + '"';

            throw errstr;
        }
        return _validators[type](val, ctrl, scope, attr);
    };
};

ValidateWatch.$inject = ['_Validate']; //factory
export function ValidateWatch(_Validate) {

    var _validatorWatches = {};

    _validatorWatches['cvc'] = function (type, ctrl, scope, attr) {
        if (attr.paymentsTypeModel) {
            scope.$watch(attr.paymentsTypeModel, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    var valid = _Validate(type, ctrl.$modelValue, ctrl, scope, attr);
                    ctrl.$setValidity(type, valid);
                }
            });
        }
    };

    return function (type, ctrl, scope, attr) {
        if (_validatorWatches[type]) {
            return _validatorWatches[type](type, ctrl, scope, attr);
        }
    };
};

paymentsValidate.$inject = ['$window', '_Validate', '_ValidateWatch', '$q', 'Cards', '$parse']; //directive
export function paymentsValidate($window, _Validate, _ValidateWatch, $q, Cards, $parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            function resolver(resolve, reject, valid) {
                if (valid)
                    resolve();
                else
                    reject();
            }
            var type = attr.paymentsValidate;

            _ValidateWatch(type, ctrl, scope, attr);
            var validateFn = function (val) {
                if (!val) {
                    return val;
                }
                var entry = val.toString().replace(/\D/g, '');
                if (type === 'card') {
                    ctrl.$asyncValidators.card = function (modelValue, viewValue) {
                        return $q(function (resolve, reject) {

                            var bin = entry.slice(0, 6);

                            if (Cards.getCard().originBin !== bin && entry.length >= 6 && !ctrl.searchingBin) {
                                ctrl.searchingBin = true;
                                Cards.identify(bin).then(function () {
                                    ctrl.searchingBin = false;
                                    var valid = _Validate(type, ctrl.lastVal, ctrl, scope, attr);
                                    resolver(resolve, reject, valid);
                                    ctrl.$setValidity('card', valid);
                                }).catch(function () {
                                    ctrl.searchingBin = false;
                                    reject('Erro ao identificar o cartão');
                                    ctrl.$setValidity('card', false);
                                });

                            } else if (entry.length < 6) {
                                resolver(resolve, reject, false);
                                Cards.clearBrand();
                                if (attr.paymentsTypeModel) {
                                  var typeModel = $parse(attr.paymentsTypeModel);
                                  typeModel.assign(scope, null);
                                }
                            } else if (Cards.getCard().brand !== 'default' || Cards.getCard().originBin === bin) {
                                var valid = _Validate(type, modelValue, ctrl, scope, attr);
                                resolver(resolve, reject, valid);

                            } else if (ctrl.searchingBin) {
                                ctrl.lastVal = modelValue;
                            }

                            return false;
                        });
                    };
                } else {
                    var valid = _Validate(type, val, ctrl, scope, attr);
                    ctrl.$setValidity(type, valid);
                }
                // Comentado pois quebrava outras verificações por retornar undefined
                // return valid ? val : undefined;
                return val;
            };

            ctrl.$formatters.push(validateFn);
            ctrl.$parsers.push(validateFn);
        }
    };
};
