export default {
  data: () => ({
    images: [],
    thumbsize: 200
  }),
  methods: {
    onFileChange (e) {
      const promiseArray = []
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      for (let i = 0; i < files.length; i++) {
        promiseArray.push(this.createImage(files[i]))
      }
      Promise.all(promiseArray)
        .then(() => {
          this.$emit('files', this.images)
          this.images = []
        })
    },
    createImage (file) {
      const ImmuneToFile = file
      const reader = new FileReader()
      return new Promise(resolve => {
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          const i = Math.floor(Math.random() * 1000000000)
          const image = document.createElement('IMG')
          let thumb
          if (file.type.split('/')[0] === 'image') {
            image.src = e.target.result
            image.onload = () => {
              thumb = this.get_thumb(image, false) || e.target.result
              this.images.push({
                file: ImmuneToFile,
                i,
                name: file.name,
                size: file.size,
                src: e.target.result,
                type: file.type.split('/')[0],
                format: file.type.split('/')[1],
                TYPE: file.type,
                thumb
              })
              resolve(true)
            }
          } else if (file.type.split('/')[0] === 'video') {
            this.getVideoImage(e.target.result, 1, function (imageBase) {
              if (!imageBase) {
                this.images.push({
                  file: ImmuneToFile,
                  i,
                  name: file.name,
                  size: file.size,
                  src: e.target.result,
                  type: 'document',
                  format: file.type.split('/')[1],
                  TYPE: file.type
                })
                resolve(true)
                return
              }
              image.src = imageBase
              image.onload = () => {
                thumb = this.get_thumb(image, true)
                this.images.push({
                  file: ImmuneToFile,
                  i,
                  name: file.name,
                  size: file.size,
                  src: e.target.result,
                  type: file.type.split('/')[0],
                  format: file.type.split('/')[1],
                  TYPE: file.type,
                  thumb,
                  preview: imageBase
                })
                resolve(true)
              }
            })
          } else {
            this.images.push({
              file: ImmuneToFile,
              i,
              name: file.name,
              size: file.size,
              src: e.target.result,
              type: file.type.split('/')[0],
              format: file.type.split('/')[1],
              TYPE: file.type
            })
            resolve(true)
          }
        }
      })
    },
    get_thumb (image, followDims) {
      const width = image.width
      const height = image.height
      if (width > this.thumbsize || height > this.thumbsize || followDims) {
        const dims = this.get_proportions(width, height, this.thumbsize)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = dims.w
        canvas.height = dims.h
        ctx.drawImage(image, 0, 0, dims.w, dims.h)
        return canvas.toDataURL()
      }
      return false
    },
    get_proportions (w, h, p) {
      let ratio = 0
      let width = w
      let height = h
      let bigis = width > height

      if (bigis) {
        ratio = width / p
      } else {
        ratio = height / p
      }

      width = width / ratio
      height = height / ratio

      return {
        w: width,
        h: height
      }
    },
    getVideoImage (path, secs, callback) {
      const me = this
      const video = document.createElement('video')
      video.onloadedmetadata = function () {
        if (typeof secs === 'function') {
          secs = secs(this.duration)
        }
        this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration)
      }
      video.onseeked = function (e) {
        const canvas = document.createElement('canvas')
        canvas.height = video.videoHeight
        canvas.width = video.videoWidth
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        callback.call(me, canvas.toDataURL(), e)
      }
      video.onerror = function (e) {
        callback.call(me, undefined, e)
        if (window.__wz_debug) {
          console.log(this, this.$log)
          if (this.$log && this.$log.e) {
            this.$log.e(e)
          }
          console.log(e)
        }
      }
      video.src = path
    }
  }
}
