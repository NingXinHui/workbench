<template>
  <div>
    <el-dialog
      title="选择验证"
      :close-on-click-modal="false"
      width="700px"
      :visible.sync="openAddModal"
      @close="closeSelectModal"
    >
      <div>
        <div style="display: flex">

          <div style="flex: 1">
            <span>物料编号</span>
            <el-input
              style="width: 160px;margin-left:12px"
              v-model="checkName"
              placeholder="请输入物料名称"
              @keyup.enter.native="() => getChuKuList()"
            >
            </el-input>
            <span style="padding-left:16px">物料名称</span>
            <el-input
              style="width: 160px; margin-left: 14px"
              v-model="checkCode"
              placeholder="请输入物料单号"
              @keyup.enter.native="() => getChuKuList()"
            >
            </el-input>
          </div>
          <div style="width: 150px; margin-left: 16px">
            <el-button type="primary" @click="() => getChuKuList()"
              >查询</el-button
            >
            <el-button @click="() => getChuKuList(true)">重置</el-button>
          </div>
        </div>
        <div style="margin-top: 12px">
          <main-table
            ref="maintable"
            :isMain="true"
            :tableColumn="tableColumn"
            :tableData="showModalAddList"
            :isSelection="false"
            :tableheight="400"
            @selePage="selectPage"
            :isRowClick="true"
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
          <div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="() => closeSelectModal()">取 消</el-button>
              <el-button type="primary" @click="() => submitEditModal()"
                >确 定</el-button
              >
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MainTable from "@/components/CommonTable";
import {
  materialQueryALl, materialQueryLookUp,
} from "@/api/goodfinish";
export default {
  name: "kaka",
  components: { MainTable },
  props: ["searchArr"], //是不是编辑   发送过来的数据
  data() {
    return {
      openAddModal: false, //是否打开弹框、
      checkName: "", //名称
      checkCode: "", //单号
      shownummodal:10,
      selectRows:{},

      showModalAddList: [],
      tableColumn: [
        {
          prop: "materialName",
          label: "物料名称",
        },

        {
          prop: "materialNo",
          label: "物料编号",
        },

        {
          prop: "description",
          label: "物料描述",
        },
        {
          prop: "specification",
          label: "成品规格",
        },  {
          prop: "construction",
          label: "成品组织",
        },
        {
          prop: "fullWidth",
          label: "成品门幅",
        },
        {
          prop: "gmwt",
          label: "成品克重",
        },

        {
          prop: "unitName",
          label: "单位",
        },


      ],

    };
  },
  mounted() {
    this.openAddModal=true;
    this.getChuKuList()
  },
  methods: {

     changeshownum(e) {
      if (isNaN(e)) {
        return;
      }
      this.shownummodal = e;
    },
    //   关闭了弹框触发的事件
    closeSelectModal(value=false) {
      this.checkName = "";
      this.checkCode = "";
      this.shownummodal = 10;
      this.$refs.maintable.resetSelect();
      this.openAddModal = false;
      this.$emit('closeParent',value)
       this.selectRows={};
    },
    submitEditModal(){
      this.closeSelectModal(this.selectRows)
    },
    //   获取弹框的数据列表
    getChuKuList(isret) {

      if(isret){
        this.checkName="";
        this.checkCode=""
      }
      let params={
        pageNo:1,
        pageSize:this.shownummodal,
        materialNo:this.checkName ?this.checkName:undefined ,
        materialName:this.checkCode?this.checkCode:undefined
      }
      materialQueryLookUp({...params}).then((res) => {
      if (res.success) {
        this.showModalAddList=res.data.records
      }
    });
    },
    // 点击或者勾选的数据
    selectPage(value,issele) {
      this.selectRows=value;
      if(issele){
        this.submitEditModal()
      }
    },
  },
};
</script>

<style  lang="less">
</style>

