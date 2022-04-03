<template>
  <div id="zPage" class="quality-score-box">
    <div class="z-header">
      <div v-if="isEdit" class="z-header-button">
        <el-button plain @click="saveData" :disabled="loading">保存</el-button>
        <el-button plain @click="cancel">取消</el-button>
      </div>
      <div v-else class="z-header-button">
        <el-button plain @click="updateStatus">编辑</el-button>
        <el-button plain @click="cancel">返回</el-button>
      </div>
    </div>
    <div class="z-content" v-loading="loading">
      <el-card class="z-details-box">
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('basicShow', !basicShow)">
            <i :class="basicShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            基本信息
          </div>
          <div :class="['z-details-content-box', basicShow ? '' : 'details-height-none']">
            <form-list v-model="queryForm" :formConfig="formConfig" class="form"></form-list>
          </div>
        </div>
        <div class="z-details-content">
          <div class="z-details-icon" @click="isCancel('detailsShow', !detailsShow)">
            <i :class="detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
            等级列表
          </div>
          <div :class="['z-details-content-box', detailsShow ? '' : 'details-height-none']">
            <div v-if="isEdit" class="z-details-btn">
              <el-button size="mini" plain @click="addDetails">新增</el-button>
              <el-button size="mini" plain class="delButton" @click="deleteDetails">删除</el-button>
            </div>
            <div class="z-content-table">
              <common-table :class="{'zTable': isEdit}" ref="mainTable" :isSelectMore="true" :isSelection="true"
                            :tableColumn="tableColumn" :tableData="tableData"
                            @selePage="handleSelectionChange"></common-table>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import formList from '@/components/Form/formList'
import commonTable from '@/components/CommonTable'

import {saveData, editData, detailsData,} from '@/api/quality/score'
import {getMathIndex, checkFormData,} from "@/lib/common";

