export default {
  data() {
    return {
      upload_picture: `${process.env.VUE_APP_BASE_API}/common/upload_picture`,
      upload_novfiles: `${process.env.VUE_APP_BASE_API}/common/upload_novfiles`
    }
  },
  methods: {
    refresh() {
      const { fullPath } = this.$route
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    }
  }
}
