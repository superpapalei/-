<template>
  <div>
    <div class="custTypePanel">
      <div style="float:left;margin:2px 10px 2px 50px">客户分类</div>

      <el-button icon="el-icon-plus" circle size="mini"></el-button>
      <el-button icon="el-icon-minus" circle size="mini"></el-button>
    </div>

    <div class="custFormPanel">
      

      <div class="tbar">
        <el-button
          icon="el-icon-refresh"
          title="刷新"
          size="mini"
          circle
        ></el-button>
        <el-input
          @keyup.enter.native="search()"
          placeholder="请输入客户信息"
          style="width:300px;"
        >
          <el-button @click="search()" slot="append" icon="el-icon-search"
            >搜索</el-button
          >
        </el-input>

        <el-button
          type="primary"
          style="margin-left:10px;"
          @click="addNewCust" size="small"
          >新建</el-button
        >
        <el-button type="primary" size="small">导入</el-button>
      </div>

      <el-table :data="tableData" height="680px" border style="width: 100% ">
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="c_code"
          label="客户代码"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="c_name"
          label="客户名称"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="c_address"
          label="客户地址"
          width="300"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="c_scale"
          label="客户规模"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="c_Importance_level"
          label="客户重要程度"
          width="150"
          align="center">
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="editDeptShow(scope.row)"
              >详情</el-button>
            
            <el-button size="mini" @click="editCustShow(scope.row)"
              >编辑</el-button>
            
            <el-button
              size="mini"
              type="danger"
              @click="deleteOne(scope.row)"
              >删除</el-button>
            
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog :title="addCustText" :visible.sync="custFormVisible" width="30%" close-on-click-model="false" @closed="refreshForm">
  <el-form :model="custModel" :rules="rules" ref="custForm" label-width="120px" label-position="right" style="width:400px">
    <el-form-item label="客户代码" prop="c_code">
      <el-input v-model="custModel.c_code" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="客户名称" prop="c_name">
      <el-input v-model="custModel.c_name" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="客户地址" prop="c_address">
      <el-input v-model="custModel.c_address" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="客户规模" >
      <el-select v-model="custModel.c_scale" placeholder="请选择客户规模">
        <el-option label="小型客户" value="shanghai"></el-option>
        <el-option label="大型客户" value="beijing"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="客户重要程度" prop="c_Importance_level">
      <el-select v-model="custModel.c_Importance_level" placeholder="请选择客户重要程度">
        <el-option label="一般" value="normal"></el-option>
        <el-option label="重要" value="important"></el-option>
        <el-option label="非常重要" value="veryImportant"></el-option>
      </el-select>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="custFormVisible = false">取 消</el-button>
    <el-button type="primary" @click ="onSaveTaskClick('cusForm')">保 存</el-button>
  </div>
</el-dialog>


  </div>
</template>

<script>
export default {
    
  data() {
    return {
      custModel:{},
      custFormVisible: false,
      condition: "", 
      addCustText: "",
      tableData: [],
      addOrNot: true,
      rules:{//新增客户校验规则
        c_code:[
          {required:true, message:'编号不能为空', trigger:'blur'}
        ],
        c_name:[
          {required:true, message:'姓名不能为空', trigger:'blur'}
        ],
        c_address:[
          {required:true, message:'地址不能为空', trigger:'blur'}
        ],
        c_Importance_level:[
          {required:true, message:'重要程度不能为空', trigger:'change'}
        ],
      }
      
      /*  tableData: [{
          c_code: '2020',
          c_name: '王小虎',
          c_address: '上海市普陀区金沙江路 1518 弄',
          c_scale:'大客户',
          c_Importance_level:'重要'
        }, {
          c_code: '2020',
          c_name: '王小虎',
          c_address: '上海市普陀区金沙江路 1518 弄',
          c_scale:'大客户',
          c_Importance_level:'重要'
        }, {
          c_code: '2020',
          c_name: '王小虎',
          c_address: '上海市普陀区金沙江路 1518 弄',
          c_scale:'大客户',
          c_Importance_level:'重要'
        }, {
          c_code: '2020',
          c_name: '王小虎',
          c_address: '上海市普陀区金沙江路 1518 弄',
          c_scale:'大客户',
          c_Importance_level:'重要'
        },] */
    };
  },
  methods: {
    refreshData() {
      this.z_get("api/customer", { condition: this.condition })
        .then(res => {
          // this.deptDataFilter = res.dept_id;
          this.tableData = res.data;
        })
        .catch(res => {});
    },


  addNewCust() {
          this.custFormVisible = true;
          this.addCustText = "新增客户";
      
      
    },
    //重置表单
    refreshForm() {
      this.$refs.custForm.resetFields();
    },

    search() {
      this.condition = "";
      this.refreshData();
    },

    //编辑数据
    editCustShow(row) {
      this.custModel = JSON.parse(JSON.stringify(row));
      this.addCustText = "编辑客户信息";
      this.addOrNot = false;
      this.custFormVisible = true;
    },

    //删除一个
    deleteOne(row) {
      this.z_delete("api/customer", { data: row })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("操作失败:" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "warning"
              });
              console.log(res);
            });
    },

    // onDeleteClick(list) {
    //   this.$confirm("是否删除？删除后无法恢复！", "提示", {
    //     confirmButtonText: "是",
    //     cancelButtonText: "否",
    //     type: "warning"
    //   })
    //     .then(() => {
    //      // var realSelect = this.arrayChildrenFlatten(list, []); //搜索对应节点的分支（从子节点至叶子节点的所有节点）
    //       this.z_delete("api/customer", { data: list })
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

    onSaveTaskClick(){
      this.$refs.custForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/customer", this.custModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.custFormVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.z_put("api/customer", this.custModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.custFormVisible = false;
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
    

     
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.custTypePanel {
  text-align: center;
  position: absolute;
  width: 220px;
  top: 85px;
  left: 3px;
  bottom: 0px;
  
  padding: 2px;
  background-color: #ffffff;
}

.custFormPanel {
  position: absolute;
  top: 80px;
  left: 230px;
  right: 0px;
}
.tbar {
  margin: 10px;
}</style
>>
