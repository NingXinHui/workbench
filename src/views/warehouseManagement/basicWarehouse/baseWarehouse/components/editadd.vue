<template>
  <div id="zPage"
       class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit"
           class="z-header-button">
        <el-button plain
                   @click="saveData"
                   :disabled="loading">保存</el-button>
        <el-button plain
                   @click="cancel">取消</el-button>
      </div>
      <div v-else
           class="z-header-button">
        <el-button plain
                   @click="updateStatus"
                   :disabled="!isCanEdit">编辑</el-button>
        <el-button plain
                   @click="cancel">返回</el-button>
      </div>
    </div>

    <div class="z-content"
         v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('basicShowMain', !basicShowMain)">
              <i :class="
                  basicShowMain ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              基本信息
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              basicShowMain ? '' : 'details-height-none',
            ]">
            <div :class="[
                'z-details-content-box',
                basicShow ? '' : 'details-height-none',
              ]">
              <form-list v-model="queryForm"
                         :formConfig="formMain"
                         class="form form-order-box"></form-list>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('basicShow', !basicShow)">
              <i :class="
                  basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              品种信息
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              basicShow ? '' : 'details-height-none',
            ]">
            <form-list v-model="queryForm"
                       :formConfig="formOne"
                       class="form form-order-box"></form-list>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('detailsShow', !detailsShow)">
              <i :class="
                  detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              物料信息
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none',
            ]">
            <div v-if="isEdit"
                 class="z-details-btn">
              <el-button size="mini"
                         plain
                         @click="addDetails">新增</el-button>
              <el-button size="mini"
                         plain
                         @click="copyDetails">复制</el-button>
              <el-button size="mini"
                         plain
                         class="delButton"
                         @click="deleteDetails">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :class="{ zTable: isEdit }"
                            ref="mainTable"
                            :isSelectMore="true"
                            :isSelection="true"
                            :tableColumn="tableColumn"
                            :isChangeCloumn="true"
                            :tableData="tableData"
                            @selePage="handleSelectionChange"
                            :tableheight="450"
                            :isMain="true"></common-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- <div>
            <look-up :title="look.title" :visible.sync="popConfig.show" :isClearAll="true" @setCheckItem="popSubmit" :params="look.params"  :method="look.methods" :table-column="look.tableColumn" :search-arr="look.searchArr" ></look-up>
        </div> -->
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import { addone, copyone, deleteone, tablecol } from "./show";
import { formone } from "./form";

import { checkFormData } from "@/lib/common";

