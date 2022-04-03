<template>
  <div class="popBox">
    <el-dialog :title="title"
               :visible="visible"
               :width="lookWidth || '750px'"
               @open="getCheckList"
               append-to-body
               class="popBox"
               @closed="close"
               @close="beforeClose"
               :close-on-click-modal="false">
      <div class="content">
        <div style="display: flex;justify-content: space-between;">
          <div class="lookForm"
               style="flex-grow: 1;">
            <z-form ref="form"
                    :isAdd="true"
                    :form-column="searchArr"
                    @submitModal="setSearch"
                    :model="detail"></z-form>
          </div>
          <div style="display: flex">
            <el-button @click="() => getCheckList()"
                       type="primary">查询</el-button>
            <el-button @click="() => reSet()"> 重置</el-button>
          </div>
        </div>
        <div style="margin-top: 10px"
             class="z-content-table">
          <main-table is-selection
                      is-height
                      ref="multipleTable"
                      :isMain="true"
                      :tableColumn="tableColumn"
                      :tableheight="400"
                      :tableData="dataList"
                      :loading="pageParams.loading"
                      :hideSingPage="true"
                      :pageParams="pageParams"
                      :isSelectMore="isSelectMore"
                      @selePage="handleSelectionChange"
                      @rowClick="rowClick"
                      @rowDbClick="rowDbClick" />
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="padding: 0 8px">
        <div style="display: flex; justify-content: space-between">
          <div style="width: 400px;text-align: left;font-weight: 400;font-size: 12px">
            <span style="padding-right: 8px">显示</span>
            <el-input :value="pageParams.pageSize"
                      @input="e => changePageSize(e)"
                      @blur="() => getChuKuList()"
                      style="width: 80px">10
            </el-input>
            <span style="padding-left: 8px"> 条 </span>
          </div>

          <el-button @click="cancel">取 消</el-button>
          <!-- <el-button type="primary" v-if="isSelectMore" @click="cotinue" style="width:140px !important">保存并继续添加</el-button> -->
          <el-button type="primary"
                     @click="sure">确 认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ZSearch from "@/components/CommonHeadSearch/ZSearch";
import MainTable from "@/components/CommonTable/commonTable";
import ZForm from "@/components/ZForm/ZForm";
import { checkExistData } from "@/lib/common";

