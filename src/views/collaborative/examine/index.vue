
<template>
  <div id="zPage">
    <!-- <div class="z-header">
      <div class="z-header-button">
        <el-button @click="() => {this.openmodal=true}">上传附件</el-button>
      </div>
    </div> -->
    <div class="z-content">
      <div class="setcard">
        <el-card>
          <div class="setflexhead">
            <div
              :class="changeNum == 1 ? 'selectClick' : ''"
              @click="() => changeBottom(1)"
            >
              <div>
                <img src="@/assets/img/myban.png" alt="light" />
              </div>
              <div>我的待办</div>
              <div style="color: #ed5751">{{ headData.countWait }}</div>
            </div>
            <div
              :class="changeNum == 2 ? 'selectClick' : ''"
              @click="() => changeBottom(2)"
            >
              <div>
                <img src="@/assets/img/myyi.png" alt="light" />
              </div>
              <div>我的已办</div>
              <div style="color: #f7a037">{{ headData.countFinished }}</div>
            </div>
            <div
              :class="changeNum == 3 ? 'selectClick' : ''"
              @click="() => changeBottom(3)"
            >
              <div>
                <img src="@/assets/img/myfa.png" alt="light" />
              </div>
              <div>我发起的</div>
              <div style="color: #0066ff">{{ headData.countFrom }}</div>
            </div>
          </div>

          <div class="setdatesty">
            <header-search :searchArr="searchArr" @sureSearch="searchMethod">
            </header-search>
          </div>

          <div class="z-content-table">
            <common-table
              is-height
              ref="mainTable"
              :isMain="true"
              :isPage="true"
              :tableColumn="tableColumn"
              :tableData="tableData"
              :isSelection="true"
              :loading="pageParams.loading"
              :pageParams="pageParams"
              @selePage="handleItemSelect"
              @pageChange="pageChange"
            />
          </div>
        </el-card>
      </div>
    </div>

    <div class="popBox">
      <el-dialog
        title="查看"
        :visible.sync="dialogEdit"
        custom-class="setDialog"
        width="1340px"
      >
        <div class="setModalMain">
          <!--显示的是左侧的  -->
          <div>
            <!-- 上面的div现实的是切换的  -->
            <div>
              <div class="setHeadfelx" style="margin-bottom: 12px">
                <div
                  :class="showheadtab == '1' ? 'showactive' : 'noactive'"
                  @click="
                    () => {
                      this.showheadtab = 1;
                    }
                  "
                >
                  表单信息
                </div>
                <div
                  :class="showheadtab == '2' ? 'showactive' : 'noactive'"
                  @click="
                    () => {
                      this.showheadtab = 2;
                    }
                  "
                >
                  流程信息
                </div>
              </div>

              <div style="height: 540px; overflow: auto">
                <img :src="showheadtab == '1' ? modalonepic : modaltwopic" />
              </div>
            </div>
            <!-- 下面的div显示的是上面的  -->
            <div></div>
          </div>
          <!-- 显示的是右侧的 -->
          <div class="setrightpi" style="height: 540px; overflow: auto">
            <div>
              <span style="color: #0066ff">审批信息</span>
            </div>

            <div v-if="changeNum == '1'">
              <!-- 最简单的方法  罗代码 -->
              <div class="setAllShen">
                <!-- <div class="setone" style="margin-bottom:14px">
                  <div>金额</div>
                  <div>
                    <el-input
                      placeholder="请输入金额"
                      :value="sendShenNews.money"
                      @input="changeMoney"
                    >
                    </el-input>
                  </div>
                </div> -->
                <div class="setone">
                  <div>审批意见</div>
                  <div>
                    <el-input
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容"
                      v-model="sendShenNews.msg"
                    >
                    </el-input>
                  </div>
                </div>
                <div class="shenButton">
                  <el-button
                    @click="() => sendShen(2)"
                    style="color: red; border-color: red"
                  >
                    驳回
                  </el-button>
                  <el-button @click="() => sendShen(1)" type="primary">
                    通过
                  </el-button>
                </div>
              </div>
            </div>

            <div>
              <span>发起人：</span>
              <span>
                {{ historyOwner }}
              </span>
            </div>
            <div>
              <div v-for="(item, index) in historyRight" :key="index">
                <div>
                  <div class="setmoreflex">
                    <div class="setBorderdiv">
                      <div class="setline" v-if="index != 0"></div>
                      <img
                        style="width: 24px"
                        src="@/assets/img/setagg.png"
                        alt="light"
                      />
                    </div>
                    <div style="font-size: 12px">
                      <div>
                        <span style="color: #374256">{{
                          item.comments[0].createTime
                        }}</span>
                        <span style="padding-left: 10px; padding-right: 10px"
                          >[{{ item.comments[0].userNames || '猪猪' }}]</span
                        >
                        <span style="color: #1890ff">{{
                          item.comments[0].type
                        }}</span>
                      </div>
                      <div>
                        {{ item.comments[0].content }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="() => submittwo()">确 定</el-button>
        </span> -->
      </el-dialog>


      <!-- <div v-if="openmodal">
        <open-modal billId="1490687438622822402" billType="SALE_ORDER" @closeModal="(value)=>this.closeOne(value)" :fileIds="['1486257448033804289','1486257626346250242']"/>
      </div> -->
    </div>
  </div>
</template>

<script>
import HeaderSearch from "@/components/CommonHeadSearch/ZSearch";
import commonTable from "@/components/CommonTable";
import OpenModal from '@/components/commonUpload'

import {
  // getHistoryByUserId, //我的已办
  // getUserStarts, //我发起的
  // getTaskList, //我的待办
  userTaskCount, //获取待办上面头部显示的数量
  // processDiagram, //获取流程图的图片
  getHistoryList, //获取历史记录
  processGuoOrJu, //通过还是拒绝
} from "@/api/systemzhu";
import { getToken } from "@/utils/auth";
import axios from "axios";

import {
  getTaskList,
  getUserStarts,
  getHistoryByUserId,
  sendProcessStart, 
  processDiagramHistory,
  doneTaskSome
} from "@/api/systemzhu/flowUse";
export default {
  name: "indexx",
  components: { HeaderSearch, commonTable ,OpenModal},

  props: {},
  data() {
    return {
      openmodal:false,
      sendShenNews: { money: undefined },
      clickrecord: {},
      showheadtab: 1,
      modelFormIsOpen: {},
      selectRow: {},
      dialogEdit: false, //是否打开弹框
      historyRight: [],

      pageParams: {
        loading: true,
        pageNo: 1,
        pageSize: 30,
        total: 1,
      },
      searchKeyword: {
        billNo: "",
        billTypeNo: "",
        billTitle: "",
        endTime: undefined,
        startTime: undefined,
      },
      tableColumn: [
        {
          type: "index",
          label: "序号",
          width: 80,
          //   align:'right'
        },
        {
          prop: "billType",
          label: "单据类型",
          align: "center",
        },
        {
          // prop: "formId",
          label: "单据号",
          render: (h, scope) => {
            return h(
              "a",
              {
                style: {
                  color: "#2367FA",
                  cursor: "pointer",
                },
                on: {
                  click: () => {
                    this.changeSet(scope.row);
                  },
                },
              },
              scope.row.billNo
            );
          },
        },
        {
          // prop: "name",
          label: "标题",
          render: (h, scope) => {
            return h(
              "a",
              {
                style: {
                  color: "#2367FA",
                  cursor: "pointer",
                },
                on: {
                  click: () => {
                    this.changeSet(scope.row);
                  },
                },
              },
              scope.row.billTitle
            );
          },
        },
        // {

        //   label: "标题",
        //    render: (h, scope) => {
        //     return h(
        //       "a",
        //       {
        //         style: {
        //           color: "#2367FA",
        //           cursor: "pointer",
        //         },
        //         on: {
        //           click: () => {
        //             this.changeSet(scope.row);
        //           },
        //         },
        //       },
        //       scope.row.name
        //     );
        //   },

        // },
        {
          prop: "startTime",
          label: "发起时间",
          render: (h, scope) => {
            return h(
              "span",

              scope.row.startDate
            );
          },
        },
        {
          prop: "assignee",
          label: "代办人",
        },

        {
          prop: "owner",
          label: "发起人",
          render: (h, scope) => {
            return h(
              "span",

              scope.row.startUserName || "暂未匹配到"
            );
          },
        },
        // {
        //   prop: "description",
        //   label: "备注",
        // },
        // {
        //   label: "备注",
        //   render: (h, scope) => {
        //     return h(
        //       "a",
        //       {
        //         style: {
        //           color: "#2367FA",
        //           cursor: "pointer",
        //         },
        //         on: {
        //           click: () => {
        //             this.changeSet(scope.row);
        //           },
        //         },
        //       },
        //       scope.row.description
        //     );
        //   },
        // },
      ],
      tableData: [],
      searchArr: [
        {
          label: "标题",
          value: "billTitle",
          type: 1,
          maxLength: "20",
        },

        {
          label: "单据号",
          value: "billNo",
          type: 1,
          maxLength: "20",
        },
        {
          label: "单据类型",
          field: "billTypeNo",
          type: 2,
          optionLabel: "groupName",
          optionValue: "id",
          optionList: [
            {
              id: "1",
              groupName: "单据一",
            },
          ],
        },

        {
          label: "日期",
          value: "key",
          type: 4,
          //   maxLength: "20",
          rangedesc: "至",
          pickerType: "datetimerange", //选择器类型
        },
      ],
      multipleSelection: [],
      changeNum: 1,
      headData: {},
      modalonepic: "",
      modaltwopic: "",
      historyOwner: "",
    };
  },
  computed: {},

  watch: {},

  mounted() {
    this.getList();
    // this.getDai();
  },
  methods: {
    // 拿到的弹框文件的值
    closeOne(value){
      this.openmodal=false; 
    },
    // 点击发起流程
    // sendFa(){
    
    // //   for(let i=0;i<40;i++){
    // //      setTimeout(() => {
    //         let params={
    //     userId:JSON.parse(localStorage.getItem('userInfoNow')).userId,
    //     processKey:'im_arrive',
    //     tenantId:'1',
    //     billType:'看到的',
    //     billNo:'8888888',
    //     billTitle:'和似懂非懂',
    //     billDesc:'司法部考不考试框架',
    //     notifyAddress:'说不定发不发'
    //   }
    //    sendProcessStart(params)
           
    // //      }, 200*i);
     

    // //   }

    // },
    submittwo() {
      this.dialogEdit = false;
      this.sendShenNews = {};
    },
    changeMoney(e) {
      if (!isNaN(Number(e))) {
        this.sendShenNews.money = e;
      }
    },

    sendShen(value) {
      if (this.sendShenNews.msg && this.sendShenNews.msg.trim()) {
        let params = {
          action: value == 1 ? 1 : 2,
          commentMsg: this.sendShenNews.msg,
          userId:JSON.parse(localStorage.getItem("userInfoNow")).userId,

          taskId: this.clickrecord.todoTasks[0].id,
          // type: value == 1 ? "通过" : "不通过",
          // variables: {
          //   money: this.sendShenNews.money ? this.sendShenNews.money : 0,
          // },
        };
        // if (this.clickrecord.flagAssign == "1") {
        //   params.taskId = this.clickrecord.taskId;
        //   params.ticketFlag = value == 1 ? true : false;
        // }
        doneTaskSome(params).then((res) => {
          if (res.success) {
            this.dialogEdit = false;
            this.getList();
            this.sendShenNews = {};
          }
        });
      } else {
        return this.$message.error("请填写审核信息");
      }

   
    },

    changeSet(record) {
      // 根据选中的获取下 相关的所有的数据

      this.clickrecord = record;
      this.showheadtab = 1;

      // 1 获取表单信息的图片 先默认一张地址
      this.modalonepic =
        "https://img1.baidu.com/it/u=1657788607,818227927&fm=26&fmt=auto";

      // 2 获取流程信息的图片
    
      axios.get(`/getml/api/process/diagram/${record.id}`, {
          params: {},
          headers: { Authorization: "Bearer " + getToken() },
          responseType: "blob",
        })
        .then((resp) => {
          var blob = new Blob([resp.data], {}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          this.modaltwopic = href;
        })


      // 现在接口没跑通  先这样用着
      // this.modaltwopic =
      //   "https://img2.baidu.com/it/u=422281508,1820589202&fm=26&fmt=auto";

      // 3 获取审批信息的信息
      processDiagramHistory(record.id).then(res=>{
        if(res.success){
          console.log(res);
          console.log('真的希望吗')
          this.historyOwner=res.data.startUserName || '暂时未匹配';
          this.historyRight=res.data.completedTasks
        }

      })
      
      // getHistoryList({ processInstanceId: record.processInstanceId }).then(
      //   (res) => {
      //     if (res.success) {
      //       this.historyRight = res.data.list;
      //       this.historyOwner = res.data.owner;
      //     }
      //   }
      // );

      this.dialogEdit = true;
    },

    getDai() {
      userTaskCount({}).then((res) => {
        if (res.success) {
          this.headData = res.data;
        }
      });
    },
    changeBottom(value) {
      this.changeNum = value;
      this.pageParams.pageNo = 1;
      this.getList();
    },

    //获取数据
    getList() {
      let { pageNo = 1, pageSize = 10 } = this.pageParams;
      let {
        key = [],
        billNo = "",
        billTypeNo = "",
        billTitle = "",
      } = this.searchKeyword;
      let processDefinitionListParam = {
        page: pageNo,
        pageSize: pageSize,
        billTypeNo,
        billNo,
        billTitle,
      };
      if (key && key.length > 0) {
        processDefinitionListParam["startTime"] = key[0];
        processDefinitionListParam["endTime"] = key[1];
      }
      let obj = {
        1: getTaskList,
        2: getHistoryByUserId,
        3: getUserStarts,
      };
      this.pageParams.loading = true;

      obj[this.changeNum](processDefinitionListParam).then((res) => {
        if (res.success) {
          this.tableData = res.data.data.map((item) => {
            // item.id = item.processInstanceId;
            return item;
          });
          //   this.pageParams.total=res.data.length>0?res.data[0]
          this.pageParams.total = 0;
          if (res.data.data.length > 0) {
            this.pageParams.total = Number(res.data.totalCount);
          }
          this.pageParams.loading = false;
        }
      });
    },

    searchMethod(value) {
      console.log(value);
      this.searchKeyword = value;
      this.pageParams.pageNo = 1;
      this.getList();
    },

    //选择事件
    handleItemSelect(val) {
      this.multipleSelection = val;
    },
    //翻页、跳页事件
    pageChange(e) {
      this.pageParams.pageNo = e.isChangeSize ? 1 : e.page;
      this.pageParams.pageSize = e.limit;
      this.getList();
    },
  },
};
</script>


<style lang='less' scoped>
.selectClick {
  background-color: rgb(234, 243, 255) !important;
  color: rgb(0, 101, 255);
}
.setflexhead {
  display: flex;
  height: 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 6px;
  & > div {
    width: 120px;
    cursor: pointer;
    height: 32px;
    border-radius: 16px;
    background: #f7f9fd;
    font-size: 12px;
    display: flex;
    margin-right: 16px;
    & > div:first-child {
      margin-top: 4px;
      margin-left: 8px;
    }
    & > div:nth-child(2) {
      line-height: 32px;
      margin-left: 6px;
      margin-right: 6px;
    }
    & > div:last-child {
      line-height: 32px;
    }
    img {
      height: 24px;
      width: 24px;
    }
  }
}
/deep/ .setDialog {
  width: 1200px !important;
  max-height: 700px !important;

  .el-dialog__body {
    padding: 11px !important;
  }
  .setModalMain {
    display: flex;

    & > div:first-child {
      width: 840px;
      img {
        width: 820px;
      }
    }
    & > div:last-child {
      width: 364px;
      // border-left: 1px solid;
      padding-left: 24px;
    }
    .setHeadfelx {
      display: flex;
      & > div {
        cursor: pointer;
        margin-right: 12px;
        padding-bottom: 2px;
      }

      .showactive {
        border-bottom: 2px solid #0066ff;
        color: #0066ff;
      }
      .noactive {
        border-bottom: 2px solid #374256;
        color: 374256;
      }
    }
  }
}
.setflex {
  display: flex;
}
.setdatesty {
  /deep/ .el-date-editor {
    width: 166px !important;
  }
}
.setmoreflex {
  display: flex;
  margin-top: 40px;
  & > div:first-child {
    width: 40px;
  }
  & > div:last-child {
    width: 300px;
  }
}

.setBorderdiv {
  position: relative;
  .setline {
    position: absolute;
    width: 2px;
    background: rgba(0, 0, 0, 0.08);
    height: 40px;
    top: -52px;
    left: 11px;
    height: 53px;
  }
}
</style>

<style lang="less" scoped>
.setcard {
  /deep/ .el-card__body {
    height: calc(100vh - 110px) !important;
  }
}
.setAllShen {
  margin-top: 12px;
  .setone {
    display: flex;
    & > div:first-child {
      width: 80px;
      text-align: right;
      padding-right: 8px;
    }
    & > div:last-child {
      flex: 1;
    }
  }
  .shenButton {
    margin-top: 12px;
    text-align: right;
  }
}
</style>
