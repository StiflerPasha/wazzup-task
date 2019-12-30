<template>
  <li class="chat-element">
    <div class="chat-element-content" :class="{'chat-element-content-you': itsMe, 'chat-element-content-system': isSystem}">
      <div v-if="!isSystem" class="chat-element-content__who">
        <div style="display: flex; align-items: center; margin-bottom: -15px;">
          <i class="icon mdi" :class="GET_ICON('mdi-whatsapp')" style="color: #28a745; font-size: 1.5rem;margin-right: 8px"></i>
          <span>{{ computedChannel.name }}{{ computedAuthorName }}</span>
        </div>
      </div>
      <span class="chat-element-content__message">
        <pre v-if="isText" v-html="htmlContent" />
        <pre v-else-if="isSystem" v-html="systemText" />
        <div v-else-if="isModalOpen" @click="onShowModal">
          <b-img-lazy v-if="isImageThumb" :src="url" center fluid-grow :blank-src="base64Thumb" :alt="filename" />
          <b-img v-else-if="isImageWithoutThumb" :src="url" center fluid-grow :alt="filename" />
          <div v-else-if="isVideo" class="video-helper">
            <b-img :src="base64Thumb"></b-img>
            <i class="icon mdi mdi-play"></i>
          </div>
        </div>
        <audio v-else-if="isAudio" controls style="margin-top: 1rem" preload="metadata">
          <source :src="url" :type="contentType ? contentType.replace('data:', '') : '' /* TODO: временная мера, непонятно почему может не быть contentType */"> <!-- eslint-disable-line max-len -->
        </audio>
        <div v-else-if="isDocument" @click="onDownload" style="cursor: pointer" donwload>
          <i class="icon mdi mdi-file" style="font-size: 4rem; display: block" ></i>
          {{ filename }}
        </div>
        <div v-else-if="isMissCall">
          <i class="icon mdi mdi-phone-missed" style="font-size: 2rem; display: block" ></i>
          {{ $t(`messages.missed_call`) }}
        </div>
        <div v-else style="font-weight: bold;">
          <i class="icon mdi mdi-block-helper" style="font-size: 4rem; display: block" ></i>
          {{ $t(`messages.unsupported_message_type`) }}
        </div>
        <span v-if="!isText && !isMissCall && computedText">
          {{ computedText }}
        </span>
      </span>
      <div class="chat-element-content__time">
        <span>{{ GET_TIME_FORMATED(dateTime) }}</span>
        <span v-if="itsMe" class="h-0" :style="{'color': computedStatus.color}">
          <icon :name="computedStatus.icon"></icon>
        </span>
      </div>
    </div>
    <!-- TODO: сделать так, чтобы модалка удалялась из DOM, т.к. проблема, например, с играющим видео, убрал autoplay из видео, надо будет вернуть -->
    <b-modal ref="files:modal" :hide-header="$DEVICE > 3" hide-footer>
      <div style="text-align: center">
        <img
          v-if="isImage"
          :style="{'max-height': ($store.getters['device_height'] - 125) + 'px'}"
          :src="url"
          style="max-width: 100%;"
        />
        <video style="max-width: 100%; max-height: 100%" controls v-else>
          <source :src="url" :type="contentType ? contentType.replace('data:', '') : '' /* TODO: временная мера, непонятно почему может не быть contentType */"> <!-- eslint-disable-line max-len -->
        </video>
      </div>
      <b-btn variant="success" @click="onDownload" :disabled="downloadPending" style="float: right; margin-top: 20px">
        <template v-if="!downloadPending">
          <i class="icon mdi mdi-download" style="cursor: pointer" ></i> {{ $t(`chat.download`) }}
        </template>
        <preloader size="mini" color="white" v-else></preloader>
      </b-btn>
    </b-modal>
  </li>
</template>

