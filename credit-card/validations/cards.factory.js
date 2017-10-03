Card.$inject = ['binService','$q'];

export default function Card(binService,$q) {
	var identifiedCard;
	var defaultCard = {
		'brand': 'default',
		'brandName': 'default',
		'gaps': [4, 8, 12],
		'lenghts': [16],
		'mask': '/(\\d{1,4})/g',
		'input': '/(?:^|s)(d{4})$/',
		'cvv': 3,
		'originBin': ''
	};

	var _identify = function(bin) {
		_clearBrand();
		return $q(function(resolve, reject) { //jshint ignore: line
			binService.getBrandsByBIN(bin).then(function(res) {
				identifiedCard = res.data;
				identifiedCard.originBin = bin;
				_setBrandInCard(identifiedCard.brand);
				resolve();
			}).catch(function(error) {
				identifiedCard = null;
				reject('Erro ao identificar o cartão');
			});
		});
	};

	function _clearBrand() {
		var card = document.getElementsByClassName('jp-card')[0];
		card.classList.remove('jp-card-identified');
		card.classList.add('jp-card', 'jp-card-unknown');

		var elements = document.querySelectorAll('.jp-card-front > .jp-card-logo'), i;

		for (i = 0; i < elements.length; ++i) {
			elements[i].parentElement.removeChild(elements[i]);
		}

		identifiedCard = null;
	}

	function _setBrandInCard(brand) {
		var newEl = document.createElement('div');
		newEl.classList.add('jp-card-logo');
		newEl.classList.add('brand');
		newEl.classList.add('brand-' + brand);
		document.querySelectorAll('.jp-card-front')[0].appendChild(newEl);
	}

	function _getCard() {
		return identifiedCard || defaultCard;
	}

	return {
		identify: _identify,
		getCard: _getCard,
		clearBrand: _clearBrand,
	};

};