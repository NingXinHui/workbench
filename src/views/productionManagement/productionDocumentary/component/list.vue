<!--
@time:2021/12/1
@author:chenqian
-->
<template>
    <div id="zPage">
      <!-- 按钮 -->
      <div class="z-header">
        <div class="z-header-button">
          <el-button @click="openEdit('edit')">编辑</el-button>
          <el-button class="delButton" @click="operationFun('delete')">删除</el-button>
          <el-button @click="operationFun('submit')">提交</el-button>
          <el-button @click="operationFun('withdraw')">撤回</el-button>
          <el-button @click="audit('examine', '12')">审核</el-button>
          <el-button @click="audit('cancelAudit', '123')">反审核</el-button>
          <el-button @click="audit('Joint', '123')">联查</el-button>
             <el-button @click="audit('finish','businessStatus', '34')">完成</el-button>
          <el-button @click="audit('cancelFinish','businessStatus', '124')">取消完成</el-button>
          <el-button @click="audit('close', 'businessStatus','3')">关闭</el-button>
          <el-button @click="audit('cancelClose','businessStatus','123')">取消关闭</el-button>
          <el-button @click="openEdit('go')">跟单</el-button>
          <el-button @click="() => uploadFile()">附件</el-button>
        </div>
      </div>
      <div class="z-content">
        <el-card>
          <!-- 搜索条件 -->
          <header-search :searchArr="searchArr" @sureSearch="searchMethod" :isPrint='true' printtype='order_no' :selectRow='selectRow'>
            <slot>
              <!-- <el-button @click="operationFun('print')">打印</el-button> -->
              <el-button @click="operationFun('print')" style="margin-top: -2px;">打印</el-button>
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
      <Approval v-if="approvalVisible" :ids="ids" :approvalVisible.sync="approvalVisible" :approvalText="approvalText" :titletype="titletype"></Approval>
      <Push :pushVisible.sync="pushVisible" :pushlText="pushlText" ></Push>
      <div v-if="openmodal">
        <open-modal :billId="billId" billType="Track" @closeModal="(value)=>{this.openmodal=false}" />
      </div>
    </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
