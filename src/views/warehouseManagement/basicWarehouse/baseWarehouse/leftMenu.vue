<template>
  <div id="mainshowbar"
       :class="{'has-logo':showLogo}"
       :style="{ backgroundColor: settings.sideTheme !== 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar :class="settings.sideTheme"
                  wrap-class="scrollbar-wrapper">
      <!-- <el-menu :default-active="activeMenu"
               :collapse="isCollapse"
               :background-color="settings.sideTheme !== 'theme-dark' ? variables.menuBg : variables.menuLightBg"
               :text-color="settings.sideTheme !== 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'"
               :unique-opened="true"
               active-text-color="#ffffff"
               :collapse-transition="false"
               mode="vertical"
               @select="(e)=>seleMenu(e)">
        <sidebar-item v-for="(route) in leftNewList"
                      :key="route.id"
                      :item="route"
                      :base-path="route.path" />
      </el-menu> -->
      <!-- 树形菜单 -->
      <el-tree :data="leftNewList"
               :props="defaultProps"
               node-key='id'
               :default-expanded-keys="expandKeys"
               @node-expand="expandNode"
               @node-collapse="closeNode"
               @node-click="handleNodeClick"></el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

import { defineAddBatchByImport } from "@/api/apizhu";


import { searchManagerApi } from "@/api/wareManagementApi/management";




export default {
  components: { SidebarItem, },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar"]),
    selectMenu (e) {
      console.log(e)

    },
    activeMenu () {
      const route = this.$route;
      let { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      if (path.indexOf('detail') > -1 && meta.type == '1') {
        path = path.split('/detail')[0]
      }
      return path;
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo;
    },
    variables () {
      return variables;
    },
    isCollapse () {
      // return !this.sidebar.opened;
      return false
    }
  },
  data () {
    return {
      leftNewList: [],
      currentHierarchy: 0,
      currentHierarchys: 1,
      expandKeys:[],
      a: 0,
      defaultProps: {
        children: 'list',
        label: 'label'
      }
    }
  },
  // 获取下左侧的仓库区的接口 
  created () {
    this.getLeftMenu()
 
  },

  methods: {
    getLeftMenu(){
       searchManagerApi({}).then(res => {
      this.leftNewList = this.multiarr(res.data);
    })

    },
    // 暂时先写死后面改递归
    multiarr (arr) {
      // 给第二层加上label
      for (let i = 0; i < arr.length; i++) {
        Object.assign(arr[i], {
          label: arr[i].regionName
        })
        // 如果有list属性
        if (!!arr[i] && !!arr[i].list) {
          for (let j = 0; j < (arr[i].list).length; j++) {
            Object.assign((arr[i].list)[j], {
              label: (arr[i].list)[j].warehouseName
            })
            if (!!(arr[i].list)[j] && !!(arr[i].list)[j].list) {
              for (let k = 0; k < ((arr[i].list)[j].list).length; k++) {
                let obj = ((arr[i].list)[j].list)[k]
                Object.assign(obj, {
                  label: ((arr[i].list)[j].list)[k].libraryName
                })
              }
            }
          }
        }
      }
      return arr
    },
    // multiarr (arr) {
    //   for (let i = 0; i < arr.length; i++) {
    //     Object.values(arr[i]).map((value, v) => {
    //       if (value instanceof Array) {
    //         this.a++;
    //         console.log('我是this.a', this.a)
    //         arr = value;
    //         this.multiarr(arr)
    //       }
    //       console.log('我是arr[a]', arr, this.a)
    //       Object.assign(arr[i], {
    //         label: this.a == 0 ? 'regionName' : this.a == 1 ? 'warehouseName' : this.a == 2 ? 'libraryName' : ''
    //       })
    //       console.log('我是改变后的arr[a]', arr[i])
    //     })
    //   }
    //   console.log('我是最终的arr', arr)
    //   return arr
    // },

    //点击节点获取的值
    handleNodeClick (data) {
      console.log(data);
      this.$emit('getRightNews', data)
    },
    expandNode(a){
      this.expandKeys.push(a.id)
    },
    closeNode(a){
      this.expandKeys=this.expandKeys.filter(item=>item!=a.id)
    }
  }
};
</script>
<style lang='less' scoped>
#mainshowbar {
  /deep/ .is-active {
    background: #1890ff !important;
  }
  /deep/ .is-active:hover {
    background: #1890ff !important;
  }
}
</style>
