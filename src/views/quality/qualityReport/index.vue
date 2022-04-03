<template>
  <!-- 质检报告查询 -->
  <div id="zPage">
    <div class="z-content">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-icon">
                <span @click="isCancel('basicShow', !basicShow)">
                    <i :class="basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
                    基本信息
                </span>
          </div>
          <div :class="['z-details-content-box', basicShow ? '' : 'details-height-none']">
            <div style="margin-bottom: 8px;">
              <header-search :searchArr="searchArr" @sureSearch="searchMethod"
              >
                <slot>
                  <el-button type="primary" @click="querySummary">总结</el-button>
                  <el-popover
                      placement="bottom-start"
                      popper-class="cleardefault"
                      width="80"
                      trigger="click"
                  >
                    <div class="setpopshow">
                      <div v-for="(item,index) in showpop" :key="index" @click="()=>dosomeout(item,index)"
                           class="setpopshowDiv"
                           :style="{backgroundColor:(popoverIndex == index) ? '#EAF3FF':'#fff',color:(popoverIndex == index) ? '#0065FF':'#000'}"
                      >
                        <span>{{ index + 1 }}</span>
                        {{ item.report_name }}
                      </div>
                    </div>
                    <el-button style="margin-left:4px" slot="reference">打印</el-button>
                  </el-popover>
                  <!-- <el-button @click="operationFun('print')">打印</el-button> -->
                  <!--<el-button @click="operationFun('export')">导出</el-button> -->
                </slot>
              </header-search>
            </div>
            <div class="z-content-table">
              <!-- table -->
              <common-table
                  is-height
                  ref="mainTable"
                  :isMain="true"
                  :tableColumn="tableColumn"
                  :tableData="tableData"
                  :table-height="400"
                  :isSelection="true"
                  :loading="loading"
                  :pageParams="pageParams"
                  @selePage="handleItemSelect"
                  @pageChange="pageSizeChange"
                  :is-page="false"
              />
            </div>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon">
                <span @click="isCancel('detailsShow', !detailsShow)">
                    <i :class="detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
                    明细信息
                </span>
          </div>
          <div :class="['z-details-content-box', detailsShow ? '' : 'details-height-none']">
            <div class="z-content-table">
              <!-- table -->
              <common-table
                  is-height
                  ref="detailsTable"
                  :isMain="true"
                  :table-height="250"
                  :tableColumn="detailsTableColumn"
                  :tableData="detailsTableData"
                  :isSelection="false"
                  :is-page="false"
                  :loading="detailsLoading"
              />
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <pop v-if="popConfig.show" @close="popConfig.show = false" :editAddData="selectRow" @submit="getDataList"></pop>
  </div>
</template>

<script>
import HeaderSearch from '@/components/CommonHeadSearch/ZSearch'
import commonTable from '@/components/CommonTable'
import pop from './pop'
import axios from 'axios';
import {getDataList, getDetailsData, querySummary,} from '@/api/quality/qualityReport'
import {deepCopy,} from "@/lib/common"
import orderMixins from "@/lib/orderMixins"
import {authRsaParam, getParameters} from '@/api/cangkunew';

