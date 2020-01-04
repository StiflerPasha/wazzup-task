<template>
  <div>
    <b-row>
      <b-col>
        <b-card :title="$t(`bookmarks_locale.bookmarks`)">
          <Error v-if="isError"/>
          <SettingsBookmarksTable
            v-else
            :bookmarks="bookmarks.data"
            :pending="pending"
            :length="bookmarks.length"/>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import SettingsBookmarksTable from '../components/SettingsBookmarks/SettingsBookmarksTable'
  import Error from './404'
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'SettingsBookmarks',
    data () {
      return {
        pending: true,
        isError: false
      }
    },
    components: { SettingsBookmarksTable, Error },
    computed: {
      ...mapState('backend', ['bookmarks'])
    },
    async mounted () {
      try {
        await this.getBookmarks()
        this.pending = false
      } catch (err) {
        this.isError = true
        this.pending = false
        this.$a.push({ type: 'danger', text: err })
      }
    },
    methods: {
      ...mapActions('backend', ['getBookmarks'])
    }
  }
</script>

<style lang="scss">

</style>
