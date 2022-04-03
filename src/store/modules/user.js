import { login, logout, getInfo, refreshToken } from "@/api/login";
import { getToken, setToken, setExpiresIn, removeToken } from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    permissions: [],
    userNews: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_USERSNEWS: (state, users) => {
      state.userNews = users;
    },

    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const account = userInfo.account.trim();
      const password = userInfo.password;
      const grantType = userInfo.grantType;
      const tenantId = userInfo.tenantId;
      const uniqueCode = userInfo.uniqueCode;
      // let {account, password, grantType,tenantId}=userInfo;
      return new Promise((resolve, reject) => {
        login(account, password, grantType, tenantId, uniqueCode)
          .then(res => {
            console.log(res);
            // let data = res.data.tokenInfo;
            let data = res.data
            // console.log(JSON.stringify(res.data.permissions));
            console.log(JSON.stringify(res.data.userInfo));
            console.log(JSON.stringify(data.userId));
            // setToken(data.accessToken)
            // commit('SET_TOKEN', data.accessToken)

            setToken(data.access_token);
            commit("SET_TOKEN", data.access_token);

            localStorage.setItem(
              "userRoles",
              JSON.stringify(res.data.permissions)
            );

            localStorage.setItem("userInfoNow", JSON.stringify(data.userInfo));

            localStorage.setItem("userId", data.userId);
            setExpiresIn(data.expires_in);
            commit("SET_EXPIRES_IN", data.expires_in);
            sessionStorage.setItem("userName", data.userName);
            sessionStorage.setItem("taaaId", data.tenantId);
            localStorage.setItem("taaaId", data.tenantId);

            commit("SET_NAME", res.data.userName);
            commit("SET_AVATAR", res.data.avatar);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // getInfo({tenantId:sessionStorage.getItem('taaaId')}).then(res => {
        //   const user = res.data
        //   // const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : user.avatar;
        //   // if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        //   //   commit('SET_ROLES', res.roles)
        //   //   commit('SET_PERMISSIONS', res.permissions)
        //   // } else {
        //   //   commit('SET_ROLES', ['ROLE_DEFAULT'])
        //   // }
        //   // commit('SET_NAME', user.userName)
        //   // commit('SET_AVATAR', avatar)

        //   commit('SET_USERSNEWS',user)
        //   commit('SET_ROLES', ['admin']);
        //   commit('SET_PERMISSIONS', ['***'])
        //  resolve({})
        //   resolve(res)
        // }).catch(error => {
        //   reject(error)
        // })
        commit("SET_ROLES", ["admin"]);
        commit("SET_PERMISSIONS", ["***"]);
        resolve({});
      });
    },

    // 刷新token
    RefreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        refreshToken(state.token)
          .then(res => {
            setExpiresIn(res.data);
            commit("SET_EXPIRES_IN", res.data);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        //如果是本地开发  直接推出就醒了
        if (process.env.NODE_ENV === "development") {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          commit("SET_PERMISSIONS", []);
          removeToken();
          resolve();
        } else {
          logout()
            .then(() => {
              commit("SET_TOKEN", "");
              commit("SET_ROLES", []);
              commit("SET_PERMISSIONS", []);
              removeToken();
              resolve();
            })
            .catch(error => {
              reject(error);
            });
        }
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
