<template>
  <div class="deptEmp">
    <div class="containAll">
        <div class="leftContent">
          <div>
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
            <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入部门名称" v-model="condition"
              style="width:180px;">
              <el-button @click="refreshData" slot="append" icon="el-icon-search"></el-button>
            </el-input>
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
          <div class="topContent" style="height:432px">
            <el-table ref="deptTable" style="width: 100%" height="100%" :data="tableData" tooltip-effect="dark"
              highlight-current-row row-key="dept_id" default-expand-all @row-dblclick="handleRowDbClick">
              <el-table-column prop="dept_name" label="部门名称" style="width:95%" align="left"></el-table-column>
            </el-table>
          </div>
          </div>
        </div>
        <div class="rightContent">
          <div>
            <div>
              <el-tabs style="display:inline-block;width:100%;" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="部门员工" name="deptEmp">
                  <child1 v-if="isChildUpdate1" :deptName="deptNameSelect" :deptId="deptIdSelect"></child1>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
    </div>
    <el-dialog width="500px" :title="addDeptText" :close-on-click-modal="false" :visible.sync="addDeptVisiable"
      top="5vh" @closed="refreshForm">
      <el-form :model="deptModel" label-width="100px" ref="deptForm" :rules="add_rules">
        <el-form-item label="部门编号">
          <el-input class="formItem" v-model="deptModel.dept_id" placeholder="系统自动生成" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="dept_name">
          <el-input class="formItem" v-model="deptModel.dept_name" placeholder="无">
          </el-input>
        </el-form-item>
        <el-form-item label="上级部门" prop="dept_pid">
          <el-select v-model="deptModel.dept_pid" ref="select_dept" placeholder="请选择上级部门" disabled>
            <el-option :label="deptModel.dept_pname" :value="deptModel.dept_pid" style="height:auto;padding:0;">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="dept_type_id">
          <el-select v-model="deptModel.dept_type_id" placeholder="请选择类型">
            <el-option v-for="item in deptType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input class="formItem" type="textarea" :rows="2" v-model="deptModel.dept_note" placeholder="">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button type="primary" @click="onSaveTDempClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
          <el-button @click="addDeptVisiable = false">取&nbsp;&nbsp;消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import depEmpChild from "@/components/hr/depEmpChild";
export default {
  name: "deptEmp",
  components: {
    child1: depEmpChild,
  },
  data() {
    return {
      condition: "",
      tableData: [], //表格数据
      deptDataFilter: [],
      selection: [],
      addDeptVisiable: false,
      deptModel: {},
      addOrNot: true, //是否新增
      addDeptText: "",
      activeName: "deptEmp",
      deptIdSelect: 0, //传入tab的部门id，注意类型
      deptNameSelect: "  ", //传入tab的部门名称
      isChildUpdate1: true, //保证tab不会同时渲染所有tab，且每次点击某tab都会重新渲染该tab
      deptType_options: [
        {
          value: 1,
          label: "部门"
        },
        {
          value: 2,
          label: "小组"
        }
      ],
      add_rules: {
        dept_name: [
          { required: true, message: "请填写部门名称", trigger: "blur" }
        ],
        dept_type_id: [
          { required: true, message: "请输入部门类型", trigger: "change" }
        ]
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
    deptTypeTrans(value) {
      switch (value) {
        case 1:
          return "部门";
          break;
        case 2:
          return "小组";
          break;
      }
    },
  },
  methods: {
    refreshData() {
      this.z_get("api/dept/tree", { condition: this.condition })
        .then(res => {
          this.deptDataFilter = res.dict.dept_id;
          this.tableData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.deptForm.resetFields();
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    //标签页切换
    handleClick(tab) {
      var tabName = tab.name;
      switch (tabName) {
        case "emp_dept":
          (this.isChildUpdate1 = true),
            (this.isChildUpdate2 = this.isChildUpdate3 = this.isChildUpdate4 = false); //这样写可以？
          break;
      }
      // this.refresh();
    },
    addNewNode(type) {
      var dept_pid = ""; //创建根节点时，若pid为空，前端后台不匹配；若pid为0，因为pid和id外键关联，后台无法插入
      if (type == "root") {
        this.addDeptText = "新增根节点";
      } else if (type == "children") {
        dept_pid = this.selection[0].dept_id;
        this.addDeptText = "新增[" + this.selection[0].dept_name + "]的子节点";
      }
      this.deptModel = {
        c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        dept_name: "",
        dept_pname: "",
        dept_type_id: "",
        dept_note: "",
        dept_pid: dept_pid
      };
      this.deptModel.dept_pname = this.filterDeptName(this.deptModel.dept_pid);
      this.addOrNot = true;
      this.addDeptVisiable = true;
    },
    onSaveTDempClick() {
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/dept", this.deptModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addDeptVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.z_put("api/dept", this.deptModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addDeptVisiable = false;
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
    editDeptShow(row) {
      this.deptModel = JSON.parse(JSON.stringify(row));
      this.deptModel.dept_pname = this.filterDeptName(this.deptModel.dept_pid);
      this.addDeptText = "编辑节点";
      this.addOrNot = false;
      this.addDeptVisiable = true;
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
          this.z_delete("api/dept/list", { data: list })
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
    },
    //筛选部门名称
    filterDeptName(id) {
      var name = id;
      var dept = this.deptDataFilter.filter(item => item.value == id);
      if (dept.length) {
        name = dept[0].display;
      }
      return name;
    },
    handleRowDbClick(row, column) {
      this.deptIdSelect = row.dept_id;
      this.deptNameSelect = row.dept_name;
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
.deptEmp {
  width: 1325px;
}
.formItem {
  width: 300px;
}
.leftContent {
  width: 40%;
  position: absolute;
  display: flex;
  display: -webkit-flex;
}
.rightContent {
  float: right;
  width: 73%;
}
</style>