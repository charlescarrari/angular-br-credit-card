Card.$inject = ['binService','$q', '$parse'];

export default function Card(binService,$q, $parse) {
	var identifiedCard;
	var defaultCard = {
		'brand': 'default',
		'brandName': 'default',
		'gaps': [4, 8, 12, 16],
		'lenghts': [14,15,16,19],
		'mask': '/(\\d{1,4})/g',
		'input': '/(?:^|s)(d{4})$/',
		'cvv': 3,
		'originBin': ''
	};

	var _warningState = 'off';

	var _identify = function(bin) {
		_clearBrandDisplay();
		return $q(function(resolve, reject) { //jshint ignore: line
			binService.getBrandsByBIN(bin).then(function(res) {
				identifiedCard = res.data.brands[0];
				identifiedCard.brand = res.data.brands[0].key;
				identifiedCard.brandName = res.data.brands[0].name;
				identifiedCard.originBin = bin;
				identifiedCard.usingAPICard = true;
				_setBrandInCardDisplay(identifiedCard.brand);
				resolve();
			}).catch(function(error) {
				identifiedCard.originBin = bin;
				identifiedCard.usingAPICard = false;
				reject('Erro ao identificar o cartão');
			});
		});
	};

	function _clearBrand(scope,attr) {
		_clearBrandDisplay();
		if (attr && attr.paymentsTypeModel && scope) {
			var typeModel = $parse(attr.paymentsTypeModel);
			typeModel.assign(scope, null);
		}
		_setWarningState(scope,attr,'off');
		identifiedCard = defaultCard;
		identifiedCard.usingAPICard = false;
	}

	function _clearBrandDisplay(){
		var card = document.getElementsByClassName('jp-card')[0];
		if(card){
			card.classList.remove('jp-card-identified');
			card.classList.add('jp-card', 'jp-card-unknown');

			var elements = document.querySelectorAll('.jp-card-front > .jp-card-logo'), i;

			for (i = 0; i < elements.length; ++i) {
				elements[i].parentElement.removeChild(elements[i]);
			}
		}
	}

	function _setBrandInCardDisplay(brand) {
		_clearBrandDisplay();
		if(brand){
			var newEl = document.createElement('div');
			newEl.classList.add('jp-card-logo');
			newEl.classList.add('brand');
			newEl.classList.add('brand-' + brand);
			if(document.querySelectorAll('.jp-card-front')[0])
				document.querySelectorAll('.jp-card-front')[0].appendChild(newEl);
		}
	}

	function _getCard() {
		return identifiedCard.usingAPICard ? identifiedCard : defaultCard;
	}

	function _getWarningState(){
		return _warningState;
	}

	function _getIdentifiedBrand(){
		return identifiedCard.brand;
	}

	function _setWarningState(scope,attr,newState){
		_warningState = newState;
		if (attr.paymentsManualModeModel) $parse(attr.paymentsManualModeModel).assign(scope, _warningState);
		if(!scope.$$phase) {
			scope.$apply();
		}
	}

	return {
		identify: _identify,
		getCard: _getCard,
		getIdentifiedBrand: _getIdentifiedBrand,
		clearBrand: _clearBrand,
		setBrandInCard: _setBrandInCardDisplay,
		getWarningState: _getWarningState,
		setWarningState: _setWarningState
	};

};