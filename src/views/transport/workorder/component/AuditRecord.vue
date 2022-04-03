<!--
@time:2022/1/10
@author:shaoliting 
-->
<template>
  <div class="popBox">
    <el-dialog
      title="审核记录"
      :visible="auditVisible"
      @close="close"
      :close-on-click-modal="false"
    >
      <div class="content">
     <el-tabs type="border-card" :tab-position="'left'" style="height:500px">
  <el-tab-pane label="审批">
   <div v-for="(item,key) in list" :key="key">
   <div class="top">{{item.subit}}</div>
   <div class="center">{{item.person}}  <span class="ml-10">{{item.time}}</span></div>
   <div class="bot">备注  <span class="ml-10">{{item.remark}}</span></div>
   </div>
  </el-tab-pane>
  <el-tab-pane label="流程">流程</el-tab-pane>
</el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from '@/components/CommonTable'
export default {
  name: "add",
  components: { commonTable },

  mixins: [],

  props: {
    auditVisible: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      list: [{
        subit: "审批通过",
        person: '三月',
        time: "2020-1-7",
        remark: "121545"
      }],
    };
  },
  methods: {
    //关闭弹窗
    close() {
      this.$emit("update:auditVisible", false);
    },

  },
  computed: {
  },

  watch: {},

  created() {},

  beforeMount() {},

  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.popBox {
  ::v-deep .el-dialog {
    overflow-y: auto;
    width: 565px !important;
    min-height: 400px !important;
    .el-dialog__body {
      padding: 0 !important;
      min-height: 400px !important;
      .content {
        min-height: 400px !important;
        .el-tabs__header {
          padding-left: 0 !important;
        }
        .el-tabs__content {
          padding-top:5px !important;
          padding-left: 10px !important;
        }
      }
    }
  }
}
.top {
  font-size: 12px;
  color: #cccccc;
}
.center, .bot {
  font-size:12px;
  color: black;
  margin-top:5px;
}
</style>
