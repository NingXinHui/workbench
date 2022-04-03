<template>
  <div id="zPage">
    <div class="z-header">
      <div class="z-header-button">
        <el-button v-if="!isSave"
                   @click="() => (isSave = true)">编辑</el-button>
        <el-button v-if="isSave"
                   @click="() => updateNews('')">保存</el-button>
        <el-button v-if="isSave"
                   @click="() => closeNews()">取消</el-button>
      </div>
    </div>

    <div class="z-content">
      <div class="verApp">
        <div class="left">
          <div class="list">
            <div class="item"
                 :class="{ active: rowIndex == index }"
                 v-for="(item, index) in appList"
                 :key="index"
                 @click="nodeClick(item, index)">
              {{ item.categoryName }}
            </div>
          </div>
        </div>
        <div class="right">
          <el-card class="z-details-box">
            <div class="z-details-content">
              <div :class="['z-details-content-box', ,]">
                <!-- <div>
                  <div class="setflexmain">
                    <div
                      style="font-size: 12px"
                      v-for="(item, index) in showrightlist"
                      :key="index"
                    >
                      <span>
                        {{ item.configName }}
                      </span>
                      <el-input
                        :disabled="!isSave"
                        v-model="item.configValue"
                        style="width: 60px; margin: 0 6px"
                      />
                      <span> 位, </span>
                    </div>
                  </div> -->
                <!-- </div> -->

                <!-- 如果是仓储的 -->
                <div v-if="showType == 'storageConfig'">
                  <div style="display: flex">
                    <div style="
                      font-size: 14px;
                      color: rgba(0, 0, 0, 0.45);
                      line-height: 24px;
                      margin-right: 8px;
                    ">
                      配货优先级规则:
                    </div>
                    <div>
                      <div v-for="(item, index) in showrightlist.filter(
                        (ii, ind) => ind != showrightlist.length - 1
                      )"
                           :key="index"
                           style="margin-bottom: 12px">
                        <div style="display: flex">
                          <div>
                            <el-input :value="item.configName"
                                      :disabled="!isSave"
                                      style="width: 240px" />
                          </div>

                          <div style="margin-left: 12px">
                            <el-select v-model="item.configValue"
                                       :clearable="true"
                                       style="width:600px"
                                       :disabled="!isSave"
                                       placeholder="请选择"
                                       multiple>
                              <el-option v-for="items in wuliaofenList"
                                         :key="items.id"
                                         :label="items.typeName"
                                         :value="items.id">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style="margin-left:50px;line-height:24px;color:rgba(0,0,0,0.45);font-size:14px">
                    <span>
                      占货超过
                    </span>
                    <el-input :disabled="!isSave"
                              maxlength="5"
                              onKeyup="this.value=this.value.replace(/[^0-9]/g,'')"
                              v-model="showrightlist[showrightlist.length - 1].configValue"
                              style="width:70px" />
                    <span>
                      小时未发货，自动排到末尾
                    </span>

                  </div>

                </div>

                <!-- 如果是上传附件 -->
                <div v-else
                     style="font-size:14px;color:rgba(0,0,0,0.45);">
                  <span>
                    文件大小
                  </span>
                  <el-input :disabled="!isSave"
                            maxlength="5"
                            onKeyup="this.value=this.value.replace(/[^0-9]/g,'')"
                            v-model="showrightlist[showrightlist.length - 1].configValue"
                            style="width:70px" />
                  <span>
                    M
                  </span>
                  <span>
                    (前端限制最大文件大小)
                  </span>

                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userQueryPage } from "@/api/systemzhu";
import commonTable from "@/components/CommonTable";
import lookUp from "@/components/ZLookUp/lookUp";
import { materialTypeListAll } from "@/api/apizhu";

import {
  categoryListAll,
  configCategoryGet,
  categoryUpdate,
} from "@/api/apizhu";

export default {
  props: {},
  data () {
    return {
      isSave: false,

      orderShow: false,
      basicShow: false,
      detailsShow: false,
      showrightlist: [],

      appList: [],
      rowIndex: 0,

      value: "",

      showType: "", //  storageConfig 仓储类   uploadFileConfig 上传附件类

      wuliaofenList: [], //
    };
  },

  mounted () {
    this.getList();
    materialTypeListAll({ parentId: 0 }).then((res) => {
      this.wuliaofenList = res.data;
    });
  },

  methods: {
    isCancel (key, bool) {
      this[key] = bool;
    },

    getRightNews (queryId) {
      let that = this;
      configCategoryGet(queryId).then((res) => {
        this.showType = res.data.code;

        that.showrightlist = res.data.configVOList.map((item) => {
          return {
            ...item,
            configValue: item.configValue.length > 0 ? item.configValue.split(",") : [],
          };
        });

        console.log('that.showrightlist', that.showrightlist)

      });
    },

    closeNews () {
      this.isSave = false;
      this.getRightNews(this.appList[this.rowIndex].id);
    },

    updateNews () {
      debugger
      // 必填校验
      if (this.showrightlist[this.showrightlist.length - 1].configValue == '') {
        this.$message.error("请填写完成再点击保存");
        return
      }
      let {
        configVOList,
        updateTime,
        updateUser,
        createUser,
        createTime,
        ...other
      } = this.appList[this.rowIndex];
      let params = {
        ...other,
        configDTOList: this.showrightlist.map(item => {
          item.configValue = item.configValue.toString();
          return item
        }),
      };
      categoryUpdate({ ...params }).then((res) => {
        if (res.success) {
          this.isSave = false;
          this.getRightNews(this.appList[this.rowIndex].id);
        }
      });
    },
    // 获取版本
    getList () {
      categoryListAll({}).then((res) => {
        if (res.success) {
          this.appList = res.data;
          this.getRightNews(res.data[0].id);
        }
      });
    },
    // 获取版本租户

    nodeClick (item, index) {
      this.rowIndex = index;
      this.getRightNews(item.id);
    },
  },
  components: {
    commonTable,
    lookUp,
  },
};
</script>

<style scoped>
.verApp {
  width: 100%;
  height: 100%;
  display: flex;
}

.verApp .left {
  width: 176px;
  height: 100%;
  background: #ffffff;
  padding: 8px 0;
  text-align: center;
  overflow: auto;
}

.verApp .left .el-input {
  width: 156px;
}

.verApp .left .list {
  margin-top: 8px;
}

.verApp .left .list .item {
  padding: 9px 0;
  font-size: 12px;
  color: #374256;
  text-align: left;
  text-indent: 8px;
  cursor: pointer;
}

.verApp .left .list .item.active {
  border-left: 4px solid #2367fa;
  background: #f0f5ff;
}

.verApp .right {
  flex: 1;
  background: #fff;
  height: 100%;
  margin-left: 8px;
  padding: 12px;
  box-sizing: border-box;
  overflow: auto;
}

.verApp .right /deep/ .el-tree-node__children .el-tree-node__children {
  display: flex;
  flex-wrap: wrap;
}
</style>

<style lang="less" scoped>
#zPage {
  .z-content {
    height: calc(100vh - 94px) !important;
  }

  /deep/ .el-card__body {
    height: calc(100vh - 94px) !important;
  }
}
.setflexmain {
  display: flex;
  margin-bottom: 12px;
}
.setupset {
  & > div {
    display: flex;
    & > div:first-child {
      width: 92px;
      font-size: 12px;
      text-align: right;
      padding-right: 6px;
      line-height: 28px;
    }
    & > div:last-child {
      /deep/ .el-select {
        margin-right: 12px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
