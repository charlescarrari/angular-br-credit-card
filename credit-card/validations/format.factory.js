Format.$inject = ['Cards', 'Common', '$filter']
export function Format(Cards, Common, $filter) {

    var _formats = {};

    var __indexOf = [].indexOf || function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
        }
        return -1;
    };

    var _hasTextSelected = function ($target) {
        var ref;

        if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== $target.prop('selectionEnd')) {
            return true;
        }

        if (typeof document !== 'undefined' && document !== null ? (ref = document.selection) != null ? typeof ref.createRange === 'function' ? ref.createRange().text : void 0 : void 0 : void 0) {
            return true;
        }

        return false;
    };

    var _getFormattedCardNumber = function (num) {
        if (!num) {
            return '';
        }
        var card, formatted, gaps;
        formatted = '';
        card = Cards.getCard();
        gaps = card.gaps;

        if (!card) {
            return num;
        }

        num.split('').forEach(function (element, index) {
            // var includes = gaps.includes(index + 1);
            var includes = __indexOf.call(gaps, index + 1) !== -1;
            formatted += includes ? element + ' ' : element;
        });
        return formatted;
    };

    var _formatCardNumber = function (ctrl, e) {
        var target = angular.element(e.currentTarget);
        var value = target.val().replace(/\D/g, '');
        var length = value.length;

        var card = Cards.getCard();
        var lastMaxlength = card.lenghts[card.lenghts.length - 1];
        var nextGap = card.gaps.find(function (x) {
            return x >= length;
        });
        var newVal = value.substr(0, value.length - 1);

        if (nextGap || length <= lastMaxlength) {
            newVal = (value);
        }

        var formattedVal = _getFormattedCardNumber(newVal);
        target.val(formattedVal);
        ctrl.$setViewValue(formattedVal);
        e.preventDefault();
        Common.putCursorAtEnd.call(target, target);
    };

    var _formatBackCardNumber = function (e) {
        var $target, value;

        $target = angular.element(e.currentTarget);
        value = $target.val();

        if (e.meta) {
            return;
        }

        if (e.which !== 8) {
            return;
        }

        if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
            return;
        }

        if (/\d\s$/.test(value) && !e.meta && e.keyCode >= 46) {
            e.preventDefault();
            return $target.val(value.replace(/\d\s$/, ''));
        } else if (/\s\d?$/.test(value)) {
            e.preventDefault();
            return $target.val(value.replace(/\s\d?$/, ''));
        }
    };

    var _reFormatCardNumber = function (ctrl, e) {
        setTimeout(function () {
            var $target, value, returnEl, entry;
            $target = angular.element(e.target);
            entry = $target.val().replace(/\D/g, '');
            return Cards.identify(entry.slice(0, 6)).then(function () {
                value = _getFormattedCardNumber(entry);
                returnEl = $target.val(value);
                ctrl.$setViewValue(value);
                return returnEl;
            });
        });
    };

    var _parseCardNumber = function (value) {
        return value != null ? value.replace(/\s/g, '') : value;
    };

    _formats['card'] = function (elem, ctrl) {
        elem.bind('input', Common.curry(_formatCardNumber)(ctrl));
        elem.bind('keydown', _formatBackCardNumber);
        elem.bind('paste', Common.curry(_reFormatCardNumber)(ctrl));

        ctrl.$parsers.push(_parseCardNumber);
        ctrl.$formatters.push(_getFormattedCardNumber);
    };


    // cvc

    var _formatCVC = function (ctrl, e) {
        var target = angular.element(e.currentTarget);
        var digit = Common.getSrcElement(e).value[Common.getSrcElement(e).value.length - 1];
        var val = target.val();
        var oldVal = angular.copy(val.substr(0, val.length - 1));
        var cvcLen = Cards.getCard().cvv;

        if (val.length < cvcLen + 1) {
            return;
        } else {
            target.val(oldVal);
            ctrl.$setViewValue(oldVal);
            Common.putCursorAtEnd(target);
            return;
        }
    };

    var _reformatCVC = function (ctrl, e) {
        setTimeout(function () {
            var $target, value, cvcLen, onlyDigits, validCVC;
            $target = angular.element(e.target);
            cvcLen = Cards.getCard().cvv;

            value = $target.val();
            onlyDigits = value.replace(new RegExp(/[^\d]/, 'g'), '');
            validCVC = onlyDigits.substr(0, cvcLen);
            $target.val(validCVC);
            ctrl.$setViewValue(validCVC);
        });
    };

    _formats['cvc'] = function (elem, ctrl, algo) {
        elem.bind('input', Common.curry(_formatCVC)(ctrl));
        elem.bind('paste', Common.curry(_reformatCVC)(ctrl));
    };

    // expiry

    var _restrictExpiry = function (e) {
        var $target, digit, value;

        $target = angular.element(e.currentTarget);
        digit = String.fromCharCode(e.which);

        if (!/^\d+$/.test(digit) && !e.meta && e.keyCode >= 46) {
            e.preventDefault();
            return;
        }

        if (_hasTextSelected($target)) {
            return;
        }

        value = $target.val() + digit;
        value = value.replace(/\D/g, '');

        if (value.length > 4) {
            e.preventDefault();
            return;
        }
    };

    var _formatExpiry = function (e) {
        var $target, digit, val;

        digit = String.fromCharCode(e.which);

        if (!/^\d+$/.test(digit) && !e.meta && e.keyCode >= 46) {
            e.preventDefault();
            return;
        }

        $target = angular.element(e.currentTarget);
        val = $target.val() + digit;

        if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
            e.preventDefault();
            return $target.val('0' + val + '/');

        } else if (/^\d\d$/.test(val)) {
            e.preventDefault();
            return $target.val('' + val + '/');

        }
    };

    var _formatForwardExpiry = function (e) {
        var $target, digit, val;

        digit = String.fromCharCode(e.which);

        if (!/^\d+$/.test(digit) && !e.meta && e.keyCode >= 46) {
            return;
        }

        $target = angular.element(e.currentTarget);
        val = $target.val();

        if (/^\d\d$/.test(val)) {
            return $target.val('' + val + '/');
        }
    };

    var _formatForwardSlash = function (e) {
        var $target, slash, val;

        slash = String.fromCharCode(e.which);

        if (slash !== '/') {
            return;
        }

        $target = angular.element(e.currentTarget);
        val = $target.val();

        if (/^\d$/.test(val) && val !== '0') {
            return $target.val('0' + val + '/');
        }
    };

    var _formatBackExpiry = function (e) {
        var $target, value;

        if (e.meta) {
            return;
        }

        $target = angular.element(e.currentTarget);
        value = $target.val();

        if (e.which !== 8) {
            return;
        }

        if (($target.prop('selectionStart') != null) && $target.prop('selectionStart') !== value.length) {
            return;
        }

        if (/\d(\s|\/)+$/.test(value)) {
            e.preventDefault();
            return $target.val(value.replace(/\d(\s|\/)*$/, ''));

        } else if (/\s\/\s?\d?$/.test(value)) {
            e.preventDefault();
            return $target.val(value.replace(/\s\/\s?\d?$/, ''));

        }
    };

    var _parseExpiry = function (value) {
        if (value != null) {
            var obj = Common.parseExpiry(value);
            var expiry = new Date(obj.year, obj.month - 1);
            return $filter('date')(expiry, 'MMyy');
        }
        return null;
    };

    var _getFormattedExpiry = function (value) {
        if (value != null) {
            var obj = Common.parseExpiry(value);
            var expiry = new Date(obj.year, obj.month - 1);
            return $filter('date')(expiry, 'MM/yy');
        }
        return null;
    };


    _formats['expiry'] = function (elem, ctrl) {
        elem.bind('keypress', _restrictExpiry);
        elem.bind('keypress', _formatExpiry);
        elem.bind('keypress', _formatForwardSlash);
        elem.bind('keypress', _formatForwardExpiry);
        elem.bind('keydown', _formatBackExpiry);

        ctrl.$parsers.push(_parseExpiry);
        ctrl.$formatters.push(_getFormattedExpiry);
    };

    return function (type, elem, ctrl) {
        if (!_formats[type]) {

            var types = Object.keys(_formats);

            var errstr = 'Unknown type for formatting: "' + type + '". ';
            errstr += 'Should be one of: "' + types.join('", "') + '"';

            throw errstr;
        }
        return _formats[type](elem, ctrl);
    };

};

paymentsFormat.$inject = ['$window', '_Format']; //directive
export function paymentsFormat($window, _Format) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            _Format(attr.paymentsFormat, elem, ctrl);
        }
    };
};