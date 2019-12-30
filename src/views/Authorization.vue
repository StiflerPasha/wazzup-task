<template>
  <div>
    <authorization
      :error=error
      :pending="pending"
      :successRegister="successRegister"
      :successRecover="successRecover"
      @auth="make_auth"
      @register="make_register"
      @password="recover_password"
    >
    </authorization>
  </div>
</template>

<script>
  import authorization from 'main_components/authorization/index.vue'
  export default {
    data: () => ({
      error: false,
      pending: false,
      successRegister: false,
      successRecover: false
    }),
    components: {
      authorization
    },
    methods: {
      make_auth (authData) {
        this.toNull()
        if (this.pending === false) {
          this.pending = true
          this.$store.dispatch('auth/make_auth', authData)
            .then(() => {
              this.pending = false
              this.error = false
            })
            .catch(error => {
              this.pending = false
              this.error = error.error
            })
        }
      },
      make_register (registerData) {
        this.toNull()
        if (this.pending === false) {
          this.pending = true
          this.$store.dispatch('backend/register_new_user', registerData)
            .then(() => {
              this.pending = false
              this.error = false
              this.successRegister = true
            })
            .catch(error => {
              this.pending = false
              this.error = error.error
            })
        }
      },
      recover_password (recoverData) {
        this.toNull()
        if (this.pending === false) {
          this.pending = true
          this.$store.dispatch('backend/password_recover', recoverData)
            .then(() => {
              this.pending = false
              this.error = false
              this.successRecover = true
            })
            .catch(error => {
              this.pending = false
              this.error = error.status === 404 ? this.$t('__old__.login_email_not_found') : error.errors[0]
            })
        }
      },
      toNull () {
        this.successRecover = false
        this.successRegister = false
      }
    }
  }
</script>

<style>

</style>
