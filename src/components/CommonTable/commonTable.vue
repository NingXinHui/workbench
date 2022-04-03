<template>
  <div :class="!isSelectMore? 'table-list clearMoreCheck':'table-list' ">

    <el-table width="1440"
              :stripe="stripe"
              :border="isBorder?isBorder:false"
              :size="tableSize?tableSize:'small'"
              :data="tableData"
              v-loading="loading"
              v-bind="$attrs"
              v-on="$listeners"
              ref="multipleTable"
              :height="isMain ?  tableHeight:'auto' "
              :row-key="(row) => row.id "
              class="table-list__table"
              @selection-change="handleSelectionChange"
              @select-all="selectAll"
              @row-click="rowClick"
              @row-dblclick="rowDbClick"
              @cell-click="cellClick"
              :row-class-name="!keyColor ? (row, rowIndex) =>(row.row.id == this.clickitemId && isRowClick)
                  ? 'setBackColorInFieldTable' : '' : tableRowClassColor
        ">
      <el-table-column align="center"
                       type="selection"
                       :reserve-selection="true"
                       width="50"
                       v-if="isSelection">

      </el-table-column>
      <el-table-column v-for="(item, index) in tableColumn"
                       header-align="center"
                       :key="index"
                       :prop="item.prop"
                       :label="item.label"
                       :type="item.type"
                       :width="item.width || (item.type === 'index' ? 50 : '')"
                       :fixed="item.fixed"
                       :class-name="item.className"
                       :show-overflow-tooltip="!isEdit"
                       :align="item.align ? item.align : 'left'">

        <template slot-scope="scope">
          <div v-if="scope.row.isEdit"
               class="editTable">
            <template v-if="item.prop==='inputValue'">
              <template v-if="scope.row.func">
                <el-select :key="scope.row.id"
                           v-if="scope.row.func.type==2"
                           size="mini"
                           :multiple="scope.row.func.multiple"
                           v-model="scope.row.fieldValue"
                           :clearable="true"
                           :filterable="true"
                           placeholder="请选择">
                  <el-option v-for="(item2,index2) in scope.row.func.optionList"
                             :key="index2"
                             :label="item2[scope.row.func.optionLabel]"
                             :value="item2[scope.row.func.optionValue]">
                  </el-option>
                </el-select>
                <el-input v-if="scope.row.func.type==1"
                          size="mini"
                          maxlength="40"
                          :disabled="!!item.disabled"
                          v-model="scope.row.fieldValue" />
                <el-date-picker style="width: 100%"
                                v-if="scope.row.func.type==3"
                                v-model="scope.row.fieldValue"
                                type="date"
                                size="mini"
                                placeholder="选择日期"
                                align="right"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </template>
            </template>

            <template v-else>
              <template v-if="item.editConfig">
                <el-checkbox @change="item.changeValue?item.changeValue($event,scope):changeValue(scope,item)"
                             v-if="item.editConfig.type===7"
                             v-model="scope.row[item.prop]">
                </el-checkbox>
                <el-select v-if="item.editConfig.type==2"
                           @change="changeValue(scope,item)"
                           @visible-change="item.visibleChange($event,scope)"
                           :size="item.size?item.size:'medium'"
                           v-model="scope.row[item.prop]"
                           :clearable="true"
                           :filterable="true"
                           placeholder="请选择">
                  <el-option v-for="(item2,index2) in item.editConfig.optionList"
                             :key="index2"
                             :label="item2[item.editConfig.optionLabel]"
                             :value="item2[item.editConfig.optionValue]">
                  </el-option>
                </el-select>
                <el-input @clear="item.clear&&item.clear()"
                          clearable
                          v-if="item.editConfig.type==1"
                          :type="item.inputType?item.inputType:'text'"
                          :size="item.size?item.size:'medium'"
                          maxlength="40"
                          @focus="(item.openLook&&item.focus)?item.focus($event,scope):{}"
                          :disabled="judge(scope,item)"
                          v-model="scope.row[item.prop]">

                </el-input>

                <el-date-picker style="width: 100%"
                                v-if="item.editConfig.type==3"
                                v-model="scope.row[item.prop]"
                                :type="item.editConfig.pickerType?item.editConfig.pickerType:'date'"
                                size="mini"
                                placeholder="选择日期"
                                align="right"
                                :value-format="item.editConfig.valueFormat?item.editConfig.valueFormat:'yyyy-MM-dd'">
                </el-date-picker>
                <el-input-number v-bind="{...$attrs,...item.attrs}"
                                 :disabled="item.editConfig.disabled"
                                 @change="(currentValue)=>item.editConfig.change?item.editConfig.change(currentValue,scope):{}"
                                 :controls="false"
                                 :precision="item.editConfig.precision?item.editConfig.precision:0"
                                 v-if="item.editConfig.type==4"
                                 :min="item.editConfig.min!==undefined?item.editConfig.min:1"
                                 v-model="scope.row[item.prop]">
                </el-input-number>
                <el-select no-match-text=" "
                           popper-class="selectTree"
                           v-if="item.editConfig.type==25"
                           @visible-change="item.focus($event,scope)"
                           v-model="scope.row[item.prop]"
                           clearable
                           :filterable="true"
                           :placeholder="item.placeholder || '请选择' "
                           ref="selectOpen"
                           @clear="item.clear&&item.clear()">
                  <el-option :value="item.optionValue">
                    <el-tree node-key="id"
                             v-bind="$attrs"
                             v-on="$listeners"
                             accordion
                             @node-click="item.nodeClick&&item.nodeClick($event,scope)"
                             :data="item.editConfig.selectOption"
                             ref="updatetree"
                             :props="item.editConfig.defaultProps">
                    </el-tree>
                  </el-option>
                </el-select>

              </template>
              <template v-else>
                <el-input :type="item.inputType?item.inputType:'text'"
                          :size="item.size?item.size:'medium'"
                          maxlength="40"
                          @change="item.change&&item.change(scope.row)"
                          :disabled="!!item.disabled"
                          v-model="item.type === 'index'? scope.$index + 1 + ( (pageParams.pageNo || pageParams.pageNum) - 1) * pageParams.pageSize:scope.row[item.prop]" />
              </template>
            </template>

          </div>
          <template v-else>
            <template v-if="item.render">
              <render :render="item.render"
                      :scope="scope"></render>
            </template>
            <template v-else-if="item.type === 'index'">
              {{
              scope.$index + 1 + ((pageParams.pageNo || pageParams.pageNum) - 1) * pageParams.pageSize
              }}
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
    <div class="table-list__page"
         v-if="isPage"
         style="margin-top:12px;text-align:right">
      <pagination v-show="pageParams.total > 0"
                  :total="Number(pageParams.total)"
                  :page="pageParams.pageNo ||pageParams.pageNum"
                  :pager-count="5"
                  :limit.sync="pageParams.pageSize"
                  @pagination="(value) => pageChange(value)"
                  :hide-on-single-page='hideSingPage' />
    </div>
  </div>
