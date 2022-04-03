<template>
  <div class="top-wrap">
   <el-image
      style="width: 120px; height: 27px"
      :src="image_url"></el-image>
  </div>
</template>

<script>
export default {
  data() {
    return {
        image_url: require("@/assets/img/mainlogo.svg"),
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.top-wrap {
  width: 100%;
  height: 55px;
 
  background: rgb(0, 102, 255);
  .el-image {
      margin: 13px 0 0 24px;
  }
}
</style>
