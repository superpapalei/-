<template>
  <div class="project-template">
    <el-container style="height: 600px;">
      <el-aside width="220px" style="padding-right:10px;">
        <el-card style="height:100%;box-sizing:border-box;" shadow="never">
          <div slot="header">
            <span>项目分类</span>
            <el-button icon="el-icon-refresh" style="float: right;" title="刷新" size="mini" circle @click="refreshClass">
            </el-button>
          </div>
          <el-tree :data="classData" node-key="pc_no" ref="tree" default-expand-all :expand-on-click-node="false"
            highlight-current class="classTree">
            <div slot-scope="{node, data}" style="width:100%;user-select:none;height:30px;line-height: 30px;"
              @click="handleSelectTreeClick(data)">
              <img style="width:16px;" src="../../assets/img/tag.png" />
              <span style="margin-left:3px;">{{data.pc_name}}</span>
            </div>
          </el-tree>
        </el-card>
      </el-aside>
      <el-main style="border-left:10px solid #eee;padding:0 0 0 10px;">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchTemplate"></el-button>
          <el-input size="small" @keyup.enter.native="refreshTemplateData" placeholder="请输入物料名称" v-model="condition"
            clearable style="width:250px;">
            <el-button size="small" @click="refreshTemplateData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" :disabled="!selectClass.pc_no"
            @click="addNewTemplateShow">新增模板
          </el-button>
          <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
            删除选中模板({{selection.length}})
          </el-button>
        </div>
        <div class="gridTable">
          <el-table ref="templateTable" v-loading="loading" style="width:100%;" height="540" :data="projectTemplateData"
            tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange"
            @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="pt_name" label="模板名称" align="center" width="130"></el-table-column>
            <el-table-column prop="pt_note" label="模板说明" align="center"></el-table-column>
            <el-table-column prop="create_user" label="创建人" align="center" width="100"></el-table-column>
            <el-table-column prop="create_date" label="创建时间" align="center" width="100">
              <template slot-scope="scope">
                {{scope.row.create_date | dateFilter}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTemplateShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      condition: "",
      classData: [],
      projectTemplateData: [],
      selectClass: {},
      selection: [],
      loading: false
    };
  },
  methods: {
    refreshTemplateData() {
      if (this.selectClass.pc_no) {
        this.loading = true;
        this.projectTemplateData = [];
        this.z_get(
          "api/project_template",
          { pc_no: this.selectClass.pc_no, condition: this.condition },
          { loading: false }
        )
          .then(res => {
            this.loading = false;
            this.projectTemplateData = res.data;
          })
          .catch(res => {});
      }
    },
    refreshClass() {
      this.classData = [];
      this.refreshRight();
      this.selectClass = {};
      this.z_get("api/project_classification/treeList")
        .then(res => {
          this.classData = res.data;
        })
        .catch(res => {});
    },
    refreshRight() {
      this.condition = "";
      this.projectTemplateData = [];
    },
    searchTemplate() {
      this.condition = "";
      this.refreshTemplateData();
    },
    //选中的分类
    handleSelectTreeClick(data) {
      this.selectClass = data;
      this.searchTemplate();
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.templateTable.toggleRowSelection(row);
    },
    addNewTemplateShow() {},
    editTemplateShow(row) {},
    deleteOne(row) {},
    deleteList() {}
  },
  mounted() {
    this.refreshClass();
  }
};
</script>

<style scoped>
.project-template {
  width: 1100px;
}
</style>
<style>
.classTree .el-tree-node__content {
  height: 30px;
}
</style>