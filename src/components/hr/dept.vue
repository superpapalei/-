<template>
  <div class="dept">
    <div class="topLayout">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="refreshData"></el-button>
        <el-input @keyup.enter.native="search()" placeholder="请输入部门编号或名称" v-model="condition" style="width:300px;">
          <el-button @click="search()" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" style="margin-left:10px;" @click="addNewNode('root')">新增根节点</el-button>
        <el-button type="primary" :disabled="selection.length!=1" @click="addNewNode('children')">新增子节点</el-button>
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
        <el-table ref="deptTable" style="width: 100%;height:350px;" :data="tableData" tooltip-effect="dark"
          highlight-current-row row-key="dept_id" default-expand-all @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" @row-click="handleRowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="dept_name" label="部门名称" align="center" width="220"></el-table-column>
          <el-table-column prop="dept_type" label="部门类型" align="center" width="150">
            <!-- 是否写死，还是动态查数据  -->
            <template slot-scope="scope">{{scope.row.dept_type | deptTypeTrans}}</template>
          </el-table-column>
          <el-table-column prop="calendar_id" label="日历类型" align="center" width="150">
            <template slot-scope="scope">{{scope.row.calendar_id | calendarTypeTrans}}</template>
          </el-table-column>
          <el-table-column prop="shift_type_id" label="班次类型" align="center" width="150">
            <template slot-scope="scope">{{scope.row.shift_type_id | shiftTypeTrans}}</template>
          </el-table-column>
          <el-table-column prop="dept_note" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" width="150" prop="handle">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="eidtDeptShow(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog width="500px" :title="addDeptText" :close-on-click-modal="false" :visible.sync="addDeptVisiable"
      top="5vh" @closed="refreshForm">
      <el-form :model="deptModel" label-width="100px" ref="deptForm" :rules="add_rules">
        <el-form-item label="部门编号">
          <el-input class="formItem" v-model="deptModel.dept_id" placeholder="系统自动生成" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-input class="formItem" v-model="deptModel.dept_name" placeholder="无">
          </el-input>
        </el-form-item>
        <el-form-item label="上级部门" prop="dept_pname">
          <el-select v-model="deptModel.dept_pname" ref="select_pdept" placeholder="无" disabled>
            <!-- 怎么显示名称  -->
            <el-option :label="tableData.dept_name" :value="tableData.dept_id" style="height:auto;padding:0;">
              <!-- 哪里捆绑value和label的  -->
              <el-tree :data="tableData" node-key="dept_id" ref="tree" highlight-current default-expand-all
                :current-node-key="deptModel.dept_pid">
                <div slot-scope="{node, data}" style="width:100%" @dblclick="handleSelectTreeDblClick(data)">
                  {{data.dept_name}}</div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门类型">
          <el-select v-model="deptModel.dept_type" placeholder="请选择部门类型">
            <el-option v-for="item in deptType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日历类型">
          <el-select v-model="deptModel.calendar_id" placeholder="请选择日历类型">
            <el-option v-for="item in calendarType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班次类型">
          <el-select v-model="deptModel.shift_type_id" placeholder="请选择日历类型">
            <el-option v-for="item in shiftType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="deptModel.dept_note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button @click="addDeptVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" @click="onSaveTaskClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "dept",
  data() {
    return {
      condition: "",
      tableData: [], //表格数据
      // deptData: [], //部门数据
      // deptDataFlatten: [],   //干嘛的
      deptDataFilter: [],
      selection: [],
      addDeptVisiable: false,
      deptModel: {},
      addOrNot: true, //是否新增
      addDeptText: "",
      //potions可能不是写死的，初始值为[]，需要查询后赋值给集合
      deptType_options: [
        {
          value: "1",
          label: "部门类型1"
        },
        {
          value: "2",
          label: "部门类型2"
        }
      ],
      calendarType_options: [
        {
          value: "1",
          label: "日历类型1"
        },
        {
          value: "2",
          label: "日历类型2"
        }
      ],
      shiftType_options: [
        {
          value: "1",
          label: "班次类型1"
        },
        {
          value: "2",
          label: "班次类型2"
        }
      ],
      add_rules: {
        dept_name: [
          { required: true, message: "请填写部门名称", trigger: "blur" }
        ],
        dept_type: [
          { required: true, message: "请输入部门类型", trigger: "change" }
        ],
        calendar_id: [
          { required: true, message: "请输入日历类型", trigger: "change" }
        ],
        shift_type_id: [
          { required: true, message: "请输入班次类型", trigger: "change" }
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
          return "部门类型1";
          break;
        case 2:
          return "部门类型2";
          break;
      }
    },
    calendarTypeTrans(value) {
      switch (value) {
        case 1:
          return "日历类型1";
          break;
        case 2:
          return "日历类型2";
          break;
      }
    },
    shiftTypeTrans(value) {
      switch (value) {
        case 1:
          return "班次类型1";
          break;
        case 2:
          return "班次类型2";
          break;
      }
    }
  },
  // watch: {
  //   addDeptVisiable(val) {
  //     if (val) {
  //       this.selectDept();
  //     }
  //   }
  // },
  methods: {
    refreshData() {
      this.z_get("api/dept/tree", { condition: this.condition })
        .then(res => {
          // this.deptDataFilter = res.dept_id;
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
    //表格树选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.tableData;
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
          this.$refs.deptTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.deptTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    addNewNode(type) {
      var dept_pid = 1; //创建根节点时，若pid为空，前端后台不匹配；若pid为0，因为pid和id外键关联，后台无法插入
      if (type == "root") {
        this.addDeptText = "新增根节点";
      } else if (type == "children") {
        dept_pid = this.selection[0].dept_id;
        this.addDeptText = "新增[" + dept_pid + "]的子节点";
      }
      this.deptModel = {
        c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        dept_name: "",
        dept_pid: dept_pid,
        dept_type: "",
        calendar_id: "",
        shift_type_id: "",
        dept_pname: ""
      };
      this.addOrNot = true;
      this.addDeptVisiable = true;
    },
    onSaveTaskClick() {
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
    eidtDeptShow(row) {
      this.deptModel = JSON.parse(JSON.stringify(row));
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
          var realSelect = this.arrayChildrenFlatten(list, []); //搜索对应节点的分支（从子节点至叶子节点的所有节点）
          this.z_delete("api/dept/list", realSelect)
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
    // selectDept() {
    //   this.deptData = [];
    //   this.z_get("api/dept/tree", {}, { loading: false })
    //     .then(res => {
    //       this.deptData = res.data;
    //       this.deptDataFlatten = this.arrayChildrenFlatten(this.deptData, []);
    //     })
    //     .catch(res => {
    //       console.log(res.msg);
    //     });
    // },
    //筛选部门名称
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
          result = this.arrayChildrenFlatten(item.children, result); //递归，将其叶节点至叶子节点的所有节点添加到result集合中
        } else {
          result.push(item);
        }
      }
      return result;
    },
    handleSelectTreeDblClick(data) {
      this.deptModel.dept_pid = data.dept_id;
      this.deptModel.dept_pname = data.dept_name;
      this.$refs.select_pdept.blur();
    },
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.deptTable.toggleRowSelection(row);
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
.dept {
  width: 100%;
}
.tbar {
  margin-bottom: 10px;
}
.formItem {
  width: 300px;
}
</style>