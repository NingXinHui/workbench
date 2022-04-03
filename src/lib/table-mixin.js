
const tableMixin = {
  data() {
    return {
      loading: false,
      actionObj: {},
      exportConfig: {},
      printConfig:{},
      selectList:[],
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    action(e, s) {
      try {
        this.$options.methods[s.funName].call(this, e)
      } catch (e) {
        this.$message.error('配置错误')
      }
    },

    /**
     * @param ref 节点
     * @param height 修正高度
     * @param obj 元素本身
     */
    resetTableHeight(obj,height,){
      //设置表格高度
      this.$nextTick(function() {
        obj.tableHeight = window.innerHeight - this.$refs[obj.ref].$el.offsetTop - height
        // 监听窗口大小变化
        let self = this
        window.onresize = function() {
          obj.tableHeight = window.innerHeight - self.$refs[obj.ref].$el.offsetTop - height
        }
      })
    },
    resetTableHeader(obj,e){
      obj.header=e
    },
    //接管打印
    handlePrintStyle(e) {
      switch (e) {
        //按选择项打印
        case 'printItem':
          this.printConfig.data = this.actionObj
          break;
        case 'printCurrent':
          this.printConfig.data = this.tableData
          break;
        case 'printAll':
          console.log('等待接口')
      }
    },
    //接管导出
    handleExportStyle(e) {
      switch (e) {
        //按选择项打印
        case 'exportItem':
          this.exportConfig.data = this.actionObj
          break
        case 'exportCurrent':
          this.exportConfig.data = this.tableData
          break
        case 'exportAll':
          console.log('等待接口')
      }
    },
    handleSelectionChange(e){
      this.selectList=e
    },

  },
  destroyed() {
    window.onresize = () => {
    }
  }
}
export default tableMixin
