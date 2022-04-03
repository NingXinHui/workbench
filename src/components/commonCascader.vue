<template>
  <div class="commoncascader">
    <el-cascader :options="options"
                 v-model="selectedOptions"
                 @change="handleChange"
                 placeholder="">
    </el-cascader>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  props: {
    linkAddress: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options: regionData,
      selectedOptions: [],
    }
  },
  computed: {

  },
  created () {

  },
  mounted () {
    this.getTextToCode()
  },
  watch: {

  },
  methods: {
    getCodeToText (codeArray) {
      if (!codeArray) {
        return null
      }
      let area = "";
      switch (codeArray.length) {
        case 1:
          area += CodeToText[codeArray[0]];
          break;
        case 2:
          area += CodeToText[codeArray[0]] + "/" + CodeToText[codeArray[1]];
          break;
        case 3:
          area +=
            CodeToText[codeArray[0]] +
            "/" +
            CodeToText[codeArray[1]] +
            "/" +
            CodeToText[codeArray[2]];
          break;
        default:
          break;
      }
      return area;
    },
    getTextToCode () {
      var addressArr = this.linkAddress.split('/');
      console.log(this.linkAddress)
      var provinceCode = TextToCode[addressArr[0]].code;
      var cityCode = TextToCode[addressArr[0]][addressArr[1]].code;
      var areaCode = TextToCode[addressArr[0]][addressArr[1]][addressArr[2]].code;
      this.selectedOptions = [provinceCode, cityCode, areaCode];
    },
    handleChange () {
      let address = ''
      address = this.getCodeToText(this.selectedOptions)
      this.$emit('selectAddress', address)
    }
  },
  components: {

  }
};
</script>

<style scoped>
.commoncascader /deep/ .el-cascader {
  width: 100%;
}
</style>
