angular.module('common/rating-component', [])

.component('fmRating', {
  bindings: {
    label: '@',
    glyph: '@',
    rating: '<',
    onSelect: '&'
  },
  controller: FmRating,
  template:
    '<div class="form-group">' +
      '<label for="priceFilter" class="control-label">{{$ctrl.label}}</label> ' +
      '<ul class="fm-rating">' +
      '  <li ng-repeat="value in $ctrl.ratings" ng-click="$ctrl.select(value)" ' +
      '      ng-class="{selected: $ctrl.isSelected(value)}">' +
      '    <span class="glyphicon glyphicon-{{$ctrl.glyph}}"></span>' +
      '  </li>' +
      '</ul>' +
      '<a ng-click="$ctrl.select(null)">clear</a>' +
    '</div>'
});

function FmRating() {}
FmRating.prototype.$onInit = function() {
  this.ratings = [1,2,3,4,5];
};

FmRating.prototype.select = function(value) {
  this.rating = value;
  this.onSelect({value: value});
};
FmRating.prototype.isSelected = function(value) {
  return this.rating >= value;
};
