<template>
  <div>
    <div class="message-box">
      <h1 class="mb-4">WAZZUP</h1>
      <div class="message-box-white">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      message: ''
    }),
    computed: {
      type () {
        return this.$route.params.type
      }
    },
    created () {
      if (this.type === 'internal-error') {
        this.message = '500'
      }
    }
  }
</script>

<style scoped>
  .message-box {
    max-width: 300px;
    text-align: center;
    margin: 170px auto;
  }
  .message-box-white {
    background-color: #fff;
    padding: 20px
  }
</style>
