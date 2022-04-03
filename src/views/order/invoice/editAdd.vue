<template>
    <div id="zPage" class="quality-qualityTask-box">
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
                        基础数据
                    </div>
                    <div :class="['z-details-content-box','resetdate', basicShow ? '' : 'details-height-none']">
                        <form-list v-model="queryForm" :formConfig="formConfig" class="form" ref="formBasic"></form-list>
                    </div>
                </div>
                <div class="z-details-content">
                    <div class="z-details-icon" @click="isCancel('detailsShow', !detailsShow)">
                        <i :class="detailsShow ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
                        明细信息
                    </div>
                    <div :class="['z-details-content-box', detailsShow ? '' : 'details-height-none']">
                        <div v-if="isEdit" class="z-details-btn">
                            <el-button plain class="delButton" @click="deleteDetails">删除</el-button>
                            <el-button plain @click="importData">导入</el-button>
                            
                        </div>
                        <div class="z-content-table">
                            <common-table :class="{'zTable': isEdit}" ref="mainTable" :isSelectMore="true" :isSelection="true" :tableColumn="tableColumn" :tableData="tableData" @selePage="handleSelectionChange"></common-table>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <div>
            <look-up title="工人选择" :visible.sync="visible" :params='look.params' @setCheckItem="setCheckItem" :method="look.methods" :table-column="look.tableColumn" :search-arr="look.searchArr" ></look-up>
        </div>
    
    </div>
</template>
<script>
import formList from '@/components/Form/formList'
import commonTable from '@/components/CommonTable'

import lookUp from '@/components/ZLookUp/lookUpImport'

// import { saveData, editData, detailsData, selectWorkList, importSellData, importMaterialData, importPurchaseData, importOutsourceData, } from '@/api/quality/qualityTask'
// import { queryAllData, } from '@/api/quality/testType'
import { getMathIndex,} from "@/lib/common"
// import {

//   UnWorkerListG
// } from "@/api/xsApi/api"