export default {
  name: "QualityReport",
  components: {
    HeaderSearch,
    commonTable,
    pop,
  },
  mixins: [orderMixins],
  data() {
    return {
      showpop: [],
      searchArr: [
        {
          label: '质检单号',
          value: 'score',
          type: 1,
        },
        {
          label: '质检任务号',
          value: 'taskNo',
          type: 1,
        },
        {
          label: '物料名称',
          value: 'materialName',
          type: 1,
        },
      ],
      queryForm: {},
      tableColumn: [
        {
          type: 'index',
          label: '序号',
        },
        {
          prop: 'billNo',
          label: '质检单号',
          render: (h, scope) => {
            return h(
                "a",
                {
                  style: "color:blue",
                  on: {click: () => this.openEdit('details', scope.row)},
                },
                scope.row.billNo
            );
          },
        },
        {
          prop: 'taskNo',
          label: '质检任务号',
        },
        {
          prop: 'materialNo',
          label: '物料编号',
        },
        {
          prop: 'materialName',
          label: '物料名称',
        },
        {
          prop: 'specification',
          label: '物料描述',
        },
        {
          prop: 'qty',
          label: '任务数量',
          align: 'right',
        },
        {
          prop: 'pkgQty',
          label: '包装数量',
          align: 'right',
        },
        {
          prop: 'pkgUnit',
          label: '包装单位',
        },
        {
          prop: 'fqty',
          label: '已验数量',
          align: 'right',
        },
        {
          prop: 'cardNo',
          label: '缸号',
        },
        {
          prop: 'colorName',
          label: '颜色',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'comprehensiveReview',
          label: '综合描述',
        },
      ],
      detailsTableColumn: [
        {
          prop: 'rollNumber',
          label: '卷号',
        },
        {
          prop: 'fabricNo',
          label: '布号',
        },
        {
          prop: 'qty',
          label: '长度',
          align: 'right',
        },
        {
          prop: 'weight',
          label: '重量',
          align: 'right',
        },
        {
          prop: 'unitNo',
          label: '单位',
        },
        {
          prop: 'grade',
          label: '等级',
        },
        {
          prop: 'sizingNo',
          label: '缸号',
        },
        {
          prop: 'count',
          label: '疵点个数',
          align: 'right',
        },
        {
          prop: 'totalPoint',
          label: '总扣分',
          align: 'right',
        },
        {
          prop: 'width',
          label: '幅宽',
        },
        {
          prop: 'remark',
          label: '备注',
        },
        {
          prop: 'inspectTime',
          label: '验布时间',
        },
        {
          prop: 'workerNo',
          label: '验布人',
        },
        {
          prop: 'equipmentNo',
          label: '验布机编号',
        },
      ],
      tableData: [],
      detailsTableData: [],
      loading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 30,
        total: 0
      },
      selectRow: {},
      selectOne: {},
      multipleSelection: [],
      basicShow: true,
      detailsShow: true,
      detailsLoading: false,
      popConfig: {
        show: false,
      },
      popoverIndex: -1,
    }
  },
  created() {
    this.pageChange(1)
  },
  methods: {
    dosomeout(e, index) {

      this.popoverIndex = index
      // 如果是订单的
      if (!this.selectOne.id) {
        return this.$message.error('请先选择数据')
      }
      // if(!this.selectRow.billNo ){
      //   return this.$message.error('目前仅支持订单')
      // }
      // let url = `http://saas-report.hsyl-prod.saas.huansi.net/api/report/trade-saas/${sessionStorage.getItem('taaaId')}/${e.report_no}?billid=${this.selectOne.id}&userid=${localStorage.getItem('userId')}`;
      // window.open(url);
      getParameters({group: 'report-service'}).then(response => {
        let data = {
          ServiceName: response.data.find(item => item.parameterCode == 'service-name').parameterValue,
          BillTypeNo: 'store_in_no',
          ReportNo: e.report_no,
          Format: "",
          Inline: false,
          BillId: this.selectOne.id,
          UserId: localStorage.getItem('userId'),
          TenantId: localStorage.getItem('taaaId')

        }
        let formData = new FormData();
        formData.append("params", JSON.stringify(data));

        authRsaParam(formData).then(res => {
          if (res.success) {
            let mainurl = response.data.find(item => item.parameterCode == 'url').parameterValue;
            let url = `${mainurl}/api/report/preview/${res.data.token}`;
            window.open(url);
          }

        })
      })
    },
    /**
     * @desc 查看总结
     */
    querySummary() {
      let count = this.multipleSelection.length
      if (count < 1) {
        this.$message.error('请选择操作项')
        return
      } else if (count != 1) {
        this.$message.error('不能对多条信息同时操作')
        return
      }
      this.loading = true
      this.selectRow = deepCopy(this.multipleSelection[0])
      querySummary({taskDtlId: this.selectRow.id}).then(res => {
        this.loading = false
        res.data.map(item => {
          let l = 9
          for (let i = item.list.length; i < l; i++) {
            item.list.push({})
          }
        })

        this.selectRow.list = res.data
        this.popConfig.show = true
      })
          .catch(() => {
            this.loading = false
          })
    },
    /**
     * @desc 删除选中数据
     */
    operationFun(type) {
      let objText = {
        print: {
          text: '确认打印选中的数据吗？',
          fun: this.printCommonData,
        },
        export: {
          text: '确认导出选中的数据吗？',
          fun: this.exportCommonData,
        },
      }

      if (objText[type].check) {
        if (!objText[type].check(type, this.multipleSelection, objText[type].key, objText[type].value)) {
          return
        }
      }
      this.$confirm(objText[type].text, "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            objText[type].fun()
          })
          .catch(() => {

          });
    },
    /**
     * @desc 对应组件显示隐藏
     */
    isCancel(key, bool) {
      this[key] = bool
    },
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
            pageNo: this.pageParams.pageNum,
            pageSize: this.pageParams.pageSize,
          },
          objParams = {
            materialName: 'materialName',
            billNo: 'score',
            taskNo: 'taskNo',
          }

      Object.keys(objParams).forEach(item => {
        if (typeof this.queryForm[objParams[item]] != 'undefined' && this.queryForm[objParams[item]] != '') {
          params[item] = this.queryForm[objParams[item]]
        }
      })

      return params
    },
    /**
     * @desc 获取数据列表
     */
    getDataList() {
      this.loading = true
      let params = this.initParams()

      this.clearSelct()
      getDataList(params).then(res => {
        this.loading = false

        this.tableData = res.data
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
      this.selectOne = val[0]
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
     * @desc 查询明细
     */
    getDetailsData(id) {
      this.detailsLoading = true
      getDetailsData({taskDtlId: id,}).then(res => {
        this.detailsLoading = false
        this.detailsTableData = res.data
      })
          .catch(error => {
            this.detailsTableData = []
            this.detailsLoading = false
          })
    },
    openEdit(type, params) {
      this.getDetailsData(params.id)
      // let array = []

      // this.tableData.forEach(item => {
      //   if(item.id === params.id) {
      //     array.push(item)
      //   }
      // })

      // this.detailsTableData = deepCopy(array)
    },
  },
  mounted() {
    let showtime = (new Date()).valueOf();
    let that = this;

    if (!sessionStorage.getItem('nowtoken') || (sessionStorage.getItem('nowtoken') && showtime - sessionStorage.getItem('nowtime') > 3500000)) {
      getParameters({group: 'report-service'}).then(response => {
        axios.post('/reportserver/api/dataportal/Token', {
          grant_type: 'password',
          username: response.data.find(item => item.parameterCode == 'userId').parameterValue,
          password: response.data.find(item => item.parameterCode == 'password').parameterValue,
        }).then(res => {
          if (res.status == '200') {
            let time = (new Date()).valueOf();
            sessionStorage.setItem('nowtime', time);
            sessionStorage.setItem('nowtoken', res.data.access_token);
          }

        })
      })
    }
    // setTimeout(() => {
    //   axios.get(`/reportserver/api/report/list/trade-saas/huansi/qm_inspect_task_no`, {
    //     headers: {
    //       authorization: `Bearer ${sessionStorage.getItem('nowtoken')}`,
    //     },
    //   }).then(res => {
    //     that.showpop = res.data.data;
    //   })
    // }, 2000);
    setTimeout(() => {
      getParameters({group: 'report-service'}).then(response => {
        let data = {
          ServiceName: response.data.find(item => item.parameterCode == 'service-name').parameterValue,
          BillTypeNo: 'qm_inspect_task_no',
          TenantId: localStorage.getItem('taaaId')
        }

        let formData = new FormData();
        formData.append("params", JSON.stringify(data));

        authRsaParam(formData).then(res => {
          if (res.success) {
            axios.post(`/reportserver/api/report/list`, {Token: res.data.token}, {
              headers: {
                authorization: `Bearer ${sessionStorage.getItem('nowtoken')}`,
              },
            }).then(res => {
              that.showpop = res.data.data;
            })
          }
        })
      })
    }, 2000);
  },
}
</script>
<style lang="less">
.cleardefault {
  min-width: 130px !important;
  padding: 12px 0 !important;
}
</style>
<style scoped lang='less'>
/deep/ .el-form--inline .el-form-item {
  margin-right: 4px;
}

.z-content {
  height: (100vh - 100px) !important;
}

/deep/ .z-details-box {
  .el-card__body {
    height: calc(100vh - 120px) !important;
  }
}

.cleardefault {
  .setpopshow {
    & > div {
      width: 130px;
      // background: red;
      //padding-top: 6px;
      cursor: pointer;
      //padding-bottom: 6px;
      overflow: hidden; /*溢出隐藏*/
      text-overflow: ellipsis; /*以省略号...显示*/
      white-space: nowrap;

      &:hover {
        color: #1890ff !important;
        background: #EAF3FF !important;

      }
    }

    .setpopshowDiv {
      font-size: 13px;
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
    }
  }
}
</style>
