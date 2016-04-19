angular.module('app', [
  'ngSanitize',
  'ngMessageFormat',
  'ngMaterial',
  'ui.router',
  'app/app',
  'app/common',
  'app/info',
  'app/restaurants'
])

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});