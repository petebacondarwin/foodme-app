angular.module('app/restaurants/restaurant-detail', [
  'app/restaurants/restaurant-service',
  'app/restaurants/menu',
  'app/customer/customer-widget',
  'app/order/order-widget',
  'app/order/current-order'
])

.component('fmRestaurantDetail', {
  templateUrl: 'src/app/restaurants/restaurant-detail.template.html',
  controller: FmRestaurantDetail
});

function FmRestaurantDetail(restaurantService, $state, currentOrder) {
  this.restaurantService = restaurantService;
  this.$state = $state;
  this.order = currentOrder;
}

FmRestaurantDetail.prototype.$onInit = function() {
  var _this = this;
  var restaurantId = this.$state.params.id;
  this.restaurantService.loadOne(restaurantId).then(function(restaurant) {
    _this.restaurant = restaurant;
    if (!_this.restaurant) {
      console.log('missing restaurant', restaurantId);
      $location.path('/');
    }
  });
};

FmRestaurantDetail.prototype.addToOrder = function(item) {
  this.order.addToOrder(this.restaurant, item);
};