<template>
  <div id="zPage">

    <!-- 按钮 -->
    <div class="z-header">
      <div class="z-header-button">
        <!-- <el-button @click="openEdit('add')">新增地区</el-button>
        <el-button @click="openEdit('add')">新增仓</el-button>
        <el-button @click="openEdit('add')">新增库</el-button>
        <el-button @click="openEdit('add')">新增仓位</el-button> -->
        <el-button @click="openEdit('area')">新增地区</el-button>
        <el-button @click="openEdit('ware')">新增仓</el-button>
        <el-button @click="openEdit('house')">新增库</el-button>
        <el-button @click="openEdit('last')">新增仓位</el-button>
        <el-button @click="openEdit('edit')">编辑</el-button>
        <el-button class="delButton"
                   @click="operationFun('delete')">删除</el-button>
      </div>
    </div>

    <div style="display:flex;background:#eaeef3">
      <div style="width:260px;flex-shrink:0;margin-top:8px">
        <el-card>
          <left-mnu ref="leftMenu" @getRightNews="(e)=>getLeftSelectNew(e)" />
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

    <!-- 弹窗 -->

    <Addarea v-if="areaVisible"
             :areaVisible.sync="areaVisible"
             :billCodeText="billCodeText"
             :detail="detail"></Addarea>
    <AddHouse v-if="houseVisible"
              :houseVisible.sync="houseVisible"
              :billCodeText="billCodeText"
              :detail="detail"></AddHouse>
    <AddWare v-if="wareVisible"
             :wareVisible.sync="wareVisible"
             :billCodeText="billCodeText"
             :detail="detail"></AddWare>
    <div v-if="lastVisible">
       <Add :lastVisible.sync="lastVisible"
         :billCodeText="billCodeText"
         :detail="selectRow"></Add>
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

import { searchManagerApi, searchManagerLibraryApi, deleteLibararyApi,deletestoreLocation } from "@/api/wareManagementApi/management";


import { deepCopy, } from "@/lib/common"

import Addarea from "./addArea.vue";
import AddHouse from "./addHouse"
import AddWare from "./addWare"
import Add from "./add"