import { getTracklist,submitTrack,revocationTrack,deleteTrack } from "@/api/production/productionDocumentary"
import {downloadsome} from "@/utils/auth"
import { deepCopy,} from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
import Approval from "./approval"
import Push from "./Push"
import OpenModal from '@/components/commonUpload'
export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
    Approval,
    Push,
    OpenModal
  },
  mixins: [orderMixins],
  data() {
    return {
       openmodal:false,
      billId:"",
      ids:"",
      approvalVisible: false,
      pushVisible: false,
      approvalText: "审核",
      pushlText: "选择下推方向",
      titletype: "",
      selectRow:{},
      queryForm: {},
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'billNo',
          label: '跟单任务号',
          render: (h, scope) => {
            return h(
              "a",
              {
                style: "color:blue",
                on: { click: () => this.openEdit('details', scope.row) },
              },
              scope.row.billNo
            );
          },
        },
        {
          prop: 'outsourceNo',
          label: '委外加工单号',
        }, {
          prop: 'productionTaskNo',
          label: '生产任务书号',
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
          prop: 'color',
          label: '颜色',
        }, {
          prop: 'qty',
          label: '数量',
        }, {
          prop: 'followManName',
          label: '跟单员',
        }, {
          prop: 'followProcess',
          label: '跟单流程',
        },{
          prop: 'remark',
          label: '备注',
        },
        {
          prop: 'businessStatusName',
          label: '业务状态',
        },
        {
          prop: 'billStatusName',
          label: '单据状态',
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
        // {
        //   label: '跟单任务号',
        //   value: 'orderNo',
        //   optionLabel: 'label',
        //   optionValue: 'value',
        //   type: 2,
        //   selectOption: [{
        //     label: '草稿',
        //     value: 0
        //   }, {
        //     label: '审核中',
        //     value: 1
        //   }, {
        //     label: '已审核',
        //     value: 2
        //   }]
        // },
        {
          label: '跟单任务号',
          value: 'billNo',
          type: 1,
          maxLength: 40,
        },
        {
          label: '物料',
          value: 'propertyMerge',
          type: 1,
          maxLength: 40,
        }, {
          label: '跟单员',
          value: 'followProcessName',
          type: 1,
          maxLength: 40,
        },
         {
          label: '跟单流程',
          value: 'followProcess',
          type: 1,
          maxLength: 40,
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
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        billNo: this.queryForm.billNo,
        followProcess: this.queryForm.followProcess,
        propertyMerge: this.queryForm.propertyMerge,
        billNo: this.queryForm.billNo,
      };


      if(Array.isArray(this.queryForm.createDate)) {
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
      getTracklist(params).then(res => {
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
          value: '12345',
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
          value: '02',
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
          text: '确认复制选中数据到新单据？',
          fun: this.copyOrder,
        },
      }

      if(objText[type].check) {
        if(type == 'delete'&&this.multipleSelection.length != 1) {
          this.$message.error("请选择一条操作项");
          return
        }
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
    exportCommonData() {
      let params = this.initParams();
      downloadsome(
        '/pd/track/export', params, '生产跟单模块清单.xls'
      )
    },
    //审核反审核操作
    audit(type,code, val) {

       if(!this.checkOperation('examine', this.multipleSelection, code || 'billStatus', val)) {
          return
        }
        this.ids = this.multipleSelection.map(item => { return item.id}).toString()
        if(type == 'examine' ||type == 'cancelAudit'
       || type=='cancelFinish' || type =='finish' || type == 'cancelClose' || type == 'close') {
          this.approvalText = type == 'examine' ? '审核' : type == 'cancelAudit' ? "反审核" : "提示";
          this.titletype = type == 'examine' ? '审核原因' :type == 'cancelAudit' ? "审核原因" :
          type == 'finish' ? "请填写完成原因" : type == 'cancelFinish' ? "请填写取消完成原因" :
          type == 'cancelClose' ? "请填写取消关闭原因" :"请填写关闭原因";
          this.approvalVisible = true;
        } else {
          this.pushlText = type == 'Push' ? '选择下推方向': "联查";
          this.pushVisible = true;
        }
    },
    /**
     * @desc 删除选中数据
     */
    delData() {
      this.loading = true
      deleteTrack({
        id:this.multipleSelection[0].id
      }).then(res => {
        this.loading = false
        this.$message.success('删除成功!')

        if (this.tableData.length === this.multipleSelection.length && this.pageParams.pageNum !== 1) {
          this.pageParams.pageNum--
        }

        this.getDataList()
      })
      .catch((error) => {
        this.loading = false
      })
    },
    /**
     * @desc 提交选中数据
     */
    submitData() {
       this.loading = true
      let ids = this.multipleSelection.map(item => {
       return item.id
     })

      submitTrack({
        ids:ids.toString()
      }).then(res => {
        if(res.code == 0) {
          this.loading = false
          this.$message.success('操作成功!')
         this.getDataList()
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch((error) => {
        this.loading = false
      })
    },
    /**
     * @desc 提交选中数据
     */
    withdrawData() {
       this.loading = true
      let ids = this.multipleSelection.map(item => {
       return item.id
     })

      revocationTrack({
        ids:ids.toString()
      }).then(res => {
        if(res.code == 0) {
          this.loading = false
          this.$message.success('操作成功!')
         this.getDataList()
        } else {
          this.$message.error(res.msg);
        }
      })
      .catch((error) => {
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

      if(type === 'edit') {
        if(this.multipleSelection.length != 1) {
          this.$message.error("请选择一条操作项");
          return
        }
        if(!this.checkOperation(type, this.multipleSelection, 'billStatus', '12345')) {
          return
        } else {
          data.data = deepCopy(this.multipleSelection[0])
        }
      }
      if(type === 'go') {
         if(this.multipleSelection.length != 1) {
          this.$message.error("请选择一条操作项");
          return
        }
       data.data = deepCopy(this.multipleSelection[0])
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
