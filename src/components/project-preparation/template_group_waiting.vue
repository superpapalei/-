<template>
  <div class="template_group_waiting">
    <el-container  style="height: 600px;">
      <el-aside class="tgaside" width="220px" style="padding-right:10px;">
       <el-card style="height:100%;box-sizing:border-box;" shadow="never">
        <div slot="header">
          <el-row>
          <span>模板分类</span>
          <el-button icon="el-icon-refresh"  title="刷新" size="mini" circle 
            @click="refreshTGTData"></el-button>
          <el-button type="primary" size="mini" icon="el-icon-folder-add" circle @click="addNewTemplateTypeGroup()"></el-button>
          <el-button type="danger" disabled size="mini" icon="el-icon-delete" circle @click="deleteOne(scope.row)"></el-button>
          </el-row>
        </div>
        <el-menu>
          <el-menu-item el-icon-link @click="refreshData()"><img style="width:16px;" src="../../assets/img/tag.png" />全部分类</el-menu-item>
          <template v-for="(item, key) in tgtData">
            <el-menu-item :key="key" :index="item.tgt_id" @click="refreshTemGData(item.tgt_id)">
              <template slot="title">
                <img style="width:16px;" src="../../assets/img/tag.png" />
                <span>{{ item.tgt_name }}</span>
              </template>
            </el-menu-item>
            <!-- <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>导航一</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
       -->
          </template>
        </el-menu>
       </el-card>
      </el-aside>
      <el-container >
        <el-header class="tgheader" style="text-align: left; font-size: 12px">
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
            <el-input @keyup.enter.native="refreshData" placeholder="请输入组织模板名称" v-model="condition" clearable
              style="width:300px;">
              <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
            <el-button type="primary" style="margin-left:10px;" @click="addNewTemplateGroup()">新增组织结构模板</el-button>
            <el-button type="primary" style="margin-left:10px;" @click="addNewTemplateGroup()">导入模板</el-button>
            <!-- <el-button type="danger" :disabled="selection.length==0" @click="deleteList">删除选中组织结构模板({{selection.length}})
        </el-button> -->
          </div>
        </el-header>
        <el-main style="border-left:10px solid #eee;padding:0 0 0 10px;">
          <div>
            <el-table ref="tgTable" v-loading="loading" style="width:100%;" height="540"  :data="tgData" tooltip-effect="dark"
              highlight-current-row row-key="tg_id" default-expand-all @selection-change="handleSelectionChange"
              @select-all="handleSelectAll" @row-click="handleRowClick">
              <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
              <el-table-column prop="tg_name" label="组织节点名称" align="center" width="180"></el-table-column>
              <el-table-column prop="tg_node_type" label="节点类型" align="center" width="180">
                <template slot-scope="scope">{{scope.row.tg_node_type | stTypeTrans}}</template>
              </el-table-column>
              <el-table-column prop="wp_id" label="岗位编号" align="center" width="200"></el-table-column>
              <!-- <el-table-column prop="wp_name" label="岗位名称" align="center" width="150"></el-table-column> -->
              <!-- <el-table-column prop="tgt_id" label="模板类型编号" align="center" width="120"></el-table-column>
              <el-table-column prop="tgt_name" label="模板类型名称" align="center" width="150"></el-table-column>
              <el-table-column prop="tgt_note" label="模板类型说明" align="center" width="150"></el-table-column> -->
              <el-table-column label="操作"  prop="handle">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTemplateShow(scope.row)">
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 新增/修改任务表单 -->
        </el-main>
        <el-dialog width="500px" :title="addgpText" :close-on-click-modal="false" :visible.sync="addgpVisiable"
          top="5vh" @closed="refreshForm">
          <zj-form size="small" :newDataFlag='addItemVisiable' :model="templateModel" label-width="100px"
            ref="templateForm">

            <el-form-item label="组织模板编号">
              <el-input class="formItem" v-model="templateModel.tg_id" placeholder="系统自动生成" disabled>
              </el-input>
            </el-form-item>
            <el-form-item label="模板类型编号">
              <el-input class="formItem" width="330px" v-model="templateModel.tgt_id"
                placeholder="请填写已有的模板类型编号（否则会添加失败）">
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
            <el-form-item label="组织模板名称">
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

          </zj-form>
        </el-dialog>
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
              <el-input class="formItem" type="textarea" :rows="2" v-model="templateGroupTypeModel.tgt_note"
                placeholder="模板类型说明">
              </el-input>
            </el-form-item>

            <el-form-item style="text-align:center;margin-right:100px;">
              <el-button @click="addgptVisiable = false">取&nbsp;&nbsp;消</el-button>
              <el-button type="primary" @click="onSavePostClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-container>
 
    </el-container>
  </div>
</template>


<script>
export default {
  name: "template_group",
  data() {
    return {
      condition: "",
      tgData: [], //表格数据
      addgpVisiable: false,
      templateModel: {},
      addOrNot: true, //是否新增
      addgpText: "",
      templateModel: [],
      selection: [], //选中行数据
      activeName: "first",
      tgtData: [], //表格数据
      addgptVisiable: false,
      templateGroupTypeModel: {},
      addgptText: ""
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
    stTypeTrans(value) {
      switch (value) {
        case "1":
          return "人";
          break;
        case "2":
          return "组织";
          break;
        default:
          return "人";
          break;
      }
    }
  },
  watch: {
    addgpVisiable(val) {
      if (val) {
        this.selectDept();
      }
    },
    addgptVisiable(val) {
      if (val) {
        this.selectDept();
      }
    }
  },
  methods: {
    refreshData() {
      //this.z_get("api/template_group/treeList", { condition: this.condition }) 等数据库更新
      this.z_get("api/template_group", { condition: this.condition })
        .then(res => {
          //this.deptDataFilter = res.dict.dept_id;
          this.tgData = res.data;
          //refreshTGTData();
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.tgForm.resetFields();
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    //显示任务dialog
    addNewTemplateGroup() {
      this.addgpText = "新增组织结构模板";
      this.templateModel = {
        tg_id: 0,
        tgt_id: "",
        tem_tg_id: "",
        wp_id: "",
        tg_name: "",
        tg_node_type: ""
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
          this.z_delete("api/template_group/list", { data: realSelect })
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
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.tgTable.toggleRowSelection(row);
    },
    //模板类型方法
    refreshTGTData() {
      this.z_get("api/template_group_type", { condition: this.condition })
        .then(res => {
          //this.deptDataFilter = res.dict.dept_id;
          this.tgtData = res.data;
        })
        .catch(res => {});
    },
    refreshTemGData(index) {
      this.z_get("api/template_group", { condition: index })
        .then(res => {
          this.tgData = res.data;
        })
        .catch(res => {});
    },
    addNewTemplateTypeGroup() {
      this.addgptText = "新增模板类型";
      this.templateGroupTypeModel = {
        tgt_id: 0,
        tgt_name: "",
        tgt_note: ""
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
    }
  },
  mounted() {
    this.refreshData();
    this.refreshTGTData();
  }
};
</script>

<style scoped>
.template_group_waiting {
  width: 1100px;
}

.tgheader {
  line-height: 60px;
}
.tgaside {
  width: 80px;
}
.tbar {
  margin-bottom: 10px;
}
</style>