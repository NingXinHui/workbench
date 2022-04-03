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
      :modal="popConfig.show ? false : true"
      :close-on-click-modal="false"
    >
      <div class="content" style="overflow: hidden">
        <div class="form">
          <form-list
            autoComplete="off"
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          ></form-list>
        </div>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组织信息" name="first">
            <div class="pop-table-box">
              <div class="pop-table-btn">
                <el-button
                  plain
                  size="mini"
                  @click="() => addDetailsOne('tableDataOne')"
                  >新增</el-button
                >
                <el-button
                  plain
                  size="mini"
                  class="delButton"
                  @click="() => deletaDetailsOne()"
                  >删除</el-button
                >
                <!-- <el-button plain size="mini" class="delButton" @click="deleteDetails">删除</el-button> -->
              </div>
              <div class="zTable">
                <common-table
                  class="pop-table-content"
                  ref="tableOne"
                  :tableColumn="selTableOne"
                  :tableData="tableDataOne"
                  :isSelection="true"
                  :isSelectMore="true"
                  :tableheight="200"
                  @selePage="handleItemSelectOne"
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="职位信息" name="second">
            <div class="pop-table-box">
              <div class="pop-table-btn">
                <el-button
                  plain
                  size="mini"
                  @click="() => addDetailsOne('tableDataTwo')"
                  >新增</el-button
                >
                <el-button
                  plain
                  size="mini"
                  class="delButton"
                  @click="() => deletaDetailsTwo()"
                  >删除</el-button
                >
              </div>
              <div class="zTable">
                <common-table
                  class="pop-table-content"
                  ref="tableTwo"
                  :tableColumn="selTableTwo"
                  :tableData="tableDataTwo"
                  :isSelection="true"
                  :isSelectMore="true"
                  :tableheight="200"
                  @selePage="handleItemSelectTwo"
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="角色信息" name="third">
            <div class="pop-table-box">
              <div class="pop-table-btn">
                <el-button
                  plain
                  size="mini"
                  @click="() => addDetailsOne('tableDataThree')"
                  >新增</el-button
                >
                <el-button
                  plain
                  size="mini"
                  class="delButton"
                  @click="() => deletaDetailsThree()"
                  >删除</el-button
                >
              </div>
              <div class="zTable">
                <!-- {{RoleList}} -->
                <common-table
                  class="pop-table-content"
                  ref="tableThree"
                  :tableColumn="selTableThree"
                  :tableData="tableDataThree"
                  :isSelection="true"
                  :isSelectMore="true"
                  :tableheight="200"
                  @selePage="handleItemSelectThree"
                />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="setupload">
          <div>头像图标</div>

          <div v-if="!imageUrl">
            <div>
              <el-upload
                ref="upload"
                class="avatar-uploader"
                :limit="1"
                accept=".jpg, .png"
                :before-upload="beforeUploadFile"
                :headers="upload.headers"
                :action="upload.url"
                :show-file-list="false"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
              >
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <!-- <div style="color: rgba(0, 0, 0, 0.3); font-size: 12px">
              只能上传jpg/png文件，且不超过500kb
            </div> -->
          </div>

          <div class="setimage" v-if="imageUrl">
            <div>
              <el-image
                v-if="imageUrl"
                :src="imageUrl"
                :preview-src-list="[imageUrl]"
                class="avatar"
              ></el-image>
            </div>
            <div @click="handleImg">
              <i class="el-icon-close" style="font-weight: 600" />
              <!-- <el-button type="danger" icon="el-icon-circle-close" circle></el-button> -->
            </div>
          </div>
        </div>
      </div>
      <div style="color: rgba(0, 0, 0, 0.3); font-size: 12px ; margin-left:75px;">
        只能上传jpg/png文件
      </div>

      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </el-dialog>

    <!-- lookup -->
    <div>
      <look-up
        v-if="popConfig.show"
        :isSelectMore="isSelectMore"
        :title="look.title"
        :visible.sync="popConfig.show"
        :isClearAll="true"
        @setCheckItem="popSubmit"
        :params="look.params"
        :method="look.methods"
        :table-column="look.tableColumn"
        :search-arr="look.searchArr"
      ></look-up>
    </div>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import { checkFormData } from "@/lib/common";
