<template>
  <el-form-item :rules="item.rules"
                :label="item.label"
                :prop="item.key"
                :index="index"
                :class="{
      'form-textarea': item.type === 'input' && item.subtype === 'textarea',
      'form-item-textarea':
        item.type === 'input' && item.subtype === 'textarea',
      'form-checkboxGroup-box': item.type === 'checkboxGroup',
      'form-item-number': item.type === 'number',
      'form-upload': item.type === 'upload',
      'label-color':item.isEdit
      }">
    <div v-if="item.isEdit && item.type == 'upload'"
         class="form-label-box uploadFile"
         :title="label">
      <div v-for="(i, r) in label"
           :key="r">
        {{ i[item.uploadLabel] }}
      </div>
    </div>
    <div v-else-if="item.isEdit && item.type != 'checkbox'"
         class="form-label-box"
         :title="label">
      {{ label }}
    </div>
    <el-input v-else-if="item.type === 'input'"
              :type="item.subtype"
              :placeholder="item.placeholder ? item.placeholder : '请输入'"
              :disabled="item.disabled||item.isIndexOrDisabled==index"
              :index="index"
              :min="item.min"
              :max="item.max"
              clearable
              :precision="item.precision"
              :maxlength="item.maxlength ? item.maxlength : 40"
              v-bind="{ ...$attrs, ...item.attrs }"
              v-on="{ ...$listeners, ...item.listeners }"
              :show-word-limit="item.subtype == 'textarea' ? true : false"></el-input>
    <el-input-number v-else-if="item.type === 'number'"
                     :min="item.min"
                     :max="item.max"
                     :index="index"
                     :placeholder="item.placeholder ? item.placeholder : '请输入'"
                     :controls="item.controls"
                     controls-position="right"
                     :precision="item.precision"
                     :disabled="item.disabled"
                     v-bind="{ ...$attrs, ...item.attrs }"
                     v-on="{ ...$listeners, ...item.listeners }"></el-input-number>
    <!-- 远程搜索的组件 -->
    <el-autocomplete class="inline-input"
                     v-else-if="item.type=== 'autocomplete'"
                     :fetch-suggestions="querySearch"
                     placeholder="请输入内容"
                     :trigger-on-focus="false"
                     v-bind="{ ...$attrs, ...item.attrs }"
                     v-on="{ ...$listeners, ...item.listeners }"></el-autocomplete>

    <el-checkbox v-else-if="item.type === 'checkbox'"
                 :index="index"
                 :disabled="item.disabled"
                 v-bind="{ ...$attrs, ...item.attrs }"
                 v-on="{ ...$listeners, ...item.listeners }">
      {{ item.checkLabel }}
    </el-checkbox>
    <el-switch v-else-if="item.type === 'switch'"
               :active-text="item.activeText"
               :inactive-text="item.inactiveText"
               :active-color="item.activeColor"
               :inactive-color="item.inactiveColor"
               :disabled="item.disabled"
               v-bind="{ ...$attrs, ...item.attrs }"
               v-on="{ ...$listeners, ...item.listeners }"></el-switch>

    <el-rate v-else-if="item.type === 'rate'"
             :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
             :disabled="item.disabled"
             text-color="#ff9900"
             v-bind="{ ...$attrs, ...item.attrs }"
             v-on="{ ...$listeners, ...item.listeners }"></el-rate>

    <el-radio-group v-else-if="item.type === 'radio'"
                    v-bind="{ ...$attrs, ...item.attrs }"
                    v-on="{ ...$listeners, ...item.listeners }">
      <component v-for="o in item.options || ajaxOptions"
                 :is="item.button ? 'el-radio-button' : 'el-radio'"
                 :key="o.value"
                 :label="o.value"
                 :disabled="o.disabled"
                 :border="item.border">{{ o.label }}</component>
    </el-radio-group>

    <el-checkbox-group v-else-if="item.type === 'checkboxGroup'"
                       :min="item.min"
                       :max="item.max"
                       v-bind="{ ...$attrs, ...item.attrs }"
                       v-on="{ ...$listeners, ...item.listeners }">
      <component v-for="o in item.options || ajaxOptions"
                 :is="item.button ? 'el-checkbox-button' : 'el-checkbox'"
                 :key="o.value"
                 :disabled="o.disabled"
                 :label="o.value"
                 :border="item.border">{{ o.label }}</component>
    </el-checkbox-group>

    <el-select v-else-if="item.type === 'select'"
               :filterable="true"
               :multiple="item.multiple"
               :collapse-tags="item.collapse"
               :disabled="item.disabled"
               :placeholder="item.placeholder ? item.placeholder : '请选择'"
               :multiple-limit="item.multipleLimit"
               v-bind="{ ...$attrs, ...item.attrs }"
               v-on="{ ...$listeners, ...item.listeners }"
               :allow-create="item.allowCreate"
               @input="item.input && item.input($event, index)">
      <el-option v-for="o in item.options || ajaxOptions"
                 :key="o.value"
                 :label="o[item.optionLabel] || o.label"
                 :value="o[item.optionValue] || o.value"
                 :disabled="o.disabled">
      </el-option>
    </el-select>
    <template v-else-if="item.type === 'selectLook'">
      <div class="searchBtn">
        <el-button type="text"
                   class="rightBtn"
                   @click="item.showLook && item.showLook($event)"
                   icon="el-icon-search"></el-button>
        <el-select :filterable="true"
                   :multiple="item.multiple"
                   :disabled="item.disabled"
                   :placeholder="item.placeholder ? item.placeholder : '请选择'"
                   :multiple-limit="item.multipleLimit"
                   remote
                   :collapse-tags="item.collapse"
                   clearable
                   v-bind="{ ...$attrs, ...item.attrs }"
                   v-on="{ ...$listeners, ...item.listeners }"
                   :allow-create="item.allowCreate"
                   @input="item.input && item.input($event, index)">
          <el-option v-for="o in item.options || ajaxOptions"
                     :key="o.value"
                     :label="o[item.optionLabel] || o.label"
                     :value="o[item.optionValue] || o.value"
                     :disabled="o.disabled">
          </el-option>
        </el-select>
      </div>
    </template>

    <el-cascader v-else-if="item.type === 'cascader'"
                 :options="item.options || ajaxOptions"
                 :filterable="true"
                 :disabled="item.disabled"
                 :clearable="true"
                 v-bind="{ ...$attrs, ...item.attrs }"
                 v-on="{ ...$listeners, ...item.listeners }"></el-cascader>

    <el-time-picker v-else-if="item.type === 'time'"
                    :is-range="item.isRange"
                    :value-format="item.valueFormat"
                    :format="item.valueFormat"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder ? item.placeholder : '请选择'"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    v-bind="{ ...$attrs, ...item.attrs }"
                    v-on="{ ...$listeners, ...item.listeners }"></el-time-picker>

    <el-date-picker v-else-if="item.type === 'date'"
                    :type="item.subtype"
                    :value-format="item.valueFormat"
                    :format="item.viewFormat || item.valueFormat"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder ? item.placeholder : '请选择'"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    v-bind="{ ...$attrs, ...item.attrs }"
                    v-on="{ ...$listeners, ...item.listeners }"></el-date-picker>
    <template v-else-if="item.type === 'upload'">
      <el-upload class="avatar-uploader"
                 action="upload"
                 :http-request="(file) => item.upload && item.upload(file,index)"
                 :show-file-list="false"
                 :before-upload="item.beforeAvatarUpload && item.beforeAvatarUpload">
        <el-button size="mini">上传文件</el-button>
      </el-upload>
      <div class="uploadFile">
        <div v-for="(e, s) in label"
             :key="s">
          {{ e[item.uploadLabel] }}
          <el-button class="ml-10"
                     @click="item.del && item.del(s)"
                     type="text">删除</el-button>
        </div>
      </div>
    </template>
  </el-form-item>
