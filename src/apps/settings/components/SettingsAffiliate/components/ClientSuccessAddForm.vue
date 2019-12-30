<template>
  <b-modal
    :title="$t('clients.addClientSuccess.title')"
    ref="client_success_add_modal"
    hide-footer
    size="lg"
  >
    <b-row>
      <b-col>
        {{ $t('clients.addClientSuccess.accountId') }}
      </b-col>
      <b-col style="text-align: right;">
        {{ $f.accId(accountId) }}
      </b-col>

      <div class="w-100"></div>&nbsp;<div class="w-100"></div>

      <b-col>
        {{ $t('clients.addClientSuccess.emailSentTo') }}
      </b-col>
      <b-col style="text-align: right;">
        {{ email }}
      </b-col>

      <div class="w-100"></div>&nbsp;<div class="w-100"></div>

      <b-col>
        {{ $t('clients.addClientSuccess.accountLink') }}
      </b-col>
      <b-col style="text-align: right;">
        {{ `https://${subdomain}.wazzup24.com` }}
      </b-col>

      <div class="w-100"></div>&nbsp;<div class="w-100"></div>

      <b-col>
        <b-button @click="gotoAccount" variant="success" style="width: 100%">
          {{ $t(`clients.addClientSuccess.gotoAccount`) }}
        </b-button>
      </b-col>
      <b-col>
        <b-button @click="stayHere" variant="success" style="width: 100%">
          {{ $t(`clients.addClientSuccess.stayHere`) }}
        </b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
  export default {
    name: 'ClientSuccessAddForm',
    props: {
    },
    data: () => ({
      accountId: 0,
      email: '',
      subdomain: ''
    }),
    computed: {
    },
    watch: {
    },
    methods: {
      gotoAccount () {
        // TODO: сделать по-человечески через константы
        window.location.href = `https://${this.subdomain}.wazzup24.com`
      },
      stayHere () {
        this.$refs.client_success_add_modal.hide()
      }
    }
  }
</script>
