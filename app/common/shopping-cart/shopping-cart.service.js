angular.module('shopping-cart-service', ['local-storage-binding'])

.factory('shoppingCart', ['localStorageBinding', function(localStorageBinding) {
  return localStorageBinding('fmShoppingCart', {
    items: [],
    restaurant: {}
  });
}])