import { getToken } from "@/utils/auth";
import lookUp from "@/components/ZLookUp/lookUp";
import { interestRulesList } from "@/api/sale/base";
import { look } from "./look";
import looks from "./look";

import { upadataPassword } from "@/api/apizhu/index.js";
import {
  departmentListSelect,
  roleListSelect,
  positionDataList
} from "@/api/apizhu";

import {
  fileGet,
  userAddOne,
  userGetDetail,
  dictDataList,
  companyListSelect,
  updataSelect,
  provePassword,
  updatePassword
} from "@/api/apizhu";
import commonTable from "@/components/CommonTable";
import { tableOne, tableTwo, tableThree } from "./show";
import { deleteMenuFileToId } from "@/api/common";

export default {
  name: "add",
  components: { formList, commonTable, lookUp },

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
      activeName: "first",
      queryForm: {},
      /*  imageUrl:
        "https://img1.baidu.com/it/u=1320641947,716755532&fm=26&fmt=auto", */
      // imageUrl:require("@/assets/home/avatar.jpg"),
      imageUrl: "https://s2.loli.net/2022/01/14/8NwCjxDnPU1pvIm.jpg",
      isEdit: true,
      salesmanListList: [],
      basic: {
        clauseContent: true,
        billNo: "",
        orderTypeNo: "",
        bill: ""
      },

      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "sm/file/upload"
      },
      CompanyList: [], //公司列表
      PartList: [], //部门列表
      UpPeopleList: [], //直属上级
      SexList: [
        {
          id: "1",
          name: "男"
        },
        {
          id: "0",
          name: "女"
        }
      ],
      positionList: [], //职位选择
      positionData: [], //职位

      RoleList: [], //角色列表

      sletabone: [], //组织信息选择的表格
      sletabtwo: [], //职位信息选择的表格
      sletabthree: [], //角色信息选择的表格
      tableDataOne: [], //组织信息的所有数据
      tableDataTwo: [], //职位数组
      tableDataThree: [], //角色信息

      // lookup
      isSelectMore: false,
      //lookup显隐
      popConfig: {
        show: false
      },
      //lookup选择的分类
      materialCategoryNo: "",
      // 定义一个分类的类型
      categoryType: "",
      index: -1,
      value: "",
      companyId: -1,
      current: 1,
      size: 10,
      type: "",
      oldPassword: "",
      selectTableOneList: [],
      selectTableTwoList: [],
      selectTableThreeList: [],
      idOneList: [],
      idTwoList: [],
      idThreeList: [],
      theCompanyId: "",
      theIndex: "",
      roleDataList: []
    };
  },
  methods: {
    // 删除图片的链接地址
    deleteItemic() {
      console.log(this.imageUrlId, this.imageUrl);
      if (this.imageUrlId) {
        deleteMenuFileToId({ fileId: this.imageUrlId }).then(res => {
          this.imageUrlId = "";
          this.imageUrl = "";
        });
      } else {
        this.imageUrlId = "";
        this.imageUrl = "";
      }
    },

    // 清楚数据
    clearSelct(val) {
      this.$refs[val].resetSelect();
    },
    handleItemSelectOne(data) {
      this.selectTableOneList = data;

      console.log(this.tableDataOne);

      console.log("this.selectTableOneList", this.selectTableOneList);
    },
    // 添加信息one
    addDetailsOne(value) {
      console.log(value);
      let obj = {
        departmentId: "",
        unitx: ""
      };
      this.value = value;
      this[value].push(obj);
      // 给value附值
      this[value].map((item, index) => {
        Object.assign(item, { isIndex: index });
      });
    },
    // 删除数据one
    deletaDetailsOne() {
      if (!this.selectTableOneList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      console.log(this.selectTableOneList);
      console.log(this.tableDataOne);

      this.selectTableOneList.forEach(item => {
        const i = this.tableDataOne.findIndex(r => {
          return r.isIndex == item.isIndex;
        });

        this.tableDataOne.splice(i, 1);
      });

      this.tableDataOne = this.tableDataOne.map((s, x) => {
        return { ...s, isIndex: x };
      });
      this.clearSelct("tableOne");
    },
    handleItemSelectTwo(data) {
      this.selectTableTwoList = data;
    },
    deletaDetailsTwo() {
      if (!this.selectTableTwoList.length) {
        this.$message.error("请选择操作项");
        return;
      }

      this.selectTableTwoList.forEach(item => {
        const i = this.tableDataTwo.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        this.tableDataTwo.splice(i, 1);
      });

      this.tableDataTwo = this.tableDataTwo.map((s, x) => {
        return { ...s, isIndex: x };
      });

      this.clearSelct("tableTwo");
    },

    handleItemSelectThree(data) {
      console.log(data);
      this.selectTableThreeList = data;
    },
    deletaDetailsThree() {
      if (!this.selectTableThreeList.length) {
        this.$message.error("请选择操作项");
        return;
      }
      this.selectTableThreeList.forEach(item => {
        const i = this.tableDataThree.findIndex(r => {
          return r.isIndex == item.isIndex;
        });
        this.tableDataThree.splice(i, 1);
      });
      this.tableDataThree = this.tableDataThree.map((s, x) => {
        return { ...s, isIndex: x };
      });
      this.clearSelct("tableThree");
    },

    handleClick(tab, event) {
      // console.log(tab, event);
    },
    beforeUploadFile(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;

      if (extension !== "jpg" && extension !== "png") {
        this.$message.warning("请上传png或者jpg的图片");
        return false;
      }
      if (size > 0.5) {
        this.$message.warning("上传大小不能超出500kb");
        return false;
      }
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      let url = "";
      // if (response.success) {
      //   url = this.isShowFileQuan(response);
      // }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // this.imageUrl = response.data.filePath;
      this.imageUrl = response.data.fileUrl;
      this.imageUrlId = response.data.id;

      // 要根据图片的id访问图片的链接
      // this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      // this.getList();
    },
    handleImg() {
      if (
        this.imageUrl != "https://s2.loli.net/2022/01/14/8NwCjxDnPU1pvIm.jpg"
      ) {
        this.imageUrl = "https://s2.loli.net/2022/01/14/8NwCjxDnPU1pvIm.jpg";
      } else {
        this.imageUrl = "";
      }
    },
    //点击保存
    submit() {
      if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }

      let bool = true,
        title = "";

      this.selTableOne.forEach(item => {
        if (item.config && item.config.custormRules) {
          this.tableDataOne.forEach((value, key) => {
            value.orderNumber = key + 1;
            console.log(
              this.tableDataOne,
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
      this.selTableTwo.forEach(item => {
        if (item.config && item.config.custormRules) {
          this.tableDataTwo.forEach((value, key) => {
            value.orderNumber = key + 1;
            console.log(
              this.tableDataTwo,
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
      console.log(this.selTableThree);
      this.selTableThree.forEach(item => {
        if (item.config && item.config.custormRules) {
          this.tableDataThree.forEach((value, key) => {
            value.orderNumber = key + 1;
            console.log(
              this.tableDataThree,
              value[item.config.key],

              value[item.config.key] !== 0,
              item.config.key
            );
            if (item.config.key === "unitx") {
              if (
                value[item.config.key] &&
                value[item.config.key].length === 0
              ) {
                bool = false;
                console.log(key);
                title =
                  "第" + (key + 1) + "行" + item.config.custormRules.message;
              }
            } else {
              if (!value[item.config.key] && value[item.config.key] !== 0) {
                bool = false;
                console.log(key);
                title =
                  "第" + (key + 1) + "行" + item.config.custormRules.message;
              }
            }
          });
        }
      });

      if (!bool) {
        this.$message.error(title);
        return;
      }

      let departmentList = this.tableDataOne.map(item => {
        return {
          id: item.id || "",
          companyId: item.companyId,
          departmentId: item.departmentId,
          divisionDirector: item.divisionDirector || false
        };
      });
      let positionList = this.tableDataTwo.map(item => {
        return {
          id: item.id || "",
          companyId: item.companyId,
          positionCode: item.positionCode,
          rank: item.rank
        };
      });

      let roleList = this.tableDataThree.map(item => item.idList);
      let roleIdList = roleList.flat(Infinity);
      console.log(roleIdList);

      let username = this.queryForm.phone;
      console.log(this.queryForm);
      let password = this.queryForm.password;
      console.log(password);
      if (password === "******") {
        password = "";
      } else {
        password = this.queryForm.password;
      }
      console.log(password);

      let param = {
        ...this.queryForm,
        departmentList,
        positionList,
        roleIdList,
        username,

        // password: this.queryForm.password || "",
        password,
        // password:
        //   this.queryFrom.password === "******" ? "" : this.queryForm.password,
        nickname: "sss",
        imageUrl: this.imageUrl
      };
      // this.password = param.password;

      console.log("1", param);
      // 添加信息的提交与修改信息的提交
      if (this.billCodeText == "编辑员工") {
        updataSelect(param).then(res => {
          if (res.success) {
            this.close();
            this.$message.success("编辑成功");
          }
        });
      } else {
        userAddOne(param).then(res => {
          if (res.success) {
            this.close();
            this.$message.success("新增成功");
          }
        });
      }
    },
    //关闭弹窗
    close() {
      this.$emit("getparentlist");
      setTimeout(() => {
        this.$emit("update:visible", false);
      }, 20);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,

        createTime: "",
        createUser: 0,
        createUsername: "",
        departmentIdList: [],
        email: "",
        fullName: "",
        imageUrl: "",
        isEnabled: 0,
        nickName: "",
        phone: "",
        positionList: [],
        roleIdList: [],
        roleList: [],

        username: "",

        usable: true,
        sex: "1",
        ...data
      };
    },

    // lookup的
    popSubmit(data) {
      if (this.value === "tableDataOne" || this.activeName === "first") {
        if (this.categoryType === "company1") {
          this.tableDataOne[this.index].companyId = data[0].id;
          this.tableDataOne[this.index].companyName = data[0].name;
          this.theCompanyId = data[0].id;
          //
          this.tableDataOne[this.index].departmentName = ""; //清空部门
        } else {
          // 判断是否两行部门相同
          let flag = false;
          this.tableDataOne.forEach((item, m) => {
            if (m != this.index) {
              if (item.departmentId === data[0].id) {
                flag = true;
              }
            }
          });
          if (!flag) {
            this.tableDataOne[this.index].departmentName = data[0].fullName;
            this.tableDataOne[this.index].departmentId = data[0].id;
          } else {
            this.$message.error("已经选择过该部门");
            this.tableDataOne[this.index].departmentName = "";
            this.tableDataOne[this.index].departmentId = "";
          }
        }
      } else if (
        this.value === "tableDataTwo" ||
        this.activeName === "second"
      ) {
        if (this.categoryType === "company2") {
          this.tableDataTwo[this.index].companyId = data[0].id;
          this.tableDataTwo[this.index].companyName = data[0].name;
        } else {
          // 职位
        }
      } else if (
        this.value === "tableDataThree" ||
        this.activeName === "third"
      ) {
        if (this.categoryType === "company3") {
          this.tableDataThree[this.index].companyId = data[0].id;
          this.tableDataThree[this.index].unit = data[0].name;
          this.theCompanyId = data[0].id;
          this.tableDataThree[this.index].unitx = [];
          let data1 = {
            current: this.current,
            size: this.size,
            companyId: this.tableDataThree[this.index].companyId
          };
          // console.log(111, that.tableDataThree[that.index].companyId);
          roleListSelect(data1).then(res => {
            if (res.success) {
              // console.log(res.data.records);
              this.RoleList = res.data.records;
            }
          });
        } else {
          console.log(data);

          this.RoleList = [...data, ...this.RoleList];

          var a = {};
          this.RoleList = this.RoleList.reduce((item, next) => {
            // console.log(next.id);
            a[next.id] ? "" : (a[next.id] = true && item.push(next));
            return item;
          }, []);

          let datas = data.map(item => {
            return item.id;
          });
          let dataName = data.map(item => {
            return item.name;
          });

          this.tableDataThree[this.index].unitx = [
            ...new Set([...this.tableDataThree[this.index].unitx, ...dataName])
          ];
          //  把选中的lookup的id值放到已经展示了的idList当中

          if (!this.tableDataThree[this.index].idList) {
            this.tableDataThree[this.index].idList = [];

            this.tableDataThree[this.index].idList = [
              ...new Set([...this.tableDataThree[this.index].idList, ...datas])
            ];
          }
        }
      }

      let params = {};
    },

    selectCheckItemName(type) {
      if (type === "company") {
        this.materialCategoryNo = "custorm";
        this.popConfig.show = true;
      }
      if (type === "department") {
        console.log();
        this.look.params = {
          companyId: this.tableDataOne[this.index].companyId
          // name:this.tableDataOne[this.index].name
        };

        this.popConfig.show = true;
      }
      if (type === "position") {
        this.popConfig.show = true;
      }
      if (type === "roles") {
        this.popConfig.show = true;
        this.categoryType = "roles";

        console.log(this.index, this.tableDataThree[this.index]);
        this.look.params = {
          companyId: this.tableDataThree[this.index].companyId
          // name:this.tableDataOne[this.index].name
        };
      }
    }
  },
  computed: {
    formConfig() {
      let obj = {};
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          // key: "username",
          key: "fullName",
          type: "input",
          subtype: "text",
          label: "员工姓名",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "change"
          }
        },
        {
          key: "phone",
          type: "input",
          subtype: "text",
          label: "手机号(登录名)",

          maxlength: 11,
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "  ",
            validator: (rule, value, callback) => {
              if (value) {
                let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
                if (!myreg.test(value)) {
                  return this.$message.error("请输入正确的手机号码");
                }
                callback();
              } else {
                this.$message.error("手机号码不能为空");
              }
            }
          }
        },
        {
          key: "idCardNo",
          type: "input",
          subtype: "idCardNo",
          label: "身份证号",
          maxlength: 18,

          /* options: this.SexList,
          optionLabel: "name",
          optionValue: "id", */
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "身份证号不能为空",
            validator: (rule, value, callback) => {
              if (value) {
                let myreg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                if (!myreg.test(value)) {
                  return this.$message.error("请输入正确的身份证号");
                }
                callback();
              } else {
                this.$message.error("身份证号不能为空");
              }
            }
          }
        },
        {
          key: "password",
          type: "input",
          subtype: "text",
          label: "登录密码",

          //   multiple: true,
          listeners: {
            focus: () => {
              this.formConfig.formItemList[3].subtype = "password";
            }
            /*  blur: () => {
              let data = {
                newPassword: this.queryForm.password,
                userId: this.detail.id
              };
              // 密码修改
              upadataPassword(data).then(res => {
                this.$message.success("密码修改成功");
              });
            } */
          },

          placeholder: "请输入",
          rules:
            this.billCodeText == "新增员工"
              ? {
                  required: true,
                  trigger: ""
                }
              : null
        },
        {
          key: "sex",
          type: "select",
          subtype: "text",
          label: "性别",

          //   multiple: true,
          options: this.SexList,
          optionLabel: "name",
          optionValue: "id",
          placeholder: "请选择"
        },
        {
          key: "email",
          type: "input",
          subtype: "text",
          label: "邮箱",
          isEdit,
          placeholder: "请输入",
          listeners: {
            blur: () => {
              if (this.queryForm.email) {
                let myreg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!myreg.test(this.queryForm.email)) {
                  this.$message.error("请输入正确的邮箱地址");
                  this.queryForm.email = "";
                }
              }
            }
          }
        }
      ];
      let arr = [
        ...formItemList,
        // {
        //   key: "password",
        //   type: "input",
        //   subtype: "password",
        //   label: "登录密码",
        //   placeholder: "请输入",
        //   rules: {
        //     required: true,
        //     trigger: ""
        //   },
        //   listeners: {
        //     focus: () => {
        //       this.formConfig.formItemList[4].subtype = "password";
        //     }
        //   }
        // },

        {
          key: "usable",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否可用"
        }
      ];
      let arr1 = [
        ...formItemList,
        /*   {
          key: "sex",
          type: "select",
          subtype: "text",
          label: "性别",

          //   multiple: true,
          options: this.SexList,
          optionLabel: "name",
          optionValue: "id",
          placeholder: "请选择"
        }, */
        {
          key: "usable",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否可用"
        }
      ];
      return {
        inline: true,
        size: "mini",
        // labelWidth: "85px !important",
        labelWidth: "85px ",

        formItemList: this.billCodeText == "新增员工" ? arr : arr1
      };
    },

    selTableOne() {
      let isEdit = this.isEdit;
      return tableOne(this, isEdit);
    },

    selTableThree() {
      let isEdit = this.isEdit;
      return tableThree(this, isEdit);
    },
    selTableTwo() {
      let isEdit = this.isEdit;
      return tableTwo(this, isEdit);
    },
    // lookup
    look() {
      return look(this);
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.formConfig.formItemList[4].subtype = "text";

    if (this.billCodeText == "编辑员工") {
      userGetDetail(this.detail.id).then(res => {
        // this.queryForm = res.data;
        this.initQueryForm(res.data);
        this.queryForm.password = "******";
        // this.queryForm.fullName = res.data.fullName;

        this.queryForm.sex = String(res.data.sex);
        this.tableDataOne = res.data.departmentList;
        this.tableDataTwo = res.data.positionList.map(item => {
          return {
            ...item,
            positionCode: Number(item.positionCode)
          };
        });
        console.log(this.tableDataTwo);
        // this.RoleList = res.data.roleList[0].roleList;
        this.roleDataList = res.data.roleList; //保存的数据
        this.imageUrl = res.data.imageUrl;
        this.$nextTick(() => {
          this.tableDataThree = res.data.roleList.map(item => {
            return {
              ...item,
              unit: item.companyName,
              unitx: item.roleList.map(item1 => {
                return item1.name;
              }),
              idList: item.roleList.map(item1 => {
                return item1.id; //
              })
            };
          });
        });
      });
    } else {
      this.initQueryForm();
    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 572px !important;
    min-width: 572px !important;
    min-height: 630px !important;
    .el-dialog__body {
      .el-form {
        .el-form-item:nth-child(2) {
          .el-form-item__label {
            width: 93px !important;
          }
        }
        .el-form-item:nth-child(4) {
          .el-form-item__label {
            width: 93px !important;
          }
        }
        .el-form-item:nth-child(6) {
          .el-form-item__label {
            width: 93px !important;
          }
        }
      }
    }
  }

  .pop-header-box {
    display: flex;
    height: 35px;
    line-height: 35px;

    & > div {
      font-size: 12px;
      color: #999999;
      width: 50%;

      span:last-child {
        margin-left: 10px;
        color: #374256;
      }
    }
  }

  .pop-table-btn {
    background-color: #f8f8f9;
    padding: 8px;
    border: 1px solid #dfe6ec;
    border-bottom: 0;

    .el-button {
      width: auto !important;
    }
  }
}
</style>
<style lang="less" scoped>
.setupload {
  display: flex;
  height: 100px;
  overflow: hidden;
  & > div:first-child {
    width: 85px;
    text-align: right;
    padding-right: 4px;
  }
  .setimage {
    height: 80px;
    width: 80px;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    position: relative;
    & > div:first-child {
      margin-top: 4px;
      margin-left: 5px;
    }
    & > div:last-child {
      position: absolute;
      top: 0px;
      right: 0px;
      height: 16px;
      width: 16px;
      background: red;
      color: white;
      text-align: center;
      border-radius: 50%;
      line-height: 16px;
    }
    /deep/ img {
      width: 70px;
      height: 70px;
      border-radius: 4px;
    }
  }
  div {
    font-size: 12px;
  }
  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
  /deep/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  /deep/ .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  /deep/ .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
}
</style>
