import Item from '@/components/ZLookUp/Item'

const LookUpMixin = {
  components: { Item },
  methods: {
    //打开弹窗
    openDialog() {
      this.visible = true
    },
    handleClose() {
      this.pageParams.checkItemId = ''
      this.pageParams.checkName = ''
    },
    setCheckItemId(e) {
      this.$set(this.pageParams, 'checkItemId', e.id)
      this.$set(this.pageParams, 'checkName', e.checkName)
    }
  },
  data() {
    return {
      visible: false
    }
  }

}

export default LookUpMixin
