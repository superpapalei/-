
<template>
  <div class="shift_group">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入任务编号或班组名称" v-model="condition"
            clearable style="width:300px;">
            <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewShiftShow('root')">新增根节点
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
<!-- 班次组  shift_group
班次组ID	sg_id	int			TRUE	FALSE	TRUE
分组名称(3班/2班)	sg_name	varchar(30)	30		FALSE	FALSE	FALSE
分组说明	sg_note	varchar(100)	100		FALSE	FALSE	FALSE
c_id	c_id	int			FALSE	FALSE	TRUE
update_date	update_date	datetime			FALSE	FALSE	FALSE
update_user	update_user	int			FALSE	FALSE	FALSE
create_date	create_date	datetime			FALSE	FALSE	FALSE
create_user	create_user	int			FALSE	FALSE	FALSE -->
        <div class="gridTable" >
          <el-table ref="shift_group" style="width: 100%;" height="250px"  :data="shift_groupData" tooltip-effect="dark"
            highlight-current-row row-key="sg_id" default-expand-all @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="sg_name" label="班组名称" align="center" width="200"></el-table-column>
            <el-table-column prop="sg_note" label="备注" align="center" width="100"></el-table-column>
            <el-table-column label="操作" width="150" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editShiftShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="onDeleteClick(scope.row)">
                </el-button>
                <el-button type="info" icon="el-icon-more" size="mini" circle @click="moreInfo(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    
    <el-dialog width="450px" :title="addShiftText" :close-on-click-modal="false" :visible.sync="addShifVisiable"
      @closed="refreshForm">
       <zj-form size="small" :newDataFlag='addShifVisiable' :model="shiftModel" label-width="100px" ref="shiftForm"
        :rules="add_rules">
         <el-form-item label="班组名称" prop="sg_name">
          <el-input class="formItem" v-model="shiftModel.sg_name" placeholder="请填写班组名称"> </el-input>
        </el-form-item>
         <el-form-item label="班组名称" prop="sg_note">
          <el-input class="formItem" v-model="shiftModel.sg_note" placeholder="备注"> </el-input>
        </el-form-item>
        
  
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addShifVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveShiftClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

          <div class="bottomLayout" style="min-height:300px;">
          <el-tabs v-model="activeName">
            <el-tab-pane label="班次详情" name="first">
              <div v-if="bottomDataShow">
                <div class="tbar">
                  <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchItem"></el-button>
                  <el-input size="small" @keyup.enter.native="refreshItemData" placeholder="请输入物料名称"
                    v-model="itemCondition" clearable style="width:250px;">
                    <el-button size="small" @click="refreshItemData" slot="append" icon="el-icon-search">搜索</el-button>
                  </el-input>
                  <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskItemShow">新增班次
                  </el-button>
                  <el-button type="danger" size="small" :disabled="itemSelection.length==0" @click="deleteListItem">
                    删除选中班次({{itemSelection.length}})
                  </el-button>
                </div>
                <div class="gridTable">
                  <el-table ref="taskItemTable" v-loading="loading" style="width:100%;" height="250"
                    :data="taskItemData" tooltip-effect="dark" highlight-current-row border
                    @selection-change="handleSelectionChange2">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="40" align="center">
                    </el-table-column>
                     <!-- 班次表day_shift
班次ID	ds_id	int			TRUE	FALSE	TRUE
班次组ID	sg_id	int			FALSE	TRUE	FALSE
班次名称(早中晚)	ds_name	varchar(30)	30		FALSE	FALSE	FALSE
班次说明	ds_note	varchar(100)	100		FALSE	FALSE	FALSE
开始时间(8:00)	ds_starttime	datetime			FALSE	FALSE	TRUE
结束时间(11:00)	ds_endtime	datetime			FALSE	FALSE	TRUE
是否报工	is_report	int			FALSE	FALSE	FALSE
时长	ds_period	numeric(2,2)	2	2	FALSE	FALSE	TRUE
c_id	c_id	int			FALSE	FALSE	TRUE
update_date	update_date	datetime			FALSE	FALSE	FALSE
update_user	update_user	int			FALSE	FALSE	FALSE
create_date	create_date	datetime			FALSE	FALSE	FALSE
create_user	create_user	int			FALSE	FALSE	FALSE -->
                    <el-table-column prop="ds_id" label="序号" align="center" width="40"></el-table-column>
                    <el-table-column prop="ds_name" label="班次名称" align="center" width="80"></el-table-column>
                    <el-table-column prop="ds_starttime" label="开始时间" align="center" width="90"></el-table-column>
                    <el-table-column prop="ds_endtime" label="结束时间" align="center" width="100"></el-table-column>
                    <el-table-column prop="is_report" label="是否报工" align="center"></el-table-column>
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
            <el-tab-pane label="使用部门" name="second">
            <div v-if="bottomDataShow">
            </div>
          </el-tab-pane>
          </el-tabs>
        </div>
  </div>
 
