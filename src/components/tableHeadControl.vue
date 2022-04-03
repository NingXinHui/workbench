<template>
    <el-dialog
        title="选择数据"
        :visible="openAddModal"
        :close-on-click-modal="false"
        width="600px"
        @close="close"
    >
      <div>
        <draggable
            filter=".forbid"
            class="setModalCon"
            :group="{ name: 'people', put: true }"
            v-model="tableUpList"
        >
          <div v-for="element in tableUpList" :class="element.type==='index'?'item forbid':'item'"  :key="element.label" class="item">
            <div class="jiaButton">{{ element.label }}</div>
          </div>
        </draggable>

        <draggable
            class="setModalCon after"
            :group="{ name: 'people', put: true }"
            v-model="tableDownList"
        >
          <div
              v-for="element in tableDownList"
              :key="element.label"
              class="item"
          >
            <div class="jiaButton">{{ element.label }}</div>
          </div>
        </draggable>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button  @click="close">取 消</el-button>
        <el-button type="primary" @click="() => submitChangeColumn()"
        >确 定</el-button
        >
        <el-button type="primary" @click="() => submitChangeColumn(true)"
        >上 传</el-button
        >
      </span>
    </el-dialog>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "tableHeadControl",
  components: {draggable},
  props: ["tableDownColumn", "showColumnTable",'openAddModal','tabId'], //是不是编辑   发送过来的数据
  data() {
    return {
      tableUpList: [],
      tableDownList: [],
    };
  },
  mounted() {
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.tableUpList = this.showColumnTable;
    this.tableDownList = this.tableDownColumn;
  },

  methods: {
    close(){
      this.$emit('update:openAddModal',false)
    },
    //   关闭了弹框触发的事件
    closeSelectModal(value = false, isUp = false,down) {
      this.$emit("closeParent", value, isUp,this.tabId,down);
      this.close()
    },
    submitChangeColumn(isUp) {
      if (this.tableUpList.length < 1) {
        return this.$message.error("请选择要展示的列");
      }
      this.closeSelectModal(this.tableUpList, isUp,this.tableDownList);
    },
  },
};
</script>

<style lang="less" scoped>

/deep/.el-dialog__header {
  height: 30px !important;
  padding: 5px 12px !important;
  background: #eaeef4 !important;
  border-radius: 4px 4px 0 0 !important;
  line-height: 20px;
  .el-dialog__title{
    font-size: 12px;
    line-height: 20px;
  }
  .el-dialog__headerbtn {
    top: 5px !important;
    right: 12px !important;
    color: #909399;
  }

}
.after{
  min-height: 50px;
  background: #F8FBFF;
  border:1px solid #DDE6F2;
  padding: 8px;
  border-right: 4px;
}
//.setModalCon {
//  display: flex;
//  flex-wrap: wrap;
//  //padding-top: 30px;
//  //padding-bottom: 30px;
//  //box-shadow: 0px 2px 0px #ececec;
//
//  & > div {
//    flex-shrink: 0;
//    margin-bottom: 8px;
//    margin-right: 8px;
//    cursor: pointer;
//  }
//
//  .jiaButton {
//    padding: 4px 15px;
//    font-size: 12px;
//    border-radius: 3px;
//    border: 1px solid #dcdfe6;
//    height: 28px;
//  }
//}

.setModalCon {
  display: flex;
  flex-wrap: wrap;
  //padding-top: 30px;
  //padding-bottom: 30px;
  //box-shadow: 0px 2px 0px #ececec;

  & > div {
    flex-shrink: 0;
    margin-bottom: 8px;
    margin-right: 8px;
    cursor: pointer;
  }

  .jiaButton {
    padding: 4px 15px;
    font-size: 12px;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    height: 28px;
  }
  .forbid{
    border-color: #e6ebf5;
    background-color: #FFFFFF;
    color: #C0C4CC;
    cursor: not-allowed;
  }
}

</style>

