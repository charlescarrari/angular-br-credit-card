'use strict';
import binsService from './bin.service'
import Cards from './validations/cards.factory'
import {Validate,ValidateWatch,paymentsValidate} from './validations/validate.factory'
import {Format,paymentsFormat} from './validations/format.factory'
import Common from './validations/common.factory'
import displayModule from './display-card-angular.js'
import cardCode from './card.js'
import cardSelectBrand from './validations/select-brand.directive'

var mainModule = angular.module('mundipagg.angularjs-credit-card', [displayModule])
	.service('binService',binsService)
	.factory('Cards',Cards)
	.factory('_Validate',Validate)
	.factory('_ValidateWatch',ValidateWatch)
	.directive('paymentsValidate',paymentsValidate)
	.factory('_Format',Format)
	.directive('paymentsFormat',paymentsFormat)
	.directive('cardSelectBrand',cardSelectBrand)
	.factory('Common',Common).name;
export default mainModule;
