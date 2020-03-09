<template>
  <div class="deptEmpTab">
    <el-card shadow="hover" class="centerCard">
      <div>
        <div slot="header">
          <span class="fstrong f16">{{deptName}}</span>
        </div>
        <div class="tbarStyle">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入员工姓名" v-model="condition"
            style="width:300px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search">搜 索</el-button>
          </el-input>
          <el-button size="small" type="primary" style="margin-left:10px;" @click="addNewOne()">新增</el-button>
          <el-button size="small" type="danger" :disabled="selection.length==0" @click="deleteList">
            批量删除({{selection.length}})
          </el-button>
          <el-dropdown style="margin-left:10px;">
            <el-button size="small" :disabled="selection.length==0">
              批量修改({{selection.length}})<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item @click.native="editList(1)" divided>设置为需被排班</el-dropdown-item>
              <el-dropdown-item @click.native="editList(4)" divided>取消设置需被排班</el-dropdown-item>
              <el-dropdown-item @click.native="editList(2)" divided>设置为负责人</el-dropdown-item>
              <el-dropdown-item @click.native="editList(5)" divided>取消设置为负责人</el-dropdown-item>
              <el-dropdown-item @click.native="editList(3)" divided>设置为主部门</el-dropdown-item>
              <el-dropdown-item @click.native="editList(6)" divided>取消设置为主部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div style="width:100%;height:370px;">
          <el-table ref="deptEmpTable" style="width: 100%" height="100%" :data="tableData" tooltip-effect="dark"
            highlight-current-row border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="70" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="emp_name" label="姓名" align="center" width="140"></el-table-column>
            <el-table-column prop="emp_no" label="工号" align="center"></el-table-column>
            <el-table-column label="是否需被排班" align="center" width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.de_isscheduling | transIsScheduling }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="is_manager" label="是否为负责人" align="center" width="125">
              <template slot-scope="scope">
                <span>{{ scope.row.is_manager | transIsManager }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="is_main_dept" label="是否为主部门" align="center" width="125">
              <template slot-scope="scope">
                <span>{{ scope.row.is_main_dept | transIsMainDept }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog width="400px" :title="addDeptEmpText" :close-on-click-modal="false" :visible.sync="addDeptEmpVisiable"
      top="25vh" @closed="refreshForm" :append-to-body="true">
      <el-form :model="dept_empModel" label-width="100px" ref="deptEmpForm" :rules="add_rules">
        <el-form-item label="人员" prop="emp_id">
          <el-select v-model="dept_empModel.emp_id" ref="select_emp" placeholder="请选择人员">
            <el-option v-for="item in empData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写项1" prop="de_isscheduling" v-if="!addOrNot">
          <el-checkbox v-model="dept_empModel.de_isscheduling">是否需被排班</el-checkbox>
        </el-form-item>
        <el-form-item label="填写项2" prop="is_manager" v-if="!addOrNot">
          <el-checkbox v-model="dept_empModel.is_manager">是否为负责人</el-checkbox>
        </el-form-item>
        <el-form-item label="填写项3" prop="is_main_dept" v-if="!addOrNot">
          <el-checkbox v-model="dept_empModel.is_main_dept">是否为主部门</el-checkbox>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:20px;">
          <el-button type="primary" @click="onSaveDeptEmpClick" style="margin-left:-60px;">保&nbsp;&nbsp;存</el-button>
          <el-button @click="addDeptEmpVisiable = false">取&nbsp;&nbsp;消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import print from "print-js";
import Axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "depEmpChild",
  props: ["deptName", "deptId"],
  data() {
    return {
      condition: "",
      tableData: [], //表格数据
      dept_empModel: {}, //部门人员实例
      addDeptEmpText: "",
      addOrNot: true,
      selection: [], //选中项
      addDeptEmpVisiable: false,
      empData: [], //部门数据
      add_rules: {
        emp_id: [{ required: true, message: "请选择人员", trigger: "change" }],
        is_manager: [
          { required: true, message: "是否为负责人", trigger: "blur" }
        ],
        is_main_dept: [
          { required: true, message: "是否为主部门", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    deptId(val) {
      if (val) {
        this.refreshData();
      }
    },
    addDeptEmpVisiable(val) {
      if (val) {
        this.selectEmp();
      }
    }
  },
  methods: {
    //查找人员数据
    selectEmp() {
      this.empData = [];
      this.z_get("api/employee", {}, { loading: false })
        .then(res => {
          if (res.code == 0) {
            this.empData = res.data;
            for (var i = 0; i < this.empData.length; i++) {
              this.empData[i].label = this.empData[i].emp_name;
              this.empData[i].value = this.empData[i].emp_id;
            }
          }
        })
        .catch(res => {});
    },
    refreshData() {
      this.z_get("api/dept/dept_emp", {
        condition: this.condition,
        deptId: this.deptId
      })
        .then(res => {
          console.log(res);
          this.tableData = res.data.dic;
        })
        .catch(res => {});
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    addNewOne() {
      this.addDeptEmpText = "新增部门人员";
      this.dept_empModel = {
        c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        dept_id: this.deptId,
        is_main_dept: false,
        is_manager: false,
        de_isscheduling: "",
        de_isauthority: ""
      };
      this.addOrNot = true;
      this.addDeptEmpVisiable = true;
    },
    onSaveDeptEmpClick() {
      this.$refs.deptEmpForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/dept/dept_emp", this.dept_empModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addDeptEmpVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.z_put("api/dept/dept_emp", this.dept_empModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addDeptEmpVisiable = false;
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
    editShow(row) {
      this.dept_empModel = JSON.parse(JSON.stringify(row));
      this.addDeptEmpText = "编辑部门人员";
      this.addOrNot = false;
      this.addDeptEmpVisiable = true;
    },
    refreshForm() {
      this.$refs.deptEmpForm.resetFields();
    },
    //表格选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
    //批量修改
    editList(mark) {
      if (this.selection.length) {
        this.onEditClick(this.selection, mark);
      }
    },
    onEditClick(list, mark) {
      var text = "";
      if (mark == 1) {
        text = "设置为需被排班";
        for (var i = 0; i < list.length; i++) {
          list[i].de_isscheduling = true;
        }
      } else if (mark == 2) {
        text = "设置为负责人";
        for (var i = 0; i < list.length; i++) {
          list[i].is_manager = true;
        }
      } else if (mark == 3) {
        text = "设置为主部门";
        for (var i = 0; i < list.length; i++) {
          list[i].is_main_dept = true;
        }
      } else if (mark == 4) {
        text = "取消设置需被排班";
        for (var i = 0; i < list.length; i++) {
          list[i].de_isscheduling = false;
        }
      } else if (mark == 5) {
        text = "取消设置为负责人";
        for (var i = 0; i < list.length; i++) {
          list[i].is_manager = false;
        }
      } else if (mark == 6) {
        text = "取消设置为主部门";
        for (var i = 0; i < list.length; i++) {
          list[i].is_main_dept = false;
        }
      }
      this.$confirm("对于选中项，是否确认" + text + "?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_put("api/dept/dept_emp_list", list)
            .then(res => {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("修改失败", "提示", {
                confirmButtonText: "确定",
                type: "warning"
              });
              console.log(res);
            });
        })
        .catch(() => {});
    },
    //删除一个
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //批量删除
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    onDeleteClick(list) {
      this.$confirm("是否删除选中项？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/dept/dept_emp_list", { data: list })
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
                type: "warning"
              });
              console.log(res);
            });
        })
        .catch(() => {});
    }
  },
  filters: {
    transIsScheduling: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    transIsAuthority: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    transIsMainDept: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    transIsManager: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    }
  },
  created() {}
};
</script>

<style scoped>
.centerCard {
  margin: 0 auto;
  position: relative;
}
.tbarStyle {
  margin-top: 13px;
  margin-bottom: 13px;
}
.formItem {
  width: 200px;
}
</style>