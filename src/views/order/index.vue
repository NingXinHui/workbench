<!--
@time:2021/9/29
@author:zhupeikang
-->
<template>
  <div>
    <component :is="showType"></component>
  </div>
</template>

<script>
import list from "@/views/order/list";
import edit from "@/views/order/edit";
import Mixin from "@/lib/vuex-mixin";
const {mapGetters, mapActions} = new Mixin('order').getHelper()

export default {
  name: "index",

  components: {list,edit},

  mixins: [],

  props: {},

  data() {
    return {
      components:'list'
    }
  },
  computed: {
    ...mapGetters(['showType'])
  },

  watch: {},

  beforeCreat() {

  },

  created() {

  },

  beforeMount() {
  },

  mounted() {
    if (this.$route.fullPath==='/order/order'){
      this.components='list'
    }else {
      this.components='edit'
    }
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
