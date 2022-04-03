<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog :title="billCodeText"
               :visible="houseVisible"
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

import { addWareLibraryApi, editStoreLibraryApi } from "@/api/wareManagementApi/management";
import { storeWarehouseApi, searchUserApi } from "@/api/wareManagementApi/permissionMaintenance";


export default {
  name: "add",
  components: { formList },

  mixins: [],

  props: {
    houseVisible: {
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
      houserDataList: [],//所属仓
      queryForm: {},
      isEdit: true,
      salesmanListList: [], //所属仓
      manegerList: [], // 管理员列表
      basic: {
        clauseContent: true,
        billNo: "",
        orderTypeNo: "",
        bill: ""
      }
    };
  },
  methods: {
    // 初始化所属仓
    initStoreHouse () {
      console.log('我执行了')
      // 参数先写死
      let params = {
        current: 1,
        size: 30
      }
      storeWarehouseApi(params).then((res) => {
        this.houserDataList = res.data.records
      }).catch(() => {
      })
    },
    // 管理员接口
    initManagerData () {
      let params = {
        positionCode: 7
      }
      searchUserApi(params).then((res) => {
        this.manegerList = res.data.records
      }).catch((res) => {
        this.$message.error('接口错误')
      })
    },
    //点击保存
    submit () {
      // if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
      //   return;
      // }
      // 新增库
      // let params = {
      //   libraryName: "我是库",
      //   libraryNo: 1,
      //   managerId: "12",
      //   managerName: "学生",
      //   telephone: 15558383838,
      //   warehouseId: "1"
      // }
      if (this.billCodeText != "编辑") {
        // 新增库
        let { libraryName, libraryNo, managerName, telephone } = this.queryForm
        let params = {
          libraryName, libraryNo, managerName, telephone, libraryNo: Math.floor(Math.random() * 10), warehouseId: Math.floor(Math.random() * 10), managerId: Math.floor(Math.random() * 10)
        }
        // libraryNo: 1, warehouseId: 1 先写死,managerId:1
        addWareLibraryApi(params).then((res) => {
          if (res.success) {
            this.$message.success('添加库成功!')
          }
          this.close()
        }).catch((res) => {
          this.$message.error(res.msg)
          // this.$message.error('接口异常')
        })
      } else {
        // 编辑库
        let { libraryName, libraryNo, managerName, telephone } = this.queryForm
        let params = {
          id: this.detail.id,
          libraryName, libraryNo, managerName, telephone, libraryNo: Math.floor(Math.random() * 10), warehouseId: Math.floor(Math.random() * 10), managerId: Math.floor(Math.random() * 10)
        }
        // libraryNo: 1, warehouseId: 1 先写死,managerId:1
        editStoreLibraryApi(params).then((res) => {
          if (res.success) {
            this.$message.success('添加库成功!')
            this.close()
          }
          this.close()
        }).catch((res) => {
          this.$message.error(res.msg)
        })
      }
    },

    //关闭弹窗
    close () {
      this.$emit("update:houseVisible", false);
    },
    //初始化页面参数
    initQueryForm (data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
    }
  },
  computed: {
    formConfig () {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "libraryNo",
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
          key: "libraryName",
          type: "input",
          subtype: "text",
          label: "库名称",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: isEdit ? "managerName" : "managerName",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "管理员",
          isEdit,
          multiple: false,
          options: this.manegerList,
          optionLabel: "fullName",
          optionValue: "id",
          placeholder: "请选择",
        }, {
          key: isEdit ? "managerId" : "managerId",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "所属仓",
          isEdit,
          multiple: false,
          options: this.houserDataList,
          optionLabel: "warehouseName",
          optionValue: "warehouseNo",
          placeholder: "请选择",
        },
        {
          key: "telephone",
          type: "input",
          subtype: "text",
          label: "联系电话",
          maxlength: 200,
          isEdit,
          placeholder: "请输入",
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

  created () {
    this.initStoreHouse()
    this.initManagerData()
  },

  beforeMount () { },

  mounted () {
    this.initQueryForm();
    // 观察标题有没有改变
    if (this.billCodeText == "编辑") {
      this.queryForm = this.detail
    } else {
      this.queryForm = ''
    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 545px !important;
    min-height: 100px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
      }
    }
  }
}
</style>
