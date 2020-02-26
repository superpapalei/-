<template>
  <div class="loginBody">
    <div class="loginHead">
      <img class="loginLogo" src="../assets/img/zjkjFullName.png" alt />
    </div>
    <div class="centerDiv">
      <div class="mainInfo">
        <p class="sysTitle">知匠项目管控系统</p>
        <div class="inputArea">
          <div class="inputItem">
            <el-input style="width:250px;" v-model="userId">
              <div class="inputPrefix" slot="prefix">账号</div>
            </el-input>
          </div>
          <div class="inputItem">
            <el-input style="width:250px;" v-model="password" @keydown.native="keyLogin">
              <div class="inputPrefix" slot="prefix">密码</div>
            </el-input>
          </div>
          <div style="margin-top:10px;">
            <span class="rememberContain" @click="rememberPassWord = !rememberPassWord">
              <input class="rememberCheck" type="checkbox" value v-model="rememberPassWord" /><span
                class="rememberText">自&nbsp;动&nbsp;登&nbsp;录</span>
            </span>
          </div>
        </div>
        <div class="submitBtn" @click="loginSubmit">登录</div>
      </div>
    </div>
    <div class="loginFooter">
      <p class="copyRightText">Copyright © 2020 佛山知匠科技有限公司</p>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      userId: "", //用户账号
      password: "", //用户密码
      rememberPassWord: true,
      autoSign: true
    };
  },
  methods: {
    ...mapMutations("navTabs", ["emptyBreadCrumb"]),
    keyLogin(e) {
      if (e.keyCode == 13) {
        this.loginSubmit();
      }
    },
    loginSubmit() {
      //   if (this.userId === "") {
      //     this.$alert("请输入账号", "提示", {
      //       type: "warning",
      //       confirmButtonText: "确定"
      //     });
      //     return;
      //   }
      //   if (this.password === "") {
      //     this.$alert("请输入密码", "提示", {
      //       type: "warning",
      //       confirmButtonText: "确定"
      //     });
      //     return;
      //   }
      if (this.rememberPassWord) {
        window.localStorage.setItem("username", this.userId);
        window.localStorage.setItem("password", this.password);
      } else {
        window.localStorage.setItem("username", "");
        window.localStorage.setItem("password", "");
      }
      window.localStorage.setItem("rememberPassWord", this.rememberPassWord);
      this.$router.push({
        path: "/main"
      });
      this.$router.go(0); //刷新页面
    }
  },
  mounted() {
    if (this.$route.params && this.$route.params.autoSign != undefined) {
      this.autoSign = this.$route.params.autoSign;
    } else {
      this.autoSign = true;
    }
    this.userId = window.localStorage.getItem("username");
    this.password = window.localStorage.getItem("password");
    this.rememberPassWord =
      window.localStorage.getItem("rememberPassWord") == "true";
    if (this.userId && this.password && this.autoSign) this.loginSubmit();
  }
};
</script>
<style scoped>
.loginBody {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #eff2f7;
}
.loginHead {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  background-color: #e9f1f8;
}
.loginLogo {
  height: 50px;
  margin-left: 20px;
}
.centerDiv {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 400px;
  background-color: white;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.25);
  font-size: 15px;
}
.mainInfo {
  width: 100%;
  height: 100%;
  padding: 60px 0;
  box-sizing: border-box;
}
.sysTitle {
  text-align: center;
  font-size: 25px;
  color: #333;
  font-weight: 400;
  margin: 0;
}
.inputArea {
  margin: 50px 0 60px 0;
}
.inputItem {
  margin-top: 20px;
  text-align: center;
}
.inputPrefix {
  margin: 10px 0 8px 8px;
  color: #606266;
}
.rememberContain {
  position: relative;
  float: left;
  left: 48px;
}
.rememberCheck {
  width: 14px;
  height: 14px;
  vertical-align: middle;
}
.rememberText {
  color: gray;
  vertical-align: middle;
  user-select: none;
}
.submitBtn {
  user-select: none;
  margin: 36px auto 0;
  width: 230px;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  text-align: center;
  background-color: #409eff;
  color: #fff;
  cursor: pointer;
}
.loginFooter {
  position: absolute;
  width: 100%;
  bottom: 0;
  text-align: center;
}
.copyRightText {
  font-size: 14px;
  color: #909399;
}
</style>
<style>
.inputItem .el-input--prefix .el-input__inner {
  padding-left: 50px;
}
</style>