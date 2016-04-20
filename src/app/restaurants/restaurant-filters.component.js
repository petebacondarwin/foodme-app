angular.module('app/restaurants/restaurant-filters', [
  'common/rating-component'
])


.component('fmRestaurantFilters', {
  templateUrl: 'src/app/restaurants/restaurant-filters.template.html',
  bindings: {
    filters: '<',
    filtersChange: '&'
  },
  controller: FmRestaurantFilters
});


function FmRestaurantFilters() {
}
FmRestaurantFilters.prototype.$onChanges = function(changes) {
  this.price = this.filters.price;
  this.rating = this.filters.rating;
};
FmRestaurantFilters.prototype.filterBy = function(filter, value) {
  this.filtersChange({filter: filter, value: value});
};