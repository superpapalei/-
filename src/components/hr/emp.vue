<template>
  <div class="emp">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入人员编号或姓名" v-model="condition"
            clearable style="width:300px;">
            <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewEmployeeShow('root')">新增
          </el-button>
          <el-button type="primary" size="small" :disabled="selection.length!=1" @click="addNewEmployeeShow('children')">
            导入</el-button>
          
          <!-- <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleemp_phoneist">
            删除选中节点({{selection.length}})
          </el-button> -->
          <!-- 下拉 -->
          <!-- <el-dropdown style="margin-left:10px;">
            <el-button size="small">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="expandAll">展开所有节点</el-dropdown-item>
              <el-dropdown-item @click.native="collapseAll" divided>折叠所有节点</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
        <div class="topContent" style="height:600px;">
          <el-table ref="empTable" style="width: 100%;" height="100%" :data="empData" tooltip-effect="dark"
            highlight-current-row row-key="emp_id" default-expand-all @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- <el-table-column prop="st_id" label="任务编号" align="center" width="150"></el-table-column> -->
          <el-table-column prop="emp_id" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="emp_no" label="人员编号" align="center" width="100"></el-table-column>
          <el-table-column prop="emp_name" label="人员名称" align="center" width="110"></el-table-column>
          
          <el-table-column prop="emp_sex" label="性别" align="center" width="80"></el-table-column>
          <el-table-column prop="emp_type" label="部门名称" align="center" width="130">
              <template slot-scope="scope">{{filterDeptName(scope.row.dept_id)}}</template>
          </el-table-column>
          
          <el-table-column prop="emp_phone" label="电话" align="center" width="130"></el-table-column>
          <el-table-column prop="emp_2Phone" label="备用电话" align="center" width="130">
              <!-- <template slot-scope="scope">{{scope.row.emp_sex | stTypeTrans}}</template> -->
            </el-table-column>
            <!-- <el-table-column prop="emp_status" label="状态" align="center" width="110"></el-table-column> -->
            <el-table-column label="操作" width="150" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editEmpShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bottomContent" style="height:250px;">
        </div>
      </div>
    </div>
    <!-- 增加人员表 -->
    <el-dialog width="450px" :title="addEmpText" :close-on-click-modal="false" :visible.sync="addEmpVisiable"
      @closed="refreshForm">
      <el-form size="small" :model="empModel" label-width="100px" ref="empForm" :rules="add_rules">
        <!-- <el-form-item label="任务编号">
          <el-input class="formItem" v-model="empModel.st_id" placeholder="系统自动生成" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="上级任务编号">
          <el-input class="formItem" v-model="empModel.st_pid" placeholder="无" disabled>
          </el-input>
        </el-form-item> -->

        <el-form-item label="人员编号" prop="emp_no">
          <el-input class="formItem" v-model="empModel.emp_no" placeholder="请填写人员编号">
          </el-input>
        </el-form-item>

        <el-form-item label="员工名称" prop="emp_name">
          <el-input class="formItem" v-model="empModel.emp_name" placeholder="请填写员工名称">
          </el-input>
        </el-form-item>

        <!-- 选择员工性别 -->
        <el-form-item label="员工性别" prop="emp_sex">
          <el-select   class="formItem"   v-model="empModel.emp_sex" placeholder="请选择员工性别">
            <el-option v-for="item in emp_sex_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="所属部门" prop="dept_id">
          <el-select v-model="empModel.dept_id" ref="select_dept" placeholder="请选择属部门">
            <el-option :label="empModel.dept_name" :value="empModel.dept_id" style="height:auto;padding:0;">
              <el-tree :data="deptData" node-key="dept_id" ref="tree" highlight-current default-expand-all
                :expand-on-click-node="false" :current-node-key="empModel.dept_id">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                  @click="handleSelectTreeDblClick(data)">
                  {{data.dept_name}}</div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="联系电话" prop="emp_phone">
          <el-input class="formItem" v-model="empModel.emp_phone" placeholder="请填写联系方式">
          </el-input>
        </el-form-item>

        <el-form-item label="备用联系电话" prop="emp_2Phone">
          <el-input class="formItem" v-model="empModel.emp_2Phone" placeholder="请填写备用联系方式">
          </el-input>
        </el-form-item>
        
        <!-- <el-form-item label="任务类型">
          <el-select v-model="empModel.emp_sex" placeholder="请选择任务类型">
            <el-option v-for="item in emp_sex_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->

        <!-- 工期 -->
        <!-- <el-form-item label="工期(天)" prop="st_period">
          <el-input class="formItem" v-model="empModel.st_period" placeholder="请填写工期" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item> -->

        <!-- <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="empModel.st_note" placeholder="备注信息">
          </el-input>
        </el-form-item> -->


        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addEmpVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveEmpClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:"employee",
  data() {

    return {
      condition: "",
      empData: [], //表格数据
      deptDataFilter: [],
      deptData: [], //部门数据
      selection: [],
      addEmpVisiable: false,
      empModel: {},
      addOrNot: true, //是否新增
      addEmpText: "",
      emp_sex_options: [
        {
          value: "man",
          label: "男性"
        },
        {
          value: "woman",
          label: "女性"
        }
      ],
      add_rules: {
        emp_no:[{ required: true, message: "请填写人员编码", trigger: "blur" }],
        dept_id: [{ required: true, message: "请选择部门", trigger: "change" }],
        emp_name: [{ required: true, message: "请填写人员名称", trigger: "blur" }],
        /* st_period: [{ required: true, message: "请填写工期", trigger: "blur" }], */
        emp_phone:[{ required: true, message: "请填写联系电话", trigger: "blur" }],
        emp_2Phone:[{ required: false, message: "请填写备用电话", trigger: "blur" }],
        
      }
    };
  },
  /*filters: {
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
      return y + "-" + MM + "-" + d + " "; /* + h + ':' + m + ':' + s; 
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
  },*/
  watch: {
    addEmpVisiable(val) {
      if (val) {
        this.selectDept();
      }
    }
  },
  methods: {
    
    refreshData() {
      this.taskData = [];
      this.z_get("api/employee", { condition: this.condition })
        .then(res => {
          /* this.deptDataFilter = res.dict.dept_id; */
          this.empData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.empForm.resetFields();
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
      var val = this.empData;
      var select = false;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].emp_id == val[0].emp_id) {
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
          this.$refs.empTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.empTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    addNewEmployeeShow(type) {
      var empName = "";
      var st_pid = 0;
      var empPhone = "";
      var empPhone2 = "";
      if (type == "root") {
        empName = "";
        this.addEmpText = "新增人员";
      } else if (type == "children") {
        st_pid = this.selection[0].emp_no; //人员编号
        empName = this.selection[0].emp_name;//人员名称
        empSex = this.selection[0].emp_sex;
        
        empempPhone=this.selection[0].emp_phone;//联系电话
        empPhone2=this.selection[0].emp_2Phone;//备用联系电话

        this.addEmpText = "新增了人员[" + empName + "]";
      }
      this.empModel = {
        emp_no: 0,//员工编号
        st_pid: st_pid,
        dept_id: "",  /*部门ID*/ 
        dept_name: "",//部门名称
        emp_name: "",//名称
        emp_sex: "man",//性别
        //在职
        emp_phone: "1",//联系电话
        emp_2Phone: "",//备用联系电话

      };
      this.addOrNot = true;
      this.addEmpVisiable = true;
    },
    
    onSaveEmpClick() {
      this.$refs.empForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/employee", this.empModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addEmpVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.empModel.UpdateColumns = this.$refs.empForm.UpdateColumns;
            if (this.empModel.UpdateColumns) {
              this.z_put("api/employee", this.empModel)
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
            } else {
              this.addempVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    
    //编辑数据
    editEmpShow(row) {
      /* this.empModel = JSON.parse(JSON.stringify(row)); */
      this.empModel.dept_name = this.filterDeptName(this.empModel.dept_id);
      this.addEmpText = "编辑人员信息";
      this.addOrNot = false;
      this.addEmpVisiable = true;
    },
    //删除一个
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    onDeleteClick(list) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/employee", { data: list })
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
      this.empModel.dept_id = data.dept_id;
      this.empModel.dept_name = data.dept_name;
      this.$refs.select_dept.blur();
    },
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.empTable.toggleRowSelection(row);
    },
    expandAll() {
      var icon = this.$el.geemp_phoneementsByClassName("el-table__expand-icon");
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
      var icon = this.$el.geemp_phoneementsByClassName("el-table__expand-icon");
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
.containAll {
  width: 1100px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: white;
}
.tbar {
  margin-bottom: 10px;
  padding-left: 10px;
}
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