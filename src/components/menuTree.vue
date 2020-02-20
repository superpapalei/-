<template>
  <div style="display:inline-block;min-width:200px;">
    <template v-for="item in menuTreeItem">
      <!-- 有子节点，用el-submenu -->
      <el-submenu v-if="
      item.children &&
        item.children.length >= 1 &&
        item.MENU_TYPE == 'menu'
    " :index="item.MENU_LINK" :key="item.SystemMenuID">
        <template slot="title">
          {{ item.MENU_NAME }}
        </template>
        <el-menu-item-group>
          <menuTree :menuTreeItem="item.children" />
        </el-menu-item-group>
      </el-submenu>
      <!-- 没有子节点，直接el-menu-item -->
      <el-menu-item v-else-if="item.MENU_TYPE == 'menu'" :index="item.MENU_LINK" :route="'/' + menuTreeItem.MENU_LINK"
        :key="item.SystemMenuID">
        <!-- 不加图标了 -->
        <span slot="title">{{ item.MENU_NAME }}</span>
        <el-badge v-if="getAllBadge(item.MENU_LINK) > 0" class="mark r" :value="getAllBadge(item.MENU_LINK)"></el-badge>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "menuTree",
  props: {
    menuTreeItem: {
      type: Array,
      required: true
    }
  },
  methods: {
    getAllBadge(value) {
      switch (value) {
        case "painting": //角标名字
          return this.$store.state.badge.painting;
        default:
          return 0;
      }
    }
  }
};
</script>

<style scoped>
* {
  outline: none;
}
</style>