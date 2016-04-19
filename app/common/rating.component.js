angular.module('app/common/rating-component', [])

.component('fmRating', {
  bindings: {
    label: '@',
    glyph: '@',
    rating: '<',
    onSelect: '&'
  },
  controller: function() {
    this.ratings = [1,2,3,4,5];
    this.select = function(value) {
      this.rating = value;
      this.onSelect({value: value});
    };
    this.isSelected = function(value) {
      return this.rating >= value;
    };
  },

  template:
    '<div>{{$ctrl.label}} ' +
    '<ul class="fm-rating">' +
    '  <li ng-repeat="value in $ctrl.ratings" ng-click="$ctrl.select(value)" ' +
    '      ng-class="{selected: $ctrl.isSelected(value)}">' +
    '    <span class="glyphicon glyphicon-{{$ctrl.glyph}}"></span>' +
    '  </li>' +
    '</ul>' +
    '<a ng-click="$ctrl.select(null)">clear</a>' +
    '</div>'
});