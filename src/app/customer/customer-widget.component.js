angular.module('app/customer/customer-widget', [
  'app/customer/delivery-info',
  'app/customer/user-form',
  'app/customer/user-service'
])

.component('fmCustomerWidget', {
  templateUrl: 'src/app/customer/customer-widget.template.html',
  controller: FmCustomerWidget
});

function FmCustomerWidget(userService) {
  this.userService = userService;
}

FmCustomerWidget.prototype.$onInit = function() {
  this.user = this.userService.get();
};

FmCustomerWidget.prototype.saveUser = function(user) {
  this.userService.save(user);
  this.user = user;
  this.isEditing = false;
};
FmCustomerWidget.prototype.editUser = function() {
  this.isEditing = true;
};