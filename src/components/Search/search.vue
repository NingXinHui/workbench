<template>
  <div id="search">
    <el-dialog
      title="高级查询"
      :visible.sync="show"
      width='695px'
    >

      <!--      查询表单-->
      <div>
        <el-tabs tab-position="top">
          <el-tab-pane label="标准查询">
            <!--     按钮组-->
            <!-- <div>
              <el-button-group>
                <el-button size="mini" plain icon="el-icon-search">查询</el-button>
                <el-button size="mini" plain>清空</el-button>
                <el-button size="mini" plain>取消</el-button>
              </el-button-group>
            </div> -->
            <div style="margin-top: 10px">
              <el-form size="small" :inline="true" :model="formInline" label-width="120px" label-position="right" class="demo-form-inline">
                <el-form-item label="01.应收单号">
                  <el-input v-model="formInline.user" placeholder="应收单号"></el-input>
                </el-form-item>
                <el-form-item label="02.核算项目名称">
                  <el-input v-model="formInline.user" placeholder="核算项目名称"></el-input>
                </el-form-item>
                <el-form-item label="03.币种名称">
                  <el-input v-model="formInline.user" placeholder="币种名称"></el-input>
                </el-form-item>
                <el-form-item label="04.核算类型">
                  <el-input v-model="formInline.user" placeholder="核算类型"></el-input>
                </el-form-item>
                <el-form-item label="05.应付类型">
                  <el-input v-model="formInline.user" placeholder="应付类型"></el-input>
                </el-form-item>
                <el-form-item label="06.核算项目编码">
                  <el-input v-model="formInline.user" placeholder="核算项目编码"></el-input>
                </el-form-item>
                <el-form-item label="07.发票码">
                  <el-input v-model="formInline.user" placeholder="发票码"></el-input>
                </el-form-item>
                <el-form-item label="08.红/蓝字">
                  <el-input v-model="formInline.user" placeholder="红/蓝字"></el-input>
                </el-form-item>
                <el-form-item label="09.订单号:">
                  <el-input v-model="formInline.user" placeholder="订单号"></el-input>
                </el-form-item>
                <el-form-item label="10.创建人:">
                  <el-input v-model="formInline.user" placeholder="创建人"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="高级查询">
            <el-row :gutter="20" >
              <el-col :span="8">
                <div class="grid-content bg-purple" style="height: 18px;">
                  <el-button-group>
                    <span class="fanAn">方案</span>
                    <el-button icon="el-icon-edit" class="edit-icon" @click="saveProgram"></el-button>
                    <el-button icon="el-icon-delete" class="delete-icon"></el-button>
                  </el-button-group>
                </div>
                <div class="bg-changP">
                  <ul class="left-box" style="padding: 0">
                    <el-radio-group v-model="checked">
                      <el-radio :label="1">产品方案1</el-radio>
                      <el-radio :label="2">产品方案2</el-radio>
                      <el-radio :label="3">产品方案3</el-radio>
                    </el-radio-group>
                  </ul>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <el-button-group class="bgright">
                    <!-- <el-button size="mini" plain @click="addColumn" icon="el-icon-circle-plus-outline">添加</el-button> -->
                    <i class="el-icon-plus tuPian" @click="addColumn"></i>
                    <i class="el-icon-delete tuPian"></i>
                    <!-- <el-button size="mini" plain @click="" icon="el-icon-delete">删除</el-button> -->
                    <!-- <el-button size="mini" plain icon="el-icon-search">查询</el-button>
                    <el-button size="mini" plain icon="el-icon-circle-close" @click="close">取消</el-button> -->
                  </el-button-group>
                  <div >
                    <el-table
                        border
                      v-loading="loading"
                      ref="multipleTable"
                      :data="tableData"
                      tooltip-effect="dark"
                      style="width: 100%"
                      size="mini"
                      height="250"
                      @selection-change="handleChange"
                    >
                      <el-table-column
                        type="selection"
                        width="55"
                      >
                      </el-table-column>
                      <el-table-column
                        label="连接"
                        width="120"
                      >
                        <template slot-scope="scope">
                          <el-select v-model="value" placeholder="请选择" size="mini" >
                            <el-option
                              v-for="(item,index) in field.link"
                              :key="index"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="名称"
                        width="120"
                        show-overflow-tooltip
                      >
                      </el-table-column>
                      <el-table-column
                        prop="address"
                        label="关系"
                        show-overflow-tooltip
                      >
                      </el-table-column>
                      <el-table-column
                        prop="address"
                        label="数值"
                        show-overflow-tooltip
                      >
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button @click="close" type="primary">清 空</el-button>
        <el-button @click="close" type="primary">查 询</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import field from './field'
