<template>
  <div class="task">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入任务编号或任务名称" v-model="condition"
            clearable style="width:300px;">
            <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskShow('root')">新增根节点
          </el-button>
          <el-button type="primary" size="small" :disabled="selection.length!=1" @click="addNewTaskShow('children')">
            新增子节点
          </el-button>
          <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
            删除选中节点({{selection.length}})
          </el-button>
          <el-dropdown style="margin-left:10px;">
            <el-button size="small">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="expandAll">展开所有节点</el-dropdown-item>
              <el-dropdown-item @click.native="collapseAll" divided>折叠所有节点</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- Name	Code	Data Type	Length	Precision	Primary	Foreign Key	Mandatory
作业任务ID	t_id	int			TRUE	FALSE	TRUE
父作业任务明细编号	jt_pid	int			FALSE	TRUE	FALSE
项目组织ID	group_id	int			FALSE	TRUE	FALSE
项目计划ID	pp_id	int			FALSE	TRUE	TRUE
部门ID	dept_id	int			FALSE	TRUE	FALSE
标记类型ID	snt_id	int			FALSE	TRUE	FALSE
标准任务编号	t_id	int			FALSE	TRUE	FALSE
员工ID	emp_id	int			FALSE	TRUE	FALSE
作业任务最晚开始时间	t_last_startdate	datetime			FALSE	FALSE	FALSE

