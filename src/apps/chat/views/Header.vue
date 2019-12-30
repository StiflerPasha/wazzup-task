<!-- eslint-disable max-len -->
<template>
  <nav class="navbar navbar-expand fixed-top wz-top-header p-0" :class="{'searching': mobile_search}">
    <div class="container-fluid">
      <div class="wz-navbar-header">
        <span class="wz-navbar-header__logo" :class="{'mobile_page_name': $DEVICE <= 3}">
          <i @click="doMobileMenuAction" class="icon mdi" v-if="$DEVICE <= 2" :class="{'mdi-menu': !page_name.back && !$store.state.menu_open_mobile && !mobile_search, 'mdi-arrow-left': page_name.back || $store.state.menu_open_mobile || mobile_search}"></i>
          <template v-if="!mobile_search">
            <template v-if="$DEVICE > 2 || $store.state.chat.menu_open">
              WAZZUP<span style="font-size: 1.2rem" v-if="$DEVICE > 2">: {{ accountId }}</span>
            </template>
            <span v-else-if="page_name && $DEVICE <= 2">
              <h1>
                <i v-if="page_name.icon" class="icon mdi" :class="get_icon(page_name.icon)" :style="{'color': page_name.color}"></i>
                <span>{{ get_page_name_mobile(page_name) }}</span>
                <!--<small v-if="get_page_name_mobile(page_name).need">{{ get_page_name_mobile(page_name).subName }}</small>-->
              </h1>
            </span>
          </template>
          <template v-if="page_name && $DEVICE <= 2">
            <span style="flex: 1"></span>
          </template>
          <!--<div v-else="" class="wz-navbar-header__search">-->
            <!--<b-form-input-->
              <!--style="margin-bottom: 0"-->
              <!--v-model.trim="search"-->
              <!--type="text"-->
              <!--tabindex="2"-->
              <!--:placeholder="$t(`chat.search`)"></b-form-input>-->
          <!--</div>-->
        </span>
      </div>
      <div class="wz-right-navbar">
        <b-container fluid>
          <b-row>
            <b-col lg="9" style="padding: 0; max-height: 60px; overflow: hidden;">
              <div class="page-title" v-if="$DEVICE > 3" style="display: table; height: 100%;">
                <span v-if="page_name" style="display: table-cell; vertical-align: middle;">
                  <i v-if="page_name.icon" class="icon mdi" :class="get_icon(page_name.icon)" :style="{'color': page_name.color}"></i>
                  {{ get_page_name(page_name) }}
                </span>
              </div>
            </b-col>
            <b-col lg="3" style="padding: 0; min-width: 175px;">
              <ul class="nav navbar-nav float-right" style="margin-top: 15px" v-if="$DEVICE > 2">
                <li>
                  <b-form-select v-model="$translations.locale" :options="$translations.list" class="mb-3"/>
                </li>
                <li v-if="showLogOut" @click="$store.dispatch('auth/make_logout')">
                  <i class="icon mdi mdi-logout"></i>
                </li>
              </ul>
            </b-col>
          </b-row>
        </b-container>
        <!--Криво-->
        <ul class="nav navbar-nav float-right" v-if="$DEVICE <= 2">
          <!--<li @click="mobileSearch">-->
            <!--<i v-if="!mobile_search" class="icon-svg">-->
              <!--<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon">-->
                <!--<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" class="style-scope yt-icon"></path>-->
              <!--</g></svg>-->
            <!--</i>-->
          <!--</li>-->
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
    watch: {
      '$mq.resize' () {
        if (!this.$route.params.id) {
          this.$store.commit('chat/OPEN_MENU')
        }
      }
    },
    computed: {
      showLogOut () {
        return !this.$store.getters['auth/is_query_token']
      },
      page_name () {
        return Object.keys(this.$store.state.chat.page_name).length ? this.$store.state.chat.page_name : false
      },
      mobile_search () {
        return this.$store.state.chat.is_mobile_searching && this.$DEVICE <= 2
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
        if (pageName.answer !== null) {
          // TODO: костыль, сделать нормально
          if (pageName.amocrmPageName) {
            return pageName.amocrmPageName
          } else {
            // return `${pageName.channel ? pageName.channel + ':' : ''} ${pageName.name}`
            return pageName.name
          }
        } else {
          return ''
        }
      },
      get_page_name_mobile (pageName) {
        if (pageName.answer !== null) {
          // return `${pageName.channel ? pageName.channel + ':' : ''} ${pageName.name}`
          return pageName.name
        } else {
          return ''
        }
      },
      doMobileMenuAction () {
        if (!this.mobile_search) {
          if (this.page_name.back) {
            this.$store.commit('chat/SET_PAGE_NAME', Object.assign({}, this.$store.state.chat.page_name, {back: false}))
            this.$store.commit('chat/OPEN_MENU')
          } else if (!this.$store.state.menu_open_mobile) {
            this.$store.commit('OPEN_MOBILE_MENU')
          } else if (this.$store.state.menu_open_mobile) {
            this.$store.commit('CLOSE_MOBILE_MENU')
          }
        } else {
          this.$store.commit('chat/TOGGLE_MOBILE_SEARCH')
        }
      },
      mobileSearch () {
        this.$store.commit('chat/TOGGLE_MOBILE_SEARCH')
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

  .wz-top-header {
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
      line-height: 30px;
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
        min-width: 100%;
        .wz-navbar-header__logo {
          width: 100%;
          height: 50px;
          padding: 0 10px;
          line-height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          h1 {
            display: flex;
            align-items: center;
            margin-bottom: 0;
            justify-content: center;
            font-size: 1.2rem;
            text-align: center;
            small {
              color: #dc3545;
              display: block;
            }
            span {
              flex: none;
            }
            i {
              margin-right: 10px !important;
              flex: none;
            }
          }
          i {
            flex: 1;
            margin-right: 10px;
          }
          span {
            flex: 5;
            text-align: center;
            font-size: 1.2rem;
            i {
              margin-right: 3px;
              font-size: 24px;
            }
          }
        }
      }
    }
  }
</style>