</template>

<script>
export default {
  name: "shift_group",
  data() {
    return {
      condition: "",
      shift_groupData: [], //表格数据
      deptDataFilter: [],
      deptData: [], //部门数据
      selection: [],
      addShifVisiable: false,
      moreInfoVisiable: false,
      shiftModel: {},
      addOrNot: true, //是否新增
      addShiftText: "",
      moreInfoText: "",
       bottomDataShow: false,
      add_rules: {
        depsg_id: [{ required: true, message: "请选择部门", trigger: "change" }],
        sg_name: [
          { required: true, message: "请填写班组名称", trigger: "blur" }
        ],
        t_period: [{ required: true, message: "请填写工期", trigger: "blur" }]
      }
    };
  },
 
  // watch: {
  //   addShifVisiable(val) {
  //     if (val) {
  //       this.selectDept();
  //     }
  //   }
  // },
  methods: {
 
    //********************************树结构表通用操作方法**********************************************
    refreshData() {
        this.bottomDataShow = false;
      this.z_get("api/shift_group/treeList", { condition: this.condition })
        .then(res => {
          this.deptDataFilter = res.dict.depsg_id;
          this.shift_groupData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.shiftForm.resetFields();
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
      var val = this.shift_groupData;
      var select = false;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].sg_id == val[0].sg_id) {
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
          this.$refs.shift_group.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.shift_group.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    addNewShiftShow(type) {
      var titleName = "";
      var jt_pid = 0;
      if (type == "root") {
        titleName = "";
        this.addShiftText = "新增根节点";
      } else if (type == "children") {
        jt_pid = this.selection[0].sg_id;
        titleName = this.selection[0].sg_name;
        this.addShiftText = "新增[" + titleName + "]的子节点";
      }
      this.shiftModel = {
        sg_id: 0,
        jt_pid: jt_pid,
         t_early_enddate:new Date(),
         t_last_startdate:new Date(),
        sg_name: "",
     
        t_period: "",
  
      };
      this.addOrNot = true;
      this.addShifVisiable = true;
    },
    onSaveShiftClick() {
      this.$refs.shiftForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/shift_group", this.shiftModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addShifVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
           this.shiftModel.UpdateColumns = this.$refs.shiftForm.UpdateColumns;
            this.z_put("api/shift_group", this.shiftModel)
              .then(res => {
                this.$message({
                  message: "编辑成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addShifVisiable = false;
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
    editShiftShow(row) {
      this.shiftModel = JSON.parse(JSON.stringify(row));
      this.shiftModel.depsg_name = this.filterDeptName(this.shiftModel.depsg_id);
      this.addShiftText = "编辑节点";
      this.addOrNot = false;
      this.addShifVisiable = true;
    },
   
    onDeleteClick(row) {
      this.$confirm("是否删除？删除将无法再次使用！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/shift_group", { data: row })
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
        .catch(() => {});
    },

    //查找部门数据
    selectDept() {
      this.deptData = [];
      this.z_get("api/dept/tree", {}, { loading: false })
        .then(res => {
          this.deptData = res.data;
        })
        .catch(res => {});
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
      this.shiftModel.depsg_id = data.depsg_id;
      this.shiftModel.depsg_name = data.depsg_name;
      this.$refs.select_dept.blur();
    },
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      this.bottomDataShow = true;
      if (column.property != "handle")
        this.$refs.shift_group.toggleRowSelection(row);
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
.shift_group {
   width: 1100px;
}


.formItem {
  width: 300px;
}
.formItem2 {
  width: 200px;
}
.transferDiv {
  display: inline-block;
}
.leftTransferItem {
  display: inline-block;
  vertical-align: middle;
  width: 500px;
  height: 400px;
}
.rightTransferItem {
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  width: 350px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.oneItem {
  border: 1px solid #eee;
  margin-bottom: 10px;
}
.bottomButton {
  text-align: center;
  margin: 10px 0;
}
</style>





















