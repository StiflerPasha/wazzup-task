<template>
  <b-button
    @click="$emit('onShowAddModal')"
    class="pull-right"
    size="md"
    variant="success"
  >
    {{ $t(`bookmarks_locale.add_bookmark`) }}
  </b-button>
</template>

<script>
  export default {}
</script>

<style lang='scss' scoped>

</style>
