<template>
  <div>
    <div>
      <el-form label-position="right"
               label-width="90px"
               :disabled="!canEdit"
               :show-message="false"
               class="form"
               ref="queryForm"
               @submit.native.prevent
               :inline="config.inline"
               :model="formParams"
               :size="config.size">
        <el-form-item v-for="(item,index)  in formColumn"
                      :key="index"
                      :label="(!item.showLabel&&item.showLabel===false)?'':item.label"
                      :prop="item.field"
                      :rules="item.rules"
                      :class="{'form-textarea':item.type===4||item.fullWidth}">
          <!--          普通输入框-->
          <div v-if="item.isDetails">
            <el-checkbox @change="submitModal"
                         v-if="item.type ==7 && item.isDetails"
                         v-model="formParams[item.field]"
                         disabled>
            </el-checkbox>
            <div v-if="item.isDetails && item.type !=7"
                 class="form-label-box">
              {{formParams[item.field]}}
            </div>
          </div>

          <div v-else :class="{'form-textarea':item.type===4}">
            <el-input @change="submitModal"
                      :readonly="!!item.read"
                      :disabled="!!item.disabled"
                      v-if="item.type===1"
                      v-model="formParams[item.field]"
                      :placeholder="item.placeholder?item.placeholder:'请输入'"
                      clearable
                      :type="item.ispass ? 'password':'' "
                      :maxlength="item.maxLength||40"
                      :style="{width:item.width}"
                      :class="{'formWidth':item.width}"
                      :onkeyup="item.onkeyup || ''" />
            <i :class="item.icon"
               v-if='item.icon'
               @mouseover="selectStyle(item) "
               @mouseout="outStyle(item)"></i>
            <div v-if='item.active'
                 class="iconDiv">
              <div class="icon">
                <div class="colorH">{{item.active1}}</div>
                <div v-for="(text,indexx) in item.active2"
                     :key='indexx'
                     class="divIn">
                  <span class="textlabel">{{text.label}}</span>
                  <span class="textspan">{{text.span}}</span>
                </div>
                <div class="shili">
                  <div class="colorH">{{item.active4}}</div>
                  <span>{{item.active5}}</span>
                </div>

              </div>

            </div>

            <!--          lookUp操作-->

            <!--          lookUp操作 弹窗打开-->
            <el-input @focus="openLookUp"
                      :readonly="!!item.read"
                      :disabled="!!item.disabled"
                      v-if="item.type===9"
                      v-model="formParams[item.field]"
                      placeholder="请选择"
                      clearable
                      :maxlength="item.maxLength||100"
                      @clear="item.clear&&item.clear()" />

            <!--          lookUp2操作 直接打开-->
            <el-input @focus="item.focus&&item.focus()"
                      v-if="item.type===10"
                      v-model="formParams[item.field]"
                      placeholder="请选择"
                      clearable
                      :maxlength="item.maxLength||100"
                      @clear="item.clear&&item.clear()" />
            <el-radio-group v-if="item.type==86"
                            v-model="formParams[item.field]"
                            @change="item.change&&item.change(formParams[item.field])">
              <el-radio v-for="o in item.optionList"
                        :key="o.value"
                        :label="o.value">{{ o.label}}</el-radio>
            </el-radio-group>
            <!--计数器-->
            <el-input-number :step="1"
                             step-strictly
                             controls-position="right"
                             v-model="formParams[item.field]"
                             v-if="item.type===8"
                             :min="1"
                             :max="999999">
            </el-input-number>
            <!-- item.change?item.change($event,item): -->
            <el-select @change="submitModal"
                       v-if="item.type===2"
                       v-model="formParams[item.field]"
                       :clearable="true"
                       :disabled="!!item.disabled"
                       :filterable="true"
                       :multiple="item.multiple?true:false"
                       collapse-tags
                       placeholder="请选择">
              <el-option v-for="(item2,index2) in item.optionList||item.selectOption"
                         :key="index2"
                         :label="item2[item.optionLabel]"
                         :value="item2[item.optionValue]"
                         @click.native="getSelectValue(item2)">
              </el-option>

            </el-select>
            <!-- 多选下拉 -->
            <el-select multiple
                       collapse-tags
                       @change="submitModal"
                       v-if="item.type===5"
                       v-model="formParams[item.field]"
                       :clearable="true"
                       :disabled="!!item.disabled"
                       :filterable="true"
                       :multiple="item.multiple?true:false"
                       collapse-tags
                       placeholder="请选择">
              <el-option v-for="(item2,index2) in item.optionList"
                         :key="index2"
                         :label="item2[item.optionLabel]"
                         :value="item2[item.optionValue]"
                         @click.native="getSelectValue(item2)">
              </el-option>
            </el-select>

            <!-- 这个是选择的菜单图标的 -->
            <el-select v-if="item.type===21"
                       v-model="formParams[item.field]"
                       :clearable="true"
                       :filterable="true"
                       placeholder="请选择">

              <el-option v-for="(item2) in item.optionList"
                         :key="item2"
                         :label="item2"
                         :value="item2">
                <div class="seticon">
                  <div style="line-height:34px">
                    <svg-icon :icon-class="item2"
                              style="height: 20px;width: 16px;margin-top:5px" />
                  </div>
                  <div style="margin-left:6px">
                    {{ item2 }}
                  </div>
                </div>
              </el-option>
            </el-select>
            <!-- 这个是显示的勾选菜单的 22 -->
            <!-- <div class="setmenu"> -->
            <el-select v-if="item.type==22"
                       v-model="formParams[item.field]"
                       popper-class='setmenu'
                       placeholder="请选择">
              <el-option :label="formParams[item.field]"
                         :value="formParams[item.field]">
                <div>
                  <el-table :data="item.optionList"
                            :row-key="row=>row.id"
                            :show-header="false"
                            @cell-click="(row, column, cell, event)=>item.currentChange&&item.currentChange(row, column, cell, event)"
                            @row-click="(e)=>selectMenu(e)">
                    <el-table-column prop="name"
                                     label="名称"></el-table-column>
                  </el-table>
                </div>
              </el-option>
            </el-select>
            <!-- </div> -->
            <!-- 树形下拉选择 25 -->
            <!-- <div class="setmenu fontS"> -->
            <el-select @change="submitModal"
                       v-if="item.type==25"
                       clearable
                       popper-class='setmenu'
                       v-model="formParams[item.field]"
                       placeholder="请选择"
                       @visible-change="changeCurrent"
                       ref="selectOpen"
                       @clear="item.clear&&item.clear()">
              <el-option :label="formParams[item.field]"
                         :value="formParams[item.field]">
                <el-tree node-key="id"
                         :data="item.optionList"
                         :props="item.defaultProps"
                         accordion
                         @node-click="handleNodeClick">
                </el-tree>
              </el-option>
            </el-select>
            <el-autocomplete class="inline-input"
                             @change="submitModal"
                             v-model="formParams[item.field]"
                             v-else-if="item.type=== 'autocomplete'"
                             :fetch-suggestions="(queryString,cb) => querySearch(queryString,cb,index)"
                             placeholder="请输入内容"
                             :trigger-on-focus="false"
                             v-bind="{ ...$attrs, ...item.attrs }"
                             v-on="{ ...$listeners, ...item.listeners }"></el-autocomplete>
            <!-- </div> -->
            <el-date-picker :disabled="!!item.disabled"
                            v-if="item.type===3"
                            v-model="formParams[item.field]"
                            :type="item.pickerType?item.pickerType:'date'"
                            placeholder="选择日期时间"
                            align="right"
                            :start-placeholder="item.startText?item.startText:'开始时间'"
                            :end-placeholder="item.endText?item.endText:'结束时间'"
                            :value-format="item.valueFormat?item.valueFormat:'yyyy-MM-dd'"
                            :range-separator="item.rangeText?item.rangeText:'-'">
            </el-date-picker>
            <el-input @change="submitModal"
                      v-if="item.type===4"
                      :maxlength="item.maxlength?item.maxlength:200"
                      show-word-limit
                      type="textarea"
                      :autosize="{ minRows: 1, maxRows: 6}"
                      placeholder="请输入"
                      v-model="formParams[item.field]"
                      :style="{width:item.width+'px'}">
            </el-input>
            <el-checkbox @change="submitModal"
                         v-if="item.type===7"
                         v-model="formParams[item.field]"
                         :disabled="!!item.disabled">
            </el-checkbox>
            <!--自定义组件-->
            <div v-if="item.type===6">
              <slot :name="item.field"></slot>
            </div>
          </div>

          <!--          <slot name="lookup" v-if="item.type==9">-->
          <!--            <el-input-->
          <!--                @change="openLookUp"-->
          <!--                :readonly="!!item.read"-->
          <!--                :disabled="!!item.disabled"-->
          <!--                v-model="formParams[item.field]"-->
          <!--                placeholder="请输入"-->
          <!--                clearable-->
          <!--                :maxlength="item.maxLength||10"-->
          <!--            />-->

          <!--          </slot>-->
        </el-form-item>

        <slot name="btn">
        </slot>
      </el-form>
    </div>
  </div>
