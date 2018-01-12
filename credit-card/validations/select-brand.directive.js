cardSelectBrand.$inject = ['$window', '_Format', 'Cards', '$parse']; //directive
export default function cardSelectBrand($window, _Format, Cards, $parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            elem[0].addEventListener('change',function (event){
                console.log(Cards.getIdentifiedBrand());
                if(Cards.getIdentifiedBrand() !== 'default' && ngModel.$modelValue !== Cards.getIdentifiedBrand()){
                    Cards.setWarningState(scope,attr,'manualMode');
                }else{
                    Cards.setWarningState(scope,attr,'off');
                }
            });
        }
    };
};