<template>
    <div v-if="$DEVICE <= 2" class="wz-left-sidebar wz-left-sidebar-mobile" :class="{'toggled': !$store.state.menu_open_mobile}">
      <div class="left-sidebar-wrapper">
        <div class="left-sidebar-spacer">
          <VuePerfectScrollbar class="left-sidebar-scroll">
            <div class="left-sidebar-content">
              <ul class="sidebar-elements" v-if="$APP === 'chat'">
                <li class="divider">{{ $t(`__old__.chats`) }}</li>
                <li @click="newContact">
                  <a>
                    <i class="icon mdi mdi-plus"></i>
                    <span>{{ $t(`chat.add`) }}</span>
                  </a>
                </li>
                <!--<li class="divider">{{ $t(`__old__.menu`) }}</li>-->
                <!--<li>-->
                  <!--<router-link :to="{-->
                    <!--name: 'settings-main',-->
                    <!--params: {-->
                      <!--app: 'settings'-->
                    <!--}-->
                  <!--}">-->
                    <!--<i class="icon mdi mdi-wrench"></i>-->
                    <!--<span>{{ $t(`menu.settings`) }}</span>-->
                  <!--</router-link>-->
                <!--</li>-->
              </ul>
            </div>
          </VuePerfectScrollbar>
        </div>
        <template v-if="$DEVICE > 2">
          <a @click.prevent="newContact()" class="left-sidebar-bottom">
            <i class="icon mdi mdi-plus"></i>
            <span>{{ $t(`chat.add`) }}</span>
          </a>
          <router-link :to="{
            name: 'settings'
          }" class="left-sidebar-bottom">
            <i class="icon mdi mdi-wrench"></i>
            <span>{{ $t(`menu.settings`) }}</span>
          </router-link>
        </template>
        <template v-else>
          <span class="left-sidebar-bottom">
            {{ $t(`__old__.account_id`) }}
            <a href="" @click.prevent="copyToBuffer">{{ accountId }}</a>
          </span>
          <span class="left-sidebar-bottom">
              <b-form-select v-model="$translations.locale" :options="$translations.list"/>
          </span>
          <span @click="$store.dispatch('auth/make_logout')" class="left-sidebar-bottom">
            <i class="icon mdi mdi-logout"></i>
            <span>{{ $t(`__old__.exit`) }}</span>
          </span>
        </template>
      </div>
    </div>
</template>

<script>
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  export default {
    data: () => ({
      chats: []
    }),
    computed: {
      accountId () {
        const number = this.$store.getters['backend/account'].id + ''
        const first = number.slice(0, 4)
        const second = number.slice(Math.max(number.length - 4, 1))
        return `${first}-${second}`
      }
    },
    methods: {
      get_icon (icon) {
        const object = {}
        object[icon] = true
        return object
      },
      newContact () {
        this.$store.commit('CLOSE_MOBILE_MENU')
        this.$eb.$emit('addNewContact')
      },
      copyToBuffer () {
        const el = document.createElement('input')
        el.style.position = 'absolute'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        el.value = this.accountId
        const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i)
        if (isiOSDevice) {
          const editable = el.contentEditable
          const readOnly = el.readOnly

          el.contentEditable = true
          el.readOnly = false

          const range = document.createRange()
          range.selectNodeContents(el)

          const selection = window.getSelection()
          selection.removeAllRanges()
          selection.addRange(range)

          el.setSelectionRange(0, 999999)
          el.contentEditable = editable
          el.readOnly = readOnly
        } else {
          el.select()
        }

        document.execCommand('copy')
        document.body.removeChild(el)
        this.$a.push({
          type: 'success',
          text: this.$t(`common.to_clippboard`),
          duration: 1200
        })
      }
    },
    watch: {
      '$route' () {
        this.$store.commit('CLOSE_MOBILE_MENU')
      }
    },
    components: {
      VuePerfectScrollbar
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/variables';

  .wz-fixed-sidebar {
    .wz-left-sidebar-mobile {
      background-color: #fff !important;
      z-index: 1100 !important;
      box-shadow: 0px 3px 7px #00000024;
    }
  }

  @media (max-width: 768px) {
    .wz-fixed-sidebar {
      .wz-left-sidebar-mobile {
        width: $sidebar_width !important;
      }
    }
  }
</style>
