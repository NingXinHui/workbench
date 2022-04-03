<template>
    <div id="mainshowbar" :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme !== 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
        <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="settings.sideTheme !== 'theme-dark' ? variables.menuBg : variables.menuLightBg"
                :text-color="settings.sideTheme !== 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'"
                :unique-opened="true"
                active-text-color="#ffffff"
                :collapse-transition="false"
                mode="vertical"
                @select="(e)=>seleMenu(e)"
                
            >
                <sidebar-item
                    v-for="(route) in leftNewList"
                    :key="route.typeNo"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";
import {defineAddBatchByImport} from "@/api/apizhu";
export default {
    components: { SidebarItem,  },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["sidebarRouters", "sidebar"]),
        selectMenu(e){
            console.log(e)

        },
        activeMenu() {
            const route = this.$route;
            let { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            if(path.indexOf('detail')>-1 && meta.type=='1'){
                path=path.split('/detail')[0] 
            }
            return path;
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            // return !this.sidebar.opened;
            return false
        }
    },
    data(){
        return {
            leftNewList:[],

        }
    },
    // 获取下左侧的物料的接口 
    created(){

        defineAddBatchByImport({}).then(res=>{
            this.leftNewList=res.data.typeTreeList;

        })


    },
    methods:{
        seleMenu(e){
          this.$emit('getRightNews',e)
        }
    }
    
};
</script>
<style lang='less' scoped>
#mainshowbar{
    /deep/ .is-active  {
        background: #1890ff !important;
       
    }
    /deep/ .is-active:hover{
            background: #1890ff !important;
        }

    
}
</style>
