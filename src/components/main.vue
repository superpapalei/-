<template>
  <div class="center">
    <el-dialog title="日历" :visible.sync="calen_visible" :close-on-click-modal="false" width="30%">
      <div slot="title" class="header-title">
        <span class="el-icon-date"> 日历</span>
      </div>
      <div>
        <calenUse v-on:fun="closeCalendar"></calenUse>
      </div>
    </el-dialog>
    <el-container class="page">
      <el-header style="height:50px;">
        <div class="aside-header">
          <div class="aside-logo"></div>
          <span style="margin:0 10px;">知匠项目管控系统</span>
          <i class="el-icon-s-home icon-color aside-home" @click="refreshPage"></i>
        </div>
        <div class="menu-contain">
          <el-menu mode="horizontal" :default-active="url" @select="addBreadCrumb" style="height:50px;" router>
            <!-- 单独的测试页面单独写，不经过权限加载 -->
            <el-submenu index="1">
              <template slot="title">测试</template>
              <el-menu-item-group>
                <el-menu-item index="test" route="/test">测试</el-menu-item>
                <el-menu-item index="ScheduleTest" route="/ScheduleTest">计划测试</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">项目准备</template>
              <el-menu-item-group>
                <el-menu-item index="standardTask" route="/standardTask">标准任务</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">基础数据</template>
              <el-menu-item-group>
                <el-menu-item @click.native="openCalendar">日历</el-menu-item>
                <el-menu-item index="dept" route="/dept">部门</el-menu-item>
                <el-menu-item index="emp" route="/emp">人员</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 权限树加载 -->
            <!-- <menuTree :menuTreeItem="menuTreeList" /> -->
          </el-menu>
        </div>
        <ul class="right-aside-head">
          <li>
            <el-popover placement="left" width="300" trigger="hover" class="popoverP">
              <div class="messageBox">
                <div class="messageHead">
                  <span style="color:black;">消息通知</span>
                </div>
                <div class="messageBody">
                  <div v-for="(item,index) in messageList" :key="index" class="messageItem">
                    <span class="messageTitle">{{item.messageTitle}}
                    </span>
                    <el-popover v-if="isReduce(item.messageContent)" placement="left" width="200" trigger="hover"
                      :content="item.messageContent">
                      <span class="messageContent" slot="reference">{{item.messageContent | fontWidthMeasure}}
                      </span>
                    </el-popover>
                    <span v-else class="messageContent">{{item.messageContent | fontWidthMeasure}}
                    </span>
                  </div>
                </div>
              </div>
              <i class="el-icon-message-solid icon-color" style="position:relative;" slot="reference">
                <span class="unReadMessage"></span>
              </i>
            </el-popover>
          </li>
          <li>
            <i class="el-icon-question icon-color"></i>
          </li>
          <li>
            <el-dropdown trigger="hover">
              <span class="dropSpan">
                <i class="el-icon-user icon-color" style="margin:0;"></i>
                <i class="el-icon-arrow-down el-icon--right icon-color" style="margin:0;"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="min-width: 150px;">
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li @click="screenfull">
            <i class="iconfont icon-color">&#xe663;</i>
          </li>
        </ul>
      </el-header>
      <el-header style="height:40px;" v-if="breadCrumbList.length">
        <div class="breadCrumb">
          <div style="font-size:15px;"><template v-for="(item, index) in breadCrumbList"><a v-if="index == 0"
                :key="index" @click="refreshPage">&nbsp;{{ item.menu_name }}>&nbsp;</a><span :key="index"
                v-else>&nbsp;{{ item.menu_name }}>&nbsp;</span></template></div>
        </div>
      </el-header>
      <el-main style="margin:0;padding:0;background:#ECF5EF;" class="backTop">
        <el-card class="mainContent">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive === true" />
          </keep-alive>
          <router-view v-if="$route.meta.keepAlive !== true" />
          <div v-if="activeTabName == 'main'">
            <div style="min-height:1500px;">
              主页内容
              主页内容
              主页内容
              主页内容
              主页内容
              主页内容
              主页内容
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
    <el-backtop target=".backTop" :right="30" :visibility-height="20">
      <div style="{height: 100%;width: 100%;background-color: #f2f5f6;box-shadow: 0 0 6px rgba(0,0,0, .12);
                        text-align: center;line-height: 40px;color: #1989fa;}">
        TOP
      </div>
    </el-backtop>
  </div>
</template>

<script>
import menuTree from "./menuTree";
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
import Vue from "vue";
import Cookies from "js-cookie";
import screenfull from "screenfull";
import calenUse from "./calen-use/menupage.vue";

