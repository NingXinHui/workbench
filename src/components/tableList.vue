<template>
  <div class="table-list">
    <div class="search" v-if="searchList">
      <div class="search-list">
        <div
          class="search-item"
          v-for="(seachItem, searchIndex) in searchList"
          :key="searchIndex"
        >
          <div class="search-text">{{ seachItem.name }}:</div>
          <el-input
            size="small"
            clearable
            v-if="seachItem.type === 'text'"
            v-model="seachItem.value"
            :placeholder="'请输入' + seachItem.name"
            style="width: 140px"
          ></el-input>
          <el-select
            size="small"
            clearable
            v-if="seachItem.type === 'select'"
            v-model="seachItem.value"
            :placeholder="'请选择' + seachItem.name"
            style="width: 140px"
          >
            <el-option
              v-for="(selectItem, selectIndex) in seachItem.options"
              :key="selectIndex"
              :label="selectItem.name"
              :value="selectItem.value"
            ></el-option>
          </el-select>
          <el-date-picker
            v-if="seachItem.type === 'time'"
            v-model="seachItem.value"
            size="small"
            type="date"
            format="YYYY-MM-DD"
            style="width: 140px"
            placeholder="选择日期">

          </el-date-picker>
          <el-date-picker
            v-if="seachItem.type === 'year'"
            v-model="seachItem.value"
            type="year"
            style="width: 140px"
            size="small"
            placeholder="选择年">
          </el-date-picker>
        </div>
      </div>

      <div class="search-btn" v-if="seniorSearch">
        <el-button class="normal-button" type="primary" size="small" @click="searchForm">查询</el-button>
        <el-button class="senior-button" size="small" @click="seniorBtn">高级检索</el-button>
      </div>
      <div class="search-reset" v-else>
        <el-button size="small" type="primary" style="min-width: 80px" @click="searchForm">搜索</el-button>
        <el-button size="small" style="width: 80px" @click="searchReset">重置</el-button>
      </div>
    </div>
    <div class="table">
      <div class="btns">
        <div class="tbas-temp" v-if="tabsList">
          <div
            class="tabs-item"
            v-for="(tabsItem, tabsIndex) in tabsList"
            :key="tabsIndex"
            :class="tabsItem.activeFlag ? 'tabs-active':''"
            @click="changeTabs(tabsItem)"
          >
            <span class="span-name">{{tabsItem.name}}</span>
            <span class="span-value" :class="tabsItem.activeFlag ? 'active-txt':'txt'">{{ tabsItem.value }}</span>
            <span class="span-title" v-if="tabsIndex < tabsList.length - 1">|</span>
          </div>
        </div>
        <div class="table-btns" v-if="tableBtns">
          <div
            v-for="(btnsItem, btnsIndex) in tableBtns"
            :key="btnsIndex"
            class="btns-item"
          >
            <el-button
              style="min-width: 84px;height: 34px"
              :plain="btnsItem.plain"
              size="small"
              :type="btnsItem.type"
              @click="tableBtn(btnsItem)"
              :icon="btnsItem.iconName"
            >{{ btnsItem.name }}</el-button>
          </div>
        </div>
      </div>

      <div class="table-data">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          style="width: 100%"
          stripe
          @selection-change="tableSelectionChange"
          :row-style="{height:'36px'}"
        >

          <template v-for="(headItem, headIndex) in tableHead" >
            <el-table-column :key="headIndex" v-if="headItem.selection" type="selection" width="80" align="center">
            </el-table-column>
            <el-table-column
            :key="headIndex"
              v-if="headItem.type === 'text'"
              :prop="headItem.solt"
              :label="headItem.name"
              align="center"
              :sortable="headItem.sortable"
            ></el-table-column>
            <el-table-column
            :key="headIndex"
              v-if="headItem.type === 'img'"
              :label="headItem.name"
              :prop="headItem.solt"
              align="center"
              width="140"
            >
              <template v-slot="scope">
                <el-image
                  class="table-td-thumb"
                  :src="scope.row.imgPath"
                  :preview-src-list="[scope.row.imgPath]"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
            :key="headIndex"
              v-if="headItem.type === 'list'"
              :label="headItem.name"
              :prop="headItem.solt"
              align="center"
            >
              <template v-slot="scope">
                <div class="list-name">
                  <span v-for="(item, index) in headItem.solt" :key="index">
                    {{ item.text }} : {{ scope.row[item.value] }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
            :key="headIndex"
              v-if="headItem.type === 'input'"
              :label="headItem.name"
              align="center"
            >
              <template v-slot="scope">
                <el-input size="small" v-model="scope.row[headItem.solt]"></el-input>
              </template>
            </el-table-column>
            <el-table-column
            :key="headIndex"
              v-if="headItem.type === 'flag'"
              :label="headItem.name"
              :prop="headItem.solt"
              align="center"
            >
              <template v-slot="scope">
                <span class="able-flag" :class="scope.row[headItem.solt]? 'disable-txt': ''"></span>
                <span>{{scope.row[headItem.solt]?'禁用': '启用'}}</span>
              </template>
            </el-table-column>
            <el-table-column
            :key="headIndex"
              v-if="headItem.type === 'button'"
              :label="headItem.name"
              :width="headItem.width"
              align="center"
            >
              <template v-slot="scope">
                <div class="btn-table">
                  <span
                    class="btn-text"
                    v-for="(item) in headItem.solt"
                    :key="item.idx"
                    @click="tableItemBtn(item, scope.row)"
                    :class="item.text == '删除' ? 'disable-btns' : ''"
                    >{{ item.text }}</span>
                  <template v-for="(itemSolt) in headItem.solts">
                    <span
                      :key="itemSolt.idx"
                      class="btn-text"
                      :class="!itemSolt.value? 'disable-btns' : ''"
                      v-if="headItem.typeFlag&&scope.row['isDisabled'] == itemSolt.value"
                      @click="tableItemBtn(itemSolt, scope.row)"
                      >{{itemSolt.text}}</span>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column
            :key="headIndex"
              v-if="headItem.type === 'btns'"
              :label="headItem.name"
              :prop="headItem.solt"
              align="center"
            >
              <template v-slot="scope">
                <div class="btn-table">
                  <span
                    class="btn-text"
                    v-for="(item, index) in scope.row[headItem.solt]"
                    :key="index"
                    @click="tableItemBtn(item, scope.row)"
                    >{{item.name}}</span>
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div v-if="submitFlag" class="submit-flag">
          <el-button style="min-width:80px" size="small" type="primary" @click="submitBtn">提交</el-button>
          <el-button style="width:80px" size="small" @click="preservationBtn">保存</el-button>
        </div>
        <div class="pagin">
          <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination> -->
        </div>
      </div>
    </div>

    <!-- 高级检索弹窗 -->
    <el-dialog
      title="高级检索"
      :visible="dialogFormVisible"
      width="560px"
      :close-on-click-modal="false"
    >
      <div class="design-dialog">
        <el-form class="form-search">
          <el-form-item
            v-for="(item, index) in seniorSearch"
            :key="index"
            :label="item.name"
            class="form-search-item"
          >
            <el-input
              clearable
              v-if="item.type === 'text'"
              v-model="item.value"
              :placeholder="'请输入' + item.name"
              size="small"
            ></el-input>
            <el-select
              clearable
              v-if="item.type === 'select'"
              v-model="item.value"
              :placeholder="'请选择' + item.name"
              size="small"
            >
              <el-option
                v-for="(optionItem, optionIndex) in item.options"
                :key="optionIndex"
                :label="optionItem.name"
                :value="optionItem.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button style="min-width: 80px" size="small" @click="resetSenior"
          >重置</el-button
        >
        <el-button
          style="min-width: 80px"
          size="small"
          type="primary"
          @click="submitSenior"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    tabsList: {
      type: Array
    },
    searchList: {
      type: Array
    },
    tableData: {
      type: Array
    },
    searchVal: {
      type: Object
    },
    tableBtns: {
      type: Array
    },
    tableHead: {
      type: Array
    },
    seniorSearch: {
      type: Array
    },
    submitFlag: {
      type: Boolean
    },
    total: {
      type: Number,
      default: 0
    },
    currpage: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectList: [],
      currentPage4: 1,
      dialogFormVisible: false,
    }
  },

  created() {},

  methods: {
    // 检索
    searchForm() {
      let searchVal = JSON.parse(JSON.stringify(this.searchVal))
      this.searchList.forEach((item) => {
        searchVal[item.solt] = item.value
      })
      this.$emit('searchForm', searchVal)
    },

    // 表格头部
    tableBtn(item) {
      this.$emit('tableBtn', item, this.selectList)
    },

    // 勾选表格
    tableSelectionChange(e) {
      this.selectList = e
    },

    // 分页设置
    handleSizeChange(e) {
      this.$emit('handleSizeChange', e)
    },

    // 分页跳转
    handleCurrentChange(e) {
      this.$emit('handleCurrentChange', e)
    },

    // 打开高级搜索弹窗
    seniorBtn() {
      this.dialogFormVisible = true
    },

    // 高级搜索
    submitSenior() {
      let searchVal = JSON.parse(JSON.stringify(this.searchVal))
      this.seniorSearch.forEach((item) => {
        searchVal[item.solt] = item.value
      })
      this.$emit('submitSenior', searchVal)
    },

    // 重置
    resetSenior() {
      this.seniorSearch.forEach((item) => {
        item.value = ''
      })
    },

    // 表格内点击事件
    tableItemBtn(item, temp) {
      this.$emit('tableItemBtn', item, temp)
    },

    // 保存
    preservationBtn() {
      this.$emit('preservationBtn')
    },

    // 提交
    submitBtn() {
      this.$emit('submitBtn')
    },

    // 搜索重置
    searchReset() {
      let searchVal = JSON.parse(JSON.stringify(this.searchVal))
      this.searchList.forEach(item => {
        item.value = ''
        searchVal[item.solt] = item.value
      })
      this.$emit('searchReset', searchVal)
    },

    // 切换tabs栏
    changeTabs(item) {
      this.$emit('changeTabs', item)
    }
  },
}
</script>
<style lang="scss" scoped>
.table-list {
  font-size: 14px;
}
.search-item {
  height: 40px;
  display: flex;
  align-items: center;
  margin: 10px 16px 10px 0;
  ::v-deep .el-input{
  height: 32px;
  }
  ::v-deep .el-input--small .el-input__inner {
   height: 32px !important;
   line-height: 32px;
  }
}
.search-text {
  text-align: left;
  font-size: 14px;
  margin-right: 8px;
}
.search {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 6px 16px 0;
  background: #fff;
}
.search-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.search-btn{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20%;
}
.table-btns {
  display: flex;
  justify-content: flex-start;
  align-items: center;

}
.btns-item {
  text-align: center;
  // background: #0066ff;

  margin: 0 10px;
  cursor: pointer;
}
.btns-item:nth-child(1) {
  margin: 0;
}
.search-reset{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-name {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn-table {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.btn-text {
  cursor: pointer;
}
.pagin {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: #fff;
}
.form-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.form-search-item {
  width: 220px;
}
.design-dialog {
  padding: 20px 30px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 30px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}
.form-search {
  :deep .el-select--small {
    width: 100%;
  }
}
.table-list {
  :deep .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 20px !important;
  }
  :deep .el-table th,
  :deep .el-table td{
    padding: 5px 0;
  }
}
.table-td-thumb {
  width: 100px;
  height: 100px;
}
.table{
  padding:  10px 16px;
  background: #fff;
}
.submit-flag{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.btns{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 16px;
}
.tbas-temp{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #fff;
    margin-right: 24px;
    // padding: 20px 0;
}
.tabs-item{
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    color: #354258;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}
.tabs-active{
   color: #0663FF;
  .span-name{
   padding-bottom: 4px;
    border-bottom: 3px solid #0663FF;
  }
  .span-value{
    display: flex;
    width: 40px;
    height: 16px;
    border-radius: 8px;
    background: #0663FF10;
    color: #0663FF;
    justify-content: center;
    align-items: center;
    margin-top: 6px;
  }
    // background:#9ACD32;

}
.txt{
    color:red
}
.span-value{
  display: flex;
  width: 40px;
  height: 16px;
  border-radius: 8px;
  background: #758FAC10;
  margin-left: 4px;
  color: #758fac;
  justify-content: center;
  align-items: center;
   margin-top: 6px;
   font-size: 12px;
}
.span-title{
  margin: 0 16px;
}
.able-flag{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00C65D;
  margin-right: 8px;
}
.disable-txt{
  background: #FF4749;
}
.disable-btns{
  color: #FF4749;
}
</style>
