<template>
    <div style="display: flex">
      <i id="chat-attach"
         @mouseover="popoverShow = true"
         @mouseout="popoverShow = false"
         @click="fileLoadingPageEmit"
         class="icon mdi mdi-attachment"></i>
      <!--<b-popover target="chat-attach"-->
                 <!--placement="topright"-->
                 <!--:show="popoverShow"-->
                 <!--@shown="popoverShow = true"-->
      <!--&gt;-->
        <!--<div class="chat-textfield-popover" @mouseover="popoverShow = true" @mouseleave="popoverShow = false">-->
          <!--<b-list-group>-->
            <!--<b-list-group-item @click="fileLoadingPageEmit"><i class="icon mdi mdi-file-image"></i>Фотография</b-list-group-item>-->
            <!--<b-list-group-item><i class="icon mdi mdi-file-video"></i>Видео</b-list-group-item>-->
            <!--<b-list-group-item><i class="icon mdi mdi-file"></i>Файл</b-list-group-item>-->
          <!--</b-list-group>-->
        <!--</div>-->
      <!--</b-popover>-->
      <file-uploader ref="uploader" @files="showLoadedFiles"></file-uploader>
    </div>
</template>

<script>
  import fileUploader from '../chatAttachment/fileUploader.vue'
  export default {
    data: () => ({
      popoverShow: false
    }),
    components: {
      fileUploader
    },
    methods: {
      fileLoadingPageEmit () {
        this.popoverShow = false
        this.$refs.uploader.$refs.uploader.click()
      },
      showLoadedFiles (files) {
        this.$emit('files', files)
      }
    }
  }
</script>

<style>

</style>
