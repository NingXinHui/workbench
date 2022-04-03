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
                   @click="updateStatus">编辑</el-button>
        <el-button plain
                   @click="cancel">返回</el-button>
      </div>
    </div>
    <div class="z-content"
         v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-content-box">
            <form-list v-model="queryForm"
                       :formConfig="formConfigType(1)"
                       class="form form-order-box"></form-list>
          </div>
          <div class="z-details-icon">
            <span @click="isCancel('basicShow', !basicShow)">
              <i :class="
                  basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              基本信息
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              basicShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <form-list ref="formTwo"
                         v-model="queryForm"
                         :formConfig="formConfigType(2)"
                         class="form form-order-box"></form-list>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('departmentShow', !departmentShow)">
              <i :class="
                  departmentShow
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "></i>
              部门信息
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              departmentShow ? '' : 'details-height-none'
            ]">
            <div v-if="isEdit"
                 class="z-details-btn">
              <el-button size="mini"
                         plain
                         @click="addDepart">新增</el-button>
              <el-button size="mini"
                         plain
                         @click="addPurchase">新增采购账期</el-button>
              <el-button size="mini"
                         plain
                         @click="addSale">新增销售账期</el-button>
              <el-button size="mini"
                         plain
                         class="delButton"
                         @click="delDepart">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :class="{ zTable: isEdit }"
                            ref="onemainTable"
                            :isSelectMore="true"
                            :isSelection="true"
                            :tableColumn="TableOnecol"
                            :tableData="queryForm.departmentList"
                            @selePage="handleDepartChange"
                            :tableheight="160"
                            :isMain="true"></common-table>
              <Period ref="purchase"
                      :showType="'1'"
                      v-show="showPurchase"
                      @setRule="setRule"
                      :selectRow="selectRow"></Period>
              <PeriodSale ref="sale"
                          :showType="'2'"
                          style="margin-top:5px"
                          @setRule="setRule"
                          :selectRow="selectRow"
                          v-show="showSale"></PeriodSale>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('personShow', !personShow)">
              <i :class="
                  personShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              联系人信息
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              personShow ? '' : 'details-height-none'
            ]">
            <div v-if="isEdit"
                 class="z-details-btn">
              <el-button size="mini"
                         plain
                         @click="addPerson">新增</el-button>
              <el-button size="mini"
                         plain
                         class="delButton"
                         @click="delPerson">删除</el-button>
              <el-button size="mini"
                         plain
                         @click="copyPerson">复制</el-button>
            </div>
            <div class="z-content-table">
              <common-table :class="{ zTable: isEdit }"
                            ref="twomainTable"
                            :isSelectMore="true"
                            :isSelection="true"
                            :tableColumn="Tabletwocol"
                            :tableData="queryForm.contactList"
                            @selePage="handleContactChange"
                            :tableheight="200"
                            :propTableHeight="150"
                            :isMain="true"></common-table>
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
            <span @click="isCancel('salesmanShow', !salesmanShow)">
              <i :class="
                  salesmanShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              业务员信息
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              salesmanShow ? '' : 'details-height-none'
            ]">
            <div v-if="isEdit"
                 class="z-details-btn">
              <el-button size="mini"
                         plain
                         @click="getSaleMan">获取</el-button>
            </div>
            <div class="z-content-table">
              <common-table :class="{ zTable: isEdit }"
                            ref="threemainTable"
                            :isSelectMore="true"
                            :isSelection="true"
                            :tableColumn="Tablethreecol"
                            :tableData="queryForm.businessPersonList"
                            @selePage="handleSelectionChange"
                            :tableheight="160"
                            :isMain="true"></common-table>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('businessShow', !businessShow)">
              <i :class="
                  businessShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              商务信息
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              businessShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <form-list v-model="queryForm"
                         :formConfig="formConfigType(3)"
                         class="form form-order-box"></form-list>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('InvoicingShow', !InvoicingShow)">
              <i :class="
                  InvoicingShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              开票信息
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              InvoicingShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <form-list v-model="queryForm"
                         :formConfig="formConfigType(4)"
                         class="form form-order-box"></form-list>
              <div v-if="isEdit"
                   class="z-details-btn">
                <el-button size="mini"
                           plain
                           @click="addInvoicing">新增</el-button>
                <el-button size="mini"
                           plain
                           class="delButton"
                           @click="delInvoicing">删除</el-button>
              </div>
              <div class="z-content-table">
                <common-table :class="{ zTable: isEdit }"
                              ref="fourmainTable"
                              :isSelectMore="true"
                              :isSelection="true"
                              :tableColumn="Tablefourcol"
                              :tableData="queryForm.invoiceList"
                              @selePage="handleinvoiceChange"
                              :tableheight="160"
                              :isMain="true"></common-table>
              </div>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('productShow', !productShow)">
              <i :class="
                  productShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              主营产品
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              productShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <div v-if="isEdit"
                   class="z-details-btn">
                <el-button size="mini"
                           plain
                           @click="addProduct">新增</el-button>
                <el-button size="mini"
                           plain
                           class="delButton"
                           @click="delProduct">删除</el-button>
              </div>
              <div class="z-content-table">
                <common-table :class="{ zTable: isEdit }"
                              ref="fivemainTable"
                              :isSelectMore="true"
                              :isSelection="true"
                              :tableColumn="Tablefivecol"
                              :tableData="queryForm.productList"
                              @selePage="handleproductChange"
                              :tableheight="160"
                              :isMain="true"></common-table>
              </div>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('factoryShow', !factoryShow)">
              <i :class="
                  factoryShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              工厂概况
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              factoryShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <form-list v-model="queryForm"
                         :formConfig="formConfigType(5)"
                         class="form form-order-box"></form-list>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('equipmentShow', !equipmentShow)">
              <i :class="
                  equipmentShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              设备情况
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              equipmentShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <div v-if="isEdit"
                   class="z-details-btn">
                <el-button size="mini"
                           plain
                           @click="addEquipment">新增</el-button>
                <el-button size="mini"
                           plain
                           class="delButton"
                           @click="delEquipment">删除</el-button>
              </div>
              <div class="z-content-table">
                <common-table :class="{ zTable: isEdit }"
                              ref="sixmainTable"
                              :isSelectMore="true"
                              :isSelection="true"
                              :tableColumn="Tablesixcol"
                              :tableData="queryForm.equipmentList"
                              @selePage="handleequipmentChange"
                              :tableheight="160"
                              :isMain="true"></common-table>
              </div>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('productionShow', !productionShow)">
              <i :class="
                  productionShow
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "></i>
              生产概况
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              productionShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <form-list v-model="queryForm"
                         :formConfig="formConfigType(6)"
                         class="form form-order-box"></form-list>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('abroadShow', !abroadShow)">
              <i :class="
                  abroadShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              国外工厂
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              abroadShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <div v-if="isEdit"
                   class="z-details-btn">
                <el-button size="mini"
                           plain
                           @click="addAbroad">新增</el-button>
                <el-button size="mini"
                           plain
                           class="delButton"
                           @click="delAbroad">删除</el-button>
              </div>
              <div class="z-content-table">
                <common-table :class="{ zTable: isEdit }"
                              ref="sevenmainTable"
                              :isSelectMore="true"
                              :isSelection="true"
                              :tableColumn="Tablesevencol"
                              :tableData="queryForm.factoryList"
                              @selePage="handlefactoryChange"
                              :tableheight="160"
                              :isMain="true"></common-table>
              </div>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('companyShow', !companyShow)">
              <i :class="
                  companyShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              关联企业
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              companyShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <div v-if="isEdit"
                   class="z-details-btn">
                <el-button size="mini"
                           plain
                           @click="addCompany">新增</el-button>
                <el-button size="mini"
                           plain
                           class="delButton"
                           @click="delCompany">删除</el-button>
              </div>
              <div class="z-content-table">
                <common-table :class="{ zTable: isEdit }"
                              ref="eightmainTable"
                              :isSelectMore="true"
                              :isSelection="true"
                              :tableColumn="Tableeightcol"
                              :tableData="queryForm.relevanceList"
                              @selePage="handleCompanyChange"
                              :tableheight="160"
                              :isMain="true"></common-table>
              </div>
            </div>
          </div>
        </div>
        <div class="z-details-content"
             v-if="queryForm.checkItemCategory != '1'">
          <div class="z-details-icon">
            <span @click="isCancel('extensionShow', !extensionShow)">
              <i :class="
                  extensionShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "></i>
              推广反馈标签
            </span>
          </div>
          <div :class="[
              'z-details-content-box',
              extensionShow ? '' : 'details-height-none'
            ]">
            <div style="padding-left:0px">
              <form-list v-model="queryForm"
                         :formConfig="formConfigType(7)"
                         class="form form-order-box"></form-list>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <look-up ref="lookup"
             :visible.sync="visible"
             :isSelectMore="false"
             :title="look.title"
             @setCheckItem="setCheckItem"
             :method="look.method"
             :table-column="look.tableColumn"
             :search-arr="look.searchArr"
             :params="look.params"></look-up>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import lookUp from "@/components/ZLookUp/lookUpImport"; //lookup统一弹窗
