<template>
    <div ref="auth" class="authorization" :class="{'separate-input': mode === 'register'}">
      <form v-if="mode !== 'successRegister' && mode !== 'successRecover'"  @submit.prevent="btn_action" class="authorization__container">
        <h1 class="mb-4"><img src="/static/wazzup_logo.png" style="max-width: 200px;"/></h1>
        <!--<h3 class="h3 mb-3 font-weight-normal">Авторизуйтесь</h3>-->
        <b-form-select v-model="$translations.locale" :options="$translations.list" class="mb-3"/>
        <div role="group" class="authorization__input">
          <b-form-input
            id="inputEmail"
                        tabindex="1"
                        v-model.trim="email"
                        type="text"
                        :state="emailState"
                        aria-describedby="inputEmailFeedback"
                        :placeholder="`${$t(`__old__.enter_your_email`)}*`"/>
          <b-form-invalid-feedback v-if="emailErrorText" id="inputEmailFeedback" style="margin-top: 1rem; margin-bottom: 1rem">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            {{ emailErrorText }}
          </b-form-invalid-feedback>
          <b-form-input
            v-if="mode === 'auth'"
            id="inputLive"
                        v-model.trim="password"
                        type="password"
                        tabindex="2"
                        :state="passwordState"
                        aria-describedby="inputLiveFeedback"
                        :placeholder="`${$t(`auth.enter_your_password`)}*`"/>
          <b-form-invalid-feedback v-if="passwordState !== null"  id="inputLiveFeedback" style="margin: 1rem 0">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            {{ loginErrorText }}
          </b-form-invalid-feedback>
          <template v-if="mode === 'register'">
            <!--<b-form-input-->
              <!--id="inputLivePassword"-->
              <!--v-model.trim="passwordAgain"-->
              <!--type="password"-->
              <!--tabindex="3"-->
              <!--:state="passwordAgainState"-->
              <!--aria-describedby="inputLivePassword"-->
              <!--:placeholder="`${$t(`auth.enter_your_password_again`)}*`"></b-form-input>-->
            <!--<b-form-invalid-feedback v-if="passwordAgainState !== null" id="inputLivePasswordFeedback" style="margin-top: 1rem; margin-bottom: 1rem">--><!-- eslint-disable-line max-len -->
              <!--&lt;!&ndash; This will only be shown if the preceeding input has an invalid state &ndash;&gt;-->
              <!--{{ $t(`auth.passwords_no_match`) }}-->
            <!--</b-form-invalid-feedback>-->
            <b-input-group>
              <b-form-input
                style="margin-bottom: 0"
                id="inputPromo"
                v-model.trim="promocode"
                type="text"
                tabindex="4"
                :state="promocodeState"
                aria-describedby="inputPromoFeedback"
                :placeholder="$t(`__old__.enter_your_promocode`)"/>
              <b-input-group-append id="promocode">
                <b-btn :disabled="promoPending" @click="get_promocode" tabindex="5" variant="outline-success">
                  <template v-if="promoPending">
                    <preloader size="mini" style="margin: 2px 0 -4px; min-width: 75px"/>
                  </template>
                  <template v-else>
                    {{ $t(`auth.make_some_wizzard`) }}
                  </template>
                </b-btn>
              </b-input-group-append>
              <b-tooltip show variant="success" target="promocode" :placement="'right'">
                {{ promocodeFromButton ? $t('auth.free_promocode', {promocode: promocode}) : $t(`__old__.promocode_tooltip_text`) }}
              </b-tooltip>
              <b-form-invalid-feedback id="inputPromoFeedback" style="margin-top: 1rem">
                <!-- This will only be shown if the preceeding input has an invalid state -->
                {{ $t(`__old__.can_not_make_promocode`) }}
              </b-form-invalid-feedback>
            </b-input-group>
          </template>
          <div v-if="globalErrorText" style="text-align: center; margin: 1rem 0; color: #dc3545">
            {{ globalErrorText }}
          </div>
        </div>
        <div v-if="mode === 'register'" class="mt-4">
          {{ $t(`__old__.policy_1`) }} <a :href="$t(`__old__.policy_url`)" target="_blank">{{ $t(`__old__.policy_2`) }}</a>
        </div>
        <b-button :disabled="pending" type="submit" tabindex="6" variant="success" size="lg" class="authorization__button">
          <template v-if="pending">
            <preloader size="mini" color="white" style="margin: 2px 0 -4px;"/>
          </template>
          <template v-else>
            {{ buttonText }}
          </template>
        </b-button>
        <div class="authorization__helpers mt-3">
          <a tabindex="7" @click="firstHelper">{{ firstHelperText }}</a>
          <a tabindex="8" @click="secondHelper">{{ secondHelperText }}</a>
        </div>
      </form>
      <div v-else-if="mode === 'successRegister'" class="authorization__container">
        <h1 class="mb-4">WAZZUP</h1>
        <div style="background-color: #fff; padding: 10px; border-radius: 4px; font-size: 1.3rem">
          {{ $t(`__old__.register_message_1`) }}<br><br>{{ email }}<br><br>{{ $t(`__old__.register_message_2`) }}<br><br>
        </div>
        <b-btn @click="mode = 'auth'" tabindex="1" variant="success" class="mt-3" size="lg" style="width: 100%">
          {{ $t(`common.okey`) }}
        </b-btn>
      </div>
      <div v-else class="authorization__container">
        <h1 class="mb-4">WAZZUP</h1>
        <div style="background-color: #fff; padding: 10px; border-radius: 4px; font-size: 1.3rem">
          {{ $t(`__old__.password_recover_message`) }}<br>{{ email }}
        </div>
        <b-btn @click="mode = 'auth'" tabindex="1" variant="success" class="mt-3" size="lg" style="width: 100%">
          {{ $t(`common.okey`) }}
        </b-btn>
      </div>
    </div>
