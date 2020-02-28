<template>
  <div class="standard-task">
    <div class="topLayout">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="refreshData"></el-button>
        <el-input @keyup.enter.native="search()" placeholder="请输入任务编号或任务名称" v-model="condition" style="width:300px;">
          <el-button @click="search()" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button>新增根节点</el-button>
        <el-button>新增子节点</el-button>
      </div>
      <div class="topContent">
        <el-table style="width: 100%;height:350px;" :data="taskData" tooltip-effect="dark" row-key="st_id">
          <el-table-column prop="st_id" label="任务编号" align="center" width="150"></el-table-column>
          <el-table-column prop="st_name" label="任务名称" align="center" width="150"></el-table-column>
          <el-table-column prop="dept_name" label="部门" align="center" width="150"></el-table-column>
          <el-table-column prop="st_period" label="工期(天)" align="center" width="90"></el-table-column>
          <el-table-column prop="st_type" label="类别" align="center" width="90"></el-table-column>
          <el-table-column prop="st_note" label="说明" align="center"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "standard-task",
  data() {
    return {
      condition: "",
      taskData: []
    };
  },
  methods: {
    refreshData() {
      this.z_get("api/standard_task/GetTreeList")
        .then(res => {
          this.taskData = res.data;
        })
        .catch(res => {});
    },
    search() {
      this.refreshData();
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.standard-task {
  width: 100%;
}
.tbar {
  margin-bottom: 10px;
}
</style>