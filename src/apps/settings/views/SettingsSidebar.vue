<template>
    <div class="wz-left-sidebar" :class="{'toggled': !$store.state.settings.menu_open && $DEVICE <= 2}">
      <div class="left-sidebar-wrapper">
        <router-link :to="{name: 'chat-main', params: {
          app: 'chat'
        }}" class="left-sidebar-bottom">
          <icon name="keyboard_backspace"></icon>
          <span>{{ $t(`__old__.return_to_chat`) }}</span>
        </router-link>
        <div class="left-sidebar-spacer">
          <VuePerfectScrollbar class="left-sidebar-scroll">
            <div class="left-sidebar-content">
              <ul class="sidebar-elements">
                <li class="divider">{{ $t(`__old__.menu`) }}</li>
                <router-link
                  v-for="(item, index) in sidebar"
                  :key="index"
                  :to="{name: item.name, params: item.params}"
                  active-class="active"
                  tag="li"
                >
                  <a>
                    <icon :name="item.icon"></icon>
                    <span>{{ $t(item.title) }}</span>
                  </a>
                </router-link>
              </ul>
            </div>
          </VuePerfectScrollbar>
        </div>
        <a class="left-sidebar-bottom" href="https://wazzup24.com/contact" target="_blank">
          <icon name="help_outline"></icon>
          <span>{{ $t(`__old__.help`) }}</span>
        </a>
      </div>
    </div>
</template>

<script>

  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

  const APP = 'settings'

  export default {
    data: () => ({}),
    components: {
      VuePerfectScrollbar
    },
    computed: {
      sidebar () {
        const SIDEBAR = [
          {
            title: '__old__.channels',
            name: 'settings-channels',
            icon: 'phonelink_setup',
            params: {
              type: 'channels',
              app: APP
            }
          },
          {
            title: '__old__.finance',
            name: 'settings-finance',
            icon: 'monetization_on',
            params: {
              type: 'finance',
              app: APP
            }
          },
          {
            title: '__old__.integrations',
            name: 'settings-integrations',
            icon: 'extension',
            params: {
              type: 'integrations',
              app: APP
            }
          }
        ]
        let account = this.$store.getters['backend/account'] || {}
        if (account.type !== 'integrator-demo') {
          SIDEBAR.push({
            title: '__old__.affiliate',
            name: 'settings-affiliate',
            icon: 'language',
            params: {
              type: 'affiliate',
              app: APP
            }
          })
        }
        if (this.__wz_debug) {
          SIDEBAR.push({
            title: '__old__.users',
            name: 'settings-users',
            icon: 'supervisor_account',
            params: {
              type: 'users',
              app: APP
            }
          })
        }
        if (account.type === 'standart') {
          SIDEBAR.push({
            title: 'bookmarks_locale.bookmarks',
            name: 'settings-bookmarks',
            icon: 'bookmark',
            params: {
              type: 'bookmarks',
              app: APP
            }
          })
        }
        return SIDEBAR
      },
      __wz_debug () {
        return window.__wz_debug
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../assets/scss/variables';

  .wz-fixed-sidebar {
    .wz-left-sidebar {
      transition: all .3s;
      height: 100%;
      margin-top: 61px;
      padding-bottom: 61px;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1029;
      .left-sidebar-content {
        position: absolute;
      }
    }
    .toggled {
      left: -$sidebar_width
    }
  }

  .wz-left-sidebar {
    background-color: #f5f5f5;
    width: $sidebar_width;
    left: 0;
    position: absolute;
    border-right: 1px solid #e3e3e3;
    .left-sidebar-bottom {
      display: block;
      font-size: 1.077rem;
      padding: 15px 20px;
      color: #646464;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      text-decoration: none;
      &:hover {
        background: #eee;
        color: #404040;
      }
      .material-icon {
        line-height: 18px;
        font-size: 19px !important;
        min-width: 19px;
        margin-right: 9px;
        text-align: center;
        vertical-align: middle;
      }
      .icon {
        line-height: 18px;
        font-size: 19px;
        min-width: 19px;
        margin-right: 9px;
        text-align: center;
        vertical-align: middle;
      }
    }
    .left-sidebar-wrapper {
      display: table;
      table-layout: fixed;
      width: 100%;
      height: 100%;
    }
    .left-sidebar-toggle {
      display: none;
      background-color: #FFF;
      padding: 16px 10px;
      color: #404040;
      font-weight: 300;
      font-size: 1.077rem;
    }
    .left-sidebar-spacer {
      height: 100%;
      display: table-row;
    }
    .left-sidebar-scroll {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .left-sidebar-content {
      position: relative;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding-top: 8px;
    }
    .sidebar-elements {
      margin: 0;
      padding: 0;
      .divider {
        padding: 20px 20px 0;
        color: #b0b0b0;
        line-height: 30px;
        font-weight: 600;
        text-transform: uppercase;
        font-size: .8462rem;
      }
    }

    .sidebar-elements>li {
      position: relative;
      list-style: none;
      &:hover:not(.divider) {
        background: #eee;
        a {
          color: #404040;
        }
      }
      .active {
        >a {
          padding-left: 20px;
          font-weight: 500;
          color: #4285f4;
        }
      }
      >a, >.message {
        text-decoration: none;
        cursor: pointer;
        display: block;
        padding: 0 20px;
        color: #646464;
        font-size: 1.077rem;
        line-height: 38px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        .material-icon {
          line-height: 18px;
          font-size: 19px !important;
          min-width: 19px;
          margin-right: 9px;
          text-align: center;
          vertical-align: middle;
        }
        .icon {
          line-height: 18px;
          font-size: 19px;
          min-width: 19px;
          margin-right: 9px;
          text-align: center;
          vertical-align: middle;
        }
      }

      >.message {
        position: absolute;
        bottom: 10px;
        left: 0;
        font-size: 0.9rem;
        line-height: 16px;
      }

      &.chat {
        border-bottom: 1px solid #eee;
        padding-bottom: 25px;
        cursor: pointer;
      }

      &.active {
        background-color: #eee;
      }
    }
  }

  .ps-container {
    -ms-touch-action: auto;
    touch-action: auto;
    overflow: hidden !important;
    -ms-overflow-style: none;
  }

  @media (max-width: 768px) {
    .wz-fixed-sidebar{
      .wz-left-sidebar {
        margin-top: 50px;
        padding-bottom: 50px;
      }
    }
    .wz-left-sidebar {
      &:not(.toggled) {
        width: 100%;
      }
      .left-sidebar-toggle {
        display: block;
      }
      .left-sidebar-spacer {
        display: table-row;
      }
    }
  }
</style>
