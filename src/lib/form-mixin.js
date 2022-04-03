const Formixin = {
  data() {
    return {
      tableRef:'table',
      loading: false,
      tableData: [],
      tableHeight: 0,
      total: 0,
      actionObj: []
    }
  },
  created() {
  },
  mounted() {
    //设置表格高度
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs[this.tableRef].$el.offsetTop - 100
      // 监听窗口大小变化
      let self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs[this.tableRef].$el.offsetTop - 100
      }
    })
  },
  methods: {

  }
  ,
  destroyed() {
    window.onresize = () => {
    }
  }
}
export default Formixin
