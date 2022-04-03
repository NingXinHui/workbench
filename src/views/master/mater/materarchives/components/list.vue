<template>
  <div id="zPage">

    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <el-button @click="openEdit('add')">新增</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <el-button class="delButton"
                   @click="operationFun('delete')">删除</el-button>

        <el-button @click="operationFun('submit')">提交</el-button>
        <el-button @click="operationFun('withdraw')">撤回</el-button>
      </div>
    </div>

    <div style="display:flex;background:#eaeef3">
      <div style="width:260px;flex-shrink:0;margin-top:8px">
        <el-card>
          <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
          <!-- 已有的实现不了 重新先写一个 -->
          <!-- <div v-for="(item,index) in data " :key="index">
              <div >

                <div style="display: flex;justify-content: space-between;line-height:34px;font-size:12px" @click="()=>seleIcon=index">
                  <div>
                    {{item.label}}
                  </div>
                  <div>
                    <i :class="seleIcon == index ? 'el-icon-arrow-up':'el-icon-arrow-down' "></i>
                  </div>



                </div>
                 <div class="verApp" v-if="seleIcon==index">
                    <div class="left" v-for="(childItem,index) in item.children" :key="index">
                       <div class="list">
                         <div class="item" :class="{ active: rowIndex == index }"   @click="nodeClick(item, index)">

                           {{childItem.label}}
                         </div>


                       </div>

                    </div>
                  </div>

              </div>

            </div> -->

          <left-mnu @getRightNews="(e)=>getLeftSelectNew(e)" />

        </el-card>

      </div>

      <div style="flex:1;width:0">
        <div class="z-content">
          <el-card>
            <!-- 搜索条件 -->
            <header-search :searchArr="searchArr"
                           @sureSearch="searchMethod">
              <slot>
                <!-- <el-button @click="operationFun('print')">打印</el-button> -->
                <el-button @click="operationFun('export')"
                           style="margin-top: -2px">导出</el-button>
              </slot>
            </header-search>
            <div class="z-content-table">
              <!-- table -->
              <common-table is-height
                            ref="mainTable"
                            :isMain="true"
                            :tableColumn="tableColumn"
                            :tableData="tableData"
                            :isSelection="true"
                            :isSelectMore="false"
                            :loading="loading"
                            :pageParams="pageParams"
                            :isChangeCloumn="true"
                            @selePage="handleItemSelect"
                            @pageChange="pageSizeChange" />
            </div>
          </el-card>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import { getDataList } from "@/api/marketOrder";
