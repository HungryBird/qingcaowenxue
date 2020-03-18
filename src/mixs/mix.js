export default {
  methods: {
    refresh() {
      const { fullPath } = this.$route
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    }
  }
}
