cardSelectBrand.$inject = ['$window', '_Format', 'Cards', '$parse']; //directive
export default function cardSelectBrand($window, _Format, Cards, $parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            var oldBrand = '';
            elem[0].addEventListener('focus',(event)=>{ 
                oldBrand = ngModel.$modelValue;
            });
            elem[0].addEventListener('change',(event)=>{
                if(oldBrand !== ngModel.$modelValue){
                    Cards.manualMode = true;
                    oldBrand = ngModel.$modelValue;
                    if (attr.paymentsManualModeModel) $parse(attr.paymentsManualModeModel).assign(scope, Cards.manualMode);
                    scope.$apply();
                }
            });
        }
    };
};