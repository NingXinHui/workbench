<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="selectOrder" v-show="!currentData.id"
          >选单</el-button
        >
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
        <el-button v-if="operateType != 'add'" @click="() => uploadFile()"
          >附件</el-button
        >
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus" v-if="queryForm.billStatus == 0"
          >编辑</el-button
        >
        <el-button plain @click="cancel">返回</el-button>
        <el-button plain @click="submit" v-if="queryForm.billStatus == 0"
          >提交</el-button
        >
        <el-button plain @click="auditVisible = true">审核记录</el-button>
        <el-button v-if="operateType != 'add'" @click="() => uploadFile()"
          >附件</el-button
        >
      </div>
    </div>
    <div class="z-content" v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('basicShow', !basicShow)">
              <i
                :class="
                  basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              基本信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              basicShow ? '' : 'details-height-none'
            ]"
          >
            <div style="padding-left:24px">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="first">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(1)"
                    class="form form-order-box formOne"
                  ></form-list>
                </el-tab-pane>
                <el-tab-pane label="业务信息" name="second">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(2)"
                    class="form form-order-box"
                  ></form-list>
                </el-tab-pane>
                <el-tab-pane label="质量要求" name="third">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(3)"
                    class="form form-order-box"
                  ></form-list>
                </el-tab-pane>
                <el-tab-pane label="其他信息" name="five">
                  <form-list
                    v-model="queryForm"
                    :formConfig="formConfigType(4)"
                    class="form form-order-box formFour"
                  ></form-list>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('detailsShow', !detailsShow)">
              <i
                :class="
                  detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              产品信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none'
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addDetails">新增</el-button>
              <!-- <el-button size="mini" plain @click="copyDetails">复制</el-button> -->
              <el-button
                size="mini"
                plain
                class="delButton"
                @click="deleteDetails"
                >删除</el-button
              >
            </div>
            <div class="z-content-table">
              <common-table
                :class="{ zTable: isEdit }"
                ref="mainTable"
                :isSelectMore="true"
                :isSelection="true"
                :tableColumn="tableColumn"
                :tableData="tableData"
                @selePage="handleSelectionChange"
                :tableheight="250"
                :isMain="true"
              ></common-table>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('metarilShow', !metarilShow)">
              <i
                :class="
                  metarilShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
              ></i>
              投料信息
            </span>
          </div>
          <div
            :class="[
              'z-details-content-box',
              metarilShow ? '' : 'details-height-none'
            ]"
          >
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addProduct">新增</el-button>
              <el-button size="mini" plain @click="copyProduct">复制</el-button>
              <el-button size="mini" plain class="delButton" @click="delProduct"
                >删除</el-button
              >
            </div>
            <div class="z-content-table">
              <common-table
                :class="{ zTable: isEdit }"
                ref="botTable"
                :isSelectMore="true"
                :isSelection="true"
                :tableColumn="botTablecol"
                :tableData="botTableData"
                @selePage="handleProductList"
                :tableheight="250"
                :isMain="true"
              ></common-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <AuditRecord :auditVisible.sync="auditVisible"></AuditRecord>
    <SelectOrderTable
      v-if="orderVisible"
      :orderVisible.sync="orderVisible"
      @selectTable="selectTable"
    ></SelectOrderTable>
    <look-up
      ref="lookup"
      v-if="visible"
      :isSelectMore="isSelectMore"
      :visible.sync="visible"
      @setCheckItem="setCheckItem"
      :method="look.method"
      :table-column="look.tableColumn"
      :search-arr="look.searchArr"
      :params="look.params"
      class="theLookUp"
      :lookWidth="'632px !important'"
    ></look-up>
    <!-- <div>
            <look-up :title="look.title" :visible.sync="popConfig.show" :isClearAll="true" @setCheckItem="popSubmit" :params="look.params"  :method="look.methods" :table-column="look.tableColumn" :search-arr="look.searchArr" ></look-up>
        </div> -->
    <div v-if="openmodal">
      <open-modal
        :billId="queryForm.id"
        billType="PRODUCT_TASK"
        @closeModal="
          value => {
            this.openmodal = false;
          }
        "
      />
    </div>
  </div>
</template>

