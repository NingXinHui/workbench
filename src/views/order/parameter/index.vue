<template>
    <div id="zPage">
        <div class="wareH" style="height: 32px;line-height: 28px;">
            <span class="span" style="line-height: 28px;">应付款单提前</span>
            <el-input v-model="InInput" placeholder="请输入内容"></el-input>
            <span class="spanC">天提醒（限输入正数，支持保留1位有效数字）</span>
        </div>
        <div class="wareH">
            <span class="span">是否允许超发</span>
            <el-checkbox-group v-model="outList" @change="handleoutList">
                <el-checkbox label="是"></el-checkbox>
                <el-checkbox label="否"></el-checkbox>
  `         </el-checkbox-group>
            <span class="spanC">（若是：入库数量可大于采购数量加溢装数量；若否：入库数量只能小于或等于采购数量加溢装数量）</span>
        </div>
        <div class="wareH">
            <span class="span" style="">审批方式</span>
            <el-checkbox-group v-model="electronList" @change="handleelectronList">
                <el-checkbox label="电子审批"></el-checkbox>
                <el-checkbox label="手动审批"></el-checkbox>
  `         </el-checkbox-group>
            <span class="spanC">手动审批</span>
            <span class="spanC">（若电子审批：需要走审批流转，提交后上传电子审批中心，单据状态：草稿、审核中、已审核；若手动审批：提交即已审核，撤回则退回草稿状态，单据状态：草稿、已审核）</span>
        </div>
        <div class="wareH">
            <span class="span">保存后是否提示提交</span>
            <el-checkbox-group v-model="tiJList" @change="handletiJList">
                <el-checkbox label="是"></el-checkbox>
                <el-checkbox label="否"></el-checkbox>
  `         </el-checkbox-group>
            <span>(若是：则新增/编辑保存时提示是否提交选择；若否：则不进行提示)</span>
        </div>
    </div>
</template>
<script>
export default {
    name:'index',
    data(){
        return{
            InInput:'',
            outList:['是'],
            countInput:'',
            countList: ['乘法'],
            tiJList:['是'],
            electronList:['电子审批']
        }
    },
    mounted(){

    },
    methods:{
        handleinList(e){
            let del_row = e.shift();
        },
        handleoutList(e){
            let del_row = e.shift();
        },
        handlecountList(e){
            let del_row = e.shift();
        },
        handleelectronList(e){
            let del_row = e.shift();
        },
        handletiJList(e){
            let del_row = e.shift();
        },

    }
}
</script>
<style lang="less" scoped>
.wareH{
    display: flex;
    font-size: 12px;
    margin-left: 31px;
    padding-top: 9px;
    .el-input{
        width: 190px;
        height: 26px;
        margin-right: 7px;
    }
    .el-input__inner{
        height: 26px;
    }
    .span{
        width: 140px;
        display: inline-block;
        text-align: right;
        line-height:17px;
        margin-right: 7px;
    }
    .spanC{
        // line-height: 26px;
    }
    .el-checkbox{
        color: #000;
    }
    /deep/.el-checkbox__label{
        font-size: 12px;
        width: 65px;
        padding-left: 5px;
    }
}
</style>


