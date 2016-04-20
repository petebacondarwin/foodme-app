angular.module('app/app', []).config(function ($stateProvider) {
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
angular.module('app', ['ngSanitize', 'ngMessageFormat', 'ui.router', 'common', 'app/app', 'app/info', 'app/restaurants']).config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});
angular.module('app/info/help', ['common/panel']).component('fmHelp', {
  templateUrl: 'src/app/info/help.template.html'
});
angular.module('app/info/how-it-works', []).component('fmHowItWorks', {
  templateUrl: 'src/app/info/how-it-works.template.html'
});
angular.module('app/info', ['app/info/how-it-works', 'app/info/who-we-are', 'app/info/help']);
angular.module('app/info/who-we-are', []).component('fmWhoWeAre', {
  templateUrl: 'src/app/info/who-we-are.template.html'
});
angular.module('app/restaurants', ['app/restaurants/restaurant-list', 'app/restaurants/restaurant-detail']);
angular.module('app/restaurants/restaurant-detail', ['app/restaurants/restaurant-service']).component('fmRestaurantDetail', {
  templateUrl: 'src/app/restaurants/restaurant-detail.template.html',
  controller: FmRestaurantDetail
});

function FmRestaurantDetail(restaurantService, $state) {
  this.restaurantService = restaurantService;
  this.$state = $state;
}

FmRestaurantDetail.prototype.$onInit = function () {
  var _this = this;
  var restaurantId = this.$state.params.id;
  this.restaurantService.load().then(function (restaurants) {
    for (var i = 0; i < restaurants.length; i++) {
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
angular.module('app/restaurants/restaurant-list', ['app/restaurants/restaurant-service', 'app/restaurants/restaurant-filters']).component('fmRestaurantList', {
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

  return {
    load: function () {
      if (!promise) {
        promise = $http.get(url).then(function (response) {
          return response.data;
        });
      }
      return promise;
    }
  };
});
angular.module('common/alert', []);
angular.module('common/checkbox-list', []);
angular.module('common', ['common/alert', 'common/checkbox-list', 'common/panel', 'common/rating', 'common/shopping-cart', 'common/toolbar']);
angular.module('local-storage-binding', ['local-storage']).factory('localStorageBinding', ['localStorage', '$rootScope', function (localStorage, $rootScope) {
  return function (key, defaultValue) {
    defaultValue = JSON.stringify(defaultValue || {});

    var value = JSON.parse(localStorage[key] || defaultValue);

    $rootScope.$watch(function () {
      return value;
    }, function () {
      localStorage[key] = JSON.stringify(value);
    }, true);

    return value;
  };
}]);
angular.module('local-storage', []).value('localStorage', window.localStorage);
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
angular.module('common/toolbar', []).component('fmToolbar', {
  templateUrl: 'src/common/toolbar/toolbar.template.html'
});

//# sourceMappingURL=bundle.js.map