<template>
  <div class="main">
    <div class="content">
      <div class="tool">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="refreshData"></el-button>
        <el-button round size="mini" @click="AddFormVisible=true">添加部门</el-button>
        <el-button round size="mini" :disabled="selection.length==0" @click="deleteDepts()">
          删除选中部门({{selection.length}})</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" row-key="dept_id" default-expand-all
        style="width: 100%" @selection-change="handleSelectionChange" @row-click="handleRowClick">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="dept_name" label="部门名称" width="400">
        </el-table-column>
        <el-table-column prop="dept_emp_count" label="员工数量" width="150">
        </el-table-column>
        <el-table-column prop="dept_manager_name" label="主管" width="150">
        </el-table-column>
        <el-table-column label="编辑" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" round @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" round type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 添加部门 -->
    <el-drawer destroy-on-close :show-close="false" :visible.sync="AddFormVisible" direction="rtl" ref="AddDrawer"
      size=600>
      <div slot="title" class="add_form_title">添加部门</div>
      <div style="width:400px;padding-right:50px">
        <el-form :model="form" label-position="right" :rules="add_rules" ref="add_form" size="small" style="width:100%">
          <el-form-item label="部门名称" :label-width="formLabelWidth" prop="dept_name">
            <el-input v-model="form.dept_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="上级部门" :label-width="formLabelWidth" prop="dept_pname">
            <el-select v-model="form.dept_pname" ref="select_pdept" placeholder="请选择上级部门" style="width:100%">
              <el-option :value="form.dept_pid" style="height: auto">
                <el-tree :data="tableData" node-key="dept_id" ref="tree" highlight-current default-expand-all
                  :current-node-key="form.dept_pid">
                  <div slot-scope="{node, data}" style="width:100%" @dblclick="handleSelectTreeDblClick(data)">
                    {{data.dept_name}}</div>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="add_form_footer">
          <el-button type="primary" @click="submitAddForm('add_form')" :loading="loading">
            {{ loading ? '提交中 ...' : '确 定' }}</el-button>
          <el-button @click="AddFormVisible=false">取 消</el-button>
        </div>
      </div>

    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      selection: [],
      AddFormVisible: false,
      defaultProps: {
        children: "children",
        label: "dept_name"
      },
      //表格中的数据
      form: {
        c_id: 1,
        dept_name: "",
        dept_pid: 0,
        dept_pname: "",
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
      loading: false,
      //添加部门表格验证规则
      add_rules: {
        dept_name: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ],
        dept_pname: [
          { required: true, message: "请选择上级部门", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.tableData = [];
    this.refreshData();
  },

  methods: {
    //刷新数据
    refreshData() {
      this.z_get("api/dept/tree")
        .then(res => {
          this.$message({
            message: "加载数据成功",
            type: "success",
            center: "true"
          });
          this.tableData = res.data;
        })
        .catch(res => {
          this.$alert(res.msg, "加载失败", {
            type: "error"
          });
          console.log(res.msg);
        });
    },
    //下拉框中的树双击
    handleSelectTreeDblClick(data) {
      this.form.dept_pid = data.dept_id;
      this.form.dept_pname = data.dept_name;
      this.$refs.select_pdept.blur();
    },
    deleteDepts() {},
    //表格树选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
    //点击行可以切换选中状态
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    //提交添加部门表格
    submitAddForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.z_post("api/dept", this.form)
            .then(res => {
              this.$refs.AddDrawer.closeDrawer();
              this.loading = false;
              this.refreshData();
            })
            .catch(err => {
              alert(err.msg);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.main {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
}
.content {
  width: 1000px;
  border: 1px solid #eee;
  padding: 10px 20px;
}
.tool {
  background: rgba(87, 85, 85, 0.11);
  padding: 5px 10px;
}
.add_form_footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 10px 0px;
  margin-bottom: 0px;
  border-top: 1px solid #eee;
}
.add_form_title {
  padding-bottom: 20px;
  padding-left: 5px;
  color: #333;
  border-bottom: 1px solid #eee;
}
</style>