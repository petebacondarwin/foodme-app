angular.module('shopping-cart-component', ['shopping-cart-service', 'alert'])

.component('fmShoppingCart', {
  templateUrl: 'src/common/shopping-cart/shopping-cart.template.html',
  controller: FmShoppingCart
});

function FmShoppingCart(shoppingCart, alert) {
  this.cart = shoppingCart;

  this.items = function() {
    return this.cart.items;
  };

  this.restaurant = function() {
    return this.cart.restaurant;
  };
}
FmShoppingCart.$inject = ['shoppingCart', 'alert']


FmShoppingCart.prototype.add = function(choice, restaurant) {
  if ( !this.cart.restaurant.id ) {
    this.cart.restaurant = restaurant;
  }

  if ( this.cart.restaurant.id !== restaurant.id ) {
    alert('You cannot mix items from different restaurant - clear the shopping cart first.');
    return;
  }

  angular.forEach(this.cart.items, function(item) {
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

FmShoppingCart.prototype.remove = function(cartItem) {
  var index = this.cart.items.indexOf(cartItem);
  if ( index !== -1 ) {
    this.cart.items.splice(index, 1);
  }

  if (this.cart.items.length === 0) {
    this.cart.restaurant = {};
  }
};

FmShoppingCart.prototype.total = function() {
  var sum = 0;
  angular.forEach(this.cart.items, function(item) {
    sum += Number(item.price * item.amount);
  });
  return sum;
};

this.reset = function() {
  this.cart.items = [];
  this.cart.restaurant = {};
};
