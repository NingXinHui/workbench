<template>
  <!-- 疵点维护 -->
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <!-- <el-button @click="operationFun('copy')">复制</el-button> -->
        <el-button class="delButton" @click="operationFun('delete')">删除</el-button>
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
    <edit-add v-if="config.show" :config="config" :editLoading="editLoading" :editData="selectRow"
              :formConfig="formConfig" @close="config.show = false" @submit="submit"></edit-add>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
import editAdd from '@/components/DialogForm/index'

import {getDataList, deleteData, saveData, editData, detailsData, queryDefeAllData,} from '@/api/quality/defect'
import {queryAllData,} from '@/api/quality/testType'
import {checkExistData,} from '@/lib/common'

export default {
  name: "QualityDefect",
  components: {
    HeaderSearch,
    commonTable,
    editAdd,
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
          prop: 'defectNo',
          label: '疵点编号',
        },
        {
          prop: 'inspectCategoryName',
          label: '检验类型',
        },
        {
          prop: 'defectTypeName',
          label: '疵点分类',
        },
        {
          prop: 'defectNameCn',
          label: '疵点名称',
        },
        {
          prop: 'defectNameEn',
          label: '英文名称',
        },
        {
          prop: 'defectGroup',
          label: '疵点分组',
        },
        {
          prop: 'severity',
          label: '严重程度',
        },
        {
          prop: 'point',
          label: '疵点分数',
        },
        {
          prop: 'deductionsAmount',
          label: '扣款金额',
        },
        {
          prop: 'dutyDepartment',
          label: '责任部门',
        },
        {
          prop: 'isContinue',
          align: 'center',
          label: '连续疵点',
          render: (h, scope) => {
            return h("el-checkbox", {
              attrs: {
                value: scope.row.isContinue,
                disabled: 'disabled'
              },
            });
          },
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
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'userName',
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
        title: '新增疵点'
      },
      testCategoryList: [],
      defectCategoryList: [],
      multipleSelection: [],
      editLoading: false,
    }
  },
  computed: {
    formConfig() {
      let formItemList = [
        {
          key: 'inspectCategoryId',
          type: 'select',
          label: '检验类型',
          options: this.testCategoryList,
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('检验类型不能为空')
              }
            },
          },
        },
        {
          key: 'defectTypeId',
          type: 'select',
          label: '疵点分类',
          options: this.defectCategoryList,
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('疵点分类不能为空')
              }
            },
          },
        },
        {
          key: 'defectNo',
          type: 'input',
          subtype: 'text',
          label: '疵点编号',
          maxlength: '10',
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('疵点编号不能为空')
              }
            },
          },
        },
        {
          key: 'defectNameCn',
          type: 'input',
          subtype: 'text',
          label: '疵点名称',
          maxlength: '50',
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('疵点名称不能为空')
              }
            },
          },
        },
        {
          key: 'point',
          type: 'number',
          label: '疵点分数',
          min: 1,
          max: 999999999,
          precision: 0,
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === 0 || value) {
                callback()
              } else {
                this.$message.error('疵点分数不能为空')
              }
            },
          },
        },
        {
          key: 'defectGroup',
          type: 'input',
          subtype: 'text',
          label: '疵点分组',
          maxlength: '4',
        },
        {
          key: 'defectNameEn',
          type: 'input',
          subtype: 'text',
          label: '英文名称',
          maxlength: '50',
        },
        {
          key: 'severity',
          type: 'input',
          subtype: 'text',
          label: '严重程度',
          maxlength: '50',
        },
        {
          key: 'deductionsAmount',
          type: 'number',
          label: '扣款金额',
          min: 1,
          max: 999999999,
          precision: 2,
        },
        // {
        //     key: 'keyValue',
        //     label: '按键',
        //     type: 'input',
        //     subtype: 'text',
        //     maxlength: '50',
        //     min: 1,
        //     max: 999999999,
        //     precision: 0,
        // },
        {
          key: 'dutyDepartment',
          type: 'input',
          subtype: 'text',
          label: '责任部门',
          maxlength: '50',
        },
        // {
        //     key: 'customGroup',
        //     type: 'checkboxGroup',
        //     options: [
        //       {
        //         value: 'usable',
        //         label: '是否可用',
        //       },
        //       {
        //         value: 'isContinue',
        //         label: '是否连续疵点',
        //       },
        //     ],
        // },
        {
          key: 'isContinue',
          type: 'checkbox',
          label: '是否连续疵点',
        },
        {
          key: 'usable',
          type: 'checkbox',
          label: '是否可用',
        },
        {
          key: 'remark',
          type: 'input',
          subtype: 'textarea',
          label: '描述',
          maxlength: 200,
          attrs: {
            showWordLimit: true,
          },
        },
      ]

      return {
        inline: true,
        labelWidth: 'auto',
        size: 'small',
        formItemList,
      }
    },
    searchArr() {
      return [
        {
          label: '检验类型',
          value: 'score',
          type: 2,
          selectOption: this.testCategoryList,
          optionLabel: 'label',
          optionValue: 'value',
        },
        {
          label: '疵点名称',
          value: 'name',
          type: 1,
        },
        {
          label: '疵点分组',
          value: 'category',
          type: 1,
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
    },
  },
  created() {
    this.pageChange(1)
    this.queryAllData()
    this.queryDefeAllData()
  },
  methods: {
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
    /**
     * @desc 获取检验类型下拉数据
     */
    queryAllData() {
      queryAllData().then(res => {
        res.data.forEach(item => {
          item.label = item.inspectCategory
          item.value = item.id
        })
        this.testCategoryList = res.data
      })
          .catch(() => {
            this.testCategoryList = []
          })
    },
    /**
     * @desc 获取疵点分类数据
     */
    queryDefeAllData() {
      queryDefeAllData().then(res => {
        res.data.forEach(item => {
          item.label = item.defectTypeName
          item.value = item.id
        })
        this.defectCategoryList = res.data
      })
          .catch(() => {
            this.defectCategoryList = []
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
            inspectCategoryId: 'score',
            defectNameCn: 'name',
            defectGroup: 'category',
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
      let id = ''

      this.multipleSelection.forEach(item => {
        id += item.id + ','
      })

      if (id.length > 0) {
        id = id.slice(0, -1)
      }
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
     * @desc 获取详情
     */
    detailsData() {
      this.loading = true
      let params = {
        id: this.multipleSelection[0].id,
      }

      detailsData(params).then(res => {
        this.loading = false
        this.initQueryForm(res.data)
      })
          .catch(error => {
            this.loading = false
            this.initQueryForm()
          })
    },
    /**
     * @desc 初始化页面参数
     */
    initQueryForm(data = {}) {
      let basic = {
        inspectCategoryId: '',
        defectTypeId: '',
        defectNo: '',
        defectNameCn: '',
        point: '',
        defectGroup: '',
        defectNameEn: '',
        severity: '',
        deductionsAmount: '',
        // keyValue: '',
        dutyDepartment: '',
        // customGroup: this.config.type === 'add' ? ['usable', 'isContinue'] : [],
        usable: true,
        isContinue: true,
        remark: '',
      }

      // if(data.usable) {
      //   basic.customGroup.push('usable')
      // }

      // if(data.isContinue) {
      //   basic.customGroup.push('isContinue')
      // }

      let obj = checkExistData(this.testCategoryList, data.inspectCategoryId, 'value')

      if (!obj.isExist) {
        data.inspectCategoryId = ''
      }

      let obj1 = checkExistData(this.defectCategoryList, data.defectTypeId, 'value')

      if (!obj1.isExist) {
        data.defectTypeId = ''
      }

      let objData = {
        ...basic,
        ...data,
      }

      objData.point = Number(objData.point)
      objData.deductionsAmount = Number(objData.deductionsAmount)

      if (isNaN(objData.deductionsAmount) || objData.deductionsAmount < 1) {
        objData.deductionsAmount = 1
      }
      if (isNaN(objData.point) || objData.point < 1) {
        objData.point = 1
      }
      this.selectRow = objData
      this.config.show = true
    },
    /**
     * @desc 打开编辑新增
     */
    openEdit(type) {
      let title = '新增疵点'

      if (type === 'edit') {
        if (!this.checkCount()) {
          return
        }
        title = '编辑疵点'
        this.detailsData()
      } else {
        this.initQueryForm()
      }
      this.config = {
        ...this.config,
        type,
        title,
      }
    },
    /**
     * @desc 编辑或添加取对应值
     */
    getEditParams() {
      let params = {},
          objParams = {
            inspectCategoryId: 'inspectCategoryId',
            defectTypeId: 'defectTypeId',
            defectNo: 'defectNo',
            defectNameCn: 'defectNameCn',
            point: 'point',
            defectGroup: 'defectGroup',
            defectNameEn: 'defectNameEn',
            severity: 'severity',
            deductionsAmount: 'deductionsAmount',
            // keyValue: 'keyValue',
            dutyDepartment: 'dutyDepartment',
            remark: 'remark',
            usable: 'usable',
            isContinue: 'isContinue',
            id: 'id',
          }

      Object.keys(objParams).forEach(item => {
        let value = this.selectRow[objParams[item]]

        if (typeof value != 'undefined' || value === 0) {
          params[item] = value
        }
      })

      // let group = this.selectRow.customGroup

      // if(group.includes('usable')) {
      //   params.usable = true
      // } else {
      //   params.usable = false
      // }

      // if(group.includes('isContinue')) {
      //   params.isContinue = true
      // } else {
      //   params.isContinue = false
      // }
      //后端这个字段做了必填
      params.orderNumber = 1

      return params
    },
    /**
     * @desc 新增或编辑
     */
    submit(data) {
      let objFun = {
            add: saveData,
            edit: editData,
          },
          type = this.config.type === 'details' ? 'edit' : this.config.type

      if (objFun[type]) {
        this.editLoading = true
        this.selectRow = data
        let params = this.getEditParams()

        objFun[type](params).then(res => {
          this.$message.success('操作成功')
          this.editLoading = false
          this.config.show = false
          this.getDataList()
        })
            .catch((error) => {
              this.editLoading = false
              console.group(error)
            })
      }
    },
  },
  mounted() {
  },
}
</script>

<style scoped>

</style>
