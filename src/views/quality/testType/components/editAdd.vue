<template>
  <div id="zPage" class="quality-testType-box">
    <div class="z-header">
      <div class="z-header-button">
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
    </div>
    <div class="z-content" v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('basicShow', !basicShow)">
            <i :class="basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            基础信息
          </div>
          <div :class="['z-details-content-box', basicShow ? '' : 'details-height-none']">
            <form-list v-model="queryForm" :formConfig="formConfig" class="form form-basic-config"
                       ref="formBasic"></form-list>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('allConfigShow', !allConfigShow)">
            <i :class="allConfigShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            全局配置
          </div>
          <div :class="['z-details-content-box', allConfigShow ? '' : 'details-height-none']">
            <form-list v-model="queryForm" :formConfig="formAllConfig" class="form form-overall-config"></form-list>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('taskShow', !taskShow)">
            <i :class="taskShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            质检任务
          </div>
          <div :class="['z-details-content-box', taskShow ? '' : 'details-height-none']">
            <div v-if="isEdit" class="z-details-btn">
              <el-button plain @click="addDetails(1)">新增</el-button>
              <el-button plain class="delButton" @click="deleteDetails(1)">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :isSort="true" :rowKeyName="'isIndex'" :class="{'zTable': isEdit}" ref="mainTable"
                           :table-height="400" :isSelectMore="true" :isSelection="true" :tableColumn="getTableColumn(1)"
                            :tableData="tableData" @selePage="handleSelectionChange"></common-table>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('taskPanelShow', !taskPanelShow)">
            <i :class="taskPanelShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            任务面板
          </div>
          <div :class="['z-details-content-box', taskPanelShow ? '' : 'details-height-none']">
            <div v-if="isEdit" class="z-details-btn">
              <el-button plain @click="addDetails(2)">新增</el-button>
              <el-button plain class="delButton" @click="deleteDetails(2)">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :isSort="true" :rowKeyName="'isIndex'" :class="{'zTable': isEdit}" ref="mainTaskPanelTable"
                           :table-height="400" :isSelectMore="true" :isSelection="true" :tableColumn="getTableColumn(2)"
                            :tableData="taskPanelData" @selePage="handleTaskPanelChange"></common-table>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('perPanelShow', !perPanelShow)">
            <i :class="perPanelShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            验布面板
          </div>
          <div :class="['z-details-content-box', perPanelShow ? '' : 'details-height-none']">
            <div v-if="isEdit" class="z-details-btn">
              <el-button plain @click="addDetails(3)">新增</el-button>
              <el-button plain class="delButton" @click="deleteDetails(3)">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :isSort="true" :rowKeyName="'isIndex'" :class="{'zTable': isEdit}" ref="mainPerPanelTable"
                           :table-height="400" :isSelectMore="true" :isSelection="true" :tableColumn="getTableColumn(3)"
                            :tableData="perPanelData" @selePage="handlePerPanelChange"></common-table>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('defectDetailsShow', !defectDetailsShow)">
            <i :class="defectDetailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            疵点详情
          </div>
          <div :class="['z-details-content-box', defectDetailsShow ? '' : 'details-height-none']">
            <div v-if="isEdit" class="z-details-btn">
              <el-button plain @click="addDetails(4)">新增</el-button>
              <el-button plain class="delButton" @click="deleteDetails(4)">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :isSort="true" :rowKeyName="'isIndex'" :class="{'zTable': isEdit}"
                            ref="mainDefectDetailsTable":table-height="400" :isSelectMore="true" :isSelection="true"
                            :tableColumn="getTableColumn(4)" :tableData="defectDetailsData"
                            @selePage="handleDefectDetailsChange"></common-table>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('checkShow', !checkShow)">
            <i :class="checkShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            已验列表
          </div>
          <div :class="['z-details-content-box', checkShow ? '' : 'details-height-none']">
            <div v-if="isEdit" class="z-details-btn">
              <el-button plain @click="addDetails(5)">新增</el-button>
              <el-button plain class="delButton" @click="deleteDetails(5)">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :isSort="true" :rowKeyName="'isIndex'" :class="{'zTable': isEdit}" ref="checkTable"
                           :table-height="400" :isSelectMore="true" :isSelection="true" :tableColumn="getTableColumn(5)"
                            :tableData="checkData" @selePage="handleCheckChange"></common-table>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('defectPopShow', !defectPopShow)">
            <i :class="defectPopShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            疵点弹框
          </div>
          <div :class="['z-details-content-box', defectPopShow ? '' : 'details-height-none']">
            <div v-if="isEdit" class="z-details-btn">
              <el-button plain @click="addDetails(6)">新增</el-button>
              <el-button plain class="delButton" @click="deleteDetails(6)">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :isSort="true" :rowKeyName="'isIndex'" :class="{'zTable': isEdit}" ref="defectPopTable"
                           :table-height="400" :isSelectMore="true" :isSelection="true" :tableColumn="getTableColumn(6)"
                            :tableData="defectPopData" @selePage="handleDefectPopChange"></common-table>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('peoplePopShow', !peoplePopShow)">
            <i :class="peoplePopShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            人员弹框
          </div>
          <div :class="['z-details-content-box', peoplePopShow ? '' : 'details-height-none']">
            <div v-if="isEdit" class="z-details-btn">
              <el-button plain @click="addDetails(7)">新增</el-button>
              <el-button plain class="delButton" @click="deleteDetails(7)">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :isSort="true" :rowKeyName="'isIndex'" :class="{'zTable': isEdit}" ref="peoplePopTable"
                           :table-height="400" :isSelectMore="true" :isSelection="true" :tableColumn="getTableColumn(7)"
                            :tableData="peoplePopData" @selePage="handlePeoplePopChange"></common-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import formList from '@/components/Form/formList'
