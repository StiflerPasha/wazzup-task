<template>
  <div @dragover="dragOver" @dragleave="dragExit" @drop="dragDrop" @dragend="dragExit" class="chat-attachment">
    <div v-if="isDrag" class="chat-attachment chat-attachment__dragingHolder" style="z-index: 100000;top: 50px; display: flex; justify-content: center; align-items: center; background-color: rgba(255,255,255,0.7)"> <!-- eslint-disable-line max-len -->
      <div class="chat-attachment__dragingPage" style="width: 90%; height: 90%; border: 7px dashed #ccc; display: flex; justify-content: center; align-items: center; font-size: 2.5rem; color: #ccc"> <!-- eslint-disable-line max-len -->
        Перетяните файл сюда
      </div>
    </div>
    <div class="chat-attachment__header">
      <i @click="exit()" class="icon mdi mdi-close"></i><span>{{ $t(`__old__.preview`) }}</span>
    </div>
    <div class="chat-attachment__body">
      <div class="chat-attachment__main-img">
        <!--<b-img :src="main.src" v-if="main.type === 'image'" fluid alt="Responsive image" />-->
        <template v-if="main">
          <b-img :src="main.src" v-if="main.type === 'image'" fluid alt="Responsive image" />
          <template v-else-if="main.type === 'video'">
            <video controls style="max-width: 100%; max-height: 250px">
              <source :src="main.src" :type="main.TYPE">
            </video>
          </template>
          <template v-else>
            <i class="icon mdi mdi-file" style="font-size: 4rem"></i>
            <div>{{ main.name }}</div>
            <template v-if="!changingMain">
              <audio v-if="main.type === 'audio'" controls style="margin-top: 1rem" :style="{'margin-bottom': main.name}">
                <source :src="main.src" :type="main.TYPE">
              </audio>
            </template>
          </template>
        </template>
      </div>
      <!--<b-input-group style="padding: 0 9rem">-->
        <!--<b-form-textarea-->
          <!--ref="input"-->
          <!--size="lg"-->
          <!--v-model="text"-->
          <!--:placeholder="$t(`__old__.enter_your_signature`)">-->
        <!--</b-form-textarea>-->
        <!--&lt;!&ndash;<b-input-group-append id="filetext">&ndash;&gt;-->
          <!--&lt;!&ndash;<b-btn tabindex="5" variant="outline-success">&ndash;&gt;-->
            <!--&lt;!&ndash;<template>&ndash;&gt;-->
              <!--&lt;!&ndash;{{ $t(`auth.make_some_wizzard`) }}&ndash;&gt;-->
            <!--&lt;!&ndash;</template>&ndash;&gt;-->
          <!--&lt;!&ndash;</b-btn>&ndash;&gt;-->
        <!--&lt;!&ndash;</b-input-group-append>&ndash;&gt;-->
      <!--</b-input-group>-->
      <div class="mobileFlex">
        <button v-if="$DEVICE <= 3" @click="send" :disabled="uploading" class="chat-attachment__sendButton">
          <i v-if="!uploading" class="icon mdi mdi-send"></i>
          <preloader color="white" style="margin-top: 8px" v-else></preloader>
        </button>
      </div>
      <div v-if="$DEVICE > 3" class="chat-attachment__sliderHolder">
        <button @click="send" :disabled="uploading" class="chat-attachment__sendButton">
          <i v-if="!uploading" class="icon mdi mdi-send"></i>
          <preloader color="white" style="margin-top: 8px" v-else></preloader>
        </button>
        <carousel
        :perPage="12">
          <slide :key="key" v-for="(file, key) in files">
            <div @click="pick_picture(key)" class="chat-attachment__thumb-box" style="position: relative">
              <preloader v-if="uploading" style="position: absolute; align-items: center; display: flex; width: 100%; height: 100%; background-color: rgba(255,255,255,0.5)"></preloader> <!-- eslint-disable-line max-len -->
              <div class="close">
                <i @click="deleteFile(file.i)" class="icon mdi mdi-close"></i>
              </div>
              <b-img :src="file.src" v-if="file.type === 'image'" :alt="file.name" />
              <template v-else-if="file.type === 'video'">
                <b-img :src="file.preview" :alt="file.name" />
                <i v-if="!uploading" class="icon mdi mdi-play" style="font-size: 4rem;position: absolute; top: 15px; right: 20px"></i>
              </template>
              <template v-else>
                <i v-if="!uploading" class="icon mdi mdi-file" style="font-size: 4rem"></i>
              </template>
            </div>
          </slide>
          <slide v-if="$DEVICE > 3">
            <div class="chat-attachment__thumb-box added" @click="emitAddingFile">
              <i class="icon mdi mdi-plus"></i>
            </div>
          </slide>
        </carousel>
      </div>
      <file-uploader ref="uploader" @files="addFiles"></file-uploader>
    </div>
  </div>
</template>

