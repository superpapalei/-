<template>
  <div class="codeTable" style="width:1100px">
    <div>
    <table style="height:100%;width:100%">
      <td style="width:40%">
        <div>
          <el-card>
            <div slot="header">
              <span>编码分类</span>
            </div>
            <div>
              <div>
                <el-input size="small" @keyup.enter.native="refreshCodeType"  v-model="condition" clearable placeholder="请输入编码" style="width:300px">
                  <el-button size="small" @click="refreshCodeType" slot="append" icon="el-icon-search">搜索</el-button>
                </el-input>
                <el-button size="small" style="margin-left:20px" @click="addNewTypeShow">新增</el-button>
              </div>
              <hr>
              <el-table ref="singleTable" :data="codeTypeData" highlight-current-row row-key="cc_id" @row-click="handleRowClick"
                style="width: 100%" size="small">
                <el-table-column label="序号" type="index" width="50" align="center">
                </el-table-column>
                <el-table-column property="cc_code" label="编码" align="center" width="60">
                </el-table-column>
                <el-table-column property="ct_note" label="技能等级数字" width="120" align="center">
                </el-table-column>
                <el-table-column property="cc_note" label="说明" align="center" >
                </el-table-column>
                <!-- <el-table-column property="update_date" label="更新日期" align="center" width="90">
                  <template slot-scope="scope1">
                    {{ scope1.row.update_date | datatrans }}
                  </template>
                </el-table-column>
                <el-table-column property="update_user" label="更新人员" align="center" width="80">
                </el-table-column>
                <el-table-column property="create_date" label="创建日期" align="center" width="90">
                  <template slot-scope="scope2">
                    {{ scope2.row.create_date | datatrans }}
                  </template>
                </el-table-column>
                <el-table-column property="create_user" label="创建人员" align="center" width="80">
                </el-table-column> -->
                <el-table-column label="操作"  prop="handle" align="center" width="100">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTypeShow(scope.row)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
      </td>
      <td>
        <div>
          <el-card>
            <div slot="header">
              <span>分类明细</span>
            </div>
            <div >
              <div>
                <el-input size="small" placeholder="请输入内容" style="width:300px" @keyup.enter.native="refreshCodeData" v-model="codeCondition">
                  <el-button size="small" slot="append" icon="el-icon-search" @click="refreshCodeData">搜索</el-button>
                </el-input>
                <el-button size="small" style="margin-left:20px" @click="addNewCodeShow">新增</el-button>
                <el-button size="small" style="margin-left:20px">导入</el-button>
              </div>
              <hr>
              <div v-if="rightDataShow">
              <el-table ref="singleTable" :data="codeData" highlight-current-row
                style="width: 100%" size = "small">
                <el-table-column label="序号" type="index" width="50" align="center">
                </el-table-column>
                <el-table-column property="cod_cc_id" label="编码ID" align="center" width="100">
                </el-table-column>
                <el-table-column property="cc_code" label="编码" align="center" width="100">
                </el-table-column>
                <el-table-column property="cc_name" label="编码名称"  align="center" width="100">
                </el-table-column>
                <el-table-column property="cc_note" label="编码说明" align="center" >
                </el-table-column>
                <!-- <el-table-column property="c_id" label="公司编号" align="center" width="80">
                </el-table-column>
                <el-table-column property="update_date" label="更新日期" align="center" width="90">
                  <template slot-scope="scope1">
                    {{ scope1.row.update_date | datatrans }}
                  </template>
                </el-table-column>
                <el-table-column property="update_user" label="更新人员" align="center" width="80">
                </el-table-column>
                <el-table-column property="create_date" label="创建日期" align="center" width="90">
                  <template slot-scope="scope2">
                    {{ scope2.row.create_date | datatrans }}
                  </template>
                </el-table-column>
                <el-table-column property="create_user" label="创建人员" align="center" width="80">
                </el-table-column> -->
                <el-table-column label="操作" width="100" prop="handle" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editCodeShow(scope.row)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOneCode(scope.row)">
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              </div>
            </div>
          </el-card>
        </div>
      </td>
    </table>
    </div>
    <!-- 新增/修改编码分类表单 -->
    <el-dialog v-dialogDrag width="450px"  :close-on-click-modal="false" :title="typeTitle"
      :visible.sync="addTypeVisiable" @closed="refreshForm">
      <zj-form size="small" :newDataFlag='addTypeVisiable' :model="typeModel" label-width="100px" ref="taskForm"
        >
        <el-form-item label="编码code" prop="cc_code">
          <el-input class="formItem" v-model="typeModel.cc_code" placeholder="请填写编码">
          </el-input>
        </el-form-item>
        <el-form-item label="技能等级数字" prop="ct_note">
          <el-input class="formItem" v-model="typeModel.ct_note" placeholder="请填写技能等级数字">
          </el-input>
        </el-form-item>
        <el-form-item label="编码说明" prop="cc_note">
          <el-input class="formItem" v-model="typeModel.cc_note" placeholder="请填写编码说明">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTypeVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTypeClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
    <!-- 新增/修改编码明细表单 -->
    <el-dialog v-dialogDrag width="450px"  :close-on-click-modal="false" :title="typeTitle"
      :visible.sync="addCodeDetailVisible" @closed="refreshForm">
      <zj-form size="small" :newDataFlag='addCodeDetailVisible' :model="codeModel" label-width="100px" ref="taskForm"
        >
        <el-form-item label="编码code" prop="cc_code">
          <el-input class="formItem" v-model="codeModel.cc_code" placeholder="请填写编码">
          </el-input>
        </el-form-item>
        <el-form-item label="编码名称" prop="cc_name">
          <el-input class="formItem" v-model="codeModel.cc_name" placeholder="请填写编码">
          </el-input>
        </el-form-item>
        <el-form-item label="编码说明" prop="cc_note">
          <el-input class="formItem" v-model="codeModel.cc_note" placeholder="请填写编码说明">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addCodeDetailVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveCodeClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

  </div>
