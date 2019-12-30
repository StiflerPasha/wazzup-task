<template>
  <div id="app">
    <template v-if="!is_error_or_answer">
      <transition-group name="fade">
        <div v-if="$USER && account_ready" class="wz-wrapper wz-fixed-sidebar" key="1">
          <SidebarMobile/>
          <transition name="fade-long" v-if="user.activated">
            <router-view/>
          </transition>
          <NeedPassword v-model="needPassword" v-else/>
        </div>
        <Authorization v-else-if="$USER !== null && !token_from_query && account_ready" key="2"/>
        <div v-else-if="$USER !== null && token_from_query && account_ready" class="message-box" key="4">
          <h1 class="mb-4">WAZZUP</h1>
          <div class="message-box-white">
            {{ $t(`errors.network.connection_lost_reload`) }}
          </div>
        </div>
        <preloader v-else key="3" class="place-flex"/>
      </transition-group>
    </template>
    <template v-else>
      <router-view/>
    </template>
  </div>
</template>

<script>
  import Authorization from 'main_views/Authorization.vue'
  import SidebarMobile from 'main_components/SidebarMobile.vue'
  import NeedPassword from 'main_components/NeedPassword.vue'

  export default {
    name: 'App',
    data: () => ({
      auth: true
    }),
    computed: {
      token_from_query () {
        return this.$store.getters[`auth/is_query_token`]
      },
      is_error_or_answer () {
        return this.$route.params.app === 'error' || this.$route.params.app === 'backend'
      },
      account () {
        return this.$store.getters['backend/account']
      },
      user () {
        return this.$store.getters['backend/user']
      },
      account_ready () {
        return this.$store.state.auth.accessToken ? (Object.keys(this.account).length > 0 && Object.keys(this.user).length > 0) : true
      },
      needPassword () {
        return !this.user.activated
      },
      language () {
        return this.$store.state.language
      }
    },
    watch: {
      '$mq.resize' () {
        this.$store.commit('CLOSE_MOBILE_MENU')
        this.$store.commit('SET_DEVICE_WIDTH', { data: window.innerWidth, height: window.innerHeight })
      },
      '$translations.KOSTIL' () {
        this.$store.commit('chat/SET_DEFAULT_STATES')
      },
      '$route' () {
        this.$store.commit('CLOSE_MOBILE_MENU')
      },
      language () {
        if (this.language) {
          const user = this.$store.getters['backend/user']
          if (user && user.guid && user.language !== this.language) {
            this.$store.dispatch('backend/updateCurrentUser', { lang: this.language }).catch(e => e)
          }
        }
      }
    },
    components: {
      Authorization,
      SidebarMobile,
      NeedPassword
    },
    mounted () {
      // Safari zoom disable
      document.addEventListener('touchmove', function (event) {
        event = event.originalEvent || event
        if (event.scale > 1) {
          event.preventDefault()
        }
      }, false)
    },
    created () {
      this.$eb.$on('close_mobile_menu', () => {
        this.$store.commit('chat/CLOSE_MENU')
      })

      this.$store.commit('SET_DEVICE_WIDTH', { data: window.innerWidth, height: window.innerHeight })
    }
  }
</script>

<style lang="scss">
  * {
    -webkit-overflow-scrolling: touch;
  }
  html {
    font-size: 13px;
  }
  body {
    background-color: #eee !important;
  }

  .reconnect {
    font-size: 1.8rem;
    text-align: center;
    margin: 7rem auto;
    display: inline-block;
    max-width: 300px;
    background-color: #fff;
    padding: 10px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }

  .fade-leave-active{
    display: none;
  }

  .fade-long-enter-active, .fade-long-leave-active {
    transition: opacity .5s;
  }
  .fade-long-enter, .fade-long-leave-to {
    opacity: 0
  }

  .fade-long-leave-active{
    display: none;
  }

  .wz-wrapper {
    min-height: 100%;
    padding-top: 61px;
  }
  @media (max-width: 768px) {
    * {cursor: pointer !important;}
    .wz-wrapper {
      padding-top: 50px;
    }
    input[type="color"],
    input[type="date"],
    input[type="datetime"],
    input[type="datetime-local"],
    input[type="email"],
    input[type="month"],
    input[type="number"],
    input[type="password"],
    input[type="search"],
    input[type="tel"],
    input[type="text"],
    input[type="time"],
    input[type="url"],
    input[type="week"],
    select:focus,
    textarea {
      font-size: 16px;
    }
  }

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
