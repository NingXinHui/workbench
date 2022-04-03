<template>
  <div style="display:flex">
    <el-form class="innerForm"
             :size="formConfig.size"
             :model="formParams"
             ref="queryForm"
             @submit.native.prevent
             :inline="true">
      <el-form-item v-for="(item, index) in searchArr"
                    :key="index"
                    :label="!item.showLabel && item.showLabel === false ? '' : item.label"
                    style="margin-right: 8px"
                    :required="!!item.required"
                    :prop="item.value">
        <!--自定义组件-->
        <div v-if="item.type == 6">
          <slot :name="item.value"></slot>
        </div>
        <!--        普通输入框-->
        <el-input v-if="item.type == '1'"
                  v-model="formParams[item.value]"
                  :placeholder="item.type == 2 ? '请选择' : '请输入'"
                  clearable
                  :type="item.inputType || ''"
                  :maxlength="item.maxLength || 40" />
        <!--        下拉框-->
        <el-select v-if="item.type == '2'"
                   v-bind="{ ...$attrs, ...item.attrs }"
                   v-on="{ ...$listeners, ...item.listeners  }"
                   @change="selectChange"
                   v-model="formParams[item.value]"
                   :clearable="item.clearable == false ? false : true"
                   :filterable="true"
                   placeholder="请选择"
                   :style="{ width: item.width + 'px' }">
          <el-option v-for="itemx in item.selectOption || item.optionList"
                     :key="itemx.id"
                     :label="itemx[item.optionLabel]"
                     :value="itemx[item.optionValue] || itemx">
          </el-option>
        </el-select>
        <!-- 多选下拉 -->
        <el-select multiple
                   collapse-tags
                   v-if="item.type == '7'"
                   v-model="formParams[item.value]"
                   :clearable="true"
                   :filterable="true"
                   placeholder="请选择">
          <el-option v-for="itemx in item.selectOption || item.optionList"
                     :key="itemx.id"
                     :label="itemx[item.optionLabel]"
                     :value="itemx[item.optionValue]">
          </el-option>
        </el-select>
        <el-cascader v-if="item.type=='33'"
                     v-model="formParams[item.value]"
                     :options="item.options"
                     v-bind="{ ...$attrs, ...item.attrs }"
                     v-on="{ ...$listeners, ...item.listeners }"></el-cascader>
        <el-input @focus="openLookUp"
                  :readonly="!!item.read"
                  :disabled="!!item.disabled"
                  v-if="item.type === 9"
                  v-model="formParams[item.value]"
                  placeholder="请选择"
                  clearable
                  :maxlength="item.maxLength || 30"
                  @clear="item.clear && item.clear()" />
        <!--日期-->
        <el-date-picker v-if="item.type == '3'"
                        v-model="formParams[item.value]"
                        type="date"
                        placeholder="选择日期时间"
                        align="right"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
        </el-date-picker>
        <!--日期范围-->
        <el-date-picker v-if="item.type == '4'"
                        @input="pickerInput"
                        v-model="formParams[item.value]"
                        :type="item.pickerType"
                        :value-format="item.valueFormat"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :range-separator="item.rangedesc"
                        align="right"
                        :picker-options="picker(item.pickerType)">
        </el-date-picker>
        <!--多选框-->
        <el-checkbox v-if="item.type == '5'"
                     v-model="formParams[item.value]">
          {{ item.label }}
        </el-checkbox>
        <!-- 树形下拉选择 25 -->
        <!-- <div class="setmenu fontS"> -->
        <el-select v-if="item.type == '25'"
                   popper-class="setmenu"
                   v-model="formParams[item.value]"
                   clearable
                   :filterable="true"
                   :placeholder="item.placeholder || '请选择'"
                   ref="selectOpen"
                   @clear="item.clear && item.clear()">
          <el-option :label="item.optionLabel"
                     :value="item.optionValue">
            <template>
              <div>
                <el-tree :data="item.selectOption"
                         ref="updatetree"
                         :props="item.defaultProps"
                         @node-click="handleNodeClick">
                </el-tree>
              </div>
            </template>
          </el-option>
        </el-select>
        <!-- </div> -->
      </el-form-item>
      <el-form-item style="margin-left: -4px"
                    v-if="showSureButton">
        <el-button type="primary"
                   @click="() => buttonSearch()">
          查询</el-button>
        <template v-if="searchButtonList.length">
          <el-button v-for="(item, index) in searchButtonList"
                     :key="index"
                     @click="() => otherButton(item.value)">{{ item.label }}</el-button>
        </template>
      </el-form-item>
      <slot></slot>
    </el-form>
     <slot name="customer"></slot>
  </div>
</template>

<script>
export default {
  name: "ZSearch",
  props: {
    formConfig: {
      type: Object,
      default: () => {
        return { size: "mini" };
      }
    },
    searchArr: {
      type: Array,
      default: []
    }, //是不是编辑   发送过来的数据
    searchButtonList: {
      type: Array,
      default: () => {
        return [];
      }
    }, //除搜索以外的按钮
    showSureButton: {
      type: Boolean,
      default: true
    },
    model: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      formParams: {},
      status: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick (picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  mounted () { },
  watch: {
    model: {
      handler (v) {
        this.formParams = v
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    pickerInput (e) {
      console.log(e);
      this.$emit("pickerInput", e);
    },
    selectChange (e) {
      this.$emit("selectChange", e);
    },
    openLookUp () {
      this.$emit("openLookUp", true);
    },
    // 树形下拉
    handleNodeClick (a, b, c) {
      this.$refs.selectOpen[0].blur();
      this.$emit("opentree", a);
    },
    // 父组件调用 重置子组件的值
    resetForm (value) {
      this.formParams = { ...this.formParams, ...value };
    },
    setTime (e) {
      if (e === null) {
        this.formParams.startDate = "";
        this.formParams.endDate = "";
      } else {
        let [start, end] = e;
        this.formParams.startDate = start;
        this.formParams.endDate = end;
      }
    },
    buttonSearch () {
      this.$emit("sureSearch", this.formParams);
    },
    otherButton (value) {
      this.$emit("otherButtonSearch", value);
    },
    //根据时间类型返回快捷选项
    picker (e) {
      //时间段选择
      return {
        shortcuts: [
          {
            text: "最近一周",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      };
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-form {
  display: flex;
  align-items: center;
  font-size: 14px !important;
  .el-input {
    height: 26px;
    line-height: 26px;
    .el-input__inner {
      height: 26px;
      line-height: 26px;
    }
  }
  .el-button {
    padding: 6px 15px;
    height: 26px;
  }
  .el-form-item {
    display: flex;
    margin-bottom: 0;
    .el-form-item__label {
      padding: 0;
      font-weight: 400;
      font-size: 12px;
    }
    .el-form-item__content {
      margin-left: 4px;
      .el-input__inner {
        padding-left: 4px;
      }
      // .el-date-editor,
      .el-input-number {
        width: 180px !important;
      }

      .el-date-editor {
        width: 200px !important;
      }
    }
  }
}
</style>
<style scoped>
.el-tree >>> .el-tree-node {
  font-weight: initial;
}
.setmenu .el-select-dropdown__item {
  height: 100% !important;
  padding: 0px;
}
</style>
