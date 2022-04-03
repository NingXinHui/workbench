<!--
@time:2021/9/29
@author:zhupeikang
-->
<template>
  <div>
    <div id="zPage">
      <div class="z-header">
        <div class="z-header-button ">
          <el-button @click="add">新增</el-button>
          <el-button @click="edit">编辑</el-button>
          <el-button class="delButton" @click="delOpen">删除</el-button>
          <el-button @click="submitOpen">提交</el-button>
          <el-button @click="auditOpen">审核</el-button>
          <el-button @click="auditCancel">反审核</el-button>
          <el-button @click="detailOpen">查看</el-button>
        </div>
      </div>
      <div class="z-content">
        <el-card>
          <div class="z-content-search">
            <header-search   :selectRow="selectRow" :searchArr="searchArr" @sureSearch="searchMethod">
              <template>
<!--                <el-form-item>-->
<!--                  <el-button class="search" type="primary">高级查询</el-button>-->
<!--                </el-form-item>-->
<!--                <el-form-item>-->
<!--                  <el-button>打印</el-button>-->
<!--                </el-form-item>-->
<!--                <el-form-item>-->
<!--                  <el-button>导出</el-button>-->
<!--                </el-form-item>-->
              </template>
            </header-search>
          </div>
          <div class="z-content-table">
            <common-table
                is-height
                ref="mainTable"
                :isMain="true"
                :tableColumn="tableColumn"
                :tableData="tableData"
                :isSelection="true"
                :loading="pageParams.loading"
                :pageParams="pageParams"
                @selePage="handleItemSelect"
                @pageChange="pageChange"
            />
          </div>
        </el-card>
      </div>
    </div>
    <!--审核弹窗-->
    <div class="popBox">
      <el-dialog title="审核" @close="()=>{reason=''}" :close-on-click-modal="false" :visible.sync="auditDialog">
        <div class="content">
          <div style="font-size: 12px;"><span style="color: #ED5751">*</span><span>审核原因</span></div>
          <div style="margin-top: 4px">
            <el-input
                :rows="10"
                type="textarea"
                placeholder="请输入"
                v-model="reason"
                maxlength="50"
                show-word-limit
            >
            </el-input>
          </div>
        </div>
        <div slot="footer" style="margin-top: 8px">
          <el-button @click="auditDialog=false">取消</el-button>
          <el-button type="primary" @click="audit">确认</el-button>
        </div>
      </el-dialog>
    </div>

    <!--反审核弹窗-->
    <div class="popBox">
      <el-dialog title="审核" @close="()=>{reason=''}" :close-on-click-modal="false" :visible.sync="auditCancelDialog">
        <div class="content">
          <div style="font-size: 12px;"><span style="color: #ED5751">*</span><span>审核原因</span></div>
          <div style="margin-top: 4px">
            <el-input
                :rows="10"
                type="textarea"
                placeholder="请输入"
                v-model="reason"
                maxlength="50"
                show-word-limit
            >
            </el-input>
          </div>
        </div>
        <div slot="footer" style="margin-top: 8px">
          <el-button @click="auditCancelDialog=false">取消</el-button>
          <el-button type="primary" @click="auditCancel">确认</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import Mixin from "@/lib/vuex-mixin";
import HeaderSearch from '@/components/CommonHeadSearch/ZmoreSearch'

const {mapGetters, mapActions} = new Mixin('order').getHelper()
import commonTable from '@/components/CommonTable'
import {order_audit, order_audit_cancel, order_reject, orderList} from "@/api/order";
import {dict, select_order_type} from "@/api/order/dict";
import {order_delete} from "@/api/order";
import {order_submit} from "@/api/order";

