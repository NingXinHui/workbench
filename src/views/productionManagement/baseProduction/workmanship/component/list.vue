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
          <el-button @click="copyOrder('copy')">复制</el-button>
          <!-- <el-button class="delButton" @click="operationFun('delete')">删除</el-button> -->
          <el-button @click="operationFun('submit')">提交</el-button>
          <el-button @click="operationFun('withdraw')">撤回</el-button>
          <el-button @click="audit('examine', '12')">审核</el-button>
          <el-button @click="audit('cancelAudit', '123')">反审核</el-button>
          <el-button @click="() => uploadFile()">附件</el-button>
        </div>
      </div>
      <div class="z-content">
        <el-card>
          <!-- 搜索条件 -->
          <header-search :model="queryForm" :searchArr="searchArr" @sureSearch="searchMethod" :isPrint='true' printtype='order_no' :selectRow='selectRow'>
            <slot>
              <el-button @click="operationFun('export')" style="margin-top: -2px;">导出</el-button>
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
              :isSelectMore="true"
              :loading="loading"
              :pageParams="pageParams"
              @selePage="handleItemSelect"
              @pageChange="pageSizeChange"
            />
          </div>
        </el-card>
      </div>
      <Approval :approvalVisible.sync="approvalVisible" :approvalText="approvalText" :titletype="titletype"></Approval>
       <div v-if="openmodal">
        <open-modal :billId="billId" billType="BOM" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
    </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'

import { getDataList, deleteData, withdrawData, submitData, } from '@/api/marketOrder'
import { getBomlist,submitBom,revokeBom } from '@/api/production/workmanship'
import { deepCopy,} from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
import Approval from "./approval"
import OpenModal from '@/components/commonUpload'
export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
    OpenModal
  },
  mixins: [orderMixins],
  data() {
    return {
      openmodal:false,
      billId:"",
      approvalVisible: false,
      approvalText: "审核",
      titletype: "",
      selectRow:{},
      queryForm: {
        usable:"1"
      },
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'billNo',
          label: 'BOM编号',
          render: (h, scope) => {
            return h(
              "a",
              {
                style: "color:blue",
                on: { click: () =>
                this.openEdit('details', scope.row)
                 },
              },
              scope.row.billNo
            );
          },
        },
        {
          prop: 'billName',
          label: 'BOM名称',
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
          prop: 'materialDescribe',
          label: '物料描述',
        }, {
          prop: 'unit',
          label: '计量单位',
        }, {
          prop: 'billStatusName',
          label: '单据状态',
        },
        {
          prop: 'remark',
          label: '备注',
        },
        {
          prop: 'createUserName',
          label: '创建人',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        }
      ],
      tableData:[],
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
    searchArr() {
      return [
        {
          label: 'BOM编号/名称',
          value: 'billNo',
          type: 1,
          maxLength: 40,
        }, {
          label: '物料',
          value: 'propertyMerge',
          type: 1,
          maxLength: 40,
        }, {
          label: '是否可用',
          value: 'usable',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
           selectOption: [
            {
              label: "全部",
              value: "all"
            },
            {
              label: "是",
              value: "1"
            },
            {
              label: "否",
              value: "0"
            }
          ]
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
  },
  methods: {
       //上传附件
    uploadFile() {
      if(this.multipleSelection.length != 1) {
        this.$message.error("请选择一条操作项");
        return
      }
      this.billId = this.multipleSelection[0].id;
      this.openmodal=true
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
        billNo:this.queryForm.billNo,
        propertyMerge:this.queryForm.propertyMerge,
        usable: this.queryForm.usable == "all" ? "" : this.queryForm.usable
      };


      if(Array.isArray(this.queryForm.createDate)) {
        let time = this.queryForm.createDate

        params.startTime = time[0] + " 00:00:00";
        params.endTime = time[1] + " 23:59:59";
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
      getBomlist(params).then(res => {
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
     * @desc 删除选中数据
     */
    operationFun(type) {
      let objText = {
        delete: {
          text: '确认删除选中的数据吗？',
          fun: this.delData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '123345',
        },
        submit: {
          text: '确认提交选中的数据吗？',
          fun: this.submitData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '123',
        },
        withdraw: {
          text: '确认撤回选中的数据吗？',
          fun: this.withdrawData,
          check: this.checkOperation,
          key: 'billStatus',
          value: '023',
        },
        print: {
          text: '确认打印选中的数据吗？',
          fun: this.printCommonData,
        },
        export: {
          text: '确认导出查询的数据？',
          fun: this.exportCommonData,
        },
        copy: {
          text: '确认复制选中的数据吗？',
          fun: this.copyOrder,
          check: this.checkOperation,
          key: 'billStatus',
          value: '7',
        },
      }

      if(objText[type].check) {
        if(!objText[type].check(type, this.multipleSelection, objText[type].key,objText[type].value)) {
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
    audit(type, val) {

      if(!this.checkOperation('examine', this.multipleSelection, 'billStatus', val)) {
          return
        }
        if(type == 'examine' ||type == 'cancelAudit') {
          this.approvalText = type == 'examine' ? '审核' : type == 'cancelAudit' ? "反审核" : "提示";
          this.titletype = type == 'examine' ? '审核原因' :type == 'cancelAudit' ? "审核原因" : '';
          this.approvalVisible = true;
        }
    },
    //复制订单
    copyOrder() {
      if(this.multipleSelection.length != 1) {
        this.$message.error("请选择一条操作项");
        return
      }
       this.$confirm("确认复制选中的数据吗？", "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
         this.openEdit('copy', this.multipleSelection[0])
      })
      .catch(() => {
      });
    },
    /**
     * @desc 删除选中数据
     */
    delData() {
      this.loading = true
      let ids = []

      this.multipleSelection.forEach(item => {
        ids += item.id + ','
        // ids.push(item.id)
      })

      if(ids.length > 0) {
        ids = ids.slice(0,-1)
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
    submitData() {
      this.loading = true
      let ids = this.multipleSelection.map(item => { return item.id }).toString()
      submitBom({
        ids:ids,
      }).then(res => {
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
    withdrawData() {
      this.loading = true
      let ids = this.multipleSelection.map(item => { return item.id }).toString()
      revokeBom({
        ids:ids
      }).then(res => {
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
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 新增编辑详情
     */
    openEdit(type, params) {
      let data = {
        type,
        data: params || {},
      }
      if(type == 'edit' &&this.multipleSelection.length!=1) {
        this.$message.error("请选择一条操作项");
        return
      }
      if(type === 'edit') {
        if(!this.checkOperation(type, this.multipleSelection, 'billStatus', '12345')) {
          return
        } else {
          data.data = deepCopy(this.multipleSelection[0])
        }
      }
      console.log(data)
      this.$emit('submit', data)
    },
  },
  mounted() {
  },
}
</script>

<style scoped>

</style>
