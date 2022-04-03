<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog :title="billCodeText"
               :visible="wareVisible"
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
import {
  getProvinceList,
  getCityList,
  getAreaList,
  getTownList
} from "@/api/common";
import { addWarehouseApi, editWareHouseApi } from "@/api/wareManagementApi/management";

import { searchDistrictApi } from "@/api/wareManagementApi/permissionMaintenance";
import { searchUserApi } from "@/api/wareManagementApi/permissionMaintenance";

import { checkFormData } from "@/lib/common";


export default {
  name: "add",
  components: { formList },

  mixins: [],

  props: {
    wareVisible: {
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
      queryForm: {},
      isEdit: true,
      areaList: [], //所属地区列表
      manegerList: [], // 管理员列表
      provinceList:[],//省列表
      
      basic: {
        clauseContent: true,
        billNo: "",
        orderTypeNo: "",
        bill: ""
      }
    };
  },
  methods: {
    //初始化 下拉需要的数据
    // 所属地区接口
    initAreaData () {
      let params = {
        current: 1,
        size: 30
      }
      searchDistrictApi(params).then((res) => {
        this.areaList = res.data.records
      }).catch((res) => {
        this.$message.error('接口错误')
      })

    },

    //获取省
    getProvinceList () {
      getProvinceList().then(res => {
        if (res.code == 0) {
          this.provinceList = JSON.parse(res.data);
          // if (this.operateType == "edit" || this.operateType == "details") {
          //   this.init();
          // }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取市
    async getCityList (val) {
      return new Promise((resolve, reject) => {
        getCityList({ provinceCode: val }).then(res => {
          if (res.code == 0) {
            if (res.data) {
              let arr = JSON.parse(res.data);
              resolve(arr);
            } else {
              resolve([]);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    //获取区
    async getAreaList (val) {
      return new Promise((resolve, reject) => {
        getAreaList({ cityCode: val }).then(res => {
          if (res.code == 0) {
            if (res.data) {
              let arr = JSON.parse(res.data);
              resolve(arr);
            } else {
              resolve([]);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    //获取街道
    async getTownList (val) {
      return new Promise((resolve, reject) => {
        getTownList({ areaCode: val }).then(res => {
          if (res.code == 0) {
            if (res.data) {
              let arr = JSON.parse(res.data).map(i => {
                return { ...i, leaf: true };
              });
              resolve(arr);
            } else {
              resolve([]);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      });
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
    // 省市区初始化
    //获取省
    getProvinceList () {
      getProvinceList().then(res => {
        if (res.code == 0) {
          this.provinceList = JSON.parse(res.data);
          if (this.operateType == "edit" || this.operateType == "details") {
            this.init();
          }
          console.log('我是省', this.provinceList)
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取市
    async getCityList (val) {
      return new Promise((resolve, reject) => {
        getCityList({ provinceCode: val }).then(res => {
          if (res.code == 0) {
            if (res.data) {
              let arr = JSON.parse(res.data);
              resolve(arr);
            } else {
              resolve([]);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    //获取区
    async getAreaList (val) {
      return new Promise((resolve, reject) => {
        getAreaList({ cityCode: val }).then(res => {
          if (res.code == 0) {
            if (res.data) {
              let arr = JSON.parse(res.data);
              resolve(arr);
            } else {
              resolve([]);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    //获取街道
    async getTownList (val) {
      return new Promise((resolve, reject) => {
        getTownList({ areaCode: val }).then(res => {
          if (res.code == 0) {
            if (res.data) {
              let arr = JSON.parse(res.data).map(i => {
                return { ...i, leaf: true };
              });
              resolve(arr);
            } else {
              resolve([]);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    //点击保存
    submit () {
      // if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
      //   return;
      // }
      // 新增仓
      console.log('我是queryFrom', this.queryForm)
      if (this.billCodeText != "编辑") {
        let { detailAddr, managerName, regionAddr, storeRegionId, telephone, warehouseName, warehouseNo } = this.queryForm
        let params = {
          detailAddr, //详细地址
          managerName,
          regionAddr:regionAddr.toString(), //所属地区
          managerId: 0, // 管理员ID先写死
          storeRegionId: 1, //仓库地区id
          telephone, //	联系电话
          warehouseName,//仓名称
          warehouseNo//仓编号
        }
        addWarehouseApi(params).then((res) => {
          if (res.success) {
            this.$message.success('仓添加成功!')
            this.$emit("update:wareVisible", false);
          }
        }).catch(() => { })
      } else {
        let { detailAddr, managerName, regionAddr, storeRegionId, telephone, warehouseName, warehouseNo } = this.queryForm

        let params = {
          id: this.detail.id,
          detailAddr, //详细地址
          managerName,
          regionAddr:regionAddr.toString(), //所属地区
          managerId: 0, // 管理员ID先写死
          storeRegionId: storeRegionId, //仓库地区id
          telephone, //	联系电话
          warehouseName,//仓名称
          warehouseNo//仓编号
        }
        editWareHouseApi(params).then((res) => {
          if (res.success) {
            this.$message.success('仓修改成功!')
            this.$emit("update:wareVisible", false);
          }
        }).catch(() => { })
      }
    },
    //关闭弹窗
    close () {
      this.$emit("update:wareVisible", false);
    },
    //初始化页面参数
    initQueryForm (data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
      console.log('我是data', data)
    }
  },
  computed: {
    formConfig () {
      let isEdit = !this.isEdit;
      let that = this;
      let formItemList = [
        {
          key: "warehouseNo",
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
          key: "warehouseName",
          type: "input",
          subtype: "text",
          label: "仓名称",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        }, {
          key: isEdit ? "regionNo" : "regionName",
          type: isEdit ? "input" : "select",
          subtype: "text",
          label: "所属地区",
          isEdit,
          multiple: false,
          options: this.areaList,
          optionLabel: "regionName",
          optionValue: "id",
          placeholder: "请选择",
        }, {
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
        },

        {
          key: isEdit ? "regionAddr" : "regionAddr",
          type: "cascader",
          // subtype: "text",
          label: "省市区街道",
          options: this.provinceList,
          attrs: {
            props: {
              label: "name",
              value: "code",
              children: "children",
              lazy: true,
              lazyLoad (node, resolve) {
                const { level } = node;
                if (level == 1) {
                  setTimeout(() => {
                    that.getCityList(node.value).then(res => {
                      resolve(res);
                    });
                  }, 300);
                } else if (level == 2) {
                  setTimeout(() => {
                    that.getAreaList(node.value).then(res => {
                      resolve(res);
                    });
                  }, 300);
                } else if (level == 3) {
                  setTimeout(() => {
                    that.getTownList(node.value).then(res => {
                      resolve(res);
                    });
                  }, 300);
                } else {
                  resolve();
                }
              }
            },
          },
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        // {
        //   key: isEdit ? "regionAddr" : "regionAddr",
        //   type: isEdit ? "input" : "cascader",
        //   subtype: "text",
        //   label: "省市区",
        //   isEdit,
        //   multiple: true,
        //   options: this.areaList,
        //   optionLabel: "orderTypeName",
        //   optionValue: "orderTypeNo",
        //   placeholder: "请选择",
        // }, 
        {
          key: "telephone",
          type: "input",
          subtype: "text",
          label: "联系电话",
          maxlength: 200,
          isEdit,
          placeholder: "请输入",
        },
        {
          key: "detailAddr",
          type: "input",
          subtype: "textarea",
          label: "详细地址",
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
    this.initAreaData();
    this.initManagerData();
  },

  beforeMount () { },

  mounted () {
    this.initQueryForm();
    // 获取省市区
    this.getProvinceList();
    // 观察标题有没有改变
    if (this.billCodeText == "编辑") {


      // 省市区默认加载的数据 一层一层嵌套的写法
      let that=this;
       setTimeout(() => {
         this.queryForm = this.detail;

         this.queryForm.regionAddr=this.detail.regionAddr.split(',').map(item=>Number(item));

         this.queryForm.province= this.queryForm.regionAddr[0];
         this.queryForm.city= this.queryForm.regionAddr[1];
         this.queryForm.district=this.queryForm.regionAddr.length==4 ?   this.queryForm.regionAddr[2]:undefined;

         this.getCityList(that.queryForm.province).then(r => {
              this.provinceList.forEach((s, t) => {
                if (s.code == that.queryForm.province) {

                  that.$set(s, "children", r);
                  that.index1 = t;
                  if (that.queryForm.city) {
                    that.getAreaList(that.queryForm.city).then(q => {
                      that.provinceList[this.index1].children.forEach(
                        (i, t) => {
                          if (i.code == that.queryForm.city) {
                            that.index2 = t;

                         

                            if(this.queryForm.regionAddr.length<4){
                             
                             return that.$set(i, "children",  q.map(o => {
                                          return { ...o, leaf: true };
                                        }));
                              
                            }


                            that.$set(i, "children", q);

                            if (that.queryForm.district) {
                              this.getTownList(that.queryForm.district).then(
                                n => {
                                  that.provinceList[that.index1].children[
                                    that.index2
                                  ].children.forEach((i, t) => {
                                    if (i.code == that.queryForm.district) {
                                      that.$set(
                                        i,
                                        "children",
                                        n.map(o => {
                                          return { ...o, leaf: true };
                                        })
                                      );
                                    }
                                  });
                                }
                              );
                            }
                          }
                        }
                      );
                    });
                  }
                }
              });
            });        
       }, 100);


  
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