export default {
  name: "Main",
  components: {
    menuTree,
    calenUse
  },
  data() {
    return {
      defaultUrl: "",
      asideStatus: false, //false:菜单栏处于展开状态； true：菜单栏处于收起状态
      asideWidth: "200px",
      calen_visible: false,
      radio2: 3,
      currentRow: null,
      messageList: [
        {
          messageTitle: "消息标题1",
          messageContent:
            "消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容"
        },
        {
          messageTitle: "消息标题2",
          messageContent: "消息内容消息内容消息内容消息内容"
        }
      ]
    };
  },
  filters: {
    //测量字符串的px长度
    fontWidthMeasure(text) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      context.font = "14px Microsoft YaHei";
      var dimension = context.measureText(text);
      if (dimension.width > 290) {
        var strTemp = "";
        for (var i = 0; i <= text.length; i++) {
          //遍历字符串
          if (context.measureText(strTemp).width > 260) {
            break;
          }
          strTemp += text.charAt(i).toString();
        }
        text = strTemp + "...";
      }
      return text;
    }
  },
  methods: {
    ...mapMutations("navTabs", [
      "addTab",
      "addBreadCrumb",
      "setMenuTreeList",
      "isContainMenu"
    ]),
    ...mapActions("navTabs", ["closeTab", "closeToTab"]),
    //全屏事件
    screenfull() {
      if (!screenfull.enabled) {
        this.$message({
          message: "您的浏览器不支持全屏!!!",
          type: "warning"
        });
        return false;
      }
      screenfull.toggle();
      this.isFullscreen = true;
    },
    refreshPage() {
      this.$router.go(0); //刷新页面
    },
    //退出登录
    logout() {
      //清除数据
      Cookies.remove("cid");
      //跳转链接
      this.$router.push({
        name: "login",
        params: {
          autoSign: false //自动登录
        }
      });
      //this.$router.go(0);//刷新页面
    },
    isReduce(text) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      context.font = "14px Microsoft YaHei";
      var dimension = context.measureText(text);
      return dimension.width > 290;
    },
    openCalendar() {
      this.calen_visible = true;
      //this.$router.go(0);//刷新页面
    },
    closeCalendar() {
      this.calen_visible = false;
      //this.$router.go(0);//刷新页面
    },
    //点击标签页触发的事件
    getTab(val) {
      this.$store.commit("navTabs/setActiveUrlName", val.name);
    },
    //获取当前路径,刷新用
    getPath() {
      this.defaultUrl = window.location.href.split("#/")[1];
    },
    changeAside() {
      this.asideStatus = !this.asideStatus;
      if (this.asideStatus == false) {
        this.asideWidth = "200px";
        document.getElementById("aside-logo").style.display = "block";
        document.getElementById("asideControll").innerHTML = "&#xe61e;";
      } else {
        this.asideWidth = "60px";
        document.getElementById("aside-logo").style.display = "none";
        document.getElementById("asideControll").innerHTML = "&#xe65f;";
      }
    },
    //获得菜单数组并传入store ,await不能阻塞主线程，这里可能没起作用
    async getMenuTree() {
      this.$store.commit("navTabs/emptyMenuTreeList");
      await this.z_get({
        userid: JSON.parse(Cookies.get("userInfo")).userId
      }).then(res => {
        if (res.data.children.length > 0) {
          this.setMenuTreeList(res.data.children);
          //只有一个菜单，默认加载
          if (res.data.children.length == 1) {
            if (
              res.data.children[0].menu_type == "menu" &&
              (!res.data.children[0].children ||
                res.data.children[0].children.length == 0)
            ) {
              this.addTab(res.data.children[0].menu_link);
            }
          }
          //加载角标
          this.getIconAll();
        } else {
          this.$alert("没有菜单权限，请联系管理员配置", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
        }
      });
    },
    //获取角标在获取权限之后
    getIconAll() {}
  },
  computed: {
    ...mapState("navTabs", [
      "tabList",
      "breadCrumbList",
      "menuTreeList",
      "menuTreeListFlatten"
    ]),
    url() {
      let index = this.$store.state.navTabs.activeUrlName;

      return index;
    },
    activeTabName: {
      get() {
        return this.$store.state.navTabs.activeTabName;
      },
      set(value) {
        this.$store.commit("navTabs/setActiveUrlName", value);
        this.$router.push({
          path: "/" + this.$store.state.navTabs.activeUrlName
        });
      }
    }
  },
  mounted() {},
  beforeCreate() {},
  created() {
    //this.getMenuTree(); //获得菜单权限树,获取角标在后去权限之后
    this.getPath();
    this.addTab("main");
  }
};
</script>

