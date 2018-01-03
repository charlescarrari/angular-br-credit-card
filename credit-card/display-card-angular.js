
  'use strict';
  
  var displayModule = angular.module('mundipagg.angularjs-credit-card-display',[]);

  displayModule.controller('CardCtrl', ['$scope', function ($scope) {
  }])

  displayModule.directive('card', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        cardContainer: '@', // required
        width: '@',
        placeholders: '=',
        options: '=',
        messages: '=',
      },
      controller: 'CardCtrl',
      link: function (scope, element, attributes, cardCtrl) {
        var defaultPlaceholders = {
          number: '•••• •••• •••• ••••',
          name: 'Nome no cartão',
          expiry: '••/••',
          cvc: '•••'
        };
        var defaultMessages = {
          validDate: 'válido\naté',
          monthYear: 'mês/ano',
        };
        var defaultOptions = {
          debug: false,
          formatting: true
        };

        var placeholders = angular.extend(defaultPlaceholders, scope.placeholders);
        var messages = angular.extend(defaultMessages, scope.messages);
        var options = angular.extend(defaultOptions, scope.options);

        var opts = {
          form: '[name="' + attributes.name + '"]',

          // a selector or jQuery object for the container
          // where you want the card to appear
          container: scope.cardContainer, // *required*

          formSelectors: {},

          formElements: {},

          width: options.width,

          // Strings for translation - optional
          messages: {
            validDate: messages.validDate,
            monthYear: messages.monthYear
          },

          // Default placeholders for rendered fields - options
          placeholders: {
            number: placeholders.number,
            name: placeholders.name,
            expiry: placeholders.expiry,
            cvc: placeholders.cvc
          },

          formatting: options.formatting, // optional - default true
          debug: options.debug // if true, will log helpful messages for setting up Card
        };

        opts.width = opts.width || scope.width || 350;

        if (cardCtrl.numberInput && cardCtrl.numberInput.length > 0) {
          opts.formSelectors.numberInput = 'input[name="' + cardCtrl.numberInput[0].name + '"]';
          opts.formElements.numberInput = cardCtrl.numberInput[0];
        }
        if (angular.isDefined(cardCtrl.expiryInput.combined)) {
            opts.formSelectors.expiryInput = 'input[name="' + cardCtrl.expiryInput.combined[0].name + '"]';
            opts.formElements.expiryInput = cardCtrl.expiryInput.combined[0];
        } else if (angular.isDefined(cardCtrl.expiryInput.month) && angular.isDefined(cardCtrl.expiryInput.year)) {
            opts.formSelectors.expiryInput = 'input[name="' + cardCtrl.expiryInput.month[0].name + '"], input[name="' + cardCtrl.expiryInput.year[0].name + '"]';
            opts.formElements.expiryInput = cardCtrl.expiryInput.month[0].name + '"], input[name="' + cardCtrl.expiryInput.year[0];
        }
        if (cardCtrl.cvcInput && cardCtrl.cvcInput.length > 0) {
          opts.formSelectors.cvcInput = 'input[name="' + cardCtrl.cvcInput[0].name + '"]';
          opts.formElements.cvcInput = cardCtrl.cvcInput[0];
        }
        if (cardCtrl.nameInput && cardCtrl.nameInput.length > 0) {
          opts.formSelectors.nameInput = 'input[name="' + cardCtrl.nameInput[0].name + '"]';
          opts.formElements.nameInput = cardCtrl.nameInput[0];
        }

        //Don't initialize card until angular has had a chance to update the DOM with any interpolated bindings
        $timeout()
            .then(function () {
              new window.Card(opts); //jshint ignore: line
            });
      }
    };
  }])

  displayModule.directive('cardNumber', [function () {
    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      require: [
        '^card',
        'ngModel'
      ],
      link: function (scope, element, attributes, ctrls) {
        var cardCtrl = ctrls[0];
        cardCtrl.numberInput = element;
        scope.$watch('ngModel', function (newVal, oldVal) {
          if (!oldVal && !newVal) {
            return;
          }
          if (oldVal === newVal && !newVal) {
            return;
          }

          var evt = document.createEvent('HTMLEvents');
          evt.initEvent('keyup', false, true);
          element[0].dispatchEvent(evt);
        });
      }
    };
  }])

  displayModule.directive('cardName', [function () {
    return {
      restrict: 'A',
      require: [
        '^card',
      ],
      link: function (scope, element, attributes, ctrls) {
        var cardCtrl = ctrls[0];
        cardCtrl.nameInput = element;
        scope.$watch(attributes.ngModel, function (newVal, oldVal) {
          if(!scope.$$phase) {
            if (!oldVal && !newVal) {
              return;
            }
            if (oldVal === newVal && !newVal) {
              return;
            }

            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('keyup', false, true);
            element[0].dispatchEvent(evt);
          }
        });
      }
    };
  }])

  displayModule.directive('cardExpiry', [function () {
    return {
      restrict: 'A',
      scope: {
        ngModel: '=',
        type: '@cardExpiry'
      },
      require: [
        '^card',
        'ngModel'
      ],
      link: function (scope, element, attributes, ctrls) {
        var cardCtrl = ctrls[0];
        var expiryType = scope.type || 'combined';
        if (angular.isUndefined(cardCtrl.expiryInput)) {
            cardCtrl.expiryInput = {};
        }
        cardCtrl.expiryInput[expiryType] = element;
        scope.$watch('ngModel', function (newVal, oldVal) {
          if (!oldVal && !newVal) {
            return;
          }
          if (oldVal === newVal && !newVal) {
            return;
          }

          var evt = document.createEvent('HTMLEvents');
          evt.initEvent('keyup', false, true);
          element[0].dispatchEvent(evt);
        });
      }
    };
  }])

  displayModule.directive('cardCvc', [function () {
    return {
      restrict: 'A',
      require: [
        '^card',
      ],
      link: function(scope, element, attributes, ctrls) {
      	var cardCtrl = ctrls[0];
      	cardCtrl.cvcInput = element;
      	scope.$watch(attributes.ngModel, function(newVal, oldVal) {
      		if (!scope.$$phase) {
      			if (!oldVal && !newVal) {
      				return;
      			}
      			if (oldVal === newVal && !newVal) {
      				return;
      			}

      			var evt = document.createEvent('HTMLEvents');
      			evt.initEvent('keyup', false, true);
      			element[0].dispatchEvent(evt);
      		}
      	});
      }
      };
  }]);

  export default displayModule.name;