</template>

<script>
  import ls from 'local-storage'
  export default {
    data: () => ({
      email: '',
      emailState: null,
      password: '',
      passwordState: null,
      passwordAgain: '',
      passwordAgainState: null,
      promocode: '',
      promocodeState: null,
      mode: 'auth',
      loginErrorText: '',
      emailErrorText: '',
      promoPending: false,
      globalErrorText: '',
      promocodeFromButtonText: '',
      path: ''
    }),
    computed: {
      buttonText () {
        return this.mode === 'auth' ? this.$t(`__old__.enter`) : this.mode === 'forgot' ? this.$t(`auth.remind_password`) : this.$t(`__old__.to_register`)
      },
      firstHelperText () {
        return this.mode !== 'forgot' ? this.$t(`auth.remind_password`) : this.$t(`__old__.enterence`)
      },
      secondHelperText () {
        return this.mode === 'register' ? this.$t(`__old__.enterence`) : this.$t(`__old__.register`)
      },
      promocodeFromButton () {
        return this.promocode !== '' && this.promocode === this.promocodeFromButtonText
      }
    },
    props: ['error', 'pending', 'successRegister', 'successRecover'],
    watch: {
      error () {
        this.clearErrors()
        if (this.error) {
          // TODO: временное решение, переделать
          if (typeof this.error === 'string') {
            this.emailState = false
            this.passwordState = false
            this.loginErrorText = this.error
          } else if (this.error.status === 403) {
            this.emailState = false
            this.passwordState = false
            this.loginErrorText = this.$t(`__old__.email_not_confirmed`)
          }
          if (this.error.status === 401) {
            if (this.error.data.backend && this.error.data.backend.indexOf('User password wrong') >= 0) {
              this.passwordState = false
              this.loginErrorText = this.$t(`__old__.invalid_login_password`)
            }
            if (this.error.data.backend && this.error.data.backend.indexOf('User not found') >= 0) {
              this.emailState = false
              this.emailErrorText = this.$t(`__old__.invalid_login_email`)
            }
          } else if (this.error.data && this.error.data.backend && this.error.data.backend.indexOf('User is exist') >= 0) {
            this.mode = 'auth'
            this.$nextTick(function () {
              this.emailState = false
              this.emailErrorText = this.$t(`__old__.email_is_not_unique`)
            })
          } else if (this.error.data && this.error.data.email && this.error.data.email.indexOf('Email is not a valid email') >= 0) {
            this.emailState = false
            this.emailErrorText = this.$t(`__old__.invalid_email`)
          } else if (this.error.data && this.error.data.backend && this.error.data.backend.indexOf('Email not confirmed') >= 0) {
            this.emailState = false
            this.emailErrorText = this.$t(`__old__.email_not_confirmed`)
          } else if (this.error.data) {
            this.globalErrorText = `${this.$t(`errors.common.something_wrong`)}`
          }
        }
      },
      mode (n) {
        this.clearErrors()
        if (n === 'auth') {
          this.$router.push('/login')
        }
        if (n === 'forgot') {
          this.$router.push('/restore')
        }
        if (n === 'register') {
          this.$router.push('/signup')
        }
        if (n === 'successRegister') {
          this.$router.push('/signup-success')
        }
      },
      successRegister (n) {
        if (n === true) {
          this.mode = 'successRegister'
        }
      },
      successRecover (n) {
        if (n === true) {
          this.mode = 'successRecover'
        }
      },
      '$mq.resize' () {
        this.$refs.auth.style.height = window.innerHeight - 80 + 'px'
      },
      'email' () {
        this.clearErrors()
      },
      password () {
        this.clearErrors()
      }
    },
    methods: {
      firstHelper () {
        if (this.mode === 'auth') {
          this.mode = 'forgot'
        } else if (this.mode === 'register') {
          this.mode = 'forgot'
        } else if (this.mode === 'forgot') {
          this.mode = 'auth'
        }
      },
      secondHelper () {
        if (this.mode === 'auth') {
          this.mode = 'register'
        } else if (this.mode === 'register') {
          this.mode = 'auth'
        } else if (this.mode === 'forgot') {
          this.mode = 'register'
        }
      },
      btn_action () {
        this.clearErrors()
        if (!this.email) {
          this.emailState = false
          this.emailErrorText = this.$t(`__old__.email_enter_error`)
        }
        if (this.email) {
          if (this.mode === 'auth') {
            if (!this.password) {
              this.passwordState = false
              this.loginErrorText = this.$t(`__old__.password_enter_error`)
            }
            if (this.password) {
              this.$emit('auth', {
                login: this.email.toLowerCase(),
                password: this.password
              })
              // TODO: убрать ls вообще из бандла
              ls.set('wz_loged_before', true)
            }
          } else if (this.mode === 'register') {
            this.register()
          } else {
            this.forgot_password()
          }
        }
      },
      clearErrors () {
        this.globalErrorText = ''
        this.loginErrorText = ''
        this.emailErrorText = ''
        this.emailState = null
        this.passwordState = null
        this.passwordAgainState = null
      },
      get_promocode () {
        if (this.promoPending === false) {
          this.promoPending = true
          this.$store.dispatch('backend/get_promocode')
            .then(promocode => {
              this.promoPending = false
              this.promocode = promocode.data.code
              this.promocodeFromButtonText = promocode.data.code
            })
            .catch(e => {
              this.promoPending = false
              this.promocodeState = false
            })
        }
      },
      register () {
        this.clearErrors()
        //        if (this.password !== this.passwordAgain) {
        //          this.passwordAgainState = false
        //          this.passwordState = false
        //        } else
        //      else if (!this.password) {
        //          this.passwordState = false
        //          this.loginErrorText = this.$t(`validators.empty_field`)
        //        }
        if (!this.email) {
          this.emailState = false
          this.emailErrorText = this.$t(`validators.empty_field`)
        } else {
          this.$emit('register', {
            email: this.email.toLowerCase(),
            promo: this.promocode
          })
        }
      },
      forgot_password () {
        if (!this.email) {
          this.emailState = false
          this.emailErrorText = this.$t(`validators.empty_field`)
        } else {
          this.$emit('password', {
            email: this.email.toLowerCase()
          })
        }
      }
    },
    mounted () {
      if (this.mode === 'auth') {
        this.path = this.$route.path
        this.$router.push('/login')
      }
      document.body.className = document.body.className.concat('body_auth')
      this.$refs.auth.style.height = window.innerHeight - 80 + 'px'
    },
    beforeMount () {
      if (this.$route.params[0] === 'signup') {
        this.mode = 'register'
      }
      if (this.$route.params[0] === 'restore') {
        this.mode = 'forgot'
      }
      if (this.$route.params[0] === 'signup-success') {
        this.mode = 'successRegister'
        this.email = this.$route.query.email || ''
      }
      const logedBefore = ls.get('wz_loged_before', false) // TODO: вот оно место, определяющее какую страницу показывать signup или login
      console.log(logedBefore)
      if (!logedBefore) {
        this.mode = 'register'
      }
    },
    destroyed () {
      if (this.path !== '/login' && this.path) {
        this.$router.push(this.path)
      } else {
        this.$router.push('/')
      }
      document.body.classList.remove('body_auth')
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
        font-size: 1rem !important;
        cursor: pointer;
        text-decoration: underline;
        color: #007bff !important;
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
