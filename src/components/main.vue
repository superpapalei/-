<template>
  <div class="center">
    <el-dialog title="日历" :visible.sync="calen_visible" :close-on-click-modal="false" width="580px">
      <div slot="title" class="header-title">
        <span class="el-icon-date"> 日历</span>
      </div>
      <div>
        <calenUse v-on:fun="closeCalendar"></calenUse>
      </div>
    </el-dialog>
    <el-container class="page">
      <el-header style="height:50px;box-shadow: 0 0 4px 0 rgba(0,0,0,0.04);">
        <div class="aside-header">
          <div class="aside-logo"></div>
          <span style="margin:0 10px;">知匠项目管控系统</span>
          <i class="el-icon-s-home icon-color aside-home" @click="refreshPage"></i>
        </div>
        <div class="menu-contain">
          <el-menu mode="horizontal" :default-active="activeTabName" @select="addBreadCrumb" text-color="#333"
            active-text-color="#409EFF" style="height:50px;" router>
            <!-- 单独的测试页面自己单独写，不经过权限加载(请勿上传) -->

            <!-- 权限树加载 -->
            <menuTree :menuTreeItem="menuTreeList" />
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
      <el-header style="height:30px;" v-if="breadCrumbList.breadCrumbList.length">
        <div class="breadCrumb">
          <template v-for="(item, index) in breadCrumbList.breadCrumbList">
            <a v-if="index == 0" :key="index" @click="refreshPage">&nbsp;{{ item.menu_name }}&nbsp;>&nbsp;</a>
            <span v-else-if="index == breadCrumbList.breadCrumbList.length - 1" :key="index">
              <el-select v-model="item.menu_link" size="mini" style="width:110px;" @change="changRouter">
                <el-option v-for="array in breadCrumbList.selectArray" :key="array.menu_link" :label="array.menu_name"
                  :value="array.menu_link">
                </el-option>
              </el-select>
            </span>
            <span v-else :key="index">&nbsp;{{ item.menu_name }}&nbsp;>&nbsp;</span>
          </template>
        </div>
      </el-header>
      <el-main class="backTop">
        <el-card class="mainContentCard" shadow="never">
          <div class="mainContent">
            <keep-alive>
              <router-view class="commonStyle" v-if="$route.meta.keepAlive === true" />
            </keep-alive>
            <router-view class="commonStyle" v-if="$route.meta.keepAlive !== true" />
          </div>
          <div v-if="activeTabName == 'main'">
            <div style="height:1500px;background-color:white;">
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
  watch: {},
  methods: {
    ...mapMutations("navTabs", [
      "setActiveTabName",
      "addBreadCrumb",
      "setMenuTreeList",
      "isContainMenu"
    ]),
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
    //判断文字是否超长，超长显示省略号
    isReduce(text) {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      context.font = "14px Microsoft YaHei";
      var dimension = context.measureText(text);
      return dimension.width > 290;
    },
    changRouter(value) {
      this.$router.push({
        path: "/" + value
      });
      this.addBreadCrumb(value);
    },
    openCalendar() {
      this.calen_visible = true;
      //this.$router.go(0);//刷新页面
    },
    closeCalendar() {
      this.calen_visible = false;
      //this.$router.go(0);//刷新页面
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
    getComponent(path) {
      return resolve => {
        require.ensure([], require => {
          resolve(require("@/components/" + path));
        });
      };
    },
    //获得菜单数组并传入store
    getMenuTree() {
      this.$store.commit("navTabs/emptyMenuTreeList");
      this.z_get("api/Home/userMenuTree")
        .then(res => {
          if (res.data.length > 0) {
            this.setMenuTreeList(res.data);
            var main = this.$router.options.routes.filter(
              item => item.name == "main"
            )[0];
            for (var i = 0; i < this.menuTreeListFlatten.length; i++) {
              if (this.menuTreeListFlatten[i].menu_link) {
                var menu_link = this.menuTreeListFlatten[i].menu_link;
                main.children.push({
                  path: "/" + menu_link,
                  name: menu_link,
                  component: this.getComponent(menu_link)
                });
              }
            }
            this.$router.addRoutes([main]);
            //加载角标
            this.getIconAll();
          } else {
            this.$alert("没有菜单权限，请联系管理员配置", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.$alert("获取菜单失败", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
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
    activeTabName() {
      return this.$store.state.navTabs.activeTabName;
    }
  },
  mounted() {
    this.setActiveTabName("main");
    this.getMenuTree(); //获得菜单权限树,获取角标在后去权限之后
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
  padding: 2px 15px;
  background-color: #f8f8f8;
  user-select: none;
  box-sizing: border-box;
}
.breadCrumb a {
  cursor: pointer;
  color: #000;
  font-size: 14px;
}
.breadCrumb a:hover {
  color: #409eff !important;
}
.breadCrumb span {
  font-size: 14px;
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
  top: 12px;
  left: 10px;
  width: 8px;
  height: 8px;
  color: #fff;
  background-image: linear-gradient(#54a3ff, #006eed);
  background-clip: padding-box;
  border-radius: 50%;
}
.mainContentCard {
  min-height: 100%;
  background-color: #eee;
  box-sizing: border-box;
}
.mainContent {
  display: flex;
}
.commonStyle {
  margin: 0 auto;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: white;
}
.backTop {
  margin: 0;
  padding: 0;
  background-color: #ecf5ef;
}
</style>

<style>
/* 全局样式放在这 */
.tbar {
  margin-bottom: 10px;
  padding: 5px 15px;
  background-color: #eee;
}
/* 水平菜单样式 */
.el-menu--horizontal > .el-menu-item,
.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
  padding: 0 15px !important;
}
.el-menu--horizontal > div > .el-menu-item,
.el-menu--horizontal > div > .el-submenu .el-submenu__title {
  height: 50px !important;
  line-height: 50px !important;
  padding: 0 15px !important;
}
.el-menu--horizontal > div > .el-submenu {
  float: left !important;
}
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
.el-menu--horizontal > div > .el-submenu .el-submenu__title {
  border-bottom: 2px solid transparent !important;
  color: #333 !important;
}
.el-menu--horizontal > div > .el-submenu.is-active .el-submenu__title {
  border-bottom: 2px solid #409eff !important;
  color: #409eff !important;
}
/* 解决下拉三角图标 */
.el-menu--horizontal > div > .el-submenu .el-submenu__icon-arrow {
  position: static !important;
  vertical-align: middle !important;
  margin-left: 8px !important;
  margin-top: -3px !important;
}
/* 滚动条样式 */
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.el-scrollbar > div {
  margin-bottom: 0px !important;
}
.el-menu-item-group__title {
  padding: 1px 0 !important;
}
.el-card__header {
  padding: 10px !important;
}
.el-card__body {
  padding: 10px !important;
}
.mainContentCard .el-card__body {
  padding: 10px 15px !important;
}
.el-dialog__body {
  padding: 20px !important;
}
.el-table td,
.el-table th {
  padding: 5px 0 !important;
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
</style>