<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-dropdown @command="handleExport">
          <el-button   :disabled="disabled"  size="small">导出</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="isSelect" command="exportItem">导出选中项</el-dropdown-item>
            <el-dropdown-item  command="exportCurrent">导出当前页结果</el-dropdown-item>
            <el-dropdown-item  command="exportAll">导出全部页结果</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="12">
        <el-dropdown @command="handlePrint">
          <el-button   :disabled="disabled" size="small">打印</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="isSelect" command="printItem">打印选中项</el-dropdown-item>
            <el-dropdown-item command="printCurrent">打印当前页结果</el-dropdown-item>
            <el-dropdown-item command="printAll">打印全部页结果</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import printJS from 'print-js'

export default {

  name: 'exportTableToExcel',
  props: {
    //可选打印
    isSelect: {
      type: Boolean,
      default: false
    },
    //禁用按钮
    disabled: {
      type: Boolean,
      default: false
    },
    //要导出的原数组-弃用
    exportData: {},
    //导出配置
    exportConfig: {},
    //打印配置
    printConfig: {}
  },
  data() {
    return {
      type:1 //1:导出 2：打印
    }
  },
  methods: {
    //导出
    handleExport(e) {
     this.$emit('handleExportStyle',e)
      if (!this.exportConfig.data.length&&this.isSelect&&e==='exportItem') {
        this.$alert('当前未选中需要操作数据，请选中后点击操作！', '', {
          confirmButtonText: '我知道了',
          confirmButtonClass: 'el-button--text',
          type: 'warning'
        })
        return false
      }
      this.$confirm('确定导出选中的数据', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        import('@/utils/Export2Excel').then(excel => {
          const header = this.exportConfig.header
          const data = this.formatJson(this.exportConfig.exportColumn, this.exportConfig.data)
          excel.export_json_to_excel({
            header: header, //表头 必填
            data,
            filename: this.exportConfig.filename,//非必填
            autoWidth: this.exportConfig.autoWidth,//非必填
            bookType: this.exportConfig.bookType //非必填
          })
        })
      }).catch(() => {

      })
    },
    //打印
    handlePrint(e) {
     this.$emit('handlePrintStyle',e)
        if (!this.printConfig.data.length&&this.isSelect&&e==='printItem') {
          this.$alert('当前未选中需要操作数据，请选中后点击操作！', '', {
            confirmButtonText: '我知道了',
            confirmButtonClass: 'el-button--text',
            type: 'warning'
          })
          return false
        }
        this.$confirm('确定打印数据?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.print(e)
        })
    },
    //执行打印
    print(e) {
      printJS({
        printable: this.printConfig.data,
        properties: this.printConfig.printColumn,
        type: 'json',
        header: this.$route.meta.title,
        gridStyle: 'text-align:center;border:1px solid #f5f5f5;'
      })

    },

    //格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    //执行导出
    exportTable(e) {


    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
