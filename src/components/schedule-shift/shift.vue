
<template>
  <div class="shift_group">
    <div class="topLayout">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
        <el-input @keyup.enter.native="refreshData" placeholder="请输入标记类型名称" v-model="condition" clearable style="width:300px;">
          <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" style="margin-left:10px;" @click="addNewWorkPost()">新增标记类型</el-button>
        <!-- <el-button type="danger" :disabled="selection.length==0" @click="deleteList">删除选中标记类型({{selection.length}}) -->
        <!-- </el-button> -->
       
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
          <el-table ref="shift_group" style="width: 100%;" height="250px"  :data="sgData" tooltip-effect="dark"
            highlight-current-row row-key="sg_id" default-expand-all @selection-change="handleSelectionChange"
             @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="sg_name" label="班组名称" align="center" width="200"></el-table-column>
            <el-table-column prop="sg_note" label="备注" align="center" width="100"></el-table-column>
            <el-table-column label="操作" width="150" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editShiftShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="onDeleteClick(scope.row)">
                </el-button>
                <!-- <el-button type="info" icon="el-icon-more" size="mini" circle @click="moreInfo(scope.row)">
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
    </div>
    <el-dialog width="450px" :title="addsgText" :close-on-click-modal="false" :visible.sync="addsgVisiable"
      @closed="refreshForm">
       <zj-form size="small" :newDataFlag='addsgVisiable' :model="sgModel" label-width="100px" ref="shiftForm"
        :rules="add_rules">
         <el-form-item label="班组名称" prop="sg_name">
          <el-input class="formItem" v-model="sgModel.sg_name" placeholder="请填写班组名称"> </el-input>
        </el-form-item>
         <el-form-item label="班组名称" prop="sg_note">
          <el-input class="formItem" v-model="sgModel.sg_note" placeholder="备注"> </el-input>
        </el-form-item>
        
  
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addsgVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveSgClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "shift_group",
  data() {
    return {
      condition: "",
      sgData: [], //表格数据
      //deptDataFilter:[],
      //deptData: [], //部门数据
      selection: [],
      addsgVisiable: false,
      sgModel: {},
      addOrNot: true, //是否新增
      addsgText: "",
  add_rules: {
       
        st_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }],
       
      }
    };
  },

  // watch: {
  //   addsgVisiable(val) {
  //     if (val) {
  //       this.selectDept();
  //     }
  //   }
  // },
  methods: {



    refreshData() {
      this.z_get("api/shift_group", { condition: this.condition })
        .then(res => {
          //this.deptDataFilter = res.dict.dept_id;
          this.sgData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.sgForm.resetFields();
    },
    refreshBottom() {
      this.itemCondition = "";
      this.dataCondition = "";
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    //表格树选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
 
  
    addNewWorkPost() {
        this.addsgText = "新增标记类型";
        this.sgModel = {
            sg_id: 0,
            sg_name:"",
            sg_note:"",
          
      };
      this.addOrNot = true;
      this.addsgVisiable = true;
    },


    onSaveSgClick() {
      this.$refs.sgForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/shift_group", this.sgModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addsgVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
                 this.sgModel.UpdateColumns = this.$refs.sgForm.UpdateColumns;
            this.z_put("api/shift_group", this.sgModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addsgVisiable = false;
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
    editWorkPostShow(row) {
      this.sgModel = JSON.parse(JSON.stringify(row));
      //this.sgModel.sg_id = this.filterDeptName(this.sgModel.dept_id);

      this.addsgText = "编辑标记类型";
      this.addOrNot = false;
      this.addsgVisiable = true;
    },
    //删除一个
  
 
 
onDeleteClick(row) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/shift_group", { data: row })
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
 
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.tgtTable.toggleRowSelection(row);
    },

  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.shift_group {
  width: 100%;
}
.tbar {
  margin-bottom: 10px;
}
.formItem {
  width: 300px;
}
</style>