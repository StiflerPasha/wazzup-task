<template>
  <!-- <b-col lg="9" :class="{ -->
    <!-- 'col-xl-10': true -->
    <!-- }" style="padding: 0;"> -->
    <div class="wz-content" :class="{ 'toggle': $DEVICE <= 2 }">
      <div class="main-content container-fluid">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  <!-- </b-col> -->
</template>

<script>
  export default {
    data: () => ({}),
    computed: {
      panels () {
        return this.$store.getters['backend/panels']
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../assets/scss/variables';
  .wz-content {
    position: relative;
    left: 0;
    transition: all .3s;
    margin-left: $sidebar_width;
    min-height: 100%;
    .main-content {
      padding: 25px;
    }
    &.toggle {
      margin-left: 0;
    }
  }

  .container-fluid {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    width: 100%;
  }
</style>