import commonTable from '@/components/CommonTable'

import {saveData, editData, detailsData, querySelectList,} from '@/api/quality/testType'
import {queryAllData,} from '@/api/quality/score'
import {getMathIndex, checkExistData,} from "@/lib/common";
import {storeTestList} from "@/api/stock/stock";


export default {
  name: '',
  components: {
    formList,
    commonTable,
  },
  props: {
    operateType: {
      type: String,
      default: 'add',
    },
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      storeList: [],
      isEdit: false,
      queryForm: {},
      multipleSelection: [],
      deletedIdList: [],
      loading: false,
      scopeList: [],
      //质检任务
      tableData: [],
      //基础配置
      basicShow: true,
      //全局配置
      allConfigShow: true,
      //质检任务
      // mainTable
      taskShow: true,
      //任务面板
      // mainTaskPanelTable
      // handleTaskPanelChange
      taskPanelShow: false,
      taskPanelData: [],
      taskPanelMultipleData: [],
      //验布面板
      // mainPerPanelTable
      // handlePerPanelChange
      perPanelShow: false,
      perPanelData: [],
      perPanelMultipleData: [],

      //疵点详情
      // mainDefectDetailsTable
      // handleDefectDetailsChange
      defectDetailsShow: false,
      defectDetailsData: [],
      defectDetailsMultipleData: [],
      //已验列表
      // checkTable
      // handleCheckChange
      checkShow: false,
      checkData: [],
      checkMultipleData: [],
      //疵点弹框
      // defectPopTable
      // handleDefectPopChange
      defectPopShow: false,
      defectPopData: [],
      defectPopMultipleData: [],
      //人员弹框
      // peoplePopTable
      // handlePeoplePopChange
      peoplePopShow: false,
      peoplePopData: [],
      peoplePopMultipleData: [],
      objTableValue: {
        1: ['tableData', 'multipleSelection', 'mainTable'],
        2: ['taskPanelData', 'taskPanelMultipleData', 'mainTaskPanelTable'],
        3: ['perPanelData', 'perPanelMultipleData', 'mainPerPanelTable'],
        4: ['defectDetailsData', 'defectDetailsMultipleData', 'mainDefectDetailsTable'],
        5: ['checkData', 'checkMultipleData', 'checkTable'],
        6: ['defectPopData', 'defectPopMultipleData', 'defectPopTable'],
        7: ['peoplePopData', 'peoplePopMultipleData', 'peoplePopTable'],
      },
      //验证规则
      verifyList: [
        {
          label: '非空',
          value: 1,
        },
        {
          label: '数字',
          value: 2,
        },
        {
          label: '日期',
          value: 3,
        },
      ],
      //控件类型
      controlTypeList: [
        {
          label: '文本',
          value: 0,
        },
        {
          label: '整数',
          value: 1,
        },
        {
          label: '小数',
          value: 2,
        },
        {
          label: '日期',
          value: 3,
        },
        {
          label: '日期时间',
          value: 4,
        },
        {
          label: '下拉',
          value: 8,
        },
        {
          label: '长文本',
          value: 9,
        },
        {
          label: '颜色',
          value: 10,
        },
        {
          label: '图片',
          value: 11,
        },

      ],
      //默认数量单位
      unitList: [],
      //任务检验模式
      taskList: [
        {
          label: '弹出任务框模式',
          value: 0,
        },
        {
          label: '直接输入/扫描任务号的模式',
          value: 1,
        }
      ],
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit
      let formItemList = [
        {
          key: 'inspectCategoryName',
          type: 'input',
          subtype: 'text',
          label: '检验类型',
          isEdit,
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
          key: 'inspectCategoryNo',
          type: 'input',
          subtype: 'text',
          label: '检验编码',
          isEdit,
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('检验编码不能为空')
              }
            },
          },
        },
        {
          key: 'gradeStandardHdrId',
          type: 'select',
          label: '评分标准',
          isEdit,
          options: this.scopeList,
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('评分标准不能为空')
              }
            },
          },
        },
        {
          key: 'usable',
          type: 'checkbox',
          label: '是否可用',
          disabled: !this.isEdit,
        },
        {
          key: 'description',
          type: 'input',
          subtype: 'textarea',
          label: '备注',
          isEdit,
          maxlength: 200,
          attrs: {
            showWordLimit: true,
          },
        },
      ]

      return {
        inline: true,
        size: 'mini',
        labelWidth: 'auto',
        formItemList,
      }
    },
    //全局
    formAllConfig() {
      let isEdit = !this.isEdit
      let formItemList = [
        {
          key: 'taskOperateMode',
          type: 'select',
          label: '任务操作模式',
          isEdit,
          options: this.taskList,
        },
        {
          key: 'showFabricImg',
          type: 'checkbox',
          label: '是否显示布面效果图',
          disabled: isEdit,
        },
        {
          key: 'fabricHeight',
          type: 'number',
          label: '布面效果图高度',
          isEdit,
          min: 1,
          max: 999999999,
          precision: 0,
        },
        {
          key: 'showInspectFinish',
          type: 'checkbox',
          label: '是否显示验布完成按钮',
          disabled: isEdit,
        },
        {
          key: 'needNewInspectAfterSave',
          type: 'checkbox',
          label: '保存后自动开启新验布',
          disabled: isEdit,
        },
        {
          key: 'showTaskListAfterSave',
          type: 'checkbox',
          label: '保存后加载任务',
          disabled: isEdit,
        },
        {
          key: 'billNoFormula',
          type: 'input',
          subtype: 'text',
          label: '布号编码规则',
          isEdit,
        },
        //  新增
        {
          key: 'afterSaveInStore',
          type: 'checkbox',
          label: '保存后入库',
          disabled: isEdit,

        },
        {
          key: 'inStoreId',
          type: 'select',
          label: '入库仓库',
          isEdit,
          options: this.storeList,
        },
        {
          key: 'enableRecheckInputWorkerOutput',
          type: 'checkbox',
          label: '在复验模式是否必须输入挡车工产量',
          disabled: isEdit,
        },
        {
          key: 'enableInputWorkerOutput',
          type: 'checkbox',
          label: '是否启用挡车工产量输入',
          disabled: isEdit,
        },
        {
          key: 'syncMeter',
          type: 'checkbox',
          label: '输入疵点是否同步码表长度',
          isEdit,
        },
        {
          key: 'clearMeterAfterSave',
          type: 'checkbox',
          label: '保存数据后是否需要清除码表读数',
          disabled: isEdit,
        },
        {
          key: 'modifyLengthUnit',
          type: 'checkbox',
          label: '是否能修改验布单位',
          disabled: isEdit,
        },
        {
          key: 'qtyDecimalDigits',
          type: 'number',
          label: '长度小数位数',
          isEdit,
          min: 1,
          max: 999999999,
          precision: 0,
        },
        {
          key: 'defaultLengthUnitCode',
          type: 'select',
          label: '默认验布数量单位',
          options: this.unitList,
        },
        {
          key: 'cutOff',
          type: 'checkbox',
          label: '是否开剪',
          disabled: isEdit,
        },
        {
          key: 'autoPrintAfterSave',
          type: 'checkbox',
          label: '是否保存后直接打印',
          disabled: isEdit,
        },
        {
          key: 'weightDecimalDigits',
          type: 'number',
          label: '重量小数位数',
          isEdit,
          min: 1,
          max: 999999999,
          precision: 0,
        },
        {
          key: 'defectPopupWindow',
          type: 'checkbox',
          label: '疵点是否弹窗',
          disabled: isEdit,
        },
      ]

      return {
        inline: true,
        size: 'mini',
        labelWidth: 'auto',
        formItemList,
      }
    },
    tableColumn() {
      let isEdit = this.isEdit

      return [
        {
          label: '序号',
          type: 'index',
        },
        {
          label: '字段名称',
          prop: 'fieldName',
          isEdit: isEdit,
          config: {
            key: 'fieldName',
            type: 'input',
            subtype: 'text',
          },
        },
        {
          label: '字段标题',
          prop: 'fieldCaption',
          isEdit: isEdit,
          config: {
            key: 'fieldCaption',
            type: 'input',
            subtype: 'text',
          },
        },
        {
          label: '启用',
          prop: 'usable',
          align: 'center',
          isEdit: true,
          config: {
            key: 'usable',
            type: 'checkbox',
            attrs: {
              disabled: isEdit,
            },
          },
        },
        {
          label: '是否只读',
          prop: 'readOnly',
          align: 'center',
          isEdit: true,
          config: {
            key: 'readOnly',
            type: 'checkbox',
            attrs: {
              disabled: isEdit,
            },
          },
        },
        {
          label: '验证规则',
          prop: 'validateType',
          isEdit: isEdit,
          config: {
            key: 'validateType',
            type: 'select',
            options: this.verifyList,
          },
        },
        {
          label: '控件长度',
          prop: 'colWidth',
          isEdit: isEdit,
          config: {
            key: 'colWidth',
            type: 'number',
            min: 1,
            max: 999999999,
            precision: 0,
          },
        },
        {
          label: '控件类型',
          prop: 'controlType',
          isEdit: isEdit,
          config: {
            key: 'controlType',
            type: 'select',
            options: this.controlTypeList,
          },
        },
      ]
    },
  },
  created() {
    this.queryAllData()
  },
  methods: {
    /**
     * @desc 获取对应的table列
     */
    getTableColumn(type) {
      let short = [1, 2, 4, 5],
          longArr = [3, 6, 7]

      if (longArr.includes(type)) {
        return this.tableColumn
      } else {
        return this.tableColumn.slice(0, type == 1 ? this.tableColumn.length - 4 : this.tableColumn.length - 3)
      }
    },
    /**
     * @desc 获取默认数量单位
     */
    querySelectList() {
      querySelectList().then(res => {
        res.data.forEach(item => {
          item.label = item.unitName
          item.value = item.unitNo
        })
        this.unitList = res.data
        this.initData()
      })
          .catch(() => {
            this.unitList = []
            this.initData()
          })
      storeTestList({subInOutTypeNo: 'InspectIn'}).then(res => {
        res.data.forEach(item => {
          item.label = item.storeName
          item.value = item.id
        })
        this.storeList = res.data
      })

    },
    /**
     * @desc 对应组件显示隐藏
     */
    isCancel(key, bool) {
      this[key] = bool
    },
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
        this.querySelectList()
      }).catch(() => {
        this.scopeList = []
        this.querySelectList()
      })
    },
    /**
     * @desc 初始化数据
     */
    initData() {
      if (this.operateType === 'details') {
        this.isEdit = true
      } else {
        this.isEdit = true
      }
      if (this.operateType === 'add') {
        this.initQueryForm()
      } else {
        this.detailsData()
      }
    },
    /**
     * @desc 获取详情
     */
    detailsData() {
      this.loading = true
      let params = {
        id: this.currentData.id,
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
        inspectCategoryName: '',
        inspectCategoryNo: '',
        gradeStandardHdrId: '',
        description: '',
        usable: true,
        showFabricImg: true,
        fabricHeight: 1,
        taskOperateMode: '',
        needNewInspectAfterSave: true,
        showTaskListAfterSave: true,
        showInspectFinish: true,
        enableRecheckInputWorkerOutput: true,
        enableInputWorkerOutput: true,
        billNoFormula: '',
        clearMeterAfterSave: true,
        modifyLengthUnit: true,
        syncMeter: true,
        defaultLengthUnitCode: '',
        autoPrintAfterSave: true,
        qtyDecimalDigits: 1,
        defectPopupWindow: true,
        weightDecimalDigits: 1,
        cutOff: false,
        afterSaveInStore: false,
        inStoreId: '',
        inStoreName: '',
      }

      let obj = checkExistData(this.scopeList, data.gradeStandardHdrId, 'value')

      if (!obj.isExist) {
        data.gradeStandardHdrId = ''
      }

      let obj1 = checkExistData(this.unitList, data.defaultLengthUnitCode, 'value')

      if (!obj1.isExist) {
        data.defaultLengthUnitCode = ''
      }
      let obj2 = checkExistData(this.taskList, data.taskOperateMode, 'value')
      if (!obj2.isExist) {
        data.taskOperateMode = ''
      }
      this.queryForm = {
        ...basic,
        ...data,
      }

      if (data.imConfigListVOS) {
        data.imConfigListVOS.forEach(item => {
          item.isIndex = getMathIndex(this[this.objTableValue[item.configType][0]], 'isIndex')
          this[this.objTableValue[item.configType][0]].push(item)
        })
      }
    },
    /**
     * @desc 点击取消货返回
     */
    cancel() {
      this.$emit('submit')
    },
    /**
     * @desc 编辑或添加取对应值
     */
    getEditParams(type = 'add') {
      let params = {
            imConfigs: [],
          },
          objParams = {
            inspectCategoryName: 'inspectCategoryName',
            inspectCategoryNo: 'inspectCategoryNo',
            gradeStandardHdrId: 'gradeStandardHdrId',
            description: 'description',
            usable: 'usable',
            showFabricImg: 'showFabricImg',
            fabricHeight: 'fabricHeight',
            taskOperateMode: 'taskOperateMode',
            needNewInspectAfterSave: 'needNewInspectAfterSave',
            showTaskListAfterSave: 'showTaskListAfterSave',
            showInspectFinish: 'showInspectFinish',
            enableRecheckInputWorkerOutput: 'enableRecheckInputWorkerOutput',
            enableInputWorkerOutput: 'enableInputWorkerOutput',
            billNoFormula: 'billNoFormula',
            clearMeterAfterSave: 'clearMeterAfterSave',
            modifyLengthUnit: 'modifyLengthUnit',
            syncMeter: 'syncMeter',
            defaultLengthUnitCode: 'defaultLengthUnitCode',
            autoPrintAfterSave: 'autoPrintAfterSave',
            qtyDecimalDigits: 'qtyDecimalDigits',
            defectPopupWindow: 'defectPopupWindow',
            weightDecimalDigits: 'weightDecimalDigits',
            id: 'id',
            cutOff: 'cutOff',
            afterSaveInStore: 'afterSaveInStore',
            inStoreId: 'inStoreId',
            inStoreName: 'inStoreName',
          }

      Object.keys(objParams).forEach(item => {
        let value = this.queryForm[objParams[item]]
        if (typeof value != 'undefined' || value === 0) {
          params[item] = value
        }
      })

      Object.keys(this.objTableValue).forEach(item => {
        this[this.objTableValue[item][0]].forEach((value, index) => {
          value.orderNumber = (index + 1)
          params.imConfigs.push(value)
        })
      })
      return params
    },
    /**
     * @desc 点击添加或编辑
     */
    saveData() {
      let objFun = {
            add: saveData,
            edit: editData,
          },
          type = this.operateType === 'details' ? 'edit' : this.operateType

      if (objFun[type]) {
        let index = Object.keys(this.objTableValue).findIndex((item) => {
          return this[this.objTableValue[item][0]].length <= 0
        })

        if (index != -1) {
          this.$message.error('有列表未添加数据')
          return
        }

        let bool = this.$refs.formBasic.submit()

        if (!bool) {
          return
        }
        let params = this.getEditParams(type)

        if (params) {
          let index = params.imConfigs.findIndex(item => {
            return item.fieldName == '' || item.fieldCaption == ''
          })

          if (index != -1) {
            this.$message.error('列表字段名称或字段名称不能为空')
            return
          }
          this.loading = true
          objFun[type](params).then(res => {
            this.$message.success('操作成功')
            this.loading = false
            this.$emit('submit',)
          })
              .catch(() => {
                this.loading = false
              })
        }
      }
    },
    /**
     * @desc 新增明细
     */
    addDetails(type) {
      let obj = {
        fieldName: '',
        fieldCaption: '',
        usable: true,
        readOnly: false,
        validateType: '',
        colWidth: 1,
        controlType: '',
        configType: type,
        isIndex: getMathIndex(this[this.objTableValue[type][0]], 'isIndex'),
      }

      this.clearSelct(type)
      this[this.objTableValue[type][0]].push(obj)
    }, /**
     * @desc 删除明细
     */
    deleteDetails(type) {
      let array = this[this.objTableValue[type][0]]

      this[this.objTableValue[type][1]].forEach(item => {
        // if(item.id) {
        //     this.deletedIdList.push(item.id)
        // }

        let index = array.findIndex(value => {
          if (item.id) {
            return item.id == value.id
          } else {
            return item.isIndex == value.isIndex
          }
        })

        if (index != -1) {
          array.splice(index, 1)
        }
      })
      this[this.objTableValue[type][0]] = array
      this.clearSelct(type)
    },
    /**
     * @desc 勾选复选框
     */
    handleSelectionChange(data) {
      this.multipleSelection = data
    },
    /**
     * @desc 勾选任务面板复选框
     */
    handleTaskPanelChange(data) {
      this.taskPanelMultipleData = data
    },
    /**
     * @desc 勾选验布面板复选框
     */
    handlePerPanelChange(data) {
      this.perPanelMultipleData = data
    },
    /**
     * @desc 勾选疵点详情复选框
     */
    handleDefectDetailsChange(data) {
      this.defectDetailsMultipleData = data
    },
    /**
     * @desc 勾选已验列表复选框
     */
    handleCheckChange(data) {
      this.checkMultipleData = data
    },
    /**
     * @desc 勾选疵点弹框复选框
     */
    handleDefectPopChange(data) {
      this.defectPopMultipleData = data
    },
    /**
     * @desc 勾选人员弹框列表复选框
     */
    handlePeoplePopChange(data) {
      this.peoplePopMultipleData = data
    },
    /**
     * @desc 清空选中数据
     */
    clearSelct(type) {
      if (this.$refs[this.objTableValue[type][2]]) {
        this.$refs[this.objTableValue[type][2]].resetSelect();
      }
    },
  },
}
</script>
<style lang="less">
.quality-testType-box {
  //基础配置
  .form-basic-config {
    width: 510px;

    .form-textarea .el-form-item__content {
      width: 430px !important;
    }
  }

  //全局配置
  .form-overall-config {
    .el-form-item {
      width: 30%;
    }
  }
}
</style>
