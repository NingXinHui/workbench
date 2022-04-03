<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog :title="billCodeText"
               :visible="lastVisible"
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
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import { checkFormData } from "@/lib/common";
import { addManagerAreaApi, searchStoreLibraryApi, editStoreLibraryApi,editStoreLocationApi, addStoreLocationApi } from "@/api/wareManagementApi/management";
import {
  unitListAllNoPage
} from "@/api/apizhu";

export default {
  name: "add",
  components: { formList },

  mixins: [],

  props: {
    lastVisible: {
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
      storeLibraryList: [],//所属库
      units: [], // 单位
      queryForm: {},
      isEdit: true,
      salesmanListList: [],
      basic: {
        clauseContent: true,
        billNo: "",
        orderTypeNo: "",
        bill: ""
      }
    };
  },
  methods: {
    //初始化初始库
    initStoreLibrary () {
      let params = {
        current: 1,
        size: 50
      }
      searchStoreLibraryApi(params).then((res) => {
        console.log('我是res', res)
        this.storeLibraryList = res.data.records
      }).catch((res) => { })
    },
    // 初始化单位
    initUnit () {
      unitListAllNoPage().then(res => {
        // this.loading = false
        console.log('我是单位', res)
        this.units = res.data
        // this.pageParams.total = res.data.total
      }).catch(() => {
      })
    },
    //点击保存
    submit () {
      // if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
      //   return;
      // }
      //新增仓位  先写死部分数据
      let { capacityQty, libraryId, locationName, locationNo, showOut, unit, usable,clauseContent,orderTypeNo } = this.queryForm;


      if(isNaN(capacityQty)){
        return this.$message.error('库位容量强输入数字')
      }
   
      let params = {
        ...this.detail,
        capacityQty, //	库位容量
        libraryId, //库id
        locationName, //仓位名称
        locationNo, //仓位编号
        showOut:clauseContent,//是否对外显示，1是，0否
        unit:orderTypeNo, //unit
        usable //是否可用，1是，0否
      }
      if(this.detail.id){
        editStoreLocationApi(params).then((res) => {
        console.log('我是res', res)
        if (res.success) {
          this.$message.success('新增库成功!')
          this.$emit("update:lastVisible", false);
        }
        }).catch((res) => { })
      }
      


      else{
         addStoreLocationApi(params).then((res) => {
        console.log('我是res', res)
        if (res.success) {
          this.$message.success('新增库成功!')
          this.$emit("update:lastVisible", false);
        }
      }).catch((res) => { })
      }
    },
    //关闭弹窗
    close () {
      this.$emit("update:lastVisible", false);
    },
    //初始化页面参数
    initQueryForm (data = {}) {
      console.log(this.detail);
      console.log('你们的')
      let basic = this.basic;

      this.queryForm = {
        ...basic,
        ...data,
        ...this.detail
      };
      if(this.detail.unit){
        this.queryForm.orderTypeNo=this.queryForm.unit
      }
    }
  },
  computed: {
    formConfig () {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "locationNo",
          type: "input",
          subtype: "text",
          label: "编号",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "locationName",
          type: "input",
          subtype: "text",
          label: "仓位名称",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: isEdit ? "libraryId" : "libraryId",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "所属库",
          isEdit,
          multiple: false,
          options: this.storeLibraryList,
          optionLabel: "libraryName",
          optionValue: "id",
          placeholder: "请选择",
          rules: {
            required: true,
            message: "关联业务员不能为空"
          }
        },
        {
          key: "capacityQty",
          type: "input",
          subtype: "text",
          label: "库位容量",
          selctKey: "a",
          appendType: true,
          options: this.salesmanListList,
          optionLabel: "orderTypeName",
          optionValue: "orderTypeNo",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: isEdit ? "orderTypeName" : "orderTypeNo",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "",
          isEdit,
          multiple: false,
          options: this.units,
          optionLabel: "unitName",
          optionValue: "unitType",
          placeholder: "",
        },
        {
          key: "clauseContent",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否对外显示",
          isEdit
        }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "85px !important",
        formItemList: formItemList
      };
    }

  },

  watch: {},

  created () {
    this.initStoreLibrary()
    this.initUnit()
  },

  beforeMount () { },

  mounted () {
    this.initQueryForm();
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
          .el-form-item:nth-child(4) {
            flex-basis: 39% !important;
            margin-left: -15px;
            .el-form-item__content {
              width: 115px;
              .el-input {
                width: 115px;
              }
            }
          }
          .el-form-item:nth-child(5) {
            flex-basis: 14% !important;
            margin-left: -30px;
            .el-form-item__content {
              width: 66px;
              .el-select {
                width: 66px;
                .el-input {
                  width: 66px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>