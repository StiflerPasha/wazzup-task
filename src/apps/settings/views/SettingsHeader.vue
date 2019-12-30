<template>
  <nav class="navbar navbar-expand fixed-top wz-top-header settings p-0">
    <div class="container-fluid">
      <div class="wz-navbar-header">
        <span class="wz-navbar-header__logo">
          <i
            @click="doMobileMenuAction"
            class="icon mdi"
            v-if="$DEVICE <= 2"
            :class="{'mdi-menu': !page_name.back && !$store.state.menu_open_mobile, 'mdi-arrow-left': page_name.back || $store.state.menu_open_mobile} /* eslint-disable-line max-len */"
          ></i>
          WAZZUP<span style="font-size: 1.2rem" v-if="$DEVICE > 3">: {{ accountId }}</span>
        </span>
      </div>
      <div class="wz-right-navbar">
        <div class="page-title" v-if="$DEVICE > 3">
          <span v-if="page_name">
            <i v-if="page_name.icon" class="icon mdi" :class="get_icon(page_name.icon)" :style="{'color': page_name.color}"></i>
            {{ get_page_name(page_name) }}
          </span>
        </div>
        <!--Криво-->
        <ul class="nav navbar-nav float-right" style="margin-top: 15px" v-if="$DEVICE > 2">
          <li>
            <b-form-select v-model="$translations.locale" :options="$translations.list" class="mb-3"/>
          </li>
          <li @click="$store.dispatch('auth/make_logout')">
            <i class="icon mdi mdi-logout"></i>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    data: () => ({
      search: ''
    }),
    computed: {
      page_name () {
        return Object.keys(this.$store.state.settings.page_name).length ? this.$store.state.settings.page_name : false
      },
      account () {
        return this.$store.getters['backend/account']
      },
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
      get_page_name (pageName) {
        return pageName.name
      },
      doMobileMenuAction () {
        if (this.page_name.back) {
          this.$store.commit('settings/SET_PAGE_NAME', Object.assign({}, this.$store.state.settings.page_name, {back: false}))
          this.$store.commit('settings/OPEN_MENU')
        } else if (!this.$store.state.menu_open_mobile) {
          this.$store.commit('OPEN_MOBILE_MENU')
        } else if (this.$store.state.menu_open_mobile) {
          this.$store.commit('CLOSE_MOBILE_MENU')
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../../../assets/scss/variables';

  .navbar-nav {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    li {
      padding: 0 10px;
      cursor: pointer;
      i {
        font-size: 1.5rem;
        &:hover {
          color: #dc3545
        }
      }
    }
  }

  .icon-svg {
    display: block;
    width: 25px
  }

  .nav {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    list-style: none;
  }

  .wz-top-header.settings {
    background-color: #FFF;
    border: 0;
    margin-bottom: 0;
    border-bottom: 1px solid #e6e5e5;
    padding: 0;
    .wz-navbar-header {
      display: flex;
      width: $sidebar_width;
      .wz-navbar-header__logo {
        line-height: 60px;
        height: 60px;
        font-size: 24px;
        padding: 0 20px;
        margin: 0;
        display: block;
        i {
          margin-right: 20px;
        }
      }
      .wz-navbar-header__search {
        display: inline-block;
        margin: auto;
        width: 100%;
      }
    }
    .page-title {
      font-size: 1.462rem;
      line-height: 60px;
      float: left;
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      padding: 0 20px;
      .icon {
        font-size: 1.7rem;
        margin-right: 10px;
      }
    }
    .wz-right-navbar {
      padding-right: 20px;
      width: calc(100% - #{$sidebar_width});
    }
    &.searching {
      .wz-navbar-header {
        width: 100%;
      }
      .wz-right-navbar {
        width: 0;
      }
    }
  }

  @media (max-width: 768px) {
    .wz-top-header {
      height: 50px;
    }
    .wz-top-header {
      .wz-navbar-header {
        .wz-navbar-header__logo {
          height: 50px;
          line-height: 50px;
        }
      }
    }
  }
</style>
