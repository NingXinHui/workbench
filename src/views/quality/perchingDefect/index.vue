<template>
  <!-- 验布疵点查询 -->
  <div id="zPage">
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod" :isPrint="false"></header-search>
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
import HeaderSearch from '@/components/CommonHeadSearch/ZmoreSearch'
import commonTable from '@/components/CommonTable'

import {getDefectDataList,} from '@/api/quality/listSearch'
import {queryAllData,} from '@/api/quality/testType'

export default {
  name: "QualityPerDefect",
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
          prop: 'inspectType',
          label: '检验类型',
        },
        {
          prop: 'inspectWorkerNo',
          label: '验布工',
        },
        {
          prop: 'materialNo',
          label: '物料编号',
        },
        {
          prop: 'materialName',
          label: '物料名称',
        },
        {
          prop: 'barcode',
          label: '布号',
        },
        {
          prop: 'inspectTime',
          label: '验布时间',
        },
        {
          prop: 'weaveWorkerNo',
          label: '挡车工',
        },
        {
          prop: 'weaveWorkerGroupName',
          label: '挡车班组',
        },
        {
          prop: 'equipmentNo',
          label: '设备编号',
        },
        {
          prop: 'defectNo',
          label: '疵点编号',
        },
        {
          prop: 'defectNameCn',
          label: '疵点名称',
        },
        {
          prop: 'isContinue',
          label: '是否连续',
          align: 'center',
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
          prop: 'startPosition',
          label: '开始位置',
        },
        {
          prop: 'endPosition',
          label: '结束位置',
        },
        {
          prop: 'defectLength',
          label: '连续长度',
        },
        {
          prop: 'deductionsAmount',
          label: '扣米数',
        },
        {
          prop: '待修改',
          label: '类型',
        },
      ],
      tableData: [],
      loading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 0
      },
      multipleSelection: [],
      //检验类型
      testCategoryList: [],
    }
  },
  computed: {
    searchArr() {
      return [
        {
          label: '卡号',
          value: 'cardNo',
          type: 1,
        },
        {
          label: '布号',
          value: 'clothNo',
          type: 1,
        },
        {
          label: '检验类型',
          value: 'testType',
          type: 2,
          selectOption: this.testCategoryList,
          optionLabel: 'label',
          optionValue: 'value',
        },
        {
          label: '物料编号',
          value: 'materialNo',
          type: 1,
        },
        {
          label: '物料名称',
          value: 'materialName',
          type: 1,
        },
        {
          label: '花型号',
          value: 'flowerNo',
          type: 1,
        },
        {
          label: '验布工编号',
          value: 'acceptanceNo',
          type: 1,
        },
        {
          label: '挡车工编号',
          value: 'machinistNo',
          type: 1,
        },
        {
          label: '设备编号',
          value: 'equipmentNo',
          type: 1,
        },
        {
          label: '验布日期',
          value: 'createDate',
          type: 4,
          pickerType: 'daterange',
          valueFormat: 'yyyy-MM-dd',
        },
      ]
    },
  },
  created() {
    this.pageChange(1)
    this.queryAllData()
  },
  methods: {
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
            cardNo: 'cardNo',
            barcode: 'clothNo',
            inspectType: 'testType',
            materialNo: 'materialNo',
            materialName: 'materialName',
            patternNo: 'flowerNo',
            inspectWorkerNo: 'acceptanceNo',
            weaveWorkerNo: 'machinistNo',
            equipmentNo: 'equipmentNo',
          }

      Object.keys(objParams).forEach(item => {
        if (typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
          params[item] = this.queryForm[objParams[item]]
        }
      })

      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate

        params.startDate = time[0] + ' 00:00:00'
        params.endDate = time[1] + ' 23:59:59'
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
      getDefectDataList(params).then(res => {
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
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
  },
  mounted() {
  },
}
</script>

<style scoped>

</style>
