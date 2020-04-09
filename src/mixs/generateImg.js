import html2canvas from 'html2canvas'

export default {
  props: {
    mode: {
      Type: String,
      default: 'Text'
    },
    title: {
      Type: String,
      default: ''
    },
    content: {
      Type: String,
      default: ''
    },
    guide: {
      Type: String,
      default: ''
    }
  },
  mounted() {
    if (this.mode === 'Img') {
      this.generaImg()
    }
  },
  data() {
    return {
      imgUrl: ''
    }
  },
  methods: {
    generaImg() {
      const dom = document.querySelector('#wx-article-body')
      html2canvas(dom).then(function(canvas) {
        const url = canvas.toDataURL('image/png')
        this.imgUrl = url
      }.bind(this)).catch(err => {
        console.log('err: ', err)
      })
    }
  },
  watch: {
    mode(mode) {
      this.imgUrl = ''
      if (mode === 'Img') {
        this.generaImg()
      }
    }
  }
}