<script>
  import { MESSAGES } from '@/enums'
  import downloadJs from 'downloadjs'
  import validator from 'validator'

  const CRM_LIST = {
    3: 'amocrm',
    4: 'planfix',
    5: 'bitrix'
  }

  export default {
    props: {
      status: {
        type: Number,
        required: true
      },
      url: {
        type: String
      },
      text: {
        type: String
      },
      filename: {
        type: String
      },
      file: {
        type: String
      },
      type: {
        type: Number
      },
      contentType: {
        type: String
      },
      dateTime: {
        type: Number
      },
      channel: {
        type: String
      },
      base64Thumb: {
        type: String
      },
      author: {
        type: String
      },
      phone: {
        type: String
      },
      crmType: {
        type: Number
      },
      crmAuthorName: {
        type: String
      },
      authorName: {
        type: String
      },
      details: {
        type: Object
      }
    },
    beforeMount () {
      if (!this.computedChannel) {
        this.$store.dispatch('backend/get_channels')
      }
    },
    data: () => ({
      downloadPending: false
    }),
    computed: {
      computedChannel () {
        return this.$store.getters['backend/channel'](this.channel)
      },
      computedAuthorName () {
        const { status, author, phone, crmType, crmAuthorName, authorName } = this
        if (status === 99) {
          return author ? `: ${author}, ${phone}` : `: ${phone}`
        } else {
          if (crmType) {
            return `, ${this.$t('__old__.crm.' + CRM_LIST[crmType])}` + `${crmAuthorName ? `: ${crmAuthorName}` : ''}`
          } else if (!crmType && author) {
            return `, WAZZUP${authorName ? `: ${authorName}` : ''}`
          } else {
            return `, ${this.$t(`glossary.authors.phone`)}`
          }
        }
      },
      itsMe () {
        // TODO: в константы
        return (this.status !== 99) && !this.isSystem
      },
      isModalOpen () {
        return this.isImage || this.isVideo
      },
      isText () {
        return this.type === MESSAGES.TYPE_TEXT
      },
      isImageThumb () {
        return this.type === MESSAGES.TYPE_IMAGE && this.base64Thumb
      },
      isImageWithoutThumb () {
        return this.type === MESSAGES.TYPE_IMAGE && !this.base64Thumb
      },
      isImage () {
        return this.type === MESSAGES.TYPE_IMAGE
      },
      isAudio () {
        return this.type === MESSAGES.TYPE_AUDIO
      },
      isVideo () {
        return this.type === MESSAGES.TYPE_VIDEO
      },
      isDocument () {
        return this.type === MESSAGES.TYPE_DOC
      },
      isMissCall () {
        return (this.type === MESSAGES.TYPE_MISS_AUDIO) || (this.type === MESSAGES.TYPE_MISS_VIDEO)
      },
      isSystem () {
        // TODO: перенести в константы
        return (this.type >= 91) && (this.type <= 99)
      },
      computedStatus () {
        const { status } = this

        return {
          icon: MESSAGES.ICONS[status] ? MESSAGES.ICONS[status] : MESSAGES.ICONS[0],
          color: MESSAGES.COLORS[status] ? MESSAGES.COLORS[status] : MESSAGES.COLORS[0]
        }
      },
      htmlContent () {
        const data = this.text.split(' ')
        const result = []
        data.forEach(word => {
          let wordToAdd = word
          // Пока закомментировал без протокала, т.к. выражения типа ".... все.Спасибо" превращались в ссылку
          /*
          if (validator.isURL(word)) {
            if (validator.isURL(word, {require_protocol: true})) {
              wordToAdd = `<a href="${word}" target="_blank" rel="noopener noreferrer">${word}</a>`
            } else {
              wordToAdd = `<a href="http://${word}" target="_blank" rel="noopener noreferrer">${word}</a>`
            }
          }
          */
          if (validator.isURL(word, {require_protocol: true})) {
            wordToAdd = `<a href="${word}" target="_blank" rel="noopener noreferrer">${word}</a>`
          }
          result.push(wordToAdd)
        })
        return result.join(' ')
      },
      systemText () {
        // TODO: временно, сделать по-нормальному
        return this.$t(`chat.system_messages.type_${this.type}`, { channel: this.computedChannel.name, count: (this.details && this.details.count) || ' ' })
      },
      computedText () {
        if ((typeof this.text === 'string') && (this.text.trim() !== '')) {
          return this.text.trim()
        } else {
          return false
        }
      }
    },
    methods: {
      onDownload () {
        this.downloadPending = true
        const { url, type, filename } = this
        this.$store.dispatch('backend/request_download', url).then(data => {
          downloadJs(data, filename, type)
          this.downloadPending = false
          this.$emit('hide:modal')
        })
      },
      onShowModal () {
        this.$refs['files:modal'].show()
      },
      onHideModal () {
        this.$refs['files:modal'].hide()
      }
    }
  }
</script>

<style>

</style>