export default {
  name: "list",

  components: {HeaderSearch, commonTable},

  mixins: [],

  props: {},

  data() {
    return {
      //审核弹窗
      auditDialog: false,
      //反审核弹窗
      auditCancelDialog: false,
      selectRow: {},
      isAdd: true,
      reason: '',
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 0
      },
      tableColumn: [
        {
          type: 'index',
          label: '序号',
          width: 80,
          align: 'left'
        },
        {
          width: '200',
          prop: 'billNo',
          label: '订单编号',
          align: 'left',
          render: (h, scope) => {
            return h('el-link', {
              attrs: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.setData(scope.row)
                  this.setShowType(['edit', false])
                }
              }
            }, scope.row.billNo)
          }
        },
        {
          prop: 'orderType',
          label: '订单类型'
        },
        {
          prop: 'billStatusName',
          label: '审核状态'
        },
        {
          prop: 'customerName',
          label: '客户'
        },
        {
          prop: 'billDate',
          label: '订单日期'
        },
        {
          prop: 'salesName',
          label: '业务员'
        },
        {
          prop: 'qualityRequest',
          label: '质量要求'
        },
        {
          prop: 'currency',
          label: '币种'
        },
        {
          prop: 'exchangeRate',
          label: '汇率'
        },
        {
          prop: 'taxRate',
          label: '税率(%)'
        },
        {
          prop: 'tradeType',
          label: '结算方式'
        },
        {
          prop: 'createUser',
          label: '制单人'
        },
        {
          prop: 'createTime',
          label: '制单时间'
        }, {
          prop: 'address',
          label: '收货地址'
        }, {
          prop: 'refOrderNo',
          label: '参考订单编号',
          width: 200
        },{
          prop: 'refCustomerOrderNo',
          label: '客户订单编号',
          width: 200

        },{
          prop: 'remark',
          label: '备注'
        },
      ],
      tableData: [],
      searchArr: [
        {
          label: '订单编号',
          value: 'billNo',
          type: 1,
        },
        {
          label: '客户',
          value: 'customerName',
          type: 1,
          maxLength: '20'
        },
        {
          label: "订单类型",
          value: "orderType",
          type: 2,
        },
        {
          label: "审核状态",
          value: "billStatus",
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '草稿',
            value: 0
          }, {
            label: '审核中',
            value: 1
          }, {
            label: '已审核',
            value: 2
          }]
        },
        {
          label: '业务员',
          value: 'salesName',
          type: 1,
        },
        {
          label: '订单日期',
          value: 'billNo',
          type: 4,
        },
          {
          label: '交货日期',
          value: 'billNo',
          type: 4,
        },

        ],

      multipleSelection: [],

    }

  },
  computed: {},

  watch: {},

  beforeCreat() {

  },

  created() {

  },

  beforeMount() {
  },

  mounted() {


    this.getList()
    this.getDict()
  },
  methods: {
    getDict() {
      select_order_type().then(res => {
        this.searchArr[2].selectOption = res.data
        this.searchArr[2].optionLabel = 'orderTypeName'
        this.searchArr[2].optionValue = 'orderTypeNo'
      })
    },
    ...mapActions(['setShowType', 'setData', 'setAdd']),
    //获取编辑的表单信息
    getForm(e) {
      console.log(e)
    },
    //获取数据
    getList() {
      orderList(this.pageParams).then((res) => {
        if (res.success) {
          this.pageParams.loading = false
          this.pageParams.total = res.data.total
          this.tableData = res.data.records
        }
      })
    },
    //点击新增按钮
    add() {
      this.setShowType(['edit', 1])
      this.setAdd(true)
    },
    detail() {
      this.setShowType(['edit', false])
    },
    //审核按钮
    auditOpen() {
      if (!this.selectRow.id) {
        this.$message.error('请选择数据进行操作')
        return
      }
      this.auditDialog = true
    },
    //审核操作
    audit() {
      if (this.reason == '') {
        this.$message.error('审核原因为必填')
        return
      }
      order_audit({id: this.selectRow.id, reason: this.reason}).then(res => {
        if (res.success) {
          this.$message.success('审核成功')
          this.auditDialog = false
          this.getList()
        }
      })
    },
    //反审核
    auditCancel() {
      if (!this.selectRow.id) {
        this.$message.error('请选择数据进行操作')
        return
      }
      this.$confirm('确认取消审核中的数据吗？', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        order_audit_cancel({id: this.selectRow.id}).then(res => {
          if (res.success) {
            this.$message.success('反审核成功')
            this.getList()
          }
        })
      }).catch(() => {
      });

    },
    //查看按钮
    detailOpen(){
      if (!this.selectRow.id) {
        this.$message.error('请选择数据进行操作')
        return
      }
      this.setData(this.selectRow)
      this.setShowType(['edit', false])
    },

    //提交按钮
    submitOpen() {
      if (!this.selectRow.id) {
        this.$message.error('请选择数据进行操作')
        return
      }
      this.$confirm('确认提交选中的数据吗？', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        order_submit({id: this.selectRow.id}).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.getList()
          }
        })
      })
    },
    //删除按钮
    delOpen() {
      if (!this.selectRow.id) {
        this.$message.error('请选择数据进行操作')
        return
      }
      this.$confirm('确认删除选中的数据吗？', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        order_delete({id: this.selectRow.id}).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList()
          }
        })
      })
    },
    //驳回按钮
    reject() {
      if (this.reason == '') {
        this.$message.error('驳回原因为必填')
        return
      }
      order_reject({id: this.selectRow.id, reason: this.reason}).then(res => {
        if (res.success) {
          this.$message.success('驳回成功')
          this.auditDialog = false
          this.getList()
        }
      })
    },

    //点击编辑按钮
    edit() {
      if (this.multipleSelection.length > 1) {
        this.$message({
          message: '此操作不允许多条同时编辑',
          type: "error",
          showClose: true
        })
        return
      }
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择数据后进行操作',
          type: "error",
          showClose: true
        })
        return
      }
      if (this.selectRow.billStatus==2){
        this.$message.warning('此状态不允许编辑')
        return;
      }
      this.isAdd = false
      this.setData(this.selectRow)
      this.setShowType(['edit', 1])
    },
    //点击删除按钮
    del() {
      this.$confirm('确认删除选中的数据吗？', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
      });
    },
    //点击查询的操作
    searchMethod(e) {
      this.pageParams.pageNo = 1
      this.pageParams.loading = true
      Object.assign(this.pageParams, e)
      this.getList()
    },
    //选择事件
    handleItemSelect(val) {
      this.multipleSelection = val;
      if (val.length === 0) {
        this.selectRow = {}
      } else {
        this.selectRow = val[0];
      }
    },
    //翻页事件
    pageChange(e) {
      this.pageParams.pageNo = e.page
      this.pageParams.pageSize = e.limit
      this.getList()
    }
  },

  beforeUpdate() {

  },

  updated() {

  },

  activated() {

  },

  deactivated() {

  },

  beforeDestroy() {

  },

  destroyed() {
  }


}
</script>

<style scoped>

</style>
