<template>
    <div ref="auth" class="authorization separate-input">
      <b-form-select v-model="$translations.locale" :options="$translations.list" class="mb-3"
                     style="position: absolute; right: 10px; top: 10px; max-width: 170px"/>
      <template v-if="event === 'password_recovery'">
        <form v-if="!success" @submit.prevent="btn_action" class="authorization__container">
          <h1 class="mb-4">WAZZUP</h1>
          <!--<h3 class="h3 mb-3 font-weight-normal">Авторизуйтесь</h3>-->
          <div role="group" class="authorization__input">
            <b-form-input
              id="inputLive"
              v-model.trim="password"
              type="password"
              tabindex="2"
              :state="passwordState"
              aria-describedby="inputLiveFeedback"
              :placeholder="`${$t(`auth.enter_your_password`)}*`"></b-form-input>
              <b-form-input
                id="inputLivePassword"
                v-model.trim="passwordAgain"
                type="password"
                tabindex="3"
                :state="passwordAgainState"
                aria-describedby="inputLivePassword"
                :placeholder="`${$t(`auth.enter_your_password_again`)}*`"></b-form-input>
              <div v-if="globalErrorText" style="text-align: center; margin: 1rem 0; color: #dc3545">
                {{ globalErrorText }}
              </div>
          </div>
          <b-button :disabled="pending" type="submit" tabindex="6" variant="success" size="lg" class="authorization__button">
            <template v-if="pending">
              <preloader size="mini" color="white" style="margin: 2px 0 -4px;"></preloader>
            </template>
            <template v-else>
              {{ $t(`auth.remind_password`) }}
            </template>
          </b-button>
        </form>
        <div v-else class="authorization__container">
          <h1 class="mb-4">WAZZUP</h1>
          <div style="background-color: #fff; padding: 10px; border-radius: 4px; font-size: 1.3rem">
            {{ $t(`auth.success_password_change`) }}
          </div>
          <b-btn @click="$router.push('/chat')" tabindex="1" variant="success" class="mt-3" size="lg" style="width: 100%">
            {{ $t(`common.okey`) }}
          </b-btn>
        </div>
      </template>
    </div>
</template>

<script>
  import cookie from 'js-cookie'
  import { createAdapter } from 'main/adapter'
  import jwt from 'jsonwebtoken'

  export default {
    data: () => ({
      pending: false,
      password: '',
      passwordState: null,
      passwordAgain: '',
      passwordAgainState: null,
      globalErrorText: '',
      success: false,
      email: '',
      error: false,
      domain: 'wazzup24.com' // TODO: ну пиздец, опять про дев забыли
    }),
    computed: {
      type () {
        return this.$route.params.type
      },
      event () {
        return this.$route.params.event
      }
    },
    watch: {
      '$mq.resize' () {
        if (this.event === 'password_recovery') {
          this.$refs.auth.style.height = window.innerHeight - 80 + 'px'
        }
      },
      error () {
        this.clearErrors()
        if (this.error) {
          this.globalErrorText = `${this.$t(`errors.common.something_wrong`)}`
        }
      }
    },
    methods: {
      save_tokens_to_ls () {
        if (this.$route.query.accessToken) {
          // Set accessToken from email url
          const { accessToken, refreshToken } = this.$route.query
          if (window.__wz_debug) {
            console.log('Save accessToken for signup:', this.domain, accessToken)
            console.log('Save refreshToken for signup:', this.domain, refreshToken)
          }
          cookie.set('accessToken', accessToken, { domain: `.${this.domain}` })
          cookie.set('refreshToken', refreshToken, { domain: `.${this.domain}` })

          this.$store.commit('auth/SET_AUTH', true)

          const decodedToken = jwt.decode(accessToken)
          this.$store.commit('SET_DAT', decodedToken)
          this.$store.dispatch('backend/get_account_info')
        }
        this.$router.push({
          name: 'chat-main',
          params: {
            app: 'chat'
          }
        })
      },
      btn_action () {
        this.clearErrors()
        if (!this.password) {
          this.passwordState = false
          this.globalErrorText = `${this.$t(`validators.empty_field`)}`
        } else if (this.password !== this.passwordAgain) {
          this.passwordState = false
          this.passwordAgainState = false
          this.globalErrorText = `${this.$t(`auth.passwords_no_match`)}`
        } else if (this.pending === false) {
          this.pending = true
          this.success = true
          this.$store.dispatch('backend/password_change', { email: this.email.toLowerCase(), password: this.password })
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
      clearErrors () {
        this.globalErrorText = ''
        this.loginErrorText = ''
        this.emailErrorText = ''
        this.emailState = null
        this.passwordState = null
        this.passwordAgainState = null
      }
    },
    created () {
      const adapter = createAdapter({}, this.$store, this)
      this.domain = adapter.baseHost

      if (this.type === 'event') {
        if (this.event === 'password_recovery') {
          if (this.$route.query.email && this.$route.query.accessToken) {
            this.email = this.$route.query.email
            if (this.$route.query.accessToken) {
              const { accessToken, refreshToken } = this.$route.query
              cookie.set('accessToken', accessToken, { domain: `.${this.domain}` })
              cookie.set('refreshToken', refreshToken, { domain: `.${this.domain}` })

              this.$store.commit(`auth/SET_AUTH`, true)
            }
          } else {

          }
        }
        if (this.event === 'email_confirmation') {
          this.save_tokens_to_ls()
        }
      }
    },
    mounted () {
      if (this.event === 'password_recovery') {
        document.body.className = document.body.className.concat('body_auth')
        this.$refs.auth.style.height = window.innerHeight - 80 + 'px'
      }
    },
    destroyed () {
      if (this.event === 'password_recovery') {
        document.body.classList.remove('body_auth')
      }
    }
  }
</script>

<style lang="scss">
  .body_auth {
    background-color: #f5f5f5;
  }
  .authorization {
    text-align: center;
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    .authorization__container {
      width: 100%;
      max-width: 330px;
      padding: 15px;
      margin: auto;
    }
    &.separate-input{
      input {
        padding: 10px;
        margin-bottom: 15px;
      }
    }
    &:not(.separate-input) {
      .authorization__input {
        input {
          padding: 10px;
          border-collapse: separate;
          &:nth-child(1) {
            border-radius: 0.25rem 0.25rem 0 0;
          }
          &:nth-child(2) {
            border-top: none;
            border-radius: 0 0 0.25rem 0.25rem;
          }
          &:focus {
            z-index: 2;
            position: relative;
          }
        }
      }
    }
    .authorization__button {
      margin-top: 20px;
      width: 100%
    }
    .authorization__helpers {
      a {
        font-size: 0.8rem;
        cursor: pointer;
        color: black;
        &:focus {
          outline:0
        }
        &:hover {
          /*color: */
        }
        &:nth-child(1) {
          float: left;
        }
        &:nth-child(2) {
          float: right;
        }
      }
    }
  }
</style>
