export default {
  data() {
    return {
      upload_picture: `${process.env.VUE_APP_BASE_API}/common/upload_picture`
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
