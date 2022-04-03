<!--Look弹窗部分简化组件-->
<template>
  <div id="zPage">
    <el-dialog
        @open="getCheckList"
        title="选择核算项目"
        :visible="visible"
        width="750px"
        @close="cancel"
        destroy-on-close
    >
      <div class="z-content-search">
        <z-search :search-arr="searchArr" ref="form" @sureSearch="searchMethod">
          <template>
            <el-form-item>
              <el-button   @click="() => reSet()" > 重置</el-button>
            </el-form-item>
          </template>
        </z-search>
      </div>
      <div class="z-content-table">
        <main-table
            :set-height="400"
            ref="mainTable"
            :isMain="true"
            :tableColumn="checkColumn"
            :tableData="checkList"
            :loading="pageParams.loading"
            :hideSingPage="true"
            :pageParams="pageParams"
            @rowClick="rowClick"
            @rowDbClick="rowDbClick"
        />
      </div>

      <div style="display: flex; justify-content: space-between">
        <div style="width: 400px">
          <span style="padding-right: 8px">显示</span>
          <el-input
              :value="shownummodal"
              @input="(e) => changeshownum(e)"
              @blur="() => getChuKuList()"
              style="width: 80px"
          >10</el-input
          >
          <span style="padding-left: 8px"> 条 </span>
        </div>
        <div slot="footer" class="dialog-footer">
    <el-button  @click="cancel" size="mini">取 消</el-button>
    <el-button  type="primary" size="mini" @click="sure">确 定</el-button>
  </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import ZSearch from '@/components/CommonHeadSearch/ZSearch'

import MainTable from "@/components/CommonTable/commonTable";
// import {checkItemAll} from "@/api/check";

export default {
  name: "Item",
  components: {
    MainTable,ZSearch
  },
  data() {
    return {
      shownummodal:10,
      searchArr:[{
        label: '项目名称',
        value: 'checkName',
        field: 'checkName',
        type: 1,
        maxLength: '20'
      },{
        label: '项目单号',
        value: 'checkCode',
        field: 'checkCode',
        type: 1,
        maxLength: '20'
      }],
      selectRow: [],
      checkList: [],
      pageParams: {
        pageNo:1,
        loading: false,
        pageSize:10,
      },
      checkColumn: [
        {
          prop: "checkName",
          label: "项目名称",
          width:100
        },{
          prop: "checkCode",
          label: "编号",
          width:"*"

        },{
          prop: "checkAbbName",
          label: "简称",
          width:"*"

        }
      ],

    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    reSet(){
      this.$refs.form.$refs.queryForm.resetFields()
    },
    //   获取弹框的数据列表
    getChuKuList() {
      this.pageParams.pageNo=1
      this.pageParams.pageSize=this.shownummodal
      this.getCheckList()
    },
    changeshownum(e) {
      if (isNaN(e)) {
        return;
      }
      this.shownummodal = e;
    },
    searchMethod(e){
      this.pageParams={...this.pageParams,...e}
      this.getCheckList()
    },
    // 获取弹框的列表
    getCheckList() {
      let that = this;
      this.pageParams.loading=true

      // checkItemAll(this.pageParams).then((res) => {
      //   this.pageParams.loading=false
      //   that.checkList = res.data;
      // });
    },
    // 勾选子组件表格
    select(e){

        // this.$refs.mainTable.$refs.multipleTable.clearSelection()
        // if (this.selectRow.length === 0){
        //   return false
        // }
        // this.$refs.mainTable.$refs.multipleTable.toggleRowSelection(e, true)


    },
    rowClick(val) {
      this.selectRow=val
    },
    rowDbClick(val){
      this.selectRow=val
      this.sure()
    },
    //关闭弹窗
    cancel() {
      // this.$refs.mainTable.$refs.multipleTable.clearSelection()
      this.$emit('update:visible', false)
    },
    sure() {
      this.$emit('setCheckItem', this.selectRow)
      this.$emit('update:visible', false)
    }
  },
  computed: {}

}
</script>

<style  lang="less">
  .setBackColorInFieldTable {
    background: #f8f8f9 !important;
  }
  .innerForm{
    .button{
      flex: 1;
      text-align: right;
    }
  }

</style>
