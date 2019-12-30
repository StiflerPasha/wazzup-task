<template>
  <b-card
    :title="$t(`channels.list`)"
  >
    <template v-if="Object.keys(channels).length > 0 && !pending">
      <b-table class="mt-4 mb-4 channels_table" :items="channels_views" :fields="fields">
        <template slot="icon" slot-scope="row">
          <div class="icon_to_center">
            <i class="icon mdi" :class="GET_ICON('mdi-whatsapp')" style="color: #28a745"></i>
          </div>
        </template>
        <template slot="edit" slot-scope="row">
          <b-button @click="edit_channel(row.value.id)" variant="outline-success" v-if="row.value.text !== 'continue'">
            {{ $t(`common.edit`) }}
          </b-button>
        </template>
        <template slot="status" slot-scope="row">
          <template v-if="row.item.edit.state !== 'unsupportedLanguage'">
            <template v-if="row.item.edit.text === 'edit' || row.item.edit.text === 'continue' || row.item.edit.show">
              {{ row.value }}
              <template v-if="row.item.edit.show">
                <br><br>
              </template>
            </template>
            <b-button
              @click="open_reinit_modal(row.item.edit.id)"
              :variant="row.item.edit.btn"
              v-if="row.item.edit.text !== 'edit' && row.item.edit.text !== 'continue'"
            >
              <template v-if="enablePending !== row.item.edit.id">
                {{ $t(row.item.edit.text) }}
              </template>
              <preloader v-else color="white" size="mini"></preloader>
            </b-button>
          </template>
          <template v-else>
            {{ $t(`__old__.channel_bad_language`) }}<br>
            {{ $t(`__old__.channel_bad_language_2`) }}<br>
            {{ $t(`__old__.channel_bad_language_3`) }}
            <a :href="$t(`__old__.channel_bad_language_url`)" target="_blank">{{ $t(`__old__.channel_bad_language_4`) }}</a>
            <br><br>
            <b-button @click="open_reinit_modal(row.item.edit.id)" variant="light">
              <template v-if="enablePending !== row.item.edit.id">
                {{ $t(`common.buttons.try_again`) }}
              </template>
              <preloader v-else size="mini"></preloader>
            </b-button>
          </template>
        </template>
      </b-table>
      <b-button
        v-b-modal.channels_add_new
        style="float: right"
        size="lg"
        @click="add_channel"
        variant="success"
      >
        {{ $t(`common.buttons.add`) }}
      </b-button>
    </template>
    <preloader v-else-if="pending"></preloader>
    <template v-else>
      <div class="promocodes">
        {{ $t(`channels.table.channels_missing`) }}<br>
        <b-button v-b-modal.channels_add_new style="margin-top: 20px" size="lg" @click="add_channel" variant="success">
          {{ $t(`common.buttons.add`) }}
        </b-button>
      </div>
    </template>

    <b-modal
      id="channels_add_new"
      hide-footer
      ref="channels_ref"
      @hidden="onHidden()"
      :title="$t(reQR ? '__old__.try_again_button_quirdle' : '__old__.channel_create_new')"
    >
      <div class="mb-4" style="text-align: center">
        <transition-group name="fade">
          <img key="img" v-if="newChannelData.qr && reinit === false && (!newChannelData.phone || reQR) && Date.now() < newChannelData.qrIdleAt" :src="newChannelData.qr"><!-- eslint-disable-line max-len -->
          <span key="phone" v-if="newChannelData.phone && reinit === false && reQR === false" class="channels_add_phone">+{{ newChannelData.phone }}</span><!-- eslint-disable-line max-len -->
          <span key="phone" v-if="reinit === true" class="channels_add_phone">
            <template v-if="reinit === true && newChannelData.state !== 'qridle' && newChannelData.state !== 'unsupportedLanguage' && newChannelData.phone"><!-- eslint-disable-line max-len -->
              {{ '+' + newChannelData.phone }}<br>
            </template>
            <div v-else-if="newChannelData.state === 'unsupportedLanguage'" style="font-size: 1.2rem">
              {{ $t(`__old__.channel_bad_language`) }}<br>
              {{ $t(`__old__.channel_bad_language_2`) }}<br>
              {{ $t(`__old__.channel_bad_language_3`) }}
              <a :href="$t(`__old__.channel_bad_language_url`)" target="_blank">{{ $t(`__old__.channel_bad_language_4`) }}</a>
            </div>
            <template v-if="newChannelData.state !== 'unsupportedLanguage'">
              {{ newChannelData.state === 'qridle'
              ? $t(`channels.notifications.time_is_up`) : states[newChannelData.state].name }}
            </template>
          </span>
        </transition-group>
        <preloader style="height: 264px" class="place-flex" v-if="(!newChannelData.qr && !newChannelData.phone && reinit === false) || (!newChannelData.qr && reQR && reinit === false) || (newChannelData.state === 'qr' && newChannelData.qr && Date.now() >= newChannelData.qrIdleAt)"></preloader> <!-- eslint-disable-line max-len -->
      </div>
      <template v-if="!reQR || reinit">
        <template v-if="reinit === false || (newChannelData.state !== 'qridle' && newChannelData.state !== 'unsupportedLanguage' && newChannelData.state !== 'openelsewhere' && newChannelData.state !== 'foreignphone')"> <!-- eslint-disable-line max-len -->
          <label for="channel_name">{{ $t(`channels.channel_name`) }}</label>
          <b-form-input id="channel_name"
                        v-model.trim="name"
                        type="text"
                        aria-describedby="channel_name_feedback"
                        :state="nameState"></b-form-input>
          <b-form-invalid-feedback id="channel_name_feedback">
            <!-- This will only be shown if the preceeding input has an invalid state -->
            Enter at least 3 letters
          </b-form-invalid-feedback>
          <b-alert show class="mt-4 mb-4">
            {{ $t(`channels.channels_first_load_comment`) }}
          </b-alert>
          <b-btn :disabled="!canFinish" class="mt-4 mb-3" variant="success"  @click="accept_channel" block>{{ $t(`common.add`) }}</b-btn>
        </template>
        <template v-else>
          <b-btn class="mt-4 mb-3" variant="primary" block @click="reinit_channel">{{ $t(`channels.retry`) }}</b-btn>
        </template>
      </template>
    </b-modal>

    <b-modal id="channels_edit" hide-footer ref="channels_edit_ref" @hide="onEditHide" @hidden="onEditHidden" :title="$t(`channels.channel_edit`)">
      <template v-if="currentCreatingGuid && channels[currentCreatingGuid]">
        <b-alert variant="danger"
                 :show="editCanclePrevent">
          {{ $t(`channels.you_should_save`) }}
        </b-alert>
        <span
          key="phone"
          v-if="channels[currentCreatingGuid].phone"
          class="channels_add_phone"
          style="height: 120px"
        >
          +{{ channels[currentCreatingGuid].phone }}
        </span>
        <label for="channel_name">{{ $t(`channels.channel_name`) }}</label>
        <b-form-input id="channel_name"
                      v-model.trim="name"
                      type="text"
                      aria-describedby="channel_name_feedback"
                      :state="nameState">
        </b-form-input>
        <label class="mt-4">{{ $t(`channels.channel_tariff`) }}</label>
        <b-form-radio-group class="mb-4"
                            v-model="tariffOption"
                            :options="tariffOptions"
                            stacked
                            name="radiosStacked">
        </b-form-radio-group>
        <b-btn class="mt-4 mb-3"
               :variant="isChannelDisabled ? 'success' : 'danger'"
               block
               @click="isChannelDisabled = !isChannelDisabled ">
          {{ $t(isChannelDisabled ? '__old__.turn_on' : '__old__.turn_off') }}
        </b-btn>
        <b-btn class="mt-4 mb-3"
               variant="success"
               style="float:right"
               :disabled="!canSaveEdit"
               @click="saveEdited">
          {{ $t(`common.save`) }}
        </b-btn>
      </template>
    </b-modal>
  </b-card>
