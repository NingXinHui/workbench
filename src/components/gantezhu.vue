<template>
  <div>
    <div>要显示的标题</div>
       <div class="ssss">
      <div class="nimen">
        视图
      </div>
       <div class="nimen">
        转机台(上机前)
      </div>
       <div class="nimen">
        调整预计上机时间
      </div>
    </div>
      <!-- 画下要显示的表格  -->
      <div class="setflex">
        <!--显示的左侧的内容 -->
        <div class="setleft" :style="{height:(showHight - 30)+'px'}">
          <div v-for="(item,index) in showLeft" :key="item.id" :class="{'strper' : index == 0 ? true : index%2 ==0 ? true : false}">
            {{ item.name }}
          </div>
        </div>
        <!-- 显示的右侧的内容 -->
        <div class="setright" :style="{width:tableHeight+'px',height:showHight+'px'}">
          <div
            :style="{ width: 100 * showarr.length + 'px', overflow: 'hidden' }"
          >
            <div class="sethead">
              <div v-for="(item, index) in showarr" :key="index">
                {{ item }} ({{objday[showday[index]]}})
              </div>
            </div>
            <div class="setmaintable">
               <div v-for="item in showLeft" :key="item.id">
              <div class="setposi">
                <div
                  class="setding"
                  v-for="(itemx, index) in showList.filter(
                    (ite) => ite.id == item.id
                  )"
                  @contextmenu.prevent="() => openDing($event,item)"
                  :style="{
                    width: itemx.width + 'px',
                    left: itemx.left + 'px',
                    background: showcolor[index],
                  }"
                  :key="index"
                >
                  <el-popover
                    placement="top-start"

                    width="200"
                    trigger="hover"
                    :content="itemx.desc"
                  >
                   <div slot="reference">
                      <span >
                      {{ itemx.name }}
                    </span>
                   </div>
                  </el-popover>

                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Index",
  components: {},
  props: {
    showWidth: {
      type: Number,
      default: 600
    },
    showHight:{
      type: Number,
      default: 400

    },
    fromDate:{
        type:String,
        default:'',
    },
    toDate:{
        type:String,
        default:'',

    },
    showData:{
        type:Array,
        default:[]
    },
    updateName:{
        type:Array,
        default:[]
    },
  },

  created(){
     this.$nextTick(function () {
      this.tableHeight =
        window.innerWidth -240;
      // 监听窗口大小变化
      let self = this;
      window.onresize = function () {
        self.tableHeight =
          window.innerWidth -240;
      };
    });

  },
  mounted() {
    let startshow = moment(new Date(this.fromDate)).startOf("day");
    let endshow = moment(new Date(this.toDate)).endOf("day");

    let arr = []; //上面显示的日期
    let arrone=[];//上面显示的星期几
    for (let i = startshow; i < endshow; i = i + 1000 * 60 * 60 * 24) {
      arr.push(moment(i).format("MM-DD"));
      arrone.push(moment(i).day())
    }
    // 处理下别名的问题
    if(this.updateName.length>0){
      this.showList=this.showData.map(item=>{
        this.updateName.map(itemx=>{
          let newl=itemx.split('=');
          item[newl[0]]=item[newl[1]]
        })
        return item
      })
    }
    // 左侧要显示的人员信息

    var hash = {};
    this.showLeft = this.showList.reduce(function (item, next) {
      hash[next.id] ? "" : (hash[next.id] = true && item.push(next));
      return item;
    }, []);
    this.showarr = arr;
    this.showday=arrone;
    this.showList = this.showList.map((item) => {
      let itemStart = new Date(item.StartDate).valueOf();
      let itemEnd = new Date(item.EndDate).valueOf();
      item.width =
        ((itemEnd - itemStart) / (endshow - startshow)) * (100 * arr.length);
      item.left =
        ((itemStart - startshow) / (endshow - startshow)) * (100 * arr.length);
      return item;
    });
  },
  data() {
    return {
      tableHeight:0,
      showcolor: ["red,blue", "yellow"],
      showLeft: [], //展示的左侧的显示的列表
      showarr: [], //展示的右侧上面显示的时间数组
      showday:[],//显示周几
      objday:{
        0:'日',
        1:"一",
        2:"二",
        3:"三",
        4:"四",
        5:"五",
        6:"六",
      },
      showList: [],
    };
  },
  methods: {
     openDing(e,record) {
      var el = document.querySelector(".ssss");
      var x = e.clientX;
      var y = e.clientY;
      console.log(x,y);
      el.style.display = "block";
      el.style.left = x + 5 + "px";

      y = y > 865 ? 865 : y;
      el.style.top = y + 5 + "px";

      console.log(el.style);
      console.log(990)

      document.onclick = function () {
        el.style.display = "none";
      };
    }
  },
};
</script>

<style lang="less" scoped>
.setflex {
  display: flex;


  .setleft {
    width: 120px;
    height: 370px;
    border: 1px solid #dee6f2;
    border-top-color: transparent;
    border-right: none;
    margin-top: 30px;
    flex-shrink: 0;
    & > div {
      line-height: 35px;
      border-bottom: 1px solid #dee6f2;
      text-align: center;
    }

    & > div:first-child {
      border-top: 1px solid #dee6f2;
    }
  }
  .setright {

    overflow: auto;

    border: 1px solid #dee6f2;

    height: 400px;
    .sethead {
      display: flex;

      flex-wrap: nowrap;
      & > div {
        flex-shrink: 0;
        width: 100px;
        border-right: 1px solid #dee6f2;
        border-bottom: 1px solid #dee6f2;
        padding: 4px 12px 5px 12px;
      }

    }
    .setmaintable{
      height: 370px;
      border-right: 1px solid #dee6f2 !important;
    }
    .setposi {
      position: relative;
      height: 36px;
      padding: 3px 0px;
      border-bottom: 1px solid #dee6f2;
      .setding {
        position: absolute;
        height: 30px;
        background: #dee6f2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
        line-height: 30px;

      }
    }
  }
}
.strper {
  background: #f7f9fd;
}
.ssss{
  display: none;
  position: fixed;
  z-index: 1000;
  height: 114px;
  background: #fff;
  border: 1px solid #f9f9f9;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  .nimen {
  height: 38px;
  border-bottom: 1px solid #f1f1f1;
  line-height: 38px;
  text-align: center;
  padding: 5px 30px;
  }
}
</style>
