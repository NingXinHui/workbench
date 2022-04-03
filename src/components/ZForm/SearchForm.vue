
<template>
  <div>
    <div>
      <el-dialog
          title="高级查询"
          :visible="visible"
          width="800px"
          @close="cancel"
      >
        <el-tabs v-model="activeName" style="font-size: 12px" @tab-click="tabClick">
          <el-tab-pane label="标准查询" name="first">
            <el-form ref="searchForm"
                     class="firstSearch"
                     style="display: flex;
                     flex-wrap: wrap"
                     :inline="config.inline"
                     :model="formParams"
                     :size="config.size"
                     :label-width="config.labelWidth?config.labelWidth:'80px'"
                     :label-position="config.labelPosition?config.labelPosition:'right'">
              <el-form-item v-for="(item,index)  in formColumn"
                            :key="index"
                            :label="item.label"
                            >
                <el-input
                    :readonly="!!item.read"
                    :disabled="!!item.disabled"
                    v-if="item.type===1"
                    v-model="formParams[item.field]"
                    :placeholder="item.placeholder?item.placeholder:item.label"
                    clearable
                    :maxlength="item.maxLength||10"
                />
                <el-select
                    v-if="item.type===2"
                    v-model="formParams[item.field]"
                    :clearable="true"
                    :multiple="item.multiple"
                    :filterable="true"
                    placeholder="请选择"
                >
                  <el-option
                      v-for="(item2,index2) in item.optionList"
                      :key="index2"
                      :label="item2['title']"
                      :value="item2['value']"
                  >
                  </el-option>

                </el-select>
                <el-date-picker
                    v-if="item.type===3"
                    v-model="formParams[item.field]"
                    :type="item.pickerType?item.pickerType:'date'"
                    placeholder="选择日期时间"
                    align="right"
                    :start-placeholder="item.startText?item.startText:'开始时间'"
                    :end-placeholder="item.endText?item.endText:'结束时间'"
                    :value-format="item.valueFormat?item.valueFormat:'yyyy-MM-dd'"
                    :range-separator="item.rangeText?item.rangeText:'-'"
                >
                </el-date-picker>
                <el-input
                    v-if="item.type===4"
                    maxlength="50"
                    show-word-limit
                    type="textarea"
                    :rows="2"
                    autosize
                    placeholder="请输入内容"
                    v-model="formParams[item.field]"
                >
                </el-input>
              </el-form-item>
              <slot name="btn">
              </slot>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="高级查询" name="second">
            <el-container style="height: 300px">
              <el-aside class="advance-left">
                <el-header class="advance-left-header-header-title">
                  <span class="header">方案</span>
                  <span>
                  <i class="el-icon-edit resetIcon" @click="editPlan"></i>
                  <i class="el-icon-delete resetIcon" @click="delPlan" style="margin-left: 4px"></i>
                </span>
                </el-header>
                <el-main class="advance-left-content" style="padding: 0;text-align: center">
                    <div
                        :class="{'plan-active':checked.id===item.id}"
                        @click="reloadDetail(item)"
                        style="font-size: 12px;cursor: pointer"
                        v-for="(item,index) in plan"
                        :key="index" >
                      {{ item.schemeName }}
                    </div>

