<template>
  <!-- 挡车工产量查询 -->
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

import {getMachinistDataList,} from '@/api/quality/listSearch'
import {queryAllData,} from '@/api/quality/testType'

export default {
  name: "QualityMachinist",
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
          prop: 'materialNo',
          label: '物料编号',
        },
        {
          prop: 'materialName',
          label: '物料名称',
        },
        {
          prop: 'patternNo',
          label: '花型号',
        },
        {
          prop: '待修改',
          label: '挡车工姓名',
        },
        {
          prop: 'weaveWorkerNo',
          label: '挡车工编号',
        },
        {
          prop: 'weaveWorkerGroupName',
          label: '挡车工班组',
        },
        {
          prop: 'barcode',
          label: '布卷编号',
        },
        {
          prop: 'length',
          label: '挡车长度',
        },
        {
          prop: '待修改',
          label: '落布时间',
        },
        {
          prop: 'inspectType',
          label: '检验类型',
        },
        {
          prop: 'inspectWorkerNo',
          label: '验布工编号',
        },
        {
          prop: '待修改',
          label: '验布工姓名',
        },
        {
          prop: 'inspectTime',
          label: '验布日期',
        },
        {
          prop: '待修改',
          label: '落布卡号',
        },
        {
          prop: 'equipmentNo',
          label: '设备编号',
        },
        {
          prop: '待修改',
          label: '设备名称',
        },
        {
          prop: '待修改',
          label: '织造时间',
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
          label: '挡车工编号',
          value: 'machinistNo',
          type: 1,
        },
        {
          label: '挡车工姓名',
          value: 'machinistName',
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
          label: '验布日期',
          value: 'createDate',
          type: 4,
          pickerType: 'daterange',
          valueFormat: 'yyyy-MM-dd',
        },
        {
          label: '织造日期',
          value: 'weaveDate',
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
            workerNo: 'machinistNo',
            workerName: 'machinistName',
            inspectType: 'testType',
            materialNo: 'materialNo',
            materialName: 'materialName',
            patternNo: 'flowerNo',
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
      if (Array.isArray(this.queryForm.weaveDate)) {
        let time = this.queryForm.weaveDate

        params.startWeaveDate = time[0] + ' 00:00:00'
        params.endWeaveDate = time[1] + ' 23:59:59'
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
      getMachinistDataList(params).then(res => {
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
