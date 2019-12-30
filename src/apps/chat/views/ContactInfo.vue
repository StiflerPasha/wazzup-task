<!-- eslint-disable max-len -->
<template>
  <b-col lg="4" xl="3" :style="{padding: '0', visibility: panels.contact.opened ? 'visible' : 'hidden' }">
    <div class="wz-right-sidebar">
      <!-- <VuePerfectScrollbar
        id="contactScroll"
        style="overflow: auto; height: 100%"
        infinite-wrapper
      >
        <div class="left-sidebar-wrapper">
          <i style="color: black; float: right; margin-right: 10px; font-size: 20px" class="icon mdi mdi-close d-xl-none" @click="close()"/>
          <div class='round' v-bind:style="{ 'background-image': 'url(' + (currentContact.avatar ? currentContact.avatar : '/static/no_avatar.png') + ')' }"></div>
          <div class="contact-box">
            <InputAutosave style="margin-bottom: 2px;" :save="saveName" :data="currentContact.name" :label="$t(`__old__.name`) + ':'"></InputAutosave>
            <TextareaAutosave style="margin-bottom: 2px;" :save="saveComment" :data="currentContact.comment" :placeholder="$t(`affiliate.withdraw.comment`)"></TextareaAutosave>

            <b-container fluid>
              <b-row align-v="center">
                <b-col sm="3" style="padding: 0;">
                  <h6 class="label">
                    {{ $t(`contact.tags`) }}:
                  </h6>
                </b-col>
                <b-col sm="6" style="padding: 0;">
                  <h6 class="label">
                    <b-badge v-for="tag in selectedTags" :key='tag' class="tag-value" @click="editTags()">
                      {{ tag }}
                    </b-badge>
                    <b-badge v-if="!selectedTags.length" variant="success" class="tag" @click="editTags()">
                      +
                    </b-badge>
                  </h6>
                </b-col>
              </b-row>
            </b-container>

            <b-container fluid>
              <b-row align-v="center">
                <b-col sm="3" style="padding: 0;">
                  <h6 class="label">
                    <i v-if="colorStyle === 'success'" style="color: green" class="icon mdi mdi-check"/>
                    <i v-if="colorStyle === 'danger'" style="color: red" class="icon mdi mdi-close"/>
                    {{ $t(`contact.color`) }}:
                  </h6>
                </b-col>
                <b-col sm="1" style="padding: 0;">
                  <b-dropdown size="sm" style="margin-left: -7px" no-caret variant="link">
                    <b-button slot="button-content" size="sm" :style="{background: colors[colorIndex].value, border: '1px solid black', padding: '0', width: '50px', height: '10px'}"/>
                    <b-dropdown-item v-for="color in colors" :key="color.name" @click="saveColor(color.value)" style="padding-left: 5px; padding-right: 5px; padding-top: 1px; ; padding-bottom: 1px; margin: 0;">
                      <div :style="{background: color.value, width: '10px', height: '10px', display: 'inline-block', border: '1px solid black'}"/>
                      {{ $t(color.name) }}
                    </b-dropdown-item>
                  </b-dropdown>
                </b-col>
              </b-row>
            </b-container>

            <b-container fluid>
              <b-row align-v="center">
                <b-col sm="3" style="padding: 0;">
                  <h6 class="label">
                    {{ $t(`contact.source`) }}:
                  </h6>
                </b-col>
                <b-col sm="6" style="padding: 0;">
                  <h6>
                    {{ channel.name || $t(`contact.no_source`) }}
                  </h6>
                </b-col>
              </b-row>
            </b-container>

            <b-container fluid>
              <b-row>
                <b-col sm="12" style="padding: 0;">
                  <b-dropdown size="sm" variant="success">
                    <div slot="button-content" size="sm" style=" display: inline-block">
                      {{ $t('contact.add_contact_information') }}
                    </div>
                    <b-dropdown-item @click="addPhone()" style="padding-left: 5px; padding-right: 5px; padding-top: 1px; ; padding-bottom: 1px">
                      <i class="icon mdi mdi-phone"></i>
                      {{ $t(`contact.phone_contact`) }}
                    </b-dropdown-item>
                    <b-dropdown-item @click="addInstagram()" style="padding-left: 5px; padding-right: 5px; padding-top: 1px; ; padding-bottom: 1px">
                      <i class="icon mdi mdi-instagram"></i>
                      {{ $t(`contact.instagram_contact`) }}
                    </b-dropdown-item>
                  </b-dropdown>
                </b-col>
              </b-row>
            </b-container>

            <b-container fluid style="margin-top: 10px">
              <b-row align-v="center" v-if="!currentContact.contactDetails.length">
                <b-col sm="12" style="padding: 0;">
                  <h6 style="margin: 0; color: gray" class="text-center">
                    {{ $t('contact.no_contact_details') }}
                  </h6>
                </b-col>
              </b-row>
              <b-row align-v="center" v-for="contactDetail in currentContact.contactDetails" :key='contactDetail.guid'>
                <b-col sm="1" style="padding: 0;">
                  <i v-if="contactDetail.type == 'instagram'" class="icon mdi mdi-instagram" style="color: #cd486b"></i>
                  <i v-else class="icon mdi mdi-phone" style="color: #2E7D32"></i>
                </b-col>
                <b-col sm="4" style="padding: 0;">
                  <h6 style="margin: 0">
                    {{ contactDetail.value }}
                  </h6>
                </b-col>
                <b-col sm="5" style="padding: 0;">
                  <InputAutosave style="float: right;" :save="saveDetailCommentDecorator(contactDetail)" :data="contactDetail.comment" :placeholder="$t(`affiliate.withdraw.comment`)"></InputAutosave>
                </b-col>
                <b-col sm="2" style="padding: 0;">
                  <i class="icon mdi mdi-close-circle" v-b-tooltip.hover :title="$t('contact.delete_link')" style="float: right; cursor: pointer; color: #E57373" @click="deleteContactDetail(contactDetail.guid)"></i>
                  <i class="icon mdi mdi-share" v-b-tooltip.hover :title="$t('contact.share_link')" style="float: right; cursor: pointer; color: #3949AB"></i>
                </b-col>
              </b-row>
            </b-container>

            <b-button variant='danger' size="sm" disabled style='margin-top: 10px; width: 100%' @click="deleteContact()">
              {{ $t('common.delete') }}
            </b-button>
          </div>
        </div>
      </VuePerfectScrollbar> -->
    </div>
  </b-col>
