<template>
    <div>
      <input @focus="show()" @blur="hide()" type="text" ref="input" class="invisible_input">
      <i @mousedown.prevent="open()" class="icon mdi mdi-sticker-emoji" style="border-radius: 0"></i>
      <div @mousedown.prevent="open()" v-show="open_state" style="position: absolute; bottom: 40px; z-index: 3;">
        <picker @select="add_emoji" title="WAZZUP" emoji="heart"></picker>
      </div>
    </div>
</template>

<script>
  import { Picker } from 'emoji-mart-vue'
  export default {
    data: () => ({
      open_state: false
    }),
    methods: {
      open () {
        this.$refs.input.focus()
      },
      show () {
        this.open_state = true
      },
      hide () {
        this.open_state = false
      },
      add_emoji (emoji) {
        this.$emit('add_emoji', emoji)
      }
    },
    components: {
      Picker
    }
  }
</script>

<style>
  .invisible_input {
    height: 0;
    width: 0;
    opacity: 0;
    padding: 0;
    position: absolute;
    cursor: default;
  }
</style>
