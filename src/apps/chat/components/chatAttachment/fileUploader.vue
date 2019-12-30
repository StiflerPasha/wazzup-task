<template>
    <div class="hidden-uploader">
      <input type="file" ref="uploader" @change="onFileChange" :multiple="$DEVICE > 3">
    </div>
</template>

<script>
  import mixin from './fileUploadMixin'
  export default {
    mixins: [mixin]
  }
</script>

<style>
  .hidden-uploader {
    display: none
  }
</style>
