<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog :title="billCodeText"
               :visible="showAddBox"
               @close="close"
               :close-on-click-modal="false">
      <div class="content">
        <div class="form">
          <form-list v-model="queryForm"
                     :formConfig="formConfig"
                     class="form form-order-box"></form-list>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary"
                   @click="submit">确认</el-button>
      </div>
    </el-dialog>
    <!-- 
    <look-up ref="lookup"
             :visible.sync="visible"></look-up> -->

    <look-up ref="lookup"
             :visible.sync="visible"
             :method="look.method"
             :table-column="look.tableColumn"
             :search-arr="look.searchArr"
             :isSelectMore="false"
             @setCheckItem="setCheckItem"
             :params="look.params"></look-up>

    <!-- 
    <look-up ref="lookup"
             :visible.sync="visible"
             @setCheckItem="setCheckItem"
             :method="look.method"
             :table-column="look.tableColumn"
             :search-arr="look.searchArr"
             :params="look.params"></look-up> -->

  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { checkFormData } from "@/lib/common";

import { searchDistrictApi, searchJurisdictionListApi, addJurisdictionApi, deleteJurisdictionApi, searchJurisdictionApi, jurisdictionUpdateApi } from "@/api/wareManagementApi/permissionMaintenance";
import lookUp from '@/components/ZLookUp/lookUp'; //lookup统一弹窗  :method="look.method"
import { lookData } from "./look"

export default {
  name: "add",
  components: { formList, commonTable, lookUp },

  mixins: [],

  props: {
    showAddBox: {
      type: Boolean,
      default: false
    },
    billCodeText: {
      type: String,
      default: ""
    },
    detail: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      districtList: [], //地区列表
      lookType: '', //look-up的类型
      queryForm: {},
      isEdit: true,
      salesmanListList: [],
      visible: false, //lookup展示条件
      basic: {
        clauseContent: true,
        billNo: "",
        orderTypeNo: "",
        bill: ""
      },
      tableData: [],
      selectList: [],
      look: {
        method: "",
        tableColumn: [],
        searchArr: [],
        params: {},
      },
    };
  },
  methods: {
    // look-up的关闭传值
    setCheckItem (val) {
      if (Array.isArray(val)) {
        //用户名称look-up
        if (this.lookType == 'userNameLookList') {
          this.$set(
            this.queryForm,
            "userName",
            val[0].fullName
          )
          Object.assign(this.queryForm, { "userId": val[0].id })
        } else {
          this.$set(
            this.queryForm,
            "warehouseName",
            val[0].warehouseName
          )
          Object.assign(this.queryForm, { "warehouseNo": val[0].warehouseNo })
        }
      }

    },
    //点击保存
    submit () {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      //新增
      if (this.billCodeText == "新增") {
        let params = {
          userId: this.queryForm.userId,
          userName: this.queryForm.userName,
          warehouseNo: this.queryForm.warehouseNo
        }
        addJurisdictionApi(params).then((res) => {
          console.log('res')
          this.$message.success('添加成功')
          // 去刷新页面
          this.close()
          this.$emit('initList')
        }).catch(() => {

        })
      } else {
        // 编辑
        let params = {
          id: this.queryForm.id,
          userId: this.queryForm.userId,
          userName: this.queryForm.userName,
          warehouseNo: this.queryForm.warehouseNo
        }
        jurisdictionUpdateApi(params).then((res) => {
          this.$message.success('修改成功')
          this.close()
          // 去刷新页面
          this.$emit('initList')
        }).catch(() => {

        })

      }


    },
    //关闭弹窗
    close () {
      this.$emit("update:showAddBox", false);
    },
    //初始化页面参数
    initQueryForm (data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
    },
    //lookup弹窗
    selectLook (val) {
      // 直接下拉框读取接口赋值
      this.lookType = val
      if (val == 'jurisdictionLookList') {
        this.initdistrictList(this, val)
      } else {
        this.look = lookData(this, val)
        this.visible = true;
      }
    },
    //获取仓库地区
    initdistrictList (that, val) {
      let params = {
        current: 1,
        size: 30
      }
      searchDistrictApi(params).then((res) => {
        this.districtList = res.data.records
        // 给数组赋值
        this.look = lookData(that, val)
        this.visible = true;
      }).catch((res) => {
        this.$message.error('接口错误')
      })
    }

  },
  computed: {
    formConfig () {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "userName",
          type: "input",
          subtype: "text",
          label: "用户名称",
          isEdit,
          attrs: {
            readonly: false,
            suffixIcon: "el-icon-arrow-down"
          },
          listeners: {
            focus: () => this.selectLook("userNameLookList")
          },
          placeholder: "请选择"
        },
        {
          key: "warehouseNo",
          type: "input",
          subtype: "text",
          label: "仓库权限",
          isEdit,
          attrs: {
            readonly: true,
            suffixIcon: "el-icon-arrow-down"
          },
          listeners: {
            focus: () => this.selectLook("jurisdictionLookList")
          },
          placeholder: "请选择"
        },
        // {
        //   key: isEdit ? "orderTypeName3" : "orderTypeNo3",
        //   type: isEdit ? "input" : "select",
        //   subtype: "text",
        //   label: "仓库权限",
        //   multiple: true,
        //   isEdit,
        //   rules: {
        //     required: true,
        //     trigger: "blur"
        //   }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "70px !important",
        formItemList: formItemList
      };
    },
  },

  watch: {
    // districtList (newVal, oldVal) {
    //   console.log('我是新旧', newVal, oldVal)
    // }
  },

  created () { },

  beforeMount () { },

  mounted () {
    if (this.billCodeText == "查看") {
      this.isEdit = false;
    }
    this.initQueryForm();

    // 观察标题有没有改变
    if (this.billCodeText == "编辑") {
      this.queryForm = this.detail
    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 565px !important;
    min-height: 100px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
        .form-order-box {
          .el-form-item {
            flex-basis: 100% !important;
            .el-form-item__content {
              width: 450px;
              .el-select {
                width: 100%;
              }
              .el-input {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
