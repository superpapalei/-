<template>
  <div class="deptShiftTab">
    <el-card shadow="hover" class="centerCard">
      <div>
        <div slot="header">
          <span class="fstrong f16">{{deptName}}</span>
        </div>
        <div class="tbarStyle">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入班次名称" v-model="condition"
            style="width:300px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search">搜 索</el-button>
          </el-input>
          <el-button size="small" type="primary" style="margin-left:10px;" @click="addNewOne()">新增</el-button>
          <el-button size="small" type="danger" :disabled="selection.length==0" @click="deleteList">
            批量删除({{selection.length}})
          </el-button>
        </div>
        <div style="width:100%;height:370px;">
          <el-table ref="deptShiftTable" style="width: 100%" height="100%" :data="tableData" tooltip-effect="dark"
            highlight-current-row border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="70" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="sg_name" label="班次名称" align="center" width="140"></el-table-column>
            <el-table-column prop="sg_note" label="班次说明" align="center"></el-table-column>
            <el-table-column prop="dsg_startdate" label="开始使用时间" align="center" width="130">
              <template slot-scope="scope">{{ scope.row.dsg_startdate| datetrans}}
              </template>
            </el-table-column>
            <el-table-column prop="dsg_enddate" label="结束使用时间" align="center" width="130">
              <template slot-scope="scope">{{ scope.row.dsg_enddate | datetrans}}
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
    <el-dialog width="400px" :title="addDeptShiftText" :close-on-click-modal="false"
      :visible.sync="addDeptShiftVisiable" top="25vh" @closed="refreshForm" :append-to-body="true">
      <zj-form :newDataFlag='addDeptShiftText' :model="dept_shiftModel" label-width="100px" ref="deptShiftForm"
        :rules="add_rules">
        <el-form-item label="班次组" prop="sg_id">
          <el-select v-model="dept_shiftModel.sg_id" ref="select_shift" placeholder="请选择人员" :disabled="!addOrNot">
            <el-option v-for="item in shiftData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始使用日期" prop="dsg_startdate">
          <el-date-picker v-model="dept_shiftModel.dsg_startdate" type="date" format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd" placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束使用日期" prop="dsg_enddate">
          <el-date-picker v-model="dept_shiftModel.dsg_enddate" type="date" format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd" placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:20px;">
          <el-button type="primary" @click="onSaveDeptShiftClick" style="margin-left:-60px;">保&nbsp;&nbsp;存</el-button>
          <el-button @click="addDeptShiftVisiable = false">取&nbsp;&nbsp;消</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
import print from "print-js";
import Axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "depShiftChild",
  props: ["deptName", "deptId"],
  data() {
    return {
      condition: "",
      tableData: [], //表格数据
      dept_shiftModel: {}, //部门人员实例
      addDeptShiftText: "",
      addOrNot: true,
      selection: [], //选中项
      addDeptShiftVisiable: false,
      shiftData: [], //班次组数据
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
    addDeptShiftVisiable(val) {
      if (val) {
        this.selectShift();
      }
    }
  },
  methods: {
    //查找人员数据
    selectShift() {
      this.shiftData = [];
      this.z_get("api/shift_group", {}, { loading: false })
        .then(res => {
          if (res.code == 0) {
            this.shiftData = res.data;
            for (var i = 0; i < this.shiftData.length; i++) {
              this.shiftData[i].label = this.shiftData[i].sg_name;
              this.shiftData[i].value = this.shiftData[i].sg_id;
            }
          }
        })
        .catch(res => {});
    },
    refreshData() {
      this.z_get("api/dept_shift_group/dept_shift", {
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
      this.addDeptShiftText = "新增部门班次";
      this.dept_shiftModel = {
        c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        dept_id: this.deptId,
        sg_id: 1
      };
      this.addOrNot = true;
      this.addDeptShiftVisiable = true;
    },
    onSaveDeptShiftClick() {
      this.$refs.deptShiftForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/dept_shift_group", this.dept_shiftModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addDeptShiftVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败:" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.dept_shiftModel.UpdateColumns = this.$refs.deptShiftForm.UpdateColumns;
            this.z_put("api/dept_shift_group", this.dept_shiftModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addDeptShiftVisiable = false;
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
      this.dept_shiftModel = JSON.parse(JSON.stringify(row));
      this.addDeptShiftText = "编辑部门班次组";
      this.addOrNot = false;
      this.addDeptShiftVisiable = true;
    },
    refreshForm() {
      this.$refs.deptShiftForm.resetFields();
    },
    //表格选中改变
    handleSelectionChange(val) {
      this.selection = val;
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
          this.z_delete("api/dept_shift_group/dept_shift_list", { data: list })
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
    },
    datetrans(value) {
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