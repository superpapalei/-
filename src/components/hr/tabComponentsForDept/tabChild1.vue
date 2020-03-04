<template>
  <div>
    <el-card shadow="hover" class="centerCard">
      <div>
        <div slot="header">
          <span class="fstrong f16">{{deptName}}</span>
        </div>
        <div class="tbarStyle">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入人员姓名" v-model="condition"
            style="width:300px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search">搜 索</el-button>
          </el-input>
          <el-button size="small" type="primary" style="margin-left:10px;" @click="addNewOne()">新增</el-button>
        </div>
        <div style="width:100%;height:350px;">
          <el-table style="width: 100%" height="100%" :data="tableData" tooltip-effect="dark" highlight-current-row>
            <el-table-column prop="emp_name" label="姓名" align="center" width="140"></el-table-column>
            <el-table-column prop="emp_no" label="工号" align="center" width="200"></el-table-column>
            <el-table-column label="操作" width="150" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="eidtShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <el-pagination style="width: 100%;" class="dib tc" @current-change="handleCurrentChange"
          :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
          :total="allNum">
        </el-pagination> -->
      </div>
    </el-card>
    <el-dialog width="200px"  :title="addDeptEmpText" :close-on-click-modal="false" :visible.sync="addDeptEmpVisiable"
      top="5vh" @closed="refreshForm">
      <el-form :model="dept_empModel" label-width="100px" ref="deptEmpForm" :rules="add_rules">
        <el-form-item label="人员" prop="emp_id">
          <el-input v-model="dept_empModel.emp_id" placeholder="无">
          </el-input>
          <!-- <el-select v-model="dept_empModel.emp_id" ref="select_emp" placeholder="请选择人员">
            <el-option v-for="item in empData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="是否为管理者" prop="is_manager">
          <!-- <el-select v-model="dept_empModel.is_manager" ref="select_is_manager" placeholder="是否为管理者">
            <el-option v-for="item in manager_option" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button type="primary" @click="onSaveDeptEmpClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
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
// import { digitUppercase } from "@/common/js/money.js";
// import {
//   getAllRefund,
//   deleteRefund,
//   updataRefundStatus,
//   updatePrinted
// } from "@/api/refund";
export default {
  name: "child1",
  props: ["deptName", "deptId"],
  data() {
    return {
      condition: "",
      tableData: [], //表格数据
      dept_empModel: {},
      addDeptEmpText: "",
      addOrNot: true,
      addDeptEmpVisiable: false,
      empData: [],
      manager_option: [
        {
          label: false,
          value: "不是"
        },
        {
          label: true,
          value: "是"
        }
      ],
      add_rules: {
        select_emp: [
          { required: true, message: "请选择人员", trigger: "change" }
        ],
        select_is_manager: [
          { required: true, message: "请确定是否为管理者", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    deptId(val) {
      if (val) {
        this.refreshData();
      }
    }
  },
  methods: {
    //查找人员数据
    selectEmp() {
      this.empData = [];
      this.z_get("api/employee", {}, { loading: false })
        .then(res => {
          this.empData = res.data;
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
    //删除一条记录
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    onDeleteClick(list) {
    },
    addNewOne() {
      this.addDeptEmpText = "新增部门人员";
      this.dept_empModel = {
        c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        is_main_dept: false, //现在先写死，到时候再看怎么赋值
        is_manager: false
      };
      this.addOrNot = true;
      this.addDeptEmpVisiable = true;
    },
    onSaveDeptEmpClick() {
      this.$refs.deptForm.validate(valid => {
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
    eidtEmpShow(row) {
      this.dept_empModel = JSON.parse(JSON.stringify(row));
      this.addDeptEmpText = "编辑节点";
      this.addOrNot = false;
      this.addDeptEmpVisiable = true;
    },
    refreshForm() {
      this.$refs.deptEmpForm.resetFields();
    },
    //往父组件（部门）中传入数据
    sendParamsToParent() {
      this.$$emit('getParamsFromChild1',this.addOrNot,this.addDeptEmpVisiable);
    },
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
</style>