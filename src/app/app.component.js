angular.module('app/app', [
  'app/toolbar',
  'app/restaurants/restaurant-list',
  'app/restaurants/restaurant-detail',
  'app/info/how-it-works',
  'app/info/who-we-are',
  'app/info/help'
])

.config(function($stateProvider) {
  $stateProvider
    .state('restaurants', {
      url: '/',
      template: '<fm-restaurant-list></fm-restaurant-list>'
    })
    .state('restaurant-detail', {
      url: '/restaurants/:id',
      template: '<fm-restaurant-detail></fm-restaurant-detail>'
    })
    .state('how-it-works', {
      url: '/how-it-works',
      template: '<fm-how-it-works></fm-how-it-works>'
    })
    .state('who-we-are', {
      url: '/who-we-are',
      template: '<fm-who-we-are></fm-who-we-are>'
    })
    .state('help', {
      url: '/help',
      template: '<fm-help></fm-help>'
    })
})

.component('app', {
  templateUrl: 'src/app/app.template.html'
});