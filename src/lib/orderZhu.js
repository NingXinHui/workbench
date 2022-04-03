import { checkExistData, } from '@/lib/common'
export default {
    data() {
        return {

        }
    },
    methods: {
        /**
         * @desc 打印数据待修改
         */
        printCommonData() {

        },
        /**
         * @desc 导出数据待修改
         */
        exportCommonData() {

        },
        /**
         * @desc 选择条数校验
         */
        checkOperation(type, array = [], key, value) {
            let bool = true,
                count = array.length,
                title = '';
            

            switch(type) {
                case 'edit':
                case 'submit':
                case 'withdraw':
                    if (count != 1) {
                        title = '不能对多条信息同时操作'
            
                        if(count < 1) {
                            title = '请选择操作项'
                        }
                        bool = false 
                    } else {
                        let index = array.findIndex(item => {
                            return value.includes(item[key])
                        })

                        if(index != -1) {
                            title = type === 'edit' ? '当前操作项不能做编辑操作' : (type === 'submit' ? '所选操作项中存在不可提交操作的项' : '所选操作项中存在不可撤回操作的项')
                            bool = false
                        }
                    }
                    break;
                case 'delete':
                    if(count < 1) {
                        title = '请选择操作项'
                        bool = false
                    } else {
                        let index = array.findIndex(item => {
                            return value.includes(item[key])
                        })
                        if(index != -1) {
                            title = '所选操作项中存在不可删除操作的项'
                            bool = false
                        }
                    }
                    break;
            }
            
            if(!bool) {
                this.$message({
                    message: title,
                    type: "error",
                    showClose: true
                })
            }
            return bool
        },
    },
}