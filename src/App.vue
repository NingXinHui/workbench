<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default  {
  name:  'App',
  mounted(){
    console.log(process.env);
    console.log(99)
  },

    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    }
}
</script>

<style>
@import "./assets/styles/showindex.scss";
@import "./assets/styles/setPeoThreeCom.scss";

*{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

</style>
<style lang="less" scoped>
 /deep/ .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /*height:600px;*/
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
  }
 /deep/ .el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
  }

</style>
