export default function Common() {
	if (!Array.prototype.find) {
		Array.prototype.find = function(predicate) { //jshint ignore:line
			if (this === null) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}
			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0; //jshint ignore:line
			var thisArg = arguments[1];
			var value;
	
			for (var i = 0; i < length; i++) {
				value = list[i];
				if (predicate.call(thisArg, value, i, list)) {
					return value;
				}
			}
			return undefined;
		};
	}
	var ret = {};
	// expiry is a string "mm / yy[yy]"
	ret['parseExpiry'] = function(value) {
		var month, prefix, year, _ref;

		value = value || '';

		value = value.replace(/\s/g, '');
		_ref = value.split('/', 2);
		month = _ref[0];
		year = _ref[1];
		if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
			prefix = (new Date()).getFullYear(); //TODO: Verificar se tem merda
			prefix = prefix.toString().slice(0, 2);
			year = prefix + year;
		}

		month = parseInt(month, 10);
		year = parseInt(year, 10);

		return {
			month: month,
			year: year
		};
	};

	ret.getSrcElement = function(event) {
		return event.srcElement ? event.srcElement : event.originalTarget;
	};

	ret.curry = function curry(fn) {
		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}
	
		if (args.length === fn.length) {
			return fn.apply(undefined, args);
		}
		return curry.bind.apply(curry, [undefined, fn].concat(args));
	};

	ret.putCursorAtEnd = function(element){
		for (var index = 0; index < element.length; index++) {
			var el = element[index];
	
			if (ret.matches(el, ':focus')) {
				el.focus();
			}
	
			if (el.setSelectionRange) {
				var len = el.value.length * 2;
				setTimeout(function() {
					el.setSelectionRange(len, len);
				}, 1);
	
			} else
				el.value = el.value;
	
			this.scrollTop = 999999;
	
		}
	}
	
	ret.luhnCheck = function (num) {
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

	ret.matches = function(el, selector) {
		return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	};

	return ret;

};