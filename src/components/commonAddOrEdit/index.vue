<template>
  <el-dialog :title="dialogTitle"
             :visible="visible"
             :width="dialogWidth"
             class="addOrUpdate"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             @close="closeDialog"
             @open="openDialog">
    <el-form ref="addOrUpdate"
             :model="data"
             :label-width="labelWidth">
      <el-row :gutter="10">
        <el-col v-for="(field,index) in fieldList"
                :key="index"
                :span="field.span">
          <el-form-item :label="field.label"
                        :prop="field.value"
                        :show-message="false"
                        :rules="rules[field.value]">
            <!-- 普通输入框 -->
            <el-input :type="field.type"
                      v-if="field.type=='input'|| field.type === 'password'"
                      size="mini"
                      :disabled="field.disabled"
                      v-model="data[field.value]"
                      :show-password="field.showPassword"
                      @focus="focusEvent(field.event)"
                      @blur="blurEvent(field.event)"
                      :placeholder="'请输入'"
                      :maxlength="field.maxlength?field.maxlength:40"
                      clearable></el-input>
            <!-- 计数器 -->
            <el-input-number v-if="field.type=='inputNum'"
                             controls-position="right"
                             size="mini"
                             :step="field.step?field.step:1"
                             :min="field.min?field.min:1"
                             :max="field.max"
                             v-model="data[field.value]"
                             clearable></el-input-number>
            <!-- 多选框 -->
            <el-checkbox v-if="field.type=='checkbox'"
                         v-model="data[field.value]"
                         :disabled="field.disabled"></el-checkbox>
            <!-- 文本框 -->
            <el-input v-if="field.type=='textarea'"
                      type="textarea"
                      :rows="field.rows"
                      v-model.trim="data[field.value]"
                      :disabled="field.disabled"
                      @focus="focusEvent(field.event)"
                      @blur="blurEvent(field.event)"
                      :placeholder="'请输入'"
                      :maxlength="field.maxlength?field.maxlength:200"
                      clearable>
            </el-input>
            <!-- 选择框 -->
            <el-select v-if="field.type === 'select'"
                       v-model="data[field.value]"
                       :disabled="field.disabled"
                       clearable
                       :filterable="field.filterable"
                       :placeholder="'请选择'"
                       @change="changeEvent(field.event, data[field.value])"
                       @focus="focusEvent(field.event)">
              <el-option v-for="(item, index) in field.selList"
                         :key="index"
                         :label="item[field.optionLabel]"
                         :value="item[field.optionValue]" />
            </el-select>
            <!-- 树形下拉 -->
            <el-select v-if="field.type=='selectTree'"
                       popper-class='setmenu'
                       v-model="data[field.field]"
                       placeholder="请选择"
                       ref="selectOpen">
              <el-option :label="data[field.field]"
                         :value="data[field.field]">
                <el-tree node-key="id"
                         :data="field.selList"
                         :props="defaultProps"
                         accordion
                         @node-click="handleNodeClick">
                </el-tree>
              </el-option>
            </el-select>
            <!-- 开关 -->
            <el-switch v-if="field.type === 'switch'"
                       v-model="data[field.value]"
                       :active-color="field.color"
                       size="mini">
            </el-switch>
            <!-- 日期选择框 -->
            <el-date-picker v-if="field.type === 'date'"
                            v-model="data[field.value]"
                            size="mini"
                            :type="field.dateType"
                            clearable
                            :disabled="field.disabled"
                            :format="field.format"
                            :value-format="field.valueFormat"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" />
            <!-- 自定义内容-->
            <template v-if="field.type === 'slot'">
              <slot :name="'form-' + item.value" />
            </template>
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary"
                 @click="submitForm">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 弹窗是否显示
    visible: {
      type: Boolean
    },
    // label宽度
    labelWidth: {
      type: String,
      default: '90px'
    },
    dialogWidth: {
      type: String,
      default: '545px'
    },
    // 表单数据
    data: {
      type: Object
    },
    // 验证规则
    rules: {
      type: Object
    },
    // 弹窗标题
    dialogTitle: {
      type: String
    },
    //表单字段
    fieldList: {
      type: Array
    }
  },
  data () {
    return {
      dialogVisible: this.value,
      defaultProps: {
        children: 'children',
        label: 'materialTypeName'
      }
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  watch: {
    value (val) {
      this.dialogVisible = val;
    },
    dialogVisible (val, oldVal) {
      if (val !== oldVal) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    checkForm () {
      let result = true
      for (let item of this.$refs.addOrUpdate.fields) {
        let prop = item.prop
        this.$refs.addOrUpdate.validateField(prop, error => {
          if (error) {
            result = false
            this.$message.error(error);
          }
        })

        if (!result) {
          break;
        }
      }

      return result;
    },
    getPlaceholder (row) {
      let placeholder;
      if (row.type === 'input' || row.type === 'textarea' || row.type === 'password') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'select' || row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 提交数据
    submitForm () {
      let valid = this.checkForm()
      if (valid) {
        this.$emit('submit')
      }
    },
    // 关闭弹窗
    closeDialog () {
      this.$refs.addOrUpdate.resetFields()
      this.$emit('update:visible', false)
    },
    // 打开弹窗
    openDialog () {
      this.$emit('openDialog')
    },
    // 失去焦点事件
    blurEvent (event) {
      this.$emit('blurEvent', event)
    },
    // 发生改变的时候
    changeEvent (event, value) {
      let data = {
        evnetName: event,
        value: value
      };
      this.$emit('changeEvent', data)
    },
    focusEvent (event) {
      this.$emit('focusEvent', event)
    },
    // 树形下拉
    handleNodeClick (e) {
      this.$refs.selectOpen[0].blur()
      this.$emit("opentree", e)
      console.log(this.$refs.selectOpen)
      this.$refs.selectOpen[0].blur();
    },
  },
  components: {

  }
};
</script>

<style scoped>
.addOrUpdate /deep/ .el-dialog__header {
  padding: 5px 12px !important;
  background: #eaeef4 !important;
  border-radius: 4px 4px 0 0 !important;
}
.addOrUpdate /deep/ .el-dialog__title {
  line-height: 17px !important;
  font-size: 12px !important;
}

.addOrUpdate /deep/ .el-dialog__headerbtn {
  top: 8px;
}

.addOrUpdate /deep/ .el-form-item__label {
  font-weight: normal;
  color: #374256;
  font-size: 12px;
  padding: 0 6px;
}

.addOrUpdate /deep/ .el-form-item {
  margin-bottom: 6px;
}

/* .addOrUpdate /deep/ .el-form-item .el-input,
.addOrUpdate /deep/ .el-form-item .el-select,
.addOrUpdate /deep/ .el-form-item .el-input-number {
  width: 150px;
} */

.addOrUpdate /deep/ .el-input__inner,
.addOrUpdate /deep/ .el-textarea__inner {
  padding-left: 4px;
}

.addOrUpdate /deep/ .el-input-number--mini {
  width: 100%;
}

.addOrUpdate /deep/ .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.addOrUpdate /deep/ .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
  padding-bottom: 0;
}

.addOrUpdate /deep/ .el-dialog__footer {
  padding-bottom: 8px;
}

.seticon {
  display: flex;
}

.setmenu .el-select-dropdown__item {
  height: 100% !important;
  padding: 0px;
}

.el-tree >>> .el-tree-node {
  font-weight: initial;
}
</style>
