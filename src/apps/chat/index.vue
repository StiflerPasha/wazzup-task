<template>
    <div>
      <chat-header/>

      <!-- <b-container> -->
        <!-- <b-row> -->
          <chat-sidebar @newContact="openNewContactModal"/>
          <chat-main-view/>
          <!-- <chat-contact-info @deleteContactDetail="openDeleteContactModal" @editTags="openEditTagsModal" @addPhone="openNewPhoneContactModal" @addInstagram="openNewInstagramContactModal"></chat-contact-info> --> <!-- eslint-disable-line max-len -->
        <!-- </b-row> -->
      <!-- </b-container> -->

      <newContactModal ref="new_contact"/>
      <tagsModal ref="edit_tags"/>
      <newPhoneContactModal ref="new_phone_contact"/>
      <newInstagramContactModal ref="new_instagram_contact"/>
      <deleteContactDetailModal ref="delete_contact_detail"/>
    </div>
</template>

<script>
  import ChatHeader from 'chat_views/Header.vue'
  import ChatSidebar from 'chat_views/Sidebar.vue'
  import ChatMainView from 'chat_views/MainView.vue'
  import ChatContactInfo from 'chat_views/ContactInfo.vue'
  import newContactModal from 'chat_components/contact-add.vue'
  import tagsModal from 'chat_components/tags-edit.vue'
  import newPhoneContactModal from 'chat_components/phone-add.vue'
  import newInstagramContactModal from 'chat_components/instagram-add.vue'
  import deleteContactDetailModal from 'chat_components/contact-detail-delete.vue'
  export default {
    data: () => ({}),
    components: {
      ChatHeader,
      ChatSidebar,
      ChatMainView,
      ChatContactInfo,
      newContactModal,
      tagsModal,
      newPhoneContactModal,
      newInstagramContactModal,
      deleteContactDetailModal
    },
    methods: {
      openNewContactModal () {
        this.$refs.new_contact.$refs.contact_modal.show()
      },
      openEditTagsModal () {
        this.$refs.edit_tags.$refs.tags_modal.show()
      },
      openNewInstagramContactModal () {
        this.$refs.new_instagram_contact.$refs.instagram_modal.show()
      },
      openNewPhoneContactModal () {
        this.$refs.new_phone_contact.$refs.phone_modal.show()
      },
      openDeleteContactModal (data) {
        this.$refs.delete_contact_detail.contactId = data.contactId
        this.$refs.delete_contact_detail.contactDetailsId = data.contactDetailsId
        this.$refs.delete_contact_detail.$refs.delete_contact_detail_modal.show()
      }
    },
    created () {
      this.$eb.$on('addNewContact', () => {
        this.openNewContactModal()
      })
      this.$eb.$on('editTags', () => {
        this.openEditTagsModal()
      })
    },
    beforeMount () {
      this.$store.commit('chat/SET_DEFAULT_STATES')
      this.$store.commit('SET_APP', 'chat')
      if (this.$DEVICE <= 2) {
        this.$store.commit('chat/OPEN_MENU')
      }
    },
    computed: {
      __wz_debug () {
        return window.__wz_debug
      }
    }
  }
</script>

<style>

</style>
