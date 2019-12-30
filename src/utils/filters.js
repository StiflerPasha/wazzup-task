import Vue from 'vue'

Vue.filter('accountIdFormat', function (string) {
  if (!string) return

  return string.toString().substr(0, 4) + '-' + string.toString().substr(-4)
})
