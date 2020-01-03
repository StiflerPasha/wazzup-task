<template>
  <div>
    <b-row>
      <b-col>
        <b-card :title="$t(`bookmarks_locale.bookmarks`)">
          <SettingsBookmarksTable
            :bookmarks="bookmarks.data"
            :pending="pending"
            :length="bookmarks.length"
            @update="onUpdate"/>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import SettingsBookmarksTable from '../components/SettingsBookmarks/SettingsBookmarksTable'
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'SettingsBookmarks',
    data () {
      return {
        pending: true
      }
    },
    components: {
      SettingsBookmarksTable
    },
    computed: {
      ...mapState('backend', ['bookmarks'])
    },
    async created () {
      await this.getBookmarks()
      this.pending = false
    },
    methods: {
      ...mapActions('backend', ['getBookmarks']),
      async onUpdate () {
        this.pending = true
        await this.getBookmarks()
        this.pending = false
      }
    }
  }
</script>

<style lang="scss">

</style>