<script>
  import { Carousel, Slide } from 'vue-carousel'
  import fileUploader from './fileUploader.vue'
  import uploaderMixin from './fileUploadMixin'
  export default {
    data: () => ({
      text: '',
      current: 0,
      changingMain: false,
      main: false,
      isDrag: false
    }),
    mixins: [uploaderMixin],
    components: {
      Carousel,
      Slide,
      fileUploader
    },
    props: ['files', 'uploading'],
    watch: {
      text () {
        this.areaAutosize()
      }
    },
    methods: {
      start () {
        if (this.files[this.current]) {
          this.main = this.files[this.current]
        } else {
          this.main = false
        }
      },
      dragDrop (e) {
        e.preventDefault()
        this.onFileChange(e)
        this.$nextTick(function () {
          setTimeout(() => {
            this.isDrag = false
            this.start()
          }, 401)
        })
      },
      dragOver (e) {
        e.preventDefault()
        setTimeout(() => {
          this.isDrag = true
        }, 301)
      },
      dragExit (e) {
        if (window.__wz_debug) console.log(e)
        if (e.screenX === 0 && e.screenY === 0) {
          // not working properly
          this.$emit('exit')
        }
        if (e && this.isDrag) {
          if (e.explicitOriginalTarget) {
            if (!/chat-attachment/.test(e.explicitOriginalTarget.className) && !/#text/.test(e.explicitOriginalTarget.nodeName)) {
              this.$emit('exit')
            }
          } else if (e.fromElement) {
            if (!/chat-attachment/.test(e.fromElement.className)) {
              this.$emit('exit')
            }
          }
        }
      },
      exit () {
        this.$emit('exit')
      },
      send () {
        this.$emit('send')
      },
      pick_picture (key) {
        this.changingMain = true
        this.$nextTick(function () {
          this.main = this.files[key]
          this.changingMain = false
        })
      },
      areaAutosize (add = true) {
        const el = this.$refs.input.$el
        setTimeout(function () {
          el.style.cssText = 'height:39px;'
          el.style.cssText = 'height:' + (Number(el.scrollHeight) + ((add) ? 0 : 0)) + 'px'
        }, 0)
      },
      emitAddingFile () {
        this.$refs.uploader.$refs.uploader.click()
      },
      addFiles (files) {
        this.$emit('files', files)
      },
      deleteFile (i) {
        this.$emit('deleteFile', i)
      }
    },
    beforeMount () {
      this.start()
    }
  }
</script>

<style lang="scss">
  .chat-attachment {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: #dedede;
    z-index: 100;
    .chat-attachment__header {
      vertical-align: top;
      background-color: #03bfa5;
      color: #fff;
      font-size: 1.6rem;
      padding: 0 30px;
      line-height: 2.5;
      .icon {
        font-size: 1.5rem;
        margin-right: 20px;
        color: #c2fdf5;
        padding: 13px;
        cursor: pointer;
      }
      span {
        line-height: 2.1;
      }
    }
    .chat-attachment__body {
      text-align: center;
      height: 100%;
      display: flex;
      background-color: #dedede;
      flex-direction: column;
      justify-content: space-between;
      textarea {
        resize: none
      }
      .chat-attachment__main-img {
        padding: 50px 0;
        justify-content: center;
        max-width: 100%;
        max-height: 420px;
        img {
          max-width: 70%;
          max-height: 250px;
        }
      }
      .chat-attachment__sliderHolder {
        display: flex;
        align-items: end;
        justify-content: center;
        margin-bottom: 0px;
        padding: 20px 40px;
        background-color: #eee;
        position: relative;
        .chat-attachment__sendButton {
          color: #fff;
          display: flex;
          border: none;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-size: 2rem;
          width: 60px;
          height: 60px;
          box-shadow: 0px 1px 2px #9e9e9e;
          background-color: #28a745;
          position: absolute;
          top: -30px;
          z-index: 1;
          right: 64px;
          border-radius: 50%;
          &:disabled {
            cursor: default;
            background-color: #80c688;
          }
        }
        .chat-attachment__thumb-box {
          cursor: pointer;
          margin: 0 5px;
          max-width: 100px;
          min-width: 100px;
          max-height: 100px;
          min-height: 100px;
          border: 2px solid #fff;
          border-radius: 4px;
          background-color: #fff;
          img {
            object-fit: cover;
            max-width: 100%;
            max-height: 100%;
            height: 100px;
          }
          .icon {
            font-size: 5rem;
          }
          &:not(.added) {
            .close {
              display: none;
              position: absolute;
              color: #fff;
              justify-content: flex-end;
              align-items: flex-start;
              width: 100%;
              height: 100%;
              /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+42,000000+100&0+42,0.65+100 */
              background: -moz-linear-gradient(30deg, rgba(0,0,0,0) 65%, rgba(0,0,0,0.65) 100%); /* FF3.6-15 */
              background: -webkit-linear-gradient(30deg, rgba(0,0,0,0) 65%,rgba(0,0,0,0.65) 100%); /* Chrome10-25,Safari5.1-6 */
              background: linear-gradient(30deg, rgba(0,0,0,0) 65%,rgba(0,0,0,0.65) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
              /* IE6-9 fallback on horizontal gradient */ /* IE6-9 fallback on horizontal gradient */
              filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#a6000000',GradientType=1 );
              .icon {
                font-size: 1.8rem;
              }
            }
            &:hover {
              .close {
                display: flex;
              }
            }
          }
        }
      }
    }
  }

  .mobileFlex {
    display: flex;
    justify-content: center;
    align-items: center;
    .chat-attachment__sendButton {
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 2rem;
      border: none;
      width: 60px;
      margin: 20px;
      height: 60px;
      box-shadow: 0px 1px 2px #9e9e9e;
      background-color: #28a745;
      border-radius: 50%;
      &:disabled {
        cursor: default;
        background-color: #80c688;
      }
    }
  }

  @media (max-width: 768px) {
    .chat-attachment {
      position: absolute;
      height: calc(100% + 52px);
      width: 100%;
      top: -52px;
      left: 0;
      background-color: #dedede;
      z-index: 10000;
    }
    .chat-attachment .chat-attachment__body {
      background-color: #dedede;
    }

    .chat-attachment .chat-attachment__body .chat-attachment__main-img {
      padding: 30px 0;
    }
  }
</style>
