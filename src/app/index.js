angular.module('app', [
  'ngSanitize',
  'ngMessageFormat',
  'ui.router',
  'common',
  'app/app',
  'app/info',
  'app/restaurants'
])

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});