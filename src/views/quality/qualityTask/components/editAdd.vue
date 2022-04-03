<template>
  <div id="zPage" class="quality-qualityTask-box">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" :disabled="!isCanEdit">编辑</el-button>
        <el-button plain @click="cancel">返回</el-button>
      </div>
    </div>
    <div class="z-content" v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-icon">
                        <span @click="isCancel('basicShow', !basicShow)">
                            <i :class="basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
                            基本信息
                        </span>
          </div>
          <div :class="['z-details-content-box', basicShow ? '' : 'details-height-none']">
            <form-list v-model="queryForm" :formConfig="formConfig" class="form" ref="formBasic"></form-list>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
                        <span @click="isCancel('detailsShow', !detailsShow)">
                            <i :class="detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
                            明细信息
                        </span>
          </div>
          <div :class="['z-details-content-box', detailsShow ? '' : 'details-height-none']">
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addDetails">新增</el-button>
              <el-button size="mini" plain @click="copyDetails">复制</el-button>
              <el-button size="mini" plain class="delButton" @click="deleteDetails">删除</el-button>
              <div style="display: inline-block;margin-left: 10px;position: relative;">
                <el-dropdown @command="handleCommand" @visible-change="handleVisible">
                  <el-button size="mini">
                    选单
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item, key) in popOperateTypeList" :key="key"
                                      :disabled="currentOperateType !== '' && currentOperateType != item.value"
                                      :label="item.label" :command="item.value">
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <!-- <div style="display: inline-block;margin-left: 10px;position: relative;">
                  <el-button size="mini" plain @click="importData">选单</el-button>
                  <el-select v-model="currentOperateType" style="margin-left: 10px;" v-if="selectShow" placeholder="请选择" @change="typeChange">
                      <el-option v-for="(item, key) in popOperateTypeList" :key="key" :value="item.value" :label="item.label"></el-option>
                  </el-select>
              </div> -->
            </div>
            <div class="z-content-table">
              <common-table :class="{'zTable': isEdit}" ref="mainTable" :isSelectMore="true" :isSelection="true"
                            :tableColumn="tableColumn" :tableData="tableData"
                            @selePage="handleSelectionChange"></common-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div>
      <look-up :title="look.title" :visible.sync="popConfig.show" :isClearAll="true" @setCheckItem="popSubmit"
               :params="look.params" :method="look.methods" :table-column="look.tableColumn"
               :search-arr="look.searchArr"></look-up>
    </div>
    <lookSelect v-if="lookSelectConfig.show" :config="lookSelectConfig" :formItemList="lookSelectData.formItemList"
                :tableColumn="lookSelectData.tableColumn" :addTableColumn="lookSelectData.addTableColumn"
                :method="lookSelectData.methods" :params="lookSelectData.params" :topLable="lookSelectData.topLable"
                @close="lookSelectConfig.show = false" :qty-type="true" @submit="lookSelectSubmit"></lookSelect>
  </div>
</template>
<script>
import formList from '@/components/Form/formList'
import commonTable from '@/components/CommonTable'
import lookUp from '@/components/ZLookUp/lookUp'
import lookSelect from '@/components/ZLookUp/lookSelectV3'

import {
  saveData,
  editData,
  detailsData,
  importSellData,
  importMaterialData,
  importPurchaseData,
  importOutsourceData,
} from '@/api/quality/qualityTask'
import {look_up_material_no, select_currency,} from "@/api/order/dict";
import {queryAllData,} from '@/api/quality/testType'
import {querySelectList,} from "@/api/xsApi/api";
import {getMathIndex, checkFormData, deepCopy, checkExistData, bigIntCalculate, toFixed,} from "@/lib/common"
import {parseTime,} from '@/utils/ruoyi'

