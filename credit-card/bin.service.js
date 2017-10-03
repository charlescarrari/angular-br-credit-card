'use strict';

binService.$inject = ['$q', '$http'];

/////////

export default function binService($q, $http) {
	var api = 'https://api.mundipagg.com/bin/v1';
	var service = {
		getBrandsByBIN: _getBrandsByBIN
	};

	return service;

	//////////////

	function _getBrandsByBIN(bin) {
		var deferred = $q.defer();

		$http.get(api + '/' + bin)
			.then(function (response) {
				deferred.resolve(response);
			})
			.catch(function (response) {
				deferred.reject(response);
			});

		return deferred.promise;
	}
}