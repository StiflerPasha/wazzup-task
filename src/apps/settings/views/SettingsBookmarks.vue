<template>
  <div>
    <b-row>
      <b-col>
        <b-card :title="$t(`bookmarks_locale.bookmarks`)">
          <Error v-if="isError"/>

          <Table
            v-else
            :bookmarks="bookmarks.data"
            :pending="pending"
            :length="bookmarks.length"
          />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import Table from '../components/SettingsBookmarks/Table'
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
    components: {Table, Error},
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
      }
    },
    methods: {
      ...mapActions('backend', ['getBookmarks'])
    }
  }
</script>
