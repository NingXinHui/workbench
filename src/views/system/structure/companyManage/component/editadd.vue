<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="cancel">返回</el-button>
        <el-button plain @click="updateStatus">编辑</el-button>
      </div>
    </div>
    <div class="z-content" v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-icon">
            <span
              @click="isCancel('basicShow', !basicShow)"
              style="letter-spacing: 1.54px;"
            >
              <i
                :class="
                  basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              基本资料
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              basicShow ? '' : 'details-height-none'
            ]"
          >
            <div style="padding-left:24px">
              <form-list
                v-model="queryForm"
                :formConfig="formConfigType(1)"
                class="form form-order-box formOne"
              ></form-list>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
            <span
              @click="isCancel('detailsShow', !detailsShow)"
              style="letter-spacing: 1.54px;"
            >
              <i
                :class="
                  detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              注册信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none'
            ]"
          >
            <form-list
              v-model="queryForm"
              :formConfig="formConfigType(2)"
              class="form form-order-box"
            ></form-list>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import { formone, formtwo } from "./form";
import {
  addCompany,
  updateCompany,
  getCompanyDetail
} from "@/api/systemzhu/company";
import { checkFormData } from "@/lib/common";
import {
  getProvinceList,
  getCityList,
  getAreaList,
  getTownList
} from "@/api/common";
export default {
  name: "edit",
  components: { formList },
  props: {
    operateType: {
      type: String,
      default: "edit"
    },
    currentData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      content: "",
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态
      activeName: "first",
      queryForm: {}, //所有的表单的数据
      visible: false, //lookup展示条件
      provinceList: [], //省
      index1: 0,
      index2: 0
    };
  },

  mounted() {
    if (this.operateType == "details") {
      this.isEdit = false;
    }
  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created() {
    this.initFormAndTable();
    this.getProvinceList();
  },

  /**
   * @desc 存储一些数据变化需要页面更新的 比如searchArr  table的
   */
  computed: {
    tableColumn() {
      let isEdit = this.isEdit;
      return tablecol(this, isEdit);
    },
    formOne() {
      return formone(this, !this.isEdit);
    },
    formTwo() {
      return formtwo(this, !this.isEdit);
    }
  },

  methods: {
    updateStatus() {
      this.isEdit = !this.isEdit;
    },
    init() {
      getCompanyDetail({
        id: this.currentData.id
      }).then(res => {
        if (res.code == 0) {
          res.data.allAddress1 =
            res.data.provinceName +
            res.data.cityName +
            res.data.districtName +
            res.data.townName;
          res.data.type = String(res.data.type);
          res.data.typeName =
            String(res.data.type) == "0" ? "主公司" : "分公司";
          this.initFormAndTable(res.data);
          let that = this;
          if (that.queryForm.province) {
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
                            if (that.queryForm.district) {
                              that.$set(i, "children", q);
                              this.getTownList(that.queryForm.district).then(
                                n => {
                                  if (!n.length) {
                                    that.$set(
                                      i,
                                      "children",
                                      q.map(item => {
                                        return { ...item, leaf: true };
                                      })
                                    );
                                    return;
                                  }
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
          }
          if (that.queryForm.district) {
            that.queryForm.allAddress.push(Number(that.queryForm.province));
            that.queryForm.allAddress.push(Number(that.queryForm.city));
            that.queryForm.allAddress.push(Number(that.queryForm.district));
          }
          if (that.queryForm.town) {
            that.queryForm.allAddress.push(Number(that.queryForm.town));
          }
          console.log(that.queryForm.allAddress);
          if (this.operateType == "details") {
            this.formOne[8].disabled = true;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取省
    getProvinceList() {
      getProvinceList().then(res => {
        if (res.code == 0) {
          this.provinceList = JSON.parse(res.data);
          if (this.operateType == "edit" || this.operateType == "details") {
            this.init();
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取市
    async getCityList(val) {
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
    async getAreaList(val) {
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
    async getTownList(val) {
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
    formConfigType(type) {
      let obj = {
        1: this.formOne,
        2: this.formTwo
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type]
      };
    },
    /**
     * @desc 点击添加或编辑
     */
    saveData() {
      let ziduan = ["province", "city", "district", "town"];
      console.log(this.queryForm.allAddress);
      this.queryForm.allAddress.forEach((item, index) => {
        this.queryForm[ziduan[index]] = item;
        this.queryForm.town =
          this.queryForm.allAddress.length == 3
            ? this.queryForm.allAddress[3]
            : "";
      });
      let obj = [...this.formOne, ...this.formTwo];
      if (!checkFormData(obj, this.queryForm)) {
        return;
      }
      this.loading = true;
      if (this.operateType == "add") {
        addCompany({
          ...this.queryForm
        })
          .then(res => {
            if (res.code == 0) {
              this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        updateCompany({
          ...this.queryForm,
          usable: this.queryForm.parentId == "0" ? true : this.queryForm.usable
        })
          .then(res => {
            if (res.code == 0) {
              this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    /**
     * @desc 回退到列表的页面
     */
    cancel() {
      if (this.isEdit) {
        this.$confirm("内容还未保存，确认返回吗？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$emit("submit");
          })
          .catch(() => {});
      } else {
        this.$emit("submit");
      }
    },

    /**
     * @desc 初始化界面的初始值
     */
    initFormAndTable(data = {}) {
      this.queryForm = {
        actualController: "",
        address: "",
        bankAccount: "",
        businessStatus: "",
        city: "",
        depositBank: "",
        district: "",
        enterpriseNature: "",
        fax: "",
        legalPerson: "",
        name: "",
        parentId: "",
        province: "",
        regAddress: "",
        regCapital: "",
        remark: "",
        shortName: "",
        telephone: "",
        town: "",
        type: "1",
        unifiedCreditCode: "",
        usable: true,
        allAddress: [],
        ...data
      };
    },

    /**
     * @desc 点击icon展示 关闭 下面的数据
     */
    isCancel(key, bool) {
      this[key] = bool;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .formOne {
  .el-form-item:nth-child(10) {
    .el-form-item__content {
      width: 1183px !important;
    }
  }
}
</style>
