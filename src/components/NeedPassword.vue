<template>
  <b-modal id="needPassword"
           v-model="value"
           hide-footer
           no-close-on-backdrop
           no-close-on-esc
           hide-header-close
           no-fade
           ref="modal"
           class="center-align"
           title="WAZZUP">
    <b-form-select v-model="$translations.locale" :options="$translations.list" class="mb-3"/>
    <template v-if="stage === 0">
      <div class="greeting mb-2">
        {{ $t(`__old__.congrats`) }}
      </div>
      <div class="greeting-small mb-4">
        {{ $t(`__old__.register_1`) }} <br>
        {{ $t(`__old__.register_2`) }}
      </div>
    </template>
    <div class="mb-4">
      <template v-if="!pending">
        <template v-if="stage === 1">
          <label for="inputLive">{{ $t(`auth.enter_your_password`) }}</label>
          <b-input-group class="mb-4">
            <b-form-input
              id="inputLive"
              size="lg"
              v-model.trim="password"
              :type="inputState.type"
              tabindex="2"
              :state="passwordState"></b-form-input>
            <b-input-group-append>
              <b-btn :variant="inputState.variant" @click="showPassword = !showPassword" style="display: flex;">
                <i class="icon mdi"
                   :class="{ 'mdi-eye': inputState.type === 'password', 'mdi-eye-off': inputState.type !== 'password' }"
                   style="font-size: 1.5rem;line-height: 0;align-items: center;"></i>
              </b-btn>
            </b-input-group-append>
          </b-input-group>
          <label for="inputLivePassword">{{ $t(`auth.enter_your_password_again`) }}</label>
          <b-input-group class="mb-3">
            <b-form-input
              id="inputLivePassword"
              v-model.trim="passwordAgain"
              size="lg"
              :type="inputState.type"
              tabindex="3"
              :state="passwordState">
            </b-form-input>
            <b-input-group-append>
              <b-btn :variant="inputState.variant" @click="showPassword = !showPassword" style="display: flex;">
                <i class="icon mdi"
                   :class="{ 'mdi-eye': inputState.type === 'password', 'mdi-eye-off': inputState.type !== 'password' }"
                   style="font-size: 1.5rem;line-height: 0;align-items: center;"></i>
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </template>
        <template v-if="stage === 2">
          <label for="inputLivePassword">{{ $t(`__old__.enter_your_phone`) }}</label>
          <input-phone @phone="handlePhone"></input-phone>
        </template>
        <template v-if="stage === 3">
          <label for="inputLiveSurname">{{ $t(`__old__.surname`) }}</label>
          <b-form-input
            id="inputLiveSurName"
            v-model.trim="surname"
            size="lg"
            tabindex="1">
          </b-form-input>
          <label for="inputLiveName">{{ $t(`__old__.name`) }}</label>
          <b-form-input
            id="inputLiveName"
            v-model.trim="name"
            size="lg"
            tabindex="2">
          </b-form-input>
          <label for="inputLivePatronymic">{{ $t(`__old__.patronymic`) }}</label>
          <b-form-input
            id="inputLivePatronymic"
            v-model.trim="patronymic"
            size="lg"
            tabindex="3">
          </b-form-input>
        </template>
        <b-alert show v-if="checking" variant="danger">
          {{ $t(`__old__.register_password`) }}
        </b-alert>
        <b-btn class="mt-4 mb-1" variant="success" size="lg" :disabled="(!(password !== '' && passwordAgain !== '') && stage === 1) || (stage === 2 && phone.length < 9) || (stage === 3 && name.length == 0)" block @click="go_to_next_stage"><!-- eslint-disable-line max-len -->
          {{ $t(`common.${stage === 3 ? 'save' : 'next'}`) }}
        </b-btn>
        <b-btn class="mt-2 mb-1" v-if="stage === 3 || stage === 2" variant="info" block @click="stage = stage - 1">{{ $t(`common.back`) }}</b-btn>
      </template>
      <preloader v-else class="mt-4"></preloader>
    </div>
  </b-modal>
</template>

<script>
  import sha256 from 'js-sha256'
  import inputPhone from './ui/input-phone.vue'
  export default {
    data: () => ({
      stage: 0,
      showPassword: false,
      checking: false,
      password: '',
      passwordAgain: '',
      phone: '',
      name: '',
      surname: '',
      patronymic: '',
      pending: false,
      country: ''
    }),
    components: {
      inputPhone
    },
    props: ['value'],
    watch: {
      password (n) {
        if (n) {
          this.checking = false
        }
      },
      passwordAgain (n) {
        if (n) {
          this.checking = false
        }
      },
      stage () {
        this.checking = false
        this.showPassword = false
      }
    },
    computed: {
      passwordState () {
        return this.stage === 1 && this.checking ? false : null
      },
      nameState () {
        return this.stage === 3 && this.checking ? false : null
      },
      inputState () {
        if (!this.showPassword) {
          return {
            variant: 'outline-secondary',
            type: 'password'
          }
        } else {
          return {
            variant: 'secondary',
            type: 'text'
          }
        }
      },
      account () {
        return this.$store.getters['backend/account']
      }
    },
    methods: {
      handlePhone (event) {
        if (event.formated) {
          this.phone = event.formated
          this.country = event.country.iso2.toUpperCase()
        } else {
          this.phone = ''
        }
      },
      go_to_next_stage () {
        if (this.stage === 0) {
          this.stage = 1
        } else if (this.stage === 1) {
          if (this.password !== this.passwordAgain) {
            this.password = ''
            this.passwordAgain = ''
            this.checking = true
          } else {
            this.stage = 2
          }
        } else if (this.stage === 2) {
          this.stage = 3
        } else if (this.stage === 3) {
          this.save()
        }
      },
      save () {
        this.pending = true
        this.$store.dispatch('backend/updateCurrentUser', {
          name: this.name,
          surname: this.surname,
          patronymic: this.patronymic,
          phone: this.phone,
          country: this.country,
          lang: this.$store.state.language,
          regData: {
            LOC: this.$store.state.auth.LOC,
            clientLang: navigator.language
          },
          hashPassword: sha256(`${this.account.regEmail.toLowerCase()}!${this.password}`)
        })
          .then(() => {
            this.pending = false
            this.$a.push({
              type: 'success',
              text: this.$t(`__old__.successfull_registration`)
            })
          })
      }
    }
  }
</script>

<style lang="scss">
  .center-align {
    h5 {
      text-align: center;
      width: 100%;
    }
  }
  .greeting {
    font-size: 1.4rem;
    color: #28a745;
    text-align: center;
  }
  .greeting-small {
    font-size: 1.2rem;
    text-align: center;
  }
</style>