export default {
  name: 'search',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checked:false,
      loading:false,
      value:1,
      field,
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: [],
      formInline: {},
      actionObj:[]
    }
  },
  computed: {
    show: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.$emit('closeDialog')
      }
    }
  },
  methods: {
    close() {
      this.$emit('closeDialog')
    },
    //添加
    addColumn(){
      this.tableData.push( {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      })
    },
    handleChange(e){
      this.actionObj=e
    },
    //保存方案
    saveProgram(){
      this.$prompt('请输入方案名称', '保存方案', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的方案是: ' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    }
  }
}
</script>

<style scoped>

.left-box li {
  height: 40px;
  line-height: 40px;
}
</style>
<style lang="less">
#search{
  .el-message-box .el-message-box__header{
    padding: 8px;
    .el-message-box__title{
      font-size: 12px;
      font-weight: bold;
    }
    .el-message-box__headerbtn{
      top: 6px;
      right: 6px;
    }
  }

  .el-message-box__content{
    padding: 0px 15px;
    font-size: 12px;
    .el-message-box__input {
      padding-top: 5px;
      .el-input--medium .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .el-dialog__header{
    padding: 2px 8px;
    padding-bottom: 10px;
    height: 26px;
    font-weight: bold;
    background: #f5f5f5;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .el-dialog__headerbtn{
      top: 6px;
      right: 8px;
    }
  }
  .fanAn{
    position: absolute;
    left: 20px;
    font-weight: bold;
    top: 7px;
  }
  .edit-icon{
    background: #F5F7FA;
    position: relative;
    left: 66px;
    border: none;
    top: 3px;
  }
  .delete-icon{
    background: #F5F7FA;
    position: relative;
    left: 63px;
    border: none;
    top: 3px;
  }
  .el-dialog__footer{
    padding: 15px 20px;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0px -5px 10px 0px #f1f1f1;
    position: fixed;
    bottom: auto;
    width: 695px;
    background: #fff;
  }
  .el-dialog__body{
    padding: 0px 20px 30px 20px;
  }
  .el-tabs__content{
    height: 330px;
    // overflow: auto;
  }
  .el-col-8{
    padding-left: 0px!important;
    padding-right: 0px!important;
    border: 1px solid #ebebeb;
    border-radius: 0px 0px 3px 3px;
    height: 282px;
    width: 126px;
    margin-left: 10px;
    background: #F5F7FA;
  }
  .bg-changP{
    background: #fff;
    height: 250px;
  }
  .el-radio{
    padding: 12px 20px 0px 20px;
  }
  .bgright{
    background: #F5F7FA;
    width: 100%;
    border-top: 1px solid #EBEBEB;
    border-left: 1px solid #EBEBEB;
    border-right: 1px solid #EBEBEB;
    text-align: right;
    padding: 8px;
  }
  .bg-purple{
    width: 519px;
  }
  .tuPian{
    padding-left: 10px;
    font-size: 15px;
  }
 .el-table__header-wrapper th, .el-table__fixed-header-wrapper th{
  background: #fff;
  border-right: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
 }
 .el-button--small{
  padding: 6px 13px;
 }
}

</style>

