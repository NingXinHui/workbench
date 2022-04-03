<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog
      :title="billCodeText"
      :visible="visible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
        <div class="form">
          <form-list
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          ></form-list>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>
      <look-up ref="lookup"
      :visible.sync="lookVisible" :isSelectMore="true" @setCheckItem="setCheckItem" :method="look.method" :table-column="look.tableColumn" :search-arr="look.searchArr" :params="look.params" ></look-up>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import { checkFormData } from "@/lib/common";
import lookUp from '@/components/ZLookUp/lookUp'; //lookup统一弹窗
import {addPurchaseType,searchPurchaseType,updatePurchaseType,getPersonList} from "@/api/purchase/base"
export default {
  name: "add",
  components: { formList,lookUp },

  mixins: [],

  props: {
    visible: {
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

  data() {
    return {
      queryForm: {},
      isEdit: true,
      lookVisible:false,
      look: {
        method: getPersonList,
         searchArr: [
      {
        label: "业务员",
        field: "fullName",
        type: 1,
        maxLength: "60"
      },
      {
        label: "手机号",
        field: "phone",
        type: 1,
        maxLength: "60"
      }
    ],
    tableColumn: [
      {
        label: "序号",
        type: "index",
        maxLength: "20"
      },
      {
        label: "业务员",
        prop: "fullName"
      },
      {
        label: "手机号",
        prop: "phone"
      },
      {
        label: "业务类型",
        prop: "positionName"
      },
      {
        label: "",
        prop: ""
      }
    ],
        params: {
          positionCode:"1"
        },
      },
      basic: {
        usable: true,
        purchaserList: [],
        typeName: "",
        typeNo: "",
        tradeMethod:[],
      },
      salesmanListList:[],
    };
  },
  methods: {
    //获取业务员
    getPersonList() {
      getPersonList({
        current:1,
        size:50,
        positionCode:"1"
      }).then(res => {
        if(res.success) {
           this.salesmanListList = [...this.salesmanListList,...res.data.records];
           var a = {}
           this.salesmanListList = this.salesmanListList.reduce((item, next) => {
       a[next.id] ? '' : a[next.id] = true && item.push(next);
      return item;
      }, []) ;
        }
      })
    },
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
        if(this.billCodeText == '新增') {
        addPurchaseType({
          ...this.queryForm,
          purchaserList:this.queryForm.purchaserList.toString(),
          tradeMethod:this.queryForm.tradeMethod.length == 1 ? this.queryForm.tradeMethod[0] : "0"
        }).then(res => {
          if(res.success) {
            this.$message.success("新增成功");
             this.$emit("update:visible", false);
              this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      } else {
         updatePurchaseType({...this.queryForm,
         purchaserList:this.queryForm.purchaserList.toString(),
          tradeMethod:this.queryForm.tradeMethod.length == 1 ? this.queryForm.tradeMethod[0] : "0",
         id:this.detail.id}).then(res => {
          if(res.success) {
            this.$message.success("修改成功");
             this.$emit("update:visible", false);
             this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      }
    },
    //关闭弹窗
    close() {
      this.$emit("update:visible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
    },
    setCheckItem(val) {
      this.salesmanListList = [...val, ...this.salesmanListList];
      var a = {}
       this.salesmanListList = this.salesmanListList.reduce((item, next) => {
       a[next.id] ? '' : a[next.id] = true && item.push(next);
      return item;
      }, []) ;
      val.forEach(item => {
        if(this.queryForm.purchaserList.indexOf(item.id) == -1) {
          this.queryForm.purchaserList.push(item.id)
        }
      })
    },
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "typeNo",
          type: "input",
          subtype: "text",
          label: "类型编号",
          isEdit,
          disabled: this.billCodeText == '编辑' ? true : false,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "typeName",
          type: "input",
          subtype: "text",
          label: "类型名称",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "tradeMethod",
          type: "select",
          subtype: "text",
          label: "贸易类型",
          isEdit,
          multiple: true,
          options: [{
            label: "国内",
            value: "1"
          },
          {
            label: "国外",
            value: "2"
          }],
          optionLabel: "label",
          optionValue: "value",
          placeholder: "请选择",
           rules: {
            required: true,
            trigger: "change"
          }
        },{
          key: isEdit ? "purchaserList" : "purchaserList",
          type: isEdit ? "input" : "selectLook",
          subtype: "text",
          label: "关联业务员",
          isEdit,
          multiple: true,
          collapse:true,
          options: this.salesmanListList,
          optionLabel: "fullName",
          showLook: () => {
            this.lookVisible = true;
          },
          optionValue: "id",
          placeholder: "请选择",
           rules: {
            required: true,
            trigger: "change"
          }
        },

        {
          key: "usable",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否可用",
          isEdit
        },
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

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
    this.getPersonList();
    if(this.billCodeText == "编辑") {
      searchPurchaseType({id: this.detail.id}).then(res => {
        if(res.success) {
          this.initQueryForm({
            ...res.data,
            purchaserList:res.data.purchaserList.split(","),
            tradeMethod:res.data.tradeMethod == "0" ? ["1", "2"] : [res.data.tradeMethod]
          })
          this.$nextTick(() => {
             let arr = res.data.purchaserList.split(",");
          let arr1 = res.data.purchaserNameList.split(",");
          arr.forEach((item, index) => {
            let obj = {
              fullName: arr1[index],
              id: item,
            }
            this.salesmanListList.push(obj);
          })
          var a = {}
           this.salesmanListList = this.salesmanListList.reduce((item, next) => {
       a[next.id] ? '' : a[next.id] = true && item.push(next);
      return item;
      }, []) ;
      console.log(this.salesmanListList)
          })
        } else {
          this.$message.error(res.msg);
        }
      })
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
         .el-form-item:nth-child(5) {
           flex-basis: 100% !important;
           .el-form-item__content {
           width: 450px;
           .el-input {
           width: 450px;
           }
           }
           }
         }
      }
    }
  }
}
</style>
