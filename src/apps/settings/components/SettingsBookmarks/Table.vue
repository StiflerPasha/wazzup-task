<template>
  <div>
    <b-button
      @click="goAddModal()"
      class="pull-right"
      size="md"
      variant="success"
    >
      {{ $t(`bookmarks_locale.add_bookmark`) }}
    </b-button>

    <Filter
      @changeFav="onChangeFav"/>

    <preloader
      v-if="pending"/>

    <div
      v-else-if="!length"
      class="empty"
    >
      {{$t(`bookmarks_locale.not_found`)}}
    </div>

    <b-table
      v-else
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
          @click="goEditModal(data.item)"
          variant="outline-success"
          size="sm">
          {{ $t(`bookmarks_locale.edit`) }}
        </b-button>
      </template>

      <template v-slot:cell(createdAt)="data">
        {{ $f.dt(data.item.createdAt, 'DD-MM-YYYY') }}
      </template>
    </b-table>

    <b-row v-if="length" align-h="start" class="my-2">
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
      <b-col cols="7">
        <b-pagination
          class="my-0 pagination"
          v-model="currentPage"
          :total-rows="length"
          :per-page="perPage"
          align="fill"
        />
      </b-col>
    </b-row>

    <Form
      :id="modalId"
      :isEdit="isEdit"
      :modalData="modalData"
      @add="onAddBookmark"
      @edit="onEditBookmark"
      @reset="onResetModal"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import Form from './Form'
  import Filter from './Filter'

  export default {
    props: ['bookmarks', 'length', 'pending'],
    components: {Form, Filter},
    data () {
      return {
        sortBy: 'createdAt',
        sortDesc: true,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 20],
        modalId: '',
        modalData: {},
        isEdit: false,
        filterFav: 'all'
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
      ...mapActions('backend', ['addBookmark', 'updateBookmark', 'getBookmarksFilteredByFav']),
      goAddModal () {
        this.modalId = 'add'
        this.isEdit = false
        this.$nextTick(() => {
          this.$bvModal.show(`${this.modalId}`)
        })
      },
      goEditModal (data) {
        this.modalId = 'edit'
        this.isEdit = true
        this.modalData = data
        this.$nextTick(() => {
          this.$bvModal.show(`${this.modalId}`)
        })
      },
      async onAddBookmark (data) {
        try {
          await this.addBookmark(data)
          await this.getBookmarksFilteredByFav(this.filterFav)
        } catch (err) {
          /*
            Проверка на BOOKMARKS_INVALID_LINK не имеет смысла
            Поле проходит валидацию
          */
          const {description} = err.error.data[0]
          this.$a.push({type: 'danger', text: description})
        }
      },
      async onEditBookmark (data) {
        try {
          await this.updateBookmark(data)
          await this.getBookmarksFilteredByFav(this.filterFav)
        } catch (err) {
          const {description} = err.error.data[0]
          this.$a.push({type: 'danger', text: description})
        }
      },
      async onEditFavorite (data) {
        try {
          await this.updateBookmark({guid: data.guid, favorites: !data.favorites})
          await this.getBookmarksFilteredByFav(this.filterFav)
        } catch (err) {
          const {description} = err.error.data[0]
          this.$a.push({type: 'danger', text: description})
        }
      },
      onResetModal () {
        this.modalData = {}
      },
      onChangeFav (val) {
        this.filterFav = val
      }
    }
  }
</script>

<style lang='scss' scoped>
  i {
    cursor: pointer;
  }

  .form-group {
    max-width: 250px;

    select {
      max-width: 50px;
    }
  }

  .pagination {
    max-width: 350px;
  }

  .empty {
    display: flex;
    height: 100px;
    justify-content: center;
    align-items: center;
    color: #b0b0b0;
    font-weight: bold;
    font-size: 2rem;
  }
</style>
