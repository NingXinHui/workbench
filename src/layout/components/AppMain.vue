<template>
  <section :class=" `app-main ${dongclass?'maxshow':''}`   ">
    <!-- <transition name="fade-transform"
                mode="out-in"> 去掉了动画效果 --> 
    <transition            >
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    key () {
      return this.$route.path
    },
    dongclass(){
       let pathitem=window.location.pathname;
       if(pathitem.endsWith('dropDraft') || pathitem.endsWith('fallDraft')||pathitem.endsWith('operateDraft')  ){
         return true
       }
       return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  max-height: calc(100vh - 160px);
  overflow: auto;
}
.maxshow{
  max-height: calc(100vh );
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 94px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
