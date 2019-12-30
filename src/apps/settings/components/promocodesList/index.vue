<template>
  <b-card
    :title="$t(`affiliate.titles.promocodes`)"
  >
    <template v-if="promocodes.length > 0 && !pending">
      <b-table class="mt-4 mb-4" :items="promocodes_views" :fields="fields">
        <template slot="icon" slot-scope="row">
          <div class="icon_to_center">
            <i class="icon mdi" :class="GET_ICON('mdi-whatsapp')" style="color: #28a745"></i>
          </div>
        </template>
        <template slot="edit" slot-scope="row">
          <b-button variant="outline-success">
            {{ $t(`common.edit`) }}
          </b-button>
        </template>
      </b-table>
      <b-button v-b-modal.promocode_add_new style="float: right" size="lg" variant="success">{{ $t(`affiliate.promo.add`) }}</b-button>
    </template>
    <preloader v-else-if="pending"></preloader>
    <template v-else>
      <div class="promocodes">
        {{ $t(`affiliate.promo.missing`) }}<br>
        <b-button v-b-modal.promocode_add_new style="margin-top: 20px" size="lg" variant="success">{{ $t(`affiliate.promo.add`) }}</b-button>
      </div>
    </template>
    <b-modal id="promocode_add_new" hide-footer ref="promocode_ref" @shown="focus()" @ok="add_promocode" :title="$t(`affiliate.promo.create`)">
      <label for="channel_name">{{ $t(`affiliate.promo.name`) }}</label>
      <b-form-input id="channel_name"
                    ref="modal_input"
                    v-model.trim="code"
                    focused
                    type="text"
                    aria-describedby="channel_name_feedback channel_name_help"
                    :state="codeState"></b-form-input>
      <b-form-invalid-feedback id="channel_name_feedback">
        <!-- This will only be shown if the preceeding input has an invalid state -->
        {{ codeErrorText }}
      </b-form-invalid-feedback>
      <b-form-text id="channel_name_help">
        <!-- this is a form text block (formerly known as help block) -->
        {{ $t(`affiliate.promo.helptext`) }}
      </b-form-text>
      <b-form-radio-group class="mt-4 mb-4"
                          v-model="promocodeType"
                          :options="promocodeTypeOptions"
                          stacked
                          name="radiosStacked">
      </b-form-radio-group>
      <preloader v-if="addPending"></preloader>
      <b-btn v-else class="mt-4 mb-3" variant="outline-success" block @click="add_promocode">{{ $t(`common.add`) }}</b-btn>
    </b-modal>
  </b-card>
</template>

<script>
  export default {
    data: () => ({
      promocodeType: 1,
      code: '',
      codeErrorText: '',
      addPending: false
    }),
    methods: {
      focus () {
        this.$refs.modal_input.$el.focus()
      },
      add_promocode (e) {
        e.preventDefault()
        this.handleErrors()
        this.addPending = true
        if (!this.codeErrorText) {
          this.$store.dispatch('backend/add_promocode', {
            code: this.code,
            type: this.promocodeType
          })
            .then(res => {
              this.$emit('load')
              this.code = ''
              this.codeErrorText = ''
              this.$a.push({
                type: 'success',
                text: this.$t(`affiliate.promo.added`)
              })
              this.$refs.promocode_ref.hide()
              this.addPending = false
            })
            .catch(e => {
              if (e.error.data.backend.indexOf('Promo code already exist') >= 0) {
                this.codeErrorText = this.$t(`affiliate.promo.already_taken`)
              }
              this.addPending = false
            })
        } else {
          this.addPending = false
        }
      },
      handleErrors () {
        this.codeErrorText = ''
        const validateError = /[^0-9a-z_]/ig.test(this.code)
        if (validateError || this.code === '') {
          this.codeErrorText = this.$t(`affiliate.promo.invalid_chars`)
        }
      }
    },
    props: ['pending'],
    computed: {
      codeState () {
        return this.codeErrorText === '' ? null : false
      },
      promocodeTypeOptions () {
        return [
          { text: this.$t(`__old__.promocode_add_type_1`), value: 1 },
          { text: this.$t(`__old__.promocode_add_type_2`), value: 2 },
          { text: this.$t(`__old__.promocode_add_type_3`), value: 3 }
        ]
      },
      promocodes () {
        return this.$store.getters['backend/promocodes']
      },
      fields () {
        return [
          {
            key: 'type',
            label: this.$t(`__old__.table_promocode_type`)
          },
          {
            key: 'promocode',
            label: this.$t(`__old__.table_promocode_name`)
          }
        ]
      },
      promocodes_views () {
        let array = []
        const promocodes = this.promocodes
        promocodes.forEach(promocode => {
          array.push({
            type: this.$t(`promocode_add_type_${promocode.type}`),
            promocode: promocode.code
          })
        })
        array = array.reduce((arr, item) => {
          arr.push(item)
          return arr
        }, [])
        return array
      }
    }
  }
</script>

<style lang="scss">
  .promocodes {
    text-align: center;
    font-size: 2rem;
    padding: 30px 0;
  }
</style>