<script>
import { checkFormData } from "@/lib/common";
import { getPersonList } from "@/api/purchase/base";
import OpenModal from "@/components/commonUpload";
import AuditRecord from "./AuditRecord";

import formList from "@/components/Form/formList";
import SelectOrderTable from "./selectOrderTable";
import commonTable from "@/components/CommonTable";

import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import { addone, copyone, deleteone, tablecol, botTablecol } from "./show";
import { formone, formtwo, formThree, formThreePlus, formFour } from "./form";
import looks from "./look";
import { serachAllType } from "@/api/master/supplierFile";
import {
  getDepartmentList,
  addDataOne,
  updateDataOne,
  cancelOne,
  autoSubmit,
  getUserDepartments,
  getTrackList,
  getfeedDetailList,
  getProduceDetail
} from "@/api/marketOrder";

export default {
  name: "Menuceng",
  components: {
    formList,
    commonTable,
    SelectOrderTable,
    lookUp,
    AuditRecord,
    OpenModal
  },
  props: {
    operateType: {
      type: String,
      default: "edit"
    },
    currentData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      metarilShow: true, //是否展示投料信息
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态
      orderVisible: false, //选单的弹窗
      auditVisible: false, //审核弹窗
      activeName: "first",
      queryForm: {}, //所有的表单的数据
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      botTableData: [], //投料信息表格
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      look: {
        method: getDepartmentList,
        tableColumn: [],
        searchArr: [],
        params: {}
      },
      isSelectMore: false,
      productTypeList: [],
      selectId: "",
      selectIndex: "", //业务员

      selectProductList: [],
      prodectionWorken: "",
      idList: [],
      productionList: [],
      followMan: [], //跟单员id
      theIndex: "", //跟单员下标
      openmodal: false,
      trackList: [] //跟单流程
    };
  },

  mounted() {
    if (this.operateType == "details") {
      this.isEdit = false;
    }

    if (
      this.operateType == "edit" ||
      this.operateType == "details" ||
      this.operateType == "copy"
    ) {
      let id = this.currentData.id;

      getProduceDetail(id)
        .then(res => {
          this.initFormAndTable(res.data);
          this.queryForm.documentaryFlow = res.data.documentaryFlow.toString();

          this.tableData = res.data.productionTaskDetailVOList.map(item => {
            return {
              ...item,
              followMan: item.followMan
                ? item.followMan.split(",")
                : item.followMan
            };
          });

          this.botTableData = res.data.productionTaskInputVOList;

          /*   res.data.contactList = res.data.contactList.map((i, r) => {
            return { ...i, isIndex: r };
          }); */
        })
        .catch(err => {});
    } else {
      // 挂载当前帐号的部门信息
      let userId = JSON.parse(localStorage.userInfoNow).userId;
      getUserDepartments(userId).then(res => {
        this.queryForm.productionDepartmentName =
          res.data.companyDeptVOList[0].departmentVOList[0].fullName;
        this.queryForm.productionDepartmentId =
          res.data.companyDeptVOList[0].departmentVOList[0].departmentId;

        // 展示用户信息
        this.queryForm.productionManName = res.data.userName;
      });
    }

    //  生产类型的下拉
    serachAllType(["productTaskType"])
      .then(res => {
        this.productTypeList = res.data.productTaskType;
        // console.log(res.data.productTaskType);
      })
      .catch(err => {
        this.$message.error(err.msg);
      });

    // 跟单员
    let params = {
      positionCode: "3"
    };
    getPersonList(params).then(res => {
      this.productionList = res.data.records;
    });

    // 跟单流程下拉
    getTrackList().then(res => {
      this.trackList = res.data.records;
    });
  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created() {
    this.initFormAndTable();
  },

  /**
   * @desc 存储一些数据变化需要页面更新的 比如searchArr  table的
   */
  computed: {
    tableColumn() {
      let isEdit = this.isEdit;
      return tablecol(this, isEdit);
    },
    botTablecol() {
      let isEdit = this.isEdit;
      return botTablecol(this, isEdit);
    },
    formOne() {
      return formone(this, !this.isEdit);
    },
    formTwo() {
      return formtwo(this, !this.isEdit);
    },

    formThree() {
      return formThree(this, !this.isEdit);
    },
    formThreePlus() {
      return formThreePlus(this, !this.isEdit);
    },
    formFour() {
      return formFour(this, !this.isEdit);
    }
  },

  methods: {
    //查看文件
    uploadFile() {
      if (!this.queryForm.id) return;
      this.openmodal = true;
    },

    formConfigType(type) {
      let obj = {
        1: this.formOne,
        2: this.formTwo,
        3:
          this.queryForm.productionTaskType == 1
            ? this.formThreePlus
            : this.formThree,
        4: this.formFour
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type]
      };
    },
    /*   handleItem(val) {
      console.log(val);
      this.queryForm = {
        ...val[0]
      };
      // this.tableData=val[0]
    }, */
    //选单数据
    selectTable(a) {
      console.log(a);
      // console.log(a[0].materialId);

      if (!this.tableData.length && a.length == 1) {
        this.queryForm.sourceBillNo = a[0].sourceBillNo;
        this.queryForm.sourceBillType = a[0].sourceBillType;
        this.queryForm.companyId = a[0].companyId;
        this.queryForm.companyName = a[0].companyName;
        this.queryForm.billNo = a[0].billNo;
        // this.queryForm.salesManDepartmentName = a[0].salesGroupName;
        // this.queryForm.salesManName = a[0].salesPersonName;

        this.idList.push(a[0].materialId);

        this.tableData = a.map(item => {
          return {
            ...item,

            salesPrice: item.taxIncludePrice
          };
        });
        // 当选中的选单数据存在materialId获取投料信息
        // console.log(a[0].materialId);
        if (a[0].materialId) {
          getfeedDetailList(a[0].materialId).then(res => {
            console.log(res.data);
            let obj = res.data.map(item => {
              return {
                ...item,
                materialDescription: item.materialDescribe,
                qty: item.unitQty
              };
            });
            this.botTableData.push(...obj);
          });
        }

        this.tableData = this.tableData.map((i, r) => {
          return { ...i, isIndex: r };
        });
        return;
      }
      let b = a.map(item => {
        return {
          ...item
        };
      });
      if (!this.tableData.length && a.length > 1) {
        let c = b[0];
        let flag = false;
        this.queryForm.sourceBillNo = c.sourceBillNo;
        this.queryForm.sourceBillType = c.sourceBillType;
        b.forEach(item => {
          /*  if (item.billNo == a.billNo) {
            this.tableData.push(item);
          } else {
            flag = true;
          } */

          if (item.materialNo == c.materialNo) {
            this.tableData.push(item);
          } else {
            flag = true;
          }
        });
        this.tableData = this.tableData.map((i, r) => {
          return { ...i, isIndex: r };
        });
        if (flag) {
          this.$message.error("选单数据只能选择同一条订单的明细");
        }
        return;
      }
      if (this.tableData.length) {
        let a = this.tableData[0];
        let flag = false;
        b.forEach(item => {
          if (item.billNo == a.billNo) {
            this.tableData.push(item);
          } else {
            flag = true;
          }
        });
        this.tableData = this.tableData.map((i, r) => {
          return { ...i, isIndex: r };
        });
        if (flag) {
          this.$message.error("选单数据只能选择同一条订单的明细");
        }
        return;
      }
    },
    updateStatus() {
      if (this.queryForm.billStatus != 0) {
        this.$message.error("当前状态不能编辑");
        return;
      }
      this.isEdit = !this.isEdit;
    },
    // 提交
    submit() {
      if (this.queryForm.billStatus != 0) {
        this.$message.error("当前状态不能提交审核");
        return;
      }

      this.loading = true;
      autoSubmit({
        ids: this.queryForm.id
      })
        .then(res => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.loading = false;
            this.$emit("submit");
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //lookup
    setCheckItem(val) {
      console.log(val);
      if (!val) {
        return;
      }
      if (this.look.type == "saleMan1") {
        if (Array.isArray(val)) {
          this.queryForm.productionManName = val[0].fullName;
          this.productionManId = val[0].id;
          this.queryForm.productionManId = val[0].id;
        } else {
          this.queryForm.productionManName = val.fullName;

          this.productionManId = val.id;
          this.queryForm.productionManId = val.id;
        }
      } else if (this.look.type == "saleMan") {
        if (Array.isArray(val)) {
          // console.log(val[0].id);
          this.queryForm.salesManName = val[0].fullName;
          this.queryForm.salesManId = val[0].id;
        } else {
          this.queryForm.salesManName = val.fullName;
          this.queryForm.salesManId = val.id;
        }
      } else if (this.look.type == "materil") {
        if (Array.isArray(val)) {
          this.botTableData[this.selectIndex].materialId = val[0].id;
          this.botTableData[this.selectIndex].materialNo = val[0].materialNo;
        } else {
          this.botTableData[this.selectIndex].materialId = val.id;
          this.botTableData[this.selectIndex].materialNo = val.materialNo;
        }
      } else if (this.look.type == "departMent1") {
        if (Array.isArray(val)) {
          this.queryForm.salesManDepartmentName = val[0].departmentName;
          this.queryForm.salesManDepartmentId = val[0].departmentId;
        } else {
          this.queryForm.salesManDepartmentName = val.departmentName;
          this.queryForm.salesManDepartmentId = val[0].departmentId;
        }
      } else if (this.look.type == "productDetail") {
        if (Array.isArray(val)) {
          // 判断每行编号不能重复
          let isTrue = this.idList.find(item => {
            return item === val[0].id;
          });
          console.log(isTrue);
          if (isTrue) {
            this.$message.error("已经选择过该产品");
            this.tableData[this.selectIndex].materialNo = "";
          } else {
            this.idList.push(val[0].id);
            this.tableData[this.selectIndex].materialNo = val[0].materialNo;
            this.tableData[this.selectIndex].materialName = val[0].materialName;
            this.tableData[this.selectIndex].materialDescription =
              val[0].materialDescription;
            this.tableData[this.selectIndex].unit = val[0].unit;
            this.tableData[this.selectIndex].salesPrice =
              val[0].salesGuidancePrice;
            // 新增数据添加物料id
            this.tableData[this.selectIndex].materialId = val[0].id; //物料id
            this.tableData[this.selectIndex].materialLot = ""; //物料编号目前置为而空
            // 根据产品编码获取对应的投料信息

            getfeedDetailList(val[0].id).then(res => {
              // console.log(res.data);
              let obj = res.data.map(item => {
                return {
                  ...item,
                  materialDescription: item.materialDescribe,
                  qty: item.unitQty
                };
              });
              // 如果新增的和已有的物料编号重复，数量叠加

              this.botTableData.forEach(item => {
                const o = obj.findIndex(i => {
                  return i.materialId == item.materialId;
                });
                if (o !== -1) {
                  this.botTableData[o].qty =
                    this.botTableData[o].qty + i.unitQty;
                } else {
                }
              });
            });
          }
        } else {
          // 判断每行编号不能重复
          let isTrue = this.idList.find(item => {
            return item === val.id;
          });

          if (isTrue) {
            this.$message.error("已经选择过该产品");
            this.tableData[this.selectIndex].materialNo = "";
          } else {
            this.idList.push(val.id);
            this.tableData[this.selectIndex].materialNo = val.materialNo;
            this.tableData[this.selectIndex].materialName = val.materialName;
            this.tableData[this.selectIndex].materialDescription =
              val.materialDescription;
            this.tableData[this.selectIndex].unit = val.unit;
            this.tableData[this.selectIndex].salesPrice =
              val.salesGuidancePrice;
            // 新增数据添加物料id
            this.tableData[this.selectIndex].materialId = val.id; //物料id
            this.tableData[this.selectIndex].materialLot = ""; //物料编号目前置为而空
            // 根据产品编码获取对应的投料信息
          }
        }
      } else if (this.look.type == "merchandiserName") {
        // 跟单员
        this.productionList = [...val, ...this.productionList];

        var a = {};
        this.productionList = this.productionList.reduce((item, next) => {
          // console.log(next.id);
          a[next.id] ? "" : (a[next.id] = true && item.push(next));
          return item;
        }, []);

        let datas = val.map(item => {
          return item.id;
        });
        let dataName = val.map(item => {
          return item.fullName;
        });

        /*  this.tableData[this.theIndex].followManName = [
          ...new Set([
            ...this.tableData[this.theIndex].followManName,
            ...dataName
          ])
        ]; */
        this.tableData[this.theIndex].followMan = [
          ...new Set([...this.tableData[this.theIndex].followMan, ...datas])
        ];
        //  把选中的lookup的id值放到已经展示了的idList当中

        /*   if (!this.tableData[this.theIndex].followMan) {
          this.tableData[this.theIndex].followMan = [];

          this.tableData[this.theIndex].followMan = [
            ...new Set([...this.tableData[this.theIndex].followMan, ...datas])
          ];
        } */
        console.log(this.tableData[this.theIndex].followMan);
        console.log(this.tableData[this.theIndex].followManName);
      } else {
        if (Array.isArray(val)) {
          this.queryForm.productionDepartmentName = val[0].departmentName;

          this.queryForm.productionDepartmentId = val[0].departmentId;
        } else {
          this.queryForm.productionDepartmentName = val.departmentName;
          this.queryForm.productionDepartmentId = val.departmentId;
        }
      }
    },
    //上方勾选
    handleTopSelectionChange(val) {},
    //添加投料信息
    addProduct() {
      let obj = {};
      this.botTableData.push(obj);
    },
    // 清空表格数据
    clearSelct(val) {
      this.$refs[val].resetSelect();
    },
    // 投料勾选数据
    handleProductList(val) {
      this.selectProductList = val;
    },
    //复制投料信息
    copyProduct() {
      if (!this.selectProductList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.botTableData = [...this.botTableData, ...this.selectProductList];
      this.botTableData = this.botTableData.map((s, x) => {
        return { ...s, isIndex: x };
      });
      this.clearSelct("botTable");
    },
    // 删除投料信息
    delProduct() {
      if (!this.selectProductList.length) {
        this.$message.error("请选择操作项");
        return;
      }

      this.selectProductList.forEach(item => {
        const i = this.botTableData.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        this.botTableData.splice(i, 1);
      });
      this.botTableData = this.botTableData.map((s, x) => {
        return { ...s, isIndex: x };
      });
      this.clearSelct("botTable");
    },

    //选单
    selectOrder() {
      this.orderVisible = true;
      // 获取选单数据
    },
    //lookup弹窗
    selectLook(val, e) {
      if (val == "departMent" && !this.queryForm.productionManName) {
        this.$message.error("请先选择生产业务员!!!");
        return;
      }
      if (val == "departMent") {
        this.look = looks[val];

        this.look.params = {
          userId: this.queryForm.productionManId
        };
      }
      // 业务员
      if (val == "departMent1") {
        this.look = looks[val];
        console.log(this.queryForm.salesManId);
        this.look.params = {
          userId: this.queryForm.salesManId
        };
      }
      if (val == "materil" || val == "productDetail") {
        this.look = looks[val];
        this.selectIndex = e.target.getAttribute("index");
        // console.log(this.selectIndex);
      }
      if (val == "merchandiserName") {
        this.look = looks[val];
        // this.selectIndex = e.target.getAttribute("index");
      }

      this.look = looks[val];
      this.visible = true;
    },
    /**
     * @desc 鼠标聚焦 执行的事件  按照个人需求
     */
    selectMaterial(e) {
      let index = Number(e.target.getAttribute("index"));

      if (isNaN(index)) {
        index = 0;
      }
    },

    /**
     * @desc 点击添加或编辑
     */
    saveData() {
      /*   if (type) {
        if (this.tableData.length < 1) {
          this.$message.error("明细信息未添加");
          return;
        } */
      let obj = [];
      if (this.queryForm.productionTaskType === 0) {
        obj = [
          ...this.formOne,
          ...this.formTwo,
          ...this.formThree,
          ...this.formFour
        ];
      } else {
        obj = [
          ...this.formOne,
          ...this.formTwo,
          ...this.formThreePlus,
          ...this.formFour
        ];
      }
      console.log(obj);
      if (!checkFormData(obj, this.queryForm)) {
        return;
      }

      let bool = true,
        title = "";
      console.log(this.tableColumn);
      this.tableColumn.forEach(item => {
        if (item.config && item.config.custormRules) {
          this.tableData.forEach((value, key) => {
            value.orderNumber = key + 1;
            console.log(
              this.tableData,
              value[item.config.key],
              value[item.config.key] !== 0,
              item.config.key
            );
            if (!value[item.config.key] && value[item.config.key] !== 0) {
              bool = false;
              title =
                "第" + (key + 1) + "行" + item.config.custormRules.message;
            }
          });
        }
      });

      if (!bool) {
        this.$message.error(title);
        return;
      }

      console.log(this.tableData);
      let taskDetailList = this.tableData.map(item => {
        return {
          ...item,
          followMan: item.followMan.toString()
        };
      });
      console.log(taskDetailList);

      // let taskInputList = [...this.botTableData];
      let taskInputList = [
        {
          directDelivery: true,
          hdrId: "12",
          materialId: "12",
          materialLot: "12",
          orderNumber: "12",
          overflowRate: "12",
          planLossRate: "12",
          qty: "12",
          shortageRate: "12",
          unit: "12"
        }
      ];

      let params = {
        id: this.currentData.id,
        ...this.queryForm,
        /*  productionTaskDetailVOList: [],
        productionTaskInputVOList: [], */
        taskInputList,
        taskDetailList: this.tableData.map(item => {
          return {
            ...item,
            followMan: item.followMan.toString()
          };
        })
      };

      console.log(params);

      if (this.operateType == "add" || this.operateType == "copy") {
        addDataOne(params)
          .then(res => {
            console.log(res);
            this.$message.success("操作成功");
            this.loading = false;
            this.$emit("submit");
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        updateDataOne(params)
          .then(res => {
            // console.log(res);
            this.$message.success("操作成功");
            this.loading = false;
            this.$emit("submit");
          })
          .catch(() => {
            this.loading = false;
          });
      }

      /*   if (params) {
          this.loading = true;
          objFun[type](params)
            .then(res => {
              this.$message.success("操作成功");
              this.loading = false;
              this.$emit("submit");
            })
            .catch(() => {
              this.loading = false;
            });
        } */
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
        upLoadList: [
          { value: "上传文件1.doc" },
          { value: "物料文档10.excel" },
          { value: "人员名单.ppt" }
        ], //上传文件

        taskDetailList: [],
        taskInputList: [],
        productionTaskType: 0,
        billStatus: "",
        brushed: "",
        businessStatus: "",
        cancelCloseReason: "",
        cancelCompleteReason: "",
        closeReason: "",
        color: "",
        companyId: "",
        completeReason: "",
        deliveryDate: "",
        documentaryFlow: "",
        dyeingType: "",
        gramWeight: "",
        otherIndex: "",
        productionCategory: 0,
        productionDepartmentId: "",
        productionManId: JSON.parse(localStorage.userInfoNow).userId, //生产业务员
        // productionManId: "",
        productionTaskType: "",
        productionType: "",
        pullOblique: "",
        purpose: "",
        remark: "",
        salesManDepartmentId: "",
        salesManId: "",
        sourceBillNo: "",
        sourceBillType: "",
        strength: "",
        productionManName: JSON.parse(localStorage.userInfoNow).username,
        productionDepartmentName: "",
        ...data
      };
    },

    /**
     * @desc 点击icon展示 关闭 下面的数据
     */
    isCancel(key, bool) {
      this[key] = bool;
    },

    /**
     * @desc 勾选复选框
     */
    handleSelectionChange(data) {
      console.log(data);
      this.multipleSelection = data;
    },

    /**
     * @desc 新增的
     */
    addDetails() {
      addone(this);
      console.log(this.tableData);
    },
    /**
     * @desc 复制明细
     */
    copyDetails() {
      copyone(this);
    },
    /**
     * @desc 删除明细
     */
    deleteDetails() {
      deleteone(this);
    }
  }
};
</script>

<style lang="less" scoped>
/* .tips {
} */
.formOne {
  ::v-deep .el-form-item:nth-child(6) {
    width: 258px !important;
  }
}
.formFour {
  ::v-deep .el-form-item:nth-child(2) {
    .el-form-item__content {
      .form-label-box {
        width: 200px !important;
      }
    }
  }
}
/deep/ .theLookUp {
  .el-form {
    .el-form-item {
      .el-form-item__content {
        width: 155px;
      }
    }
  }
}
</style>
