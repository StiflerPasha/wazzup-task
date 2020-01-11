<template>
  <div>
    <preloader v-if="pending"/>

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
          @click="$emit('editCurrentLink', data.item)"
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
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import ModalForm from './ModalForm'
  import TableFilter from './TableFilter'

  export default {
    props: ['bookmarks', 'length', 'pending'],
    components: {
      ModalForm,
      TableFilter
    },
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
      ...mapActions('backend', ['updateBookmark']),
      async onEditFavorite (data) {
        try {
          await this.updateBookmark({guid: data.guid, favorites: !data.favorites})
        } catch (err) {
          const {description} = err.error.data[0]
          this.$a.push({type: 'danger', text: description})
        }
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
