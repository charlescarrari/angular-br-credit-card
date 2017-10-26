cardSelectBrand.$inject = ['$window', '_Format', 'Cards', '$parse']; //directive
export default function cardSelectBrand($window, _Format, Cards, $parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            var oldBrand = '';
            elem[0].addEventListener('focus',function (event){ 
                oldBrand = ngModel.$modelValue;
            });
            elem[0].addEventListener('change',function (event){
                if(oldBrand !== ngModel.$modelValue){
                    Cards.setWarningState(scope,attr,'manualMode');
                    oldBrand = ngModel.$modelValue;
                }
            });
        }
    };
};