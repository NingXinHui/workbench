<!--
@time:2021/10/26
@author:zhupeikang
-->
<template>
  <div>

    <div>
      <div style="font-size: 14px;font-weight:500;">业务员完成订单金额</div>
      <div style="display: flex">
        <div @click="()=>getChildMethodYeWu(1)" class="setbutton">本月</div>
        <div @click="()=>getChildMethodYeWu(2)" class="setbutton">本季度</div>
        <div @click="()=>getChildMethodYeWu(3)" class="setbutton">本年</div>
      </div>
    </div>
    <customer-order></customer-order>
  </div>
</template>

<script>
import customerOrder from "@/views/order/compents/customerOrder";
export default {
  name: "chart",

  components: {customerOrder},

  mixins: [],

  props: {},

  data() {
    return {}
  },
  computed: {},

  watch: {},

  beforeCreat() {

  },

  created() {

  },

  beforeMount() {
  },

  mounted() {

  },
  methods: {},
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
