
<template>
  <div class="scheduling_note_type">
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
      <!-- 班次表
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
      <div class="topContent">
        <el-table ref="tgtTable" style="width: 100%;height:350px;" :data="sntData" tooltip-effect="dark"
          highlight-current-row row-key="snt_id" default-expand-all @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" @row-click="handleRowClick">
          <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
          <el-table-column prop="snt_id" label="序号" align="center" width="60"></el-table-column>
          <el-table-column prop="snt_name" label="标记类型名称" align="center" width="150"></el-table-column>
          
          <el-table-column prop="snt_note" label="标记说明" align="center" width="180"></el-table-column>
          
          <el-table-column label="操作" width="150" prop="handle" center>
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editWorkPostShow(scope.row)">
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog width="500px" :title="addSntText" :close-on-click-modal="false" :visible.sync="addsntVisiable"
      top="5vh" @closed="refreshForm">
      <zj-form :model="sntModel" label-width="100px" ref="sntForm" :rules="add_rules">
        <el-form-item label="序号">
          <el-input class="formItem" v-model="sntModel.snt_id" placeholder="系统自动生成" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="标记名称">
          <el-input class="formItem" v-model="sntModel.snt_name" placeholder="请填写标记类型名称">
          </el-input>
        </el-form-item>
        <el-form-item label="标记类型说明">
          <el-input class="formItem" type="textarea" :rows="2" v-model="sntModel.snt_note" placeholder="说明信息">
          </el-input>
        </el-form-item>
       
        
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button @click="addsntVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" @click="onSaveSntClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "scheduling_note_type",
  data() {
    return {
      condition: "",
      sntData: [], //表格数据
      //deptDataFilter:[],
      //deptData: [], //部门数据
      selection: [],
      addsntVisiable: false,
      sntModel: {},
      addOrNot: true, //是否新增
      addSntText: ""

    };
  },

  watch: {
    addsntVisiable(val) {
      if (val) {
        this.selectDept();
      }
    }
  },
  methods: {



    refreshData() {
      this.z_get("api/scheduling_note_type", { condition: this.condition })
        .then(res => {
          //this.deptDataFilter = res.dict.dept_id;
          this.sntData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.tgForm.resetFields();
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
        this.addSntText = "新增标记类型";
        this.sntModel = {
            snt_id: 0,
            snt_name:"",
            snt_note:"",
          
      };
      this.addOrNot = true;
      this.addsntVisiable = true;
    },


    onSaveSntClick() {
      this.$refs.sntForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/scheduling_note_type", this.sntModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addsntVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
                 this.sntModel.UpdateColumns = this.$refs.sntForm.UpdateColumns;
            this.z_put("api/scheduling_note_type", this.sntModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addsntVisiable = false;
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
      this.sntModel = JSON.parse(JSON.stringify(row));
      //this.sntModel.snt_id = this.filterDeptName(this.sntModel.dept_id);

      this.addSntText = "编辑标记类型";
      this.addOrNot = false;
      this.addsntVisiable = true;
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
          this.z_delete("api/scheduling_note_type/list", { data: realSelect })
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
.scheduling_note_type {
  width: 100%;
}
.tbar {
  margin-bottom: 10px;
}
.formItem {
  width: 300px;
}
</style>