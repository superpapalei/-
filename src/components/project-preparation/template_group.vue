<template>
  <div class="template_group">
    <div class="topLayout">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
        <el-input @keyup.enter.native="refreshData" placeholder="请输入组织模板名称" v-model="condition" clearable style="width:300px;">
          <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" style="margin-left:10px;" @click="addNewTemplateGroup()">新增组织结构模板</el-button>
        <el-button type="danger" :disabled="selection.length==0" @click="deleteList">删除选中组织结构模板({{selection.length}})
        </el-button>
       
      </div>
      <div class="topContent">
        <el-table ref="tgTable" style="width: 100%;height:350px;" :data="tgData" tooltip-effect="dark"
          highlight-current-row row-key="tg_id" default-expand-all @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" @row-click="handleRowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="tg_id" label="组织模板编号" align="center" width="120"></el-table-column>
          <el-table-column prop="wp_id" label="岗位编号" align="center" width="90"></el-table-column>
          <el-table-column prop="tem_tg_id" label="项目组_组织模板编号" align="center" width="180"></el-table-column>
          <el-table-column prop="tgt_id" label="模板类型编号" align="center" width="120"></el-table-column>
          <el-table-column prop="tg_name" label="组织模板名称" align="center" width="120"></el-table-column>             
          <el-table-column prop="tg_node_type" label="节点类型（人/组织）" align="center" width="180"></el-table-column>
          
          <el-table-column label="操作" width="150" prop="handle">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTemplateShow(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog width="500px" :title="addgpText" :close-on-click-modal="false" :visible.sync="addgpVisiable"
      top="5vh" @closed="refreshForm">
      <el-form :model="templateModel" label-width="100px" ref="templateForm" :rules="add_rules">
        <el-form-item label="组织模板编号">
          <el-input class="formItem" v-model="templateModel.tg_id" placeholder="系统自动生成" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="模板类型编号">
          <el-input class="formItem" width="330px" v-model="templateModel.tgt_id" placeholder="请填写已有的模板类型编号（否则会添加失败）">
          </el-input>
        </el-form-item>
        <el-form-item label="项目组_组织模板编号">
          <el-input class="formItem" v-model="templateModel.tem_tg_id" placeholder="请填写项目组_组织模板编号">
          </el-input>
        </el-form-item>
        <el-form-item label="角色编号">
          <el-input class="formItem" v-model="templateModel.wp_id" placeholder="请填写角色编号">
          </el-input>
        </el-form-item>
        <el-form-item label="组织模板名称" >
          <el-input class="formItem" v-model="templateModel.tg_name" placeholder="请填写组织模板名称">
          </el-input>
        </el-form-item>
        <el-form-item label="节点类型（人/组织）">
          <el-input class="formItem" v-model="templateModel.tg_node_type" placeholder="请填写节点类型（人/组织）">
          </el-input>
        </el-form-item>
        
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button @click="addgpVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" @click="onSavePostClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "template_group",
  data() {
    return {
      condition: "",
      tgData: [], //表格数据
      //deptDataFilter:[],
      //deptData: [], //部门数据
      selection: [],
      addgpVisiable: false,
      templateModel: {},
      addOrNot: true, //是否新增
      addgpText: ""
      // stType_options: [
      //   {
      //     value: "task",
      //     label: "任务"
      //   },
      //   {
      //     value: "work",
      //     label: "节点"
      //   }
      // ],
      // add_rules: {
      //   dept_id: [{ required: true, message: "请选择部门", trigger: "change" }],
      //   st_name: [
      //     { required: true, message: "请填写任务名称", trigger: "blur" }
      //   ],
      //   st_period: [{ required: true, message: "请填写工期", trigger: "blur" }]
      // }
    };
  },
//   filters: {
//     datatrans(value) {
//       if (!value || value == "9999-12-31") return "";
//       //时间戳转化大法
//       let date = new Date(value);
//       let y = date.getFullYear();
//       let MM = date.getMonth() + 1;
//       MM = MM < 10 ? "0" + MM : MM;
//       let d = date.getDate();
//       d = d < 10 ? "0" + d : d;
//       let h = date.getHours();
//       h = h < 10 ? "0" + h : h;
//       let m = date.getMinutes();
//       m = m < 10 ? "0" + m : m;
//       let s = date.getSeconds();
//       s = s < 10 ? "0" + s : s;
//       return y + "-" + MM + "-" + d + " "; /* + h + ':' + m + ':' + s; */
//     },
//     stTypeTrans(value) {
//       switch (value) {
//         case "task":
//           return "任务";
//           break;
//         case "work":
//           return "节点";
//           break;
//       }
//     }
//   },
  watch: {
    addgpVisiable(val) {
      if (val) {
        this.selectDept();
      }
    }
  },
  methods: {
    refreshData() {
      this.z_get("api/template_group", { condition: this.condition })
        .then(res => {
          //this.deptDataFilter = res.dict.dept_id;
          this.tgData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.tgForm.resetFields();
    },
    search() {
    //   this.condition = "";
      this.refreshData();
    },
    //表格树选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
    // //全选选中子节点
    // handleSelectAll(selection) {
    //   var val = this.tgData;
    //   var select = false;
    //   for (var i = 0; i < selection.length; i++) {
    //     if (selection[i].tg_id == val[0].tg_id) {
    //       select = true;
    //       break;
    //     }
    //   }
    //   for (var i = 0; i < val.length; i++) {
    //     if (val[i].children && val[i].children.length) {
    //       this.selectChildren(val[i].children, select);
    //     }
    //   }
    // },
    // //选中子节点
    // selectChildren(val, select) {
    //   for (var i = 0; i < val.length; i++) {
    //     if (select && this.selection.indexOf(val[i]) == -1) {
    //       this.$refs.tgTable.toggleRowSelection(val[i]);
    //     } else if (!select && this.selection.indexOf(val[i] > -1)) {
    //       this.$refs.tgTable.toggleRowSelection(val[i]);
    //     }
    //     if (val[i].children && val[i].children.length) {
    //       this.selectChildren(val[i].children, select);
    //     }
    //   }
    // },

  
    addNewTemplateGroup() {
        this.addgpText = "新增组织结构模板";
        this.templateModel = {
            tg_id: 0,
            tgt_id:"",
            tem_tg_id:"",
            wp_id:"",
            tg_name:"",
            tg_node_type:""
      };
      this.addOrNot = true;
      this.addgpVisiable = true;
    },


    onSavePostClick() {
      this.$refs.templateForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/template_group", this.templateModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addgpVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.z_put("api/template_group", this.templateModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addgpVisiable = false;
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
    editTemplateShow(row) {
      this.templateModel = JSON.parse(JSON.stringify(row));
      //this.templateModel.tgt_id = this.filterDeptName(this.templateModel.dept_id);

      this.addgpText = "编辑组织结构模板";
      this.addOrNot = false;
      this.addgpVisiable = true;
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
      this.$confirm("是否删除？！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          
          var realSelect = this.arrayChildrenFlatten(list, []);
          
          this.z_delete("api/template_group/list",  { data: realSelect })
         //this.z_delete("api/template_group",list)
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
    // //查找部门数据
    // selectDept() {
    //   this.deptData = [];
    //   this.z_get("api/dept/tree", {}, { loading: false })
    //     .then(res => {
    //       this.deptData = res.data;
    //     })
    //     .catch(res => {
    //       console.log(res.msg);
    //     });
    // },
    // filterDeptName(id) {
    //   var name = id;
    //   var dept = this.deptDataFilter.filter(item => item.value == id);
    //   if (dept.length) {
    //     name = dept[0].display;
    //   }
    //   return name;
    // },
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
    // handleSelectTreeDblClick(data) {
    //   this.templateModel.dept_id = data.dept_id;
    //   this.templateModel.dept_name = data.dept_name;
    //   this.$refs.select_dept.blur();
    // },
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.tgTable.toggleRowSelection(row);
    },
    // expandAll() {
    //   var icon = this.$el.getElementsByClassName("el-table__expand-icon");
    //   if (icon && icon.length) {
    //     for (var i = 0; i < icon.length; i++) {
    //       var classList = [];
    //       for (var j = 0; j < icon[i].classList.length; j++) {
    //         classList.push(icon[i].classList[j]);
    //       }
    //       if (classList.indexOf("el-table__expand-icon--expanded") == -1) {
    //         icon[i].click();
    //       }
    //     }
    //   }
    // },
    // collapseAll() {
    //   var icon = this.$el.getElementsByClassName("el-table__expand-icon");
    //   if (icon && icon.length) {
    //     for (var i = 0; i < icon.length; i++) {
    //       var classList = [];
    //       for (var j = 0; j < icon[i].classList.length; j++) {
    //         classList.push(icon[i].classList[j]);
    //       }
    //       if (classList.indexOf("el-table__expand-icon--expanded") > -1) {
    //         icon[i].click();
    //       }
    //     }
    //   }
    // }
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.template_group {
  width: 100%;
}
.tbar {
  margin-bottom: 10px;
}
.formItem {
  width: 320px;
}
</style>