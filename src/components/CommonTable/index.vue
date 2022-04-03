<template>
  <div :class="!isSelectMore ? 'table-list clearMoreCheck' : 'table-list'">
    <el-table :highlight-current-row="isRadio"
              :stripe="typeStripe ? true : false"
              :border="typeBorder ? true : false"
              :data="tableData"
              v-loading="loading"
              v-bind="{ ...$attrs, ...otherAttr }"
              :span-method="columnSpanMethod"
              v-on="$listeners"
              ref="multipleTable"
              :height="isMain ? tableHeight : 'auto'"
              :row-key="row => row.id || row.isIndex  "
              class="table-list__table"
              @selection-change="handleSelectionChange"
              @current-change="handleCurrentChange"
              :row-class-name="
        !keyColor
          ? (row, rowIndex) =>
              row.row.id == this.clickitemId && isRowClick
                ? 'setBackColorInFieldTable'
                : ''
          : tableRowClassColor()
      "
              @row-click="
        (row, column, event) => {
          setRowClick(row);
        }
      "
              @row-dblclick="
        (row, column, event) => {
          setRowClickTwo(row);
        }
      ">
      <!--  fixed="left" -->
      <!-- <el-table-column align="center"
                       type="selection"
                       :reserve-selection="true"
                       :width="show"
                       v-if="isSelection">
      </el-table-column> -->
      <el-table-column header-align="center"
                       v-for="(item, index) in tableColumn"
                       v-show="item.hidden"
                       :key="index"
                       :prop="item.prop"
                       :label="item.label"
                       :type="item.type"
                       :render-header="(h,{column})=>renderHeader(h,column,item)"
                       :width="item.width || (item.type === 'index' ? 50 : '')"
                       :fixed="item.fixed"
                       :class-name="item.className"
                       :show-overflow-tooltip="
          !item.showOverflowTooltip ? (item.isEdit ? false : true) : false
        "
                       :align="item.align ? item.align : 'left'">
        <template v-if="!item.primary"
                  slot-scope="scope">
          <!-- <template slot-scope="scope"> -->
          <template v-if="scope.row.isEdit">
            <el-input maxlength="40"
                      :readonly="item.readonly || false"
                      v-model="scope.row[item.prop]"></el-input>
          </template>
          <template v-else>
            <template v-if="item.render">
              <render :render="item.render"
                      :scope="scope"></render>
            </template>
            <template v-else-if="item.type === 'index'">
              {{
              scope.$index +
              1 +
              ((pageParams.pageNum || pageParams.pageNo) - 1) *
              pageParams.pageSize
              }}
            </template>
            <template v-else-if="item.isEdit">
              <el-form class="table-form-box"
                       @submit.native.prevent>
                <formItemList v-model="scope.row[item.prop]"
                              :item="item.config"
                              :index="scope.$index"></formItemList>
              </el-form>
            </template>
            <template v-else-if="item.tableColumn">
              <table class="custorm-table-box"
                     border="0"
                     cellpadding="0"
                     cellspacing="0">
                <tbody v-if="item.tableType === 'vertical'">
                  <tr v-for="(value, index) in item.tableColumn"
                      :key="index">
                    <td>{{ value.label }}</td>
                    <td v-for="(column, columnIndex) in scope.row[item.prop]"
                        :key="columnIndex">
                      {{
                      value.type === "index"
                      ? columnIndex + 1
                      : column[value.prop]
                      }}
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td v-for="(value, index) in item.tableColumn"
                        :key="index">
                      {{ value.label }}
                    </td>
                  </tr>
                  <tr v-for="(column, columnIndex) in scope.row[item.prop]"
                      :key="columnIndex">
                    <td v-for="(value, index) in item.tableColumn"
                        :key="index">
                      {{
                      value.type === "index"
                      ? columnIndex + 1
                      : column[value.prop]
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <!-- </template> -->
        </template>
        <!-- <template v-else> -->
        <el-table-column header-align="center"
                         v-for="(value, index) in item.primary"
                         :key="index"
                         :prop="value.prop"
                         :label="value.label"
                         :type="value.type"
                         :width="value.width || (value.type === 'index' ? 50 : '')"
                         :fixed="value.fixed"
                         :class-name="value.className"
                         :show-overflow-tooltip="
            !value.showOverflowTooltip ? (value.isEdit ? false : true) : false
          "
                         :align="value.align ? value.align : 'left'">
          <template slot-scope="scope">
            <template v-if="scope.row.isEdit">
              <el-input maxlength="40"
                        :readonly="value.readonly || false"
                        v-model="scope.row[value.prop]"></el-input>
            </template>
            <template v-else>
              <template v-if="value.render">
                <render :render="value.render"
                        :scope="scope"></render>
              </template>
              <template v-else-if="value.type === 'index'">
                {{
                scope.$index +
                1 +
                ((pageParams.pageNum || pageParams.pageNo) - 1) *
                pageParams.pageSize
                }}
              </template>
              <template v-else-if="value.isEdit">
                <el-form class="table-form-box"
                         @submit.native.prevent>
                  <formItemList v-model="scope.row[value.prop]"
                                :item="value.config"
                                :index="scope.$index"></formItemList>
                </el-form>
              </template>
              <template v-else-if="value.tableColumn">
                <table class="custorm-table-box"
                       border="0"
                       cellpadding="0"
                       cellspacing="0">
                  <tbody v-if="value.tableType === 'vertical'">
                    <tr v-for="(val, index) in value.tableColumn"
                        :key="index">
                      <td>{{ val.label }}</td>
                      <td v-for="(column, columnIndex) in scope.row[value.prop]"
                          :key="columnIndex">
                        {{
                        val.type === "index"
                        ? columnIndex + 1
                        : column[val.prop]
                        }}
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td v-for="(val, index) in value.tableColumn"
                          :key="index">
                        {{ val.label }}
                      </td>
                    </tr>
                    <tr v-for="(column, columnIndex) in scope.row[value.prop]"
                        :key="columnIndex">
                      <td v-for="(val, index) in value.tableColumn"
                          :key="index">
                        {{
                        val.type === "index"
                        ? columnIndex + 1
                        : column[val.prop]
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
              <template v-else>{{ scope.row[value.prop] }}</template>
            </template>
          </template>
        </el-table-column>
        <!-- </template> -->
      </el-table-column>
    </el-table>

    <slot></slot>

    <div class="table-list__page"
         v-if="ispage"
         style="margin-top:12px;text-align:right">
      <pagination v-show="pageParams.total > 0"
                  :total="Number(pageParams.total)"
                  :page="pageParams.pageNum || pageParams.pageNo"
                  :pager-count="5"
                  :limit.sync="pageParams.pageSize"
                  @pagination="value => pageChange(value)"
                  :hide-on-single-page="hideSingPage" />
    </div>

    <!-- 是否显示右侧的弹框里面的东西 -->
    <el-drawer title="配置参数"
               :visible.sync="openDrawer"
               :size=" '270px' "
               @close="()=>closeDrawer()">
      <div class="popBox clearNumber">
        <div class="content">
          <div class="form">
            <form-list v-model="tableData[doubleIndex]"
                       :formConfig="formConfig"
                       ref="form"></form-list>
          </div>
          <slot></slot>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import formItemList from "@/components/Form/form-item-list.vue";
import render from "./table-render.js";
import formList from '@/components/Form/formList.vue'
import { setTimeout } from 'timers';
export default {
  components: { render, formItemList, formList },
  props: {
    isFixedToBottom: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    otherAttr: {
      type: Object,
      default: () => {
        return {};
      }

    },
    tableWidth: {
      type: Number,
      default: 200
    },
    tableColumn: {
      type: Array,
      default: () => []
    },
    hideSingPage: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    },
    stripe: {
      type: Boolean,
      default: true
    },
    keyColor: {
      type: Boolean,
      default: false
    },
    typeBorder: {
      type: Boolean,
      default: true
    },
    //是否单选
    isRadio: {
      type: Boolean,
      default: false
    },
    typeStripe: {
      type: Boolean,
      default: true
    },
    isMain: {
      type: Boolean,
      default: true
    },
    isSelection: {
      type: Boolean,
      default: false
    },
    isChangeCloumn: {
      type: Boolean,
      default: false

    },
    pageParams: {
      type: Object,
      default: () => {
        return {
          // 当前页数
          pageNum: 1,
          // 一页几行
          pageSize: 30,
          // 数据总数
          total: 0
        };
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    ispage: {
      type: Boolean,
      default: true
    },
    isHeight: {
      type: Boolean,
      default: false
    },
    isRowClick: {
      type: Boolean,
      default: false
    },
    tableheight: {
      type: Number,
      default: 0
    },
    isSelectMore: {
      type: Boolean,
      default: false
    },

    editForm: {
      type: Array,
      default: () => {
        return [];
      }
    },
    propTableHeight: {
      type: Number,
      default: 180
    },
    countColumn: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  data () {
    return {
      maxHeight: 0,
      tableHeight: undefined,
      clickitemId: undefined,
      show: 50,
      openDrawer: false,//是否打开右侧的抽屉
      queryForm: {},
      doubleIndex: 0,
      formConfig: {
        inline: false,
        labelWidth: "auto",
        size: "mini",
        formItemList: [],
      },
    };
  },
  created () { },
  methods: {
    renderHeader (h, column, item) {
      if (!item.isRequired) {
        return h("div", {}, column.label);
      }
      // h即为cerateElement的简写，具体可看vue官方文档
      return h("div", [
        h("span", {
          style: "font-size: 12px;color:red",
        }, '*'),
        h("span", column.label),

      ]);
    },

    closeDrawer () {
      this.$emit('changeDoubleClick', undefined);

    },

    columnSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (this.countColumn && this.countColumn.spanArr && this.countColumn.spanArr.length) {
        if (columnIndex === this.countColumn.countIndex[this.countColumn.countIndex.indexOf(columnIndex)]) {
          const _row = this.countColumn.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
      }
    },
    handleCurrentChange (val) {
      this.$emit("handleCurrentChange", val);
    },
    pageChange (page) {
      this.$emit("pageChange", page);
    },
    pageSizeChange (size) {
      this.$emit("pageSizeChange", size);
    },
    // 行背颜色
    tableRowClassColor (row) {
      console.log(row, "8****");
      // alert('ee')
    },
    // 单行点击  出现背景色 并且把数据发送过去
    setRowClick (e) {
      this.clickitemId = e.id;
      if (this.isRowClick) {
        this.$emit("selePage", e);
      }
    },

    // 双击的事件
    setRowClickTwo (e) {

      // 如果是编辑状态 双击了行 就会打开弹框
      // 实际是大于0的
      if (this.tableColumn.filter(item => item.isEdit).length > 100000000) {

        this.formConfig.formItemList = this.tableColumn.filter(item => item.config).map(itemx => {
          return {
            ...itemx.config,
            label: itemx.label
          }
        })

        this.queryForm = this.tableData[e.isIndex - 1];
        this.doubleIndex = e.isIndex - 1;
        this.openDrawer = true;
        this.$emit('changeDoubleClick', this.doubleIndex);
        // 组装下要显示的form表单
      }
      else {
        this.clickitemId = e.id;
        if (this.isRowClick) {
          this.$emit("selePage", e, true);
        }
      }
    },

    // 告诉父级勾选了那些数据
    handleSelectionChange (selection) {
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
    resetSelect () {
      this.$refs.multipleTable.clearSelection();
      this.clickitemId = undefined;
    },

    //手动设置最后一行选中 
    setCurrentParent () {
      this.$refs.multipleTable.toggleRowSelection(this.tableData[this.tableData.length - 1]);
    },

    setTableHeight () {
      setTimeout(() => {
        let contentHeight = document.getElementsByClassName("app-main")[0]
          .offsetHeight;
        let containerHeight = document.getElementsByClassName(
          "tags-view-container"
        )[0].offsetHeight;
        this.maxHeight = contentHeight - containerHeight;
      }, 100);
    }
  },
  mounted () {
    console.log('this.pageParams', this.pageParams)

    if (this.isHeight) {
      // this.setTableHeight();
    }
    if (this.isMain) {
      setTimeout(() => {
        this.$nextTick(() => {
          this.tableHeight = this.tableheight
            ? this.tableheight
            : window.innerHeight -
            this.$refs.multipleTable.$el.offsetTop -
            this.propTableHeight;
        });
      }, 100);
    }

  },
  watch: {
    isFixedToBottom: {
      handler (val) {
        if (this.$refs.multipleTable && !!this.isFixedToBottom) {
          // 将滚动条固定在最底部
          this.$refs.multipleTable.bodyWrapper.scrollTop = this.$refs.multipleTable.bodyWrapper.scrollHeight + 100
          this.isFixedToBottom = false
        }
      },
      immediate: true
    },
    propTableHeight: {
      handler (val) {
        if (this.$refs.multipleTable) {
          console.log(this.$refs.multipleTable);

          this.tableHeight =
            window.innerHeight - this.$refs.multipleTable.$el.offsetTop - val;
        }
      },
      immediate: true
    },
    tableColumn: {
      deep: true,
      handler (val) {
        console.log(this.isChangeCloumn);
        if (this.isChangeCloumn) {
          setTimeout(() => {
            this.show = 50 + (Math.random() * 5)
          }, 100);

        }

      },
      immediate: true

    }
  }
};
</script>
<style lang="less" scoped>
.setBackColorInFieldTable {
  background: #f8f8f9 !important;
}

.table-list {
  .table-column-form {
    padding: 0;
  }
  .table-form-box {
    .el-form-item--mini.el-form-item {
      margin: 0;
    }
  }
}
.clearMoreCheck {
  // /deep/ th .el-checkbox{
  //   display: none;
  // }
  /deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
/deep/ .el-table th > .cell {
  font-weight: 400;
  padding: 0 !important;
}

//表格内嵌表格
.custorm-table-box {
  width: 100%;

  tr {
    background: rgba(0, 0, 0, 0);
  }
  td {
    background: rgba(0, 0, 0, 0);
    border: 1px solid #dfe6ec;
  }
}

//如果通用表格出现 错位 等样式问题  看下这个
/deep/ .el-table__body {
  width: 100%;
  // 使表格兼容safari，不错位
  table-layout: fixed !important;
}
</style>