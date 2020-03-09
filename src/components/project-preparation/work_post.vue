<template>
  <div class="work_post">
    <div class="topLayout">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
        <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入岗位名称" v-model="condition" clearable
          style="width:250px;">
          <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewWorkPost()">新增岗位</el-button>
        <!-- <el-button type="danger" :disabled="selection.length==0" @click="deleteList">删除选中岗位({{selection.length}}) -->
        <!-- </el-button> -->
      </div>
      <div class="gridTable">
        <el-table ref="tgtTable" style="width: 100%;" height="450px" :data="wpData" tooltip-effect="dark"
          highlight-current-row row-key="wp_id" default-expand-all @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" @row-click="handleRowClick">
          <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->          
          <el-table-column prop="wp_id" label="序号" align="left" width="130" sortable></el-table-column>
          <el-table-column prop="wp_name" label="岗位名称" align="left" width="190" sortable></el-table-column>
          <el-table-column prop="wp_type" label="岗位类型" align="left" width="190" sortable>
            <template slot-scope="scope">{{scope.row.wp_type | stTypeTrans}}</template>
          </el-table-column>
          <el-table-column prop="wp_note" label="岗位说明" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="160" prop="handle">
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
    <el-dialog v-if="addwpVisiable" v-dialogDrag width="450px" :title="addwpText" :close-on-click-modal="false"
      :visible.sync="addwpVisiable">
      <zj-form :model="workPostModel" label-width="100px" ref="workPostForm" :rules="add_rules" size="small"
        :newDataFlag='addwpVisiable'>
        <el-form-item label="岗位名称" prop="wp_name">
          <el-input class="formItem" v-model="workPostModel.wp_name" placeholder="请填写岗位名称">
          </el-input>
        </el-form-item>
        <el-form-item label="岗位类型" prop="wp_type">
          <el-select v-model="workPostModel.wp_type" filterable placeholder="请选择岗位类型">
            <el-option v-for="item in stType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>    
        </el-form-item>
        <el-form-item label="岗位说明" prop="wp_note">
          <el-input class="formItem" type="textarea" :rows="2" v-model="workPostModel.wp_note" placeholder="说明信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button @click="addwpVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" @click="onSaveWorkPostClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "work_post",
  data() {
    return {
      condition: "",
      wpData: [], //表格数据
      selection: [],
      addwpVisiable: false,
      workPostModel: {},
      addOrNot: true, //是否新增
      addwpText: "",
      stType_options: [
        {
          value: "function",
          label: "职能"
        },
        {
          value: "project",
          label: "项目"
        },
        {
          value: "temporary",
          label: "临时"
        }
      ],
      add_rules: {
        wp_name: [{ required: true, message: "请填写岗位名称", trigger: "blur" }],     
        wp_type: [{ required: true, message: "请选择岗位类型", trigger: "change" }]       
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
    stTypeTrans(value) {
      switch (value) {
        case "function":
          return "职能";
          break;
        case "project":
          return "项目";
          break;
        case "temporary":
          return "临时";
          break;
        default:
          return "临时";
          break;
      }
    }
  },
  watch: {
    addwpVisiable(val) {
      if (val) {
        this.selectDept();
      }
    }
  },
  methods: {
 refreshData() {
      this.z_get("api/work_post", { condition: this.condition })
        .then(res => {
          this.wpData = res.data;
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
      this.addwpText = "新增岗位";
      this.workPostModel = {
        wp_id: 0,
        wp_name: "",
        wp_note: "",
        wp_type: ""
      };
      this.addOrNot = true;
      this.addwpVisiable = true;
    },

    onSaveWorkPostClick() {
      this.$refs.workPostForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/work_post", this.workPostModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addwpVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.z_put("api/work_post", this.workPostModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addwpVisiable = false;
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
      this.workPostModel = JSON.parse(JSON.stringify(row));
      this.addwpText = "编辑岗位";
      this.addOrNot = false;
      this.addwpVisiable = true;
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
          this.z_delete("api/work_post/list", { data: realSelect })
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

    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.tgtTable.toggleRowSelection(row);
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.work_post {
  width: 1100px;
}

.formItem {
  width: 300px;
}
</style>