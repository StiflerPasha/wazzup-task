<template>
  <!-- <b-col lg="3" xl="2" :style="{padding: '0', visibility: panels.menu.opened ? 'visible' : 'hidden' }"> -->
    <div class="wz-left-sidebar" :class="{'toggled': !$store.state.chat.menu_open && $DEVICE <= 2}">
      <div class="left-sidebar-wrapper">
        <template v-if="$DEVICE > 2">
          <router-link v-if="showSettings" :to="{
            name: 'settings-main',
            params: {
              app: 'settings'
            }
          }" class="left-sidebar-bottom">
            <i class="icon mdi mdi-wrench"/>
            <span>{{ $t(`menu.settings`) }}</span>
          </router-link>
          <span @click="newContact" v-if="showSettings" class="left-sidebar-bottom">
            <i class="icon mdi mdi-plus"/>
            <span>{{ $t(`chat.add`) }}</span>
          </span>
        </template>
        <chat-list :pending="contactsPending"/>
      </div>
    </div>
  <!-- </b-col> -->
</template>

<script>
  import ChatList from 'chat_components/chatsList/List.vue'
  export default {
    data: () => ({
      contactsPending: false
    }),
    components: {
      ChatList
    },
    computed: {
      showSettings () {
        return !this.$store.getters['auth/is_query_token']
      },
      panels () {
        return this.$store.getters['backend/panels']
      }
    },
    methods: {
      newContact () {
        this.$emit('newContact')
      }
    },
    created () {
      this.contactsPending = true
      this.$store.dispatch('backend/getContacts')
        .then(res => {
          this.contactsPending = false
        })
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
      cursor: pointer;
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
        width: 100%;
        left: 0;
        font-size: 0.9rem;
        line-height: 16px;
        .message_unreaded {
          float: right;
          border-radius: 25px;
          background: #dc3545;
          color: white;
          width: 19px;
          height: 19px;
          user-select: none;
          line-height: 19px;
          text-align: center;
          font-size: 0.9rem;
        }
      }

      &.chat {
        border-bottom: 1px solid #eee;
        padding-bottom: 25px;
        cursor: pointer;
      }

      &.active {
        background-color: #d8f7ca !important;
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
      .sidebar-elements>li {
          >a, >.message {
            padding: 0 10px;
          }
        }
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
