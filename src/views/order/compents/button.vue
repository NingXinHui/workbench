<!--
@time:2021/9/29
@author:zhupeikang
-->
<template>
  <div class="zPage" >
    <!--审核弹窗-->
    <div class="popBox">
      <el-dialog title="审核" @close="()=>{reason=''}" :close-on-click-modal="false" :visible.sync="auditDialog">
        <div class="content">
          <div style="font-size: 12px;"><span style="color: #ED5751">*</span><span>审核原因</span></div>
          <div style="margin-top: 4px">
            <el-input
                :rows="10"
                type="textarea"
                placeholder="请输入"
                v-model="reason"
                maxlength="50"
                show-word-limit
            >
            </el-input>
          </div>
        </div>
        <div slot="footer" style="margin-top: 8px">
          <el-button @click="auditDialog=false">取消</el-button>
          <el-button type="primary" @click="audit" >确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Mixin from "@/lib/vuex-mixin";
import {order_add, order_audit, order_audit_cancel, order_edit} from "@/api/order";
import {deepCopy} from "@/lib/common";

const {mapGetters, mapActions} = new Mixin('order').getHelper()

export default {
  name: "OrderButton",

  components: {},

  mixins: [],

  props: {
      formData:{
        type:Object,
        default:()=>{}
      },
    currentId:{
        type:String,
      default:''
    }
  },

  data() {
    return {
      reason:'',
      form:{},
      auditDialog:false
    }
  },
  computed: {
    ...mapGetters(['isEdit','isAdd'])
  },

  watch: {},

  beforeCreat() {

  },
  methods:{
    //审核按钮
    auditOpen(){
      this.auditDialog=true
    },
    //审核操作
    audit(){
      if (this.reason==''){
        this.$message.error('审核原因为必填')
        return
      }
      order_audit({id:this.currentId}).then(res=>{
        if (res.success){
          this.$message.success('审核成功')
          this.auditDialog=false
        }
      })
    },
    //反审核
    auditCancel(){
      this.$confirm('确认取消审核中的数据吗？', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        order_audit_cancel({id:this.currentId}).then(res=>{
          if (res.success){
            this.$message.success('反审核成功')
          }
        })
      }).catch(() => {
      });

    },
    ...mapActions(['setShowType']),
    edit(){
     this.setShowType(['edit',true])
    },
    cancel(){
      this.setShowType(['list',false])
    },
    save(){
      this.form=this.formData
      let data=deepCopy(this.form)
      data.dtlList.map(item=>{
        if (item.isEdit && item.index) {
          delete item.id
        }
        delete item.isEdit
        delete item.index
      })
      if (this.isAdd){
        order_add(data).then(res=>{
          if (res.success){
            this.$message.success('新增成功')
          }
        })
      }else {
        order_edit(data).then(res=>{
          if (res.success){
            this.$message.success('编辑成功')
            this.setShowType(['list',false])
          }
        })
      }

    }
  },
  created() {

  },

  beforeMount() {
  },

  mounted() {

  },

  beforeUpdate() {

  },

  updated() {

  },

  activated() {

  },

  deactivated() {

  },

  beforeDestroy() {

  },

  destroyed() {
  }


}
</script>

<style scoped>

</style>
