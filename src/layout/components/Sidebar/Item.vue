<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    iconType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, iconType } = context.props
    const vnodes = []

    if (icon) {
      if (iconType === 'element') {
        const nIcon = `el-icon-${icon} element-icon`
        const style = 'color: rgb(191, 203, 217);width: 1em;font-size: 16px;'
        vnodes.push(<i class={nIcon} style={style} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
