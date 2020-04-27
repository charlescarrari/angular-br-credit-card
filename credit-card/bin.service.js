'use strict';

binService.$inject = ['$q', '$http'];

/////////

export default function binService($q, $http) {
	var api = 'https://api.mundipagg.com';
	var service = {
		getBrandsByBIN: _getBrandsByBIN
	};

	return service;

	//////////////

	function _getBrandsByBIN(bin) {
		var deferred = $q.defer();
		var body = JSON.stringify({ 'query': 'query UtilitiesQuery { brands (bin:\"' + bin + '\") {key, name, gaps, lenghts, mask, cvv, image, bins } }'})

		$http.post(api + '/utilities/v2/graphql', body)
			.then(function (response) {
				deferred.resolve(response.data);
			})
			.catch(function (response) {
				deferred.reject(response);
			});

		return deferred.promise;
	}
}