<style scoped>
.center {
  width: 100%;
  margin: 0 auto;
}
.page {
  box-sizing: border-box;
  height: 100vh;
}
.page-contain {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
/*顶部导航样式*/
.el-header {
  /* background: #0d6ba8; */
  background: white;
  padding: 0;
  position: relative;
}
/*左侧样式*/
.aside-header-contain {
  display: inline-block;
}
.aside-header {
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-left: 20px;
}
.aside-logo {
  width: 35px;
  height: 35px;
  line-height: 60px;
  display: inline-block;
  background: url("../assets/img/zjkj.jpg") no-repeat;
  background-size: cover;
}
.aside-home {
  font-size: 25px;
}
.aside-home:hover {
  background: #cbced4;
  cursor: pointer;
}
.menu-contain {
  display: inline-block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
/* 右侧样式 */
.right-aside-head {
  float: right;
  margin: 0 20px;
}
.right-aside-head li {
  float: left;
}
.right-aside-head li:hover {
  cursor: pointer;
  background: #cbced4;
}
.right-aside-head i {
  font-size: 18px;
  line-height: 50px;
  margin: 0 10px;
}
.dropSpan {
  line-height: 50px;
  font-size: 14px;
  margin: 0 10px;
}
.icon-color {
  color: #303133;
}
.header-title {
  font-size: 28px;
}
.breadCrumb {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ebeef5;
  user-select: none;
  box-sizing: border-box;
}
.breadCrumb a {
  cursor: pointer;
  color: #000;
}
.breadCrumb a:hover {
  color: #409eff !important;
}
.messageBox {
  width: 100%;
}
.messageHead {
  width: 100%;
  height: 30px;
  padding: 0 5px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
}
.messageBody {
  width: 100%;
}
.messageItem {
  widows: 100%;
  height: 50px;
  padding: 0 5px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  cursor: pointer;
}
.messageItem:hover {
  background: #f5f7fa;
}
.messageTitle {
  height: 28px;
  line-height: 14px;
  display: table-cell;
  vertical-align: middle;
  box-sizing: border-box;
}
.messageContent {
  display: block;
}
.unReadMessage {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 8px;
  height: 8px;
  color: #fff;
  background-image: linear-gradient(#54a3ff, #006eed);
  background-clip: padding-box;
  border: 1px solid #24292e;
  border-radius: 50%;
}
</style>

<style>
/* 全局样式放在这 */
/* 水平样式 */
.el-menu--horizontal > .el-menu-item,
.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
}
.el-menu--horizontal > div > .el-menu-item,
.el-menu--horizontal > div > .el-submenu .el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
}
.el-menu--horizontal > div > .el-submenu {
  float: left !important;
}
/* 一级菜单的样式 */
.el-menu--horizontal > div > .el-menu-item {
  float: left !important;
  margin: 0 !important;
  border-bottom: 2px solid transparent !important;
  color: #909399 !important;
}
.el-menu--horizontal > .el-menu .el-menu-item.is-active {
  color: #409eff !important;
}
.el-menu--horizontal > .el-menu .el-menu-item:hover {
  background: #f5f7fa !important;
}
.el-menu--horizontal > div > .el-menu .el-menu-item.is-active {
  color: #409eff !important;
}
.el-menu--horizontal > div > .el-menu .el-menu-item:hover {
  background: #f5f7fa !important;
}
.el-menu--horizontal > div > .el-submenu.is-active .el-submenu__title {
  border-bottom: 2px solid #409eff !important;
  color: #303133 !important;
}
/* 解决下拉三角图标 */
.el-menu--horizontal > div > .el-submenu .el-submenu__icon-arrow {
  position: static !important;
  vertical-align: middle !important;
  margin-left: 8px !important;
  margin-top: -3px !important;
}
/* 解决无下拉菜单时 不对齐问题 */
.el-menu--horizontal > div > .el-submenu .el-submenu__title {
  height: 60px !important;
  line-height: 60px !important;
  border-bottom: 2px solid transparent !important;
  color: #909399 !important;
}
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.el-scrollbar > div {
  margin-bottom: 0px !important;
}
.el-menu-item-group__title {
  padding: 4px 0 !important;
}
.el-card__header {
  padding: 10px !important;
}
.el-card__body {
  padding: 10px !important;
}
.mainContent .el-card__body{
  padding: 20px !important;
}
.el-dialog__body {
  padding: 20px !important;
}
.el-table td,
.el-table th {
  padding: 6px 0 !important;
}
.el-badge__content {
  border: none !important;
}
.el-table th.gutter {
  display: table-cell !important;
}
.el-table colgroup.gutter {
  display: table-cell !important;
}
.el-table .success-row {
  background: #f0f9eb !important;
}
.el-dropdown-menu__item {
  line-height: 25px !important;
}
.el-button{
  padding: 12px;
}
</style>