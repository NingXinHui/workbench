<!--
@time:2021/12/1
@author:chenqian
-->
<template>
  <div id="zPage">
    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <!-- <el-button class="delButton" @click="operationFun('delete')"
          >删除</el-button -->
        <!-- > -->
      </div>
    </div>
    <div class="z-content">
      <el-card>
        <!-- 搜索条件 -->
        <header-search :searchArr="searchArr" @sureSearch="searchMethod">
        </header-search>
        <div class="z-content-table">
          <!-- table -->
          <common-table
            is-height
            ref="mainTable"
            :isMain="true"
            :tableColumn="tableColumn"
            :tableData="tableData"
            :isSelection="true"
            :isSelectMore="false"
            :loading="loading"
            :pageParams="pageParams"
            @selePage="handleItemSelect"
            @pageChange="pageSizeChange"
          />
        </div>
      </el-card>
      <Add v-if="visible" :visible.sync="visible" :billCodeText="billCodeText" :detail="detail"></Add>
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import zhuMiXins from "@/lib/orderZhu";
import {deepCopy } from "@/lib/common";
import {delInterestRules,interestRulesList} from "@/api/sale/base"
import Add from "./add"
export default {
  name: "InterestRules",
  components: {
    HeaderSearch,
    commonTable,
    Add
  },
  mixins: [zhuMiXins],
  data() {
    return {
      queryForm: {}, //上面查询的条件

      tableData: [], // 表格显示的数据
      loading: true, //表格是否在加载中

      pageParams: {
        //下面的分页需要的数据
        pageNum: 1,
        pageSize: 30,
        total: 0,
      },
      multipleSelection: [], //表格选中的
      selectRow: {}, //选中的是哪一个
      visible: false,
      billCodeText: "新增",
      detail: {}
    };
  },

  mounted() {
    this.getDataList();
  },

  computed: {
    /**
     * @desc 上面的查询条件  最好放到computed里面 当里面相关的参数发生改变  这个数据就会更新一次
     */
    searchArr() {
      return [
        {
          label: "计息规则",
          value: "ruleName",
          type: 1,
          maxLength: 40,
        }
      ];
    },

    /**
     * @desc 上面显示的表格行
     */

    tableColumn() {
      return [
        //表格显示的列
        {
          type: "index",
          label: "序号",
        },
        {
          prop: "ruleName",
          label: "计息规则",
          width: 200,
            render: (h, scope) => {
            return h(
              'a',
              {
                style: {
                  'color': 'blue'
                },
                on:{
                  click:() => {
                    this.billCodeText = '查看';
                    this.visible = true;
                    this.detail = scope.row;
                  }
                }
              },
              scope.row.ruleName
            )
          }
        },
         {
          prop: "billNo",
          label: "规则编号",
        }, {
          prop: "detailLength",
          label: "明细数量",
        },
        {
          prop: "usable",
          label: "是否可用",
          width: "90",
          align:"center",
          render: (h, scope) => {
            return h(
              "el-checkbox",
              {
                props: {
                  value:scope.row.usable,
                  disabled: true,
                }
              }
            )
          }
        },
         {
          prop: "effectiveDate",
          label: "生效日期",
        },
         {
          prop: "expirationDate",
          label: "失效日期",
        },
         {
          prop: "remark",
          label: "描述",
        },
        {
          prop: "createUserName",
          label: "创建人",
        },
        {
          prop: "createTime",
          label: "创建时间",
          width:"160"
        },
        {
          prop: "",
          label: "",
        }
      ];
    },
  },

  methods: {
    /**
     * @desc 新增编辑详情
     */

    openEdit(type, params) {
      let data = {
        type,
        data: params || {},
      };
       this.billCodeText = "新增";
          this.detail = {};
      if (type === "edit") {
        if (
          !this.checkOperation(
            type,
            this.multipleSelection,
            "billStatus",
            "12345"
          )
        ) {
          return;
        } else {
          this.billCodeText = "编辑";
          this.detail = deepCopy(this.multipleSelection[0]);
        }
      }
      // this.$emit("submit", data);
      this.visible = true
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */
    initForm() {
      let params = {
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        ruleName: this.queryForm.ruleName,
        checkItemName: this.queryForm.checkItemName,
      };
      return params;
    },

    /**
     * @desc 设置选中的表格行
     */
    handleItemSelect(val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },

    /**
     * @desc 清除表格的选中项
     */
    clearSelcte() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 获取订单的列表
     */
    getDataList() {
      this.loading = true;
      let params = this.initForm();
      this.clearSelcte();
      interestRulesList(params)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.records;
          this.tableData = this.tableData.map(item => {return {...item}
          });
          // detailLength: item.rulesDetailVOList ?
          // 0:item.rulesDetailVOList.length
          // console.log( this.tableData)
          this.pageParams.total = res.data.total;
        })
        .catch((error) => {
          this.tableData = [];
          this.loading = false;
          this.pageParams.total = 0;
        });
    },

    /**
     * @desc 上面查询条件
     */
    searchMethod(data) {
      this.queryForm = data;
      this.pageParams.pageNum = 1;
      this.getDataList();
    },

    /**
     * @desc 分液器发生改变的方法
     */

    pageSizeChange(data) {
      this.pageParams.pageNum = data.page;
      this.pageParams.pageSize = data.limit;

      this.getDataList();
    },

    /**
     * @desc 上面的按钮进行的操作
     */
    operationFun(type) {
      let objText = {
        delete: {
          text: "确认删除选中的数据吗？",
          fun: this.delData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
      };

      if (objText[type].check) {
        if (
          !objText[type].check(
            type,
            this.multipleSelection,
            objText[type].key,
            objText[type].value
          )
        ) {
          return;
        }
      }
      this.$confirm(objText[type].text, "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          objText[type].fun();
        })
        .catch(() => {});
    },
    //删除事件
    delData() {
            delInterestRules({ids:this.selectRow.id}).then(res => {
        if(res.success) {
          this.$message.success("操作成功");
           this.getDataList();
        } else {
           this.$message.error(res.msg);
        }
      })
    },
  },
};
</script>


<style lang='less' scoped>
</style>
