<template>
  <div class="popBox pop-count-box">
    <el-dialog
        title=""
        :visible="show"
        @close="close"
        destroy-on-close
        :close-on-click-modal="false"
    >
      <div class="content">
        <div class="pop-title-box">检验报告</div>
        <div class="pop-header-box">
          <div>
            <span>物料编号:</span>
            <span>{{ editAddData.materialNo }}</span>
          </div>
          <div>
            <span>物料名称:</span>
            <span>{{ editAddData.materialName }}</span>
          </div>
          <div>
            <span>颜色:</span>
            <span>{{ editAddData.colorName }}</span>
          </div>
          <div>
            <span>缸号:</span>
            <span>{{ editAddData.cardNo }}</span>
          </div>
          <div>
            <span>质检日期:</span>
            <span>{{ editAddData.billDate }}</span>
          </div>
        </div>
        <div class="pop-table-box">
          <div class="zTable">
            <main-table
                class="pop-table-content"
                ref="mainTable"
                :isMain="true"
                :tableColumn="tableColumn"
                :tableData="editAddData.list || []"
                :loading="loading"
                :isSelection="false"
               :table-height="600"
            />
            <div class="pop-desc-box">
              <form-list v-model="queryForm" :formConfig="formConfig"></form-list>
            </div>
          </div>

        </div>

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit" :disabled="loading">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {comReview,} from '@/api/quality/qualityReport'
import MainTable from "@/components/CommonTable";
import formList from '@/components/Form/formList'

export default {
  components: {
    MainTable,
    formList,
  },
  name: '',
  data() {
    return {
      //当前编辑条件
      queryForm: {
        content: '',
      },
      formConfig: {
        inline: false,
        size: 'mini',
        labelWidth: 'auto',
        formItemList: [
          {
            label: '综合描述',
            key: 'content',
            type: 'input',
            subtype: 'textarea',
            maxlength: 200,
            attrs: {
              showWordLimit: true,
            },
          }
        ],
      },
      show: true,
      loading: false,
      tableColumn: [
        {
          label: '卷号',
          prop: 'rollNumber',
          align: 'center',
          width: 60,

        },
        {
          label: '原长',
          prop: 'taskDtlQty',
          align: 'center',
          width: 60,

        },
        {
          label: '实长',
          prop: 'qty',
          align: 'center',
          width: 60,

        },
        {
          label: '重量',
          prop: 'weight',
          align: 'center',
          width: 60,

        },
        {
          label: '疵点信息',
          prop: 'list',
          align: 'center',
          width: 600,
          showOverflowTooltip: true,
          tableColumn: [
            {
              width: 60,
              label: '位置',
              prop: 'startPosition',
            },
            {
              width: 60,
              label: '疵点',
              prop: 'defectNo',
            },
            {
              width: 60,
              label: '扣分',
              prop: 'point',
            },
          ],
          tableType: 'vertical',
        },
        {
          label: '疵点个数',
          prop: 'count',
          align: 'center',
        },
        {
          label: '总扣分',
          prop: 'totalPoint',
          align: 'center',
        },
        {
          label: '等级',
          prop: 'grade',
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
        },
      ],
    }
  },
  computed: {},
  props: {
    editAddData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    config: {
      type: Object,
      default: () => {
        return {
          show: false,
        }
      }
    },
  },
  created() {
    // this.initData()
  },
  methods: {
    /**
     * @desc 关闭弹窗
     */
    close() {
      this.$emit('close', false)
    },
    /**
     * @desc 点击保存
     */
    submit() {
      if (this.queryForm.content) {
        this.loading = true
        let params = {
          taskDtlId: this.editAddData.id,
          comprehensiveReview: this.queryForm.content,
        }
        comReview(params).then(res => {
          this.loading = false
          this.close()
          this.$emit('submit')
        })
            .catch(() => {
              this.loading = false
            })
      } else {
        this.$message.error('请输入描述内容')
      }
    },
  },
  mounted() {
  },
}
</script>
<style lang="scss">
.pop-count-box {
  .el-dialog {
    width: 80% !important;
    max-height: inherit !important;
    height: 90%;
  }

  .pop-title-box {
    height: 30px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }

  .pop-header-box {
    display: flex;
    height: 35px;
    line-height: 35px;

    & > div {
      font-size: 12px;
      color: #374256;
      width: 50%;

      span:last-child {
        margin-left: 10px;
        // color: #374256;
      }
    }
  }
}
</style>
