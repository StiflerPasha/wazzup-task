import Vue from 'vue'

export function createFormattingUtils (store) { // eslint-disable-line
  return new Vue({
    data: () => ({
    }),
    methods: {
      dt (date, str, emptyDate = '') {
        // TODO: временная затычка, пока работает только с DD-MM-YYYY
        if (!date) return emptyDate
        let d = typeof date === 'object' ? date : new Date(date)
        let separator
        if (str === 'DD-MM-YYYY') {
          separator = '-'
        } else if (str === 'DD.MM.YYYY') {
          separator = '.'
        } else if (str === 'DD.MM') {
          return `${('00' + (d.getDate()).toString()).substr(-2)}.${('00' + (d.getMonth() + 1).toString()).substr(-2)}`
        } else if (str === 'MMMM YYYY') {
          return `${this.$t(`common.months.${(d.getMonth() + 1)}`)} ${d.getFullYear()}`
        } else {
          return d.toString()
        }
        return `${('00' + (d.getDate()).toString()).substr(-2)}${separator}${('00' + (d.getMonth() + 1).toString()).substr(-2)}${separator}${d.getFullYear().toString()}`
      },
      accId (id, emptyId = '') {
        if (!id) return emptyId
        let str = typeof id === 'string' ? id : id.toString()
        if (str.length !== 8) return emptyId
        return `${str.substr(0, 4)}-${str.substr(4, 4)}`
      }
    }
  })
}
