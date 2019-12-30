<template>
  <div>
    <b-button
      v-b-modal.addUser
      class="pull-right"
      size="lg"
      variant="success"
    >
      {{ $t(`users.add`) }}
    </b-button>

    <b-table
      striped
      hover
      :items="bookmarks"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:cell(favorites)="data">
        <i class="material-icons"
           @click="onEditLink(data.item)"
        >
          {{data.item.favorites ? 'star' : 'star_border'}}
        </i>
      </template>

      <template v-slot:cell(link)="data">
        <b-link :href="data.item.link" target="_blank">{{ data.item.link }}</b-link>
      </template>

      <template v-slot:cell(edit)="data">
        <b-button
          @click="onEditLink(data.item)"
          variant="outline-success">
          {{ $t(`common.edit`) }}
        </b-button>
      </template>

      <template v-slot:cell(createdAt)="data">
        {{ $f.dt(data.item.createdAt, 'DD.MM.YYYY') }}
      </template>
    </b-table>

    <SettingsBookmarkForm
      :title="$t(`users.add`)"
      name="addUser"
      @submit="onAddBookmark"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import SettingsBookmarkForm from './SettingsBookmarkForm'

  export default {
    props: ['bookmarks'],
    components: {SettingsBookmarkForm},
    data () {
      return {
        sortBy: 'createdAt',
        sortDesc: true,
        fields: [
          {
            key: 'favorites',
            sortable: true
          },
          {
            key: 'createdAt',
            sortable: true,
            label: 'Date'
          },
          {
            key: 'link',
            label: 'Link'
          },
          {
            key: 'description',
            label: 'Description'
          },
          {
            key: 'edit',
            label: ''
          }
        ]
      }
    },
    methods: {
      ...mapActions('backend', ['addBookmark', 'updateBookmark']),
      async onAddBookmark (data) {
        await this.addBookmark(data)
        this.$emit('update')
      },
      async onEditLink (data) {
        await this.updateBookmark({ guid: data.guid, favorites: !data.favorites })
        this.$emit('update')
      }
    }
  }
</script>

<style lang='scss' scoped>
  i {
    cursor:pointer;
  }
</style>