export default {
  name: "Menuceng",
  components: {
    HeaderSearch,
    commonTable,
    LeftMnu,
    Add, Addarea, AddHouse, AddWare
  },
  mixins: [zhuMiXins],
  data () {
    return {
      areaVisible: false, //新增地区
      houseVisible: false, //新增库
      wareVisible: false, //新增仓
      lastVisible: false,
      selectLeftData: "", //左边树选中的当前项的数据
      detail: {},

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
    // propertyDefineListAll({}).then(res => {
    //   this.materTypeList = res.data;

    // })

  },

  computed: {
    /**
     * @desc 上面的查询条件  最好放到computed里面 当里面相关的参数发生改变  这个数据就会更新一次
     */
    searchArr () {
      return [

        {
          label: "仓位编号",
          value: "locationNo",
          type: 1,
          maxLength: 40,
        },
        {
          label: "仓位名称",
          value: "locationName",
          type: 1,
          maxLength: 40,
        },
        // {
        //   type: 2,
        //   label: '物料属性',
        //   value: 'materialTypeNo',
        //   selectOption: this.materTypeList,
        //   optionLabel: 'materialTypeName',
        //   optionValue: 'materialTypeNo',
        // },
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
          prop: "locationNo",
          label: "仓位编号",
        },
        //  render: (h, scope) => {
        //             return h(
        //               "a",
        //               {
        //                 style: "color:blue",
        //                 // on: { click: () => this.openEdit("details", scope.row) },
        //               },
        //               scope.row.materialNo
        //             );
        {
          prop: "locationName",
          label: "仓位名称",
        },
        {
          prop: "regionName",
          label: "所属地区",
        },

        {
          prop: "warehouseName",
          label: "所属仓",
        },
        {
          prop: "libraryName",
          label: "所属库",
        },
        {
          prop: "capacityQtyUnit",
          label: "仓位容量",
        },
        // // {
        // //   prop: '',
        // //   label: '是否启用',
        // //   render: (h, scope) => {
        // //     return h("el-checkbox", {
        // //       props: {
        // //         value: scope.row.usable,
        // //         disabled: true
        // //       }
        // //     });
        // //   
        // },
        // {
        //   prop: "updateTime",
        //   label: "审核状态",
        // },
        // {
        //   prop: "remark",
        //   label: "备注",
        // },
        //  {
        //   prop: "billStatusName",
        //   label: "属性组合",
        // },
        ...this.otherHeadLie
      ];
    },
  },

  methods: {

    // 删除数据
    delData () {
      let params = {
        id:this.selectLeftData.id  ||"1",
        level: '1'
      }
      if(this.selectRow&&this.selectRow.id){
        deletestoreLocation({ids:this.selectRow.id}).then(res=>{
          if(res.success){
            this.selectRow={};
            this.getDataList()
          }
        })


      }
      else{
         deleteLibararyApi(params).then((res) => {
        this.$message.error(res.msg)
      }).catch(() => { })
      }
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
        // 条件判断后面再添加
        if (
          // !this.checkOperation(
          //   type,
          //   this.multipleSelection,
          //   "billStatus",
          //   "12345"
          // )
          false
        ) {
          return;
        } else {
          // let a = this.level == 1 ? '地区' ? this.level == 2 ? '仓' : this.level == 3 ? '库' : '仓位'
          this.billCodeText = "编辑"
          this.detail = deepCopy(this.selectLeftData);
          console.log('我是当前选中的左边行的数据', this.detail)
          // selectLeftData
          // 判断我现在选择的等级是哪一个,根据等级去显示
          let visibles = ['areaVisible', 'wareVisible', 'houseVisible', 'lastVisible']
          let _visibleVal = visibles[this.level - 1]
         

          if(this.selectRow&&this.selectRow.id){
            this.lastVisible=true;
            return
          }

          this[_visibleVal] = true;
          console.log('我是当前显示的框', this._visibleVal)

        }
      }
      if (type == 'area') {
        this.areaVisible = true;
        this.billCodeText = "新增地区";
      } else if (type == 'ware') {
        this.billCodeText = "新增仓";
        this.wareVisible = true
      } else if (type == 'house') {
        this.billCodeText = "新增库";
        this.houseVisible = true
      } else if (type == 'last') {
        this.billCodeText = "新增仓位";
        this.lastVisible = true;
      }
    },

    getLeftSelectNew (e) {
      this.selectLeftData = e
      this.level = e.level;
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
     * @desc 初始form表单 请求发送的数据
     */


    initForm () {
      console.log(this.seleLeftid);
      let params = {
        current: this.pageParams.pageNum,
        pageSize: this.pageParams.pageSize,
        level: this.level, //1区域,2仓位,3库
        id:this.selectLeftData.id  ||"1", //后端接口的数组的id
        locationName: this.queryForm.locationName, //仓位名称 可选
        locationNo: this.queryForm.locationNo, //仓位编号 可选

        // varietyNo: this.queryForm.billNo,
        // // varietyNo: this.queryForm.checkItemName,
        // materialNo: this.queryForm.checkItemName,
        // propertyMerge: this.queryForm.materialTypeNo,
        // materialTypeNo: this.seleLeftid

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
      searchManagerLibraryApi(params)
        .then((res) => {
          console.log('我是', params)
          this.loading = false;

          this.tableData = res.data.records;
          this.pageParams.total = res.data.total;

          this.otherHeadLie = [];

          // if (res.data.records && res.data.records.length > 0) {
          //   this.otherHeadLie = res.data.records[0].headers.map(item => {
          //     return {
          //       label: item,
          //       prop: res.data.records[0].materialPropertyList.find(ss => ss.propertyName == item) ? res.data.records[0].materialPropertyList.find(ss => ss.propertyName == item).propertyValue : ''
          //     }
          //   })
          // }
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
          // fun: th确认导出查询的数据？monData,
        },
        export: {
          text: "确认导出选中的数据吗？",
          fun: this.exportCommonData,
        },
      };

      // if (objText[type].check) {
      //   if (
      //     !objText[type].check(
      //       type,
      //       this.multipleSelection,
      //       objText[type].key,
      //       objText[type].value
      //     )
      //   ) {
      //     return;
      //   }
      // }
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
   watch: {

    areaVisible(value) {   
      if (!value) {
        this.$refs.leftMenu.getLeftMenu()
      }
    },
     houseVisible(value) {
      if (!value) {
        this.$refs.leftMenu.getLeftMenu()
      }
    },
     wareVisible(value) {
      if (!value) {
        this.$refs.leftMenu.getLeftMenu()
      }
    }, //
     lastVisible(value) {
      if (!value) {
       this.getDataList();
       this.selectRow={}
      }
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
