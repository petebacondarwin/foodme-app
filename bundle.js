angular.module('app/app', ['app/toolbar', 'app/restaurants/restaurant-list', 'app/restaurants/restaurant-detail', 'app/info/how-it-works', 'app/info/who-we-are', 'app/info/help']).config(function ($stateProvider) {
  $stateProvider.state('restaurants', {
    url: '/',
    template: '<fm-restaurant-list></fm-restaurant-list>'
  }).state('restaurant-detail', {
    url: '/restaurants/:id',
    template: '<fm-restaurant-detail></fm-restaurant-detail>'
  }).state('how-it-works', {
    url: '/how-it-works',
    template: '<fm-how-it-works></fm-how-it-works>'
  }).state('who-we-are', {
    url: '/who-we-are',
    template: '<fm-who-we-are></fm-who-we-are>'
  }).state('help', {
    url: '/help',
    template: '<fm-help></fm-help>'
  });
}).component('app', {
  templateUrl: 'src/app/app.template.html'
});
angular.module('app/customer/customer-widget', ['app/customer/delivery-info', 'app/customer/user-form', 'app/customer/user-service']).component('fmCustomerWidget', {
  templateUrl: 'src/app/customer/customer-widget.template.html',
  controller: FmCustomerWidget
});

function FmCustomerWidget(userService) {
  this.userService = userService;
}

FmCustomerWidget.prototype.$onInit = function () {
  this.user = this.userService.get();
};

FmCustomerWidget.prototype.saveUser = function (user) {
  this.userService.save(user);
  this.user = user;
  this.isEditing = false;
};
FmCustomerWidget.prototype.editUser = function () {
  this.isEditing = true;
};
angular.module('app/customer/delivery-info', []).component('fmDeliveryInfo', {
  bindings: {
    user: '<',
    onEditUser: '&'
  },
  templateUrl: 'src/app/customer/delivery-info.template.html'
});
angular.module('app/customer/user-form', []).component('fmUserForm', {
  templateUrl: 'src/app/customer/user-form.template.html',
  bindings: {
    user: '<',
    onSave: '&'
  },
  controller: FmUserForm
});

function FmUserForm() {}
FmUserForm.prototype.$onChanges = function (changes) {
  if (changes.user) {
    // Clone the user object to prevent modifying the outer object
    this.user = angular.copy(this.user);
  }
};
FmUserForm.prototype.save = function () {
  this.onSave({ user: this.user });
};
angular.module('app/customer/user-service', ['common/local-storage']).factory('userService', function (localStorage) {
  var _key = 'foodMe/user';
  var _user = JSON.parse(localStorage[_key] || '{}');
  return {
    get: function () {
      return _user;
    },
    save: function (user) {
      _user = user;
      localStorage[_key] = JSON.stringify(_user || {});
    }
  };
});
angular.module('app/info/help', ['common/panel']).component('fmHelp', {
  templateUrl: 'src/app/info/help.template.html'
});
angular.module('app/info/how-it-works', []).component('fmHowItWorks', {
  templateUrl: 'src/app/info/how-it-works.template.html'
});
angular.module('app/info/who-we-are', []).component('fmWhoWeAre', {
  templateUrl: 'src/app/info/who-we-are.template.html'
});
angular.module('app/order/current-order', ['common/local-storage', 'common/alert']).service('currentOrder', CurrentOrder);

function CurrentOrder(localStorage, alert) {
  this.localStorage = localStorage;
  this._key = 'foodme/order';
  this._loadOrder();
}

CurrentOrder.prototype.addToOrder = function (restaurant, item) {
  if (!this.restaurant) {
    this.restaurant = restaurant.id;
  }

  if (this.restaurant !== restaurant.id) {
    alert('You cannot mix items from different restaurant - clear the shopping cart first.');
    return;
  }

  var i;
  for (i = 0; i < this.items.length; i++) {
    var orderItem = this.items[i];
    if (item && item.name === orderItem.name) {
      orderItem.amount += 1;
      break;
    }
  }

  if (i === this.items.length) {
    this.items.push({
      name: item.name,
      price: item.price,
      amount: 1
    });
  }

  this._saveOrder();
};

CurrentOrder.prototype.removeFromOrder = function (item) {
  var index = this.items.indexOf(item);
  if (index !== -1) {
    this.items.splice(index, 1);
  }
  if (this.items.length === 0) {
    this.restaurant = null;
  }
  this._saveOrder();
};

CurrentOrder.prototype._loadOrder = function () {
  var order = JSON.parse(this.localStorage[this._key] || '{}');
  this.restaurant = order.restaurant;
  this.items = order.items;
  this._computeTotal();
};

