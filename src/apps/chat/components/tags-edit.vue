<template>
  <b-modal ref="tags_modal" id="tags_edit" @shown="focus()" hide-footer @hidden="hidden" :title="$t(`contact.tags`)">
    <div>
      <h4>
        <b-badge
          v-for="tag in allTags"
          :variant="tags.indexOf(tag.guid) > -1 ? 'success' : 'light'"
          :key='tag.guid'
          @click='clickTag(tag)'
          class="tag"
        >
          {{ tag.name }}
        </b-badge>
      </h4>
    </div>
    <b-btn class="mt-4 mb-3" variant="success" block style="margin-top: 30px !important;" @click='saveTags'>
      {{ $t(`common.save`) }}
    </b-btn>
  </b-modal>
</template>

<script>
  export default {
    data: () => ({
      tags: []
    }),
    computed: {
      allTags () {
        return this.$store.getters['backend/account'].tags
      },
      selectedTags () {
        return this.$store.getters['backend/currentContact'].tags
      },
      contactId () {
        return this.$store.getters['backend/currentContact'].id
      }
    },
    methods: {
      clickTag (tag) {
        let index = this.tags.indexOf(tag.guid)
        if (index > -1) {
          this.tags.splice(index, 1)
        } else {
          this.tags.push(tag.guid)
        }
      },
      hidden () {
      },
      focus () {
        this.tags = this.selectedTags.slice()
      },
      async saveTags () {
        await this.$store.dispatch('backend/updateContactTags', { tags: this.tags, id: this.contactId }).then(() => {

        })
        this.$refs.tags_modal.hide()
      }
    }
  }
</script>

<style>
  .tag {
    margin-right: 5px;
    cursor: pointer;
  }
</style>
