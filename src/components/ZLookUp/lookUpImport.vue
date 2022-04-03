<template>
  <div class="popBox">
    <el-dialog @open="getChuKuList"
               :title="title"
               :visible="visible"
               :width="lookWidth"
               @closed="close"
                append-to-body
               class="popBox"
               @close="beforeClose"
               :close-on-click-modal="false">
      <div class="content">
        <div style="display: flex;justify-content: space-between;">
          <div class="lookForm"
               style="flex-grow: 1;">
            <z-form ref="form"
                    :isAdd="true"
                    :form-column="searchArr"
                    @submitModal="setSearch"></z-form>
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
                      :tableheight="350"
                      ref="multipleTable"
                      :isMain="true"
                      :tableColumn="tableColumn"
                      :tableData="dataList"
                      :loading="pageParams.loading"
                      :isSelectMore="isSelectMore"
                      :pageParams="pageParams"
                      @selePage="handleSelectionChange"
                      @rowClick="rowClick"
                      @rowDbClick="rowDbClick"
                      @pageChange="pageChange"
                      :isPage="false" />
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="padding: 8px 8px 0">
        <div style="display: flex; justify-content: space-between;padding: 8px">
          <div style="width: 400px;text-align: left;font-weight: 400;font-size: 12px">
            <span style="padding-right: 8px">显示</span>
            <el-input :value="pageParams.pageSize"
                      @input="e => changePageSize(e)"
                      @blur="() => getChuKuList()"
                      style="width: 80px">10
            </el-input>
            <span style="padding-left: 8px"> 条 </span>
          </div>
          <div style="display:flex">
            <el-button @click="cancel"
                       class="btnn">取 消</el-button>
            <el-button type="primary"
                       @click="sure"
                       class="btnn">确 定</el-button>
          </div>
        </div>

        <!-- </div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ZSearch from "@/components/CommonHeadSearch/ZSearch";
import MainTable from "@/components/CommonTable/commonTable";
import ZForm from "@/components/ZForm/ZForm";

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
        pageSize: 30,
        total: 1
      }
    };
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          field: ""
        };
      }
    },
    lookWidth: {
      type: String,
      default: '550px !important'
    },
    isSelectMore: {
      type: Boolean,
      default: true
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
      default: "选择"
    },
    params: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted () {
    this.getCheckList()
  },
  methods: {
    //翻页、跳页事件
    pageChange (e) {
      this.pageParams.pageNo = e.page;
      this.pageParams.pageSize = e.limit;
      this.getChuKuList();
      this.$refs.multipleTable.$refs.multipleTable.$forceUpdate();
    },
    beforeClose () {
      this.cancel();
    },
    close () {
      this.$refs.form.$refs.queryForm.resetFields();
      this.pageParams = {
        pageNo: 1,
        loading: false,
        pageSize: 30,
        total: 1
      };
      this.dataList = [];
    },
    reSet () {

      this.$refs.form.$refs.queryForm.resetFields();

      this.$refs.form.$refs.queryForm.resetFields()
      Object.assign(this.pageParams, this.$refs.form.formParams);
      this.getCheckList()

    },

    setSearch (e) {
      this.pageParams = { ...this.pageParams, ...e, pageNo: 1 };
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
      this.pageParams = { ...this.pageParams, ...e, pageNo: 1 };
      this.getCheckList();
    },
    // 获取弹框的列表
    getCheckList () {
      console.log(this.pageParams, this.params);
      console.log('dazhu')
      let that = this;
      Object.assign(this.pageParams, this.params)
      console.log('woshi', this.params)
      this.method(this.pageParams).then((res) => {
        this.pageParams.loading = false
        this.$refs.multipleTable.resetSelect()
        if (res.data.records !== undefined) {
          that.dataList = res.data.records
        } else {
          that.dataList = res.data;
        }
      });
    },
    //单击事件
    rowClick (row, column, event) {
      this.selectRow = row;
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
      this.selectRow = row;
      this.sure();
    },
    //勾选事件
    handleSelectionChange (e) {
      this.selectRow = e;
    },
    //关闭弹窗
    cancel () {
      this.$emit("update:visible", false);
    },
    sure () {
      this.$emit("setCheckItem", this.selectRow);
      //   this.$refs.multipleTable.$refs.multipleTable.clearSelection()
      this.cancel();
    }
  },
  computed: {}
};
</script>

<style lang="less" scoped>
/deep/ .pagination-container {
  margin-top: 0;
  display: grid;
}
/deep/ .popBox {
  .el-button {
    width: 55px !important;
  }
}
/deep/ .el-table {
  height: 421px !important;
}
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
