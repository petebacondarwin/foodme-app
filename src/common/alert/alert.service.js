angular.module('common/alert', [])

.factory('alert', function() {
  return window.alert;
});