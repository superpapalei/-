<template>
  <div class="template_group_type">
    <div class="topLayout">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
        <el-input @keyup.enter.native="refreshData" placeholder="请输入模板类型编号或模板类型名称" v-model="condition" clearable style="width:300px;">
          <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" style="margin-left:10px;" @click="addNewTemplateTypeGroup()">新增模板类型</el-button>
        <el-button type="danger" :disabled="selection.length==0" @click="deleteList">删除选中模板类型({{selection.length}})
        </el-button>
       
      </div>
      <div class="topContent">
        <el-table ref="tgtTable" style="width: 100%;height:350px;" :data="tgtData" tooltip-effect="dark"
          highlight-current-row row-key="tgt_id" default-expand-all @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" @row-click="handleRowClick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
         
          <el-table-column prop="tgt_id" label="模板类型编号" align="left" width="180" sortable></el-table-column>
          <el-table-column prop="tgt_name" label="模板类型名称" align="left" width="180"></el-table-column>
                   
          <el-table-column prop="tgt_note" label="模板类型说明" align="left" ></el-table-column>
          
          <el-table-column label="操作" width="180" prop="handle">
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
    <el-dialog width="500px" :title="addgptText" :close-on-click-modal="false" :visible.sync="addgptVisiable"
      top="5vh" @closed="refreshForm">
      <el-form :model="templateGroupTypeModel" label-width="100px" ref="templateGroupTypeForm" :rules="add_rules">
        <el-form-item label="模板类型编号">
          <el-input class="formItem" v-model="templateGroupTypeModel.tgt_id" placeholder="系统自动生成" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="模板类型名称">
          <el-input class="formItem" v-model="templateGroupTypeModel.tgt_name" placeholder="请填写模板类型名称">
          </el-input>
        </el-form-item>
           <el-form-item label="模板类型说明">
          <el-input class="formItem" type="textarea" :rows="2" v-model="templateGroupTypeModel.tgt_note" placeholder="模板类型说明">
          </el-input>
        </el-form-item>
        
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button @click="addgptVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" @click="onSavePostClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "template_group_type",
  data() {
    return {
      condition: "",
      tgtData: [], //表格数据
      //deptDataFilter:[],
      //deptData: [], //部门数据
      selection: [],
      addgptVisiable: false,
      templateGroupTypeModel: {},
      addOrNot: true, //是否新增
      addgptText: ""
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
    addgptVisiable(val) {
      if (val) {
        this.selectDept();
      }
    }
  },
  methods: {
    refreshData() {
      this.z_get("api/template_group_type", { condition: this.condition })
        .then(res => {
          //this.deptDataFilter = res.dict.dept_id;
          this.tgtData = res.data;
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
    //   var val = this.tgtData;
    //   var select = false;
    //   for (var i = 0; i < selection.length; i++) {
    //     if (selection[i].tgt_id == val[0].tgt_id) {
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
    //       this.$refs.tgtTable.toggleRowSelection(val[i]);
    //     } else if (!select && this.selection.indexOf(val[i] > -1)) {
    //       this.$refs.tgtTable.toggleRowSelection(val[i]);
    //     }
    //     if (val[i].children && val[i].children.length) {
    //       this.selectChildren(val[i].children, select);
    //     }
    //   }
    // },

  
    addNewTemplateTypeGroup() {
        this.addgptText = "新增模板类型";
        this.templateGroupTypeModel = {
            tgt_id: 0,
            tgt_name:"",
            tgt_note:""
      };
      this.addOrNot = true;
      this.addgptVisiable = true;
    },


    onSavePostClick() {
      this.$refs.templateGroupTypeForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/template_group_type", this.templateGroupTypeModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addgptVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.z_put("api/template_group_type", this.templateGroupTypeModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addgptVisiable = false;
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
      this.templateGroupTypeModel = JSON.parse(JSON.stringify(row));
      //this.templateGroupTypeModel.tgt_id = this.filterDeptName(this.templateGroupTypeModel.dept_id);

      this.addgptText = "编辑模板类型";
      this.addOrNot = false;
      this.addgptVisiable = true;
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
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          var realSelect = this.arrayChildrenFlatten(list, []);
          this.z_delete("api/template_group_type/list", { data: realSelect })
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
            });
        })
        .catch(() => {});
    },

    // onDeleteClick(list) {
    //   this.$confirm("是否删除？！", "提示", {
    //     confirmButtonText: "是",
    //     cancelButtonText: "否",
    //     type: "warning"
    //   })
    //     .then(() => {
          
    //       var realSelect = this.arrayChildrenFlatten(list, []);
          
    //       this.z_delete("api/template_group_type/list", { data: realSelect })
    //      //this.z_delete("api/template_group_type",list)
    //         .then(res => {
    //           this.$message({
    //             message: "删除成功",
    //             type: "success",
    //             duration: 1000
    //           });
    //           this.refreshData();
    //         })
    //         .catch(res => {
    //           this.$alert("删除失败", "提示", {
    //             confirmButtonText: "确定",
    //             type: "error"
    //           });
    //           console.log(res);
    //         });
    //     })
    //     .catch(() => {});
    // },
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
    //   this.templateGroupTypeModel.dept_id = data.dept_id;
    //   this.templateGroupTypeModel.dept_name = data.dept_name;
    //   this.$refs.select_dept.blur();
    // },
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.tgtTable.toggleRowSelection(row);
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
.template_group_type {
  width: 1100px;
}
.tbar {
  margin-bottom: 10px;
}
.formItem {
  width: 300px;
}
</style>