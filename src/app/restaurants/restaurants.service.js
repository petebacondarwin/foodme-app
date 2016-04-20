angular.module('app/restaurants/restaurant-service', [])

.factory('restaurantService', function($http) {
  // var url = 'https://foodme.firebaseio.com/.json'; // CORS enabled server
  var url = 'assets/data/restaurants.json'; // Local webserver

  var promise;

  return {
    load: function() {
      if (!promise) {
        promise = $http.get(url).then(function(response) {
          return response.data;
        });
      }
      return promise;
    }
  };
});