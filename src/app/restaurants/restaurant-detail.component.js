angular.module('app/restaurants/restaurant-detail', [
  'app/restaurants/restaurant-service'
])

.component('fmRestaurantDetail', {
  templateUrl: 'src/app/restaurants/restaurant-detail.template.html',
  controller: FmRestaurantDetail
});

function FmRestaurantDetail(restaurantService, $state) {
  this.restaurantService = restaurantService;
  this.$state = $state;
}

FmRestaurantDetail.prototype.$onInit = function() {
  var _this = this;
  var restaurantId = this.$state.params.id;
  this.restaurantService.load().then(function(restaurants) {
    for(var i=0; i<restaurants.length; i++) {
      if (restaurants[i].id == restaurantId) {
        _this.restaurant = restaurants[i];
        break;
      }
    }
    if (!_this.restaurant) {
      console.log('missing restaurant', restaurantId);
      $location.path('/');
    }
  });
};