angular.module('app/restaurants/restaurant-list', [
  'app/restaurants/restaurant-service',
  'app/restaurants/restaurant-filters'
])

.component('fmRestaurantList', {
  templateUrl: 'src/app/restaurants/restaurant-list.template.html',
  controller: RestaurantList
});

function RestaurantList(restaurantService) {
  this.restaurantService = restaurantService;
  this.sortProperty = 'name';
  this.sortDirection = false;
  this.filters = {
    price: null,
    rating: null
  };
}

RestaurantList.prototype.$onInit = function() {
  var _this = this;
  this.restaurantService.load().then(function(restaurants) {
    _this.restaurants = restaurants;
    _this.filterRestaurants();
  });
};



RestaurantList.prototype.sortBy = function(property) {
  if ( this.sortProperty === property ) {
    this.sortDirection = !this.sortDirection;
  } else {
    this.sortProperty = property;
    this.sortDirection = false;
  }
};

RestaurantList.prototype.getSortClass = function(property) {
  if ( this.sortProperty === property ) {
    return 'glyphicon glyphicon-chevron-' + (this.sortDirection ? 'down' : 'up');
  }
};

RestaurantList.prototype.filterBy = function(field, value) {
  this.filters[field] = value;
  this.filterRestaurants();
};

RestaurantList.prototype.filterRestaurants = function() {
  var _this = this;
  this.filteredRestaurants = [];
  this.restaurants.forEach(function(restaurant) {
    if ( ( !_this.filters.rating || restaurant.rating >= _this.filters.rating ) &&
          ( !_this.filters.price || restaurant.price <= _this.filters.price ) ) {
      _this.filteredRestaurants.push(restaurant);
    }
  });
};