<template>
  <div :class="{'chat-textfield-mobile': $DEVICE <= 3, 'chat-textfield': $DEVICE > 3}">
    <b-input-group style="position: relative" :class="{'show-mobile': mobileMore}">
      <attachment @files="emitFileLoading" v-if="!mobileMore"></attachment>
      <div style="position: relative; padding: 0" id="textarea" v-if="!mobileMore" class="form-control">
        <textarea @keydown="getKeydownAction" ref="input" v-model="text">
        </textarea>
      </div>
      <b-input-group-append>
        <template v-if="Object.keys(channels).length">
          <template v-if="$DEVICE > 3">
            <b-btn variant="success" id="ddown2" :disabled="!Object.keys(channels).length" @click="sendMessage()">
              <template v-if="deals">
                <i class="icon mdi mdi-send" style="font-size: 1.4rem;"></i>
              </template>
              <template v-else>
                {{ $t(`common.send`) }}
              </template>
            </b-btn>
            <template v-if="deals">
                <b-btn v-if="!deals.length" variant="info" id="deal" @click="createDeal($event)">
                {{ $t(`integrations.amocrm.make_a_deal`) }}
              </b-btn>
              <b-dropdown v-else id="ddown12" :text="$t(`integrations.amocrm.go_to_deal`)" variant="info">
                <b-dropdown-item :key="deal.name" @click="gotoDeal(deal, $event)" v-for="deal in deals">{{ deal.name }}</b-dropdown-item>-->
              </b-dropdown>
            </template>
            <b-dropdown id="ddown1" v-b-tooltip.prevent.hover :text="channel_dropdown_message" variant="success">
              <b-dropdown-item :key="channel.name" @click="changeChannel(channel)" v-for="channel in channels">{{ channel.name }}</b-dropdown-item>
            </b-dropdown>
            <b-tooltip target="ddown1" :placement="'right'">
              {{ channel_dropdown_message_full() }}
            </b-tooltip>
            <b-btn
              variant="outline-danger"
              @click="noNeedAnswer()"
              v-html="$t(`chat.no_need_answer_short`)"
              style="line-height: 1.2; max-height: 39px; padding-top: 0px; padding-bottom: 0px;"
            ></b-btn>
          </template>
          <template v-else>
            <div v-if="!mobileMore" id="ddown2">
              <b-btn variant="success" :disabled="!Object.keys(channels).length" @click="sendMessage()">
                <i class="icon mdi mdi-send"></i>
              </b-btn>
              <b-btn variant="info" :disabled="!Object.keys(channels).length" @click="mobileMore = !mobileMore" class="bigg">
                <i class="icon mdi mdi-chevron-right"></i>
              </b-btn>
            </div>
            <template v-else>
              <b-dropdown id="ddown1" v-b-tooltip.prevent.hover :text="channel_dropdown_message" variant="success">
                <b-dropdown-item :key="channel.name" @click="changeChannel(channel)" v-for="channel in channels">{{ channel.name }}</b-dropdown-item>
              </b-dropdown>
              <b-tooltip target="ddown1" :placement="'right'">
                {{ channel_dropdown_message_full() }}
              </b-tooltip>
              <!--<b-btn variant="info" v-if="deals || 1" id="deal" @click="sendMessage()">-->
                <!--{{ $t(`chat.no_need_answer`) }}-->
              <!--</b-btn>-->
              <b-btn variant="danger" id="noanswer" @click="noNeedAnswer()">{{ $t(`chat.no_need_answer`) }}</b-btn>
              <b-btn variant="info" :disabled="!Object.keys(channels).length" @click="mobileMore = !mobileMore" class="bigg">
                <i class="icon mdi mdi-chevron-left"></i>
              </b-btn>
            </template>
          </template>
        </template>
        <b-btn v-else variant="danger" @click="$router.push({
            name: 'settings-channels',
            params: {
              app: 'settings',
              type: 'channels'
            }
          })">{{ $t(there_are_enabled_channels ? `__old__.no_channels_available` : `__old__.add_channel_before_send`) }}</b-btn>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
  //  import debounce from 'lodash.debounce'
  import attachment from './attachments.vue'
  export default {
    data: () => ({
      text: '',
      editorOptions: {
        formats: ['img'],
        modules: {
          toolbar: false
        }
      },
      mobileMore: false,
      content: ''
    }),
    components: {
      attachment
    },
    props: ['channels', 'there_are_enabled_channels', 'current_channel', 'deals', 'value', 'contact'],
    watch: {
      text () {
        this.areaAutosize()
        this.$emit('input', this.text)
      },
      value (newValue) {
        if (this.text !== newValue) {
          this.text = newValue
        }
      }
    },
    methods: {
      noNeedAnswer () {
        this.$store.dispatch('backend/update_contact_no_answer', { guid: this.contact.guid, channel: this.current_channel.guid })
      },
      createDeal (event) {
        if (window.__wz_debug) console.log('click to createDeal', event)
        this.$emit('createDeal', event)
      },
      gotoDeal (deal = false, event) {
        if (window.__wz_debug) console.log('click to gotoDeal', deal, event)
        this.$emit('gotoDeal', deal, event)
      },
      emitFileLoading (files) {
        this.$emit('files', files)
      },
      sendMessage () {
        if (!this.current_channel || !this.current_channel.guid) {
          this.$a.push({ type: 'danger', text: this.$t(`chat.errors.need_choose_channel`) })
          return
        }
        if (this.text && this.text.trim()) {
          this.$emit('send')
        }
      },
      changeChannel (channel) {
        this.$emit('changeChannel', channel)
      },
      add_emoji (emoji) {
        this.text += emoji.colons
      },
      addToText (key) {
        //        console.log(key)
      },
      areaAutosize (add = true) {
        const el = this.$refs.input.target ? this.$refs.input.target : this.$refs.input
        setTimeout(() => {
          el.style.cssText = this.$DEVICE <= 3 ? 'height:35px;' : 'height:39px;'
          el.style.cssText = 'height:' + (Number(el.scrollHeight) + ((add) ? 0 : 0)) + 'px'
        }, 0)
      },
      getKeydownAction (e) {
        if (e.key === 'Enter' && e.shiftKey === false) {
          e.preventDefault()
          this.sendMessage()
        } else if (e.key === 'Enter' && e.shiftKey === true) {
          this.text += '\n'
        }
      },
      channel_dropdown_message_full () {
        return `${this.$t(`__old__.channel`)}: ${this.current_channel.name}`
      }
    },
    computed: {
      channel_dropdown_message () {
        let message = `${this.current_channel.name}`
        if (message.length > 12) {
          message = message.slice(0, 11) + '...'
        }
        return message
      },
      parsed_text () {
        const matches = this.text.match(/\:[\_\-a-z]+\:|[a-zA-Z\wа-яА-Я\s\d]+/g) // eslint-disable-line no-useless-escape
        const arr = []
        if (matches) {
          matches.forEach(match => {
            if (match.match(/\:[\_\-a-z]+\:/g)) { // eslint-disable-line no-useless-escape
              arr.push({
                type: 'emoji',
                text: match.replace(/:/g, '')
              })
            } else {
              arr.push({
                type: 'text',
                text: match
              })
            }
          })
        }
        return arr
      }
    },
    beforeMounted () {
      this.text = this.value
    }
  }
</script>

<style lang="scss">

  .quill-fixing {
    padding: 0;
    border: 0;
    .ql-container {
      position: absolute;
      width: 100%;
      bottom: 0;
      height: auto;
      background: white;
      .ql-editor {
        padding: 10px 10px 7px;
        font-size: 1.2rem;
        line-height: 1.1;
        min-height: inherit;
        p {
          font-size: inherit;
          vertical-align: middle;
          img {
            margin-bottom: 2px;
            margin-top: -2px;
          }
        }
      }
    }
  }
  .form-control {
    textarea {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 10px 10px;
      border: none;
      height: 39px;
      resize: none
    }
  }

  .chat-textfield-popover {
    margin: -0.5rem -0.75rem;
    .popover-body {
      padding: 0;
    }
    .list-group-item {
      border-right: none;
      cursor: pointer;
      border-left: none;
      border-bottom: none;
      position: relative;
      padding-left: 3.2rem;
      padding-top: 0.9rem;
      padding-bottom: 0.9rem;
      &:first-child {
        border-top: none;
      }
      &:hover {
        background-color: #eee;
      }
      .icon {
        font-size: 1.8rem;
        position: absolute;
        bottom: 3px;
        left: 10px;
        color: #2f3235
      }
    }
  }
</style>