CurrentOrder.prototype._saveOrder = function () {
  this._computeTotal();
  this.localStorage[this._key] = JSON.stringify({
    restaurant: this.restaurant,
    items: this.items
  });
};

CurrentOrder.prototype._computeTotal = function () {
  var sum = 0;
  angular.forEach(this.items, function (item) {
    sum += Number(item.price * item.amount);
  });
  this.total = sum;
};
angular.module('app/order/order-widget', ['app/order/current-order', 'app/restaurants/restaurant-service']).component('fmOrderWidget', {
  templateUrl: 'src/app/order/order-widget.template.html',
  controller: FmOrderWidget
});

function FmOrderWidget(currentOrder, restaurantService) {
  this.order = currentOrder;
  this.restaurantService = restaurantService;
}

FmOrderWidget.prototype.$onInit = function () {
  var _this = this;
  this.restaurantService.load().then(function (restaurants) {
    _this.restaurants = restaurants;
  });
};

FmOrderWidget.prototype.getRestaurant = function () {
  return this.restaurants && this.restaurants[this.order.restaurant];
};
angular.module('app/restaurants/menu', []).component('fmMenu', {
  bindings: {
    'restaurant': '<',
    'onChooseItem': '&'
  },
  templateUrl: 'src/app/restaurants/menu.template.html'
});
angular.module('app/restaurants/restaurant-detail', ['app/restaurants/restaurant-service', 'app/restaurants/menu', 'app/customer/customer-widget', 'app/order/order-widget', 'app/order/current-order']).component('fmRestaurantDetail', {
  templateUrl: 'src/app/restaurants/restaurant-detail.template.html',
  controller: FmRestaurantDetail
});

function FmRestaurantDetail(restaurantService, $state, currentOrder) {
  this.restaurantService = restaurantService;
  this.$state = $state;
  this.order = currentOrder;
}

FmRestaurantDetail.prototype.$onInit = function () {
  var _this = this;
  var restaurantId = this.$state.params.id;
  this.restaurantService.loadOne(restaurantId).then(function (restaurant) {
    _this.restaurant = restaurant;
    if (!_this.restaurant) {
      console.log('missing restaurant', restaurantId);
      $location.path('/');
    }
  });
};

FmRestaurantDetail.prototype.addToOrder = function (item) {
  this.order.addToOrder(this.restaurant, item);
};
angular.module('app/restaurants/restaurant-filters', ['common/rating-component']).component('fmRestaurantFilters', {
  templateUrl: 'src/app/restaurants/restaurant-filters.template.html',
  bindings: {
    filters: '<',
    filtersChange: '&'
  },
  controller: FmRestaurantFilters
});

