<template>
  <div class="setmain">
    <div class="setFlex">
      <div>
        <div
          v-for="(item, index) in nowRouter"
          :key="index"
          :class="item.id == clickId ? 'activeId' : ''"
          @click="() => clickParent(item)"
        >
          <svg-icon :icon-class="item.meta.icon" />
          {{ item.name }}
        </div>
      </div>
      <div>
        <div class="setMainShow" v-for="item in rightRouters" :key="item.id">
          <div v-if="isshow(item.path)">
            <div class="setName">
              {{ item.name }}
            </div>

            <div v-if="item.children" class="setChildMenu">
              <div
                class="jiaButton"
                v-for="showItem in item.children"
                :key="showItem.id"
              >
                <el-button
                  style="width: 160px"
                  @click="() => jump(item, showItem)"
                >
                  {{ showItem.name }}
                </el-button>
              </div>
            </div>
          </div>
        </div>

       <div class="setMainShow">
             <div v-if="otherRoutes.length!=0">
          <div class="setName">
              其他
            </div>

            <div class="setChildMenu">
              <div
                class="jiaButton"
                v-for="showItem in otherRoutes"
                :key="showItem.value"
              >
                <el-button
                  style="width: 160px"
                  @click="() => jump(showItem.value)"
                >
                  {{ showItem.label }}
                </el-button>
              </div>
            </div>

        </div>

       </div>




      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Menulist",
  data() {
    return {
      left: 0,
      nowRouter: [], //所有的路由
      rightRouters: [], //右侧的Routes
      basePath: "",
      clickId: 0,

      // trueRoutes:[],//真正显示出来的
      otherRoutes:[],// 其他模块里面的
      otherTruePath:[],// 存放的其他模块的路径数组

    };
  },

  mounted() {
    this.nowRouter = this.$store.state.permission.sidebarRouters.filter(
      (item) => item.id
    );
    this.rightRouters = this.nowRouter[0].children;
    this.clickId = this.nowRouter[0].id;
    // 还有其他模块  rightroutes只显示 三级的  其他的都在其他模块显示  所以要处理下数据
    this.updateList();
    // this.options = nowoption;
  },

  methods: {
    isshow(path){
      if(this.otherTruePath.find(item=>item==path)){
        return false
      }
      return true

    },
    updateList() {
      // let nowoption = [];
      let otherpath = [];
      let otherTruePath=[];


      function returnPath(arr) {
        let path='';
        arr.map((item) => {
          path = path + "/" + item;
        });
        return path
      }

      function a(arr, pathshow) {
        arr.map((item) => {
          // if (pathshow && pathshow.length == 1 && !item.children) {
          //   // 这都是三级别正常的
          //   nowoption.push({
          //     label: item.name,
          //     value: returnPath([...pathshow, item.path]),
          //   });
          // }
          // 非三级 不正常的
         if (pathshow && pathshow.length != 1 && !item.children) {
            otherTruePath.push(item.path);
            otherpath.push({
              label: item.name,
              value: returnPath([...pathshow, item.path]),
            });
          }
          if (item.children) {
            a(item.children, [...pathshow, item.path]);
          }
        });
      }
      a(this.rightRouters, []);

      this.otherRoutes=otherpath;
      // this.trueRoutes=nowoption;
      this.otherTruePath=otherTruePath;
    },

    clickParent(value) {
      this.clickId = value.id;
      this.rightRouters = value.children;
      this.updateList();
    },

    jump(parent, pathitem) {

      if(!pathitem){
         let mainPath= this.nowRouter.find(item=>item.id==this.clickId).path;
       return this.$router.push(`${mainPath}${parent}`);
      }
      let allparent = this.nowRouter.find((item) => item.id == parent.parentId);
      let pathnow = allparent.path + "/" + parent.path + "/" + pathitem.path;
       if(pathitem.path.endsWith('dropDraft') || pathitem.path.endsWith('fallDraft')||pathitem.path.endsWith('operateDraft')  ){
         return window.open(window.location.origin+pathnow);
       }
      this.$router.push(`${pathnow}`);
    },
  },
};
</script>


<style lang="less" scoped>
/deep/ .el-button {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  width: 100%;
}
</style>


<style lang="scss" scoped>
.setmain {
  height: calc(100vh - 96px);
  background: #eaeef4;
  padding: 8px;
  .activeId {
    background: #0066ff;
    color: white;
  }
}
.setFlex {
  display: flex;
  & > div:first-child {
    border-right: 1px solid #ececec;
    width: 160px;
    padding-top: 6px;
    background: white;
    border-radius: 0px;
    flex-shrink: 0;
    line-height: 30px;
    height: calc(100vh - 110px);
    overflow: auto;
    cursor: pointer;
    & > div {
      height: 32px;
      font-size: 12px;
      line-height: 32px;
      padding-left: 12px;
    }
  }
  & > div:last-child {
     height: calc(100vh - 110px);
    overflow: auto;
  }
  .setMainShow {
    border-bottom: 1px solid #ececec;
    padding-left: 16px;
    .setName {
      font-size: 12px;
      margin-top: 12px;
      margin-bottom: 12px;
    }
  }

  .setChildMenu {
    display: flex;
    flex-wrap: wrap;
    .jiaButton {
      margin-bottom: 12px;
      margin-left: 12px;
    }
  }
}
</style>
