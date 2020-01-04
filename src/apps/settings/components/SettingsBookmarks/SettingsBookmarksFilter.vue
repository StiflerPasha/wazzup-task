<template>
  <b-row class="mt-4" align-h="center">
    <b-col cols="3">
      <b-form-group
        :description="$t(`bookmarks_locale.filter_fav`)"
        label-for="fav"
      >
        <b-form-select
          id="fav"
          v-model="selected"
          :options="options"
          @change="onChangeFav"/>
      </b-form-group>
    </b-col>

    <b-col cols="6">
      <b-form-group
        :description="$t(`bookmarks_locale.filter_fav`)"
        label-for="date"
      >
        <DatePicker
          style="display: inline-block"
          mode='range'
          v-model='range'
          :max-date="new Date()"
          :locale="user.lang"/>
        <b-btn variant="outline-primary">
          Ok
        </b-btn>
      </b-form-group>
    </b-col>
  </b-row>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import DatePicker from 'v-calendar/lib/components/date-picker.umd'
  export default {
    components: { DatePicker },
    data () {
      return {
        selected: 'all',
        range: {
          start: null,
          end: null
        }
      }
    },
    computed: {
      ...mapGetters('backend', ['user']),
      options () {
        return [
          {value: true, text: this.$t(`bookmarks_locale.favorites`)},
          {value: false, text: this.$t(`bookmarks_locale.common`)},
          {value: 'all', text: this.$t(`bookmarks_locale.all`)}
        ]
      }
    },
    methods: {
      ...mapActions('backend', ['getBookmarksFilteredByFav']),
      onChangeFav () {
        this.getBookmarksFilteredByFav(this.selected)
        this.$emit('changeFav', this.selected)
      }
    }
  }
</script>

<style lang='scss' scoped>
  .form-group {
    max-width: 250px;
  }
</style>
