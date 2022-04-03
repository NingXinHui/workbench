<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="editAdd('add')">新增</el-button>
        <el-button @click="editAdd('edit')">编辑</el-button>
        <el-button class="delButton" @click="operationFun('delete')">删除</el-button>
        <!-- <el-button @click="operationFun('submit')">提交</el-button>
        <el-button @click="operationFun('withdraw')">撤回</el-button> -->
        <el-button @click="operationFun('submit')">提交</el-button>
        <el-button @click="operationFun('withdraw')">撤回</el-button>
        <!-- <el-button @click="operationFun('complete')">完成</el-button>
        <el-button @click="operationFun('cancelComplete')">取消完成</el-button> -->
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod" :isPrint='true' printtype='qm_inspect_no'
                       :selectRow='selectRow'>
          <slot>
            <!-- <el-button @click="operationFun('print')">打印</el-button> -->

<!--            <el-button @click="operationFun('export')" style="margin-top: -2px;">导出</el-button>-->

          </slot>
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
              :loading="loading"
              :pageParams="pageParams"
              @selePage="handleItemSelect"
              @pageChange="pageSizeChange"
          />
        </div>
      </el-card>
    </div>
    <!-- <edit-add v-if="config.show" :isAudit="true" :editLoading="editLoading" :editData="auditData" :formConfig="formConfig" :config="config" @close="config.show = false" @submit="auditSubmit"></edit-add> -->
  </div>
</template>

<script>
import {deepCopy, checkExistData,} from "@/lib/common"
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
// import editAdd from '@/components/DialogForm/index'
import orderMixins from "@/lib/orderMixins"

import {getDataList, deleteData, auditData, auditeeData,} from '@/api/quality/qualityTask'

export default {
  name: "score",
  components: {
    HeaderSearch,
    commonTable,
    // editAdd,
  },
  mixins: [orderMixins],
  data() {
    return {
      queryForm: {},
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'billNo',
          label: '质检单号',
          render: (h, scope) => {
            return h(
                "a",
                {
                  style: "color:blue",
                  on: {click: () => this.editAdd('details', scope.row)},
                },
                scope.row.billNo
            );
          },
        },
        {
          prop: 'inspectCategoryName',
          label: '检验类型',
        },
        {
          prop: 'billDate',
          label: '质检日期',
        },
        {
          prop: 'billStatus',
          label: '单据状态',
          render: (h, scope) => {
            return h(
                'span', {}, checkExistData(this.billStatusOptions, scope.row.billStatus, 'value').data.label,
            )
          },
        },
        {
          prop: 'userName',
          label: '创建人',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'remark',
          label: '备注',
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
        title: '',
        show: false,
        type: 'add',
      },
      multipleSelection: [],
      formConfig: {
        inline: false,
        labelWidth: 'auto',
        size: 'mini',
        formItemList: [
          {
            key: 'value',
            type: 'input',
            subtype: 'textarea',
            label: '审核建议',
            maxlength: 50,
            attrs: {
              showWordLimit: true,
            },
            rules: {
              required: true, trigger: 'blur',
              validator: (rule, value, callback) => {
                if (value) {
                  callback()
                } else {
                  this.$message.error('内容不能为空')
                }
              },
            }
          }
        ],
      },
      //审核内容
      auditData: {
        value: '',
      },
      editLoading: false,
      billStatusOptions: [
        {
          label: '草稿',
          value: '0',
        },
        {
          label: '待审',
          value: '1',
        },
        {
          label: '作废',
          value: '5',
        },
        {
          label: '已审核',
          value: '2',
        },
      ],
    }
  },
  computed: {
    searchArr() {
      return [
        {
          label: '质检日期',
          value: 'createDate',
          type: 4,
          rangedesc: '至',
          pickerType: 'daterange',
          valueFormat: 'yyyy-MM-dd',
        },
        {
          label: '质检单号',
          value: 'score',
          type: 1,
        },
      ]
    },
  },
  created() {
    this.pageChange(1)
  },
  methods: {
    /**
     * @desc 校验数据数量
     */
    checkMultip() {
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
            billNo: 'score',
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
      this.selectRow = val[0]
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
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 删除选中数据
     */
    operationFun(type) {
      let objText = {
        delete: {
          text: '确认删除选中的数据吗？',
          fun: this.delData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '12345',
        },
        submit: {
          text: '确认提交选中的数据吗？',
          fun: this.auditSubmit,
          check: this.checkOperation,
          key: 'billStatus',
          value: '12345',
        },
        withdraw: {
          text: '确认撤回选中的数据吗？',
          fun: this.auditeeData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '0',
        },
        print: {
          text: '确认打印选中的数据吗？',
          fun: this.printCommonData,
        },
        export: {
          text: '确认导出选中的数据吗？',
          fun: this.exportCommonData,
        },
        // submit: {
        //   text: '确定提交选中的数据吗？',
        //   fun: this.delData,
        // },
        // withdraw: {
        //   text: '确定撤回选中的数据吗？',
        //   fun: this.delData,
        // },
        // complete: {
        //   text: '确认完成选中的质检单中的数据吗？',
        //   fun: this.delData,
        // },
        // cancelComplete: {
        //   text: '确认取消选中质检单中任务的完成状态吗？',
        //   fun: this.delData,
        // },
      }

      if (objText[type].check) {
        if (!objText[type].check(type, this.multipleSelection, objText[type].key, objText[type].value)) {
          return
        }
      }
      this.$confirm(objText[type].text, "", {
        confirmButtonText: "确认",
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
     * @desc 审核反审核初始化
     * @param { Number } 1 审核 0反审核
     */
    auditFun(type) {
      let bool = this.checkMultip()

      if (!bool) {
        return
      }

      let title = '审核'

      this.config = {
        title,
        type,
        show: true,
      }
    },
    /**
     * @desc 删除选中数据
     */
    delData() {
      this.loading = true
      let params = {
        id: this.multipleSelection[0].id,
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
     * @desc 反审核选中数据
     */
    auditeeData() {
      this.loading = true
      let params = {
        id: this.multipleSelection[0].id,
      }

      auditeeData(params).then(res => {
        this.loading = false
        this.$message.success('修改成功!')
        this.getDataList()
      })
          .catch((error) => {
            console.group(error)
            this.loading = false
          })
    },
    /**
     * @desc 提交审核和反审核
     */
    auditSubmit(data) {
      this.loading = true
      let params = {
        id: this.multipleSelection[0].id,
      }

      auditData(params).then(res => {
        this.$message.success('操作成功')
        this.loading = false
        this.getDataList()
      })
          .catch((error) => {
            this.loading = false
            console.group(error)
          })
    },
    /**
     * @desc 新增编辑查看
     */
    editAdd(type, params) {
      let data = {
        type,
        data: deepCopy(params),
      }
      if (type === 'edit') {
        let bool = this.checkMultip()
        if (bool) {
          data.data = deepCopy(this.multipleSelection[0])
        } else {
          return
        }
      }
      this.$emit('submit', data)
    },
  },
  mounted() {
  },
}
</script>

<style scoped>

</style>
