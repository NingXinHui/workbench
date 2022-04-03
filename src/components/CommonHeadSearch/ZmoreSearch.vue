<template>
  <div class="">
    <el-form class="innerForm oneForm  "
             :model="formParams"
             ref="queryForm"
             @submit.native.prevent
             :inline="true">
      <div :style="{'display': 'flex','flex-basis': '100%','flex-wrap': '100%','height':height,'justify-content':'space-between'}">
        <div style="display: flex;flex-wrap: wrap;flex-basis: 85%">
          <el-form-item v-for="(item, index) in searchArr"
                        :key="index"
                        :label="(!item.showLabel&&item.showLabel===false)?'':item.label"
                        style="margin-right: 8px"
                        :label-width="item.labelWidth"
                        :required="!!item.required"
                        :title="(!item.showLabel&&item.showLabel===false)?'':item.label"
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
                      :maxlength="item.maxLength || 100" />
            <!--        下拉框-->
            <el-select v-if="item.type == '2'"
                       v-model="formParams[item.value]"
                       :clearable="true"
                       :filterable="true"
                       :disabled="item.disabled"
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
                            :type="item.pickerType?item.pickerType:'daterange'"
                            :value-format="item.valueFormat?item.valueFormat:'yyyy-MM-dd'"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            range-separator="至"
                            align="right"
                            :picker-options="picker(item.pickerType)">
            </el-date-picker>
            <!--多选框-->
            <el-checkbox v-if="item.type=='5'"
                         v-model="formParams[item.value]">
              {{ item.label }}
            </el-checkbox>
            <el-input-number clearable
                             :step="1"
                             step-strictly
                             controls-position="right"
                             v-model="formParams[item.value]"
                             v-if="item.type=='8'"
                             placeholder="请输入"
                             :min="1"
                             :max="999999">
            </el-input-number>
            <!-- 树形下拉选择 25 -->
            <!-- <div class="setmenu fontS"> -->
            <el-select v-if="item.type == '25'"
                       popper-class='setmenu'
                       v-model="formParams[item.value]"
                       clearable
                       :filterable="true"
                       :placeholder="item.placeholder || '请选择' "
                       ref="selectOpen"
                       @clear="item.clear&&item.clear()">
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
        </div>
        <div style="flex: 1;flex-basis: 15%">
          <div style="margin-left: -4px;"
               v-if="showSureButton">
            <div style="display: flex;justify-content: space-between;align-items: center;float: right;">
              <div>
                <el-button type="primary"
                           @click="() => buttonSearch()"> 查询</el-button>
                <!-- <el-button v-if="isPrint"> 打印</el-button> -->
                <el-button v-if="isExport"> 导出</el-button>
                                 <el-popover
                      placement="bottom-end"
                      popper-class="cleardefault"
                      width="80"
                      trigger="click"
                 >
                    <div class="setpopshow" style="width:140px">
                      <div v-for="(item,index) in showpop" :key="index" @click="()=>dosomeout(item)">
                        {{item.report_name}}

                      </div>

                    </div>


                <el-button style="margin-left:4px" slot="reference" v-if="isPrint">打印</el-button>

             </el-popover>


                <template v-if="searchButtonList.length">
                  <el-button v-for="(item, index) in searchButtonList"
                             :key="index"
                             @click="() => otherButton(item.value)">
                    {{ item.label }}
                  </el-button>
                </template>
              </div>
              <div v-show="searchArr.length>5" :class="more?'one':'two'"
                   @click="openMore">
                <!--                <img :src="require('@/assets/images/img.png')" alt="">-->
                <!--                <i style="font-size: 18px;color: #1890ff" @click="openMore" :class="more?'el-icon-caret-top':'el-icon-caret-bottom'"></i>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <slot></slot>
    </el-form>
    <!--    <div v-show="more"-->
    <!--         class="search-more-box">-->
    <!--      <el-form class="innerForm"-->
    <!--               :model="formParams"-->
    <!--               ref="queryForm"-->
    <!--               @submit.native.prevent-->
    <!--               :inline="true">-->
    <!--        <div style="display: flex;flex-basis: 100%;justify-content: space-between">-->
    <!--          <div style="display: flex;flex-basis: 100%;flex-wrap: wrap">-->
    <!--            <el-form-item v-for="(item, index) in searchArr.slice(5)"-->
    <!--                          :key="index"-->
    <!--                          :label="(!item.showLabel&&item.showLabel===false)?'':item.label"-->
    <!--                          style="margin-right: 8px"-->
    <!--                          :label-width="item.labelWidth"-->
    <!--                          :required="!!item.required"-->
    <!--                          :title="(!item.showLabel&&item.showLabel===false)?'':item.label"-->
    <!--                          :prop="item.value">-->
    <!--              &lt;!&ndash;自定义组件&ndash;&gt;-->
    <!--              <div v-if="item.type==6">-->
    <!--                <slot :name="item.value"></slot>-->
    <!--              </div>-->
    <!--              &lt;!&ndash;        普通输入框&ndash;&gt;-->
    <!--              <el-input v-if="item.type == '1'"-->
    <!--                        v-model="formParams[item.value]"-->
    <!--                        :placeholder="item.type==2?'请选择':'请输入'"-->
    <!--                        clearable-->
    <!--                        :type="item.inputType || ''"-->
    <!--                        :maxlength="item.maxLength || 100" />-->
    <!--              &lt;!&ndash;        下拉框&ndash;&gt;-->
    <!--              <el-select v-if="item.type == '2'"-->
    <!--                         v-model="formParams[item.value]"-->
    <!--                         :clearable="true"-->
    <!--                         :filterable="true"-->
    <!--                        :disabled="item.disabled"-->
    <!--                         placeholder="请选择">-->
    <!--                <el-option v-for="itemx in item.selectOption"-->
    <!--                           :key="itemx.id"-->
    <!--                           :label="itemx[item.optionLabel]"-->
    <!--                           :value="itemx[item.optionValue]">-->
    <!--                </el-option>-->
    <!--              </el-select>-->

    <!--              &lt;!&ndash;日期&ndash;&gt;-->
    <!--              <el-date-picker v-if="item.type=='3'"-->
    <!--                              v-model="formParams[item.value]"-->
    <!--                              type="date"-->
    <!--                              placeholder="选择日期时间"-->
    <!--                              align="right"-->
    <!--                              value-format="yyyy-MM-dd"-->
    <!--                              :picker-options="pickerOptions">-->
    <!--              </el-date-picker>-->
    <!--              &lt;!&ndash;日期范围&ndash;&gt;-->
    <!--              <el-date-picker v-if="item.type=='4'"-->
    <!--                              v-model="formParams[item.value]"-->
    <!--                              :type="item.pickerType?item.pickerType:'daterange'"-->
    <!--                              :value-format="item.valueFormat?item.valueFormat:'yyyy-MM-dd'"-->
    <!--                              start-placeholder="开始日期"-->
    <!--                              end-placeholder="结束日期"-->
    <!--                              range-separator="至"-->
    <!--                              align="right"-->
    <!--                              :picker-options="picker(item.pickerType)">-->
    <!--              </el-date-picker>-->
    <!--              &lt;!&ndash;多选框&ndash;&gt;-->
    <!--              <el-checkbox v-if="item.type=='5'"-->
    <!--                           v-model="formParams[item.value]">-->
    <!--                {{ item.label }}-->
    <!--              </el-checkbox>-->
    <!--              <el-input-number clearable-->
    <!--                               :step="1"-->
    <!--                               step-strictly-->
    <!--                               controls-position="right"-->
    <!--                               v-model="formParams[item.value]"-->
    <!--                               v-if="item.type=='8'"-->
    <!--                               placeholder="请输入"-->
    <!--                               :min="1"-->
    <!--                               :max="999999">-->
    <!--              </el-input-number>-->
    <!--              &lt;!&ndash; 树形下拉选择 25 &ndash;&gt;-->
    <!--              &lt;!&ndash; <div class="setmenu fontS"> &ndash;&gt;-->
    <!--              <el-select v-if="item.type == '25'"-->
    <!--                         popper-class='setmenu'-->
    <!--                         v-model="formParams[item.value]"-->
    <!--                         clearable-->
    <!--                         :filterable="true"-->
    <!--                         :placeholder="item.placeholder || '请选择' "-->
    <!--                         ref="selectOpen"-->
    <!--                         @clear="item.clear&&item.clear()">-->
    <!--                <el-option :label="item.optionLabel"-->
    <!--                           :value="item.optionValue">-->
    <!--                  <template>-->
    <!--                    <div>-->
    <!--                      <el-tree :data="item.selectOption"-->
    <!--                               ref="updatetree"-->
    <!--                               :props="item.defaultProps"-->
    <!--                               @node-click="handleNodeClick">-->
    <!--                      </el-tree>-->
    <!--                    </div>-->
    <!--                  </template>-->

    <!--                </el-option>-->
    <!--              </el-select>-->
    <!--              &lt;!&ndash; </div> &ndash;&gt;-->

    <!--            </el-form-item>-->
    <!--          </div>-->
    <!--        </div>-->

    <!--        <slot></slot>-->
    <!--      </el-form>-->

    <!--    </div>-->
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "ZSearch",
  props: {
    formConfig: {
      type: Object,
      default: () => {
        return { size: 'mini' }
      }
    },
    selectRow:{
      type:Object,
      default:()=>{
      return {}
     }
    },

    searchArr: {
      type: Array,
      default: []
    },//是不是编辑   发送过来的数据
    searchButtonList: {
      type: Array,
      default: () => {
        return []
      }
    }, //除搜索以外的按钮
    showSureButton: {
      type: Boolean,
      default: true,
    },
    isPrint: {
      type: Boolean,
      default: true,
    },
    isExport: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      height:'28px',
      showArr: [],
      hiddenArr: [],
      more: false,
      showpop:[],

      formParams: {},
      status: [],
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
        let showtime=(new Date()).valueOf();
    let that=this;
    if(!sessionStorage.getItem('nowtoken')   || (sessionStorage.getItem('nowtoken')&&showtime-sessionStorage.getItem('nowtime')>3500000  )){

       axios.post('/report/reportservice/api/dataportal/token',{grant_type:'password',username:'saas-report',password:'123456'}).then(res=>{

      if(res.status=='200'){
        let time=(new Date()).valueOf();
        sessionStorage.setItem('nowtime',time);

        sessionStorage.setItem('nowtoken',res.data.access_token);
      }

    })


    }

     setTimeout(() => {

       console.log(`Bearer ${sessionStorage.getItem('nowtoken')}`)

      axios.get('/report/reportservice/api/report/list/trade-saas/huansi/order_no',{
         headers: {
            authorization: `Bearer ${sessionStorage.getItem('nowtoken')}`,

         },
      }).then(res=>{

        that.showpop=res.data.data;
      })

    },2000);

    if (this.searchArr.length > 5) {
      this.showArr = this.searchArr.slice(0, 5)
      this.hiddenArr = this.searchArr.slice(5)

    }
  },
  methods: {
        dosomeout(e){

      // 如果是订单的
     if(!this.selectRow.id){
       return this.$message.error('请先选择数据')
     }
      // if(!this.selectRow.billNo ){
      //   return this.$message.error('目前仅支持订单')
      // }
      let url=`http://47.100.246.196/reportservice/api/report/trade-saas/${sessionStorage.getItem('taaaId')}/${e.report_no}?format=pdf&inline=true&billid=${this.selectRow.id}&userid=${localStorage.getItem('userId')}`;
      window.open(url);
    },

    openMore () {
      this.more = !this.more
      if (this.more){
        this.height='unset'
      }else {
        this.height='28px'
      }
      this.$emit('getMore', this.more)
    },

    // 树形下拉
    handleNodeClick (a, b, c) {
      this.$refs.selectOpen[0].blur()
      this.$emit("opentree", a)
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
    otherButton (value) {
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
.cleardefault{
  .setpopshow{
    &>div{
      width: 130px;
      // background: red;
      padding-top: 6px;
      cursor: pointer;
      padding-bottom: 6px;
       overflow: hidden; /*溢出隐藏*/
      text-overflow: ellipsis; /*以省略号...显示*/
      white-space: nowrap;
      &:hover{
        color: #1890ff;
      }
    }

  }

}

.oneForm{
  .el-date-editor{
    height: 26px;
  }
  .el-range__close-icon{
    width: 18px;
  }
  .el-range-separator{
    line-height: 18px;
  }
  overflow: hidden;
  @media ( max-width: 1440px) {
    //width: 1280px;
  }
}

/deep/ .search-more-box {
  .el-form-item {
    margin-top: 8px;
  }
}
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
      width: 180px;
    }
  }

  .el-button {
    padding: 6px 15px;
    height: 26px;
  }

  .el-form-item {
    display: flex;
    margin-bottom: 6px;
    width: 250px;
    .el-form-item__label {
      padding: 0;
      font-weight: 400;
      font-size: 12px;
      width: 65px;
      overflow: hidden; /*溢出隐藏*/
      text-overflow: ellipsis; /*以省略号...显示*/
      white-space: nowrap;
    }
    .el-form-item{
      margin-right: 8px!important;
    }
    .el-form-item__content {
      .el-range__icon,
      .el-range__close-icon {
        //height: 26px;
      }
      .el-input-number {
        width: 100%;
      }
      .el-input__icon {
        height: 26px;
        line-height: 26px;
      }
      margin-left: 4px;
      .el-input__inner {
        :not(.el-date-editor) {
          padding-left: 2px;
        }
      }
      .el-date-editor.el-input__inner {
        margin-right: 0;
      }

      .el-date-editor {
        padding-right: 0;
      }

      .el-date-editor .el-range-input {
        width: 64%;
      }
      .el-date-editor,
      .el-input-number {
        width: 180px !important;
      }
    }
  }
}
</style>
<style scoped>
.el-tree >>> .el-tree-node {
  font-weight: initial;
}

.one {
  background: url("../../assets/images/img.png") no-repeat;
  background-size: 100%;
  width: 44px;
  height: 26px;
  margin-top: 2px;
  cursor: pointer;
  margin-left: 4px;
}
.two {
  background: url("../../assets/images/img_1.png") no-repeat;
  background-size: 100%;
  width: 44px;
  height: 26px;
  margin-top: 2px;
  cursor: pointer;
  margin-left: 4px;
}
.setmenu .el-select-dropdown__item {
  height: 100% !important;
  padding: 0px;
}

</style>