作业任务最早结束时间	t_early_enddate	datetime			FALSE	FALSE	FALSE
发布状态	t_release_state	varchar(10)	10		FALSE	FALSE	FALSE
发布人	t_release_emp	int			FALSE	FALSE	FALSE
投放状态	t_put_state	varchar(10)	10		FALSE	FALSE	FALSE
投放人	t_put_emp	int			FALSE	FALSE	FALSE
任务明细名称	t_name	varchar(30)	30		FALSE	FALSE	FALSE
任务工期	t_period	int			FALSE	FALSE	FALSE
所需班次数	t_shiftcount	int			FALSE	FALSE	FALSE
尚需班次数	t_needshifts	int			FALSE	FALSE	FALSE
任务管理状态	t_flow_status	int			FALSE	FALSE	FALSE
任务执行状态	t_status	int			FALSE	FALSE	FALSE
任务优先级	t_priority	int			FALSE	FALSE	FALSE
任务排产备注	t_note	varchar(100)	100		FALSE	FALSE	FALSE
是否被分解	t_isdecompose	int			FALSE	FALSE	FALSE
c_id	c_id	int			FALSE	FALSE	TRUE
update_date	update_date	datetime			FALSE	FALSE	FALSE
update_user	update_user	int			FALSE	FALSE	FALSE
create_date	create_date	datetime			FALSE	FALSE	FALSE
create_user	create_user	int			FALSE	FALSE	FALSE -->
        <div class="topContent">
          <el-table ref="taskTable" style="width: 100%;" height="250px" :data="taskData" tooltip-effect="dark"
            highlight-current-row row-key="t_id" default-expand-all @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- <el-table-column prop="t_id" label="任务编号" align="center" width="150"></el-table-column> -->
            <el-table-column prop="t_name" label="任务名称" align="center" width="200"></el-table-column>

            <el-table-column label="最早开始时间" align="center" width="110" type='datetime' format="yyyy-MM-dd">
              <template slot-scope="scope">
                <span>{{ scope.row.t_early_startdate|dateFormat("yyyy-MM-dd")}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="t_last_enddate" label="最晚结束时间" align="center" width="110" format="yyyy-MM-dd">
              <template slot-scope="scope">
                <span>{{ scope.row.t_last_enddate|dateFormat("yyyy-MM-dd") }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="t_period" label="工期(天)" align="center" width="100"></el-table-column>

            <el-table-column label="操作" width="150" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
                <el-button type="info" icon="el-icon-more" size="mini" circle @click="moreInfo(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bottomLayout" style="min-height:300px;">
          <el-tabs v-model="activeName">
            <el-tab-pane label="投放记录" name="first">
              <div v-if="bottomDataShow">
                <div class="tbar">
                  <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchItem"></el-button>
                  <el-input size="small" @keyup.enter.native="refreshItemData" placeholder="请输入物料名称"
                    v-model="itemCondition" clearable style="width:250px;">
                    <el-button size="small" @click="refreshItemData" slot="append" icon="el-icon-search">搜索</el-button>
                  </el-input>
                  <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskItemShow">新增资源需求
                  </el-button>
                  <el-button type="danger" size="small" :disabled="itemSelection.length==0" @click="deleteListItem">
                    删除选中资源({{itemSelection.length}})
                  </el-button>
                </div>
                <div class="gridTable">
                  <el-table ref="taskItemTable" v-loading="loading" style="width:100%;" height="250"
                    :data="taskItemData" tooltip-effect="dark" highlight-current-row border
                    @selection-change="handleSelectionChange2">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="40" align="center">
                    </el-table-column>
                    <el-table-column prop="item_no" label="物料编码" align="center" width="130"></el-table-column>
                    <el-table-column prop="item_name" label="物料名称" align="center" width="200"></el-table-column>
                    <el-table-column prop="sti_quantity" label="数量" align="center" width="90"></el-table-column>
                    <el-table-column prop="item_unit" label="单位" align="center" width="100"></el-table-column>
                    <el-table-column prop="sti_note" label="备注" align="center"></el-table-column>
                    <el-table-column label="操作" width="140" prop="handle">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" circle
                          @click="editItemShow(scope.row)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle
                          @click="deleteOneItem(scope.row)">
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="投放记录" name="second">
            <div v-if="bottomDataShow">
            </div>
          </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </div>

    <el-dialog width="450px" :title="addTaskText" :close-on-click-modal="false" :visible.sync="addTaskVisiable"
      @closed="refreshForm">
      <zj-form size="small" :newDataFlag='addTaskVisiable' :model="taskModel" label-width="100px" ref="taskForm"
        :rules="add_rules">
        <el-form-item label="任务名称" prop="t_name">
          <el-input class="formItem" v-model="taskModel.t_name" placeholder="请填写任务名称">
          </el-input>
        </el-form-item>
        <el-form-item label="最早开始" prop="t_name">
          <el-date-picker v-model="taskModel.t_early_startdate" type="date" format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" placeholder="选择时间" style="width:50%"></el-date-picker>

        </el-form-item>
        <el-form-item label="最晚结束" prop="t_name">
          <el-date-picker v-model="taskModel.t_last_enddate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            placeholder="选择时间" style="width:50%"></el-date-picker>

        </el-form-item>
        <el-form-item label="工期(天)" prop="t_period">
          <el-input class="formItem" v-model="taskModel.t_period" placeholder="请填写工期" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTaskVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
    <!-- 投放记录表
  执行人ID	emp_id	int			FALSE	TRUE	FALSE
执行人部门ID	dept_id	int			FALSE	TRUE	FALSE
作业任务ID	t_id	int			FALSE	TRUE	FALSE
是否主要执行	tr_ismain	bit			FALSE	FALSE	FALSE
c_id	c_id	int			FALSE	FALSE	TRUE
update_date	update_date	datetime			FALSE	FALSE	FALSE
update_user	update_user	int			FALSE	FALSE	FALSE
create_date	create_date	datetime			FALSE	FALSE	FALSE
create_user	create_user	int			FALSE	FALSE	FALSE -->

  </div>
</template>

<script>
export default {
  name: "task",
  data() {
    return {
      condition: "",
      taskData: [], //表格数据
      deptDataFilter: [],
      deptData: [], //部门数据
      selection: [],
      addTaskVisiable: false,
      moreInfoVisiable: false,
      taskModel: {},
      task_releaseModel: {},
      addOrNot: true, //是否新增
      addTaskText: "",
      moreInfoText: "",
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
        t_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        t_period: [{ required: true, message: "请填写工期", trigger: "blur" }]
      }
    };
  },

  // watch: {
  //   addTaskVisiable(val) {
  //     if (val) {
  //       this.selectDept();
  //     }
  //   }
  // },
  methods: {

    //********************************树结构表通用操作方法**********************************************
    refreshData() {
      this.z_get("api/task/treeList", { condition: this.condition })
        .then(res => {
          this.deptDataFilter = res.dict.dept_id;
          this.taskData = res.data;
        })
        .catch(res => { });
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
        if (selection[i].t_id == val[0].t_id) {
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
      var titleName = "";
      var jt_pid = 0;
      if (type == "root") {
        titleName = "";
        this.addTaskText = "新增根节点";
      } else if (type == "children") {
        jt_pid = this.selection[0].t_id;
        titleName = this.selection[0].t_name;
        this.addTaskText = "新增[" + titleName + "]的子节点";
      }
      this.taskModel = {
        t_id: 0,
        jt_pid: jt_pid,
        t_early_enddate: new Date(),
        t_last_startdate: new Date(),
        t_name: "",

        t_period: "",

      };
      this.addOrNot = true;
      this.addTaskVisiable = true;
    },
    onSaveTaskClick() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/task", this.taskModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.taskModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            this.z_put("api/task", this.taskModel)
              .then(res => {
                this.$message({
                  message: "编辑成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("编辑失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
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
          this.z_delete("api/task/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败!", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => { });
    },

    //查找部门数据
    selectDept() {
      this.deptData = [];
      this.z_get("api/dept/tree", {}, { loading: false })
        .then(res => {
          this.deptData = res.data;
        })
        .catch(res => { });
    },
    filterDeptName(id) {
      var name = id;
      var dept = this.deptDataFilter.filter(item => item.value == id);
      if (dept.length) {
        name = dept[0].display;
      }
      return name;
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
  //********************************树结构表通用操作方法**********************************************
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.task {
   width: 1100px;
}
/* .containAll {
  width: 1100px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: white;
} */
/* .tbar {
  margin-bottom: 10px;
  padding-left: 10px;
} */
.formItem {
  width: 300px;
}
.topContent {
  width: 100%;
}
.bottomContent {
  width: 100%;
  flex: 1;
}
</style>