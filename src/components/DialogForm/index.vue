<template>
<div class="popBox">
    <el-dialog
        :title="config.title"
        :visible="show"
        @close="close"
        destroy-on-close
        :close-on-click-modal="false"
    >
        <div class="content">
            <div :class="isAudit ? 'audit-pop-box' : 'form'">
                <form-list v-model="queryForm" :formConfig="formConfig" ref="form"></form-list>
            </div>
            <slot></slot>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" v-if="config.type!='look'" @click="submit" :disabled="editLoading">确 认</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
import { deepCopy, checkFormData, } from "@/lib/common"

import formList from '@/components/Form/formList.vue'
export default {
    components: {
        formList,
    },
    name: '',
    data() {
        return {
            //当前编辑条件
            queryForm: {
            },
            show: true,
        }
    },
    computed: {
    },
    props: {
        config: {
            type: Object,
            default: () => {
                return {
                    title: '',
                    show: false,
                    type: 'add',
                }
            }
        },
        editData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        formConfig: {
            type: Object,
            default: () => {
                return {}
            }
        },
        isAudit: {
            type: Boolean,
            default: false,
        },
        editLoading: {
            type: Boolean,
            default: false,
        },
    },
    created() {
        this.initData()
    },
    methods: {
        /**
         * @desc 初始化数据
         */
        initData() {
            this.queryForm = deepCopy(this.editData)
        },
        /**
         * @desc 修改当前部分数据
         */
        updateData(data = {}) {
            this.queryForm = {
                ...this.queryForm,
                ...data,
            }
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
            let formItemList = this.formConfig.formItemList,
                bool = checkFormData(formItemList, this.queryForm)

            if(bool) {
                this.$emit('submit', this.queryForm)
            }
        },
    },
    mounted() {
    },
}
</script>
<style lang="scss">
.audit-pop-box {
    height: 180px;

    .el-form-item__label {
        font-weight: 400;   
        font-size: 12px;
    }

    .el-form-item__content {
        height: 160px;
        margin-left: 0 !important;

        .el-textarea, 
        .el-textarea__inner {
            height: 100%;
        }
    }
}
</style>
