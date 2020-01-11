<template>
  <div>
    <b-row>
      <b-col>
        <b-card :title="$t(`bookmarks_locale.bookmarks`)">
          <Error v-if="isError"/>
          <div v-else>
            <AddBookmark @onShowAddModal="showAddModal"/>

            <TableFilter/>

            <Table
              :bookmarks="bookmarks.data"
              :pending="pending"
              :length="bookmarks.length"
              @editCurrentLink="showEditModal"
            />

            <ModalForm
              :id="modalId"
              :isEdit="isEditModal"
              :modalData="modalData"/>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import AddBookmark from '../components/SettingsBookmarks/AddBookmark'
  import TableFilter from '../components/SettingsBookmarks/TableFilter'
  import Table from '../components/SettingsBookmarks/Table'
  import ModalForm from '../components/SettingsBookmarks/ModalForm'
  import Error from './404'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'SettingsBookmarks',
    data () {
      return {
        pending: true,
        isError: false,
        modalId: '',
        isEditModal: null,
        modalData: {}
      }
    },
    components: {
      AddBookmark,
      TableFilter,
      Table,
      ModalForm,
      Error
    },
    computed: {
      ...mapGetters('backend', ['bookmarks'])
    },
    async mounted () {
      try {
        await this.fetchBookmarks()
        this.pending = false
      } catch (err) {
        this.isError = true
        this.pending = false
      }
    },
    methods: {
      ...mapActions('backend', ['fetchBookmarks']),
      showAddModal () {
        this.modalId = 'add'
        this.isEditModal = false
        this.$nextTick(() => {
          this.$bvModal.show(`${this.modalId}`)
        })
      },
      showEditModal (data) {
        this.modalId = 'edit'
        this.isEditModal = true
        this.modalData = data
        this.$nextTick(() => {
          this.$bvModal.show(`${this.modalId}`)
        })
      }
    }
  }
</script>
