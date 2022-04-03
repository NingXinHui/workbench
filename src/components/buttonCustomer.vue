<!--
@time:2021/12/20
@author:zhupeikang
-->
<template>
  <div style="flex: 1">
    <div style="text-align: right;" v-if="tabId">
      <el-tooltip content="自定义列" placement="top">
        <i class="el-icon-setting" @click="setTable" style="color:#BFD0EA "></i>
      </el-tooltip>
    </div>

      <table-head-control
          v-if="sortConfig.openAddModal"
          :tab-id=tabId
          :open-add-modal.sync="sortConfig.openAddModal"
          :show-column-table="sortConfig.showTableColumn"
          :table-down-column="sortConfig.hiddenTableColumn"
          @closeParent="closeParent"
      />

  </div>
</template>

<script>
import TableHeadControl from "@/components/tableHeadControl";
import {user_page_config, user_page_config_save} from "@/api/common";

export default {
  name: "buttonCustomer",
  components: {
    TableHeadControl
  },

  mixins: [],

  props: {
    tableColumn: {
      type: Array,
      default: () => {
        return []
      },
    },
    tabId: {
      type: String | Number,
      default: '',
    },
  },

  data() {
    return {
      open:false,
      //判断是否管理员
      isAdmin: localStorage.getItem('isAdmin'),
      //排序配置
      sortConfig: {
        //弹窗显示
        openAddModal: false,
        //所有已配置的数据列表
        list: [],
        //显示的列
        showTableColumn: [],
        //隐藏的列
        hiddenTableColumn: []
      },
    }
  },
  computed: {
    sortList() {
      let tabId = this.tabId
      return {
        [tabId]: 'tableColumn'
      }
    }
  },

  watch: {},

  beforeCreat() {

  },

  created() {

  },

  beforeMount() {
  },

  mounted() {
    //获取配置的表格信息
    if(this.tabId){
    
      user_page_config({tabId:this.tabId}).then(res => {

    
        res.data=[res.data];
       
        this.sortConfig.list = []
        //查找当前表是否有配置信息
        let r = res.data.find(item => item.tabId == this.tabId)
        //如果已经有配置信息
        if (r.id) {

          //把配置的显示列、隐藏列找出来
          let showArr = r.config.split(',')
          let hiddenArr = this[this.sortList[this.tabId]].map(item => {
            return item.label
          }).filter(val => {
            return showArr.indexOf(val) === -1
          })
          hiddenArr.map(item => {
            this.sortConfig.hiddenTableColumn = [...this.sortConfig.hiddenTableColumn, ...this[this.sortList[this.tabId]].splice(this[this.sortList[this.tabId]].findIndex(e => e.label === item), 1)]
          })
          //对显示列进行重新排序
          let resortTable = []
          showArr.map(item => {
            this[this.sortList[this.tabId]].map(item2 => {
              if (item2.label === item) {
                resortTable.push(item2)
              }
            })
          })
          //通知组件重新排序
          this.$emit('changeTableColumn', resortTable)
          //弹窗数据赋值
          this.sortConfig.showTableColumn = resortTable
        } else {
          //如果没有配置信息，直接赋值当前设置
          this.$emit('changeTableColumn', this[this.sortList[this.tabId]])
          this.sortConfig.showTableColumn = this[this.sortList[this.tabId]]
        }
      }).catch(() => {
        //接口有问题也是直接赋值
        this.sortConfig.showTableColumn = this[this.sortList[this.tabId]]
        this.$emit('changeTableColumn', this[this.sortList[this.tabId]])
      })
    }
  },
  methods: {
    //点击确认、上传回调
    closeParent(e, s, tabId, down) {
      //调用父组件更改显示列
      this.$emit('changeTableColumn', e)
      //修改配置弹窗显示列与隐藏列
      this.sortConfig.showTableColumn = e
      this.sortConfig.hiddenTableColumn = down
      //如果是上传
      if (s) {
        //查找当前表格是否有配置信息
        let tableConfig = {}
        if (this.sortConfig.list.length > 0) {
          tableConfig = this.sortConfig.list.find(item => item.tabId === tabId)
        }
        let config = e.map(item => {
          return item.label
        })
        let params = {
          config: config.toString(),
          tabId: tabId,
        }
        tableConfig&&tableConfig.id && (params.id = tableConfig.id)
        user_page_config_save(params).then(res => {;
          if (res.success) {
            this.$message.success('保存成功')
          }
        })
      }
    },
    setTable() {
      this.sortConfig.openAddModal = true
    },
  },
  beforeUpdate() {

  },

  updated() {

  },

  activated() {

  },

  deactivated() {

  },

  beforeDestroy() {

  },

  destroyed() {
  }


}
</script>

<style scoped>

</style>
