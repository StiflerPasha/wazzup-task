<template>
  <div class="my-4">
    <canvas id="referralsPieChart" width="200" height="150"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'ReferralsPieChart',
    props: {
      data: {
        type: Object,
        requred: true
      },
      options: {
        type: Object,
        default: () => ({
          legend: {
            position: 'bottom'
          }
        })
      }
    },
    watch: {
      data: {
        handler (value) {
          if (value.labels.length) {
            this.initChart()
          }
        }
      }
    },
    methods: {
      initChart () {
        this.$waitForScript('chart.js', () => {
          const { options, data } = this
          const ctx = document.getElementById('referralsPieChart').getContext('2d')
          const referralsPieChart = new Chart(ctx, { type: 'doughnut', data, options }) // eslint-disable-line
        })
      }
    }
  }
</script>