import Period from "./period";
import PeriodSale from "./periodSale";
import { checkFormData } from "@/lib/common";
import {
  serachAllType,
  lookupCheckItem,
  addCheckItem,
  updateCheckItem,
  getCheckItem
} from "@/api/master/supplierFile";
import {
  getProvinceList,
  getCityList,
  getAreaList,
  getTownList,
  getCountryList
} from "@/api/common";
import {
  TableOnecol,
  Tabletwocol,
  Tablethreecol,
  Tablefourcol,
  Tablefivecol,
  Tablesixcol,
  Tablesevencol,
  Tableeightcol
} from "./show";
import {
  formone,
  formonePlus,
  formtwo,
  formThree,
  formFour,
  formFive,
  formSix
} from "./form";
import looks from "./look";
export default {
  name: "Menuceng",
  components: { formList, commonTable, lookUp, Period, PeriodSale },
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
  data () {
    return {
      basicShow: true, //是否显示基本信息的模块
      departmentShow: true, //部门信息
      personShow: true, //联系人信息
      salesmanShow: true, //业务员信息
      businessShow: true, //商务信息
      InvoicingShow: true, //开票信息
      productShow: true, //主营产品
      factoryShow: true, //工厂概况
      equipmentShow: true, //设备情况
      productionShow: true, //生产概况
      abroadShow: true, //国外工厂
      companyShow: true, //关联企业
      extensionShow: true, //推广反馈标签
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态
      queryForm: {}, //所有的表单的数据
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
      look: {
        method: getProvinceList,
        tableColumn: [],
        searchArr: [],
        params: {}
      },
      selectDepartList: [], //部门勾选数据
      selectContactList: [], //联系人勾选数据
      selectInvoiceList: [], //开票信息勾选数据
      selectProductList: [], //主营产品勾选数据
      selectEquipmentList: [], //设备信息勾选数据
      selectFactoryList: [], //国外工厂勾选数据
      selectCompanyList: [], //关联企业勾选数据
      organizationType: [], //机构类型
      certificateType: [], //资质证书
      settlementType: [], //采购结算方式，销售结算方式
      supplierType: [], //客商类型
      supplierEquipmentType: [], //客商设备类型
      provinceList: [], //省
      companyList: [], //关联企业
      contactType: [], //联系人类型
      enterpriseBusinessType: [], //企业业务类型
      salesmanType: [], //业务员类型
      periodIndex: "", //账期表格索引
      showSale: false, //销售账期
      showPurchase: false, //展示采购账期
      selectRow: {}, //选中的账期明细
      countryList: [], //国家下拉
      selectPersonIndex: 0,
      index1: 0,
      index2: 0,
    };
  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created () {
    this.initFormAndTable();
    this.getProvinceList(); //获取省
  },

  /**
   * @desc 存储一些数据变化需要页面更新的 比如searchArr  table的
   */
  computed: {
    tableColumn () {
      let isEdit = this.isEdit;
      return tablecol(this, isEdit);
    },
    TableOnecol () {
      let isEdit = this.isEdit;
      return TableOnecol(this, isEdit);
    },
    Tabletwocol () {
      let isEdit = this.isEdit;
      return Tabletwocol(this, isEdit);
    },
    Tablethreecol () {
      let isEdit = this.isEdit;
      return Tablethreecol(this, isEdit);
    },
    Tablefourcol () {
      let isEdit = this.isEdit;
      return Tablefourcol(this, isEdit);
    },
    Tablefivecol () {
      let isEdit = this.isEdit;
      return Tablefivecol(this, isEdit);
    },
    Tablesixcol () {
      let isEdit = this.isEdit;
      return Tablesixcol(this, isEdit);
    },
    Tablesevencol () {
      let isEdit = this.isEdit;
      return Tablesevencol(this, isEdit);
    },
    Tableeightcol () {
      let isEdit = this.isEdit;
      return Tableeightcol(this, isEdit);
    },
    formOne () {
      return formone(this, !this.isEdit);
    },
    formonePlus () {
      if (this.queryForm.checkItemCategory == 1) {
        return [
          {
            key: "checkItemName",
            type: "input",
            subtype: "text",
            label: "企业名称",
            isEdit: !this.isEdit,
            placeholder: "请输入",
            rules: {
              required: true,
              trigger: "blur"
            }
          }
        ];
      } else {
        return formonePlus(this, !this.isEdit);
      }
    },
    formTwo () {
      return formtwo(this, !this.isEdit);
    },

    formThree () {
      return formThree(this, !this.isEdit);
    },
    formFour () {
      return formFour(this, !this.isEdit);
    },
    formFive () {
      return formFive(this, !this.isEdit);
    },
    formSix () {
      return formSix(this, !this.isEdit);
    }
  },
  mounted () {
    if (this.operateType == "details") {
      this.isEdit = false;
    }
    if (this.operateType == 'add') {
      let obj = {
        departmentName: "经营部",
        orderNumber: 0,
        purchaseAccountPeriodExpiryDate: "",
        purchaseAccountPeriodRule: "1",
        saleAccountPeriodExpiryDate: "",
        saleAccountPeriodRule: "1",
        accountPeriodDateList: [],
        settlementMethodPurchase: "1",
        settlementMethodSale: "1",
        disabled: true,
        usable: true,
        isIndex: this.queryForm.departmentList.length
      };
      this.showPurchase = false;
      this.showSale = false;
      this.clearSelct("onemainTable");
      this.queryForm.departmentList.push(obj);
    }
    this.serachAllType(); //获取词典数据
    this.lookupCheckItem(); //关联企业下拉
    this.getCountryList(); //获取国家
  },
  methods: {
    //编辑操作
    updateStatus () {
      if (this.queryForm.billStatus != 0) {
        this.$message.error("当前状态不能编辑");
        return;
      }
      this.isEdit = !this.isEdit;
    },
    //编辑或者查看时详情接口
    init () {
      getCheckItem({ id: this.currentData.id }).then(res => {
        if (res.code == 0) {
          res.data.name1 = res.data.invoiceList.length
            ? res.data.invoiceList[0].companyName
            : "";
          res.data.name2 = res.data.invoiceList.length
            ? res.data.invoiceList[0].dutyParagraph
            : "";
          res.data.allAddress = [];
          res.data.allAddress1 = "";
          if (res.data.qualificationCertificateList) {
            res.data.qualificationCertificateList = res.data.qualificationCertificateList.split(
              ","
            );
          }
          if (res.data.checkItemType) {
            res.data.checkItemType = res.data.checkItemType.split(",");
          }
          if (res.data.businessType) {
            res.data.businessType = res.data.businessType.split(",");
          }
          if (res.data.source) {
            res.data.source = res.data.source.split(",");
          }
          if (res.data.officeAddressProvince) {
            // res.data.allAddress.push(res.data.officeAddressProvince);
            res.data.allAddress1 += res.data.officeAddressProvinceName;

            let a = res.data.officeAddressProvince;
            this.getCityList(res.data.officeAddressProvince).then(res => {
              this.provinceList.forEach((s, t) => {
                if (s.code == a) {
                  this.$set(s, "children", res);
                  this.index1 = t;
                }
              });
            });
          }
          if (res.data.officeAddressCity) {
            // res.data.allAddress.push(res.data.officeAddressCity);
            res.data.allAddress1 += res.data.officeAddressCityName;
            let b = res.data.officeAddressCity;
            setTimeout(() => {
              this.getAreaList(res.data.officeAddressCity).then(res => {
                this.provinceList[this.index1].children.forEach((i, t) => {
                  if (i.code == b) {
                    this.index2 = t;
                    this.$set(i, "children", res);
                  }
                });
              });
            }, 500);
          }
          if (res.data.officeAddressDistrict) {
            // res.data.allAddress.push(res.data.officeAddressDistrict);
            res.data.allAddress1 += res.data.officeAddressDistrictName;
            let c = res.data.officeAddressDistrict;
            setTimeout(() => {
              this.getTownList(res.data.officeAddressDistrict).then(res => {
                this.provinceList[this.index1].children[
                  this.index2
                ].children.forEach((i, t) => {
                  if (i.code == c) {
                    this.$set(
                      i,
                      "children",
                      res.map(o => {
                        return { ...o, leaf: true };
                      })
                    );
                  }
                });
              });
            }, 1000);
          }
          if (res.data.officeAddressTown) {
            // res.data.allAddress.push(res.data.officeAddressTown);
            res.data.allAddress1 += res.data.officeAddressTownName;
          }
          res.data.departmentList = res.data.departmentList.map((i, r) => {
            return { ...i, isIndex: r };
          });
          res.data.businessPersonList = res.data.businessPersonList.map(
            (i, r) => {
              return { ...i, isIndex: r };
            }
          );
          res.data.contactList = res.data.contactList.map((i, r) => {
            return { ...i, isIndex: r };
          });
          res.data.equipmentList = res.data.equipmentList.map((i, r) => {
            return { ...i, isIndex: r };
          });
          res.data.factoryList = res.data.factoryList.map((i, r) => {
            return { ...i, isIndex: r };
          });
          res.data.invoiceList = res.data.invoiceList.map((i, r) => {
            return { ...i, isIndex: r };
          });
          res.data.productList = res.data.productList.map((i, r) => {
            return { ...i, isIndex: r };
          });
          res.data.relevanceList = res.data.relevanceList.map((i, r) => {
            return { ...i, isIndex: r };
          });
          this.initFormAndTable(res.data);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //查询关联企业下拉
    lookupCheckItem () {
      // lookupCheckItem({
      //   current: 1,
      //   size: 50
      // }).then(res => {
      //   if (res.code == 0) {
      //     this.companyList = res.data;
      //   }
      // });
    },
    //查询所有的词典下拉
    serachAllType () {
      serachAllType([
        "organizationType",
        "certificateType",
        "settlementType",
        "supplierType",
        "enterpriseBusinessType",
        "supplierSource",
        "supplierEquipmentType",
        "contactType",
        "salesmanType"
      ]).then(res => {
        if (res.code == 0) {
          this.organizationType = res.data.organizationType; //机构类型下拉
          this.certificateType = res.data.certificateType; //资质证书下拉
          this.settlementType = res.data.settlementType; //采购结算方式 销售结算方式
          this.supplierType = res.data.supplierType; //客商类型
          this.enterpriseBusinessType = res.data.enterpriseBusinessType; //企业业务类型
          this.supplierSource = res.data.supplierSource; //客商来源
          this.supplierEquipmentType = res.data.supplierEquipmentType; //客商设备类型
          this.contactType = res.data.contactType; //联系人类型
          this.salesmanType = res.data.salesmanType; //业务员类型
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取国家
    getCountryList () {
      getCountryList().then(res => {
        if (res.code == 0) {
          this.countryList = JSON.parse(res.data);
        }
      });
    },
    //获取省
    getProvinceList () {
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
    formConfigType (type) {
      let obj = {
        1: this.formOne,
        2: this.formonePlus,
        3: this.formTwo,
        4: this.formThree,
        5: this.formFour,
        6: this.formFive,
        7: this.formSix
      };

      return {
        inline: true,
        size: "mini",
        labelWidth: "auto",
        formItemList: obj[type]
      };
    },
    //清空表格勾选数据
    clearSelct (val) {
      this.$refs[val].resetSelect();
    },
    //新增一条部门
    addDepart () {
      let obj = {
        departmentName: "",
        orderNumber: 0,
        purchaseAccountPeriodExpiryDate: "",
        purchaseAccountPeriodRule: "1",
        saleAccountPeriodExpiryDate: "",
        saleAccountPeriodRule: "1",
        accountPeriodDateList: [],
        settlementMethodPurchase: "",
        settlementMethodSale: "",
        usable: true,
        isIndex: this.queryForm.departmentList.length
      };
      this.showPurchase = false;
      this.showSale = false;
      this.clearSelct("onemainTable");
      this.queryForm.departmentList.push(obj);
    },
    //部门勾选数据
    handleDepartChange (val) {
      this.selectDepartList = val;
    },
    //删除部门
    delDepart () {
      if (!this.selectDepartList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.selectDepartList.forEach(item => {
        const i = this.queryForm.departmentList.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        if (item.departmentName == '经营部') {
          this.$message.error("经营部不能删除");
        } else {
          this.queryForm.departmentList.splice(i, 1);
        }
      });
      this.queryForm.departmentList = this.queryForm.departmentList.map(
        (s, x) => {
          return { ...s, isIndex: x };
        }
      );
      this.showPurchase = false;
      this.showSale = false;
      this.clearSelct("onemainTable");
    },
    //新增采购账期
    addPurchase () {
      if (!this.selectDepartList.length || this.selectDepartList.length != 1) {
        this.$message.error("请选择一条操作项");
        return;
      }
      this.periodIndex = this.queryForm.departmentList.findIndex(r => {
        return r.isIndex == this.selectDepartList[0].isIndex;
      });
      this.queryForm.departmentList[this.periodIndex].settlementMethodPurchase =
        "2";
      this.selectRow = this.queryForm.departmentList[this.periodIndex];
      this.showPurchase = true;
      setTimeout(() => {
        this.$refs.purchase.change();
      }, 500);
    },
    //新增销售账期
    addSale () {
      if (!this.selectDepartList.length || this.selectDepartList.length != 1) {
        this.$message.error("请选择一条操作项");
        return;
      }
      this.periodIndex = this.queryForm.departmentList.findIndex(r => {
        return r.isIndex == this.selectDepartList[0].isIndex;
      });
      this.queryForm.departmentList[this.periodIndex].settlementMethodSale =
        "2";
      this.selectRow = this.queryForm.departmentList[this.periodIndex];
      this.showSale = true;
      setTimeout(() => {
        this.$refs.sale.change();
      }, 500);
    },
    //保存账期规则
    setRule (val) {
      this.queryForm.departmentList[
        this.periodIndex
      ].accountPeriodDateList.forEach((i, r) => {
        if (i.billType == val.accountPeriodDateList[0].billType) {
          this.queryForm.departmentList[
            this.periodIndex
          ].accountPeriodDateList.splice(r, 1);
        }
      });
      this.queryForm.departmentList[this.periodIndex] = {
        ...this.queryForm.departmentList[this.periodIndex],
        ...val,
        accountPeriodDateList: [
          ...val.accountPeriodDateList,
          ...this.queryForm.departmentList[this.periodIndex]
            .accountPeriodDateList
        ]
      };
      this.clearSelct("onemainTable");
      this.$refs.onemainTable.$refs.multipleTable.toggleRowSelection(
        this.queryForm.departmentList[this.periodIndex],
        true
      );
      this.$message.success("保存成功!!!");
    },
    //联系人勾选数据
    handleContactChange (val) {
      this.selectContactList = val;
    },
    //新增联系人
    addPerson () {
      let obj = {
        address: "",
        addressDtl: "",
        companyName: "",
        contactEmail: "",
        contactIdNumber: "",
        contactName: "",
        contactPhoneNumber: "",
        contactPost: "",
        contactSex: "",
        contactType: "",
        counterpartId: "",
        departmentName: "",
        usable: true,
        isIndex: this.queryForm.contactList.length
      };
      this.clearSelct("twomainTable");
      this.queryForm.contactList.push(obj);
    },
    //删除联系人
    delPerson () {
      if (!this.selectContactList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.selectContactList.forEach(item => {
        const i = this.queryForm.contactList.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        this.queryForm.contactList.splice(i, 1);
      });
      this.queryForm.contactList = this.queryForm.contactList.map((s, x) => {
        return { ...s, isIndex: x };
      });
      this.clearSelct("twomainTable");
    },
    //复制联系人
    copyPerson () {
      if (!this.selectContactList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.queryForm.contactList = [
        ...this.queryForm.contactList,
        ...this.selectContactList
      ];
      this.queryForm.contactList = this.queryForm.contactList.map((s, x) => {
        return { ...s, isIndex: x };
      });
      this.clearSelct("twomainTable");
    },
    //获取业务员
    getSaleMan () {
     if(this.operateType != 'add') {
       this.queryForm.businessPersonDelList = this.queryForm.businessPersonList.map(item => {
         return item.id
       })
     }
      this.queryForm.businessPersonList = [];
      this.queryForm.contactList.forEach(item => {
        if (item.counterpartId) {
          let obj = {
            userId: item.counterpartId,
            userName: item.counterpartName,
            phone: item.phone
          };
          this.queryForm.businessPersonList.push(obj);
        }
      });
    },
    //开票信息勾选数据
    handleinvoiceChange (val) {
      this.selectInvoiceList = val;
    },
    //新增开票信息
    addInvoicing () {
      let obj = {
        accountType: "",
        bank: "",
        bankAccount: "",
        companyName: "",
        dutyParagraph: "",
        isIndex: this.queryForm.invoiceList.length
      };
      this.clearSelct("fourmainTable");
      this.queryForm.invoiceList.push(obj);
    },
    //删除开票信息
    delInvoicing () {
      if (!this.selectInvoiceList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.selectInvoiceList.forEach(item => {
        const i = this.queryForm.invoiceList.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        this.queryForm.invoiceList.splice(i, 1);
      });
      this.queryForm.invoiceList = this.queryForm.invoiceList.map((s, x) => {
        return { ...s, isIndex: x };
      });
      this.clearSelct("fourmainTable");
    },
    //主营产品勾选数据
    handleproductChange (val) {
      this.selectProductList = val;
    },
    //新增产品信息
    addProduct () {
      let obj = {
        productDescription: "",
        productSpec: "",
        productType: "",
        isIndex: this.queryForm.productList.length
      };
      this.clearSelct("fivemainTable");
      this.queryForm.productList.push(obj);
    },
    //删除产品
    delProduct () {
      if (!this.selectProductList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.selectProductList.forEach(item => {
        const i = this.queryForm.productList.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        this.queryForm.productList.splice(i, 1);
      });
      this.queryForm.productList = this.queryForm.productList.map((s, x) => {
        return { ...s, isIndex: x };
      });
      this.clearSelct("fivemainTable");
    },
    //设备勾选数据
    handleequipmentChange (val) {
      this.selectEquipmentList = val;
    },
    //新增设备概况
    addEquipment () {
      let obj = {
        brand: "",
        count: "",
        origin: "",
        type: "",
        year: "",
        isIndex: this.queryForm.equipmentList.length
      };
      this.clearSelct("sixmainTable");
      this.queryForm.equipmentList.push(obj);
    },
    //删除设备
    delEquipment () {
      if (!this.selectEquipmentList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.selectEquipmentList.forEach(item => {
        const i = this.queryForm.equipmentList.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        this.queryForm.equipmentList.splice(i, 1);
      });
      this.queryForm.equipmentList = this.queryForm.equipmentList.map(
        (s, x) => {
          return { ...s, isIndex: x };
        }
      );
      this.clearSelct("sixmainTable");
    },
    //国外工厂勾选数据
    handlefactoryChange (val) {
      this.selectFactoryList = val;
    },
    //新增国外工厂
    addAbroad () {
      let obj = {
        address: "",
        country: "",
        name: "",
        isIndex: this.queryForm.factoryList.length
      };
      this.clearSelct("sevenmainTable");
      this.queryForm.factoryList.push(obj);
    },
    //删除国外工厂
    delAbroad () {
      if (!this.selectFactoryList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.selectFactoryList.forEach(item => {
        const i = this.queryForm.factoryList.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        this.queryForm.factoryList.splice(i, 1);
      });
      this.queryForm.factoryList = this.queryForm.factoryList.map((s, x) => {
        return { ...s, isIndex: x };
      });
      this.clearSelct("sevenmainTable");
    },
    //关联企业勾选数据
    handleCompanyChange (val) {
      this.selectCompanyList = val;
    },
    //新增企业
    addCompany () {
      let obj = {
        checkItemId: "",
        isIndex: this.queryForm.relevanceList.length
      };
      this.queryForm.relevanceList.push(obj);
    },
    delCompany () {
      if (!this.selectCompanyList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.selectCompanyList.forEach(item => {
        const i = this.queryForm.relevanceList.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        this.queryForm.relevanceList.splice(i, 1);
      });
      this.queryForm.relevanceList = this.queryForm.relevanceList.map(
        (s, x) => {
          return { ...s, isIndex: x };
        }
      );
      this.clearSelct("sevenmainTable");
    },
    //lookup
    setCheckItem (val) {
      if (this.look.type == "person") {
        if (Array.isArray(val)) {
          this.$set(
            this.queryForm.contactList[this.selectPersonIndex],
            "counterpartName",
            val[0].fullName
          );
          this.$set(
            this.queryForm.contactList[this.selectPersonIndex],
            "counterpartId",
            val[0].id
          );
          this.$set(
            this.queryForm.contactList[this.selectPersonIndex],
            "phone",
            val[0].phone
          );
        } else {
          this.$set(
            this.queryForm.contactList[this.selectPersonIndex],
            "counterpartName",
            val.fullName
          );
          this.$set(
            this.queryForm.contactList[this.selectPersonIndex],
            "counterpartId",
            val.id
          );
          this.$set(
            this.queryForm.contactList[this.selectPersonIndex],
            "phone",
            val.phone
          );
        }
      } else if (this.look.type == "company") {
        if (Array.isArray(val)) {
          this.$set(
            this.queryForm.relevanceList[this.selectPersonIndex],
            "checkItemNo",
            val[0].checkItemNo
          );
          this.$set(
            this.queryForm.relevanceList[this.selectPersonIndex],
            "checkItemTypeName",
            val[0].checkItemTypeName
          );
          this.$set(
            this.queryForm.relevanceList[this.selectPersonIndex],
            "checkItemId",
            val[0].id
          );
          this.$set(
            this.queryForm.relevanceList[this.selectPersonIndex],
            "checkItemName",
            val[0].checkItemName
          );
        } else {
          this.$set(
            this.queryForm.relevanceList[this.selectPersonIndex],
            "checkItemNo",
            val.checkItemNo
          );
          this.$set(
            this.queryForm.relevanceList[this.selectPersonIndex],
            "checkItemTypeName",
            val.checkItemTypeName
          );
          this.$set(
            this.queryForm.relevanceList[this.selectPersonIndex],
            "checkItemId",
            val.id
          );
          this.$set(
            this.queryForm.relevanceList[this.selectPersonIndex],
            "checkItemName",
            val.checkItemName
          );
        }
      }
    },
    //上方勾选
    handleTopSelectionChange (val) { },
    //lookup弹窗
    selectLook (val, e) {
      if (val == "person") {
        this.selectPersonIndex = e.target.parentNode.parentNode.parentNode.getAttribute(
          "index"
        );
      }
      if (val == "company") {
        this.selectPersonIndex = e.target.parentNode.parentNode.parentNode.getAttribute(
          "index"
        );
      }
      this.look = looks[val];
      this.visible = true;
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
    //新增
    addData () {
      addCheckItem({
        ...this.queryForm,
        source: this.queryForm.source.toString(),
        qualificationCertificateList: this.queryForm.qualificationCertificateList.toString(),
        checkItemType: this.queryForm.checkItemType.toString(),
        businessType: this.queryForm.businessType.toString()
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
    editData () {
      updateCheckItem({
        ...this.queryForm,
        source: this.queryForm.source.toString(),
        qualificationCertificateList: this.queryForm.qualificationCertificateList.toString(),
        checkItemType: this.queryForm.checkItemType.toString(),
        businessType: this.queryForm.businessType.toString()
      })
        .then(res => {
          if (res.code == 0) {
            this.$message.success("修改成功");
            this.loading = false;
            this.$emit("submit");
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @desc 点击添加或编辑
     */
    saveData () {
      let obj = [];
      if (this.queryForm.checkItemCategory == 1) {
        obj = [...this.formOne, ...this.formonePlus];
      } else {
        obj = [
          ...this.formOne,
          ...this.formonePlus,
          ...this.formTwo,
          ...this.formThree,
          ...this.formFour,
          ...this.formFive,
          ...this.formSix
        ];
      }
      if (this.queryForm.allAddress) {
        let ziduan = [
          "officeAddressProvince",
          "officeAddressCity",
          "officeAddressDistrict",
          "officeAddressTown"
        ];
        this.queryForm.allAddress.forEach((item, index) => {
          this.queryForm[ziduan[index]] = item;
        });
      }
      if (!checkFormData(obj, this.queryForm)) {
        return;
      }
      if (!this.queryForm.invoiceList.length) {
        this.$message.error("开票信息不能为空");
        return
      }
      this.queryForm.invoiceList = this.queryForm.invoiceList.map(item => {
        return {
          ...item,
          companyName: this.queryForm.name1,
          dutyParagraph: this.queryForm.name2
        };
      });
      let type = this.operateType === "details" ? "edit" : this.operateType;
      if (type == "add") {
        this.loading = true;
        this.addData();
      } else {
        this.loading = true;
        this.editData();
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
          type: "warning"
        })
          .then(() => {
            this.$emit("submit");
          })
          .catch(() => { });
      } else {
        this.$emit("submit");
      }
    },

    /**
     * @desc 初始化界面的初始值
     */
    initFormAndTable (data = {}) {
      this.queryForm = {
        departmentList: [], //部门信息
        businessPersonList: [], //业务员信息
        contactList: [], //联系人信息
        equipmentList: [], //设备情况
        factoryList: [], //国外工厂
        invoiceList: [], //开票信息
        productList: [], //主营产品
        relevanceList: [], //关联企业
        businessPersonDelList: [],
        actualController: "",
        actualController: "",
        blackListReason: "",
        businessStatus: "",
        businessType: [],
        checkItemCategory: "",
        checkItemName: "",
        checkItemType: [],
        countryNo: "",
        customerLevel: "",
        ecommerceNo: "",
        endCustomer: "",
        enterpriseNature: "",
        factoryArea: "",
        factoryEnvironment: "",
        factoryOwnership: "",
        fax: "",
        fixedPhoneNumber: "",
        inBlackList: false,
        inSinosureBlacklist: false,
        labelBrochure: true,
        labelInspect: true,
        labelInspectCenter: true,
        labelLogistics: true,
        labelMallApp: true,
        labelRepairWeaveColor: true,
        labelSalesmanSupervisor: true,
        labelTextileTradingCenter: true,
        labelThirdParty: true,
        labelWechatAccount: true,
        legalPerson: "",
        officeAddress: "",
        officeAddressCity: "",
        officeAddressDistrict: "",
        officeAddressProvince: "",
        productionBrandInspection: "",
        productionElectricityFees: "",
        productionEmployeeSalary: "",
        productionPowerOnRate: 0,
        productionShiftSystem: "",
        productionTotalCapacity: "",
        qualificationCertificateList: [],
        registeredAddress: "",
        registeredCapital: "",
        source: [],
        supplierLevel: "",
        allAddress: "",
        syncTime: "",
        usable: true,
        ...data
      };
      if (this.queryForm.officeAddressProvince) {
        this.queryForm.allAddress.push(
          Number(this.queryForm.officeAddressProvince)
        );
      }
      if (this.queryForm.officeAddressCity) {
        this.queryForm.allAddress.push(
          Number(this.queryForm.officeAddressCity)
        );
      }
      if (this.queryForm.officeAddressDistrict) {
        this.queryForm.allAddress.push(
          Number(this.queryForm.officeAddressDistrict)
        );
      }
      if (this.queryForm.officeAddressTown) {
        this.queryForm.allAddress.push(
          Number(this.queryForm.officeAddressTown)
        );
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
    }
  }
};
</script>

<style lang="less" scoped>
.tips {
}
</style>
