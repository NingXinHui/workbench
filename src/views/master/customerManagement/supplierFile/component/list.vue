<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <!-- <el-button class="delButton" @click="operationFun('delete')">删除</el-button>-->
        <el-button @click="operationFun('submit')">提交</el-button>
        <el-button @click="operationFun('withdraw')">撤回</el-button>
        <el-button @click="audit('examine', '12')">审核</el-button>
        <el-button @click="audit('cancelAudit', '123')">反审核</el-button>
        <el-button @click="audit('Push', '123')">工商同步</el-button>
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr"
                       @sureSearch="searchMethod"
                       :isPrint='true'
                       printtype='order_no'
                       :selectRow='selectRow'>
        </header-search>
        <div class="z-content-table">
          <!-- table -->
          <common-table is-height
                        ref="mainTable"
                        :isMain="true"
                        :tableColumn="tableColumn"
                        :tableData="tableData"
                        :isSelection="true"
                        :isSelectMore="true"
                        :loading="loading"
                        :pageParams="pageParams"
                        @selePage="handleItemSelect"
                        @pageChange="pageSizeChange" />
        </div>
      </el-card>
    </div>
    <Approval :approvalVisible.sync="approvalVisible"
              :approvalText="approvalText"
              :titletype="titletype"></Approval>
    <Push :pushVisible.sync="pushVisible"
          :pushlText="pushlText"></Push>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'

