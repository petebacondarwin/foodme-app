angular.module('common/panel', [])

.component('fmPanel', {
  transclude: {
    heading: 'fmHeading',
    content: 'fmContent'
  },
  templateUrl: 'src/common/panel/panel.template.html'
});