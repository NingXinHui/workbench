<template>
  <div id="zPage" class="market-order-edit">
    <div class="z-header">
       <el-button plain @click="cancel">返回</el-button>
    </div>
    <div class="z-content" v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div
            :class="[
              'z-details-content-box',
              detailsShow ? '' : 'details-height-none',
            ]"
          >
            <div class="z-content-table">
                  <el-tabs v-model="activeName">
              <el-tab-pane label="发货通知单" name="first">
              </el-tab-pane>
              <el-tab-pane label="销售退货单" name="second">
                 </el-tab-pane>
              <el-tab-pane label="采购订单" name="third">
              </el-tab-pane>
              <el-tab-pane label="生产任务书" name="four">
              </el-tab-pane>
              <el-tab-pane label="开票明细记录" name="five">
              </el-tab-pane>
            </el-tabs>
              <common-table
                :class="{ zTable: isEdit }"
                ref="mainTable"
                :isSelection="false"
                :tableColumn="tableColumn()"
                :tableData="tableData"
                :isMain="true"
              ></common-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import commonTable from "@/components/CommonTable";
import lookUp from '@/components/ZLookUp/lookUpImport'; //lookup统一弹窗
import {tableOne,tableTwo,tableThree,tableFour,tableFive } from "./show";
export default {
  name: "Menuceng",
  components: { formList, commonTable},
  props: {
    operateType: {
      type: String,
      default: "edit",
    }
  },
  data() {
    return {
      basicShow: true, //是否显示基本信息的模块
      detailsShow: true, //是否显示详情数据的模块
      isEdit: true, //是否处于编辑状态
      loading: false, //主体是否处于加载状态
      activeName:'first',
      topTableData: [], //融资信息表格
      tableData: [], //下面表格要显示的数据、
      multipleSelection: [], //下main表格选中的数据
      visible: false, //lookup展示条件
    };
  },

  mounted() {
    if(this.operateType == 'details') {
      this.isEdit = false;
    }
  },

  /**
   * 加载前准备些数据 比如下拉框需要的 还有初始化界面的
   */
  created() {
  },
// computed: {
//     tableOne() {
//       let isEdit = this.isEdit;
//       return tableOne(this, isEdit);
//     },
//   },
  /**
   * @desc 存储一些数据变化需要页面更新的 比如searchArr  table的
   */

  methods: {
    tableColumn() {
      let obj = {
        first: tableOne(),
        second: tableTwo(),
        third: tableThree(),
        four: tableFour(),
        five: tableFive(),
      };
      return obj[this.activeName]
    },
    /**
     * @desc 回退到列表的页面
     */
    cancel() {
      this.$emit("submit");
    },

    /**
     * @desc 点击icon展示 关闭 下面的数据
     */
    isCancel(key, bool) {
      this[key] = bool;
    },

  },
};
</script>


<style lang='less' scoped>
.tips {

}
</style>
