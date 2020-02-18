<template>
  <div class="center">
    <el-container class="page">
      <el-aside :width="asideWidth" style="overflow:hidden;background:white;">
        <el-scrollbar style="height:100%;">
          <div id="aside-header">
            <div id="aside-logo"></div>
            <span>知匠项目管理</span>
          </div>
          <el-menu
            style="margin-bottom:10px;"
            :default-active="url"
            @select="addTab"
          >
          <!-- 单独的测试页面单独写，不经过权限加载 -->
            <router-link to="/test" tag="div">
              <el-menu-item index="test">
                <i class="el-icon-s-home"></i>
                <span slot="title">测试</span>
              </el-menu-item>
            </router-link>
            <router-link to="/ScheduleTest" tag="div">
              <el-menu-item index="ScheduleTest">
                <i class="el-icon-s-home"></i>
                <span slot="title">计划测试</span>
              </el-menu-item>
            </router-link>
            <!-- 权限树加载 -->
            <menuTree
              v-for="item in menuTreeList"
              :key="item.SystemMenuID"
              :menuTreeItem="item"
            />
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container style="width:85%; min-width:1050px;">
        <el-header height="45px">
          <ul class="l">
            <li
              :title="asideStatus == true ? '菜单展开' : '菜单收起'"
              @click="changeAside"
            >
              <i id="asideControll" class="iconfont">&#xe61e;</i>
              <span class="ml10 mr10">{{
                asideStatus == true ? "菜单展开" : "菜单收起"
              }}</span>
            </li>
            <!-- <li title="主页" @click="dialogFormVisible = true">
              <i class="iconfont">&#xe65e;</i>
            </li> -->
            <!-- <router-link to="/notification/notificationMain" tag="li">
              <li title="公告" @click="addTab('notification/notificationMain')">
                <i class="el-icon-bell"></i>
                <span class="ml10 mr10">公告</span>
              </li>
            </router-link> -->
          </ul>
          <ul class="r">
            <li>
              <el-dropdown trigger="hover">
                <span class="el-dropdown-link">
                  个人中心
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>

                <el-dropdown-menu slot="dropdown" style="min-width: 150px;">
                  <el-dropdown-item divided @click.native="logout"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </li>
            <li style="margin-right:20px;" @click="screenfull">
              <i class="iconfont ml10 mr10">&#xe663;</i>
            </li>
          </ul>
        </el-header>
        <el-main style="margin:0;padding:0;background:#ECF5EF;" class="backTop">
          <el-tabs
            class="tabs"
            v-model="activeTabName"
            @tab-click="getTab"
            @tab-remove="closeTab"
            type="border-card"
          >
            <el-tab-pane
              v-for="item in tabList"
              :key="item.name"
              :name="item.name"
              :label="item.label"
              :closable="item.closable"
            ></el-tab-pane>
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive === true" />
            </keep-alive>
            <router-view v-if="$route.meta.keepAlive !== true" />
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
    <el-backtop target=".backTop" :right="30" :visibility-height="20"
      ><div
        style="{height: 100%;width: 100%;background-color: #f2f5f6;box-shadow: 0 0 6px rgba(0,0,0, .12);
                        text-align: center;line-height: 40px;color: #1989fa;}"
      >
        TOP
      </div></el-backtop
    >
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { mapState } from "vuex";
import Vue from "vue";
import Cookies from "js-cookie";
import screenfull from "screenfull";
import { QueryWebMenuByUserId } from "@/api/webMenuASP";

export default {
  name: "Main",
  components: {},
  data() {
    return {
      defaultUrl:'',
      asideStatus: false, //false:菜单栏处于展开状态； true：菜单栏处于收起状态
      asideWidth: "200px",
    };
  },
  methods: {
    ...mapMutations("navTabs", ["addTab", "setMenuTreeList"]),
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
    //退出登录
    logout() {
      //清除数据
      Cookies.remove("cid");
      //跳转链接
      this.$router.push({
        name: "login",
        params: {
          autoSign: false//自动登录
        }
      });
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
      await QueryWebMenuByUserId({
        userid: JSON.parse(Cookies.get("userInfo")).userId
      }).then(res => {
        if (res.data.children.length > 0) {
          this.setMenuTreeList(res.data.children);
          //只有一个菜单，默认加载
          if (res.data.children.length == 1) {
            if (
              res.data.children[0].MENU_TYPE == "menu" &&
              (!res.data.children[0].children ||
                res.data.children[0].children.length == 0)
            ) {
              this.addTab(res.data.children[0].MENU_LINK);
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
    isContainAttr(attr) {
      //是否包含权限
      return (
        this.menuTreeListFlatten.filter(item => item.MENU_LINK == attr).length >
        0
      );
    },
    //获取角标在获取权限之后
    getIconAll() {

    }
  },
  computed: {
    ...mapState("navTabs", ["tabList", "menuTreeList", "menuTreeListFlatten"]),
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
  beforeCreate() {
  },
  created() {
    //this.getMenuTree(); //获得菜单权限树,获取角标在后去权限之后
    this.getPath();
    this.addTab("main");
    this.addTab(this.defaultUrl); //刷新之后添加的
  }
};
</script>

<style scoped>
.center {
  width: 99.5%;
  margin: 0 auto;
}
.page {
  box-sizing: border-box;
  height: 100vh;
}
.el-header {
  background: #464c5b;
  padding: 0;
}
/*侧边栏样式*/
#aside-header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  color: #464c5b;
  font-size: 20px;
  font-weight: bold;
}
#aside-logo {
  width: 35px;
  height: 35px;
  margin-right: 15px;
  line-height: 60px;
  display: inline-block;
  background: url("../assets/img/headLogo.png") no-repeat;
  background-size: cover;
}
/*顶部导航样式*/
.el-header {
  background: #0D6BA8;
  padding: 0;
}
.el-header li {
  float: left;
}
.el-header li:hover {
  cursor: pointer;
  background: #0092C5;
}
.el-header i {
  line-height: 50px;
  color: white;
}
.el-header ul {
  margin: 0 10px;
}
.el-header ul:nth-child(1) i {
  font-size: 20px;
  margin: 0 10px;
}
.el-header ul:nth-child(1) li span {
  color: white;
  line-height: 50px;
  font-size: 14px;
  margin-right: 10px;
  margin-left: -10px;
}
.el-header ul:nth-child(2) li span {
  color: white;
  line-height: 50px;
  font-size: 14px;
}
.el-dropdown {
  margin: 0 15px;
}
.el-dropdown-menu__item:hover {
  color: #606266;
  background: #eee;
}
.tabs {
  width: 100%;
  height: 40px;
  background-color: #f5f7fa;
}
.icon-color {
  color: #303133;
}
.el-menu i {
  font-size: 25px;
  margin: 0 10px;
}
.el-menu-item span {
  font-size: 16px;
}
.el-menu-item-group span {
  margin-left: 20px;
}
.el-icon-goods {
  color: #303133;
}
.el-menu-item {
  padding: 0 10px;
}
.el-menu-item.is-active {
  background: rgb(88, 88, 98);
  color: white;
}
.el-submenu .el-menu-item {
  padding: 0 10px;
}
</style>

<style>
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-scrollbar > div {
  margin-bottom: 0px !important;
}
.el-menu-item-group__title {
  padding: 4px 0 !important;
}
.el-card__header {
  padding: 10px 15px !important;
}
.el-card__body {
  padding: 15px;
}
.el-dialog__body {
  padding: 20px;
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
  background: #f0f9eb;
}
.el-dropdown-menu__item {
  line-height: 25px;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>