</template>

<script>
  import InputAutosave from 'chat_components/input-autosave.vue'
  import TextareaAutosave from 'chat_components/textarea-autosave.vue'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

  export default {
    data: () => ({
      colors: [
        {
          value: '#fff',
          name: 'colors.white'
        },
        {
          value: '#960018',
          name: 'colors.dark_red'
        },
        {
          value: '#CC0605',
          name: 'colors.red'
        },
        {
          value: '#FF4F00',
          name: 'colors.orange'
        },
        {
          value: '#FFFF00',
          name: 'colors.yellow'
        },
        {
          value: '#177245',
          name: 'colors.dark_green'
        },
        {
          value: '#7FFF00',
          name: 'colors.light_green'
        },
        {
          value: '#00BFFF',
          name: 'colors.light_blue'
        },
        {
          value: '#0047AB',
          name: 'colors.blue'
        },
        {
          value: '#CD00CD',
          name: 'colors.purple'
        }
      ],
      colorIndex: 0,
      colorStyle: ''
    }),
    components: {
      InputAutosave,
      TextareaAutosave,
      VuePerfectScrollbar
    },
    watch: {
      'currentContact.color' () {
        for (let i in this.colors) {
          if (this.colors[i].value === this.currentContact.color) {
            this.colorIndex = i
          }
        }
      }
    },
    computed: {
      panels () {
        return this.$store.getters['backend/panels']
      },
      allTags () {
        return this.$store.getters['backend/account'].tags
      },
      tags () {
        return this.$store.getters['backend/currentContact'].tags
      },
      selectedTags () {
        let tags = []
        for (let selectedTag of this.tags) {
          for (let allTag of this.allTags) {
            if (selectedTag === allTag.guid) {
              tags.push(allTag.name)
            }
          }
        }
        return tags
      },
      currentContact () {
        return this.$store.getters['backend/currentContact']
      },
      channel () {
        return this.$store.getters['backend/channel']
      }
    },
    methods: {
      saveDetailCommentDecorator (detail) {
        let self = this
        let handleFunction = async function (value) {
          if (self.currentContact && self.currentContact.id) {
            await self.$store.dispatch('backend/updateContactDetailComment', {
              id: self.currentContact.id,
              detailId: detail.guid,
              data: {
                comment: value
              }
            })
          }
        }
        return handleFunction
      },
      saveColor (color) {
        this.updateCurrentContact({ color })
          .then(() => {
            this.colorStyle = 'success'
            setTimeout(() => {
              this.colorStyle = ''
            }, 1000)
          }).catch(() => {
            this.colorStyle = 'danger'
            setTimeout(() => {
              this.colorStyle = ''
            }, 1000)
          })
      },
      async saveName (value) {
        await this.updateCurrentContact({name: value})
      },
      async saveComment (value) {
        await this.updateCurrentContact({comment: value})
      },
      async updateCurrentContact (data) {
        if (this.currentContact && this.currentContact.id) {
          data.id = this.currentContact.id
          await this.$store.dispatch('backend/updateCurrentContact', data)
        }
      },
      editTags () {
        this.$emit('editTags')
      },
      addPhone () {
        this.$emit('addPhone')
      },
      addInstagram () {
        this.$emit('addInstagram')
      },
      deleteContact () {
        console.log('deleteContact')
      },
      deleteContactDetail (guid) {
        if (this.currentContact && this.currentContact.id) {
          this.$emit('deleteContactDetail', {
            contactDetailsId: guid,
            contactId: this.currentContact.id
          })
        }
      },
      close () {
        this.$store.commit('backend/CLOSE_CONTACT')
      }
    },
    created () {
    }
  }