</template>

<script>
export default {
  components: {},
  props: {
    item: {
      type: Object,
      required: true
    },
    label: {
      type: [String, Boolean, Number, Array],
      default: ""
    },
    index: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data () {
    return {
      ajaxOptions: [],
      remoteNews: []
    };
  },
  computed: {},
  async created () {
    const { optionsFunction } = this.item;

    if (optionsFunction) {
      let res = await optionsFunction();

      this.ajaxOptions = res.data;
    }
  },
  methods: {

    querySearch (queryString, cb) {

      // 发送请求到后端
      this.item.remoteMethod(queryString).then(res => {
        let selrec = res.data.records.map(item => {
          return {
            ...item,
            value: item.fullName
          }
        })
        cb(selrec)
      })
    },
  },
};
</script>
<style lang="scss">
//number样式
.form-item-number {
  .el-input-number {
    width: 100%;
    .el-input__inner {
      text-align: left;
      padding-left: 4px;
    }
  }
}

//checkboxGroup样式
.form-checkboxGroup-box {
  .el-form-item__content {
    width: 100% !important;

    .el-checkbox__label {
      float: left;
      font-weight: 400;
      font-size: 12px;
      line-height: 32px;
      padding-right: 5px;
      width: 85px;
      text-align: right;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #606266;
    }
  }
}

//textarea样式
.form-item-textarea {
  .el-textarea__inner {
    padding-left: 4px;
  }
}
.form-checkbox {
  width: 265px;
}
</style>
<style lang="scss" scoped>
.form-label-box {
  width: 180px;
  font-size: 12px;
}

.form-textarea {
  .form-label-box {
    width: auto;
  }
}
.form-upload {
  flex-basis: 100% !important;
  width: 100%;
  align-items: unset;
  ::v-deep .el-form-item__content {
    flex: 1 !important;
    width: 1000px !important;
  }
  .form-label-box {
    width: auto;
  }
}
.uploadFile {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  div {
    margin-right: 20px;
    color: #323233;
    font-size: 12px;
  }
}
::v-deep .el-upload {
  text-align: left !important;
}
.searchBtn {
  position: relative;
  ::v-deep .el-input__inner {
    padding-right: 35px !important;
  }
  ::v-deep .el-input__suffix {
    right: 15px !important;
  }
  ::v-deep .el-select__tags {
    max-width: 163px !important;
    .el-tag:nth-child(1) {
      width: 93px !important;
    }
  }
  .rightBtn {
    width: 20px !important;
    padding: 0 !important;
    min-width: 20px !important;
    position: absolute;
    right: 2px;
    font-size: 14px !important;
    top: 1px;
    line-height: 26px;
    z-index: 11;
  }
}
.label-color {
 ::v-deep .el-form-item__label {
    color: #999999 !important;
  }
}
</style>
