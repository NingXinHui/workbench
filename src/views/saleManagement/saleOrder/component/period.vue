<template>
  <!--
@time:2021/12/2
@author:chenqian
-->
  <div>
    <div class="top">
    <div class="top_title">
        <span class="left_title">本单账期</span>
        <span class="mid_title">规则一：</span>
        <span class="right_title"
          >本月1日到本月31日审核通过的出库单单，下月15日生成应付，付款比例100%；账期截止日期2021-12-31。</span
        >
      </div>
      <div class="top_title mt-10">
         <span class="left_title" >本单账期</span>
        <span class="mid_title">规则一：</span>
        <span class="mid_title mr-10">账期截止日期</span>
        <el-date-picker :disabled="disabled"
      v-model="obj.saleAccountPeriodExpiryDate" style="width:150px"
      type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini"
      placeholder="选择日期">
    </el-date-picker>
      </div>
      <div class="mid">
        <el-radio style="margin:8px 0 0 55px" :disabled="disabled" v-model="obj.saleAccountPeriodRule" :label="1"
          ><span class="tip">固定日期+分阶段</span></el-radio
        >
        <div class="detail">
          <div style="margin-left:2px" v-show="item.type==1"
            v-for="(item, key) in obj.periodDateList"
            :key="key"
            class="detail_top "
            :class="{ 'mt-10': key != 0 }"
          >
            <div style="display:flex;flex-warp:warp">
              <el-select class="select" v-model="item.firstMonthType" :disabled="disabled" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                class="input" :disabled="disabled"
                v-model="item.beginDay"  onkeyup="if(!/^[1-9][0-9]{0,10}?$/g.test(this.value)){this.value=''}"
                placeholder=""
              ></el-input>
              <span>日</span>
              <div class="line"></div>
              <el-select class="select" :disabled="disabled" v-model="item.secondMonthType" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                class="input" :disabled="disabled"
                v-model="item.endDay"  onkeyup="if(!/^[1-9][0-9]{0,10}?$/g.test(this.value)){this.value=''}"
                placeholder=""
              ></el-input>
              <span>日,审核通过的入库单,</span>
              <div>
                <div v-for="(r, i) in item.periodDateDetailList" :key="i" :style="{'margin-top':i == 0 ? '0' : '10px'}">
              <div style="text-align:left">
                <el-select class="select" :disabled="disabled" v-model="r.monthType" placeholder="请选择">
                  <el-option
                    v-for="e in options"
                    :key="e.value"
                    :label="e.label"
                    :value="e.value"
                  >
                  </el-option>
                </el-select>
                <el-input class="input" :disabled="disabled" v-model="r.beginDay" placeholder=""
               onkeyup="if(!/^[1-9][0-9]{0,10}?$/g.test(this.value)){this.value=''}"
                ></el-input>
                <span>日,生成应付,付款比例</span>
                <el-input class="input" :disabled="disabled" v-model="r.collectionRate"
                onkeyup="if(!/^[0-9]+([0-9]{0,2})+(.[0-9]{0,2})?$/g.test(this.value)
                ){this.value=''}" @blur="r.collectionRate=='0' ? r.collectionRate=1 : ''"
                 placeholder=""></el-input>
                <span>%；</span>
                    <el-button v-if="i==0"
                type="primary"
                @click="addDetail(key)"
                plain :disabled="disabled"
                class="right_btn"
                size="mini"
                icon="el-icon-plus"
                circle
              ></el-button>
                <el-button
                  plain
                  @click="addTop()" :disabled="disabled"
                  v-if="key == '0'&&i==0"
                  size="mini"
                  class="ml-10"
                  >新增</el-button
                >
                <el-button
                  class="delButton ml-10"
                  v-if="key != '0'&&i==0"
                  @click="delTop(key)" :disabled="disabled"
                  >删除</el-button
                >
                <el-button
                v-if="i!=0"
                  type="primary"
                  plain :disabled="disabled"
                  class="right_btn"
                  @click="delDetail(key, i)"
                  size="mini"
                  icon="el-icon-minus"
                  circle
                  style="margin-right:50px"
                ></el-button>
              </div>
            </div>
              </div>
            </div>

          </div>
        </div>
      </div>
        <div class="top_title mt-20">
        <span class="mid_title" style="margin-left:57px">规则二：</span>
      </div>
      <div class="mid">
        <el-radio style="margin:8px 0 0 55px" :disabled="disabled" v-model="obj.saleAccountPeriodRule" :label="2"
          ><span class="tip">业务节点+分阶段</span></el-radio
        >
        <div class="detail" style="margin-left:180px">
          <div v-for="(r, i) in obj.periodDateList" :key="i" v-show="r.type==2">
            <div>
              <el-select class="select" :disabled="disabled" v-model="r.businessNode" placeholder="请选择">
                <el-option
                  v-for="e in optionsTwo"
                  :key="e.value"
                  :label="e.label"
                  :value="e.value"
                >
                </el-option>
              </el-select>
              <el-input class="input" :disabled="disabled"
              onkeyup="if(!/^[1-9][0-9]{0,10}?$/g.test(this.value)){this.value=''}"
               v-model="r.beginDay" placeholder=""></el-input>
              <span>日,生成应付,付款比例</span>
              <el-input class="input" :disabled="disabled"
               v-model="r.collectionRate" placeholder=""
               onkeyup="if(!/^[0-9]+([0-9]{0,2})+(.[0-9]{0,2})?$/g.test(this.value)
                ){this.value=''}" @blur="r.collectionRate=='0' ? r.collectionRate=1 : ''"
               ></el-input>
              <span>%；</span>
              <el-button
                type="primary" :disabled="disabled"
                v-if="i == 1"
                @click="addbot(i)"
                plain
                class="right_btn"
                size="mini"
                icon="el-icon-plus"
                circle
              ></el-button>
              <el-button
                type="primary"
                v-else
                plain :disabled="disabled"
                class="right_btn"
                @click="delbot(i)"
                size="mini"
                icon="el-icon-minus"
                circle
                style="margin-right:50px"
              ></el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PurchasingOrder",
  props: {
    showType: {
      type: String,
      default: '1'
    },
     selectRow:{
      type:Array,
      default:() => {
        return []
      }
    },
    disabled: {
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      value1: "",
      obj: {
        saleAccountPeriodRule:1,
        saleAccountPeriodExpiryDate:"",
        periodDateList: [{
          firstMonthType:"",
          secondMonthType:"",
          beginDay:"",
          endDay:"",
          type:1,
          periodDateDetailList:[{
            monthType:"",
            collectionRate:"",
            beginDay:""
          }]
        },
          {
          businessNode:"",
          collectionRate:"",
          beginDay:"",
          type:2,
        }]
      },
      options: [{
        label:"本月",
        value:"1"
      },{
        label:"下月",
        value:"2"
      },{
        label:"下下月",
        value:"3"
      }],
      optionsTwo: [{
        label:"发货后",
        value:"1"
      },{
        label:"签收后",
        value:"2"
      },{
        label:"开票后",
        value:"3"
      },{
        label:"提单日期后",
        value:"4"
      }],
    };
  },
  mounted() {
    if(this.selectRow.length) {
      if(this.selectRow[0].type == '1') {
        let arr = this.selectRow.map(item => {
          return {...item, firstMonthType:String(item.firstMonthType),
          secondMonthType:String(item.secondMonthType),
          periodDateDetailList: item.periodDateDetailList.map(i => { return {...i,
           monthType:String(i.monthType),
          }
          })
          }
        })
        this.obj.periodDateList = [...arr,
        {
          businessNode:"",
          collectionRate:"",
          beginDay:"",
          type:2,
        }
        ];
      } else {
          let arr = this.selectRow.map(item => {
          return {...item, businessNode:String(item.businessNode),
          }
        })
        this.obj.saleAccountPeriodRule = '2';
         this.obj.periodDateList = [
           {
          firstMonthType:"",
          secondMonthType:"",
          beginDay:"",
          endDay:"",
          type:1,
          periodDateDetailList:[{
            monthType:"",
            collectionRate:"",
            beginDay:""
          }]
        },
           ...arr,
         ]
      }

    }
  },
  methods: {
    change(val) {
      this.obj.periodDateList = val;
    //    this.obj.saleAccountPeriodRule = Number(this.selectRow.saleAccountPeriodRule);
    // this.obj.saleAccountPeriodExpiryDate = this.selectRow.saleAccountPeriodExpiryDate;
    // let arr = [];
    // this.selectRow.periodDateList.forEach(item => {
    //   if(item.billType == 1) {
    //     arr.push(item)
    //   }
    // })
    // if(arr.length) {
    //   this.obj.periodDateList = arr;
    // }
    },
    //保存账期
    save() {
      this.$emit('setRule',this.obj)
    },
    //规则一添加一条规则
    addTop() {
      let a = {
          firstMonthType:"1",
          secondMonthType:"1",
          beginDay:"1",
          endDay:"1",
          type:1,
          periodDateDetailList:[{
            monthType:"1",
            collectionRate:"1",
            beginDay:"1"
          }]
        };
      this.obj.periodDateList.push(a);
    },
    //给当前规则添加明细规则
    addDetail(key) {
      let a = {
            monthType:"1",
            collectionRate:"1",
            beginDay:"1"
          };
       this.obj.periodDateList[key].periodDateDetailList.push(a);
    },
    //删除明细规则
    delDetail(index, val) {
     this.obj.periodDateList[index].periodDateDetailList.splice(val, 1);
    },
    delTop(index) {
      this.obj.periodDateList.splice(index, 1);
    },
    //规则2添加一条
    addbot() {
      let a =  {
          businessNode:"1",
          collectionRate:"1",
          beginDay:"1",
          type:2,
        };
     this.obj.periodDateList.push(a);
    },
    delbot(i) {
      this.obj.periodDateList.splice(i, 1);
    }
  }
};
</script>
<style lang="less" scoped>
.top_title {
  color: #374256;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Medium;
}
.left_title {
  font-weight: 500;
}
.mid_title {
  margin-left: 8px;
}
.right_title {
  margin-left: 8px;
}
.tip {
  width: 109px;
  height: 26px;
  display: inline-block;
  line-height: 26px;
  background: #0066ff;
  border-radius: 3px;
  font-size: 12px;
  font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
}
.mid {
  display: flex;
  .detail {
    margin-left: 24px;
    margin-top: 8px;
    .select {
      width: 96px;
    }
    .input {
      width: 68px;
      margin-left: 8px;
    }
    span {
      margin-left: 4px;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      color: #374256;
      margin-top: 5px;
    }
    .line {
      width: 48px;
      height: 1px;
      background: #e6e6e6;
      margin: 13px 12px 0 12px;
    }
    .right_btn {
      width: 14px;
      min-width: 14px;
      min-height: 14px;
      text-align: center;
      line-height: 14px;
      padding: 0;
      height: 14px;
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
</style>
