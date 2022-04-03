<template>
  <div>
    <el-form :model="formParams" ref="queryForm" @submit.native.prevent :inline="true">
      <el-form-item
        v-for="(item, index) in searchArr"
        :key="index"
        :label="item.label"
        style="margin-right: 12px"
      >
      <!-- 如果是核算项目 需要使用这样的 -->
        <el-input
          v-if="item.type == '1' && item.value == 'checkItemId'"
          style="width: 100%"
          ref="clearref"
          :value="objshowlabel[item.value]"
          :placeholder="item.label"
          @keyup.enter.native="buttonSearch"
          @focus="() => InputFocusSome(item)"
          :disabled="item.isdisabled"
          @clear="()=>clearSome()"
           clearable
          :maxlength="item.maxlength"
        />
        <el-input
          v-if="item.type == '1' && item.value != 'checkItemId'"
          :style="item.width? {width:item.width+'px'}:{}"
          v-model="formParams[item.value]"
          :placeholder="item.placeholder?item.placeholder:item.label"
          @keyup.enter.native="buttonSearch"
          clearable
          :maxlength="item.maxLength"
        />
        
          <!-- 多选下拉 -->
          <el-select
            multiple
            collapse-tags
            v-if="item.type == '5'"
            v-model="formParams[item.value]"
            :clearable="true"
            :filterable="true"
            :placeholder="item.placeholder || '请选择' ">
            <el-option
              v-for="itemx in item.selectOption"
              :key="itemx.id"
              :label="itemx[item.optionLabel]"
              :value="itemx[item.optionValue]">
            </el-option>
          </el-select>
        <el-select
          v-if="item.type == '2'"
          v-model="formParams[item.value]"
          :clearable="true"
          :filterable="true"
          :placeholder="item.placeholder || '请选择' "
        >
          <el-option
            v-for="itemx in item.selectOption"
            :key="itemx.id"
            :label="itemx[item.optionLabel]"
            :value="itemx[item.optionValue]"
          >
          </el-option>
        </el-select>


        <el-date-picker
            v-if="item.type=='3'"
            v-model="formParams[item.value]"
            type="date"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
        >
        </el-date-picker>

        

        <el-date-picker
          v-if="item.type=='4'"
          v-model="formParams[item.value]"
          :type="item.pickerType"
          :value-format="item.valueFormat"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :range-separator="item.rangedesc"
          align="right"
          :picker-options="picker(item.pickerType)"
        >
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="() => buttonSearch()"> 查询 </el-button>
      <slot />
    </el-form>
    <modal-look
      v-if="openModalLookUp"
      @closeParent="(value) => closeChild(value)"
    />
  </div>
</template>

<script>
import ModalLook from "@/components/LookUpSome/account.vue";
export default {
  name: "kaka",
  props: ["searchArr"], //是不是编辑   发送过来的数据
  components: { ModalLook },
  data() {
    return {
      formParams: {},
      status: [],

      openValue: "",
      objshowlabel: {},
      openModalLookUp:false,

      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    // 父组件调用 重置子组件的值
    resetForm(value){
      console.log(value);
      console.log(this.formParams);
      this.formParams={...this.formParams,...value}
    },
    setTime(e){
      if (e === null) {
        this.formParams.startDate = ''
        this.formParams.endDate = ''
      } else {
        let [start, end] = e
        this.formParams.startDate = start
        this.formParams.endDate = end
      }
    },
    clearSome(){  
       this.formParams['checkItemId']=undefined;
       this.objshowlabel = {};
    },
    InputFocusSome(value) {
      if (value.value == "checkItemId") {
        this.openValue = value.value;
        this.$refs.clearref && this.$refs.clearref[0].blur();
        this.openModalLookUp = true;
      }
    },
    closeChild(value) {
      if (value) {
        this.formParams[this.openValue] = value.id;
        this.objshowlabel[this.openValue] = value.checkName;
        if (this.openValue == "checkItemId") {
          this.$emit("getChildCheckItemStr", value.id);
        }
      }
      this.openModalLookUp = false;
    },
    buttonSearch() {
      this.$emit("sureSearch", this.formParams);
    },
    //根据时间类型返回快捷选项
    picker(e){
      //时间段选择
      return {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      };
    },
  },
};
</script>

<style  lang="less">
</style>

