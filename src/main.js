import Vue from 'vue'


import Element from 'element-ui'
import './assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import "@/assets/styles/setPeoThreeCom.scss"
import '@/assets/iconfont/iconfont.css'
import "@/assets/styles/z.scss"
import "@/assets/styles/pop.scss"
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import { download } from '@/utils/request'
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import {Base64} from "js-base64";
//富文本框使用方法
/* <quill-editor  style="width:100%;height:250px"
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption" maxlength="1000"
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
        </quill-editor> */
//配置参数
// editorOption:{
//      theme:'snow',
//   modules: {
//             toolbar:[
//               ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
//               ['blockquote', 'code-block'],     //引用，代码块
//                 [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
//             // 标题，键值对的形式；1、2表示字体大小
//               [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
//               [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
//    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
//               ['link','image'],
//               ['clean']
//             ]
//           },
// }
Vue.use(VueQuillEditor);


import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
} from '@/utils/ruoyi'
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 使用的格式化时间的插件
import moment from 'moment'

import '@/assets/icons' // icon
import './permission' // permission control


// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
// Vue.prototype.$loading = Loading
Vue.prototype.$moment = moment
Vue.prototype.applicationName = '中恒大耀工业互联网平台'
Vue.prototype.applicationNameEng = 'HuanSi'

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}


// 按钮的权限判断
Vue.prototype.isShowFileQuan = function (picfile) {
  let {pointName='',prefixName='',createDate='',fileName=''}=picfile.data;
  let url=`http://${Base64.decode(prefixName)}.${Base64.decode(pointName)}/sm/${createDate}/${fileName}`;
  return url;
}
// 解析上传文件的路径 
Vue.prototype.isShowPermiss = function (msg) {
  
  // 如果是超级管理员  能看到所有的按钮
  if(JSON.parse(localStorage.getItem('userInfoNow')).systemAdmin){
    return true
  }
 let allRoles= JSON.parse(localStorage.getItem('userRoles'));
  return allRoles.find(item=>item==msg)
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg)
}

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(permission)
Vue.use(VueMeta)
//格式化数字
function formatNumber (value) {

  value = value.split('.')[0];
  value = value.replace(/\-/g, "")
  const regExp = /[^-0-9]/g;
  value.replace(regExp, '');
  return value.replace(/[-]/g, "")
}

//只允许输入数字
window.inputFunc = function (value, e) {
  if (e.inputType == 'number') {
    return formatNumber(value)
  } else {
    return value
  }
},
  /**
   * If you don't want to use mock-server
   * you want to use MockJs for mock api
   * you can execute: mockXHR()
   *
   * Currently MockJs will be used in the production environment,
   * please remove it before going online! ! !
   */

  Vue.use(Element, {
    size: 'mini' // set element-ui default size
  })

Vue.config.productionTip = false

// router.afterEach((to, from) => {
//   Vue.prototype.$setHeight = (ref) => {
//     console.log(ref)
//     window.onresize = function() {
//       Vue.prototype.$nextTick(function(){
//         {
//           ref.resizeState.height=window.innerHeight - ref.$el.offsetTop - 150
//         }
//       })
//     }
//   }
// })
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
/**
 * 修正精度问题
 * @param len 保留长度
 * @returns {string}
 */
Number.prototype.toFixed = function (len = 2) {
  if (len > 20 || len < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20');
  }
  // .123转为0.123
  let number = Number(this);
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof (len) == 'undefined' || len === 0) {
    return (Math.round(number)).toString();
  }
  let result = number.toString(),
    numberArr = result.split('.');

  if (numberArr.length < 2) {
    //整数的情况
    return padNum(result);
  }
  let intNum = numberArr[0], //整数部分
    deciNum = numberArr[1],//小数部分
    lastNum = deciNum.substr(len, 1);//最后一个数字

  if (deciNum.length === len) {
    //需要截取的长度等于当前长度
    return result;
  }
  if (deciNum.length < len) {
    //需要截取的长度大于当前长度 1.3.toFixed(2)
    return padNum(result)
  }
  //需要截取的长度小于当前长度，需要判断最后一位数字
  result = intNum + '.' + deciNum.substr(0, len);
  if (parseInt(lastNum, 10) >= 5) {
    //最后一位数字大于5，要进位
    let times = Math.pow(10, len); //需要放大的倍数
    let changedInt = Number(result.replace('.', ''));//截取后转为整数
    let fu = 1 / changedInt < 0;// 为true 时，则 changedInt < 0 或者 changedInt = -0,否则为正数或等于0
    if (fu) {
      changedInt--;//整数进位
    } else {
      changedInt++;//整数进位
    }
    changedInt /= times;//整数转为小数，注：有可能还是整数
    result = padNum(changedInt + '');
  }
  return result;


  function padNum (num) {
    let dotPos = num.indexOf('.');
    if (dotPos === -1) {
      //整数的情况
      num += '.';
      for (let i = 0; i < len; i++) {
        num += '0';
      }
      return num;
    } else {
      //小数的情况
      let need = len - (num.length - dotPos - 1);
      for (let j = 0; j < need; j++) {
        num += '0';
      }
      return num;
    }
  }
}
