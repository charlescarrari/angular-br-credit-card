# Angular br credit card

Angular credit card module with validations for brazillian brands

## Installing 

```cmd
    npm install --save https://github.com/Boomx/angular-br-credit-card.git
```

### Requirements

- Angular 1.x

### Usage

* Set in your app

```javascript
    import angular_br_credit_card from '../credit-card/credit-card.module';
    // or import mundipaggCreditCardModule from 'mundipagg-credit-card';

    angular.module("myShoppingList", [angular_br_credit_card]).controller("myCtrl", function ($scope) {});
```

```html
        <div id="card-container"></div>
        <card name="cardForm" data-card data-width="200" data-ng-form="cardForm" data-card-container="#card-container">
            number 
            <input 
                name="card_number"
                card-number 
                required
                data-ng-model="myCtrl.number" 
                data-payments-format="card" 
                data-payments-validate="card"
                data-payments-type-model="myCtrl.brand"
                >
            <br>
            name 
            <input 
                name="card_name" 
                required
                card-name 
                data-ng-model="myCtrl.name"
                >
            <br>
            expiry mm/yy
            <input 
                name="card_expiry" 
                required
                card-expiry 
                required
                data-ng-model="myCtrl.expiry" 
                payments-format="expiry"
                payments-validate="expiry"
                >
            <br>
            cvc
            <input 
                name="card_cvc" 
                required
                card-cvc
                data-ng-model="myCtrl.cvc" 
                payments-format="cvc"
                payments-validate="cvc"
                >
        </card>
```


## Inspirations

* [Angular-payments](https://github.com/laurihy/angular-payments) - Module that provides AngularJS-directives for formatting, validating and working with payments
* [angular-card](https://github.com/gavruk/angular-card) - Angular directive for card https://github.com/jessepollak/card

## Authors

* **Denilson Rodrigues** - *Initial work* - [Denilson](https://github.com/Boomx)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