</template>

<script>
  // TODO пересобрать этот компонент. Макароны вышли, не понятно ничего
  export default {
    data: () => ({
      tariffOption: '',
      name: '',
      nameState: null,
      currentCreatingGuid: '',
      newChannelIsAccepted: false,
      newChannelData: {},
      reinit: false,
      enablePending: '',
      waitingForInit: false,
      reQR: false,
      isChannelDisabled: null,
      saveAnyWay: false,
      editCanclePrevent: false
    }),
    watch: {
      'newChannelData' (data) {
        if (data.delete === true) {
          this.$refs.channels_ref.hide()
          this.$a.push({
            type: 'danger',
            text: this.$t(`channels.notifications.try_again`)
          })
        }
        if (data.state !== 'init' && data.state !== 'active' && data.state !== 'qr') {
          this.reinit = true
        }
        if (!data.state) {
          this.reinit = false
        }
      }
    },
    methods: {
      saveEdited () {
        this.$store.dispatch('backend/update_channel', {
          guid: this.currentCreatingGuid,
          tariff: this.tariffOption,
          name: this.name,
          blocked: this.isChannelDisabled
        })
          .then(res => {
            this.saveAnyWay = true
            this.$refs.channels_edit_ref.hide()
            this.$a.push({
              type: 'success',
              text: this.$t(`channels.notifications.channel_update`)
            })
          })
      },
      onEditHidden () {
        this.editCanclePrevent = false
        this.saveAnyWay = false
        this.currentCreatingGuid = ''
      },
      onEditHide (e) {
        if (this.canSaveEdit && !this.editCanclePrevent && !this.saveAnyWay) {
          e.preventDefault()
          this.editCanclePrevent = true
        } else {
          this.name = ''
          this.tariffOption = ''
          this.isChannelDisabled = null
        }
      },
      edit_channel (id) {
        this.$refs.channels_edit_ref.show()
        this.currentCreatingGuid = id
        this.name = this.channels[id].name
        this.tariffOption = this.channels[id].tariff
        this.isChannelDisabled = this.channels[id].state === 'blocked'
      },
      continue_init (id) {
        this.currentCreatingGuid = id
        this.$refs.channels_ref.show()
        this.$eb.$on('backend/channelInit', (data) => {
          this.handleChannelInitSocket(data)
        })
      },
      open_reinit_modal (id) {
        this.currentCreatingGuid = id
        this.newChannelData = this.channels[id]
        if (this.newChannelData.state === 'qridle' || this.newChannelData.state === 'foreignphone') {
          this.waitingForInit = true
          this.reQR = true
          this.reinit_channel()
        } else if (this.newChannelData.state === 'qr') {
          this.reQR = true
          this.$refs.channels_ref.show()
        } else if (this.newChannelData.state === 'openelsewhere' || this.newChannelData.state === 'unsupportedLanguage') {
          this.enablePending = id
          this.reinit_channel()
        } else {
          this.reinit = true
          this.$refs.channels_ref.show()
        }
      },
      reinit_channel () {
        this.$store.dispatch('backend/reinit_channel', this.currentCreatingGuid)
          .then(res => {
            this.reinit = false
          })
      },
      accept_channel () {
        this.$store.dispatch('backend/accept_channel', this.canFinish)
          .then(() => {
            this.$store.dispatch('backend/get_channels')
            this.newChannelIsAccepted = true
            this.$refs.channels_ref.hide()
            this.$a.push({
              type: 'success',
              text: this.$t(`channels.notifications.channel_added`)
            })
          })
          .catch(e => {
            this.$refs.channels_ref.hide()
            // shame
            if (e.error.data.backend) {
              if (e.error.data.backend.indexOf('Can\'t accept channel') === -1) {
                this.$a.push({
                  type: 'danger',
                  text: this.$t(`channels.notifications.try_again`)
                })
              } else {
                this.$a.push({
                  type: 'danger',
                  text: this.$t(`__old__.channel_already_in_use`)
                })
              }
            } else {
              this.$a.push({
                type: 'danger',
                text: this.$t(`channels.notifications.try_again`)
              })
            }
          })
      },
      add_channel () {
        this.$store.dispatch('backend/add_channel')
          .then(channelGuid => {
            this.$store.dispatch('backend/get_channels')
            this.currentCreatingGuid = channelGuid.data.guid
            this.$eb.$on('backend/channelInit', (data) => {
              this.handleChannelInitSocket(data)
            })
          })
      },
      handleChannelInitSocket (data) {
        if (data.guid === this.currentCreatingGuid) {
          this.newChannelData = data
        }
      },
      onHidden () {
        if (!this.newChannelIsAccepted && this.newChannelData.guid && this.newChannelData.temporary) {
          this.$store.dispatch('backend/delete_channel', this.newChannelData.guid)
        }
        this.newChannelData = {}
        this.reinit = false
        this.currentCreatingGuid = ''
        this.newChannelIsAccepted = false
        this.waitingForInit = false
        this.reQR = false
      }
    },
    props: ['pending'],
    computed: {
      canSaveEdit () {
        let can = false
        const channel = this.channels[this.currentCreatingGuid]
        const condition = {
          name: this.name !== channel.name,
          tariff: this.tariffOption !== channel.tariff,
          blocked: this.isChannelDisabled === (channel.state !== 'blocked')
        }
        for (const cond in condition) {
          if (condition[cond] && !can) {
            can = true
          }
        }
        return can
      },
      canFinish () {
        let can = true
        const condition = {
          name: this.name !== '',
          phone: this.newChannelData.phone && this.newChannelData.phone !== '',
          reinit: !this.reinit
        }
        for (const cond in condition) {
          if (!condition[cond]) {
            can = false
          }
        }
        if (can) {
          return {
            name: this.name,
            guid: this.currentCreatingGuid
          }
        } else {
          return false
        }
      },
      tariffOptions () {
        return [
          { text: this.$t(`__old__.tariffs.whatsapp_start_info`), value: 'start' },
          { text: this.$t(`__old__.tariffs.whatsapp_pro_info`), value: 'pro' },
          { text: this.$t(`__old__.tariffs.whatsapp_proplus_info`), value: 'proplus' }
        ]
      },
      channels () {
        return this.$store.getters['backend/channels']
      },
      fields () {
        return [
          {
            key: 'icon',
            label: ''
          },
          {
            key: 'name',
            label: this.$t(`__old__.table_channels_name`)
          },
          {
            key: 'number',
            label: this.$t(`__old__.table_channels_number`)
          },
          {
            key: 'status',
            label: this.$t(`__old__.table_channels_status`)
          },
          {
            key: 'tariff',
            label: this.$t(`__old__.table_channels_tariff`)
          },
          {
            key: 'edit',
            label: ''
          }
        ]
      },
      states () {
        return {
          blocked: {
            name: this.$t(`__old__.channel_blocked`),
            color: 'danger',
            state: 'blocked'
          },
          init: {
            name: this.$t(`__old__.channel_init`),
            color: 'info',
            state: 'init'
          },
          active: {
            name: this.$t(`__old__.channel_active`),
            color: 'success',
            state: 'active'
          },
          qr: {
            name: this.$t(`__old__.channel_qr`),
            color: 'warning',
            button: '__old__.try_again_button_quirdle',
            state: 'qr',
            button_color: 'light'
          },
          qridle: {
            name: this.$t(`__old__.channel_qridle`),
            color: 'warning',
            button: '__old__.try_again_button_quirdle',
            button_color: 'light'
          },
          phoneUnavailable: {
            name: this.$t(`__old__.channel_phone_unavalible`),
            color: 'danger',
            state: 'phoneUnavailable'
          },
          openelsewhere: {
            name: this.$t(`__old__.channel_fail_open`),
            color: 'warning',
            button: '__old__.channel_enable_here',
            button_color: 'success',
            state: 'openelsewhere'
          },
          unsupportedLanguage: {
            name: this.$t(`__old__.channel_bad_language`),
            color: 'danger',
            button: 'channels.retry',
            button_color: 'outline-info',
            state: 'unsupportedLanguage'
          },
          notEnoughMoney: {
            name: this.$t(`__old__.channel_money`),
            color: 'danger',
            state: 'notEnoughMoney'
          },
          foreignphone: {
            name: this.$t(`__old__.channel_foreignphone`),
            state: 'foreignphone',
            color: 'danger',
            button_color: 'light',
            button: '__old__.try_again_btn',
            show: true
          }
        }
      },
      channels_views () {
        let array = []
        for (const key in this.channels) {
          const channel = this.channels[key]
          array.push({
            icon: '',
            name: channel.name,
            number: channel.phone ? '+' + channel.phone : '',
            status: this.states[channel.state].name,
            tariff: this.$t(`__old__.tariffs.whatsapp_${channel.tariff}`),
            edit: !this.states[channel.state].button
              ? {
                id: channel.guid,
                text: 'edit',
                btn: 'outline-success',
                state: channel.state
              }
              : {
                id: channel.guid,
                text: this.states[channel.state].button,
                btn: this.states[channel.state].button_color || 'outline-success',
                state: channel.state,
                show: !!this.states[channel.state].show
              },
            _rowVariant: this.states[channel.state].color,
            _cellVariants: {icon: 'light', edit: 'light'}
          })
        }
        array = array.reduce((arr, item) => {
          arr.push(item)
          return arr
        }, [])
        return array
      }
    },
    created () {
      this.$eb.$on('backend/channelReInit', (data) => {
        if (this.enablePending === data.guid) {
          this.$nextTick(function () {
            this.enablePending = ''
          })
        }
        if (this.waitingForInit && data.state === 'init' && this.currentCreatingGuid === data.guid) {
          this.$refs.channels_ref.show()
        }
      })
      this.$eb.$on('backend/channelUpdate', (data) => {
        if (this.currentCreatingGuid === data.guid) {
          this.$nextTick(function () {
            this.newChannelData = data
            if (data.state === 'active') {
              this.$refs.channels_ref.hide()
            }
            if (data.state === 'foreignphone') {
              this.reinit = true
            }
          })
        }
      })
    }
  }
</script>

<style lang="scss">
  .promocodes {
    text-align: center;
    font-size: 2rem;
    padding: 30px 0;
  }
  .channels_add_phone {
    height: 264px;
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 2.5rem;
    justify-content: center;
  }
</style>
