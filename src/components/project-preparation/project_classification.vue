<template>
  <div class="project_classification">
    <div class="topLayout">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
        <el-input @keyup.enter.native="refreshData" placeholder="请输出项目分类编号或者名称" v-model="condition"
          style="width:300px;">
          <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" style="margin-left:10px;" @click="addNewTaskShow('root')">新增项目类型</el-button>
        <!-- <el-button type="primary" :disabled="selection.length!=1" @click="addNewTaskShow('children')">新增子节点</el-button> -->
        <el-button type="danger" :disabled="selection.length==0" @click="deleteList">删除选中节点({{selection.length}})
        </el-button>
        <!-- <el-dropdown style="margin-left:10px;">
          <el-button>
            操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="expandAll">展开所有节点</el-dropdown-item>
            <el-dropdown-item @click.native="collapseAll" divided>折叠所有节点</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
      <div class="topContent">
        <el-table ref="proclassTable" style="width: 100%;height:350px;" :data="ProclassData" tooltip-effect="dark"
          highlight-current-row row-key="pc_no" default-expand-all @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" @row-click="handleRowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="pc_no" label="项目类型编号" align="center" width="150"></el-table-column>
          <el-table-column prop="pc_name" label="项目类型名称" align="center" width="150"></el-table-column>
          <el-table-column prop="pc_note" label="说明" align="center" width="480"></el-table-column>
          <el-table-column label="操作" width="150" prop="handle">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog width="500px" :title="addTaskText" :close-on-click-modal="false" :visible.sync="addTaskVisiable"
      top="5vh" @closed="refreshForm">
      <el-form :model="taskModel" label-width="100px" ref="taskForm">

        <!-- <el-form-item label="项目类型编号" prop="pc_no">
          <el-input class="formItem" v-model="taskModel.pc_no" placeholder="项目类型名称">
          </el-input>
        </el-form-item> -->

        <el-form-item label="项目类型名称" prop="pc_name">
          <el-input class="formItem" v-model="taskModel.pc_name" placeholder="项目类型名称">
          </el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="4" v-model="taskModel.pc_note" placeholder="备注信息">
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button @click="addTaskVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" @click="onSaveTaskClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "project_classification",
  data() {
    return {
      condition: "",
      ProclassData: [], //表格数据
      selection: [],
      addTaskVisiable: false,
      taskModel: {},
      addOrNot: true, //是否新增
      addTaskText: ""
    };
  },
  mounted() {
    this.refreshData();
  },
  watch: {
    addTaskVisiable(val) {
      if (val) {
        this.selectDept();
      }
    }
  },
  methods: {
    refreshData() {
      this.z_get("api/project_classification", { condition: this.condition })
        .then(res => {
          this.ProclassData = res.data;
        })
        .catch(res => {});
    },

    //重置表单
    refreshForm() {
      this.$refs.taskForm.resetFields();
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    //表格树选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.taskData;
      var select = false;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].st_id == val[0].st_id) {
          select = true;
          break;
        }
      }
      for (var i = 0; i < val.length; i++) {
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //选中子节点
    selectChildren(val, select) {
      for (var i = 0; i < val.length; i++) {
        if (select && this.selection.indexOf(val[i]) == -1) {
          this.$refs.taskTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.taskTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    addNewTaskShow(type) {
      // var pro_pc_no = "";
      // if (type == "root") {
      //   pc_no = "";
      //   this.addTaskText = "新增根节点";
      // } else if (type == "children") {
      //   pro_pc_no = this.selection[0].pc_no;
      //   this.addTaskText = "新增[" + pro_pc_no + "]的子节点";
      // }
      this.taskModel = {
        pc_no: "",
        pc_name: "",
        pc_note: ""
      };
      this.addOrNot = true;
      this.addTaskVisiable = true;
    },
    onSaveTaskClick() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/project_classification", this.taskModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.z_put("api/project_classification", this.taskModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("编辑失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          }
        } else {
          return false;
        }
      });
    },
    //编辑数据
    editTaskShow(row) {
      this.taskModel = JSON.parse(JSON.stringify(row));
      this.addTaskText = "编辑节点";
      this.addOrNot = false;
      this.addTaskVisiable = true;
    },
    //删除一个
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除树
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    onDeleteClick(list) {
      this.$confirm("是否删除？节点下的子节点将一并删除！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          //var realSelect = this.arrayChildrenFlatten(list, []);
          this.z_delete("api/project_classification/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
              console.log(res);
            });
        })
        .catch(() => {});
    },

    //多维数组扁平化
    arrayChildrenFlatten(array, result) {
      for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item.children && item.children.length > 0) {
          result.push(item);
          result = this.arrayChildrenFlatten(item.children, result);
        } else {
          result.push(item);
        }
      }
      return result;
    },
    handleSelectTreeDblClick(data) {
      this.taskModel.dept_id = data.dept_id;
      this.taskModel.dept_name = data.dept_name;
      this.$refs.select_dept.blur();
    },
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.taskTable.toggleRowSelection(row);
    },
    expandAll() {
      var icon = this.$el.getElementsByClassName("el-table__expand-icon");
      if (icon && icon.length) {
        for (var i = 0; i < icon.length; i++) {
          var classList = [];
          for (var j = 0; j < icon[i].classList.length; j++) {
            classList.push(icon[i].classList[j]);
          }
          if (classList.indexOf("el-table__expand-icon--expanded") == -1) {
            icon[i].click();
          }
        }
      }
    },
    collapseAll() {
      var icon = this.$el.getElementsByClassName("el-table__expand-icon");
      if (icon && icon.length) {
        for (var i = 0; i < icon.length; i++) {
          var classList = [];
          for (var j = 0; j < icon[i].classList.length; j++) {
            classList.push(icon[i].classList[j]);
          }
          if (classList.indexOf("el-table__expand-icon--expanded") > -1) {
            icon[i].click();
          }
        }
      }
    }
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
.formItem {
  width: 300px;
}
</style>