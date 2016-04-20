angular.module('foodme', [
  'ngAnimate',
  'ngSanitize',
  'ngMessages',
  'ngMessageFormat',
  'ui.router',
  'common',
  'app/app'
])

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});