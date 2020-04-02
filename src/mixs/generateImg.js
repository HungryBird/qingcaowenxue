import html2canvas from 'html2canvas'

export default {
  props: {
    mode: {
      Type: String,
      default: 'Text'
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
      console.log('generaImg')
      const dom = document.querySelector('#wx-article-body')
      html2canvas(dom).then(function(canvas) {
        const url = canvas.toDataURL('image/png')
        this.imgUrl = url
      }.bind(this)).catch(err => {
        console.log('err: ', err)
      })
    }
  }
}
