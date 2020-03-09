<template>
  <div style="item-items">
    <div class="containALL">
      <div class="topLayout">

        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入物料名称" v-model="condition" clearable
            style="width:250px;">
            <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewItemShow">新增
          </el-button>
          <el-button type="primary" size="small">导入
          </el-button>
          <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">删除选中节点({{selection.length}})
          </el-button>
        </div>
        <div class="gridTable">
          <el-table ref="itemTable" style="width: 100%;" height="600px" :data="itemData" tooltip-effect="dark"
            highlight-current-row row-key="item_no" default-expand-all @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="item_no" label="物料编码" width="120" align="center"></el-table-column>
            <el-table-column prop="item_name" label="物料名称" align="center" width="120"></el-table-column>
            <el-table-column prop="item_unit" label="单位" align="center" width="120"></el-table-column>
            <el-table-column prop="auxiliary_unit" label="辅助单位" align="center" width="120"></el-table-column>
            <el-table-column prop="item_specification" label="规格" align="center" width="120"></el-table-column>
            <el-table-column prop="item_brand" label="品牌" align="center" width="120"></el-table-column>
            <el-table-column prop="item_weight" label="重量" align="center" width="100"></el-table-column>
            <el-table-column fixed="right" label="操作" width="140" prop="handle" align="center">
              <template slot-scope="scope">
                <el-button type="info" icon="el-icon-more" size="mini" circle @click="editTaskShow(scope.row)">
                </el-button>
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>

      <!-- 新增物料 -->
      <el-dialog v-dialogDrag width="450px" :title="addItemText" :close-on-click-modal="false"
        :visible.sync="addItemVisiable" @closed="refreshForm">
        <zj-form size="small" :newDataFlag='addItemVisiable' :model="itemModel" label-width="100px" ref="itemForm"
          :rules="add_rules">
          <el-form-item label="物料名称" prop="item_name">
            <el-input class="formItem" v-model="itemModel.item_name" placeholder="请填写任务名称">
            </el-input>
          </el-form-item>

          <el-form-item label="单位" prop="item_unit">
            <el-input class="formItem" v-model="itemModel.item_unit" placeholder="请填写单位">
            </el-input>
          </el-form-item>
          <el-form-item label="辅助单位" prop="auxiliary_unit">
            <el-input class="formItem" v-model="itemModel.auxiliary_unit" placeholder="请填写辅助单位">
            </el-input>
          </el-form-item>
          <el-form-item label="规格" prop="item_specification">
            <el-input class="formItem" v-model="itemModel.item_specification" placeholder="请填写规格">
            </el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="item_brand">
            <el-input class="formItem" v-model="itemModel.item_brand" placeholder="请填写品牌">
            </el-input>
          </el-form-item>
          <el-form-item label="重量" prop="item_weight">
            <el-input class="formItem" v-model="itemModel.item_weight" placeholder="请填写重量">
            </el-input>
          </el-form-item>

          <el-form-item style="text-align:center;margin-right:100px;">
            <el-button size="medium" @click="addItemVisiable = false">取&nbsp;&nbsp;消</el-button>
            <el-button type="primary" size="medium" @click="onSaveTaskClick" style="margin-left:30px;">
              保&nbsp;&nbsp;存
            </el-button>
          </el-form-item>
        </zj-form>
      </el-dialog>
    </div>

  </div>
</template>
    

    <script>
export default {
  name: "item",
  data() {
    return {
      limit: 10,
      currentPage: 1,
      total: 0,
      condition: "",
      

      itemCondition: "",
      itemListCondition: "",
      dataCondition: "",
      itemData: [], //物料数据
      
      itemModel: {},
      

      itemDataFilter: [],

      selection: [], //选中行数据

      addItemVisiable: false,
      
      addOrNot: true, //是否新增
      
      addItemText: "",
      addTaskItemText: "",
      
      activeName: "first",

      add_rules: {
        item_name: [
          { required: true, message: "请填写物料名称", trigger: "blur" }
        ],
        item_brand: [
          { required: true, message: "请填写物料品牌", trigger: "blur" }
        ]
      }
    };
  },

  watch: {
    addItemVisiable(val) {
      if (val) {
        this.selectitem();
      }
    }
  },
  methods: {
    //刷新物料信息
    refreshData() {
      this.itemData = [];
      this.z_get("api/item", { condition: this.condition })
        .then(res => {
          this.itemData = res.data;
        })
        .catch(res => {});
    },

    //重置表单

    search() {
      this.condition = "";
      this.refreshData();
    },

    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },

    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.taskData;
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

    //显示任务dialog
    addNewItemShow() {
      this.addItemText = "新增物料";
      this.itemModel = {
        item_no: "",
        item_name: "",
        item_unit: "",
        auxiliary_unit: "",
        item_specification: "",
        item_brand: "",
        item_weight: ""
      };
      this.addOrNot = true;
      this.addItemVisiable = true;
    },

    //保存新增/编辑任务
    onSaveTaskClick() {
      this.$refs.itemForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/item", this.itemModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addItemVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.itemModel.UpdateColumns = this.$refs.itemForm.UpdateColumns;
            if (this.itemModel.UpdateColumns) {
              this.z_put("api/item", this.itemModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addItemVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addItemVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示编辑任务
    editTaskShow(row) {
      this.itemModel = JSON.parse(JSON.stringify(row));
      this.itemModelCompare = JSON.parse(JSON.stringify(row));
      //this.itemModel.item_name = this.filteritemName(this.itemModel.item_id);
      // if (this.$refs.tree) {
      //   this.$refs.tree.setCurrentKey(this.itemModel.item_id); //赋值选中节点，不能用current-node-key，那样选中节点就不会变
      // }
      this.addItemText = "编辑物料";
      this.addOrNot = false;
      this.addItemVisiable = true;
    },

    //筛选物料名称
    filterITName(id) {
      var name = id;
      var item = this.itemDataFilter.filter(item => item.value == id);
      if (item.length) {
        name = item[0].display;
      }
      return name;
    },

   

    //删除一个任务
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除任务树
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    //确认删除任务
    onDeleteClick(list) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/item/list", { data: list })
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
  
    
  },
  mounted() {
    this.refreshData();
    this.selectitem();
  }
};
</script>


<style scoped>
.item-items {
  width: 1100px;
}

/* .containAll {
  width: 1100px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);

  box-sizing: border-box;
  background-color: #eeeeee;
} */

.tbar {
  margin-bottom: 10px;
  padding-left: 10px;
}
.formItem {
  width: 300px;
}

.item-aside {
  background: rgb(255, 255, 255);

  position: relative;
  top: 0px;
  left: 0px;
  bottom: 0px;
  height: 795px;
  /* padding: 10px 5px 20px 5px; */
  padding: 0px;
  align-self: auto;
}

.item-main {
  background: rgb(255, 255, 255);
  position: relative;

  padding: 0px 10px;
  border-left: 10px solid #eee;
  margin-left: 10px;

  height: 1000px;
  align-self: auto;
}
</style>





