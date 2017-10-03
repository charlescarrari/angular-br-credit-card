import angular from 'angular';
import angular_br_credit_card from '../credit-card/credit-card.module';

angular.module("myShoppingList", [angular_br_credit_card]).controller("myCtrl", function ($scope) {
    console.log('dasnduasi');
    setInterval(()=>{
        console.log(this);
    },1000);
});