<!--
@time:2021/12/1
@author:chenqian
-->
<template>
    <div id="zPage">
      <!-- 按钮 -->
      <div class="z-header">
        <div class="z-header-button">
          <el-button @click="openEdit('add')">新增</el-button>
          <el-button @click="openEdit('edit')">编辑</el-button>
        </div>
      </div>
      <div class="z-content">
        <el-card>
          <!-- 搜索条件 -->
          <header-search :model="queryForm" :searchArr="searchArr" @sureSearch="searchMethod" :isPrint='true' printtype='order_no' :selectRow='selectRow'>
          </header-search>
          <div class="z-content-table">
            <!-- table -->
            <common-table
              is-height
              ref="mainTable"
              :isMain="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :isSelection="true"
              :isSelectMore="false"
              :loading="loading"
              :pageParams="pageParams"
              @selePage="handleItemSelect"
              @pageChange="pageSizeChange"
            />
          </div>
        </el-card>
      </div>
    </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'

import { getDataList, deleteData, withdrawData, submitData, } from '@/api/marketOrder'
import { getCompanyList} from '@/api/systemzhu/company'
import { deepCopy,} from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
export default {
  name: "",
  components: {
    HeaderSearch,
    commonTable,
  },
  mixins: [orderMixins],
  data() {
    return {
      approvalVisible: false,
      approvalText: "审核",
      titletype: "",
      selectRow:{},
      queryForm: {
        usable:"1"
      },
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'name',
          label: '公司名称',
          render: (h, scope) => {
            return h(
              "a",
              {
                style: "color:blue",
                on: { click: () => this.openEdit('details', scope.row) },
              },
              scope.row.name
            );
          },
        },
        {
          prop: 'shortName',
          label: '公司简称',
        },
        {
          prop: 'type',
          label: '公司类型',
          render: (h, scope) => {
            return h(
              "span",
              {
              },
              scope.row.type == '0' ? '总公司' : "分公司"
            );
          },
        },
        {
          prop: 'usable',
          label: '是否可用',
          align:"center",
          width:90,
          render: (h, scope) => {
            return h("el-checkbox", {
              attrs: {
                disabled: true,
                value: scope.row.usable
              }
            });
          }
        },
        {
          prop: 'remark',
          label: '备注',
        },
        {
          prop: 'createUserName',
          label: '创建人',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        }
      ],
      tableData:[],
      loading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 0
      },
      multipleSelection: [],
    }
  },
  computed: {
    searchArr() {
      return [
        {
          label: '公司名称',
          value: 'name',
          type: 1,
          maxLength: 40,
        },
         {
          label: '公司简称',
          value: 'shortName',
          type: 1,
          maxLength: 40,
        },
        {
          label: '是否可用',
          value: 'usable',
          optionLabel: 'label',
          optionValue: 'value',
          type: 2,
          selectOption: [{
            label: '全部',
            value: 'all'
          }, {
            label: '是',
            value: '1',
          }, {
            label: '否',
            value: '0'
          }]
        },
      ]
    }
  },
  created() {
    this.pageChange(1)
  },
  methods: {
    /**
     * @desc 条件数据获取
     */
    searchMethod(data) {
      this.queryForm = data
      this.pageChange(1)
    },
    /**
     * @desc 初始化数据列表接口参数
     */
    initParams() {
      let params = {
        current: this.pageParams.pageNum,
        size: this.pageParams.pageSize,
        usable: this.queryForm.usable == 'all'?  "" : this.queryForm.usable,
        shortName: this.queryForm.shortName,
        name: this.queryForm.name,
      };
      return params
    },
    /**
     * @desc 获取数据列表
     */
    getDataList() {
      this.loading = true
      let params = this.initParams()

      this.clearSelct()
      getCompanyList(params).then(res => {
        this.loading = false

        this.tableData = res.data.records
        this.pageParams.total = res.data.total
      })
      .catch(error => {
        console.group(error)
        this.tableData = []
        this.loading = false
        this.pageParams.total = 0
      })
    },
    /**
     * @desc 选择复选
     */
    handleItemSelect(val) {
      this.multipleSelection = val
      this.selectRow = val[0]
    },
    /**
     * @desc 页数发生变化
     */
    pageChange(page) {
      this.pageParams.pageNum = page
      this.getDataList()
    },
    /**
     * @desc 页面页码页面数字改变
     */
    pageSizeChange(data) {
      this.pageParams.pageNum = data.page
      this.pageParams.pageSize = data.limit

      this.getDataList()
    },

    /**
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
    /**
     * @desc 新增编辑详情
     */
    openEdit(type, params) {
      let data = {
        type,
        data: params || {},
      }

      if(type === 'edit') {
        if(!this.checkOperation(type, this.multipleSelection, 'billStatus', '12345')) {
          return
        } else {
          data.data = deepCopy(this.multipleSelection[0])
        }
      }
      this.$emit('submit', data)
    },
  },
  mounted() {
  },
}
</script>

<style scoped>

</style>