import {
  defineAddBatchByImport,
  propertyDefineListAll,
  materialDefineAdd,
  materialDefineUpdate,
  dictDataList, //获取等级列表
  itemDefineListAll,
  materialVarietyAdd,//新增
  materialVarietyGet,//获取详情
  materialVarietyUpdate,//编辑
  unitListAllNoPage //获取计量单位
} from "@/api/apizhu";
import { deepCopy } from "@/lib/common"
import { debuglog } from 'util';
export default {
  name: "Menuceng",
  components: { formList, commonTable },
  data () {
    return {
      basicShowMain: true, //上面的基本信息
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态

      activeName: "first",

      queryForm: {}, //所有的表单的数据

      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据

      dictTypeList: [], //选择的物料分类(最底层的)

      VarietiesList: [], //品种信息数组
      MaterList: [], //物料信息数组

      gradeList: [], //等级的数组列表

      allIdList: {}, //维护的所有的品种枚举的所有的下拉

      suoshuSortName: '',//所属分类的labelName 后端需要

      unitTypes: [] //计量单位集合
    };
  },

  mounted () {
    dictDataList("productGrade").then((res) => {
      // console.log(res);
      this.gradeList = res.data;
    });

  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created () {
    this.initFormAndTable();
  },

  props: {
    operateType: {
      type: String,
      default: "add",
    },
    currentData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  /**
   * @desc 存储一些数据变化需要页面更新的 比如searchArr  table的
   */
  computed: {
    tableColumn () {
      let isEdit = this.isEdit;
      return tablecol(this, isEdit);
    },
    formOne () {
      // return
      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: formone(this, !this.isEdit),
      };
    },

    formMain () {
      let formItemList = [
        {
          key: "materialTypeNo",
          type: "cascader",
          options: this.dictTypeList,
          subtype: "text",
          label: "所属分类",
          attrs: {
            props: {
              label: "typeName",
              value: "typeNo",
              children: "childrenList",
            },
          },
          listeners: {
            change: this.changeUpMater,
          },
          disabled: !this.isEdit || this.operateType != 'add',
          rules: {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                this.$message.error("大类编号不能为空");
              }
            },
          },
        },
      ];
      return {
        inline: true,
        labelWidth: "auto",
        size: "mini",
        formItemList,
      };
    },
  },

  methods: {
    //渲染计量单位的初始值
    initUnit () {
      unitListAllNoPage().then(res => {
        this.unitTypes = res.data
      })
    },
    updateStatus () {
      this.isEdit = true;
      setTimeout(() => {
        this.$forceUpdate()
      }, 10);
    },

    jiexiSortName (e) {
      let arr = [];

      let oldArr = this.dictTypeList;

      console.log(e);


      if (Array.isArray(e)) {
        // this.dictTypeList
        for (let i = 0; i < e.length; i++) {
          let obj = oldArr.find(item => item.typeNo == e[i]);
          arr.push(obj);
          if (obj.childrenList) {
            oldArr = obj.childrenList
          }
        }
      }
      // console.log(oldArr);
      console.log(arr);
      console.log('你们喜欢的');

      let name = '';
      arr.map((item, index) => {
        name = name + item.typeName + (index == arr.length - 1 ? '' : '|')
      })

      this.suoshuSortName = name;

    },

    changeUpMater (e, a, b) {
      this.jiexiSortName(e);



      let that = this;
      propertyDefineListAll({
        materialTypeNo: Array.isArray(e) ? e[e.length - 1] : e,
        propertyType: "VARIETIES",
      }).then((res) => {
        this.VarietiesList = res.data || [];
        res.data.map((item) => {
          if (item.propertyDataType == "ENUM") {
            itemDefineListAll({ propertyId: item.id }).then((response) => {
              that.$set(that.allIdList, item.id, response.data);
            });
          }
        });
      });
      propertyDefineListAll({
        materialTypeNo: Array.isArray(e) ? e[e.length - 1] : e,
        propertyType: "MATERIAL",
      }).then((res) => {
        this.MaterList = res.data || [];
        res.data.map((item) => {
          if (item.propertyDataType == "ENUM") {
            itemDefineListAll({ propertyId: item.id }).then((response) => {
              that.$set(that.allIdList, item.id, response.data);
            });
          }
        });
      });
    },

    formConfigType (type) {
      let obj = {
        1: this.formOne,
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type],
      };
    },
    /**
     * @desc 鼠标聚焦 执行的事件  按照个人需求
     */
    selectMaterial (e) {
      let index = Number(e.target.getAttribute("index"));

      if (isNaN(index)) {
        index = 0;
      }
    },

    /**
     * @desc 点击添加或编辑
     */
    saveData () {
      let objFun = {
        add: materialVarietyAdd,
        edit: materialVarietyUpdate,
      },
        type = this.operateType === "details" ? "edit" : this.operateType;

      if (objFun[type]) {
        if (this.tableData.length < 1) {
          this.$message.error("明细信息未添加");
          return;
        }

        if (
          !checkFormData(
            [...this.formOne.formItemList, ...this.formMain.formItemList],
            this.queryForm
          )
        ) {
          return;
        }

        let bool = true,
          title = "";

        this.tableColumn.forEach((item) => {
          if (item.config && item.config.custormRules) {
            this.tableData.forEach((value, key) => {
              value.orderNumber = key + 1;
              if (!value[item.config.key] && value[item.config.key] !== 0) {
                bool = false;
                title =
                  "第" + (key + 1) + "行" + item.config.custormRules.message;
              } else if (item.config.key === "deliveryDate") {
                if (
                  new Date(value[item.config.key]).getTime() <
                  new Date(this.queryForm.billDate).getTime()
                ) {
                  bool = false;
                  title = "第" + (key + 1) + "行销售交期不能小于订单日期";
                }
              }
            });
          }
        });

        if (!bool) {
          this.$message.error(title);
          return;
        }
        // let params = this.getEditParams(type);
        console.log(this.queryForm);
        console.log(this.tableData);

        // 在这里需要格式化数据 并且默认添加一些数据字段
        console.log(this.VarietiesList)

        console.log("我真的不想说什么了");

        // 重新组装上面的表单的数据
        let { varietyName, varietyNo = '', isIndex, materialTypeNo, orderNumber, ...other } = this.queryForm; //other里面的字段是配置的 后端需要
        let params = {
          ...this.queryForm,
          materialTypeName: this.suoshuSortName,
          // varietyName,
          varietyNo,
          materialTypeNo: Array.isArray(materialTypeNo) ? materialTypeNo[materialTypeNo.length - 1] : materialTypeNo,
          varietyPropertyList: this.VarietiesList.map((item) => {
            let nowId = {};
            // 如果是编辑的话 需要传一下Id
            if (this.queryForm.id && this.queryForm.varietyPropertyList.find(sele => sele.propertyId == item.id)) {

              nowId = {
                id: this.queryForm.varietyPropertyList.find(sele => sele.propertyId == item.id).id
              }
            }

            return {
              propertyId: item.id,
              propertyValue: "",
              usable: true,
              propertyLabel: item.propertyName,
              formula: item.formula ? item.formula : null,
              propertyDataType: item.propertyDataType,
              multiselect: item.multiselect,
              separator: item.separator ? item.separator : null,
              ...nowId

            };
          }),
        };

        for (let i in other) {
          params.varietyPropertyList = params.varietyPropertyList.map(item => {
            if (item.propertyId == i) {
              console.log(this.queryForm);
              console.log('李兰兰')
              item.propertyValue = other[i].toString()
            }
            return item
          })
        }

        // 重新组装表格的数据
        params.materialList = this.tableData.map((item) => {

          let oldmaterplist = deepCopy(item.materialPropertyList);
          // 获取是配置的字段,
          let {
            materialNo = "",
            materialName = "",
            specification = "",
            varietyNo = "",
            unit = "",
            taxRate = "",
            inventoryTopLimit = "",
            inventoryLowerLimit = "",
            remark = "",
            ...otherx
          } = item;

          item.materialPropertyList = this.MaterList.map((item) => {
            let seleId = {};
            if (this.queryForm.id && oldmaterplist.find(oldid => oldid.propertyId == item.id)) {
              seleId = {
                id: oldmaterplist.find(oldid => oldid.propertyId == item.id).id
              }

            }
            return {
              propertyId: item.id,
              propertyValue: "",
              propertyName: item.propertyName,
              usable: true,
              propertyLabel: item.propertyName,
              formula: item.formula ? item.formula : null,
              propertyDataType: item.propertyDataType,
              multiselect: item.multiselect,
              separator: item.separator ? item.separator : null,
              ...seleId
            };
          });

          for (let i in otherx) {

            item.materialPropertyList = item.materialPropertyList.map(item => {
              if (item.propertyId == i) {
                item.propertyValue = otherx[i].toString()
              }
              return item
            })
          }


          return {
            ...item,
            materialNo,
            materialName,
            specification,
            varietyNo,
            unit,
            taxRate,
            inventoryTopLimit,
            inventoryLowerLimit,
            remark,

            materialPropertyList: item.materialPropertyList
          };
        });

        console.log(params);

        if (params) {
          this.loading = true;
          objFun[type](params)
            .then((res) => {
              this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
            })
            .catch(() => {
              this.loading = false;
            });
        }
      }
    },
    /**
     * @desc 回退到列表的页面
     */
    cancel () {
      if (this.isEdit) {
        this.$confirm("内容还未保存，确认返回吗？", "", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$emit("submit");
          })
          .catch(() => { });
      } else {
        this.$emit("submit");
      }
    },

    // 获取详情
    detailsData () {
      this.loading = true;
      let params = {
        id: this.currentData.varietyId,
      };

      materialVarietyGet(params.id)
        .then((res) => {
          this.loading = false;
          console.log(res);
          console.log('主打兰')
          this.initQueryForm(res.data);
        })
        .catch((error) => {
          this.loading = false;
          this.initQueryForm();
        });
    },

    // 初始化该界面
    initQueryForm (data = {}) {
      let basic = this.basicData;



      defineAddBatchByImport(data.id ? { typeNo: data.materialTypeNo } : {}).then((res) => {
        if (res.success) {
          let obj = {};
          if (data.id) {
            // res.data.currentNodeNoList.pop();
            res.data.currentNodeNoList.shift();
            obj.parentId = res.data.currentNodeNoList;

            this.changeUpMater(data.materialTypeNo);


            console.log(data);
            console.log('看到的')

            data.varietyPropertyList.map(item => {
              obj[item.propertyId] = item.propertyValue.indexOf(',') > -1 ? item.propertyValue.split(',') : item.propertyValue;
              obj[item.propertyId + 'x'] = item.propertyLabel;

            })
            this.tableData = data.materialList.map(item => {
              item.materialPropertyList.map(itemx => {
                item[itemx.propertyId] = itemx.propertyValue;
                item[itemx.propertyId + 'x'] = itemx.propertyLabel;
              })
              return item;
            });

            console.log(this.tableData);
          }
          // console.log(data);

          this.queryForm = {
            ...basic,
            ...data,
            ...obj,
          };


          // console.log('李兰丽娜')
          this.dictTypeList = res.data.typeTreeList;

          this.jiexiSortName(obj.parentId)
        }
      });

      // if (data.orderDtlVOList) {
      //   this.tableColumn.forEach((item) => {
      //     if (item.config && item.config.type == "number") {
      //       data.orderDtlVOList.forEach((value) => {
      //         if (!value[item.config.key] && value[item.config.key] !== 0) {
      //           value[item.config.key] = undefined;
      //         }
      //       });
      //     }
      //   });
      //   this.tableData = data.orderDtlVOList;
      // }

      // this.queryContactById()
      // this.select_currency()
    },

    /**
     * @desc 初始化界面的初始值
     */
    initFormAndTable () {
      if (this.operateType === "details") {
        this.isEdit = false;

        if (this.currentData.billStatus == 0) {
          this.isCanEdit = true;
        } else {
          this.isCanEdit = false;
        }
      } else {
        this.isEdit = true;
      }
      if (this.operateType === "add") {
        this.initQueryForm();
      } else {
        this.detailsData();
      }
    },

    /**
     * @desc 点击icon展示 关闭 下面的数据
     */
    isCancel (key, bool) {
      this[key] = bool;
    },

    /**
     * @desc 勾选复选框
     */
    handleSelectionChange (data) {
      this.multipleSelection = data;
    },

    /**
     * @desc 新增的
     */
    addDetails () {
      addone(this);
    },
    /**
     * @desc 复制明细
     */
    copyDetails () {
      copyone(this);
    },
    /**
     * @desc 删除明细
     */
    deleteDetails () {
      deleteone(this);
    },

    selectSalesGroupName () {
      if (!this.queryForm.checkItemId) {
        this.$message.error("请先选择客户");
        return;
      }
      this.materialCategoryNo = "sale";
      this.popConfig.show = true;
    },
  },
};
</script>

<style lang="less">
.market-order-edit {
  .form-order-box {
    width: 1360px;

    .form-item-textarea .el-form-item__content {
      width: 88% !important;

      .clause-content-box {
        height: 120px;

        .el-textarea__inner {
          height: 100%;
        }
      }
    }
  }
}
</style>
<style lang='less' scoped>
</style>