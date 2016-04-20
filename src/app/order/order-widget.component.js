angular.module('app/order/order-widget', [
  'app/order/current-order',
  'app/restaurants/restaurant-service'
])

.component('fmOrderWidget', {
  templateUrl: 'src/app/order/order-widget.template.html',
  controller: FmOrderWidget
});

function FmOrderWidget(currentOrder, restaurantService) {
  this.order = currentOrder;
  this.restaurantService = restaurantService;
}

FmOrderWidget.prototype.$onInit = function() {
  var _this = this;
  this.restaurantService.load().then(function(restaurants) {
    _this.restaurants = restaurants;
  });
};

FmOrderWidget.prototype.getRestaurant = function() {
  return this.restaurants && this.restaurants[this.order.restaurant];
};