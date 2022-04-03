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
      :close-on-click-modal="false"
    >
      <div class="content">
        <div class="form">
          <form-list
            v-model="queryForm"
            :formConfig="formConfig"
            class="form form-order-box"
          ></form-list>
        </div>
        <div class="select">
          <div class="tip">已选工序</div>
          <div class="select_content">
            <div v-for="(item, index) in selectList" :key="index">
              <span :class="{'active': selectIndex === index}" @click="changeIndex(index)">
                {{ item.procedureName }}
                <i class="el-icon-close close" v-if="billCodeText!='查看'" @click.stop="delItem(index)"></i>
    </span
              ><i v-if="selectList.length!=1&&selectList[index + 1]" class="el-icon-arrow-right right_Icon"></i>
            </div>
          </div>
        </div>
        <div class="noselect">
          <span
            @click="selectItem(item)"
            v-for="(item, index) in noSelectList"
            :key="index"
          >
            {{ item.procedureName }}
          </span>
        </div>
      </div>
      <div slot="footer" v-if="billCodeText!='查看'">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
       <div slot="footer" v-if="billCodeText=='查看'">
        <el-button type="primary" @click="edit">编辑</el-button>
        <el-button  @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/Form/formList";
import { checkFormData } from "@/lib/common";
import { addTrackTemplate,updateTrackTemplate,getTrackTemplateDetail } from "@/api/production/documentary";
import { workprocedureListAll } from "@/api/production/workingProcedure";
export default {
  name: "add",
  components: { formList },

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
      queryForm: {},
      isEdit: true,
      selectList: [],
      noSelectList: [
      ],
      basic: {
        usable: true,
        billName: "",
      },
      selectIndex:'',
    };
  },
  methods: {
    //选中已选工序进行操作
    changeIndex(index) {
      if(this.selectIndex === index) {
        this.selectIndex = '';
      } else {
        this.selectIndex = index;
      }
      console.log(this.selectIndex)
    },
    delItem(index) {
      this.selectList.splice(index,1)
    },
    //编辑
    edit() {
      this.$parent.billCodeText = '编辑';
      this.isEdit = !this.isEdit;
    },
    //查看所有工序
    workprocedureListAll() {
      workprocedureListAll().then(res => {
        if(res.code == 0) {
          this.noSelectList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //获取详情
    init() {
      getTrackTemplateDetail({
        id:this.detail.id
      }).then(res => {
        if(res.code == 0) {
          this.initQueryForm(res.data);
          this.selectList = res.data.detailList;
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    selectItem(val) {
      if (this.isEdit) {
        if(this.selectIndex !== "") {
          this.selectList.splice(Number(this.selectIndex)+1,0,{
          procedureId:val.id,
          procedureName:val.procedureName
        });
        } else {
          this.selectList.push({
          procedureId:val.id,
          procedureName:val.procedureName
        });
        }
      }
    },
    //点击保存
    submit() {
       if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
        return;
      }
      if(!this.selectList.length) {
        this.$message.error("请添加工序");
        return
      }
         if(this.billCodeText == '新增'||this.billCodeText == '复制') {
        addTrackTemplate({
          ...this.queryForm,
          billNo:null,
          id:null,
          detailList:this.selectList.map((item,i) => {
           return {...item,orderNumber:i,id:null}
          })
        }).then(res => {
          if(res.success) {
            this.$message.success("新增成功");
             this.$emit("update:visible", false);
              this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      } else {
         updateTrackTemplate({...this.queryForm,
          detailList:this.selectList.map((item,i) => {
           return {...item,orderNumber:i}
          })
        }).then(res => {
          if(res.success) {
            this.$message.success("修改成功");
             this.$emit("update:visible", false);
             this.$parent.getDataList();
          } else {
            this.$$message.error(res.msg)
          }
        })
      }
    },
    //关闭弹窗
    close() {
      this.$emit("update:visible", false);
    },
    //初始化页面参数
    initQueryForm(data = {}) {
      let basic = this.basic;
      this.queryForm = {
        ...basic,
        ...data
      };
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit;
      let formItemList = [
        {
          key: "billNo",
          type: "input",
          subtype: "text",
          label: "流程编号",
          isEdit,
          placeholder: "保存成功之后生成",
          disabled: true
        },
        {
          key: "billName",
          type: "input",
          subtype: "text",
          label: "流程名称",
          isEdit,
          placeholder: "请输入",
          rules: {
            required: true,
            trigger: "blur"
          }
        },
        {
          key: "usable",
          type: "checkbox",
          subtype: "checkbox",
          label: "是否可用",
          isEdit,
          disabled:this.billCodeText == '查看',
        }
      ];

      return {
        inline: true,
        size: "mini",
        labelWidth: "85px !important",
        formItemList: formItemList
      };
    }
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
    this.initQueryForm();
    this.workprocedureListAll();
    if (this.billCodeText == "查看") {
      this.isEdit = false;
    };
    if(this.billCodeText == '编辑'||this.billCodeText == "查看"||this.billCodeText == "复制") {
      this.init();
    }
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 565px !important;
    min-height: 100px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 100px !important;
      .content {
        min-height: 100px !important;
        overflow-x: auto;
        .select {
          width: 100%;
          border: 1px solid rgba(222, 230, 242, 1);
          height: 150px;
          overflow-y: auto;
          padding: 5px;
          .tip {
            font-size: 12px;
            color: #354258;
            &::before {
             content: "*";
             color: red;
             margin-right: 1px;
            }
          }
          .select_content {
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            div {
             margin: 5px;
             line-height: 30px;
             .right_Icon {
              font-size: 18px;
              font-weight: 900;
              margin-left: 5px;
             }
            }
            span {
              min-width: 65px;
              text-align: center;
              vertical-align: middle;
              min-height: 30px;
              padding: 4px 8px;
              background: #ffffff;
              border: 1px solid rgba(222, 230, 242, 1);
              cursor: pointer;
              position: relative;
            }
          }
        }
        .noselect {
          width: 100%;
          border: 1px solid rgba(222, 230, 242, 1);
          height: 150px;
          overflow-y: auto;
          border-top: none;
          margin-bottom: 8px;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          span {
            min-width: 65px;
            text-align: center;
            margin: 5px;
            min-height: 30px;
            padding: 4px 8px;
            background: #ffffff;
            border: 1px solid rgba(222, 230, 242, 1);
            cursor: pointer;
          }
        }
      }
    }
  }
}
.active {
  background-color: limegreen !important;
  color: white !important;
 }
 .close {
  position: absolute;
  top: -6px;
  right: -6px;
  font-weight: 900;
  cursor: pointer;
 }
</style>
