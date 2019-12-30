<template>
    <div class="alert-position" :class="{'mobile-alert-pos': $DEVICE < 3}">
      <template>
        <b-alert
          :key="index"
          size="lg"
          :class="{'mobile-alert': $DEVICE < 3}"
          v-for="(alert, index) in alerts"
          :show="alert.active"
          :variant="alert.type"
          dismissible
          fade
        >
          {{ alert.text }}
          <b-link v-if="alert.link" :href="alert.link">{{ $t(`common.press_here`) }}</b-link>
        </b-alert>
      </template>
    </div>
</template>

<script>
  export default {
    data: () => ({
      alerts: []
    }),
    methods: {
      push (data) {
        const toPush = data

        toPush.active = true
        this.alerts.push(toPush)
        const index = this.alerts.length - 1
        //        setTimeout(() => {
        //          const selfIndex = index
        //          const selfOvbject = Object.assign({}, this.alerts[selfIndex], { active: true })
        //          this.$set(this.alerts, selfIndex, selfOvbject)
        //        }, 500)

        setTimeout(() => {
          const selfIndex = index
          const selfOvbject = Object.assign({}, this.alerts[selfIndex], { active: false })
          this.$set(this.alerts, selfIndex, selfOvbject)
        }, toPush.duration || 5000)
      }
    }
  }
</script>

<style scoped="" lang="scss">
  .alert-position {
    position: fixed;
    top: 90px;
    right: 29px;
    z-index: 10000;
    font-size: 1.4rem;
  }
  .mobile-alert-pos {
    bottom: 0;
    top: inherit;
    z-index: 2000000000;
    width: 100%;
    left: 0;
  }
  .mobile-alert {
    top: inherit;
    /* bottom: 40px; */
    margin-bottom: 0;
    width: 100%;
  }

</style>
