<template>
  <div class="template_group_waiting">
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <div>
        <el-h1>模板分类</el-h1>
        <el-button type="mini">+</el-button>
        <el-button type="mini">-</el-button>
        </div>

        <el-menu>
            <el-menu-item index="test" route="/test" el-icon-link><i class="el-icon-link" ></i>全部分类</el-menu-item>
           <el-menu-item index="test" route="/test"><i class="el-icon-link" ></i>分类1</el-menu-item>
           <el-menu-item index="test" route="/test"><i class="el-icon-link" ></i>分类2</el-menu-item>
           <el-menu-item index="test" route="/test"><i class="el-icon-link" ></i>分类3</el-menu-item>

          <!-- <el-submenu index="1">

            <template slot="title"><i class="el-icon-message"></i>导航一</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
       -->
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: left; font-size: 12px">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input placeholder="请输入模板类型编号或模板类型名称" clearable style="width:300px;">
            <el-button slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" style="margin-left:10px;">新增模板类型</el-button>
          <el-button type="primary" style="margin-left:10px;">导入模板类型</el-button>
        </el-header>

        <el-main>
          <el-table ref="tgtTable" style="width: 100%;height:350px;" :data="tgtData" tooltip-effect="dark"
          highlight-current-row row-key="tgt_id" default-expand-all @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" @row-click="handleRowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
         
          <el-table-column prop="tgt_id" label="模板类型编号" align="center" width="120"></el-table-column>
          <el-table-column prop="tgt_name" label="模板类型名称" align="center" width="150"></el-table-column>
                   
          <el-table-column prop="tgt_note" label="模板类型说明" align="center" width="150"></el-table-column>
          
          <el-table-column label="操作" width="150" prop="handle">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTemplateShow(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style>
/* .el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
} */
</style>

<script>
export default {
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    return {
      tableData: Array(20).fill(item)
    };
  }
};
</script>