<!--                  <el-radio-group v-model="checked" size="mini" @change="reloadDetail">-->
<!--                    <el-radio-button v-for="(item,index) in plan" :label="item" :key="index" class="advance-left-item">-->
<!--                      {{ item.schemeName }}-->
<!--                    </el-radio-button>-->
<!--                  </el-radio-group>-->

                </el-main>

              </el-aside>
              <el-container
                  style="overflow: hidden;margin-left: 10px;border: 1px solid #ebebeb;border-radius: 0px 0px 3px 3px;">
                <el-header class="advance-left-header-header-title">
                  <span class="header">条件</span>
                  <span>
                  <i class="el-icon-plus resetIcon" @click="addItem"></i>
                  <i class="el-icon-delete resetIcon" @click="delItem" style="margin-left: 4px"></i>
                </span>
                </el-header>
                <el-main class="advance-left-content" style="overflow: hidden">
                  <div class="advance-left-content" style="overflow-y: scroll;padding: 0">
                    <common-table
                        is-selection
                        ref="itemTable"
                        :set-height="266"
                        :is-border="false"
                        :isMain="true"
                        :tableColumn="tableColumn"
                        :isHeight="true"
                        :table-data="tableData"
                        @selePage="handleSelect"
                        @selectChange="selectChange"
                        :is-edit="isEdit"
                    />
                  </div>
                </el-main>

                <div class="save" @click="savePlan">
                  保存为查询方案
                </div>
              </el-container>
            </el-container>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <div>
            <div style="display: flex;align-items: center" v-if="activeName==='first'">
              <label class="el-form-item__label " style="font-size: 12px">查询模式</label>
              <div class="">
                <el-select v-model="model.model" size="mini" >
                  <el-option value="1">精确</el-option>
                  <el-option value="2">模糊</el-option>
                  <el-option value="3">左匹配</el-option>
                  <el-option value="4">组合</el-option>
                </el-select>
              </div>
            </div>

          </div>
          <div style="flex: 1">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" v-if="activeName==='first'" @click="clearSearch">清空
            </el-button>
            <el-button size="mini" type="primary" @click="doSearch">查询</el-button>
          </div>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import commonTable from '@/components/CommonTable/commonTable'
import {deepCopy} from "@/lib/common";
import {planAdd, planDel, planEdit, planList, planSearch, querySelector} from "@/api/system/config";

