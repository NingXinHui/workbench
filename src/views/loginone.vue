<template>
  <div class="login-wrap">
    <Top />
    <div class="ms-login">
      <div class="ms-title">
        欢迎登录<span>{{ applicationName }}</span>
      </div>
      <div class="en-title">Welcome to the {{ applicationNameEng }} system</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="unicodeshow">
          <el-autocomplete
            class="inputClass"
            v-model="param.unicodeshow"
            :fetch-suggestions="querySearch"
            ref="childthree"
            placeholder="请输入内容"
            @keyup.enter.native="focusOneCong()"
            @keyup.tab.native="focusOneCong"
            @select="handleSelect"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            @keyup.enter.native="focusSecong()"
            @keyup.tab.native="focusSecong"
            ref="childone"
            v-model="param.username"
            placeholder="请输入企业账号"
            class="inputClass"
          >
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="mobile">
          <el-input v-model="param.mobile" placeholder="手机号码" class="inputClass">
            <template #prepend>
              <el-button icon="el-icon-mobile"></el-button>
            </template>
          </el-input>
        </el-form-item> -->
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            ref="childtwo"
            v-model="param.password"
            @keyup.enter.native="handleLogin()"
            @keyup.tab.native="focusSecong"
            class="inputClass"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="check-btn">
          <el-checkbox v-model="checked">自动登录</el-checkbox>
          <span>忘记密码</span>
        </div>
        <div class="login-btn">
          <el-button
            style="font-size: 18px"
            type="primary"
            @click="handleLogin()"
            >登录</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import Top from "@/components/top.vue";
import { encrypt, decrypt, EncryptOne } from "@/utils/jsencrypt";
import { checkTel } from "@/utils/validate";

export default {
  name: "Login",
  components: { Top },
  data() {
    return {
      checked: false,
      param: {
        username: "",
        mobile: "15070368776",
        password: "",
        unicodeshow: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入企业账号", trigger: "blur" },
        ],
        mobile: [{ required: true, validator: checkTel, trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        unicodeshow: [
          { required: true, message: "请输入租户", trigger: "blur" },
        ],
      },
      loginRegis: true,
      restaurants: [],
      state1: "",
      state2: "",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();

    let allNewsListUnicode = [];
    if (localStorage.getItem("unilist")) {
      allNewsListUnicode = JSON.parse(localStorage.getItem("unilist"));
    }
    this.restaurants = allNewsListUnicode;

    this.param = {
      username: "",
      password: "",
      unicodeshow:
        allNewsListUnicode.length > 0
          ? allNewsListUnicode[allNewsListUnicode.length - 1].value
          : "",
    };
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    focusOneCong() {
      //  this.$refs.childthree.blur();
      this.$refs.childone.focus();
    },
    focusSecong() {
      this.$refs.childone.blur();
      this.$refs.childtwo.focus();
    },
    getCode() {
      // getCodeImg().then(res => {
      //   this.codeUrl = "data:image/gif;base64," + res.img;
      //   this.param.uuid = res.uuid;
      // });
    },
    handleLogin() {
      this.$refs.login.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.param.rememberMe) {
            Cookies.set("username", this.param.username, { expires: 30 });
            Cookies.set("password", encrypt(this.param.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.param.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          let { username, password, unicodeshow, ...other } = this.param;
          this.$store
            .dispatch("Login", {
              account: username,
              uniqueCode: unicodeshow,
              password: EncryptOne(password),
              ...other,
              grantType: "password",
              tenantId: "000000",
            })
            .then(() => {
              if (localStorage.getItem("unilist")) {
                let arr = JSON.parse(localStorage.getItem("unilist"));
                if (!arr.find((item) => item.value == this.param.unicodeshow)) {
                  arr.push({ value: this.param.unicodeshow });
                  localStorage.setItem("unilist", JSON.stringify(arr));
                } else {
                  let arrold = arr.filter(
                    (item) => item.value != this.param.unicodeshow
                  );
                  arrold.push({ value: this.param.unicodeshow });
                  localStorage.setItem("unilist", JSON.stringify(arrold));
                }
              } else {
                localStorage.setItem(
                  "unilist",
                  JSON.stringify([{ value: this.param.unicodeshow }])
                );
              }

              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              // this.loading = false;
              // this.getCode();
            });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/img/login-bg.png) center center no-repeat;
  background-size: 100% 100%;
}
.ms-title {
  line-height: 33px;
  font-size: 20px;
  color: #333;
  font-weight: 600;
  margin: 59px 0 0 48px;
  span {
    color: #226aff;
  }
}
.check-btn {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  // color: #758fac;
  font-size: 14px;
  :deep .el-checkbox__label {
    color: #758fac;
    font-size: 14px;
  }
  span {
    cursor: pointer;
    font-size: 14px;
  }
}
.en-title {
  height: 15px;
  opacity: 1;
  font-size: 12px;
  font-family: DINPro, DINPro-Regular;
  font-weight: 400;
  text-align: left;
  color: #c4c7cc;
  line-height: 15px;
  letter-spacing: 0px;
  margin-left: 48px;
}
.ms-login {
  position: absolute;
  right: 10%;
  top: 50%;
  width: 416px;
  margin: -272px 0 0 -208px;
  border-radius: 5px;
  background: white;
}
.ms-register {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 90%;
  width: 76%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background: white;
  padding: 10px;
  overflow: auto;
}

.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 48px;
  margin-bottom: 10px;
  border-radius: 3px;
}
.login-tips {
  font-size: 14px;
  line-height: 20px;
  color: #6f8faf;
  cursor: pointer;
  span {
    color: #ff9e00;
    margin-left: 5px;
  }
}
.form-item {
  margin-bottom: 16px;
}
.inputClass :deep .el-input__inner {
  height: 56px;
}
.btns {
  background-color: #f5f7fa;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 29px;
  width: 1px;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: none;
}
</style>
<style lang="scss" scoped>
:deep .el-input-group__prepend {
  background: #fff;
}

.supplier-item {
  :deep .el-form-item__content {
    display: flex;
  }
  :deep .el-select {
    width: 230px;
  }
}
</style>
<style lang="less" scoped>
/deep/ .el-icon-user {
  line-height: 31px;
}
/deep/ .el-icon-lock {
  line-height: 31px;
}
.ms-content {
  padding: 30px 48px;
  /deep/ input {
    padding: 23px;
  }
  /deep/ .el-input-group__prepend {
    line-height: 46px;
    text-align: center;
    button {
      padding: 0px;
      i {
        font-size: 16px;
      }
    }
  }
}
</style>