import zhuMiXins from "@/lib/orderZhu";
import LeftMnu from '../leftMenu.vue';
import { propertyDefineListAll, materialVarietyList } from "@/api/apizhu";
import { deepCopy, } from "@/lib/common"
export default {
  name: "Menuceng",
  components: {
    HeaderSearch,
    commonTable,
    LeftMnu
  },
  mixins: [zhuMiXins],
  data () {
    return {
      otherHeadLie: [],//后端配置的动态的列
      materTypeList: [],//物料属性的数组列表
      seleLeftid: undefined,//选择的左侧的
      rowIndex: 0,
      seleIcon: undefined,//左侧显示的展开列
      queryForm: {}, //上面查询的条件

      tableData: [], // 表格显示的数据
      loading: false, //表格是否在加载中

      pageParams: {
        //下面的分页需要的数据
        pageNum: 1,
        pageSize: 30,
        total: 0,
      },
      multipleSelection: [], //表格选中的
      selectRow: {}, //选中的是哪一个
    };
  },

  mounted () {
    // this.getDataList();
    propertyDefineListAll({}).then(res => {
      this.materTypeList = res.data;

    })

  },

  computed: {
    /**
     * @desc 上面的查询条件  最好放到computed里面 当里面相关的参数发生改变  这个数据就会更新一次
     */
    searchArr () {
      return [

        {
          label: "品种编号",
          value: "billNo",
          type: 1,
          maxLength: 40,
        },
        {
          label: "物料编号",
          value: "checkItemName",
          type: 1,
          maxLength: 40,
        },
        {
          type: 2,
          label: '物料属性',
          value: 'materialTypeNo',
          selectOption: this.materTypeList,
          optionLabel: 'materialTypeName',
          optionValue: 'materialTypeNo',
        },
      ];
    },

    /**
     * @desc 上面显示的表格行
     */

    tableColumn () {


      // 固定显示的列


      return [
        //表格显示的列
        {
          type: "index",
          label: "序号",
        },
        {
          prop: "billNo",
          label: "物料编号",
          render: (h, scope) => {
            return h(
              "a",
              {
                style: "color:blue",
                on: { click: () => this.openEdit("details", scope.row) },
              },
              scope.row.materialNo
            );
          },
        },

        {
          prop: "materialName",
          label: "物料名称",
        },
        {
          prop: "materialDescription",
          label: "物料描述",
        },
        // {
        //   prop: "billDate",
        //   label: "物料分类",
        // },
        {
          prop: "varietyNo",
          label: "品种编号",
        },
        // {
        //   prop: "checkItemContactName",
        //   label: "品种描述",
        // },
        {
          prop: "unitName",
          label: "计量单位",
        },
        {
          prop: "taxRate",
          label: "税率",
        },
        {
          prop: "inventoryTopLimit",
          label: "库存上限",
        },
        {
          prop: "inventoryLowerLimit",
          label: "库存下限",
        },
        {
          prop: '',
          label: '是否启用',
          render: (h, scope) => {
            return h("el-checkbox", {
              props: {
                value: scope.row.usable,
                disabled: true
              }
            });
          },
        },
        // {
        //   prop: "updateTime",
        //   label: "审核状态",
        // },
        {
          prop: "remark",
          label: "备注",
        },
        //  {
        //   prop: "billStatusName",
        //   label: "属性组合",
        // },
        ...this.otherHeadLie
      ];
    },
  },

  methods: {

    getLeftSelectNew (e) {
      this.seleLeftid = e;


      this.getDataList()

    },


    nodeClick (item, index) {
      this.rowIndex = index;

    },

    handleNodeClick (e) {
      console.log(e);
      console.log('李大柱')


    },
    /**
     * @desc 新增编辑详情
     */

    openEdit (type, params) {
      let data = {
        type,
        data: params || {},
      };

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
          data.data = deepCopy(this.multipleSelection[0]);
        }
      }
      this.$emit("submit", data);
    },
    /**
     * @desc 初始form表单 请求发送的数据
     */


    initForm () {
      console.log(this.seleLeftid);
      console.log('大头')
      let params = {
        current: this.pageParams.pageNum,
        pageSize: this.pageParams.pageSize,
        varietyNo: this.queryForm.billNo,
        // varietyNo: this.queryForm.checkItemName,
        materialNo: this.queryForm.checkItemName,
        propertyMerge: this.queryForm.materialTypeNo,
        materialTypeNo: this.seleLeftid

      };

      return params;
    },

    /**
     * @desc 设置选中的表格行
     */
    handleItemSelect (val) {
      this.multipleSelection = val;
      this.selectRow = val[0];
    },

    /**
     * @desc 清除表格的选中项
     */
    clearSelcte () {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 获取订单的列表
     */
    getDataList () {
      this.loading = true;
      let params = this.initForm();
      this.clearSelcte();

      materialVarietyList(params)
        .then((res) => {
          this.loading = false;

          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;

          this.otherHeadLie = [];

          if (res.data.records && res.data.records.length > 0) {
            let obj = {}
            this.otherHeadLie = res.data.records[0].materialPropertyList.map((item,index) => {
              obj['key' + index] = item.propertyValue
              return {
                label: item.propertyName,
                prop: 'key' + index
              }
            })
            this.tableData = this.tableData.map(item => {
              return {...item, ...obj}
            })
          }
        })
        .catch((error) => {
          console.group(error);
          this.tableData = [];
          this.loading = false;
          this.pageParams.total = 0;
        });
    },

    /**
     * @desc 上面查询条件
     */
    searchMethod (data) {
      this.queryForm = data;
      this.pageParams.pageNum = 1;
      this.getDataList();
    },
    /**
     * @desc 分液器发生改变的方法
     */

    pageSizeChange (data) {
      this.pageParams.pageNum = data.page;
      this.pageParams.pageSize = data.limit;

      this.getDataList();
    },

    /**
     * @desc 上面的按钮进行的操作
     */
    operationFun (type) {
      let objText = {
        delete: {
          text: "确认删除选中的数据吗？",
          fun: this.delData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
        submit: {
          text: "确认提交选中的数据吗？",
          fun: this.submitData,
          check: this.checkOperation,
          key: "billStatus",
          value: "12345",
        },
        withdraw: {
          text: "确认撤回选中的数据吗？",
          fun: this.withdrawData,
          check: this.checkOperation,
          key: "billStatus",
          value: "0",
        },
        print: {
          text: "确认打印选中的数据吗？",
          fun: this.printCommonData,
        },
        export: {
          text: "确认导出查询的数据？",
          fun: this.exportCommonData,
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
        .catch(() => { });
    },
  },
};
</script>


<style lang='less' scoped>
</style>

<style scoped>
.verApp {
  width: 100%;
  height: 100%;
  /* display: flex;  */
}

.verApp .left {
  width: 100%;
  /* height: 100%; */
  background: #ffffff;
  line-height: 25px;
  /* padding: 8px 0; */
  text-align: center;
  overflow: auto;
}

.verApp .left .el-input {
  width: 156px;
}

.verApp .left .list .item {
  /* padding: 9px 0; */
  font-size: 12px;
  color: #374256;
  text-align: left;
  text-indent: 8px;
  cursor: pointer;
  line-height: 34px;
}

.verApp .left .list .item.active {
  border-left: 4px solid #2367fa;
  background: #f0f5ff;
}
</style>
