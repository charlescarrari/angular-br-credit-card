import angular from 'angular';
import angular_br_credit_card from '../credit-card/credit-card.module';

angular.module("myShoppingList", [angular_br_credit_card]).controller("myCtrl", function ($scope) {
    setInterval(function (){
        console.log(this);
    },1000);
});