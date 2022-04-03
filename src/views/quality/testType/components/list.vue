<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <!-- <el-button @click="operationFun('copy')">复制</el-button> -->
        <el-button class="delButton" @click="operationFun('delete')">删除</el-button>
        <!-- <el-button>全局配置</el-button> -->
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
          <!-- <slot>
            <el-button @click="operationFun('print')">打印</el-button>
            <el-button @click="operationFun('export')">导出</el-button>
          </slot> -->
        </header-search>
        <div class="z-content-table">
          <!-- table -->
          <common-table
              is-height
              ref="mainTable"
              :isMain="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :isSelection="true"
              :isSelectMore="true"
              :loading="loading"
              :pageParams="pageParams"
              @selePage="handleItemSelect"
              @pageChange="pageSizeChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'

import {getDataList, deleteData,} from '@/api/quality/testType'
import {queryAllData,} from '@/api/quality/score'
import {deepCopy,} from "@/lib/common"

export default {
  name: "score",
  components: {
    HeaderSearch,
    commonTable,
  },
  data() {
    return {
      queryForm: {},
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'inspectCategoryName',
          label: '检验类型',
          render: (h, scope) => {
            return h(
                "a",
                {
                  style: "color:blue",
                  on: {click: () => this.openEdit('details', scope.row)},
                },
                scope.row.inspectCategoryName
            );
          },
        },
        {
          prop: 'gradeStandardHdrValue',
          label: '评分标准',
        },
        {
          prop: 'description',
          label: '描述',
        },
        {
          prop: 'usable',
          align: 'center',
          label: '是否可用',
          render: (h, scope) => {
            return h("el-checkbox", {
              attrs: {
                value: scope.row.usable,
                disabled: 'disabled'
              },
            });
          },
        }
        ,
        {
          prop: 'createUser',
          label: '创建人'
        },
        {
          prop: 'createTime',
          label: '创建时间'
        },
      ],
      tableData: [],
      loading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 0
      },
      selectRow: {},
      config: {
        show: false,
        type: 'add',
      },
      multipleSelection: [],
      scopeList: [],
    }
  },
  computed: {
    searchArr() {
      return [
        {
          label: '检验类型',
          value: 'type',
          type: 1,
        },
        {
          label: '评分标准',
          value: 'score',
          type: 2,
          selectOption: this.scopeList,
          optionLabel: 'label',
          optionValue: 'value',
        },
        {
          label: '创建时间',
          value: 'createDate',
          type: 4,
          rangedesc: '至',
          pickerType: 'daterange',
          valueFormat: 'yyyy-MM-dd',
        },
      ]
    }
  },
  created() {
    this.pageChange(1)
    this.queryAllData()
  },
  methods: {
    /**
     * @desc 获取评分下拉数据
     */
    queryAllData() {
      queryAllData().then(res => {
        res.data.forEach(item => {
          item.label = item.gradeStandardName
          item.value = item.id
        })
        this.scopeList = res.data
      })
          .catch(() => {
            this.scopeList = []
          })
    },
    /**
     * @desc 条件数据获取
     */
    searchMethod(data) {
      this.queryForm = data
      this.pageChange(1)
    },
    /**
     * @desc 初始化数据列表接口参数
     */
    initParams() {
      let params = {
            pageNo: this.pageParams.pageNum,
            pageSize: this.pageParams.pageSize,
          },
          objParams = {
            gradeStandardHdrId: 'score',
            inspectCategoryName: 'type',
          }

      Object.keys(objParams).forEach(item => {
        if (typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
          params[item] = this.queryForm[objParams[item]]
        }
      })

      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate

        params.startTime = time[0] + ' 00:00:00'
        params.endTime = time[1] + ' 23:59:59'
      }

      return params
    },
    /**
     * @desc 获取数据列表
     */
    getDataList() {
      this.loading = true
      let params = this.initParams()

      this.clearSelct()
      getDataList(params).then(res => {
        this.loading = false

        this.tableData = res.data.records
        this.pageParams.total = res.data.total
      })
          .catch(error => {
            console.group(error)
            this.tableData = []
            this.loading = false
            this.pageParams.total = 0
          })
    },
    /**
     * @desc 选择复选
     */
    handleItemSelect(val) {
      this.multipleSelection = val
    },
    /**
     * @desc 页数发生变化
     */
    pageChange(page) {
      this.pageParams.pageNum = page
      this.getDataList()
    },
    /**
     * @desc 页面页码页面数字改变
     */
    pageSizeChange(data) {
      this.pageParams.pageNum = data.page
      this.pageParams.pageSize = data.limit

      this.getDataList()
    },
    /**
     * @desc 删除选中数据
     */
    operationFun(type) {
      let objText = {
        delete: {
          text: '确认删除选中的数据吗？',
          fun: this.delData,
        },
        // copy: {
        //   text: '确定复制选中的数据吗？',
        //   fun: this.delData,
        // },
        print: {
          text: '确定打印选中的数据吗？',
          fun: this.printData,
        },
        export: {
          text: '确定导出选中的数据吗？',
          fun: this.exportData,
        },
      }

      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择要操作的数据',
          type: "error",
          showClose: true
        })
        return
      }
      this.$confirm(objText[type].text, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            objText[type].fun()
          })
          .catch(() => {

          });
    },
    /**
     * @desc 删除选中数据
     */
    delData() {
      this.loading = true
      let id = []

      this.multipleSelection.forEach(item => {
        // id += item.id + ','
        id.push(item.id)
      })

      // if(id.length > 0) {
      //   id = id.slice(0,-1)
      // }
      let params = {
        ids: id,
      }

      deleteData(params).then(res => {
        this.loading = false
        this.$message.success('删除成功!')

        if (this.tableData.length === this.multipleSelection.length && this.pageParams.pageNum !== 1) {
          this.pageParams.pageNum--
        }

        this.getDataList()
      })
          .catch((error) => {
            console.group(error)
            this.loading = false
          })
    },
    /**
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 打印数据待修改
     */
    printData() {

    },
    /**
     * @desc 导出数据待修改
     */
    exportData() {

    },
    /**
     * @desc 新增编辑详情
     */
    openEdit(type, params) {
      let data = {
        type,
        data: params || {},
      }

      if (type === 'edit') {
        if (!this.checkCount()) {
          return
        } else {
          data.data = deepCopy(this.multipleSelection[0])
        }
      }
      this.$emit('submit', data)
    },
    /**
     * @desc 选择条数校验
     */
    checkCount() {
      let bool = true,
          count = this.multipleSelection.length

      if (count != 1) {
        let title = '此操作只允许操作一条数据'

        if (count < 1) {
          title = '请选择操作项'
        }

        this.$message({
          message: title,
          type: "error",
          showClose: true
        })
        bool = false
      }

      return bool
    },
  },
  mounted() {
  },
}
</script>

<style scoped>

</style>
