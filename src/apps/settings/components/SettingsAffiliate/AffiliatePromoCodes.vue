<template>
  <div>
    <b-card :title="`${$t(`affiliate.promo.referal_link`)}:`" class="mt-4">
      <div class="pointer d-inline-block">
        {{ referralLink }}
      </div>
      <i
        class="icon mdi"
        :class="GET_ICON('mdi-content-copy')"
        v-clipboard="referralLink"
        ></i>
    </b-card>

      <b-table
        :items="promocodes"
        :fields="tableFields"
        class="mt-4"
        striped
        hover
      >
      <template slot="edit" slot-scope="row">
        <b-button
          @click="onEditPromoCode(row.item)"
          variant="outline-success">
          {{ $t(`common.edit`) }}
        </b-button>
        <b-button
          @click="showConfirm(row.item.code)"
          variant="outline-danger ml-2"
        >
          {{ $t(`common.remove`) }}
        </b-button>
      </template>
      <template slot="type" slot-scope="row">
        {{ $t(`__old__.promocode_add_type_${row.value}`) }}
      </template>
      <template slot="validity" slot-scope="row">
        {{ createdAt(row.value) }}
      </template>
      <template slot="code" slot-scope="row">
        <div
          v-clipboard="row.value"
          v-b-popover.hover="$t('common.click_to_copy')"
          :title="$t('common.information')"
        >
          {{ row.value }}
        </div>
      </template>
    </b-table>
    <div class="text-right">
      <b-button
        @click="onAddPromoCode"
        v-b-modal.addPromoCode
        class="pull-right"
        size="lg"
        variant="success"
      >
        {{ $t('affiliate.promo.add') }}
      </b-button>
    </div>
    <promo-codes-form
      :title="$t('affiliate.promo.add')"
      :formErrors="formErrors"
      name="addPromoCode"
      @submit="onCreate"
    />
    <promo-codes-form
      :title="$t('affiliate.promo.edit')"
      :data="form"
      name="editPromoCode"
      @submit="onUpdate"
      edit-mode
    />

    <confirm-modal
      :title="$t(`__old__.remove_promo_code`)"
      :message="$t(`__old__.remove_promo_code_message`)"
      @confirm="onConfirmRemove"
    />

  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import PromoCodesForm from './components/PromoCodesForm'
  import ConfirmModal from 'main_components/ui/ConfirmModal'

  export default {
    name: 'SettingsPromoCodesTable',
    components: {
      PromoCodesForm,
      ConfirmModal
    },
    data: () => ({
      form: null,
      isCreate: false,
      removePromoCodeId: null,
      formErrors: []
    }),
    created () {
      this.getPromoCodes()
    },
    computed: {
      ...mapGetters('backend', ['promocodes', 'account']),
      referralLink () {
        return `https://wazzup24.com/?${this.account.partnerRef}`
      },
      tableFields () {
        return [
          {
            key: 'code',
            label: this.$t(`affiliate.promo.code`)
          },
          {
            key: 'type',
            label: this.$t(`affiliate.promo.type`)
          },
          {
            key: 'validity',
            label: this.$t(`affiliate.promo.validity`)
          },
          {
            key: 'edit',
            label: ''
          }
        ]
      }
    },
    methods: {
      ...mapActions('backend', ['getPromoCodes', 'addPromoCode', 'updatePromoCode', 'deletePromoCode']),
      createdAt (date) {
        return date ? this.$f.dt(date, 'DD.MM.YYYY') : this.$t(`common.Indefinitely`)
      },
      showConfirm (promoCodeId) {
        this.removePromoCodeId = promoCodeId
        this.$root.$emit('bv::show::modal', 'confirmModal')
      },
      onConfirmRemove () {
        if (this.removePromoCodeId) {
          this.deletePromoCode(this.removePromoCodeId).then(res => {
            this.$emit('update')
            this.getPromoCodes()
          }).catch(e => e)
        }
        this.removePromoCodeId = null
      },
      async onCreate (data) {
        this.formErrors = []
        this.addPromoCode({ data, arrayForErrors: this.formErrors }).then(res => {
          this.$emit('update')
          this.$root.$emit('bv::hide::modal', 'addPromoCode')
          this.getPromoCodes()
        }).catch(e => e)
      },
      async onUpdate (data) {
        this.formErrors = []
        this.updatePromoCode({ data, arrayForErrors: this.formErrors }).then(res => {
          this.$emit('update')
          this.$root.$emit('bv::hide::modal', 'editPromoCode')
          this.getPromoCodes()
        }).catch(e => e)
      },
      onEditPromoCode (promoCode) {
        this.formErrors = []
        this.form = promoCode
        this.$root.$emit('bv::show::modal', 'editPromoCode')
      },
      onAddPromoCode () {
        this.formErrors = []
        this.$root.$emit('bv::show::modal', 'addPromoCode')
      }
    }
  }
</script>