export default {
  name: "SearchForm",
  components: {
    commonTable
  },
  props: {

    queryComponentId:{
      type:String|Number,
      default:''
    },
    //表单配置项
    // formColumn: {//
    //   type: Array,
    //   default: () => []
    // },
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
          inline:true,
          size:'mini',
          model:{},
          labelWidth:'80px',
          labelPosition:'right'
        }
      }
    },
    extraParams: {
      type: Object,
      default: () => {
        return {

        }
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  data() {
    return {
      //是否是编辑方案名称
      isEditName:false,
      //存储每条方案最初的查询数据列表
      initList:[],
      //是否进入明细编辑状态
      isEdit: false,
      //当前选中的方案项
      checked: {},
      //上方tab ，区分标准查询与高级查询tab
      activeName: 'first',
      //表单数据初始项
      formParams: this.model,
      //方案明细表头项
      tableColumn: [
        {
          prop: 'concat',
          label: '链接',
          size: 'mini',
          editConfig: {
            type: 2,
            optionList: [
              {
                label: '并且',
                value: 'and'
              },   {
                label: '或者',
                value: 'or'
              },
            ],
            optionLabel: 'label',
            optionValue: 'value',
          }
        },
        {
          editConfig:{},
          prop: 'fieldName',
          label: '名称',
          size: 'mini',
        },
        {
          prop: 'queryRole',
          label: '关系',
          size: 'mini',
          editConfig: {
            type: 2,
            optionList: [
              {
                label: '等于',
                value: 'eq'
              },   {
                label: '不等于',
                value: 'ne'
              }, {
                label: '大于',
                value: 'gt'
              },{
                label: '大于或等于',
                value: 'ge'
              }, {
                label: '小于',
                value: 'lt'
              }, {
                label: '小于或等于',
                value: 'le'
              }, {
                label: '包含',
                value: 'like'
              }, {
                label: '不包含',
                value: 'not_like'
              }, {
                label: '为空',
                value: 'is_null'
              }, {
                label: '不为空',
                value: 'is_not_null'
              }, {
                label: '在内',
                value: 'in'
              }, {
                label: '左匹配',
                value: 'left_like'
              }, {
                label: '右匹配',
                value: 'right_like'
              }
            ],
            optionLabel: 'label',
            optionValue: 'value',
          }

        },
        {
          width:'150',
          prop: 'inputValue',
          label: '数值',
          size: 'mini'
        }
      ],
      //方案明细数据
      tableData:[],
      //方案数据列表
      plan:[],
      //方案明细数据选中项
      selectRow:[],
      //方案明细表格内编辑表单配置项
      formColumn:[]
    }
  },

  methods: {
    //关闭弹窗
    cancel(){
      this.$emit('update:visible',false)
    },
    //捕获方案详情，下拉项变化
    selectChange(e,i){
      if (i.prop==='fieldName'){
        console.log(i)
        e.row.fieldValue=null
        e.row.func=this.formColumn.find(item => item.field === e.row.fieldName)
      }
    },

    //方案详情-添加
    addItem() {
      //关闭提示
      this.isEdit = true
      //添加表列
      this.tableData=[...this.tableData,{isEdit:true,id:Math.random()}]
    },
    //方案详情-删除
    delItem() {
      if (!this.selectRow.length){
        this.$message.warning('请选择数据后操作')
        return
      }
      this.selectRow.map(item=>{
        this.$refs.itemTable.$refs.multipleTable.toggleRowSelection(item,false)
        this.tableData.splice(this.tableData.findIndex(item2=>item2.id===item.id),1)
      })

      //取消选中
      //执行删除
    //
    },
    //获取选中的方案详情
    handleSelect(e) {
     this.selectRow=e
    },
    //编辑方案名称
    editPlan(e) {
      this.isEditName=true
      this.$prompt('请输入名称', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.checked.schemeName
      }).then(({ value }) => {
        let params={}
        params.queryComponentId=this.queryComponentId
        params.schemeName=value
        params.queryConditions=this.initList
        params.id=this.checked.id
        planEdit(params).then(res=>{
          this.$message.success('编辑成功')
          this.checked.schemeName=value
          this.isEditName=false
        })

      }).catch(() => {

      });
    },
    delPlan(e){
      planDel({id:this.checked.id}).then(res=>{
        this.$message.success('删除成功')
        this.plan.splice(this.plan.findIndex(item=>item.id===this.checked.id),1)
        this.$refs.itemTable.$refs.multipleTable.clearSelection()
        this.tableData=[]
      })

    },
    //切换方案，重新渲染右侧列表
    reloadDetail(e) {
      this.checked=e
      this.initList=deepCopy(this.checked.queryConditions)
      this.checked.queryConditions&&this.checked.queryConditions.map(item=>{
        item.id=Math.random()
        item.isEdit=true
        item.func=this.formColumn.find(item2 => item2.field === item.fieldName)
        item.fieldValue=item.fieldValue
      })
      this.tableData = deepCopy(this.checked.queryConditions)??[]
      this.$refs.itemTable.$refs.multipleTable.clearSelection()
    },
    //  保存方案
    savePlan(){
      this.$prompt('请输入名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.checked.schemeName,
        inputValidator:(value)=>{
          if (value===null){
            return '名称不能为空'
          }
        },
      }).then(({ value }) => {
        let params={}
        params.queryComponentId=this.queryComponentId
        params.schemeName=value
        let list=deepCopy(this.tableData)
        list.map(item=>{
          delete item.func
          delete item.id
          delete item.isEdit
        })
        params.queryConditions=list
        if (value===this.checked.schemeName){
          params.id=this.checked.id
          planEdit(params).then(res=>{
            if (res.success){
              this.$message.success('编辑成功')
              this.getPlanList()
            }
          }).catch(e=>{
            // this.$message.error(e.msg)
          })

        }else {
          planAdd(params).then(res=>{
            this.$message.success('添加成功')
            this.getPlanList()
          })

        }

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    //点击清空按钮
    clearSearch(){
      // this.$refs.searchForm.resetFields()
      this.formParams={}
      this.model.model=''
    },
    //执行查询
    doSearch(){
      let params={}
      params.id=this.queryComponentId
      if (this.activeName==='first'){
        params.queryConditions=[]
        let e=deepCopy(this.model)
        for (const eKey in e) {

          let obj={}
          if (e[eKey].length){
            if (e[eKey]!==''){
              e[eKey]=e[eKey].toString()
            }
          }else {
            continue
          }
          obj.fieldName=eKey
          obj.concat='and'
          obj.queryRole='eq'
          obj.fieldValue=e[eKey]
          params.queryConditions.push(obj)
        }
      }else {
        params.queryConditions=deepCopy(this.tableData)
        params.queryConditions.map(item=>{
          let e=item.fieldValue
          if (e.length){
            item.fieldValue=e.toString()
          }
          delete item.func
          delete item.id
          delete item.isEdit
        })
      }
      Object.assign(params,this.extraParams)
      planSearch(params).then(res=>{
        this.$emit('confirm',res)
      })
     this.cancel()
    },

    //切换标准查询->高级查询
    tabClick(){
      this.genTableForm()
      this.getPlanList()
    },
    genTableForm(){
      let obj={}
      obj.optionList=[]
      this.formColumn.map(item=>{
        obj.optionList.push({label:item.label,value:item.field})
      })
      obj.optionLabel='label'
      obj.optionValue='value'
      obj.type=2
      this.tableColumn[1].editConfig=Object.assign(this.tableColumn[1].editConfig,obj)
    },
    getPlanList(){
      planList({queryComponentId:this.queryComponentId}).then(res=>{
        this.plan=res.data
      })
    },
    query(){
      querySelector({id:this.queryComponentId}).then(res=>{
        res.data.queryConfigList.map(item=>{
          if (item.controlType===0){
            item.type=1
          }else if (item.controlType===2||item.controlType===3){
            item.type=2
            if (item.controlType===3){
              item.multiple=true
            }
          }else if(item.controlType===1) {
            item.type=3
          }
          item.field=item.fieldName
          item.label=item.title
          if (item.type===2){
            item.optionLabel='title'
            item.optionValue='value'
          }else {
            delete item.optionList
          }
          delete item.controlType
          delete item.fieldName
          delete item.title
        })
        this.formColumn=res.data.queryConfigList
      })
    },
  },
  mounted() {

  },
  watch: {
    'queryComponentId':{
      handler(val){
        if (val){
          // this.query()
        }
      },
      immediate:true
    }
  },

}
</script>

<style scoped>
.firstSearch /deep/ .el-input__inner {
  /*width: 200px;*/
}

/deep/ .el-form-item__label {
  font-size: 12px;
  padding: 0 8px 0 0;
  margin-right: unset;

}

/deep/ .el-form-item {
  /*flex-basis: 48%;*/

}

.resetIcon {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.advance-left {
  height: 270px;
  width: 124px !important;
  border: 1px solid #ebebeb;
  border-radius: 0 0 3px 3px;
  overflow: scroll;
  padding: unset;
  background: #FFFFFF;
}

.advance-left-header-header-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 26px !important;
  padding: 3px 8px !important;
  background: #f5f7fa !important;
  border-radius: 3px 3px 0px 0px !important;
  position: sticky;
  top: 0;
  z-index: 10;
  font-size: 12px;
}

.advance-left-content {
  padding: 4px 8px 0 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.advance-left-item {
  margin-top: 6px;
}

.save {
  position: sticky;
  bottom: 0;
  z-index: 89;
  height: 26px;
  text-align: center;
  line-height: 26px;
  color: #2367FA;
  background: #f5f7fa;
  border-top: 1px solid #ebebeb;
  cursor: pointer;
}

/deep/ .el-dialog__footer {
  position: sticky;
  border-top: 1px solid #F5F5F5;
  box-shadow: 0 -5px 10px 0 #f1f1f1;

}

.dialog-footer {
  display: flex;
  align-items: center;
  height: 40px;
}

/deep/ .first .el-dialog__body {
  padding: 10px 20px;
  height: 400px;
  overflow: hidden;
}

/deep/ .el-dialog__header {
  background: #F5F5F5;
}

/deep/ .el-tabs__item {
  font-size: 12px;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
  border-radius: unset;
  border: none;
}

/deep/ .el-radio-button__inner {
  border: none;
}

/deep/ .el-table__header-wrapper {
  position: sticky;
  top: 0;
}
.plan-active{
  background: #1890ff;
  color: #fff;
}
</style>
