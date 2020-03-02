<template>
  <div class="standard-task">待填充</div>
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