export default {
    name: '',
    components: {
        formList,
        commonTable,
        
        lookUp,
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
            visible:false,
            look:{
        params:{
          workShopId:''
        },
        tableColumn: [
          {
            type:'index',
            label:'序号',
          },
          {
            prop: "workerNo",
            label: "工人编号",
          },{
            prop: "workerName",
            label: "工人名称",
          },{
            prop: "workShopName",
            label: "所属车间",
          },{
            prop: "workGroupName",
            label: "所属班组",
          },{
            prop: "workTypeName",
            label: "所属工种",
          }
        ],
        searchArr:[{
          label: '工人编号',
          field: 'workerNo',
          type: 1,
          maxLength: '20'
        },{
          label: '工人名称 ',
          field: 'workerName',
          type: 1,
          maxLength: '20'
        }],
        // methods:UnWorkerListG
        methods:'',

      },
            isEdit: false,
            loading: false,
            queryForm: {},
            deletedIdList: [],
            tableData: [],
            multipleSelection: [],
            testCategoryList: [],
            workShowList: [],
            popConfig: {
                show: false,
            },
            basicShow: true,
            detailsShow: true,
            currentOperateType: '',
            popOperateTypeList:[],
            // 明细字段对应值
         
            selectShow: false,
        }
    },
    computed: {
        tableColumn() {
            let isEdit = this.isEdit
            
            return [
                {
                    label: '序号',
                    type: 'index',
                },
                {
                    label: '质检任务号',
                    prop: 'taskNo',
                },
                {
                    label: '来源单号',
                    prop: 'sourceNo',
                },
                {
                    label: '源单类型',
                    prop: 'sourceType',
                },
                {
                    label: '来源核算项目',
                    prop: 'sourceCheckItemName',
                },
                {
                    label: '物料编码',
                    prop: 'materialNo',
                },
                {
                    label: '物料名称',
                    prop: 'materialName',
                },
                {
                    label: '描述',
                    prop: 'specification',
                },
                {
                    label: '颜色',
                    prop: 'colorName',
                    isEdit,
                    config: {
                        key: 'colorName',
                        type: 'input',
                        subtype: 'text',
                    },
                },
                {
                    label:'花型号',
                    prop: 'patternNo',
                    isEdit,
                    config: {
                        key: 'patternNo',
                        type: 'input',
                        subtype: 'text',
                    },
                },
                {
                    label: '批次',
                    prop: 'materialLot',
                    isEdit,
                    config: {
                        key: 'materialLot',
                        type: 'input',
                        subtype: 'text',
                    },
                },
                {
                    label: '任务数量',
                    prop: 'qty',
                    isEdit,
                    config: {
                        key: 'qty',
                        type: 'number',
                        min: 1,
                        max: 999999999,
                        precision: 0,
                    },
                },
                {
                    label: '计量单位',
                    prop: 'unitNo',
                    isEdit,
                    config: {
                        key: 'remark',
                        type: 'input',
                        subtype: 'text',
                    },
                },
                {
                    label: '匹数',
                    prop: 'rollCount',
                },
                {
                    label: '指定机台',
                    prop: 'equipmentNo',
                    isEdit,
                    config: {
                        key: 'equipmentNo',
                        type: 'input',
                        subtype: 'text',
                    },
                },
                {
                    label: '交期',
                    prop: 'deliveryDate',
                    isEdit,
                    config: {
                        key: 'deliveryDate',
                        type: 'date',
                        subtype: 'date',
                        valueFormat: 'yyyy-MM-dd',
                    },
                },
                {
                    label: '备注',
                    prop: 'remark',
                    isEdit,
                    config: {
                        key: 'remark',
                        type: 'input',
                        subtype: 'text',
                    },
                },
            ]
        },
        formConfig() {
            let isEdit = !this.isEdit
            let formItemList = [
                {
                    key: 'billNo',
                    type: 'input',
                    subtype: 'text',
                    label: '通知单号',
                    disabled: true,
                    isEdit,
                    rules: { required: true,showmessage:true, message: '必填项不能为空', trigger: 'change' },
                },
                {
                    key: 'salesName',
                    type: 'date',
                    subtype: 'date',
                    label: '发货日期',
                    isEdit,
                    rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                {
                    key: isEdit ? 'workShopName' : 'checkItemId',
                    type: 'select',
                    label: '客户',
                    isEdit,
                    options:this.workShowList,
                    rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                   {
                    key: 'billNo',
                    type: 'input',
                    subtype: 'text',
                    label: '客户联系方式',
                    isEdit,
                    rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                 {
                    key: isEdit ? 'workShopName' : 'checkItemId',
                    type: 'select',
                    label: '销售员',
                    isEdit,
                    options:[],
                    rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                 {
                    key: isEdit ? 'workShopName' : 'checkItemId',
                    type: 'select',
                    label: '销售组',
                    isEdit,
                    options:[],
                    rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                 {
                    key: isEdit ? 'workShopName' : 'checkItemId',
                    type: 'select',
                    label: '提货方式',
                    isEdit,
                    options:[],
                    rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                 {
                    key: 'billNo',
                    type: 'input',
                    subtype: 'text',
                    label: '收货人',
                    isEdit,
                    rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                 {
                    key: isEdit ? 'workShopName' : 'checkItemId',
                    type: 'select',
                    label: '结算方式',
                    isEdit,
                    options:[],
                    rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                 {
                    key: 'billNo',
                    type: 'input',
                    subtype: 'text',
                    label: '收货电话',
                    isEdit,
                    // rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                 {
                    key: 'billNo',
                    type: 'input',
                    subtype: 'text',
                    label: '质量要求',
                    isEdit,
                    // rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                 {
                    key: 'billNo',
                    type: 'input',
                    subtype: 'text',
                    label: '收货地址',
                    isEdit,
                    // rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
                 {
                    key: 'billNo',
                    type: 'input',
                    subtype: 'text',
                    label: '备注',
                    isEdit,
                    // rules: { required: true, message: '必填项不能为空', trigger: 'change' },
                },
               
            ]

            return {
                inline: true,
                size: 'mini',
                labelWidth: 'auto',
                formItemList,
            }
        },
   
    },
    created() {
        this.selectWorkList()
    },
    methods: {
        /**
         * @desc 对应组件显示隐藏
         */
        isCancel(key, bool) {
            this[key] = bool
        },
        /**
         * @desc 获取检验类型下拉数据
         */
        queryAllData() {
            // queryAllData().then(res => {
            //     res.data.forEach(item => {
            //         item.label = item.inspectCategory
            //         item.value = item.id
            //     })
            //     this.testCategoryList = res.data
            //     this.initData()
            // })
            // .catch(() => {
            //     this.testCategoryList = []
            //     this.initData()
            // })
        },
        /**
         * @desc 获取检验类型下拉数据
         */
        selectWorkList() {
            selectWorkList().then(res => {
                res.data.forEach(item => {
                    item.label = item.workShopName
                    item.value = item.id
                })
                this.workShowList = res.data
                this.queryAllData()
            })
            .catch(() => {
                this.workShowList = []
                this.queryAllData()
            })
        },
        /**
         * @desc 初始化数据
         */
        initData() {
            if(this.operateType === 'details') {
                this.isEdit = false
            } else {
                this.isEdit = true
            }
            if(this.operateType === 'add') {
                this.initQueryForm()
            } else {
                this.detailsData()
            }
        },/**
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
            })
            .catch(error => {
                this.loading = false
                this.initQueryForm()
            })
        },
        /**
         * @desc 初始化页面参数
         */
        initQueryForm(data = {}) {
            let basic = {
                billNo: '',
                inspectCategoryId: '',
                checkItemId: '',
                salesName: '',
                remark: '',
            }

            this.queryForm = {
                ...basic,
                ...data,
            }

            if(data.list) {
                this.tableData = data.list

                if(data.list.length > 0) {
                    
                    let index = this.popOperateTypeList.findIndex(item => {
                        return item.label === data.list[0].sourceType
                    })

                    if(index != -1) {
                        this.currentOperateType = this.popOperateTypeList[index].value
                    }
                }
            }
        },
        /**
         * @desc 点击取消货返回
         */
        cancel() {
            this.$emit('submit')
        },
        /**
         * @desc 更换当前状态
         */
        updateStatus() {
            this.isEdit = true
        },
        /**
         * @desc 编辑或添加取对应值
         */
        getEditParams(type = 'add') {
            let params = {
                    list: [],
                },
                objParams = {
                    billNo: 'billNo',
                    inspectCategoryId: 'inspectCategoryId',
                    checkItemId: 'checkItemId',
                    salesName: 'salesName',
                    remark: 'remark',
                    id: 'id',
                }
                   
            Object.keys(objParams).forEach(item => {
                let value = this.queryForm[objParams[item]]

                if(typeof value != 'undefined' || value === 0) {
                    params[item] = value
                }
            })

            // let bool = this.tableData.some(item => {
            //     return item.grade === '' || typeof item.minScore === 'undefined' || typeof item.maxScore === 'undefined'
            // })

            // if(bool) {
            //     this.$message.error('有未编辑完的数据')
            //     return
            // } else {
                params.list = this.tableData
            // }
            
            if(type === 'edit') {
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
            type = this.operateType === 'details' ? 'edit' : this.operateType;


            // 判断下上面的是否都是必填的  
            if(!this.$refs.formBasic.submit()){
                return 
            }


            if(objFun[type]) {
                let params = this.getEditParams(type);

                if(params) {
                    if(params.list.length <= 0) {
                        this.$message.error('请添加明细信息')
                        return
                    }
                    params.billStatus = 0
                    params.usable = true
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
         * @desc 删除明细
         */
        deleteDetails() {
            let array = this.tableData
            
            this.multipleSelection.forEach(item => {
                if(item.id) {
                    this.deletedIdList.push(item.id)
                }

                let index = array.findIndex(value => {
                    if(item.id) {
                        return item.id == value.id
                    } else {
                        return item.isIndex == value.isIndex
                    }
                })

                if(index != -1) {
                    array.splice(index, 1)
                }
            })
            this.tableData = array
            this.clearSelct()
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
         * @desc 勾选复选框
         */
        handleSelectionChange(data) {
            this.multipleSelection = data
        },
        /**
         * @desc 点击导入数据
         */
        importData() {
            // this.operateType === 'add' && 
            // if(this.tableData.length <= 0) {
            //     this.currentOperateType = ''
            //     this.selectShow = true
            // } else {
            //     this.selectShow = false
            //     this.popConfig.show = true
            // }
            this.visible=true
        },

        setCheckItem(value){
           let newarr=value.map(item=>{
               let {id,...other}=item;
               return item
           })
           this.tableData=[...this.tableData,...newarr]

        },
        /**
         * @desc 选择导入类型
         */
        typeChange() {
            this.popConfig.show = true
            this.selectShow = false
        },
        /**
         * @desc 目标弹框选择
         */
      
    },
}
</script>
<style lang="less" >
.quality-qualityTask-box {
    .z-details-content-box {
        .form {
            width: 1440px;
            .form-textarea .el-form-item__content {
                width: 89% !important;
            }
        }
    }
}

</style>
<style lang="less" scoped>
.resetdate{
    /deep/ .el-form-item__content{
        width: 180px !important;
    }
    /deep/ .el-date-editor{
        input{
            padding-left: 24px !important;
        }
    } 
    /deep/ .el-form-item:last-child{
        width:100%;
        input{
            width:1280px !important;
        }
    }
   /deep/ .el-form-item:nth-child(11){
       width:100%;
        input{
            width:1280px !important;
        }

   }
   /deep/ .el-form-item:nth-child(12){
       width:100%;
        input{
            width:1280px !important;
        }

   }

}
</style>