</template>

<script>

import { deepCopy } from "@/lib/common";

export default {
  name: "ZForm",
  props: {
    isAdd: {
      type: Boolean,
      default: true,
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
    //表单配置项
    formColumn: {
      type: Array,
      default: () => []
    },
    //表单验证项
    rules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    model: {
      type: Object,
      default: () => {
        return {}
      }
    },
    config: {
      type: Object,
      default: () => {
        return {
          inline: true
        }
      }
    }
  },
  data () {
    return {
      formParams: {

      },
    }
  },

  methods: {
    querySearch (queryString, cb, index) {
      // 发送请求到后
      let obj = {
        ...this.formColumn[index].queryOrparams,
      };
      obj[this.formColumn[index].searchLable] = queryString;
      this.formColumn[index].remoteMethod({
        ...obj
      }).then(res => {
        let selrec = res.data.records.map(item => {
          return {
            ...item,
            value: item[[this.formColumn[index].searchValue]]
          }
        })
        if (!selrec.length) {
          this.formParams[this.formColumn[index].field] = "";
        }
        cb(selrec)
      })
    },
    selectStyle (item) {
      var _this = this;
      this.$nextTick(function () {
        this.$set(item, 'active', true);
      });
    },
    outStyle (item) {
      this.$set(item, 'active', false);
    },
    //排序校验
    inputFunc (value, e) {
      if (value && value <= 0) {
        this.formParams[e.field] = 1
        return false
      }
      this.formParams[e.field] = window.inputFunc(value, e)
    },
    changeCurrent (value) {
      if (value) {
        this.$nextTick(() => {
          setTimeout(() => {
            document.querySelector('.setmenu').querySelector('.el-scrollbar__wrap').scrollTop = 0
          }, 10);
        })
      }
    },
    // 树形下拉
    handleNodeClick (e, b, c) {
      this.$refs.selectOpen[0].blur()
      this.$emit("opentree", e)
    },
    //
    openLookUp () {
      this.$emit("openLookUp", true)
    },
    submitModal () {
      this.$emit("submitModal", this.formParams)
    },
    selectMenu (e) {
      this.formParams = {
        ...this.formParams,
        parentName: e.name,
        parentId: e.id
      }

    },
    checkForm () {
      let num = 0;
      let field = '';
      this.formColumn.map(item => {
        if (item.hasOwnProperty('rules') && item.rules.required) {
          if (!this.formParams.hasOwnProperty(item.field) || this.formParams[item.field] === '') {
            num++;
            if (num === 1) {
              field = item.label
              return false
            }
          }
        }
      })
      return new Promise((resolve, reject) => {
        if (num === 0) {
          resolve(this.formParams)
        } else {
          this.$message.error(`${field}必填`);
          reject(field)
        }
      })
    },
    //下拉框事件发送
    getSelectValue (value) {
      this.$emit('getSelectVal', value);
    }
  },
  mounted () { },
  created () {
    if (this.isAdd) {
      this.formColumn.map(item => {
        if (item.type === 7) {
          this.$set(this.formParams, item.field, item.default !== undefined ? item.default : true)
        } else {
          this.$set(this.formParams, item.field, this.formParams[item.field] !== undefined ? this.formParams[item.field] : "")
        }
      })
    }
  },
  watch: {
    model: {
      handler (v) {
        this.formParams = v
      },
      immediate: true,
      deep: true
    },
  },

}


</script>

<style scoped>
.form-label-box {
  width: 180px;
  font-weight: 400;
  font-size: 12px;
}
/deep/ .el-input__inner {
  /*width: 150px;*/
}

.el-date-editor {
  width: 150px;
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
::v-deep .el-radio__label {
  font-size: 12px !important;
}
</style>