function FmRestaurantFilters() {}
FmRestaurantFilters.prototype.$onChanges = function (changes) {
  this.price = this.filters.price;
  this.rating = this.filters.rating;
};
FmRestaurantFilters.prototype.filterBy = function (filter, value) {
  this.filtersChange({ filter: filter, value: value });
};
angular.module('app/restaurants/restaurant-list', ['app/restaurants/restaurant-service', 'app/restaurants/restaurant-filters', 'app/customer/customer-widget', 'common/sort-header']).component('fmRestaurantList', {
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

RestaurantList.prototype.$onInit = function () {
  var _this = this;
  this.restaurantService.load().then(function (restaurants) {
    _this.restaurants = restaurants;
    _this.filterRestaurants();
  });
};

RestaurantList.prototype.sortBy = function (property) {
  if (this.sortProperty === property) {
    this.sortDirection = !this.sortDirection;
  } else {
    this.sortProperty = property;
    this.sortDirection = false;
  }
};

RestaurantList.prototype.getSortClass = function (property) {
  if (this.sortProperty === property) {
    return 'glyphicon glyphicon-chevron-' + (this.sortDirection ? 'down' : 'up');
  }
};

RestaurantList.prototype.filterBy = function (field, value) {
  this.filters[field] = value;
  this.filterRestaurants();
};

RestaurantList.prototype.filterRestaurants = function () {
  var _this = this;
  this.filteredRestaurants = [];
  this.restaurants.forEach(function (restaurant) {
    if ((!_this.filters.rating || restaurant.rating >= _this.filters.rating) && (!_this.filters.price || restaurant.price <= _this.filters.price)) {
      _this.filteredRestaurants.push(restaurant);
    }
  });
};
angular.module('app/restaurants/restaurant-service', []).factory('restaurantService', function ($http) {
  // var url = 'https://foodme.firebaseio.com/.json'; // CORS enabled server
  var url = 'assets/data/restaurants.json'; // Local webserver

  var promise;

  var service = {

    load: function () {
      if (!promise) {
        promise = $http.get(url).then(function (response) {
          return response.data;
        });
      }
      return promise;
    },

    loadOne: function (id) {
      return service.load().then(function (restaurants) {
        for (var i = 0; i < restaurants.length; i++) {
          if (restaurants[i].id == id) {
            return restaurants[i];
          }
        }
      });
    }
  };

  return service;
});
angular.module('app/toolbar', []).component('fmToolbar', {
  templateUrl: 'src/app/toolbar/toolbar.template.html'
});
angular.module('common/alert', []).factory('alert', function () {
  return window.alert;
});
angular.module('common/checkbox-list', []);
angular.module('common', ['common/alert', 'common/checkbox-list', 'common/local-storage', 'common/panel', 'common/rating', 'common/shopping-cart']);
angular.module('common/local-storage', []).value('localStorage', window.localStorage);
angular.module('common/panel', []).component('fmPanel', {
  transclude: {
    heading: 'fmHeading',
    content: 'fmContent'
  },
  templateUrl: 'src/common/panel/panel.template.html'
});
angular.module('common/rating', ['common/rating-component', 'common/rating-filter']);
angular.module('common/rating-component', []).component('fmRating', {
  bindings: {
    label: '@',
    glyph: '@',
    rating: '<',
    onSelect: '&'
  },
  controller: FmRating,
  template: '<div class="form-group">' + '<label for="priceFilter" class="control-label">{{$ctrl.label}}</label> ' + '<ul class="fm-rating">' + '  <li ng-repeat="value in $ctrl.ratings" ng-click="$ctrl.select(value)" ' + '      ng-class="{selected: $ctrl.isSelected(value)}">' + '    <span class="glyphicon glyphicon-{{$ctrl.glyph}}"></span>' + '  </li>' + '</ul>' + '<a ng-click="$ctrl.select(null)">clear</a>' + '</div>'
});

function FmRating() {}
FmRating.prototype.$onInit = function () {
  this.ratings = [1, 2, 3, 4, 5];
};

FmRating.prototype.select = function (value) {
  this.rating = value;
  this.onSelect({ value: value });
};
FmRating.prototype.isSelected = function (value) {
  return this.rating >= value;
};
angular.module('common/rating-filter', []).filter('rating', function () {
  return function (value, symbol) {
    var output = "";
    while (value > 0) {
      output += symbol;
      value -= 1;
    }
    return output;
  };
});
angular.module('common/shopping-cart', []);
angular.module('shopping-cart-component', ['shopping-cart-service', 'alert']).component('fmShoppingCart', {
  templateUrl: 'src/common/shopping-cart/shopping-cart.template.html',
  controller: FmShoppingCart
});

function FmShoppingCart(shoppingCart, alert) {
  this.cart = shoppingCart;

  this.items = function () {
    return this.cart.items;
  };

  this.restaurant = function () {
    return this.cart.restaurant;
  };
}
FmShoppingCart.$inject = ['shoppingCart', 'alert'];

FmShoppingCart.prototype.add = function (choice, restaurant) {
  if (!this.cart.restaurant.id) {
    this.cart.restaurant = restaurant;
  }

  if (this.cart.restaurant.id !== restaurant.id) {
    alert('You cannot mix items from different restaurant - clear the shopping cart first.');
    return;
  }

  angular.forEach(this.cart.items, function (item) {
    if (choice && choice.name === item.name) {
      item.amount += 1;
      choice = null;
    }
  });

  if (choice) {
    this.cart.items.push({
      name: choice.name,
      price: choice.price,
      amount: 1
    });
  }
};

FmShoppingCart.prototype.remove = function (cartItem) {
  var index = this.cart.items.indexOf(cartItem);
  if (index !== -1) {
    this.cart.items.splice(index, 1);
  }

  if (this.cart.items.length === 0) {
    this.cart.restaurant = {};
  }
};

FmShoppingCart.prototype.total = function () {
  var sum = 0;
  angular.forEach(this.cart.items, function (item) {
    sum += Number(item.price * item.amount);
  });
  return sum;
};

this.reset = function () {
  this.cart.items = [];
  this.cart.restaurant = {};
};
angular.module('shopping-cart-service', ['local-storage-binding']).factory('shoppingCart', ['localStorageBinding', function (localStorageBinding) {
  return localStorageBinding('fmShoppingCart', {
    items: [],
    restaurant: {}
  });
}]);
angular.module('common/sort-header', []).component('fmSortHeader', {
  transclude: true,
  bindings: {
    label: '@',
    sort: '<',
    descending: '<',
    onChange: '&'
  },
  templateUrl: 'src/common/sort-header/sort-header.template.html'
});
angular.module('foodme', ['ngAnimate', 'ngSanitize', 'ngMessages', 'ngMessageFormat', 'ui.router', 'common', 'app/app']).config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});

//# sourceMappingURL=bundle.js.map