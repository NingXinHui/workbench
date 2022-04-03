<template>
  <div id="zPage">
    <!-- 单据编码规则 -->
    <div class="z-content">
      <el-card>
        <header-search :searchArr="searchArr"
                       @sureSearch="searchMethod">
          <slot>
            <el-button @click="add()">设置编码规则</el-button>
            <el-button @click="look()">测试编码规则</el-button>
          </slot>
        </header-search>
        <div class="z-content-table">
          <common-table is-height
                        ref="mainTable"
                        :isMain="true"
                        :tableColumn="tableColumn"
                        :tableData="tableData"
                        :isSelection="true"
                        :loading="pageParams.loading"
                        :pageParams="pageParams"
                        @selePage="handleItemSelect"
                        @pageChange="pageChange" />
        </div>
        <div class="addE">
          <add fullTitle="设置编码规则"
               :visible.sync="visible"
               :model="selectRow"
               :is-add="isAdd"
               ref="addForm"  class="settopHeight"
               :form-column="formColumn"
               @submit="getForm"></add>
        </div>
        <div>
          <add fullTitle="测试编码规则"
               :visible.sync="lookDe.visible"
               :model="lookDe.selectRow" class="setHeight"
               :is-add="lookDe.isAdd"
               :showSure="true"
               :form-column="lookDe.formColumn"></add>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
import add from '@/components/AddUpdate'
import { getoFrmulaList, generatorTest, updateFormula } from "@/api/systemzhu/code"

