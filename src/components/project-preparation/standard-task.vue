<template>
  <div class="standard-task">
    <div class="topLayout">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
        <el-input @keyup.enter.native="refreshData" placeholder="请输入任务编号或任务名称" v-model="condition" style="width:300px;">
          <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" style="margin-left:10px;" @click="addNewTaskShow('root')">新增根节点</el-button>
        <el-button type="primary" :disabled="selection.length!=1" @click="addNewTaskShow('children')">新增子节点</el-button>
        <el-button type="danger" :disabled="selection.length==0" @click="deleteList">删除选中节点({{selection.length}})
        </el-button>
        <el-dropdown style="margin-left:10px;">
          <el-button>
            操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="expandAll">展开所有节点</el-dropdown-item>
            <el-dropdown-item @click.native="collapseAll" divided>折叠所有节点</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="topContent">
        <el-table ref="taskTable" style="width: 100%;height:350px;" :data="taskData" tooltip-effect="dark"
          highlight-current-row row-key="st_id" default-expand-all @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" @row-click="handleRowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="st_id" label="任务编号" align="center" width="150"></el-table-column>
          <el-table-column prop="st_name" label="任务名称" align="center" width="150"></el-table-column>
          <el-table-column prop="dept_id" label="部门" align="center" width="180">
            <template slot-scope="scope">{{filterDeptName(scope.row.dept_id)}}</template>
          </el-table-column>
          <el-table-column prop="st_period" label="工期(天)" align="center" width="90"></el-table-column>
          <el-table-column prop="st_type" label="类别" align="center" width="90">
            <template slot-scope="scope">{{scope.row.st_type | stTypeTrans}}</template>
          </el-table-column>
          <el-table-column prop="st_note" label="说明" align="center"></el-table-column>
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
      <el-form :model="taskModel" label-width="100px" ref="taskForm" :rules="add_rules">
        <el-form-item label="任务编号">

          <el-input class="formItem" v-model="taskModel.st_id" placeholder="系统自动生成" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="上级任务编号">
          <el-input class="formItem" v-model="taskModel.st_pid" placeholder="无" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="dept_id">
          <el-select v-model="taskModel.dept_id" ref="select_dept" placeholder="请选择属部门">
            <el-option :label="taskModel.dept_name" :value="taskModel.dept_id" style="height:auto;padding:0;">
              <el-tree :data="deptData" node-key="dept_id" ref="tree" highlight-current default-expand-all
                :current-node-key="taskModel.dept_id">
                <div slot-scope="{node, data}" style="width:100%" @dblclick="handleSelectTreeDblClick(data)">
                  {{data.dept_name}}</div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="st_name">
          <el-input class="formItem" v-model="taskModel.st_name" placeholder="请填写任务名称">
          </el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="taskModel.st_type" placeholder="请选择任务类型">
            <el-option v-for="item in stType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工期(天)" prop="st_period">
          <el-input class="formItem" v-model="taskModel.st_period" placeholder="请填写工期" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="taskModel.st_note" placeholder="备注信息">
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
  name: "standard-task",
  data() {
    return {
      condition: "",
      taskData: [], //表格数据
      deptDataFilter:[],
      deptData: [], //部门数据
      selection: [],
      addTaskVisiable: false,
      taskModel: {},
      addOrNot: true, //是否新增
      addTaskText: "",
      stType_options: [
        {
          value: "task",
          label: "任务"
        },
        {
          value: "work",
          label: "节点"
        }
      ],
      add_rules: {
        dept_id: [{ required: true, message: "请选择部门", trigger: "change" }],
        st_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        st_period: [{ required: true, message: "请填写工期", trigger: "blur" }]
      }
    };
  },
  filters: {
    datatrans(value) {
      if (!value || value == "9999-12-31") return "";
      //时间戳转化大法
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " "; /* + h + ':' + m + ':' + s; */
    },
    stTypeTrans(value) {
      switch (value) {
        case "task":
          return "任务";
          break;
        case "work":
          return "节点";
          break;
      }
    }
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
      this.z_get("api/standard_task/treeList", {condition: this.condition})
        .then(res => {
          this.deptDataFilter = res.dict.dept_id;
          this.taskData = res.data;
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
      var st_pid = "";
      if (type == "root") {
        st_pid = "";
        this.addTaskText = "新增根节点";
      } else if (type == "children") {
        st_pid = this.selection[0].st_id;
        this.addTaskText = "新增[" + st_pid + "]的子节点";
      }
      this.taskModel = {
        st_id: "",
        st_pid: st_pid,
        dept_id: "",
        dept_name: "",
        st_name: "",
        st_type: "task",
        st_period: "",
        st_note: ""
      };
      this.addOrNot = true;
      this.addTaskVisiable = true;
    },
    onSaveTaskClick() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/standard_task", this.taskModel)
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
            this.z_put("api/standard_task", this.taskModel)
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
      this.taskModel.dept_name = this.filterDeptName(this.taskModel.dept_id);
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
          var realSelect = this.arrayChildrenFlatten(list, []);
          this.z_delete("api/standard_task/list", realSelect)
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
    //查找部门数据
    selectDept() {
      this.deptData = [];
      this.z_get("api/dept/tree", {}, { loading: false })
        .then(res => {
          this.deptData = res.data;
        })
        .catch(res => {
          console.log(res.msg);
        });
    },
    filterDeptName(id) {
      var name = id;
      var dept = this.deptDataFilter.filter(item => item.value == id);
      if (dept.length) {
        name = dept[0].display;
      }
      return name;
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
.formItem {
  width: 300px;
}
</style>