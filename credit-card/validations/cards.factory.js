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

	var _manualMode =  false;

	var _identify = function(bin) {
		_clearBrand();
		return $q(function(resolve, reject) { //jshint ignore: line
			binService.getBrandsByBIN(bin).then(function(res) {
				identifiedCard = res.data;
				identifiedCard.originBin = bin;
				_setBrandInCard(identifiedCard.brand);
				resolve();
			}).catch(function(error) {
				identifiedCard = defaultCard;
				identifiedCard.originBin = bin;
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
		_manualMode = false;
		identifiedCard = defaultCard;
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

	function _setBrandInCard(brand) {
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
		return identifiedCard || defaultCard;
	}

	return {
		identify: _identify,
		getCard: _getCard,
		clearBrand: _clearBrand,
		setBrandInCard: _setBrandInCard,
		manualMode:  _manualMode
	};

};