</script>

<style lang="scss">
  @import '../../../assets/scss/variables';

  .linkDropDown {
    margin-top: 5px;
    min-width: auto;
    width: 100%;
  }

  .tag-value {
    margin-right: 2px;
    cursor: pointer;
  }

  .round {
    overflow: hidden;
    width: $contact_width * 0.4;
    height: $contact_width * 0.4;
    margin: auto;
    margin-top: 20px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: center;
  }

  .contact-box{
    margin: 20px;
    width: auto;
  }

  .wz-fixed-sidebar {
    .wz-right-sidebar {
      transition: all .3s;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1029;
      .left-sidebar-content {
        position: absolute;
      }
    }
    .toggled {
      right: -$contact_width
    }
  }

  .wz-right-sidebar {
    background-color: #f5f5f5;
    border-left: 1px solid #e3e3e3;
    .right-sidebar-bottom {
      display: block;
      cursor: pointer;
      font-size: 1.077rem;
      padding: 15px 20px;
      color: #646464;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      text-decoration: none;
      &:hover {
        background: #eee;
        color: #404040;
      }
      .icon {
        line-height: 18px;
        font-size: 19px;
        min-width: 19px;
        margin-right: 9px;
        text-align: center;
        vertical-align: middle;
      }
    }
    .right-sidebar-wrapper {
      display: table;
      table-layout: fixed;
      width: 100%;
      height: 100%;
    }
    .right-sidebar-toggle {
      display: none;
      background-color: #FFF;
      padding: 16px 10px;
      color: #404040;
      font-weight: 300;
      font-size: 1.077rem;
    }
    .right-sidebar-spacer {
      height: 100%;
      display: table-row;
    }
    .right-sidebar-scroll {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .right-sidebar-content {
      position: relative;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding-top: 8px;
    }
    .sidebar-elements {
      margin: 0;
      padding: 0;
      .divider {
        padding: 20px 20px 0;
        color: #b0b0b0;
        line-height: 30px;
        font-weight: 600;
        text-transform: uppercase;
        font-size: .8462rem;
      }
    }

    .sidebar-elements>li {
      position: relative;
      list-style: none;
      &:hover:not(.divider) {
        background: #eee;
        a {
          color: #404040;
        }
      }
      .active {
        >a {
          padding-left: 20px;
          font-weight: 500;
          color: #4285f4;
        }
      }
      >a, >.message {
        text-decoration: none;
        cursor: pointer;
        display: block;
        padding: 0 20px;
        color: #646464;
        font-size: 1.077rem;
        line-height: 38px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        .icon {
          line-height: 18px;
          font-size: 19px;
          min-width: 19px;
          margin-right: 9px;
          text-align: center;
          vertical-align: middle;
        }
      }

      >.message {
        position: absolute;
        bottom: 10px;
        width: 100%;
        left: 0;
        font-size: 0.9rem;
        line-height: 16px;
        .message_unreaded {
          float: right;
          border-radius: 25px;
          background: #dc3545;
          color: white;
          width: 19px;
          height: 19px;
          user-select: none;
          line-height: 19px;
          text-align: center;
          font-size: 0.9rem;
        }
      }

      &.chat {
        border-bottom: 1px solid #eee;
        padding-bottom: 25px;
        cursor: pointer;
      }

      &.active {
        background-color: #d8f7ca !important;
      }
    }
  }

  .ps-container {
    -ms-touch-action: auto;
    touch-action: auto;
    overflow: hidden !important;
    -ms-overflow-style: none;
  }

  @media (max-width: 768px) {
    .wz-fixed-sidebar{
      .wz-right-sidebar {
        margin-top: 50px;
        padding-bottom: 50px;
      }
    }
    .wz-right-sidebar {
      .sidebar-elements>li {
          >a, >.message {
            padding: 0 10px;
          }
        }
      &:not(.toggled) {
        width: 100%;
      }
      .right-sidebar-toggle {
        display: block;
      }
      .right-sidebar-spacer {
        display: table-row;
      }
    }
  }
</style>
