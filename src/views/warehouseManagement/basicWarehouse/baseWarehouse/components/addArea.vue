<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div class="popBox">
    <el-dialog :title="billCodeText"
               :visible="areaVisible"
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

      <!-- <el-cascader :props="cascaderProps"></el-cascader> -->

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
import { checkFormData } from "@/lib/common";
import { addManagerAreaApi, editStoreDistrictApi } from "@/api/wareManagementApi/management";
import { Promise, promised } from 'q';
let id = 0
export default {
  name: "add",
  components: { formList },

  mixins: [],

  props: {
    areaVisible: {
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
      provinceList: [],
      cascaderProps: '', //省市区动态加载选项
      queryForm: {},
      id: 0,
      isEdit: true,
      salesmanListList: [],
      editFlag: false, //新增还是编辑
      basic: {
        clauseContent: true,
        billNo: "",
        orderTypeNo: "",
        bill: ""
      }
    };
  },
  methods: {
    // 获取省市区
    // getProvinceList () {
    //   let that = this
    //   let _cascaderProps = {
    //     lazy: true,
    //     lazyLoad (node, resolve) {
    //       const { level } = node;
    //       // setTimeout(() => {
    //       //   const nodes = Array.from({ length: level + 1 })
    //       //     .map(item => ({
    //       //       value: ++id,
    //       //       label: `选项111${id}`,
    //       //       leaf: level >= 3
    //       //     }));
    //       //   console.log('我是当前节点', nodes, level)
    //       //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
    //       //   resolve(nodes);
    //       // }, 1000);
    //       //异步事件
    //       if (level == 0) {
    //         that.getProvinceListChild().then((provinceList) => {
    //           const nodes = provinceList.map((province) => ({
    //             value: province.code,
    //             label: province.name,
    //             leaf: level >= 3
    //           }))
    //           resolve(nodes);
    //         }).catch(() => {
    //           console.log('我错了')
    //         })
    //       }
    //       if (level == 1) {
    //         that.getProvinceListChild().then((provinceList) => {
    //           const nodes = provinceList.map((province) => ({
    //             value: province.code,
    //             label: province.name,
    //             leaf: level >= 3
    //           }))
    //           resolve(nodes);
    //         }).catch(() => {
    //           console.log('我错了')
    //         })
    //       }
    //       if (level == 2) {
    //         that.getProvinceListChild().then((provinceList) => {
    //           const nodes = provinceList.map((province) => ({
    //             value: province.code,
    //             label: province.name,
    //             leaf: level >= 3
    //           }))
    //           resolve(nodes);
    //         }).catch(() => {
    //           console.log('我错了')
    //         })
    //       }
    //       if (level == 3) {
    //         that.getProvinceListChild().then((provinceList) => {
    //           const nodes = provinceList.map((province) => ({
    //             value: province.code,
    //             label: province.name,
    //             leaf: level >= 3
    //           }))
    //           resolve(nodes);
    //         }).catch(() => {
    //           console.log('我错了')
    //         })
    //       }


    //     }
    //   }
    //   this.cascaderProps = _cascaderProps
    //   console.log('我是当前节点', this.cascaderProps)
    // },

    // //获取省
    // getProvinceListChild () {
    //   return new Promise((resolve, reject) => {
    //     getProvinceList().then(res => {
    //       if (res.success) {
    //         resolve(JSON.parse(res.data))
    //       }
    //     })
    //   })
    // },


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


    //点击保存
    submit () {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      //判断是新增还是编辑
      if (this.billCodeText != "编辑") {
        //新增地区
        let params = {
          detailAddr: this.queryForm.detailAddr,
          regionAddr:this.queryForm.regionAddr.toString(), //暂时写死
          regionName: this.queryForm.regionName,
          regionNo: this.queryForm.regionNo
        }
        addManagerAreaApi(params).then((res) => {
          console.log('我是res', res)
          if (res.success) {
            this.$message.success('地区添加成功!')
            this.$emit("update:areaVisible", false);
          }
        }).catch((res) => { })
      } else {
        // 编辑地区
        let params = {
          id: this.detail.id,
          detailAddr: this.queryForm.detailAddr,
           regionAddr:this.queryForm.regionAddr.toString(), //暂时写死
          regionName: this.queryForm.regionName,
          regionNo: this.queryForm.regionNo
        }
        editStoreDistrictApi(params).then((res) => {
          console.log('我是res', res)
          if (res.success) {
            this.$message.success('地区修改成功!')
            this.$emit("update:areaVisible", false);
          }
        }).catch((res) => { })
      }
    },
    //关闭弹窗
    close () {
      this.$emit("update:areaVisible", false);
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
  watch: {

  },
  computed: {

    formConfig () {
      let isEdit = !this.isEdit;
      let that = this
      let formItemList = [
        {
          key: "regionNo",
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
          key: "regionName",
          type: "input",
          subtype: "text",
          label: "地区名称",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        // {
        //   key: isEdit ? "regionAddr" : "regionAddr",
        //   type: isEdit ? "syncCascader" : "syncCascader",
        //   subtype: "text",
        //   label: "省市区",
        //   isEdit,
        //   cascaderProps: this.cascaderProps
        //   // options: this.salesmanListList,
        //   // optionLabel: "orderTypeName",
        //   // optionValue: "orderTypeNo",
        //   //placeholder: "暂时为写死默认[浙江省杭州市余杭区3]",
        // },
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


  created () { },

  beforeMount () { },

  mounted () {
    let  that=this;
    this.initQueryForm();
    // 获取省市区
    this.getProvinceList();    
    // 观察标题有没有改变
    if (this.billCodeText == "编辑") {
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
        .form-order-box {
          .el-form-item:nth-child(3) {
            flex-basis: 100% !important;
            .el-form-item__content {
              width: 450px;
              .el-cascader {
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
}
</style>
