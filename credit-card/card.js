/* jshint ignore:start */
export default (function(f) {
	if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = f()
	} else if (typeof define === "function" && define.amd) {
		define([], f)
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window
		} else if (typeof global !== "undefined") {
			g = global
		} else if (typeof self !== "undefined") {
			g = self
		} else {
			g = this
		}
		g.card = f()
	}
})(function() {
	var define, module, exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a) return a(o, !0);
					if (i) return i(o, !0);
					var f = new Error("Cannot find module '" + o + "'");
					throw f.code = "MODULE_NOT_FOUND", f
				}
				var l = n[o] = {
					exports: {}
				};
				t[o][0].call(l.exports, function(e) {
					var n = t[o][1][e];
					return s(n ? n : e)
				}, l, l.exports, e, t, n, r)
			}
			return n[o].exports
		}
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++) s(r[o]);
		return s
	})({
		1: [function(_dereq_, module, exports) {
			module.exports = _dereq_('./lib/extend');


		}, {
			"./lib/extend": 2
		}],
		2: [function(_dereq_, module, exports) {

			var is = _dereq_('is');

			function extend() {
				var target = arguments[0] || {};
				var i = 1;
				var length = arguments.length;
				var deep = false;
				var options, name, src, copy, copy_is_array, clone;

				// Handle a deep copy situation
				if (typeof target === 'boolean') {
					deep = target;
					target = arguments[1] || {};
					// skip the boolean and the target
					i = 2;
				}

				// Handle case when target is a string or something (possible in deep copy)
				if (typeof target !== 'object' && !is.fn(target)) {
					target = {};
				}

				for (; i < length; i++) {
					// Only deal with non-null/undefined values
					options = arguments[i]
					if (options != null) {
						if (typeof options === 'string') {
							options = options.split('');
						}
						// Extend the base object
						for (name in options) {
							src = target[name];
							copy = options[name];

							// Prevent never-ending loop
							if (target === copy) {
								continue;
							}

							// Recurse if we're merging plain objects or arrays
							if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
								if (copy_is_array) {
									copy_is_array = false;
									clone = src && is.array(src) ? src : [];
								} else {
									clone = src && is.hash(src) ? src : {};
								}

								// Never move original objects, clone them
								target[name] = extend(deep, clone, copy);

								// Don't bring in undefined values
							} else if (typeof copy !== 'undefined') {
								target[name] = copy;
							}
						}
					}
				}

				// Return the modified object
				return target;
			};

			module.exports = extend;

		}, {
			"is": 3
		}],
		3: [function(_dereq_, module, exports) {

			var objProto = Object.prototype;
			var toStr = objProto.toString;
			var symbolValueOf;
			if (typeof Symbol === 'function') {
				symbolValueOf = Symbol.prototype.valueOf;
			}

			var NON_HOST_TYPES = {
				'boolean': 1,
				number: 1,
				string: 1,
				undefined: 1
			};


			var is = module.exports = {};

			is.array = Array.isArray || function(value) {
				return toStr.call(value) === '[object Array]';
			};

			is.fn = is['function'] = function(value) {
				var isAlert = typeof window !== 'undefined' && value === window.alert;
				return isAlert || toStr.call(value) === '[object Function]';
			};

			is.number = function(value) {
				return toStr.call(value) === '[object Number]';
			};

			is.hash = function(value) {
				return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
			};

			is.object = function(value) {
				return toStr.call(value) === '[object Object]';
			};

		}, {}],
		4: [function(_dereq_, module, exports) {
			(function(global) {
				var Payment, QJ;
			}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
		}, {
			"qj/src/qj.coffee": 5
		}],
		5: [function(_dereq_, module, exports) {
			var QJ, rreturn, rtrim;

			QJ = function(selector) {
				if (QJ.isDOMElement(selector)) {
					return selector;
				}
				return document.querySelectorAll(selector);
			};

			QJ.isDOMElement = function(el) {
				return el && (el.nodeName != null);
			};

			rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

			QJ.trim = function(text) {
				if (text === null) {
					return "";
				} else {
					return (text + "").replace(rtrim, "");
				}
			};

			rreturn = /\r/g;

			QJ.val = function(el, val) {
				var ret;
				if (arguments.length > 1) {
					return el.value = val;
				} else {
					ret = el.value;
					if (typeof ret === "string") {
						return ret.replace(rreturn, "");
					} else {
						if (ret === null) {
							return "";
						} else {
							return ret;
						}
					}
				}
			};

			QJ.preventDefault = function(eventObject) {
				if (typeof eventObject.preventDefault === "function") {
					eventObject.preventDefault();
					return;
				}
				eventObject.returnValue = false;
				return false;
			};

			QJ.normalizeEvent = function(e) {
				var original;
				original = e;
				e = {
					which: original.which != null ? original.which : void 0,
					target: original.target || original.srcElement,
					preventDefault: function() {
						return QJ.preventDefault(original);
					},
					originalEvent: original,
					data: original.data || original.detail
				};
				if (e.which == null) {
					e.which = original.charCode != null ? original.charCode : original.keyCode;
				}
				return e;
			};

			QJ.on = function(element, eventName, callback) {
				var el, i, j, len, len1, multEventName, originalCallback, ref;
				if (element.length) {
					for (i = 0, len = element.length; i < len; i++) {
						el = element[i];
						QJ.on(el, eventName, callback);
					}
					return;
				}
				if (eventName.match(" ")) {
					ref = eventName.split(" ");
					for (j = 0, len1 = ref.length; j < len1; j++) {
						multEventName = ref[j];
						QJ.on(element, multEventName, callback);
					}
					return;
				}
				originalCallback = callback;
				callback = function(e) {
					e = QJ.normalizeEvent(e);
					return originalCallback(e);
				};
				if (element.addEventListener) {
					return element.addEventListener(eventName, callback, false);
				}
				if (element.attachEvent) {
					eventName = "on" + eventName;
					return element.attachEvent(eventName, callback);
				}
				element['on' + eventName] = callback;
			};

			QJ.addClass = function(el, className) {
				var e;
				if (el.length) {
					return (function() {
						var i, len, results;
						results = [];
						for (i = 0, len = el.length; i < len; i++) {
							e = el[i];
							results.push(QJ.addClass(e, className));
						}
						return results;
					})();
				}
				if (el.classList) {
					return el.classList.add(className);
				} else {
					return el.className += ' ' + className;
				}
			};

			QJ.hasClass = function(el, className) {
				var e, hasClass, i, len;
				if (el.length) {
					hasClass = true;
					for (i = 0, len = el.length; i < len; i++) {
						e = el[i];
						hasClass = hasClass && QJ.hasClass(e, className);
					}
					return hasClass;
				}
				if (el.classList) {
					return el.classList.contains(className);
				} else {
					return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
				}
			};

			QJ.removeClass = function(el, className) {
				var cls, e, i, len, ref, results;
				if (el.length) {
					return (function() {
						var i, len, results;
						results = [];
						for (i = 0, len = el.length; i < len; i++) {
							e = el[i];
							results.push(QJ.removeClass(e, className));
						}
						return results;
					})();
				}
				if (el.classList) {
					ref = className.split(' ');
					results = [];
					for (i = 0, len = ref.length; i < len; i++) {
						cls = ref[i];
						results.push(el.classList.remove(cls));
					}
					return results;
				} else {
					return el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
				}
			};

			QJ.toggleClass = function(el, className, bool) {
				var e;
				if (el.length) {
					return (function() {
						var i, len, results;
						results = [];
						for (i = 0, len = el.length; i < len; i++) {
							e = el[i];
							results.push(QJ.toggleClass(e, className, bool));
						}
						return results;
					})();
				}
				if (bool) {
					if (!QJ.hasClass(el, className)) {
						return QJ.addClass(el, className);
					}
				} else {
					return QJ.removeClass(el, className);
				}
			};

			QJ.append = function(el, toAppend) {
				var e;
				if (el.length) {
					return (function() {
						var i, len, results;
						results = [];
						for (i = 0, len = el.length; i < len; i++) {
							e = el[i];
							results.push(QJ.append(e, toAppend));
						}
						return results;
					})();
				}
				return el.insertAdjacentHTML('beforeend', toAppend);
			};

			QJ.find = function(el, selector) {
				if (el instanceof NodeList || el instanceof Array) {
					el = el[0];
				}
				return el.querySelectorAll(selector);
			};

			QJ.trigger = function(el, name, data) {
				var e, error, ev;
				try {
					ev = new CustomEvent(name, {
						detail: data
					});
				} catch (error) {
					e = error;
					ev = document.createEvent('CustomEvent');
					if (ev.initCustomEvent) {
						ev.initCustomEvent(name, true, true, data);
					} else {
						ev.initEvent(name, true, true, data);
					}
				}
				return el.dispatchEvent(ev);
			};

			module.exports = QJ;


		}, {}],
		6: [function(_dereq_, module, exports) {
			module.exports = _dereq_('cssify');
		}, {
			"cssify": 7
		}],
		7: [function(_dereq_, module, exports) {
			module.exports = function(css, customDocument) {
				var doc = customDocument || document;
				if (doc.createStyleSheet) {
					var sheet = doc.createStyleSheet()
					sheet.cssText = css;
					return sheet.ownerNode;
				} else {
					var head = doc.getElementsByTagName('head')[0],
						style = doc.createElement('style');

					style.type = 'text/css';

					if (style.styleSheet) {
						style.styleSheet.cssText = css;
					} else {
						style.appendChild(doc.createTextNode(css));
					}

					head.appendChild(style);
					return style;
				}
			};

			module.exports.byUrl = function(url) {
				if (document.createStyleSheet) {
					return document.createStyleSheet(url).ownerNode;
				} else {
					var head = document.getElementsByTagName('head')[0],
						link = document.createElement('link');

					link.rel = 'stylesheet';
					link.href = url;

					head.appendChild(link);
					return link;
				}
			};

		}, {}],
		8: [function(_dereq_, module, exports) {
			(function(global) {
				var Card, QJ, extend, payment;

				_dereq_('../scss/card.scss');

				QJ = _dereq_('qj/src/qj.coffee');

				payment = _dereq_('payment/src/payment');

				extend = _dereq_('node.extend');

				Card = (function() {
					var bindVal;

					Card.prototype.cardTemplate = '' + '<div class="jp-card-container">' + '<div class="jp-card">' + '<div class="jp-card-front">' + '<div class="jp-card-logo jp-card-elo">' + '<div class="e">e</div>' + '<div class="l">l</div>' + '<div class="o">o</div>' + '</div>' + '<div class="jp-card-logo jp-card-visa">visa</div>' + '<div class="jp-card-logo jp-card-mastercard">MasterCard</div>' + '<div class="jp-card-logo jp-card-maestro">Maestro</div>' + '<div class="jp-card-logo jp-card-amex"></div>' + '<div class="jp-card-logo jp-card-discover">discover</div>' + '<div class="jp-card-logo jp-card-dankort"><div class="dk"><div class="d"></div><div class="k"></div></div></div>' + '<div class="jp-card-lower">' + '<div class="jp-card-shiny"></div>' + '<div class="jp-card-cvc jp-card-display">{{cvc}}</div>' + '<div class="jp-card-number jp-card-display">{{number}}</div>' + '<div class="jp-card-name jp-card-display">{{name}}</div>' + '<div class="jp-card-expiry jp-card-display" data-before="{{monthYear}}" data-after="{{validDate}}">{{expiry}}</div>' + '</div>' + '</div>' + '<div class="jp-card-back">' + '<div class="jp-card-bar"></div>' + '<div class="jp-card-cvc jp-card-display">{{cvc}}</div>' + '<div class="jp-card-shiny"></div>' + '</div>' + '</div>' + '</div>';

					Card.prototype.template = function(tpl, data) {
						return tpl.replace(/\{\{(.*?)\}\}/g, function(match, key, str) {
							return data[key];
						});
					};

					Card.prototype.cardTypes = ['jp-card-amex', 'jp-card-dankort', 'jp-card-dinersclub', 'jp-card-discover', 'jp-card-jcb', 'jp-card-laser', 'jp-card-maestro', 'jp-card-mastercard', 'jp-card-unionpay', 'jp-card-visa', 'jp-card-visaelectron', 'jp-card-elo'];

					Card.prototype.defaults = {
						formatting: true,
						formSelectors: {
							numberInput: 'input[name="number"]',
							expiryInput: 'input[name="expiry"]',
							cvcInput: 'input[name="cvc"]',
							nameInput: 'input[name="name"]'
						},
						cardSelectors: {
							cardContainer: '.jp-card-container',
							card: '.jp-card',
							numberDisplay: '.jp-card-number',
							expiryDisplay: '.jp-card-expiry',
							cvcDisplay: '.jp-card-cvc',
							nameDisplay: '.jp-card-name'
						},
						messages: {
							validDate: 'valid\nthru',
							monthYear: 'month/year'
						},
						placeholders: {
							number: '&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;',
							cvc: '&bull;&bull;&bull;',
							expiry: '&bull;&bull;/&bull;&bull;',
							name: 'Full Name'
						},
						classes: {
							valid: 'jp-card-valid',
							invalid: 'jp-card-invalid'
						},
						debug: false
					};

					function Card(opts) {
						this.options = extend(true, this.defaults, opts);
						if (!this.options.form) {
							console.log("Please provide a form");
							return;
						}
						this.$el = QJ(this.options.form);
						if (!this.options.container) {
							console.log("Please provide a container");
							return;
						}
						this.$container = QJ(this.options.container);
						this.render();
						this.attachHandlers();
						this.handleInitialPlaceholders();
					}

					Card.prototype.render = function() {
						var $cardContainer, baseWidth, name, obj, ref, ref1, selector, ua;
						QJ.append(this.$container, this.template(this.cardTemplate, extend({}, this.options.messages, this.options.placeholders)));
						ref = this.options.cardSelectors;
						for (name in ref) {
							selector = ref[name];
							this["$" + name] = QJ.find(this.$container, selector);
						}
						ref1 = this.options.formSelectors;
						for (name in ref1) {
							selector = ref1[name];
							selector = this.options[name] ? this.options[name] : selector;
							obj = QJ.find(this.$el, selector);
							if (!obj.length && this.options.debug) {
								console.error("Card can't find a " + name + " in your form.");
							}
							this["$" + name] = obj;
						}
						if (this.options.formatting) {
						}
						if (this.options.width) {
							$cardContainer = QJ(this.options.cardSelectors.cardContainer)[0];
							baseWidth = parseInt($cardContainer.clientWidth);
							$cardContainer.style.transform = "scale(" + (this.options.width / baseWidth) + ")";
						}
						if (typeof navigator !== "undefined" && navigator !== null ? navigator.userAgent : void 0) {
							ua = navigator.userAgent.toLowerCase();
							if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
								QJ.addClass(this.$card, 'jp-card-safari');
							}
						}
						if (/MSIE 10\./i.test(navigator.userAgent)) {
							QJ.addClass(this.$card, 'jp-card-ie-10');
						}
						if (/rv:11.0/i.test(navigator.userAgent)) {
							return QJ.addClass(this.$card, 'jp-card-ie-11');
						}
					};

					Card.prototype.attachHandlers = function() {
						var expiryFilters;
						bindVal(this.$numberInput, this.$numberDisplay, {
							fill: false,
							filters: this.validToggler('cardNumber')
						});
						expiryFilters = [
							function(val) {
								return val.replace(/(\s+)/g, '');
							}
						];
						expiryFilters.push(this.validToggler('cardExpiry'));
						bindVal(this.$expiryInput, this.$expiryDisplay, {
							join: function(text) {
								if (text[0].length === 2 || text[1]) {
									return "/";
								} else {
									return "";
								}
							},
							filters: expiryFilters
						});
						bindVal(this.$cvcInput, this.$cvcDisplay, {
							filters: this.validToggler('cardCVC')
						});
						QJ.on(this.$cvcInput, 'focus', this.handle('flipCard'));
						QJ.on(this.$cvcInput, 'blur', this.handle('unflipCard'));
						return bindVal(this.$nameInput, this.$nameDisplay, {
							fill: false,
							filters: this.validToggler('cardHolderName'),
							join: ' '
						});
					};

					Card.prototype.handleInitialPlaceholders = function() {
						var el, name, ref, results, selector;
						ref = this.options.formSelectors;
						results = [];
						for (name in ref) {
							selector = ref[name];
							el = this["$" + name];
							if (QJ.val(el)) {
								QJ.trigger(el, 'paste');
								results.push(setTimeout(function() {
									return QJ.trigger(el, 'keyup');
								}));
							} else {
								results.push(void 0);
							}
						}
						return results;
					};

					Card.prototype.handle = function(fn) {
						return (function(_this) {
							return function(e) {
								var args;
								args = Array.prototype.slice.call(arguments);
								args.unshift(e.target);
								return _this.handlers[fn].apply(_this, args);
							};
						})(this);
					};

					Card.prototype.validToggler = function(validatorName) {
					};

					Card.prototype.toggleValidClass = function(el, test) {
						QJ.toggleClass(el, this.options.classes.valid, test);
						return QJ.toggleClass(el, this.options.classes.invalid, !test);
					};

					Card.prototype.handlers = {
						setCardType: function($el, e) {
							var cardType;
							cardType = e.data;
							if (!QJ.hasClass(this.$card, cardType)) {
								QJ.removeClass(this.$card, 'jp-card-unknown');
								QJ.removeClass(this.$card, this.cardTypes.join(' '));
								QJ.addClass(this.$card, "jp-card-" + cardType);
								QJ.toggleClass(this.$card, 'jp-card-identified', cardType !== 'unknown');
								return this.cardType = cardType;
							}
						},
						flipCard: function() {
							return QJ.addClass(this.$card, 'jp-card-flipped');
						},
						unflipCard: function() {
							return QJ.removeClass(this.$card, 'jp-card-flipped');
						}
					};

					bindVal = function(el, out, opts) {
						var joiner, o, outDefaults;
						if (opts == null) {
							opts = {};
						}
						opts.fill = opts.fill || false;
						opts.filters = opts.filters || [];
						if (!(opts.filters instanceof Array)) {
							opts.filters = [opts.filters];
						}
						opts.join = opts.join || "";
						if (!(typeof opts.join === "function")) {
							joiner = opts.join;
							opts.join = function() {
								return joiner;
							};
						}
						outDefaults = (function() {
							var j, len, results;
							results = [];
							for (j = 0, len = out.length; j < len; j++) {
								o = out[j];
								results.push(o.textContent);
							}
							return results;
						})();
						QJ.on(el, 'focus', function() {
							return QJ.addClass(out, 'jp-card-focused');
						});
						QJ.on(el, 'blur', function() {
							return QJ.removeClass(out, 'jp-card-focused');
						});
						QJ.on(el, 'keyup change paste', function(e) {
							var elem, filter, i, j, join, k, len, len1, outEl, outVal, ref, results, val;
							val = (function() {
								var j, len, results;
								results = [];
								for (j = 0, len = el.length; j < len; j++) {
									elem = el[j];
									results.push(QJ.val(elem));
								}
								return results;
							})();
							join = opts.join(val);
							val = val.join(join);
							if (val === join) {
								val = "";
							}
							ref = opts.filters;
							for (j = 0, len = ref.length; j < len; j++) {
								filter = ref[j];
								// val = filter(val, el, out);
							}
							results = [];
							for (i = k = 0, len1 = out.length; k < len1; i = ++k) {
								outEl = out[i];
								if (opts.fill) {
									outVal = val + outDefaults[i].substring(val.length);
								} else {
									outVal = val || outDefaults[i];
								}
								results.push(outEl.textContent = outVal);
							}
							return results;
						});
						return el;
					};

					return Card;

				})();

				module.exports = Card;

				global.Card = Card;


			}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
		}, {
			"../scss/card.scss": 10,
			"node.extend": 1,
			"payment/src/payment": 4,
			"qj/src/qj.coffee": 5
		}],
		9: [function(_dereq_, module, exports) {
			var $, Card,
				slice = [].slice;

			Card = _dereq_('./card');

			$ = {};

			$.card = {};

			$.card.fn = {};
			$.fn = {};
			$.fn.card = function(opts) {
				return $.card.fn.construct.apply(this, opts);
			};

			// $.fn.extend({
			// 	card: function() {
			// 		var args, option;
			// 		option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
			// 		return this.each(function() {
			// 			var $this, data;
			// 			$this = $(this);
			// 			data = $this.data('card');
			// 			if (!data) {
			// 				$.each(option, (function(_this) {
			// 					return function(key, value) {
			// 						if (value instanceof jQuery) {
			// 							return option[key] = value[0];
			// 						}
			// 					};
			// 				})(this));
			// 				option['form'] = this;
			// 				console.log('aqui');
			// 				$this.data('card', (data = new Card(option)));
			// 			}
			// 			if (typeof option === 'string') {
			// 				return data[option].apply(data, args);
			// 			}
			// 		});
			// 	}
			// });


		}, {
			"./card": 8
		}],
		10: [function(_dereq_, module, exports) {
			module.exports = _dereq_('sassify')('.jp-card.jp-card-safari.jp-card-identified .jp-card-front:before, .jp-card.jp-card-safari.jp-card-identified .jp-card-back:before {   background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), -webkit-linear-gradient(-245deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%);   background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), linear-gradient(-25deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%); }  .jp-card.jp-card-ie-10.jp-card-flipped, .jp-card.jp-card-ie-11.jp-card-flipped {   -webkit-transform: 0deg;   -moz-transform: 0deg;   -ms-transform: 0deg;   -o-transform: 0deg;   transform: 0deg; }   .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-front, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-front {     -webkit-transform: rotateY(0deg);     -moz-transform: rotateY(0deg);     -ms-transform: rotateY(0deg);     -o-transform: rotateY(0deg);     transform: rotateY(0deg); }   .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back {     -webkit-transform: rotateY(0deg);     -moz-transform: rotateY(0deg);     -ms-transform: rotateY(0deg);     -o-transform: rotateY(0deg);     transform: rotateY(0deg); }     .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back:after, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back:after {       left: 18%; }     .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back .jp-card-cvc, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back .jp-card-cvc {       -webkit-transform: rotateY(180deg);       -moz-transform: rotateY(180deg);       -ms-transform: rotateY(180deg);       -o-transform: rotateY(180deg);       transform: rotateY(180deg);       left: 5%; }     .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back .jp-card-shiny, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back .jp-card-shiny {       left: 84%; }       .jp-card.jp-card-ie-10.jp-card-flipped .jp-card-back .jp-card-shiny:after, .jp-card.jp-card-ie-11.jp-card-flipped .jp-card-back .jp-card-shiny:after {         left: -480%;         -webkit-transform: rotateY(180deg);         -moz-transform: rotateY(180deg);         -ms-transform: rotateY(180deg);         -o-transform: rotateY(180deg);         transform: rotateY(180deg); }  .jp-card.jp-card-ie-10.jp-card-amex .jp-card-back, .jp-card.jp-card-ie-11.jp-card-amex .jp-card-back {   display: none; }  .jp-card-logo {   height: 36px;   width: 60px;   font-style: italic; }   .jp-card-logo, .jp-card-logo:before, .jp-card-logo:after {     box-sizing: border-box; }  .jp-card-logo.jp-card-amex {   text-transform: uppercase;   font-size: 4px;   font-weight: bold;   color: white;   background-image: repeating-radial-gradient(circle at center, #FFF 1px, #999 2px);   background-image: repeating-radial-gradient(circle at center, #FFF 1px, #999 2px);   border: 1px solid #EEE; }   .jp-card-logo.jp-card-amex:before, .jp-card-logo.jp-card-amex:after {     width: 28px;     display: block;     position: absolute;     left: 16px; }   .jp-card-logo.jp-card-amex:before {     height: 28px;     content: "american";     top: 3px;     text-align: left;     padding-left: 2px;     padding-top: 11px;     background: #267AC3; }   .jp-card-logo.jp-card-amex:after {     content: "express";     bottom: 11px;     text-align: right;     padding-right: 2px; }  .jp-card.jp-card-amex.jp-card-flipped {   -webkit-transform: none;   -moz-transform: none;   -ms-transform: none;   -o-transform: none;   transform: none; }  .jp-card.jp-card-amex.jp-card-identified .jp-card-front:before, .jp-card.jp-card-amex.jp-card-identified .jp-card-back:before {   background-color: #108168; }  .jp-card.jp-card-amex.jp-card-identified .jp-card-front .jp-card-logo.jp-card-amex {   opacity: 1; }  .jp-card.jp-card-amex.jp-card-identified .jp-card-front .jp-card-cvc {   visibility: visible; }  .jp-card.jp-card-amex.jp-card-identified .jp-card-front:after {   opacity: 1; }  .jp-card-logo.jp-card-discover {   background: #FF6600;   color: #111;   text-transform: uppercase;   font-style: normal;   font-weight: bold;   font-size: 10px;   text-align: center;   overflow: hidden;   z-index: 1;   padding-top: 9px;   letter-spacing: .03em;   border: 1px solid #EEE; }   .jp-card-logo.jp-card-discover:before, .jp-card-logo.jp-card-discover:after {     content: " ";     display: block;     position: absolute; }   .jp-card-logo.jp-card-discover:before {     background: white;     width: 200px;     height: 200px;     border-radius: 200px;     bottom: -5%;     right: -80%;     z-index: -1; }   .jp-card-logo.jp-card-discover:after {     width: 8px;     height: 8px;     border-radius: 4px;     top: 10px;     left: 27px;     background-color: #FF6600;     background-image: -webkit-radial-gradient(#FF6600, #fff);     background-image: radial-gradient(  #FF6600, #fff);     content: "network";     font-size: 4px;     line-height: 24px;     text-indent: -7px; }  .jp-card .jp-card-front .jp-card-logo.jp-card-discover {   right: 12%;   top: 18%; }  .jp-card.jp-card-discover.jp-card-identified .jp-card-front:before, .jp-card.jp-card-discover.jp-card-identified .jp-card-back:before {   background-color: #86B8CF; }  .jp-card.jp-card-discover.jp-card-identified .jp-card-logo.jp-card-discover {   opacity: 1; }  .jp-card.jp-card-discover.jp-card-identified .jp-card-front:after {   -webkit-transition: 400ms;   -moz-transition: 400ms;   transition: 400ms;   content: " ";   display: block;   background-color: #FF6600;   background-image: -webkit-linear-gradient(#FF6600, #ffa366, #FF6600);   background-image: linear-gradient(#FF6600, #ffa366, #FF6600);   height: 50px;   width: 50px;   border-radius: 25px;   position: absolute;   left: 100%;   top: 15%;   margin-left: -25px;   box-shadow: inset 1px 1px 3px 1px rgba(0, 0, 0, 0.5); }  .jp-card-logo.jp-card-visa {   background: white;   text-transform: uppercase;   color: #1A1876;   text-align: center;   font-weight: bold;   font-size: 15px;   line-height: 18px; }   .jp-card-logo.jp-card-visa:before, .jp-card-logo.jp-card-visa:after {     content: " ";     display: block;     width: 100%;     height: 25%; }   .jp-card-logo.jp-card-visa:before {     background: #1A1876; }   .jp-card-logo.jp-card-visa:after {     background: #E79800; }  .jp-card.jp-card-visa.jp-card-identified .jp-card-front:before, .jp-card.jp-card-visa.jp-card-identified .jp-card-back:before {   background-color: #191278; }  .jp-card.jp-card-visa.jp-card-identified .jp-card-logo.jp-card-visa {   opacity: 1; }  .jp-card-logo.jp-card-mastercard {   color: white;   font-weight: bold;   text-align: center;   font-size: 9px;   line-height: 36px;   z-index: 1;   text-shadow: 1px 1px rgba(0, 0, 0, 0.6); }   .jp-card-logo.jp-card-mastercard:before, .jp-card-logo.jp-card-mastercard:after {     content: " ";     display: block;     width: 36px;     top: 0;     position: absolute;     height: 36px;     border-radius: 18px; }   .jp-card-logo.jp-card-mastercard:before {     left: 0;     background: #FF0000;     z-index: -1; }   .jp-card-logo.jp-card-mastercard:after {     right: 0;     background: #FFAB00;     z-index: -2; }  .jp-card.jp-card-mastercard.jp-card-identified .jp-card-front .jp-card-logo.jp-card-mastercard, .jp-card.jp-card-mastercard.jp-card-identified .jp-card-back .jp-card-logo.jp-card-mastercard {   box-shadow: none; }  .jp-card.jp-card-mastercard.jp-card-identified .jp-card-front:before, .jp-card.jp-card-mastercard.jp-card-identified .jp-card-back:before {   background-color: #0061A8; }  .jp-card.jp-card-mastercard.jp-card-identified .jp-card-logo.jp-card-mastercard {   opacity: 1; }  .jp-card-logo.jp-card-maestro {   color: white;   font-weight: bold;   text-align: center;   font-size: 14px;   line-height: 36px;   z-index: 1;   text-shadow: 1px 1px rgba(0, 0, 0, 0.6); }   .jp-card-logo.jp-card-maestro:before, .jp-card-logo.jp-card-maestro:after {     content: " ";     display: block;     width: 36px;     top: 0;     position: absolute;     height: 36px;     border-radius: 18px; }   .jp-card-logo.jp-card-maestro:before {     left: 0;     background: #0064CB;     z-index: -1; }   .jp-card-logo.jp-card-maestro:after {     right: 0;     background: #CC0000;     z-index: -2; }  .jp-card.jp-card-maestro.jp-card-identified .jp-card-front .jp-card-logo.jp-card-maestro, .jp-card.jp-card-maestro.jp-card-identified .jp-card-back .jp-card-logo.jp-card-maestro {   box-shadow: none; }  .jp-card.jp-card-maestro.jp-card-identified .jp-card-front:before, .jp-card.jp-card-maestro.jp-card-identified .jp-card-back:before {   background-color: #0B2C5F; }  .jp-card.jp-card-maestro.jp-card-identified .jp-card-logo.jp-card-maestro {   opacity: 1; }  .jp-card-logo.jp-card-dankort {   width: 60px;   height: 36px;   padding: 3px;   border-radius: 8px;   border: #000000 1px solid;   background-color: #FFFFFF; }   .jp-card-logo.jp-card-dankort .dk {     position: relative;     width: 100%;     height: 100%;     overflow: hidden; }     .jp-card-logo.jp-card-dankort .dk:before {       background-color: #ED1C24;       content: \'\';       position: absolute;       width: 100%;       height: 100%;       display: block;       border-radius: 6px; }     .jp-card-logo.jp-card-dankort .dk:after {       content: \'\';       position: absolute;       top: 50%;       margin-top: -7.7px;       right: 0;       width: 0;       height: 0;       border-style: solid;       border-width: 7px 7px 10px 0;       border-color: transparent #ED1C24 transparent transparent;       z-index: 1; }   .jp-card-logo.jp-card-dankort .d, .jp-card-logo.jp-card-dankort .k {     position: absolute;     top: 50%;     width: 50%;     display: block;     height: 15.4px;     margin-top: -7.7px;     background: white; }   .jp-card-logo.jp-card-dankort .d {     left: 0;     border-radius: 0 8px 10px 0; }     .jp-card-logo.jp-card-dankort .d:before {       content: \'\';       position: absolute;       top: 50%;       left: 50%;       display: block;       background: #ED1C24;       border-radius: 2px 4px 6px 0px;       height: 5px;       width: 7px;       margin: -3px 0 0 -4px; }   .jp-card-logo.jp-card-dankort .k {     right: 0; }     .jp-card-logo.jp-card-dankort .k:before, .jp-card-logo.jp-card-dankort .k:after {       content: \'\';       position: absolute;       right: 50%;       width: 0;       height: 0;       border-style: solid;       margin-right: -1px; }     .jp-card-logo.jp-card-dankort .k:before {       top: 0;       border-width: 8px 5px 0 0;       border-color: #ED1C24 transparent transparent transparent; }     .jp-card-logo.jp-card-dankort .k:after {       bottom: 0;       border-width: 0 5px 8px 0;       border-color: transparent transparent #ED1C24 transparent; }  .jp-card.jp-card-dankort.jp-card-identified .jp-card-front:before, .jp-card.jp-card-dankort.jp-card-identified .jp-card-back:before {   background-color: #0055C7; }  .jp-card.jp-card-dankort.jp-card-identified .jp-card-logo.jp-card-dankort {   opacity: 1; }  .jp-card-logo.jp-card-elo {   height: 50px;   width: 50px;   border-radius: 100%;   background: black;   color: white;   text-align: center;   text-transform: lowercase;   font-size: 21px;   font-style: normal;   letter-spacing: 1px;   font-weight: bold;   padding-top: 13px; }   .jp-card-logo.jp-card-elo .e, .jp-card-logo.jp-card-elo .l, .jp-card-logo.jp-card-elo .o {     display: inline-block;     position: relative; }   .jp-card-logo.jp-card-elo .e {     -webkit-transform: rotate(-15deg);     -moz-transform: rotate(-15deg);     -ms-transform: rotate(-15deg);     -o-transform: rotate(-15deg);     transform: rotate(-15deg); }   .jp-card-logo.jp-card-elo .o {     position: relative;     display: inline-block;     width: 12px;     height: 12px;     right: 0;     top: 7px;     border-radius: 100%;     background-image: -webkit-linear-gradient( yellow 50%, red 50%);     background-image: linear-gradient( yellow 50%, red 50%);     -webkit-transform: rotate(40deg);     -moz-transform: rotate(40deg);     -ms-transform: rotate(40deg);     -o-transform: rotate(40deg);     transform: rotate(40deg);     text-indent: -9999px; }     .jp-card-logo.jp-card-elo .o:before {       content: "";       position: absolute;       width: 49%;       height: 49%;       background: black;       border-radius: 100%;       text-indent: -99999px;       top: 25%;       left: 25%; }  .jp-card.jp-card-elo.jp-card-identified .jp-card-front:before, .jp-card.jp-card-elo.jp-card-identified .jp-card-back:before {   background-color: #6F6969; }  .jp-card.jp-card-elo.jp-card-identified .jp-card-logo.jp-card-elo {   opacity: 1; }  .jp-card-container {   -webkit-perspective: 1000px;   -moz-perspective: 1000px;   perspective: 1000px;   width: 350px;   max-width: 100%;   height: 200px;   margin: auto;   z-index: 1;   position: relative; }  .jp-card {   font-family: "Helvetica Neue";   line-height: 1;   position: relative;   width: 100%;   height: 100%;   min-width: 315px;   border-radius: 10px;   -webkit-transform-style: preserve-3d;   -moz-transform-style: preserve-3d;   -ms-transform-style: preserve-3d;   -o-transform-style: preserve-3d;   transform-style: preserve-3d;   -webkit-transition: all 400ms linear;   -moz-transition: all 400ms linear;   transition: all 400ms linear; }   .jp-card > *, .jp-card > *:before, .jp-card > *:after {     -moz-box-sizing: border-box;     -webkit-box-sizing: border-box;     box-sizing: border-box;     font-family: inherit; }   .jp-card.jp-card-flipped {     -webkit-transform: rotateY(180deg);     -moz-transform: rotateY(180deg);     -ms-transform: rotateY(180deg);     -o-transform: rotateY(180deg);     transform: rotateY(180deg); }   .jp-card .jp-card-front, .jp-card .jp-card-back {     -webkit-backface-visibility: hidden;     backface-visibility: hidden;     -webkit-transform-style: preserve-3d;     -moz-transform-style: preserve-3d;     -ms-transform-style: preserve-3d;     -o-transform-style: preserve-3d;     transform-style: preserve-3d;     -webkit-transition: all 400ms linear;     -moz-transition: all 400ms linear;     transition: all 400ms linear;     width: 100%;     height: 100%;     position: absolute;     top: 0;     left: 0;     overflow: hidden;     border-radius: 10px;     background: #DDD; }     .jp-card .jp-card-front:before, .jp-card .jp-card-back:before {       content: " ";       display: block;       position: absolute;       width: 100%;       height: 100%;       top: 0;       left: 0;       opacity: 0;       border-radius: 10px;       -webkit-transition: all 400ms ease;       -moz-transition: all 400ms ease;       transition: all 400ms ease; }     .jp-card .jp-card-front:after, .jp-card .jp-card-back:after {       content: " ";       display: block; }     .jp-card .jp-card-front .jp-card-display, .jp-card .jp-card-back .jp-card-display {       color: white;       font-weight: normal;       opacity: 0.5;       -webkit-transition: opacity 400ms linear;       -moz-transition: opacity 400ms linear;       transition: opacity 400ms linear; }       .jp-card .jp-card-front .jp-card-display.jp-card-focused, .jp-card .jp-card-back .jp-card-display.jp-card-focused {         opacity: 1;         font-weight: 700; }     .jp-card .jp-card-front .jp-card-cvc, .jp-card .jp-card-back .jp-card-cvc {       font-family: "Bitstream Vera Sans Mono", Consolas, Courier, monospace;       font-size: 14px; }     .jp-card .jp-card-front .jp-card-shiny, .jp-card .jp-card-back .jp-card-shiny {       width: 50px;       height: 35px;       border-radius: 5px;       background: #CCC;       position: relative; }       .jp-card .jp-card-front .jp-card-shiny:before, .jp-card .jp-card-back .jp-card-shiny:before {         content: " ";         display: block;         width: 70%;         height: 60%;         border-top-right-radius: 5px;         border-bottom-right-radius: 5px;         background: #d9d9d9;         position: absolute;         top: 20%; }   .jp-card .jp-card-front .jp-card-logo {     position: absolute;     opacity: 0;     right: 5%;     top: 8%;     -webkit-transition: 400ms;     -moz-transition: 400ms;     transition: 400ms; }   .jp-card .jp-card-front .jp-card-lower {     width: 80%;     position: absolute;     left: 10%;     bottom: 30px; }     @media only screen and (max-width: 480px) {       .jp-card .jp-card-front .jp-card-lower {         width: 90%;         left: 5%; } }     .jp-card .jp-card-front .jp-card-lower .jp-card-cvc {       visibility: hidden;       float: right;       position: relative;       bottom: 5px; }     .jp-card .jp-card-front .jp-card-lower .jp-card-number {       font-family: "Bitstream Vera Sans Mono", Consolas, Courier, monospace;       font-size: 24px;       clear: both;       margin-bottom: 30px; }     .jp-card .jp-card-front .jp-card-lower .jp-card-expiry {       font-family: "Bitstream Vera Sans Mono", Consolas, Courier, monospace;       letter-spacing: 0em;       position: relative;       float: right;       width: 25%; }       .jp-card .jp-card-front .jp-card-lower .jp-card-expiry:before, .jp-card .jp-card-front .jp-card-lower .jp-card-expiry:after {         font-family: "Helvetica Neue";         font-weight: bold;         font-size: 7px;         white-space: pre;         display: block;         opacity: .5; }       .jp-card .jp-card-front .jp-card-lower .jp-card-expiry:before {         content: attr(data-before);         margin-bottom: 2px;         font-size: 7px;         text-transform: uppercase; }       .jp-card .jp-card-front .jp-card-lower .jp-card-expiry:after {         position: absolute;         content: attr(data-after);         text-align: right;         right: 100%;         margin-right: 5px;         margin-top: 2px;         bottom: 0; }     .jp-card .jp-card-front .jp-card-lower .jp-card-name {       text-transform: uppercase;       font-family: "Bitstream Vera Sans Mono", Consolas, Courier, monospace;       font-size: 20px;       max-height: 45px;       position: absolute;       bottom: 0;       width: 190px;       display: -webkit-box;       -webkit-line-clamp: 2;       -webkit-box-orient: horizontal;       overflow: hidden;       text-overflow: ellipsis; }   .jp-card .jp-card-back {     -webkit-transform: rotateY(180deg);     -moz-transform: rotateY(180deg);     -ms-transform: rotateY(180deg);     -o-transform: rotateY(180deg);     transform: rotateY(180deg); }     .jp-card .jp-card-back .jp-card-bar {       background-color: #444;       background-image: -webkit-linear-gradient(#444, #333);       background-image: linear-gradient(#444, #333);       width: 100%;       height: 20%;       position: absolute;       top: 10%; }     .jp-card .jp-card-back:after {       content: " ";       display: block;       background-color: #FFF;       background-image: -webkit-linear-gradient(#FFF, #FFF);       background-image: linear-gradient(#FFF, #FFF);       width: 80%;       height: 16%;       position: absolute;       top: 40%;       left: 2%; }     .jp-card .jp-card-back .jp-card-cvc {       position: absolute;       top: 40%;       left: 85%;       -webkit-transition-delay: 600ms;       -moz-transition-delay: 600ms;       transition-delay: 600ms; }     .jp-card .jp-card-back .jp-card-shiny {       position: absolute;       top: 66%;       left: 2%; }       .jp-card .jp-card-back .jp-card-shiny:after {         content: "This card has been issued by Jesse Pollak and is licensed for anyone to use anywhere for free.\AIt comes with no warranty.\A For support issues, please visit: github.com/jessepollak/card.";         position: absolute;         left: 120%;         top: 5%;         color: white;         font-size: 7px;         width: 230px;         opacity: .5; }   .jp-card.jp-card-identified {     box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); }     .jp-card.jp-card-identified .jp-card-front, .jp-card.jp-card-identified .jp-card-back {       background-color: #000;       background-color: rgba(0, 0, 0, 0.5); }       .jp-card.jp-card-identified .jp-card-front:before, .jp-card.jp-card-identified .jp-card-back:before {         -webkit-transition: all 400ms ease;         -moz-transition: all 400ms ease;         transition: all 400ms ease;         background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 90% 20%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 15% 80%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), -webkit-linear-gradient(-245deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%);         background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 90% 20%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-radial-gradient(circle at 15% 80%, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), linear-gradient(-25deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%);         opacity: 1; }       .jp-card.jp-card-identified .jp-card-front .jp-card-logo, .jp-card.jp-card-identified .jp-card-back .jp-card-logo {         box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3); }     .jp-card.jp-card-identified.no-radial-gradient .jp-card-front:before, .jp-card.jp-card-identified.no-radial-gradient .jp-card-back:before {       background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), -webkit-linear-gradient(-245deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%);       background-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.03) 4px), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), repeating-linear-gradient(210deg, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.05) 4px), linear-gradient(-25deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0) 90%); } ');;
		}, {
			"sassify": 6
		}]
	}, {}, [9])(9)
});
/* jshint ignore:end */

