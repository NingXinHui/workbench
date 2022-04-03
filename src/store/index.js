import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import settings from './modules/settings'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    tagsView,
    permission,
    settings,
  },
  getters
});

export default store

//注册store模块
export const genStore = (name, obj) => {
  store.registerModule(name, obj)
}

import order from "@/store/modules/order"
genStore('order', order)


