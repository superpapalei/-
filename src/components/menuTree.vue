<template>
  <div style="display:inline-block;min-width:200px;">
    <template v-for="item in menuTreeItem">
      <!-- 有子节点，用el-submenu -->
      <el-submenu v-if="
      item.children &&
        item.children.length >= 1
    " :index="item.menu_id.toString()" :key="item.menu_id">
        <template slot="title">
          {{ item.menu_name }}
        </template>
        <el-menu-item-group>
          <menuTree :menuTreeItem="item.children" />
        </el-menu-item-group>
      </el-submenu>
      <!-- 没有子节点，直接el-menu-item -->
      <el-menu-item v-else :index="item.menu_link" :route="'/' + item.menu_link"
        :key="item.menu_id">
        <!-- 不加图标了 -->
        <span slot="title">{{ item.menu_name }}</span>
        <el-badge v-if="getAllBadge(item.menu_link) > 0" class="mark r" :value="getAllBadge(item.menu_link)"></el-badge>
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