export default {
  name: '',
  components: {
    formList,
    commonTable,
  },
  props: {
    operateType: {
      type: String,
      default: 'add',
    },
    currentData: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      isEdit: false,
      queryForm: {},
      tableData: [],
      multipleSelection: [],
      deletedIdList: [],
      loading: false,
      basicShow: true,
      detailsShow: true,
    }
  },
  computed: {
    formConfig() {
      let isEdit = !this.isEdit
      let formItemList = [
        {
          key: 'gradeStandardName',
          type: 'input',
          subtype: 'text',
          label: '评分标准',
          isEdit,
          rules: {
            required: true, trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                this.$message.error('评分标准不能为空')
              }
            },
          },
        },
        {
          key: 'orderNumber',
          type: 'number',
          label: '排序号',
          isEdit,
          min: 1,
          max: 999999999,
          precision: 0,
        },
        {
          key: 'usable',
          type: 'checkbox',
          label: '是否可用',
          disabled: !this.isEdit,
        },
        {
          key: 'description',
          type: 'input',
          subtype: 'textarea',
          label: '描述',
          isEdit,
          maxlength: 200,
          attrs: {
            showWordLimit: true,
          },
        },
      ]

      return {
        inline: true,
        size: 'mini',
        labelWidth: 'auto',
        formItemList,
      }
    },
    tableColumn() {
      let isEdit = this.isEdit

      return [
        {
          label: '序号',
          type: 'index',
        },
        {
          label: '等级',
          prop: 'grade',
          isEdit: isEdit,
          config: {
            key: 'grade',
            type: 'input',
            subtype: 'text',
          },
        },
        {
          label: '最小评分',
          prop: 'minScore',
          align: 'right',
          isEdit,
          config: {
            key: 'minScore',
            type: 'number',
            min: 1,
            max: 999999999,
            precision: 0,
          },
        },
        {
          label: '最大评分',
          prop: 'maxScore',
          align: 'right',
          isEdit,
          config: {
            key: 'maxScore',
            type: 'number',
            min: 1,
            max: 999999999,
            precision: 0,
          },
        },
        {
          label: '创建人',
          prop: 'userName',
        },
        {
          label: '创建时间',
          prop: 'createTime',
        },
        {
          label: '备注',
          prop: 'remark',
          isEdit,
          maxlength: 200,
          config: {
            key: '',
            type: 'input',
            subtype: 'text',
          },
        },
      ]
    }
  },
  methods: {
    /**
     * @desc 对应组件显示隐藏
     */
    isCancel(key, bool) {
      this[key] = bool
    },
    /**
     * @desc 初始化数据
     */
    initData() {
      if (this.operateType === 'details') {
        this.isEdit = false
      } else {
        this.isEdit = true
      }
      if (this.operateType === 'add') {
        this.initQueryForm()
      } else {
        this.detailsData()
      }
    },
    /**
     * @desc 获取详情
     */
    detailsData() {
      this.loading = true
      let params = {
        id: this.currentData.id,
      }

      detailsData(params).then(res => {
        this.loading = false
        this.initQueryForm(res.data)
        this.tableData = res.data.list
      })
          .catch(error => {
            this.loading = false
            this.initQueryForm()
            this.tableData = []
          })
    },
    /**
     * @desc 初始化页面参数
     */
    initQueryForm(data = {}) {
      let basic = {
        gradeStandardName: '',
        description: '',
        usable: true,
        orderNumber: 1,
      }

      this.queryForm = {
        ...basic,
        ...data,
      }
    },
    /**
     * @desc 点击取消货返回
     */
    cancel() {
      this.$confirm('确认取消吗？', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('submit')
      }).catch(() => {

      });

    },
    /**
     * @desc 编辑或添加取对应值
     */
    getEditParams(type = 'add') {
      let params = {
            list: [],
            // scoreList: '',
          },
          objParams = {
            gradeStandardName: 'gradeStandardName',
            description: 'description',
            usable: 'usable',
            orderNumber: 'orderNumber',
            id: 'id',
          }

      Object.keys(objParams).forEach(item => {
        let value = this.queryForm[objParams[item]]

        if (typeof value != 'undefined' || value === 0) {
          params[item] = value
        }
      })

      let bool = this.tableData.some(item => {
        return item.grade === '' || typeof item.minScore === 'undefined' || typeof item.maxScore === 'undefined'
      })

      if (bool) {
        this.$message.error('有未编辑完的数据')
        return
      } else {
        params.list = this.tableData
      }

      if (type === 'edit') {
        params.deletedIdList = this.deletedIdList
      }
      return params
    },
    /**
     * @desc 点击添加或编辑
     */
    saveData() {
      let objFun = {
            add: saveData,
            edit: editData,
          },
          type = this.operateType === 'details' ? 'edit' : this.operateType

      if (objFun[type]) {
        if (!checkFormData(this.formConfig.formItemList, this.queryForm)) {
          return
        }
        let params = this.getEditParams(type)

        if (params) {
          if (params.list.length <= 0) {
            this.$message.error('请添加等级数据')
            return
          }
          this.loading = true
          objFun[type](params).then(res => {
            this.$message.success('操作成功')
            this.loading = false
            this.$emit('submit',)
          })
              .catch(() => {
                this.loading = false
              })
        }
      }
    },
    /**
     * @desc 更换当前状态
     */
    updateStatus() {
      this.isEdit = true
    },
    /**
     * @desc 新增明细
     */
    addDetails() {
      let obj = {
        grade: '',
        minScore: '',
        maxScore: '',
        remark: '',
        isIndex: getMathIndex(this.tableData, 'isIndex'),
      }

      this.clearSelct()
      this.tableData.push(obj)
    },
    /**
     * @desc 删除明细
     */
    deleteDetails() {
      let array = this.tableData

      this.multipleSelection.forEach(item => {
        if (item.id) {
          this.deletedIdList.push(item.id)
        }

        let index = array.findIndex(value => {
          if (item.id) {
            return item.id == value.id
          } else {
            return item.isIndex == value.isIndex
          }
        })

        if (index != -1) {
          array.splice(index, 1)
        }
      })
      this.tableData = array
      this.clearSelct()
    },
    /**
     * @desc 勾选复选框
     */
    handleSelectionChange(data) {
      this.multipleSelection = data
    },
    /**
     * @desc 清空选中数据
     */
    clearSelct() {
      if (this.$refs.mainTable) {
        this.$refs.mainTable.resetSelect();
      }
    },
  },
  created() {
    this.initData()
  },
}
</script>
<style lang="less">
</style>
