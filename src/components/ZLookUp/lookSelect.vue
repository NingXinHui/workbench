<template>
<div id="look-up-box">
    <el-dialog
        :title="config.title"
        :visible="show"
        @close="close"
        destroy-on-close
        width="750px"
        :close-on-click-modal="false"
    >
        <div class="content">
            <div class="form">
                <form-list v-model="queryForm" :formConfig="formConfig" ref="form">
                    <el-form-item>
                        <el-button type="primary" @click="searchData">查询</el-button>
                        <el-button type="primary" @click="resetParams">重置</el-button>
                    </el-form-item>
                </form-list>
            </div>
            <div class="pop-table-box">
                <main-table
                    class="pop-table-content"
                    ref="mainTable"
                    :loading="loading"
                    :isSelection="false"
                    :isMain="true"
                    :tableColumn="tableColumn"
                    :tableData="tableData"
                    :tableheight="200"
                    :isRowClick="true"
                    @selePage="rowClick"
                />
                <div class="pop-table-lable">{{topLable}}</div>
                <main-table
                    class="pop-table-content"
                    ref="addMainTable"
                    :isMain="true"
                    :tableColumn="addTableColumn"
                    :tableData="addTableData"
                    :isSelection="false"
                    :tableheight="200"
                    :isRowClick="true"
                    @selePage="rowAddClick"
                />
            </div>
        </div>
        
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">确 认</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
import formList from '@/components/Form/formList.vue'
import MainTable from "@/components/CommonTable";
import { getMathIndex, checkExistData, deepCopy, } from "@/lib/common";

export default {
    components: {
        formList,
        MainTable,
    },
    name: '',
    data() {
        return {
            //当前编辑条件
            queryForm: {
            },
            show: false,
            tableData: [],
            addTableData: [],
            multipleSelection: [],
            loading: false,
        }
    },
    computed: {
        formConfig() {

            return {
                inline: true,
                size: 'mini',
                formItemList: this.formItemList,
            }
        },
    },
    props: {
        config: {
            type: Object,
            default: () => {
                return {
                    show: false,
                    title: '',
                }
            }
        },
        formItemList: {
            type: Array,
            default: () => {
                return []
            }
        },
        tableColumn: {
            type: Array,
            default: () => {
                return []
            },
        },
        //已加入的
        addTableColumn: {
            type: Array,
            default: () => {
                return []
            },
        },
        //接口查询方法
        method: {
            type: Function,
        },
        params: {
            type: Object,
            default: () => {
                return {

                }
            }
        },
        topLable: {
            type: String,
            default: '已选订单'
        },
    },
    created() {
        this.resetParams()
    },
    methods: {
        /**
         * @desc 重置参数
         */
        resetParams() {
            let obj = {}

            this.formItemList.forEach(item => {
                if(item.type == 'number') {
                    obj[item.key] = undefined
                } else {
                    obj[item.key] = ''
                }
            })
            
            this.queryForm = obj
            this.searchData()
        },
        //单击事件
        rowClick(val, type) {
            if(type) {
                let obj = deepCopy(val)

                obj.isIndex = getMathIndex(this.addTableData, 'isIndex'),
                
                this.addTableData.push(obj)
            }
        },
        //已添加点击事件
        rowAddClick(val) {
            let array = this.addTableData

            let index = array.findIndex(value => {
                return val.isIndex == value.isIndex
            })

            if(index != -1) {
                array.splice(index, 1)
            }

            this.addTableData = array
        },
        /**
         * @desc 查询数据
         */
        searchData() {
            let params = {
                    ...this.queryForm,
                    ...this.params,
                },
                array = []
                
            this.loading = true
            this.method(params).then((res) => {
                this.loading = false

                if (res.data.records !== undefined) {
                    array = res.data.records;
                } else {
                    array = res.data;
                }
                
                this.tableData = array
            })
            .catch(() => {
                this.loading = false
                this.tableData = array
            })
        },
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
            if(this.addTableData.length <= 0) {
                this.$message.error('请选择操作项')
                return
            }
            this.close()
            this.$emit('submit', this.addTableData)
        },
    },
    mounted() {
        this.show = true
    },
}
</script>
<style lang="less" scoped>
.pop-table-lable {
    height: 30px;
    line-height: 30px;
}
</style>