export default {
  name: '',
  components: {
    formList,
    commonTable,
    lookUp,
    lookSelect,
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
      isEdit: false,
      loading: false,
      isCanEdit: true,
      queryForm: {},
      deletedIdList: [],
      tableData: [],
      multipleSelection: [],
      testCategoryList: [],
      popConfig: {
        show: false,
      },
      basicShow: true,
      detailsShow: true,
      currentOperateType: '',
      selectShow: false,
      //原料信息
      materialCategoryIndex: 0,
      lookSelectConfig: {
        show: false,
        title: '',
      },
      basicData: {
        billNo: '',
        inspectCategoryName: '',
        inspectCategoryId: '',
        billDate: parseTime(new Date(), '{y}-{m}-{d}'),
        inspectRequest: '',
        remark: '',
      },
      unitList: [],
      pkgUnitList: [],
      currencyList:[],
      sourceCheckItemId: '',
    }
  },
  computed: {
    popOperateTypeList() {
      return [
        {
          label: '按采购',
          value: 1,
          topLable: '已选订单',
          methods: importPurchaseData,
          params: {
            sourceCheckItemId: this.sourceCheckItemId,
          },
          formItemList: [
            {
              label: '采购单号',
              key: 'sourceNo',
              type: 'input',
              subtype: 'text',
            },
            {
              label: '供应商名称',
              key: 'sourceCheckItemName',
              type: 'input',
              subtype: 'text',
            },
            {
              label: '订单号',
              key: 'sdOrderNo',
              type: 'input',
              subtype: 'text',
            },
          ],
          tableColumn: [
            {
              prop: "sdOrderNo",
              label: "订单号",
            },
            {
              prop: "sourceNo",
              label: "采购单号",
            },
            {
              prop: "purchaserName",
              label: "采购员",
            },
            {
              prop: "sourceCheckItemName",
              label: "供应商名称",
            },
            {
              prop: "materialNo",
              label: "物料编号",
            },
            {
              prop: "materialName",
              label: "物料名称",
            },
            {
              prop: "orderQty",
              label: "订单数量",
            },

            {
              label: '单位',
              prop: 'unitName',
            },
            {
              label: '颜色',
              prop: 'colorName',
            },
            {
              label: '花型号',
              prop: 'patternNo',
            },
          ],
          addTableColumn: [
            {
              prop: "sdOrderNo",
              label: "订单号",
            },
            {
              prop: "sourceNo",
              label: "采购单号",
            },
            {
              prop: "purchaserName",
              label: "采购员",
            },
            {
              prop: "sourceCheckItemName",
              label: "供应商名称",
            },
            {
              prop: "materialNo",
              label: "物料编号",
            },
            {
              prop: "materialName",
              label: "物料名称",
            },
            {
              prop: "orderQty",
              label: "订单数量",
            },

            {
              label: '单位',
              prop: 'unitName',
            },
            {
              label: '颜色',
              prop: 'colorName',
            },
            {
              label: '花型号',
              prop: 'patternNo',
            },
          ],
          changeFiled: {
            materialId: 'materialId',
            materialNo: 'materialNo',
            materialName: 'materialName',
            specification: 'specification',
            fullWidth: 'fullWidth',
            width: 'width',
            gmwt: 'gmwt',
            unit: 'unit',
            sourceNo: 'sourceNo',
            sourceType: 'sourceType',
            refDtlId: 'id',
            patternNo: 'patternNo',
            qty: 'orderQty',
            providerMaterialNo: 'providerMaterialNo',
            colorName: 'colorName',
            providerColorNo: 'providerColorNo',
            sourceCheckItemId: 'sourceCheckItemId',
          },
        },
        {
          label: '按委外',
          value: 2,
          params: {
            sourceCheckItemId: this.sourceCheckItemId,
          },
          methods: importOutsourceData,
          formItemList: [
            {
              label: '委外单号',
              key: 'sourceNo',
              type: 'input',
              subtype: 'text',
            },

            {
              label: '加工商名称',
              key: 'sourceCheckItemName',
              type: 'input',
              subtype: 'text',
            },
            {
              label: '订单号',
              key: 'sdOrderNo',
              type: 'input',
              subtype: 'text',
            },
          ],
          tableColumn: [
            {
              prop: "sdOrderNo",
              label: "订单号",
            },
            {
              prop: "sourceNo",
              label: "委外单号",
            },
            {
              prop: "sourceNo",
              label: "跟单员",
            },
            {
              prop: "sourceCheckItemName",
              label: "加工商名称",
            },
            {
              prop: "materialNo",
              label: "物料编号",
            },
            {
              prop: "materialName",
              label: "物料名称",
            },
            {
              prop: "orderQty",
              label: "订单数量",
            },
            // {
            //   prop: "qty",
            //   label: "数量",
            //   // isEdit: true,
            //   // config: {
            //   //   key: 'qty',
            //   //   type: 'input',
            //   //   subtype: 'text',
            //   //   placeholder: ' ',
            //   // },
            // },
            // {
            //   prop: "pkgQty",
            //   label: "包装数量",
            //   // isEdit: true,
            //   // config: {
            //   //   key: 'pkgQty',
            //   //   type: 'input',
            //   //   subtype: 'text',
            //   //   placeholder: ' ',
            //   // },
            // },
            // {
            //   prop: "pkgUnit",
            //   label: "包装单位",
            //   // isEdit: true,
            //   // config: {
            //   //   key: 'pkgUnit',
            //   //   type: 'select',
            //   //   options: this.pkgUnitList,
            //   //   optionLabel: 'unitName',
            //   //   optionValue: 'unitName',
            //   // },
            // },
            {
              prop: "unitName",
              label: "单位",
            },

            {
              prop: "price",
              label: "单价",
            },
            {
              prop: "colorName",
              label: "颜色",
            },

            {
              prop: "patternNo",
              label: "花型号",
            },

          ],
          addTableColumn: [
            {
              prop: "sdOrderNo",
              label: "订单号",
            },
            {
              prop: "sourceNo",
              label: "委外单号",
            },
            {
              prop: "sourceCheckItemName",
              label: "加工商名称",
            },
            {
              prop: "materialNo",
              label: "物料编号",
            },
            {
              prop: "materialName",
              label: "物料名称",
            },
            {
              prop: "orderQty",
              label: "订单数量",
            },
            // {
            //   prop: "qty",
            //   label: "数量",
            // },
            // {
            //   prop: "pkgQty",
            //   label: "包装数量",
            // },
            // {
            //   prop: "pkgUnit",
            //   label: "包装单位",
            // },
            {
              prop: "unitName",
              label: "单位",
            },
            {
              prop: "price",
              label: "单价",
            },
            // {
            //   prop: "specification",
            //   label: "规格",
            // },
            {
              prop: "colorName",
              label: "颜色",
            },
            {
              prop: "patternNo",
              label: "花型号",
            },
          ],
          changeFiled: {
            materialId: 'materialId',
            materialNo: 'materialNo',
            materialName: 'materialName',
            specification: 'specification',
            fullWidth: 'fullWidth',
            width: 'width',
            gmwt: 'gmwt',
            unit: 'unit',
            sourceNo: 'sourceNo',
            sourceType: 'sourceType',
            refDtlId: 'id',
            patternNo: 'patternNo',
            qty: 'qty',
            pkgQty: 'pkgQty',
            pkgUnit: 'pkgUnit',
            providerMaterialNo: 'providerMaterialNo',
            colorName: 'colorName',
            providerColorNo: 'providerColorNo',
            sourceCheckItemId: 'sourceCheckItemId',
          },
        },
      ]
    },
    tableColumn() {
      let isEdit = this.isEdit

      return [
        {
          label: '序号',
          type: 'index',
        },
        {
          label: '质检任务号',
          prop: 'taskNo',
        },
        {
          label: '物料编号',
          prop: 'materialNo',
          isEdit: isEdit,
          config: {
            key: 'materialNo',
            type: 'input',
            subtype: 'text',
            attrs: {
              readonly: true,
              suffixIcon: 'el-icon-arrow-down',
            },
            listeners: {
              focus: this.selectMaterial,
            },
            custormRules: {
              message: "物料编号不能为空",
            },
            placeholder: '请选择',
          },
        },
        {
          label: '物料名称',
          prop: 'materialName',
          isEdit: isEdit,
          config: {
            key: 'materialName',
            type: 'input',
            subtype: 'text',
            disabled: true,
            custormRules: {
              message: "物料名称不能为空",
            },
            placeholder: ' ',
          },
        },
        {
          label: '规格',
          prop: 'specification',
          align: 'right',
          isEdit: isEdit,
          config: {
            key: 'specification',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '门幅',
          prop: 'fullWidth',
          align: 'right',
          isEdit: isEdit,
          config: {
            key: 'fullWidth',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '有效门幅',
          prop: 'width',
          align: 'right',
          isEdit: isEdit,
          config: {
            key: 'width',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '克重',
          prop: 'gmwt',
          align: 'right',
          isEdit: isEdit,
          config: {
            key: 'gmwt',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '客户款号',
          prop: 'customerStyleNo',
          align: 'right',
          isEdit: isEdit,
          config: {
            key: 'customerStyleNo',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '供应商品名',
          prop: 'providerMaterialNo',
          isEdit: isEdit,
          config: {
            key: 'providerMaterialNo',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '颜色',
          prop: 'colorName',
          isEdit: isEdit,
          config: {
            key: 'colorName',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '供应商颜色',
          prop: 'providerColorNo',
          isEdit: isEdit,
          config: {
            key: 'providerColorNo',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '花型号',
          prop: 'patternNo',
          isEdit: isEdit,
          config: {
            key: 'patternNo',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '缸号',
          prop: 'cardNo',
          isEdit: isEdit,
          config: {
            key: 'cardNo',
            type: 'input',
            subtype: 'text',
            placeholder: ' ',
          },
        },
        {
          label: '数量',
          prop: 'qty',
          align: 'right',
          isEdit,
          config: {
            key: 'qty',
            type: 'number',
            min: 1,
            max: 99999999,
            precision: 2,
            custormRules: {
              message: "数量不能为空",
            },
            listeners: {
              blur: this.priceChange,
            },
            placeholder: ' ',
            controls: false,
          },
        },
        {
          label: '包装数量',
          prop: 'pkgQty',
          align: 'right',
          isEdit,
          config: {
            key: 'pkgQty',
            type: 'number',
            min: 1,
            max: 999999999,
            precision: 2,
            placeholder: ' ',
            controls: false,
          },
        },
        {
          label: '包装单位',
          prop: isEdit?'pkgUnit':'pkgUnitName',
          isEdit: isEdit,
          config: {
            key: 'pkgUnit',
            type: 'select',
            options: this.pkgUnitList,
            optionLabel: 'unitName',
            optionValue: 'unitNo',
          },
        },
        {
          label: '单位',
          prop: isEdit?'unit':'unitName',
          isEdit: isEdit,
          config: {
            key: 'unit',
            type: 'select',
            options: this.unitList,
            optionLabel: 'unitName',
            optionValue: 'unitNo',
            custormRules: {
              message: "单位不能为空",
            },
          },
        },
        {
          label: '单价',
          prop: 'price',
          align: 'right',
          isEdit,
          config: {
            key: 'price',
            type: 'number',
            min: 0,
            max: 999999,
            precision: 2,
            custormRules: {
              message: "单价不能为空",
            },
            listeners: {
              blur: this.priceChange,
            },
            placeholder: ' ',
            controls: false,
          },
        },
        {
          label: '金额',
          prop: 'amount',
          align: 'right',
          isEdit,
          config: {
            key: 'amount',
            type: 'number',
            disabled: true,
            min: 0,
            max: 999999999,
            precision: 2,
            placeholder: ' ',
            controls: false,
          },
        },
        {
          label: '币种',
          prop: isEdit?'currency':'currencyName',
          isEdit: isEdit,
          config: {
            key: 'currency',
            type: 'select',
            options: this.currencyList,
            optionLabel: 'currencyName',
            optionValue: 'currencyNo',
            custormRules: {
              message: "币种不能为空",
            },
          },
        },
        {
          label: '汇率',
          prop: 'exchangeRate',
          align: 'right',
          isEdit,
          config: {
            key: 'exchangeRate',
            type: 'number',
            min: 0,
            max: 999999999,
            precision: 2,
            placeholder: ' ',
            controls: false,
          },
        },
        {
          label: '税率',
          prop: 'taxRate',
          align: 'right',
          isEdit,
          config: {
            key: 'taxRate',
            type: 'number',
            min: 0,
            max: 999999999,
            precision: 2,
            placeholder: ' ',
            controls: false,
          },
        },
        {
          label: '附加费',
          prop: 'addAmount',
          align: 'right',
          isEdit,
          config: {
            key: 'addAmount',
            type: 'number',
            min: 0,
            max: 999999999,
            precision: 2,
            placeholder: ' ',
            controls: false,
          },
        },
        {
          label: '质检交期',
          prop: 'deliveryDate',
          align: 'right',
          isEdit,
          width: 120,
          config: {
            key: 'deliveryDate',
            type: 'date',
            subtype: 'date',
            valueFormat: 'yyyy-MM-dd',
            custormRules: {
              message: "质检交期不能为空",
            },
          },
        },
      ]
    },
    formConfig() {
      let isEdit = !this.isEdit
      let formItemList = [
        {
          key: 'billNo',
          type: 'input',
          subtype: 'text',
          label: '质检单号',
          disabled: true,
          isEdit,
          placeholder: '保存后自动生成',
        },
        {
          key: isEdit ? 'inspectCategoryName' : 'inspectCategoryId',
          type: 'select',
          label: '检验类型',
          isEdit,
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
          key: 'billDate',
          type: 'date',
          subtype: 'date',
          valueFormat: 'yyyy-MM-dd',
          label: '质检日期',
          isEdit,
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('质检日期不能为空')
              }
            },
          },
        },
        {
          key: 'inspectRequest',
          type: 'input',
          subtype: 'textarea',
          label: '质检要求',
          isEdit,
          maxlength: 200,
          attrs: {
            showWordLimit: true,
          },
        },
        {
          key: 'remark',
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
    look() {
      return {
        title: '查询选择(物料)',
        params: {},
        searchArr: [
          {
            label: '物料编号',
            field: 'materialNo',
            type: 1,
          },
          {
            label: '物料名称',
            field: 'materialName',
            type: 1,
          },
        ],
        methods: look_up_material_no,
        tableColumn: [
          {
            label: '物料名称',
            prop: 'materialName',
          },
          {
            label: '物料编号',
            prop: 'materialNo',
          },
          {
            label: '物料描述',
            prop: 'description',
          },
          {
            label: '成品规格',
            prop: 'specification',
          },
          {
            label: '成品组织',
            prop: 'construction',
          },
          {
            label: '成品门幅',
            prop: 'width',
          },
          {
            label: '成品克重',
            prop: 'gmwt',
          },
          {
            label: '单位',
            prop: 'unitName',
          },
        ],
        changeFiled: {
          materialId: 'id',
          materialNo: 'materialNo',
          materialName: 'materialName',
          specification: 'specification',
          fullWidth: 'fullWidth',
          width: 'width',
          gmwt: 'gmwt',
          unit: 'unitName',
          sourceNo: 'materialNo',
          customerStyleNo: 'customerStyleNo',
        },
      }
    },
    lookSelectData() {
      let obj = {}

      let index = this.popOperateTypeList.findIndex(item => {
        return item.value === this.currentOperateType
      })

      if (index != -1) {
        obj = this.popOperateTypeList[index]
      }

      return obj
    },
  },
  created() {
    this.initData()
    this.queryUnitSelectList()
  },
  methods: {
    /**
     * @desc 对应组件显示隐藏
     */
    isCancel(key, bool) {
      this[key] = bool
    },
    /**
     * @desc 单位下拉
     */
    queryUnitSelectList() {
      querySelectList({}).then((res) => {
        this.unitList = res.data
        this.pkgUnitList = res.data
      })
      select_currency().then(res=>{
        this.currencyList = res.data
      })

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
     * @desc 初始化数据
     */
    initData() {
      if (this.operateType === 'details') {
        this.isEdit = false

        if (this.currentData.billStatus == 0) {
          this.isCanEdit = true
        } else {
          this.isCanEdit = false
        }
      } else {
        this.isEdit = true
      }
      if (this.operateType === 'add') {
        this.initQueryForm()
      } else {
        this.detailsData()
      }
    }, /**
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
      let basic = this.basicData

      this.queryForm = {
        ...basic,
        ...data,
      }

      if (data.list) {
        this.tableColumn.forEach(item => {
          if (item.config && item.config.type == 'number') {
            data.list.forEach(value => {
              if (!value[item.config.key] && value[item.config.key] !== 0) {
                value[item.config.key] = undefined
              }
            })
          }
        })

        //是否存在采购委外类型
        let defaultData = checkExistData(data.list, 'purchase_order_no', 'sourceType'),
            outData = checkExistData(data.list, 'osorder_no', 'sourceType')


        if (defaultData.isExist) {
          this.currentOperateType = 1
          this.sourceCheckItemId = defaultData.data.sourceCheckItemId
        }

        if (outData.isExist) {
          this.currentOperateType = 2
          this.sourceCheckItemId = outData.data.sourceCheckItemId
        }
        this.tableData = data.list
      }
      this.queryAllData()
    },
    /**
     * @desc 点击取消货返回
     */
    cancel() {
      if (this.isEdit) {
        this.$confirm('内容还未保存，确认返回吗？', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('submit')
        }).catch(() => {
        })
      } else {
        this.$emit('submit')
      }
    },
    /**
     * @desc 更换当前状态
     */
    updateStatus() {
      this.isEdit = true
    },
    /**
     * @desc 编辑或添加取对应值
     */
    getEditParams(type = 'add') {
      let params = {
            list: this.tableData,
          },
          objParams = {
            ...this.basicData,
            id: '',
          }

      Object.keys(objParams).forEach(item => {
        let value = this.queryForm[item]

        if (typeof value != 'undefined' || value === 0) {
          params[item] = value
        }
      })

      params.billStatus = 0
      params.usable = true
      if (type === 'edit') {
        params.deletedIdList = this.deletedIdList
      }
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
        if (this.tableData.length < 1) {
          this.$message.error('明细信息未添加')
          return
        }
        if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
          return
        }
        let bool = true,
            title = ''

        this.tableColumn.forEach(item => {
          if (item.config && item.config.custormRules) {
            this.tableData.forEach((value, key) => {
              value.orderNumber = key + 1
              if (!value[item.config.key] && value[item.config.key] !== 0) {
                bool = false
                title = '第' + (key + 1) + '行' + item.config.custormRules.message
              } else if (item.config.key === 'deliveryDate') {
                if (new Date(value[item.config.key]).getTime() < new Date(this.queryForm.billDate).getTime()) {
                  bool = false
                  title = '第' + (key + 1) + '行质检交期不能小于质检日期'
                }
              }
            })
          }
        })

        if (!bool) {
          this.$message.error(title)
          return
        }
        let params = this.getEditParams(type)

        if (params) {
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
    addDetails() {
      let obj = {
        amount: 0,
        isIndex: getMathIndex(this.tableData, 'isIndex'),
        sourceType: 'material_sample'
      }

      this.clearSelct()
      this.tableData.push(obj)
    },
    /**
     * @desc 复制明细
     */
    copyDetails() {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请选择操作项')
        return
      }
      let array = []
      this.multipleSelection.forEach(item => {
        let obj = deepCopy(item)


        if (item.id) {
          delete obj.id
        }
        obj.isIndex = getMathIndex([...this.tableData, ...array,], 'isIndex'),
            array.push(obj)
      })
      this.tableData.push(...array)
      this.clearSelct()
    },
    /**
     * @desc 删除明细
     */
    deleteDetails() {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请选择操作项')
        return
      }
      this.$confirm('确认删除选中的数据吗？', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let array = this.tableData

        this.multipleSelection.forEach(item => {
          if (item.id) {
            this.deletedIdList.push(item.id)
          }

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
        let defaultData = checkExistData(array, 'purchase_order_no', 'sourceType'),
            outData = checkExistData(array, 'osorder_no', 'sourceType')


        if (!defaultData.isExist && !outData.isExist) {
          this.currentOperateType = ''
          this.sourceCheckItemId = ''
        }
        this.tableData = array
        this.clearSelct()
      }).catch(() => {
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
     * @desc 数量单价变化更新金额
     */
    priceChange(e) {
      let index = Number(e.target.parentNode.parentNode.getAttribute('index'))

      if (isNaN(index)) {
        index = 0
      }

      this.materialCategoryIndex = index

      let data = this.tableData[index] || {},
          qty = Number(data.qty),
          price = Number(data.price)

      if (isNaN(qty) || isNaN(price)) {
        data.amount = undefined
      } else {
        // data.amount = toFixed(bigIntCalculate(qty).mul(price).val(), 2)
        let amount = Number(qty) * Number(price)
        this.$set(data, 'amount', amount.toFixed(2))
      }

      this.$set(this.tableData, index, data)
    },
    /**
     * @desc 选取物料lookup弹出
     */
    selectMaterial(e) {
      let index = Number(e.target.getAttribute('index'))

      if (isNaN(index)) {
        index = 0
      }
      let data = this.tableData[index]

      if (data.refDtlId) {
        return
      }
      this.materialCategoryIndex = index
      this.popConfig.show = true
    },
    /**
     * @desc 勾选复选框
     */
    handleSelectionChange(data) {
      this.multipleSelection = data
    },
    /**
     * @desc 点击导入数据
     */
    importData() {
      this.selectShow = true
      this.currentOperateType = ''
    },
    /**
     * @desc 选单
     */
    handleCommand(e) {
      let lookSelectConfig = {}

      if (e === 1) {
        lookSelectConfig = {
          show: true,
          title: '查询选择(采购订单)',
        }
      } else if (e === 2) {
        lookSelectConfig = {
          show: true,
          title: '查询选择(委外订单)',
        }
      } else {
        return
      }
      this.currentOperateType = e
      this.lookSelectConfig = lookSelectConfig
    },
    /**
     * @desc 下拉框展示
     */
    handleVisible(bool) {
      if (bool) {
        let array = this.tableData
        let defaultData = checkExistData(array, 'purchase_order_no', 'sourceType'),
            outData = checkExistData(array, 'osorder_no', 'sourceType')

        if (!defaultData.isExist && !outData.isExist) {
          this.currentOperateType = ''
        }
      }
    },
    /**
     * @desc 选择导入类型
     */
    typeChange() {
      let lookSelectConfig = {
        show: true,
        title: '查询选择(采购订单)',
      }
      this.selectShow = false

      if (this.currentOperateType == 2) {
        lookSelectConfig.title = '查询选择(委外订单)'
      }

      this.lookSelectConfig = lookSelectConfig
    },
    /**
     * @desc lookup隐藏
     */
    popSubmit(data) {
      let params = {}

      Object.keys(this.look.changeFiled).forEach(item => {
        params[item] = data[this.look.changeFiled[item]]
      })

      let objValue = {...this.tableData[this.materialCategoryIndex], ...params,}

      this.$set(this.tableData, this.materialCategoryIndex, objValue)
    },
    /**
     * @desc 选单获取数据
     */
    lookSelectSubmit(data) {
      let array = [],
          sourceCheckItemId = ''

      data.forEach(item => {
        let obj = {
          isIndex: getMathIndex([...this.tableData, ...array], 'isIndex'),
        }

        Object.keys(this.lookSelectData.changeFiled).forEach(value => {
          obj[value] = item[this.lookSelectData.changeFiled[value]]
        })
        sourceCheckItemId = item.sourceCheckItemId || ''
        array.push(obj)
      })
      //判断选择的数据源是否是同一个供应商下面
      let index = data.findIndex((item) => {
        return item.sourceCheckItemId != sourceCheckItemId
      })

      if (index != -1) {
        this.$message.error('所选择的质检明细不属于同一供应商，请重新选择')
        return
      }
      this.sourceCheckItemId = sourceCheckItemId
        this.tableData = [...this.tableData, ...array]
    },
  },
}
</script>
<style lang="less">
.quality-qualityTask-box {
  .z-details-content-box {
    .form {
      width: 1050px;

      .form-textarea .el-form-item__content {
        width: 89% !important;
      }
    }
  }
}
</style>
