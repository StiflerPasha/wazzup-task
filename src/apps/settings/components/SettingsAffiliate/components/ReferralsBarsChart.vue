<template>
  <div class="my-4" style="overflow-x: scroll">
    <div :style="`width: ${canvasWidth}px; height: 180px;`">
      <canvas id="ReferralsBarsChart"></canvas>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ReferralsBarsChart',
    props: {
      data: {
        type: Object,
        requred: true
      },
      options: {
        type: Object,
        default: () => ({
          maintainAspectRatio: false,
          // responsive: true,
          scales: {
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                stepSize: 1,
                minRotation: 4
              }
            }]
          },
          legend: {
            display: false
            // fullWidth: false,
            // reverse: true,
            // position: 'bottom',
            // labels: {
            //   padding: 20
            // }
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
    computed: {
      canvasWidth () {
        const size = this.data.labels.length
        const min = size < 4 ? 4 : size
        const width = min * 50
        return width
      }
    },
    methods: {
      initChart () {
        this.$waitForScript('chart.js', () => {
          const { options, data } = this
          const ctx = document.getElementById('ReferralsBarsChart').getContext('2d')
          ctx.canvas.height = 150
          const referralsPieChart = new Chart(ctx, { type: 'bar', data, options }) // eslint-disable-line
        })
      }
    }
  }
</script>