import { getDataList, deleteData, withdrawData, submitData, } from '@/api/marketOrder'
import { checkitemList } from '@/api/master/supplierFile'
import { deepCopy, } from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
import Approval from "./approval"
import Push from "./Push"
export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
    Push
  },
  mixins: [orderMixins],
  data () {
    return {
      approvalVisible: false,
      pushVisible: false,
      approvalText: "审核",
      pushlText: "选择下推方向",
      titletype: "",
      selectRow: {},
      queryForm: {},
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'checkItemNo',
          label: '客商编号',
          render: (h, scope) => {
            return h(
              "a",
              {
                style: "color:blue",
                on: { click: () => this.openEdit('details', scope.row) },
              },
              scope.row.checkItemNo
            );
          },
        },
        {
          prop: 'checkItemName',
          label: '企业名称',
        },
        {
          prop: 'checkItemCategoryName',
          label: '机构类别',
        },
        {
          prop: 'checkItemTypeName',
          label: '客商类型',
        },
        {
          prop: 'billStatusName',
          label: '状态',
        },
        {
          prop: 'usable',
          label: '是否可用',
          align: 'center',
          render: (h, scope) => {
            return h(
              'el-checkbox',
              {
                props: {
                  value: scope.row.usable,
                  disabled: true,
                }
              }
            )
          }
        },
        {
          prop: 'createUserName',
          label: '创建人',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'updateUserName',
          label: '更新人',
        },
        {
          prop: 'updateTime',
          label: '更新时间',
        },
        {
          prop: 'syncTime',
          label: '工商同步时间',
        }, {
          prop: '',
          label: '',
        }
      ],
      tableData: [],
      loading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 0
      },
      multipleSelection: [],
    }
  },
  computed: {
    searchArr () {
      return [
        {
          label: '客商',
          value: 'checkItemNoOrName',
          type: 1,
          maxLength: 40,
        },
        {
          label: '状态',
          value: 'billStatus',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '草稿',
            value: '0'
          }, {
            label: '审核中',
            value: '1'
          }, {
            label: '已审核',
            value: '2'
          }]
        }, {
          label: '是否可用',
          value: 'usable',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '全部',
            value: '3'
          }, {
            label: '启用',
            value: '1'
          }, {
            label: '停用',
            value: '0'
          }]
        },
      ]
    }
  },
  created () {
    this.pageChange(1)
  },
  methods: {
    /**
     * @desc 条件数据获取
     */
    searchMethod (data) {
      console.log(data);
      this.queryForm = data
      this.pageChange(1)
    },
    /**
     * @desc 初始化数据列表接口参数
     */
    initParams () {
      let params = {
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        checkItemNoOrName: this.queryForm.checkItemNoOrName,
        usable: this.queryForm.usable ? this.queryForm.usable == '3' ? '' : this.queryForm.usable : '',
        billStatus: this.queryForm.billStatus ? this.queryForm.billStatus : '',
      }
      // objParams = {
      //   billNo: 'orderNo',
      //   checkItemName: 'customerName',
      // }

      // Object.keys(objParams).forEach(item => {
      //   if(typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
      //     params[item] = this.queryForm[objParams[item]]
      //   }
      // })

      if (Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate

        params.beginDate = time[0] + ' 00:00:00'
        params.endDate = time[1] + ' 23:59:59'
      }

      return params
    },
    /**
     * @desc 获取数据列表
     */
    getDataList () {
      this.loading = true
      let params = this.initParams()

      this.clearSelct()
      checkitemList(params).then(res => {
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
    handleItemSelect (val) {
      this.multipleSelection = val
      this.selectRow = val[0]
    },
    /**
     * @desc 页数发生变化
     */
    pageChange (page) {
      this.pageParams.pageNum = page
      this.getDataList()
    },
    /**
     * @desc 页面页码页面数字改变
     */
    pageSizeChange (data) {
      this.pageParams.pageNum = data.page
      this.pageParams.pageSize = data.limit

      this.getDataList()
    },
    /**
     * @desc 删除选中数据
     */
    operationFun (type) {
      let objText = {
        delete: {
          text: '确认删除选中的数据吗？',
          fun: this.delData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '12345',
        },
        submit: {
          text: '确认提交当前的客商信息吗？',
          fun: this.submitData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '12345',
        },
        withdraw: {
          text: '确认撤回当前的客商信息吗？',
          fun: this.withdrawData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '0',
        },
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
    //审核反审核操作
    audit (type, val) {

      if (!this.checkOperation('examine', this.multipleSelection, 'billStatus', val)) {
        return
      }
      if (type == 'examine' || type == 'cancelAudit') {
        this.approvalText = type == 'examine' ? '审核' : type == 'cancelAudit' ? "反审核" : "提示";
        this.titletype = type == 'examine' ? '审核原因' : type == 'cancelAudit' ? "审核原因" : ''
        this.approvalVisible = true;
      } else {
        this.pushlText = type == 'Push' ? '选择下推方向' : "联查";
        this.pushVisible = true;
      }
    },
    //复制订单
    copyOrder () {

    },
    /**
     * @desc 删除选中数据
     */
    delData () {
      this.loading = true
      let ids = []

      this.multipleSelection.forEach(item => {
        ids += item.id + ','
        // ids.push(item.id)
      })

      if (ids.length > 0) {
        ids = ids.slice(0, -1)
      }
      let params = {
        ids: ids,
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
     * @desc 提交选中数据
     */
    submitData () {
      this.loading = true
      let id = []

      this.multipleSelection.forEach(item => {
        id += item.id + ','
      })

      if (id.length > 0) {
        id = id.slice(0, -1)
      }
      let params = {
        id: id,
      }

      submitData(params).then(res => {
        this.loading = false
        this.$message.success('操作成功!')

        this.getDataList()
      })
        .catch((error) => {
          console.group(error)
          this.loading = false
        })
    },
    /**
     * @desc 提交选中数据
     */
    withdrawData () {
      this.loading = true
      let id = []

      this.multipleSelection.forEach(item => {
        id += item.id + ','
      })

      if (id.length > 0) {
        id = id.slice(0, -1)
      }
      let params = {
        id: id,
      }

      withdrawData(params).then(res => {
        this.loading = false
        this.$message.success('操作成功!')

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
    clearSelct () {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 新增编辑详情
     */
    openEdit (type, params) {
      let data = {
        type,
        data: params || {},
      }

      if (type === 'edit') {
        if (this.multipleSelection.length != 1) {
          this.$message.error("请选择一条操作项");
          return
        }
        if (!this.checkOperation(type, this.multipleSelection, 'billStatus', '12345')) {
          return
        } else {
          data.data = deepCopy(this.multipleSelection[0])
        }
      }
      this.$emit('submit', data)
    },
  },
  mounted () {
  },
}
</script>

<style scoped>
</style>