export default {
  components: { HeaderSearch, commonTable, add },
  name: 'index',
  data () {
    return {
      lookDe: {
        visible: false,
        selectRow: {},
        formColumn: [
          {
            label: '单据号码',
            field: 'billNo',
            type: 1,
            disabled: true,
          }, {
            label: '重设号码',
            field: 'billFormulaResetNo',
            type: 1,
            disabled: true,
          }
        ]
      },
      isAdd: false,
      selectRow: {},
      visible: false,
      searchArr: [
        {
          label: '单据类型编号',
          value: 'code',
          type: 1,
        }, {
          label: '单据类型名称',
          value: 'name',
          type: 1,
        }
      ],
      tableColumn: [
        {
          prop: 'code',
          label: '单据类型编号',
          align: 'left'
        }, {
          prop: 'name',
          label: '单据类型名称',
          align: 'left'
        }
        , {
          prop: 'formula',
          label: '单据公式',
          align: 'left'
        }, {
          prop: 'formulaReset',
          label: '重设公式',
          align: 'left'
        }, {
          prop: 'remark',
          label: '备注',
          align: 'left'
        }
      ],
      pageParams: {
        loading: false,
        pageNo: 1,
        pageSize: 30,
        total: 1
      },
      formColumn: [
        {
          label: '单据类型编号',
          field: 'code',
          type: 1,
          disabled: true,
          rules: {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                this.$message({
                  message: '单据类型编号不能为空',
                  type: 'error',
                  offset: 50,
                  showClose: true,
                });
              } else {
                callback()
              }
            },
          },
        }, {
          label: '单据公式',
          field: 'formula',
          type: 1,
          maxlength: 100,
          icon: 'el-icon-question',
          active: false,
          active1: '系统公式说明',
          active2: [
            { label: '[1位年]->1', span: '[自动流水号]->1（可n位）' },
            { label: '[1位月]->1', span: '[1位流水号]->1（仅1位）' },
            { label: '[2位年]->04', span: '[2位流水号]->01' },
            { label: '[2位日]->01', span: '[4位流水号]->0001' },
            { label: '[2位月]->01', span: '[5位流水号]->00001' },
            { label: '[4位年]->2010', span: '[6位流水号]>000001' },
          ],
          active4: '示例编码',
          active5: ' X+[2位年]+[2位月]+[2位日]+[4位流水号]',
          width: '130',
          rules: {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                this.$message({
                  message: '单据公式不能为空',
                  type: 'error',
                  offset: 50,
                  showClose: true,
                });
              } else {
                callback()
              }
            },
          },
        }, {
          label: '单据类型名称',
          field: 'name',
          type: 1,
          disabled: true,
          rules: {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                this.$message({
                  message: '单据类型名称不能为空',
                  type: 'error',
                  offset: 50,
                  showClose: true,
                });
              } else {
                callback()
              }
            },
          },
        }, {
          label: '重设公式',
          field: 'formulaReset',
          type: 1,
          maxlength: 100,
          rules: {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                this.$message({
                  message: '单据公式不能为空',
                  type: 'error',
                  offset: 50,
                  showClose: true,
                });
              } else {
                callback()
              }
            },
          },
        },
        {
          label: '备注',
          field: 'remark',
          type: 4,
          maxlength: 200,
        }
      ],
      tableData: [],
      multipleSelection: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.pageParams.loading = true
      getoFrmulaList(this.pageParams).then((res) => {
        if (res.success) {
          this.pageParams.total = res.data.total
          this.tableData = res.data.records
          this.pageParams.loading = false
        }
      })
    },
    getForm (e) {
      let obj = {
        id: e.id,
        remark: e.remark,
        formula: e.formula,
        formulaReset: e.formulaReset,
      }
      updateFormula(obj).then((res) => {
        if (res.success) {
          this.$refs.mainTable.$refs.multipleTable.clearSelection()
          this.visible = false
          this.getList()
          return this.$message({ type: 'success', message: "编辑成功" })
        }
      })
    },
    add () {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择数据后进行操作',
          type: "warning",
          showClose: true
        })
        return
      }
      this.isAdd = false
      this.visible = true
      this.lookDe.visible = false
      this.lookDe.isAdd = false
      this.selectRow = {
        id: this.multipleSelection[0].id,
        code: this.multipleSelection[0].code,
        name: this.multipleSelection[0].name,
        formula: this.multipleSelection[0].formula,
        formulaReset: this.multipleSelection[0].formulaReset,
        remark: this.multipleSelection[0].remark
      }
    },
    look () {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择数据后进行操作',
          type: "warning",
          showClose: true
        })
        return
      }
      generatorTest({
        formula: this.multipleSelection[0].formula,
        formulaReset: this.multipleSelection[0].formulaReset
      }).then((res) => {
        if (res.success) {
          this.lookDe.selectRow = {
            billNo: res.data.formulaCode,
            billFormulaResetNo: res.data.formulaResetCode
          }
          this.lookDe.visible = true
          this.lookDe.isAdd = false
          this.isAdd = false
          this.visible = false
        }
      })

    },
    searchMethod (value) {
      this.pageParams = { ...this.pageParams, ...value, pageNo: 1 };
      this.getList();
    },
    //选择事件
    handleItemSelect (val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },
    //翻页、跳页事件
    pageChange (e) {
      this.pageParams.pageNo = e.page
      this.pageParams.pageSize = e.limit
      this.getList()
    },
  },

}
</script>
<style lang="less" scoped>
.setHeight /deep/ .el-dialog{
min-height: 140px !important;
height: 140px !important;
.el-dialog__body {
  min-height: 80px !important;
}
}
.settopHeight /deep/ .el-dialog{
min-height: 320px !important;
height: 320px !important;
.el-dialog__body {
  min-height: 240px !important;
  .el-form-item:nth-child(5) {
  .el-form-item__content {
   width: 440px !important;
   div {
    width: 440px !important;
    .el-textarea {
      .el-textarea__inner {
        height: 120px !important;
      }
    }
   }
  }
  }
}
}
#zPage /deep/ .el-card__body {
  height: calc(100vh - 114px);

  /deep/ .z-content {
    height: calc(100vh - 95px);
  }
}

/deep/ .addE {
  .popBox {
    .el-dialog {
      .el-dialog__body {
        min-height: 264px;
      }
    }
  }
}

/deep/ .formWidth {
  input {
    width: 155px;
  }

  .el-input__suffix {
    right: 30px !important;
  }
}

/deep/ .el-icon-question {
  color: #0066ff;
  font-size: 17px;
  position: absolute;
  right: 0px;
  top: 7px;
}

/deep/ .iconDiv {
  display: block;
  background: #fff;
  right: 11px;
  /* top: 32px; */
  width: 257px;
  height: auto;
  z-index: 9;
  font-size: 12px;
  line-height: 23px;
  color: #c9c9c9;
  position: fixed;
  border-radius: 2px;
  box-shadow: 0px 2px 8px 0px rgba(200, 201, 204, 0.5);
  padding-left: 10px;
  padding-top: 5px;

  .colorH {
    color: #505050;
    font-weight: bold;
  }

  .textlabel {
    float: left;
    width: 106px;
  }

  .textspan {
    float: left;
  }

  .shili {
    display: inline-block;
  }

  .divIn {
    height: 20px;
  }
}
</style>


