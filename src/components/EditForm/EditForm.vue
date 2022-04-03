<script>

export default {
  name: 'EditForm',
  props:{
    item:{
      type:Object,
      default(){
        return{}
      }
    }
  },
  data () {
    return {
      model:this.item.value,
      field:this.item.props
    }
  },
  mounted() {
  },
  methods:{
    //组装数据结构供外部使用
    returnData(){
      return {
        key: this.field,
        value: this.model
      }
    },
    handleChange(e){
      this.$emit('handleChange',[e,this.item])
    }
  },
  watch:{
    // model(val){
    //  console.log(this.returnData())
    // }
  },

  render () {
    return <div>
      <el-input
          readonly={this.item.readOnly}
          clearable
          onchange={(e)=>this.handleChange(e)}
          v-model={this.model}
      ></el-input>
    </div>

  }
}
</script>
