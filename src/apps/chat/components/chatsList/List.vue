<template>
  <div class="left-sidebar-spacer">
    <template v-if="chatsList.length > 0">
      <VuePerfectScrollbar
        :is="$DEVICE <= 3 ? 'div' : 'VuePerfectScrollbar'"
        class="left-sidebar-scroll">
        <div class="left-sidebar-content" style="overflow: auto;" infinite-wrapper>
          <ul class="sidebar-elements">
            <chats-list-single v-for="(chat, index) in chatsList" v-bind="chat" :key="index" />
          </ul>
          <vue-infinite-loading
            :distance="300"
            @infinite="infiniteHandler"
            force-use-infinite-wrapper="true"
          >
            <span slot="no-results"></span>
          </vue-infinite-loading>
        </div>
      </VuePerfectScrollbar>
    </template>
    <preloader v-else-if="pending" class="place-flex"></preloader>
    <!-- <div class="place-flex">
      {{ $t(`chat.contacts_empty`) }}
    </div> -->
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import VueInfiniteLoading from 'vue-infinite-loading'
  import ChatsListSingle from './components/ChatListSingle.vue'
  import { transformChat } from './utils'

  export default {
    data: () => ({
      isLoading: false
    }),
    components: {
      VuePerfectScrollbar,
      VueInfiniteLoading,
      ChatsListSingle
    },
    props: ['pending'],
    computed: {
      ...mapGetters('backend', ['contacts']),
      chatsList () {
        return this.contacts.map(chat => transformChat(chat))
      }
    },
    methods: {
      ...mapActions('backend', ['getContacts']),
      async infiniteHandler ($state) {
        try {
          const data = await this.getContacts({ offset: this.chatsList.length })
          if (data.length) {
            $state.loaded()
            if (this.chatsList.length === data.length) {
              $state.complete()
            }
          } else {
            $state.complete()
          }
        } catch (e) {
          console.warn(e)
          $state.complete()
        }
      }
    }
  }
</script>

<style lang="scss">
  .nativeScroll {
    overflow-y: scroll !important;
  }

  .h-0{
    height: 0;
    float: right
  }
  .message {
    .material-icon {
      font-size: 14px !important;
    }
  }
</style>
