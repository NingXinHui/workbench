<template>
  <div>
    <div v-if="!isHidden" style="height: 55px; background: #0066ff">
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex">
          <div style="margin-top: 13px;margin-left:27px">
            <img src="@/assets/img/mainlogo.svg" style="width:144px;height:38px" alt="" />
          </div>
          <div style="margin-top: 18px; margin-left: 25px; font-size: 14px;color:white">
            [ {{ applicationName }} ]
          </div>
        </div>
        <div style="display: flex">
          <div class="setSelect">
            <div>

              <!-- 选择菜单 -->
              <el-select clearable ref="selectMenu" style="width: 224px;" :value="value" @change="(e) => changeRoute(e)" filterable placeholder="请选择">
                <template slot="prefix">
                  <span class="prefixSlot"><i class="el-icon-search" style="margin-top: 8px; color: #1890ff" /></span>
                </template>
                <el-option style="font-size:12px" v-for="(item,index) in options" :key="item.value+index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>

              <!-- 选择公司 -->
              <el-select clearable ref="selectMenuCompany" style="width: 224px;margin-left:12px" :value="companyId" @change="(e) => changeCompany(e)" filterable placeholder="请选择">
                <template slot="prefix">
                  <span class="prefixSlot"><i class="el-icon-house" style="margin-top: 8px; color: #1890ff" /></span>
                </template>
                <el-option style="font-size:12px" v-for="(item) in companyLIst" :key="item.id" :label="item.companyName" :value="item.companyId">
                </el-option>
              </el-select>
            </div>

            <div style="margin-top: 3px; margin-left: 12px; margin-right: 6px">
              <div style="font-size:14px;color:#D6E6FC">

                <div style=" margin-left: 16px; margin-right: 16px;display: flex;">
                  <div style="font-size:14px;color:#D6E6FC">

                    <div>
                      <el-popover placement="bottom" title="" width="200" trigger="hover" v-model="visible" popper-class="ewrdddd">
                        <div>
                          <!-- 分别显示公司名称和用户名称 -->
                          <div style="font-width: bold;text-align: center;font-size: 14px;font-weight: bold;">{{ tenantName }}</div>
                          <div style="text-align: center;font-size: 12px;margin-top: 4px;">
                            <div :title="showUserName" style="width:180px;margin:auto;  white-space: nowrap;text-overflow: ellipsis;overflow:hidden">
                              <span>
                                {{showUserName}}

                              </span>

                            </div>

                          </div>
                        </div>
                        <div class="baguang">
                          <span @click="logout">退 出</span>
                        </div>
                        <!--                   -->
                        <img v-if="!imageUrl" src="../assets/home/Tou.png" alt="" class="touX" slot="reference" style="cursor:pointer" @click="visible = !visible">
                        <img v-if="imageUrl" :src="imageUrl" alt="" class="touX" slot="reference" style="cursor:pointer" @click="visible = !visible">
                      </el-popover>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div style="">
              <screenfull id="screenfull" style="margin-right:12px"></screenfull>
            </div>
          </div>
          <!-- <div>
            <el-dropdown
              class="avatar-container right-menu-item hover-effect"
              trigger="click"
            >
              <div class="avatar-wrapper">
                <! <img :src="avatar" class="user-avatar" />  -->
          <!-- 目前是写死的  当接口通了之后可以用上面的写法  写成一个动态和用户绑定的  -->
          <!-- <img src="@/assets/img/headuser.png" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link> -->
          <!-- <el-dropdown-item @click.native="setting = true">
          <span>布局设置</span>
        </el-dropdown-item> -->
          <!-- <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
    <div>
      <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
        <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />

        <!--  左侧栏的宽度 目前是写死的 要是动态的话需要这样  width: sidebar.opened ? '240px !important' : '', -->
        <!-- <sidebar
          class="sidebar-container"
          :style="{
            top: '60px',
            width: '240px !important',
            backgroundColor:
              sideTheme === 'theme-dark'
                ? variables.menuBg
                : variables.menuLightBg,
          }"
        /> -->
        <!-- 样式要写成这样的  但是现在没有打开按钮  先写固定的 :style="{ marginLeft: sidebar.opened ? '240px !important' : '' }" -->
        <div :class="{ hasTagsView: needTagsView }" class="main-container" :style="{ marginLeft: '0px !important' }">
          <div :class="{ 'fixed-header': fixedHeader }" v-if="!isHidden">
            <!-- <navbar /> -->
            <tags-view @close="close" v-if="needTagsView" />
          </div>
          <app-main />
          <right-panel v-if="showSettings">
            <settings />
          </right-panel>
        </div>
      </div>
    </div>

    <!--    抽屉-->
    <el-drawer title="资源中心" :visible.sync="drawer" :direction="direction" custom-class="custom" :before-close="handleClose">
      <div class="zai" v-for="(item,index) in xiazaiList" :key="index">
        <div>
          <img v-if="item.resourceType=='anzhuangbao'" src="./../assets/home/xia.png" alt="" class="zaiImg">
          <img v-else src="./../assets/home/shou.png" alt="" class="zaiImg">
          <div style="color: #242F57;font-size: 16px;margin-bottom: 6px;">{{item.resourceTypeName}}</div>
        </div>
        <div style="color: #636E95;font-size: 12px;">{{item.resourceTitle}}</div>
        <div style="margin-top: 20px;">
          <a :href="item.fileUrl" :download="item.fileName" style="width: 73px;height: 36px;display: inline-block;">
            <el-button type="primary" plain>下载</el-button>
          </a>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState, mapGetters } from "vuex";
