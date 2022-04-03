<template>
  <div>
    <el-form class="innerForm"
             :size="formConfig.size"
             :model="formParams"
             ref="queryForm"
             @submit.native.prevent :class="{'showWidth': !showwidth}"
             :inline="true">
      <el-form-item v-for="(item, index) in searchArr"
                    :key="index"
                    :label="(!item.showLabel&&item.showLabel===false)?'':item.label"
                    style="margin-right: 8px"
                    :required="!!item.required" :class="{'dataWdith': item.type == '4' ? true : false}"
                    :prop="item.value">
        <!--自定义组件-->
        <div v-if="item.type==6">
          <slot :name="item.value"></slot>
        </div>
        <!--        普通输入框-->
        <el-input v-if="item.type == '1'"
                  v-model="formParams[item.value]"
                  :placeholder="item.type==2?'请选择':'请输入'"
                  clearable
                  :type="item.inputType || ''"
                  :maxlength="item.maxLength || 40" />
        <!--        下拉框-->
        <el-select v-if="item.type == '2'"
                   v-model="formParams[item.value]"
                   :clearable="true"
                   :filterable="true"
                   placeholder="请选择">
          <el-option v-for="itemx in item.selectOption"
                     :key="itemx.id"
                     :label="itemx[item.optionLabel]"
                     :value="itemx[item.optionValue]">
          </el-option>
        </el-select>

        <!--日期-->
        <el-date-picker v-if="item.type=='3'"
                        v-model="formParams[item.value]"
                        type="date"
                        placeholder="选择日期时间"
                        align="right"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
        </el-date-picker>
        <!--日期范围-->
        <el-date-picker v-if="item.type=='4'"
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
        <el-checkbox v-if="item.type=='5'"
                     v-model="formParams[item.value]">
          {{ item.label}}
        </el-checkbox>
         <!-- 树形下拉选择 25 -->
          <!-- <div class="setmenu fontS"> -->
            <el-select
              v-if="item.type == '25'"
              popper-class='setmenu'
              v-model="formParams[item.value]"
              clearable
              :filterable="true"
              :placeholder="item.placeholder || '请选择' "
              ref="selectOpen"
              @clear="item.clear&&item.clear()"
            >
              <el-option
                :label="item.optionLabel"
                :value="item.optionValue"
              >
                <template>
                  <div>
                  <el-tree
                    :data="item.selectOption"
                    ref="updatetree"
                    :props="item.defaultProps"
                    @node-click="handleNodeClick"

                  >
                  </el-tree>
                </div>
                </template>


              </el-option>
            </el-select>
          <!-- </div> -->

      </el-form-item>
      <el-form-item class="right_btn" style="margin-left: -4px;" v-if="showSureButton">
      <div style="margin-right:auto">
        <el-button type="primary" @click="() => buttonSearch()"> 查询</el-button>
        <template v-if="searchButtonList.length">
        <el-button  v-for="(item, index) in searchButtonList" :key="index" @click="() => otherButton(item.value)">{{item.label}}</el-button>
        </template></div>
       <div>
        <el-button v-if="showwidth" @click="overflowHeight"><i class="el-icon-arrow-up colorblue"></i></el-button>
        <el-button v-else  @click="overflowHeight"><i class="el-icon-arrow-down colorblue"></i></el-button></div>
      </el-form-item>
      <slot></slot>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ZSearch",
  props: {
    formConfig: {
      type: Object,
      default: () => {
        return { size: 'mini' }
      }
    },
    searchArr: {
      type: Array,
      default: []
    },//是不是编辑   发送过来的数据
    searchButtonList: {
      type: Array,
      default: () => { return []}
    }, //除搜索以外的按钮
    showSureButton: {
      type: Boolean,
      default: true,
    }
  },
  data () {
    return {
      formParams: {},
      status: [],
      showwidth: true,
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick (picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };

  },
  mounted () {
  },
  methods: {
    // 树形下拉
    handleNodeClick(a,b,c){
      this.$emit("opentree",a)
    },
    overflowHeight() {
      this.showwidth = !this.showwidth;
    },
    // 父组件调用 重置子组件的值
    resetForm (value) {
      this.formParams = { ...this.formParams, ...value }
    },
    setTime (e) {
      if (e === null) {
        this.formParams.startDate = ''
        this.formParams.endDate = ''
      } else {
        let [start, end] = e
        this.formParams.startDate = start
        this.formParams.endDate = end
      }
    },
    buttonSearch () {
      this.$emit("sureSearch", this.formParams);
    },
    otherButton(value) {
      this.$emit("otherButtonSearch", value);
    },
    //根据时间类型返回快捷选项
    picker (e) {
      //时间段选择
      return {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }


  },
};
</script>

<style lang="less" scoped>
/deep/ .el-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
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
  width: 16.6%;
    display: flex;
    margin-bottom: 0;
    .el-form-item__label {
      padding: 0;
      font-weight: 400;
      width: 80px !important;
      font-size: 12px;
      white-space: nowrap;
      text-align: right;
    }
    .el-form-item__content {
    width: 100%;
      margin-left: 4px;
      .el-input__inner{
        padding-left: 4px;
        width: 100%;
      }
       .el-select {
      width: 100%;
      }
    }
    .el-date-editor--date {
    width: 100%;
    .el-input__inner {
    padding-left: 25px;
    }
    }
  }
  .dataWdith {
   width: 30%;
   margin-top: 4px;
   .el-form-item__label {
      padding: 0;
      font-weight: 400;
      width: 65px !important;
      font-size: 12px;
      text-align: right;
    }
    .el-form-item__content {
    width:90%;
      margin-left: 4px;
      .el-input__inner{
        padding-left: 4px;
        width: 100%;
      }
    }
  }
  .right_btn {
  width: 15%;
  text-align: left;
  position: absolute;
  left: 85%;
  top: 0;
  .el-form-item__content {
   display: flex;
   justify-content: flex-end;
    }
  }
}
.showWidth {
transition: all 0.5s ease;
height: 30px;
}
</style>
<style scoped>
.el-tree >>>.el-tree-node{
    font-weight: initial;
  }
  .setmenu .el-select-dropdown__item{
    height: 100% !important;
    padding: 0px;
  }
  .colorblue {
   color: #0066FF;
  }
</style>

