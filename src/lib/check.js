const check = {
    methods: {
        // 校验移动电话号码格式
        validateMobile(value){
            const reg = /^1[3456789]\d{9}$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入正确的联系电话',type: 'error'});
                return false;
            }
            return true;
        },
        
        // 校验固定电话号码格式
        validateTel(value){
            const reg = /^[0-9-]{7,25}$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入正确的固定电话号码',type: 'error'});
                return false;
            }
            return true;
        },
        
        // 校验手机号码和固定电话号码格式
        validateMobileAndTel(value){
            const reg = /^1[34578]\d{9}$|^1[34578]\d{9}$|^0\d{2,3}-?\d{7,8}$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入正确的手机号码或固定电话号码',type: 'error'});
                return false;
            }
            return true;
        },

        // 校验数字
        validateNumber(value){
            const reg = /^[0-9]*$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入数字',type: 'error'});
                return false;
            }
            return true;
        },
        
        // 校验整数
        validateInteger( value){
            const reg = /^-?[0-9]\d*$/;
            if (!reg.test(value)) {
                return this.$message({message: '请输入整数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // 校验非零整数
        validateNonzeroInteger(value){
            const reg = /^-?[1-9]\d*$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入非零整数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验正整数
        validatePositiveInteger(value){
            const reg = /^[1-9]\d*$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入正整数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验非正整数
        validateNonpositiveInteger(value){
            const reg = /^-[1-9]\d*|0$/;
            if (!reg.test(value)) {
                return this.$message({message: '请输入非正整数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // 校验负整数
        validateNegtiveInteger(value){
            const reg = /^-[1-9]\d*$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入负整数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // 校验非负整数
        validateNonnegtiveInteger(value){
            const reg = /^[1-9]\d*|0$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入非负整数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验小数
        validateDecimal(value){
            const reg = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入小数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验正小数
        validatePositiveDecimal(value){
            const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+))$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入正小数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验非正小数
        validateNonpositiveDecimal(value){
            const reg = /^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入非正小数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验负小数
        validateNegtiveDecimal(value){
            const reg = /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入负小数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验非负小数
        validateNonnegtiveDecimal(value){
            
            const reg = /^\d+(\.\d+)?$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入非负小数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验正纯小数
        validatePositivePureDecimal(value){
            const reg = /^0\.\d*[1-9]\d*$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入正纯小数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验非负纯小数
        validateNonnegtivePureDecimal(value){
            const reg = /^0\.\d*[1-9]\d*|0$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入非负纯小数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验非负纯小数(小数点后最多保留一位)
        validateNonnegtivePureDecimalLimit1(value){
            const reg = /^(0\.[1-9]|0?)$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入非负纯小数(小数点后最多保留一位)',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验整数和小数
        validateIntegerAndDecimal(value){
            const reg = /^(([^0][0-9]+|0)\.([0-9]*)$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]*)$)|^(([1-9]+)$)/;
            if (!reg.test(value)) {
                this.$message({message: '请输入整数或小数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验整数和小数(小数点后最多保留一位)
        validateIntegerAndDecimalLimit1(value){
            const reg = /^(([^0][0-9]+|0)\.([0-9]?)$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]?)$)|^(([1-9]+)$)/;
            if (!reg.test(value)) {
                this.$message({message: '请输入整数或小数(小数点后最多保留一位)',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验整数和小数(小数点后最多保留两位)
        validateIntegerAndDecimalLimit2(value){
            const reg = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/;
            if (!reg.test(value)) {
                this.$message({message: '请输入整数或小数(小数点后最多保留两位)',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验非负的整数和小数
        validateNonnegativeIntegerAndDecimal(value){
            const reg = /^([1-9]\d*|\d)(.\d*)?$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入非负的整数或小数',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验非负的整数和小数(小数点后最多保留一位)
        validateNonnegativeIntegerAndDecimalLimit1(value){
            const reg = /^([1-9]\d*|\d)(.\d?)?$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入非负的整数或小数(小数点后最多保留一位)',type: 'error'});
                return false;
            }
            return true;
        },
        
        // // 校验非负的整数和小数(小数点后最多保留两位)
        validateNonnegativeIntegerAndDecimalLimit2(value){
            const reg = /^([1-9]\d*|\d)(.\d{1,2})?$/;
            if (!reg.test(value)) {
                this.$message({message: '请输入非负的整数或小数(小数点后最多保留两位)',type: 'error'});
                return false;
            }
            return true;
        },
        // // 校验金额格式，首位不为0，最多2位小数
        validateAmount(value){
            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)) {
                this.$message({message: '请输入正确的金额，首位不能为0，最多2位小数',type: 'error'});
                return false;
            }
            return true;
        }
    }
}
export default check