export default {
  name: "Item",
  components: {
    ZForm,
    MainTable,
    ZSearch
  },
  data () {
    return {
      selectRow: {},
      dataList: [],
      pageParams: {
        pageNo: 1,
        loading: false,
        pageSize: 30
      }
    };
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      }
    },
    detail: {
      type: Object,
      default: () => {
        return {};
      }
    },
    lookWidth: {
      type: String,
      default: "750px"
    },
    //是否可见
    visible: {
      type: Boolean,
      default: false
    },
    //搜索框
    searchArr: {
      type: Array,
      default: []
    },
    //表头项
    tableColumn: {
      type: Array,
      default: []
    },
    method: {
      type: Function
    },
    title: {
      type: String,
      default: "查询信息"
    },
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isSelectMore: {
      type: Boolean,
      default: false
    },
    addedData: {
      type: Object,
      default: () => {
        return {
          //已加入数据
          data: [],
          //查询出来的id
          sourceId: "",
          //已加入的id
          targetId: ""
        };
      }
    },
    isClearAll: {
      type: Boolean,
      default: false
    },
    //开启多选且只选中一条数据时。控制返回数据为对象或者数组格式
    transData: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    // console.log('aaa')
    this.getCheckList();
  },
  methods: {
    beforeClose () {
      this.cancel();
    },
    close () {
      this.$refs.form.$refs.queryForm.resetFields();
      this.pageParams = {
        pageNo: 1,
        loading: false,
        pageSize: 30
      };
      this.dataList = [];
    },
    reSet () {
      this.$refs.form.$refs.queryForm.resetFields();
      Object.assign(this.pageParams, this.$refs.form.formParams);
      this.getCheckList();
    },

    setSearch (e) {
      this.pageParams = { ...this.pageParams, ...e };
    },
    //   获取弹框的数据列表
    getChuKuList () {
      this.getCheckList();
    },
    changePageSize (e) {
      if (isNaN(e)) {
        return;
      }
      if (e > 50) {
        e = 50;
      }
      this.pageParams.pageSize = Number(e);
    },
    searchMethod (e) {
      this.pageParams = { ...this.pageParams, ...e };
      this.getCheckList();
    },
    // 获取弹框的列表
    getCheckList () {
      if (this.method && !this.pageParams.loading) {
        if (this.isClearAll) {
          if (this.$refs.multipleTable) {
            this.$refs.multipleTable.resetSelect();
          }
        }
        let that = this;
        this.pageParams.loading = true;
        // console.log(this.params);
        Object.assign(this.pageParams, this.params, this.detail);
        console.log('我是this.params', this.params)
        this.method(this.pageParams)
          .then(res => {
            this.pageParams.loading = false;
            this.$refs.multipleTable.resetSelect();
            if (res.data.records !== undefined) {
              that.dataList = res.data.records;
            } else {
              that.dataList = res.data;
            }

            if (this.addedData.data.length > 0) {
              let array = [];
              that.dataList.forEach(item => {
                let obj = checkExistData(
                  this.addedData.data,
                  item[this.addedData.sourceId],
                  this.addedData.targetId
                );
                if (!obj.isExist) {
                  array.push(item);
                }
              });
              that.dataList = array;
            }
          })
          .catch(() => {
            this.pageParams.loading = false;
          });
      }
    },
    //单击事件
    rowClick (row, column, event) {
      this.selectRow = [row];
      this.$refs.multipleTable.$refs.multipleTable.toggleRowSelection(
        row,
        true
      );
    },
    //双击事件
    rowDbClick (row) {
      this.$refs.multipleTable.$refs.multipleTable.toggleRowSelection(
        row,
        true
      );
      this.selectRow = [row];
      this.sure();
    },
    //勾选事件
    handleSelectionChange (e) {
      // 如果只能单选并且选项大于一 就更新掉
      if (e.length > 1) {
        if (this.isSelectMore) {
          this.selectRow = e;
        } else {
          let del_row = e.shift();
          this.$refs.multipleTable.$refs.multipleTable.toggleRowSelection(
            del_row,
            false
          ); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
          this.selectRow = e;
        }
      }
      //  等于或者小于一  直接传值
      else {
        if (this.transData) {
          this.selectRow = e;
        } else {
          this.selectRow = e;
        }
      }
    },
    //关闭弹窗
    cancel () {
      this.$emit("update:visible", false);
    },
    sure () {
      if (!this.selectRow.length) {
        this.$message.error("请选择数据!!!");
        return;
      }
      this.$emit("setCheckItem", this.selectRow);
      this.cancel();
    },
    cotinue () {
      if (!this.selectRow.length) {
        this.$message.error("请选择数据!!!");
        return;
      }
      this.$emit("setCheckItem", this.selectRow);
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
/deep/ .lookForm {
  .el-form {
    flex-wrap: wrap;
    .el-form-item {
      //flex-basis: 50%;
      margin-bottom: 6px !important;
      .el-form-item__content {
        width: 110px;
      }
      .el-form-item__label {
        font-size: 12px;
        font-weight: 400;
        width: 80px !important;
        padding: 0 8px 0 0;
      }
    }
  }
}
/deep/.el-dialog {
  .el-dialog__footer {
    padding: 0 8px;
  }
}
.innerForm {
  .button {
    flex: 1;
    text-align: right;
  }
}
/deep/ .z-content-table {
    margin-top: 8px;
    th {
      font-weight: 400 !important;
      height: 26px !important;
      padding: 2px;
      font-size: 12px!important;
    }

    th, td > .cell {
      font-weight: 400;
      //padding: 1px;
      font-size: 12px!important;
    }
    .el-table th, .el-table td {
      padding: 1px 0 !important;
      font-size: 12px!important;
    }
  }

</style>
