<template>
  <preloader v-if="pending"/>
  <div v-else>
    <b-button
      v-b-modal.addUser
      class="pull-right"
      size="md"
      variant="success"
    >
      {{ $t(`bookmarks_locale.add_bookmark`) }}
    </b-button>

    <b-row align-h="center" class="my-2">
      <b-col cols="5" class="per-page">
        <b-form-group
          :label="$t(`bookmarks_locale.per_page`)"
          label-size="sm"
          label-cols="5"
          label-align="right"
          label-for="perPageSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
          />
        </b-form-group>
      </b-col>
      <b-col cols="5">
        <b-pagination
          v-model="currentPage"
          :total-rows="length"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        />
      </b-col>
    </b-row>

    <b-table
      striped
      hover
      :items="bookmarks"
      :fields="tableFields"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:cell(favorites)="data">
        <i class="material-icons"
           @click="onEditFavorite(data.item)"
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
          variant="outline-success"
          size="sm">
          {{ $t(`bookmarks_locale.edit`) }}
        </b-button>
      </template>

      <template v-slot:cell(createdAt)="data">
        {{ $f.dt(data.item.createdAt, 'DD-MM-YYYY') }}
      </template>
    </b-table>

    <SettingsBookmarkForm
      :title="$t(`bookmarks_locale.add_bookmark`)"
      name="addUser"
      @submit="onAddBookmark"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import SettingsBookmarkForm from './SettingsBookmarkForm'

  export default {
    props: ['bookmarks', 'length', 'pending'],
    components: {SettingsBookmarkForm},
    data () {
      return {
        sortBy: 'createdAt',
        sortDesc: true,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 20]
      }
    },
    computed: {
      tableFields () {
        return [
          {
            key: 'favorites',
            sortable: true,
            label: this.$t(`bookmarks_locale.favorites`)
          },
          {
            key: 'createdAt',
            sortable: true,
            label: this.$t(`bookmarks_locale.created_date`)
          },
          {
            key: 'link',
            label: this.$t(`bookmarks_locale.link`)
          },
          {
            key: 'description',
            label: this.$t(`bookmarks_locale.description`)
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
      async onEditFavorite (data) {
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
  .per-page {
    max-width: 250px;
    select {
      max-width: 50px;
    }
  }
</style>
