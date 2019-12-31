<template>
  <div>
    <b-row>
      <b-col>
        <b-card :title="$t(`__old__.bookmarks`)">
          <SettingsBookmarksTable
            :bookmarks="bookmarks.data"
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
    components: {
      SettingsBookmarksTable
    },
    computed: {
      ...mapState('backend', ['bookmarks'])
    },
    created () {
      this.getBookmarks()
    },
    methods: {
      ...mapActions('backend', ['getBookmarks']),
      onUpdate () {
        this.getBookmarks()
      }
    }
  }
</script>

<style lang="scss">

</style>
