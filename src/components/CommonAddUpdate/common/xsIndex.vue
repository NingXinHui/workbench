<template>
  <div id="commonaddupdadte">
    <el-dialog
        @close="() => this.closeModal()"
        :close-on-click-modal="false"
        :title="isedit ? '编辑' : '新增'"
        width="600px"
        :visible.sync="dialogFormVisible"
    >
      <div>
        <div v-for="(item, index) in showInputList" :key="index">
          <div class="setflex">
            <div style="line-height: 28px">
              <span v-if="item.isRequired" style="color: red"> * </span>
              <span>{{ item.label }}:</span>
            </div>
            <div>
              <!-- 根据类型判断下是什么类型的 -->

              <!-- 输入框 -->

              <div v-if="item.type == '1'">
                <el-input v-model="formParams[item.value]" autocomplete="off"
                :disabled="item.isdisabled"
                >
                </el-input>
              </div>
              <!-- 下拉框 -->

              <div v-if="item.type == '2'">
                <el-select
                    v-model="formParams[item.value]"
                    :clearable="true"
                    placeholder="请选择"
                    filterable
                    @change="selectChanged"
                >
                  <el-option
                      v-for="items in item.seleOption"
                      :key="items.id"
                      :label="items[item.optionLabel]"
                      :value="items[item.optionValue]"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>

        <div class="setflex">
          <div></div>
          <div>
            <el-checkbox
                v-for="(item, index) in showCheckList"
                style="margin-bottom: 6px"
                :key="index"
                :label="item.label"
                v-model="formParams[item.value]"
            ></el-checkbox>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="() => closeModal()">取 消</el-button>
        <el-button type="primary" @click="() => submitModal()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "kaka",
  props: ["isedit", "sendnew", "sendarr"], //是不是编辑   发送过来的数据
  data() {
    return {
      dialogFormVisible: false,
      showCheckList: [],
      showInputList: [],
      formParams: {},
      isdisabled:false
    };
  },
  mounted() {
    this.dialogFormVisible = true;
    this.showCheckList = this.sendarr.filter((item) => item.type == "3");
    this.showInputList = this.sendarr.filter((item) => item.type != "3");
    this.formParams = { ...this.sendnew };
  },
  methods: {
    selectChanged(value){
      var that =this
      console.log('itemitemitemitemitemitem',this.showInputList)
      console.log(value)
      this.showInputList[0].seleOption.forEach(item => {
        if(item.id == value){
          that.formParams.realName = item.name
          that.formParams.testerNo = item.code;
          that.formParams.testerName = item.name
          console.log(item.name,item.code)
        }
      });
      // if(){

      // }
    },
    closeModal() {
      this.$emit("closeModal");
    },
    submitModal() {
      let { showInputList = [], formParams = {} } = this;
      let that = this;

      for (let i = 0; i < showInputList.length; i++) {
        if (
            showInputList[i].isRequired &&
            !formParams[showInputList[i].value]
        ) {
          return this.$message({
            message: `${showInputList[i].label}不能为空`,
            type: "error",
          });
        }
      }

      if (this.isedit) {
        //   updateOneSure
        this.$emit("updateOneSure", formParams);
      } else {
        this.$emit("addNewSure", formParams);
      }
    },
  },
};
</script>

<style  lang="less">
#commonaddupdadte {
  .setflex {
    display: flex;
    margin-bottom: 12px;

    & > div:first-child {
      width: 120px;
      text-align: right;
      margin-right: 12px;
    }
    & > div:last-child {
      flex: 1;
    }
  }
  .el-input__inner {
    height: 28px !important;
  }
}
</style>