</template>
<script>

export default {
  name: "codeType",
  data() {
    return {
      codeTypeData: [],//编码分类
      codeData:[],//编码明细
      condition: "",
      codeCondition:"",
      currentRow: {},
      typeModel: {},
      codeModel:{},
      typeTitle:"",//编码类型标题
      rightDataShow:false,//右边显示数据
      addTypeVisiable:false,//类型新增显示
      addCodeDetailVisible:false,//明细新增显示
      addOrNot:true,
      loading:false,
      
    };
  },
  filters:{
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
  },
  methods:{
    //查询编码表
    refreshCodeType(){
      this.codeTypeData = [];
      this.currentRow = {};
      this.rightDataShow = false;
      this.refreshRight();
      this.z_get("api/code_type", { condition: this.condition })
        .then(res => {
          this.codeTypeData = res.data;
        })
        .catch(res => {});

    },
    //点击任务行显示右边编码详情
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        //点击加载编码详细数据
        this.refreshRight();
        this.refreshCodeData();
      }
      this.rightDataShow = true;
    },
    //刷新编码分类明细
    refreshCodeData() {
      this.loading = true;
      this.codeData = [];
      this.z_get(
        "api/common_code",
        { cc_id: this.currentRow.cc_id, condition: this.codeCondition },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.codeData = res.data;
        })
        .catch(res => {});
    },
    refreshRight() {
      this.Condition = "";
      this.codeCondition = "";
    },
    //显示新增编码dialog
    addNewTypeShow() {
      var titleName = "";
      var st_pid = null;
      this.typeModel = {
        cc_id:0,
        cc_code: "",
        ct_note: "",
        cc_note: "",
        c_id: 0,
        update_date: "",
        update_user: null,
        create_date: "",
        create_user:0
      };
      this.typeTitle = "新增"
      this.addOrNot = true;
      this.addTypeVisiable = true;
    },
    //显示编辑编码类型
    editTypeShow(row) {
      this.typeModel = JSON.parse(JSON.stringify(row));
      // this.taskModelCompare = JSON.parse(JSON.stringify(row));
      // this.taskModel.dept_name = this.filterDeptName(this.taskModel.dept_id);
      // if (this.$refs.tree) {
      //   this.$refs.tree.setCurrentKey(this.taskModel.dept_id); //赋值选中节点，不能用current-node-key，那样选中节点就不会变
      // }
      this.typeTitle = "编辑";
      this.addOrNot = false;
      this.addTypeVisiable = true;
    },
    //显示编辑编码类型
    editCodeShow(row) {
      this.codeModel = JSON.parse(JSON.stringify(row));
      // this.taskModelCompare = JSON.parse(JSON.stringify(row));
      // this.taskModel.dept_name = this.filterDeptName(this.taskModel.dept_id);
      // if (this.$refs.tree) {
      //   this.$refs.tree.setCurrentKey(this.taskModel.dept_id); //赋值选中节点，不能用current-node-key，那样选中节点就不会变
      // }
      this.typeTitle = "编辑";
      this.addOrNot = false;
      this.addCodeDetailVisible = true;
    },
    //删除一个编码类型
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除一个编码明细
    deleteOneCode(row){
      var list = [];
      list.push(row);
      this.onDeleteClickCode(list);
    },
    //确认删除编码类型
    onDeleteClick(list) {
      this.$confirm("是否删除？节点下的子节点将一并删除！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/code_type/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshCodeType();
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
    //确认删除编码明细
    onDeleteClickCode(list) {
      this.$confirm("是否删除该编码明细？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/common_code/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshCodeData();
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
    //保存新增/编辑类型
    onSaveTypeClick() {
      console.log(this.typeModel);
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.typeModel.c_id = 22;
            var date = new Date();      
            this.typeModel.create_date= date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            this.typeModel.create_user = 123
            this.z_post("api/code_type", this.typeModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshCodeType();
                this.addTypeVisiable = false;
              })
               .catch(res => {
                  this.$alert("新增失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
              
          } else {
            this.typeModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            if (this.typeModel.UpdateColumns) {
              var date1 = new Date();      
              var data2 = {
                UpdateColumns:this.$refs.taskForm.UpdateColumns,
                cc_id:this.typeModel.cc_id,
                cc_code: this.typeModel.cc_code,
                ct_note: this.typeModel.ct_note,
                cc_note: this.typeModel.cc_note,
                c_id: this.typeModel.c_id,
                update_date: date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate(),
                update_user: 123,
                create_date: this.$options.filters.datatrans(this.typeModel.create_date),
                create_user: this.typeModel.create_user
              }
              this.z_put("api/code_type", data2)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshCodeType();
                  this.addTypeVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addTypeVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示新增编码明细
    addNewCodeShow() {
      this.codeModel = {
        cc_id:0,
        cod_cc_id:"",
        cc_code: "",
        cc_name:"",
        cc_note: "",
        c_id: 0,
        update_date: "",
        update_user: null,
        create_date: "",
        create_user:0
      };
      this.typeTitle = "新增"
      //this.codeModelList = [];
      //this.searchItemList();
      this.addOrNot = true;
      this.addCodeDetailVisible = true;
    },
    //保存新增/编辑编码明细
    onSaveCodeClick() {
      console.log(this.codeModel);
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.codeModel.cod_cc_id = this.currentRow.cc_id
            this.codeModel.c_id = 22;
            var date = new Date();      
            this.codeModel.create_date= date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            this.codeModel.create_user = 123
            this.z_post("api/common_code", this.codeModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshCodeData();
                this.addCodeDetailVisible = false;
              })
               .catch(res => {
                  this.$alert("新增失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
              
          } else {
            this.codeModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            if (this.codeModel.UpdateColumns) {
              var date1 = new Date();      
              var data2 = {
                UpdateColumns:this.$refs.taskForm.UpdateColumns,
                cc_id:this.codeModel.cc_id,
                cod_cc_id : this.currentRow.cc_id,
                cc_code:this.codeModel.cc_code,
                cc_name:this.codeModel.cc_name,
                cc_note: this.codeModel.cc_note,
                c_id: this.codeModel.c_id,
                update_date: date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate(),
                update_user: 123,
                create_date: this.$options.filters.datatrans(this.codeModel.create_date),
                create_user: this.codeModel.create_user
              }
              this.z_put("api/common_code", data2)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshCodeData();
                  this.addCodeDetailVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addCodeDetailVisible = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    searchCode() {
      this.itemCondition = "";
      this.refreshCodeData();
    },
    //重置表单
    refreshForm() {
      this.$refs.taskForm.resetFields();
    },
  },
  mounted() {
    this.refreshCodeType();
  }

};
</script>
