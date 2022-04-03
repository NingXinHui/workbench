<template>
  <el-form :inline="formConfig.inline"
           :model="value"
           :label-width="formConfig.labelWidth"
           :size="formConfig.size"
           :show-message="false"
           ref="form"
           @submit.native.prevent>
    <template v-for="item in formConfig.formItemList">
      <!-- v-for="item in formConfig.formItemList" -->
      <formItemList :key="item.key"
                    :index="index"
                    :item="item"
                    :label="item.isShow ? item.labelChange(value[item.key]) : value[item.key]"
                    :value="item.isShow ? item.labelChange(value[item.key]) : value[item.key]"
                    @input="handleInput($event, item.key)"></formItemList>
    </template>

    <slot></slot>
  </el-form>
</template>

<script>
import formItemList from "./form-item-list.vue";
import { checkFormData, } from "@/lib/common"
import { debuglog } from 'util';
export default {
  components: {
    formItemList,
  },
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  mounted () {
  },
  methods: {
    handleInput (val, key) {
      // 这里element-ui没有上报event，直接就是value了
      this.$emit("input", { ...this.value, [key]: val });
    },
    /**
     * @desc 点击保存
     */
    submit () {
      let formItemList = this.formConfig.formItemList,
        bool = checkFormData(formItemList, this.value)

      return bool
    },
  },
};
</script>

<style lang="scss" scoped>
.dynamic-form.el-form--inline {
  // .block {
  //   padding-right: 10%;
  // }
  .el-form-item {
    // display: inline-flex;
    // margin-right: 0;
    // padding-left: 10px;
    .el-form-item__label {
      font-weight: bold !important;
      // flex: 1;
      // display: inline-flex;
      // align-items: center;
      // .el-slider {
      //   width: 100%
      // }
    }
    // .el-date-editor.el-input, .el-date-editor.el-input__inner, .el-select, .el-cascader {
    //   width: 100%;
    // }
  }
}
</style>