import variables from "@/assets/styles/variables.scss";
import screenfull from "@/components/Screenfull/index";
import { ocresource } from "@/api/systemzhu";
import { roleGetMame, companyListSelect } from '@/api/menu';
export default {
  name: "Layout",
  components: {
    screenfull,
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,

  },
  mixins: [ResizeMixin],

  mounted () {

    let { tenantName = '' } = this.$store.state.user.userNews;
    this.tenantName = tenantName;
    this.address = localStorage.getItem('userName');

    // roleGetMame({}).then(res=>{
    //   this.roleIdNameList=res.data;


    // })

    let allUserInfo = JSON.parse(localStorage.getItem('userInfoNow'));

    this.showUserName = allUserInfo.fullName;

    this.imageUrl = allUserInfo.imageUrl;



    this.nowRouter = this.$store.state.permission.sidebarRouters.filter(
      (item) => item.id
    );
    let nowoption = [];

    function returnPath (arr) {
      let path = '';
      arr[0] = arr[0].split('/')[1];
      arr.map((item) => {
        path = path + "/" + item;
      });
      return path
    }


    function a (arr, pathshow) {
      arr.map((item) => {
        if (pathshow && !item.children) {
          nowoption.push({
            label: item.name,
            // value: pathshow[0] + "/" + pathshow[1] + "/" + item.path,
            value: returnPath([...pathshow, item.path])
          });
        }
        if (item.children) {
          a(item.children, [...pathshow, item.path]);
        }
      });
    }

    a(this.nowRouter, []);

    this.options = nowoption;
  },
  data () {

    return {

      roleIdNameList: [],
      showUserName: '',
      companyId: '',
      imageUrl: '',


      direction: 'rtl',

      drawer: false,
      visible: false,
      xiazaiList: [],
      options: [],
      value: "",
      tenantName: '',
      address: "",
      isHidden: false,

      companyLIst: [],//公司的列表
    };
  },
  updated () {
  },
  created () {
    let pathitem = window.location.pathname;
    if (pathitem.endsWith('dropDraft') || pathitem.endsWith('fallDraft') || pathitem.endsWith('operateDraft')) {
      this.isHidden = true
    }

    let allUserInfo = JSON.parse(localStorage.getItem('userInfoNow'));



    // 获取下所有的公司的下拉数据


    companyListSelect(allUserInfo.userId).then(res => {
      this.companyLIst = res.data;

      if (!localStorage.getItem('companyIdNow')) {
        this.companyId = res.data.length ? res.data[0].companyId : "";
        localStorage.setItem('companyIdNow', JSON.stringify(res.data[0]))
      }
      else {
        this.companyId = JSON.parse(localStorage.getItem('companyIdNow')).companyId
      }
    })
  },
  computed: {
    ...mapState({
      theme: (state) => state.settings.theme,
      sideTheme: (state) => state.settings.sideTheme,
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    ...mapGetters(["sidebar", "avatar", "device"]),
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
    variables () {
      return variables;
    },
  },
  methods: {
    handleClose () {
      this.drawer = false
    },
    drawerBtn (e) {
      if (e == '1') {
        this.drawer = true;
        ocresource().then((res) => {
          if (res.success) {
            this.xiazaiList = res.data
          }
        })
      } else {
        this.$router.push({ path: '/tidings' })
      }

    },

    close () {
      this.$refs.selectMenu.$emit('input', '')
      this.$refs.selectMenu.$emit('change', '')
      this.$refs.selectMenu.$emit('clear', '')
    },

    changeRoute (e) {
      this.value = e;
      this.$refs.selectMenu.blur()
      this.$router.push(e);
    },
    // 修改公司
    changeCompany (e) {

      this.$confirm('确认切换公司吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',

      }).then(() => {


        localStorage.setItem('companyIdNow', JSON.stringify(this.companyLIst.find(item => item.companyId == e)));
        window.location.reload();



      }).catch(() => {

      })







    },
    handleClickOutside () {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    async logout () {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.href = "/";
          });
        })
        .catch(() => {
        });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.custom {
  width: 443px !important;
  .el-drawer__header {
    margin-bottom: 8px;
    span {
      color: #374256;
      font-size: 20px;
    }
  }
  .el-drawer__body {
    padding-left: 20px;
    .zai {
      background: #fafcfe;
      border: 1px solid #d2d5e1;
      border-radius: 6px;
      width: 183px;
      height: 200px;
      text-align: center;
      padding: 20px 0;
      float: left;
      margin-bottom: 25px;
      .zaiImg {
        width: 48px;
        height: 44px;
        margin-bottom: 15px;
      }
    }
    .zai:nth-child(2n) {
      margin-left: 25px;
    }
    .el-button--primary.is-plain {
      background: #ffffff;
      width: 73px;
      height: 36px;
      font-size: 14px;
    }
    .el-button--primary.is-plain:hover,
    .el-button--primary.is-plain:focus {
      background: #1890ff;
      border-color: #1890ff;
      color: #ffff;
    }
  }
}

.setSelect {
  margin-top: 4px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  /deep/ .el-input__inner {
    height: 28px !important;
    line-height: 28px !important;
  }
}
</style>
<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.avatar-container {
  margin-top: 6px;
  margin-right: 30px;

  .avatar-wrapper {
    margin-top: 8px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.wen,
.dang {
  position: relative;
  top: 10px;
}
.dang {
  width: 14px;
  height: 17px;
  margin-right: 15px;
}
.wen {
  width: 16px;
  height: 15px;
  margin-right: 15px;
}
.baguang {
  background: #fafcfe;
  text-align: center;
  padding: 10px 0;
  border: 1px solid #f1f5f9;
  margin-top: 14px;
  font-size: 14px;
  span {
    color: #0066ff;
    cursor: pointer;
  }
}
.touX {
  width: 28px;
  height: 28px;
  border-radius: 14px;
}
</style>
<style lang="less">
.ewrdddd {
  padding: 12px 0 0 0;
}
#screenfull {
  color: white;
}
</style>
