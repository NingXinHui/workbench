<template>
  <div id="commonaddupdadte">
    <el-dialog
        @close="() => this.closeModal()"
        :close-on-click-modal="false"
        :title="isedit ? '编辑' : '新增'"
        width="600px"
        :visible.sync="dialogFormVisible"
    >
      <div class="table">
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
        <el-table :data="tableData" height="250" border style="width: 100%">
            <el-table-column align="center" type="selection" :reserve-selection="true"
                width="55"></el-table-column>
            <el-table-column v-for="(item, index) in tableColumn"
                :key="index" :prop="item.prop" :label="item.label" :type="item.type"
                :width="item.width" :fixed="item.fixed" :class-name="item.className"
                show-overflow-tooltip :align="item.align ? item.align : 'center'"
            ></el-table-column>
        </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="() => closeModal()">取 消</el-button>
        <el-button type="primary" @click="() => submitModal()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import render from "./table-render.js";
export default {
    
  name: "kaka",
  props: ["isedit", "sendnew", "sendarr",{
      tableData: {
      type: Array,
      default: () => [],
    },
    tableColumn: {
      type: Array,
      default: () => [],
    },
  }], //是不是编辑   发送过来的数据
  data() {
    return {
      dialogFormVisible: false,
      showCheckList: [],
      showInputList: [],
      formParams: {},
      isdisabled:false,
      tableData: [{usable:true,materialNo:'SEDRFTJIJIJ'},{usable:false,materialNo:'EDSIKRD'}],
      // 表格的显示
      tableColumn: [
        {
          align: "left",
          label: "方法编号",
          width: "200",
        },
        {
          prop: "materialName",
          label: "方法名称",
          align: "left",
        },
        {
          prop: "materialTypeName",
          label: "描述",
          align: "left",
        },
        {
          prop:'materialTypeName',
          label: "方法参数１",
          align: "left",
        
        },
        {
          prop: "materialNameEn",
          label: "方法参数2",
          align: "left",
        },
        {
          prop: "warpWastagePercent",
          label: "方法参数３",
          align: "left",
        },

        {
          prop: "weftWastagePercent",
          label: "方法参数4",
          align: "left",
        },
        {
          prop: "component",
          label: "方法参数5",
          align: "left",
        },
        {
          prop: "component",
          label: "单位",
          align: "left",
        },
        {
          prop: "component",
          label: "下限",
          align: "left",
        },
        {
          prop: "component",
          label: "上限",
          align: "left",
        },{
          prop: "usable",
          label: "是否可用",
          align: "left",
          render: (h, scope) => {
            return h("el-checkbox", {
              props: {
                value: scope.row.usable,
                disabled:'disabled'
              },
            });
          },
        },
      ],
    };
  },
  mounted() {
    this.dialogFormVisible = true;
    this.showCheckList = this.sendarr.filter((item) => item.type == "3");
    this.showInputList = this.sendarr.filter((item) => item.type != "3");
    this.formParams = { ...this.sendnew };
  },
  methods: {
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
