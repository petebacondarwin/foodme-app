angular.module('common/sort-header', [])

.component('fmSortHeader', {
  transclude: true,
  bindings: {
    label: '@',
    sort: '<',
    descending: '<',
    onChange: '&'
  },
  templateUrl: 'src/common/sort-header/sort-header.template.html'
});