</template>

<script>
import render from "./table-render.js";

export default {
  components: { render },
  props: {
    keyColor: {
      type: Boolean,
      default: false
    },
    tableheight: {
      type: Number,
      default: 0,

    },
    tableSize: {
      type: String,
      default: 'medium'
    },
    isEdit: {
      type: Boolean,
      default: false
    },

    tableColumn: {
      type: Array,
      default: () => [],
    },
    hideSingPage: {
      type: Boolean,
      default: false,

    },
    tableData: {
      type: Array,
      default: () => [],
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    isMain: {
      type: Boolean,
      default: true,
    },
    isBorder: {
      type: Boolean,
      default: true,
    },
    isSelection: {
      type: Boolean,
      default: false,
    },
    pageParams: {
      type: Object,
      default: () => {
        return {
          // 当前页数
          pageNo: 1,
          // 一页几行
          pageSize: 30,
          // 数据总数
          total: 0,
        };
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isPage: {
      type: Boolean,
      default: true,
    },
    isHeight: {
      type: Boolean,
      default: false,
    },
    setHeight: {
      type: Number,
      default: 0,

    },
    isSelectMore: {
      type: Boolean,
      default: false,
    },
    propTableHeight: {
      type: Number,
      default: 180
    },
    editForm: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data () {
    return {
      maxHeight: 0,
      tableHeight: undefined,
      selectRow: [],
      checkItemId: '',
      clickitemId: undefined
    };
  },
  created () {
  },
  methods: {
    judge (scope, value) {
      if (value.prop === "poOrderNo") {
        if (scope.row.subOrderNo) {
          return true
        }
      }
      if (value.prop === "subOrderNo") {
        if (scope.row.poOrderNo) {
          return true
        }
      }

      return false
    },
    tableRowClassColor (row) {
      if (row.row.usable == false) {
        return 'rowColor999'
      }
    },
    nodeClick (a, b, c) {
      console.log(a, b, c)
    },

    //行点击事件
    rowClick (row) {
      this.checkItemId = row.id
      this.$emit('rowClick', row)
    },
    //行双击事件
    rowDbClick (row, column) {
      this.checkItemId = row.id
      this.$emit('rowDbClick', row)
    },
    //单元个点击
    cellClick (row, column, cell, event) {
      console.log(row, column, cell, event)
    },
    // 点击全选
    selectAll () {
      return false
    },
    //下拉框change事件
    changeValue (e, i) {
      this.$emit("selectChange", e, i);
    },
    //翻页
    pageChange (page) {
      this.$emit("pageChange", page);
    },
    //修正条数
    pageSizeChange (size) {
      this.$emit("pageSizeChange", size);
    },

    // 告诉父级勾选了那些数据
    handleSelectionChange (selection, row) {
      // 如果只能单选并且选项大于一 就更新掉
      if (!this.isSelectMore && selection.length > 1) {
        let del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        this.$emit("selePage", [selection[0]]);
      }
      //  等于或者小于一  直接传值
      else {
        this.$emit("selePage", selection);
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      row.index = rowIndex;
      return 'rows'
    },
    //充值选择
    resetSelect () {
      this.$refs.multipleTable.clearSelection();
    },


    setTableHeight () {
      setTimeout(() => {
        let contentHeight =
          document.getElementsByClassName("app-main")[0].offsetHeight;
        let containerHeight = document.getElementsByClassName(
          "tags-view-container"
        )[0].offsetHeight;
        this.maxHeight = contentHeight - containerHeight;
      }, 100);
    },
  },
  mounted () {
    if (this.isHeight) {
      this.setTableHeight();
    }
    if (this.isMain) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.tableHeight =
            this.tableheight ? this.tableheight : window.innerHeight - this.$refs.multipleTable.$el.offsetTop - this.propTableHeight;
        })
      }, 100);
    }

  },
  watch: {
    propTableHeight: {
      handler (val) {
        if (this.$refs.multipleTable) {
          this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - val;
        }
      },
      immediate: true,
    }
  },
};
</script>

<style scoped lang="less">
.setBack {
  background: red;
}

/deep/ .el-table th > .cell {
  font-weight: 400;
  padding: 0 !important;
}
/deep/ .el-table .rowColor999 {
  color: #999;
}
.setheadbutton {
  /deep/ .el-table td {
    padding: 0;
  }
}

.editTable {
  /deep/ input {
    //border:none
  }
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: none;
}

.clearMoreCheck {
  /deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
.el-select-dropdown {
  .el-select-dropdown__item {
    height: 100%;
    background-color: #ffffff;
  }
}

//如果通用表格出现 错位 等样式问题  看下这个
/deep/ .el-table__body {
  width: 100%;
  // 使表格兼容safari，不错位
  table-layout: fixed !important;
}
</style>
