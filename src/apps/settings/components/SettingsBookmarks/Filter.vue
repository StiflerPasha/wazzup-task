<template>
  <div class="filters">
    <b-form-group
      :description="$t(`bookmarks_locale.filter_date`)"
      label-for="date"
    >
      <DatePicker
        ref="dp"
        style="display: inline-block"
        mode='range'
        v-model='range'
        :max-date="new Date()"
        :locale="user.lang"
      />

      <b-btn
        @click="onChangeDate"
        variant="light"
        :disabled="!isFilterData"
      >
        <icon name="filter_list"/>
      </b-btn>
    </b-form-group>

    <b-form-group
      :description="$t(`bookmarks_locale.filter_fav`)"
      label-for="fav"
    >
      <b-form-select
        id="fav"
        v-model="selected"
        :options="options"
        @change="onChangeFav"
      />
    </b-form-group>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import DatePicker from 'v-calendar/lib/components/date-picker.umd'

  const defaultRange = () => ({start: null, end: null})

  export default {
    components: {DatePicker},
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
      },
      isFilterData () {
        return this.range.start !== null
      }
    },
    methods: {
      ...mapActions('backend', ['getBookmarksFilteredByFav', 'getBookmarksFilteredByDate']),
      onChangeFav () {
        this.range = defaultRange()
        this.$refs.dp.inputValue = ''
        try {
          this.getBookmarksFilteredByFav(this.selected)
          this.$emit('changeFav', this.selected)
        } catch (err) {
          console.log(err)
          // this.$a.push({ type: 'danger', text: err })
        }
      },
      onChangeDate () {
        this.selected = 'all'
        const msInDay = 86400000
        const start = this.range.start.getTime()
        const end = this.range.end.getTime() + msInDay
        try {
          this.getBookmarksFilteredByDate({start, end})
          this.$emit('changeFav', this.selected)
        } catch (err) {
          console.log(err)
          // this.$a.push({ type: 'danger', text: err })
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  .form-group {
    max-width: 250px;
    line-height: 1.25px;

    .btn {
      padding: 5px 5px 2px 3px;
      margin-bottom: 4px;
    }
  }

  .filters {
    margin-top: 30px;
    display: flex;

    .form-group {
      flex-grow: 1;
      margin-right: 50px;
    }
  }

  #fav {
    height: 38px;
    font-size: 1.2rem;
    margin-bottom: 4px;
  }
</style>
