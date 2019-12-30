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
      },
      event () {
        return this.$route.params.event
      }
    },
    created () {
      if (this.type === 'emailTokens') {
        if (this.event === 'invalid') {
          this.message = 'Сообщение invalid'
        }
        if (this.event === 'used') {
          this.message = 'Сообщение used'
        }
        if (this.event === 'expired') {
          this.message = 'Сообщение expired'
        }
        if (this.event === 'email-changed') {
          this.message = 'Сообщение email-changed'
        }
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
