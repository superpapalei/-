<template>
  <div class="standard-task">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入任务名称" v-model="condition" clearable
            style="width:250px;">
            <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskShow('root')">新增根节点
          </el-button>
          <el-button type="primary" size="small" :disabled="!currentRow.st_id" @click="addNewTaskShow('children')">
            新增子节点
          </el-button>
          <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
            删除选中节点({{selection.length}})
          </el-button>
          <el-dropdown style="margin-left:10px;">
            <el-button size="small">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="expandAll">展开所有节点</el-dropdown-item>
              <el-dropdown-item @click.native="collapseAll" divided>折叠所有节点</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="gridTable">
          <el-table ref="taskTable" style="width: 100%;" height="250px" :data="taskData" tooltip-effect="dark"
            highlight-current-row row-key="st_id" default-expand-all @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- <el-table-column prop="st_id" label="任务编号" align="center" width="150"></el-table-column> -->
            <el-table-column prop="st_name" label="任务名称" align="center" width="180"></el-table-column>
            <el-table-column prop="dept_id" label="部门" align="center" width="180">
              <template slot-scope="scope">{{scope.row.dept_id | renderFilter(deptDataFilter)}}</template>
            </el-table-column>
            <el-table-column prop="st_period" label="工期(天)" align="center" width="100"></el-table-column>
            <el-table-column prop="st_type" label="类别" align="center" width="100">
              <template slot-scope="scope">{{scope.row.st_type | stTypeTrans}}</template>
            </el-table-column>
            <el-table-column prop="st_note" label="说明" align="center"></el-table-column>
            <el-table-column label="操作" width="140" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottomLayout" style="min-height:300px;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="物料需求" name="first">
            <div v-if="bottomDataShow">
              <div class="tbar">
                <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchItem"></el-button>
                <el-input size="small" @keyup.enter.native="refreshItemData" placeholder="请输入物料名称"
                  v-model="itemCondition" clearable style="width:250px;">
                  <el-button size="small" @click="refreshItemData" slot="append" icon="el-icon-search">搜索</el-button>
                </el-input>
                <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskItemShow">新增物料需求
                </el-button>
                <el-button type="danger" size="small" :disabled="itemSelection.length==0" @click="deleteListItem">
                  删除选中物料({{itemSelection.length}})
                </el-button>
              </div>
              <div class="gridTable">
                <el-table ref="taskItemTable" v-loading="loading" style="width:100%;" height="250" :data="taskItemData"
                  tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange2">
                  <el-table-column type="selection" width="55" align="center"></el-table-column>
                  <el-table-column type="index" width="40" align="center">
                  </el-table-column>
                  <el-table-column prop="item_name" label="物料名称" align="center" width="200"></el-table-column>
                  <el-table-column prop="item_no" label="物料编码" align="center" width="130"></el-table-column>
                  <el-table-column prop="sti_quantity" label="数量" align="center" width="90"></el-table-column>
                  <el-table-column prop="item_unit" label="单位" align="center" width="100"></el-table-column>
                  <el-table-column prop="sti_note" label="任务备注" align="center"></el-table-column>
                  <el-table-column label="操作" width="140" prop="handle">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editItemShow(scope.row)">
                      </el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" circle
                        @click="deleteOneItem(scope.row)">
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="资料需求" name="second">
            <div v-if="bottomDataShow">
              <div class="tbar">
                <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchData"></el-button>
                <el-input size="small" @keyup.enter.native="refreshDataData" placeholder="请输入物料名称"
                  v-model="dataCondition" clearable style="width:250px;">
                  <el-button size="small" @click="refreshDataData" slot="append" icon="el-icon-search">搜索</el-button>
                </el-input>
                <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskDataShow">新增资料需求
                </el-button>
                <el-button type="danger" size="small" :disabled="dataSelection.length==0" @click="deleteListData">
                  删除选中资料({{dataSelection.length}})
                </el-button>
              </div>
              <div class="gridTable">
                <el-table ref="taskItemTable" v-loading="loading3" style="width:100%;" height="250" :data="taskDataData"
                  tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange3">
                  <el-table-column type="selection" width="55" align="center"></el-table-column>
                  <el-table-column type="index" width="40" align="center">
                  </el-table-column>
                  <el-table-column prop="std_name" label="资料名称" align="center" width="200"></el-table-column>
                  <el-table-column prop="ddt_id" label="资料类型" align="center" width="130">
                    <template slot-scope="scope">{{scope.row.ddt_id | renderFilter(dataTypeFilter)}}</template>
                  </el-table-column>
                  <el-table-column prop="std_quantity" label="数量(份)" align="center" width="90"></el-table-column>
                  <el-table-column prop="std_note" label="资料说明" align="center"></el-table-column>
                  <el-table-column label="操作" width="140" prop="handle">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" circle
                        @click="editTaskDataShow(scope.row)">
                      </el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" circle
                        @click="deleteOneData(scope.row)">
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 新增/修改任务表单 -->
    <el-dialog v-if="addTaskVisiable" v-dialogDrag width="450px" :title="addTaskText" :close-on-click-modal="false"
      :visible.sync="addTaskVisiable">
      <zj-form size="small" :newDataFlag='addTaskVisiable' :model="taskModel" label-width="100px" ref="taskForm"
        :rules="add_rules">
        <!-- <el-form-item label="任务编号">
          <el-input class="formItem" v-model="taskModel.st_id" placeholder="系统自动生成" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="上级任务编号">
          <el-input class="formItem" v-model="taskModel.st_pid" placeholder="无" disabled>
          </el-input>
        </el-form-item> -->
        <el-form-item label="所属部门" prop="dept_id">
          <el-select v-model="taskModel.dept_id" ref="select_dept" placeholder="请选择属部门">
            <el-option :label="taskModel.dept_name" :value="taskModel.dept_id" style="height:auto;padding:0;">
              <el-tree :data="deptData" node-key="dept_id" ref="tree" default-expand-all :expand-on-click-node="false"
                highlight-current :current-node-key="taskModel.dept_id">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                  @click="handleSelectTreeDblClick(data)">
                  {{data.dept_name}}</div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="st_name">
          <el-input class="formItem" v-model="taskModel.st_name" placeholder="请填写任务名称">
          </el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="taskModel.st_type" placeholder="请选择任务类型">
            <el-option v-for="item in stType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工期(天)" prop="st_period">
          <el-input class="formItem" v-model="taskModel.st_period" placeholder="请填写工期" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="taskModel.st_note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTaskVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

    <!-- 新增物料需求 -->
    <el-dialog :width=" taskItemModelList.length? '1000px':'550px'" title="新增物料需求" :close-on-click-modal="false"
      :visible.sync="addTaskItemVisible">
      <div class="transferDiv">
        <div class="leftTransferItem">
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchItemList"></el-button>
            <el-input size="small" @keyup.enter.native="refreshItemListData" placeholder="请输入物料编码/名称"
              v-model="itemListCondition" clearable style="width:250px;">
              <el-button size="small" @click="refreshItemListData" slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
          </div>
          <div>
            <span style="color:gray;font-size:12px;">*双击选择物料</span>
            <el-table ref="itemListTable" v-loading="loading2" style="width:100%;" height="300" :data="itemListData"
              tooltip-effect="dark" @row-dblclick="handleRowDbClcik" border stripe>
              <el-table-column prop="item_no" label="物料编码" align="center" width="130"></el-table-column>
              <el-table-column prop="item_name" label="物料名称" align="center" width="200"></el-table-column>
              <el-table-column prop="item_specification" label="描述" align="center"></el-table-column>
            </el-table>
            <div style="margin:0 25%;">
              <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="limit"
                layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div>
        </div>
        <div class="rightTransferItem" v-if="taskItemModelList.length">
          <fieldset class="oneItem" v-for="(item,index) in taskItemModelList" :key="index">
            <legend>物料{{index+1}} <el-button type="danger" icon="el-icon-delete" size="mini" circle
                @click="deleteSelectItem(index)"></el-button>
            </legend>
            <el-form size="small" :model="item" label-width="80px" ref="itemListForm" :rules="addItem_rules">
              <el-form-item label="物料编码" prop="item_na0">
                <el-input class="formItem2" v-model="item.item_no" placeholder="请选择物料" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="物料名称" prop="item_name">
                <el-input class="formItem2" v-model="item.item_name" placeholder="请选择物料" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="需求数量" prop="sti_quantity">
                <el-input class="formItem2" v-model="item.sti_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
                </el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input class="formItem2" v-model="item.sti_note" placeholder="备注信息">
                </el-input>
              </el-form-item>
            </el-form>
          </fieldset>
        </div>
        <div class="bottomButton" v-if="taskItemModelList.length">
          <el-button size="medium" @click="addTaskItemVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveItemListClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 选择/修改物料 -->
    <el-dialog v-if="selectItemVisible" v-dialogDrag width="450px" :title="addTaskItemText"
      :close-on-click-modal="false" :visible.sync="selectItemVisible">
      <zj-form size="small" :newDataFlag='selectItemVisible' :model="taskItemModel" label-width="100px"
        ref="taskItemForm" :rules="addItem_rules">
        <el-form-item label="需求数量" prop="sti_quantity">
          <el-input class="formItem" v-model="taskItemModel.sti_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="taskItemModel.sti_note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="selectItemVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskItemClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

    <!-- 新增/编辑资料需求 -->
    <el-dialog v-if="addTaskDataVisible" v-dialogDrag width="450px" :title="addTaskDataText"
      :close-on-click-modal="false" :visible.sync="addTaskDataVisible">
      <zj-form size="small" :newDataFlag='addTaskDataVisible' :model="taskDataModel" label-width="100px"
        ref="taskDataForm" :rules="addData_rules">
        <el-form-item label="资料名称" prop="std_name">
          <el-input class="formItem" v-model="taskDataModel.std_name" placeholder="请填写资料名称">
          </el-input>
        </el-form-item>
        <el-form-item label="资料类型" prop="ddt_id">
          <el-select v-model="taskDataModel.ddt_id" placeholder="请选择资料类型">
            <el-option v-for="item in dataTypeFilter" :key="item.value" :label="item.display" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求数量" prop="std_quantity">
          <el-input class="formItem" v-model="taskDataModel.std_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="taskDataModel.std_note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTaskDataVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskDataClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "standard-task",
  data() {
    return {
      limit: 10,
      currentPage: 1,
      total: 0,
      condition: "",
      itemCondition: "",
      itemListCondition: "",
      dataCondition: "",
      taskData: [], //表格数据
      taskItemData: [], //物料
      itemListData: [], //物料
      taskDataData: [], //资料
      dataTypeFilter: [],
      deptDataFilter: [], //部门渲染数据
      deptData: [], //部门数据
      selection: [], //选中行数据
      itemSelection: [],
      dataSelection: [],
      currentRow: {},
      addTaskVisiable: false,
      addTaskItemVisible: false,
      addTaskDataVisible: false,
      selectItemVisible: false,
      bottomDataShow: false,
      taskModel: {},
      taskItemModel: {},
      taskItemModelList: [],
      taskDataModel: {},
      addOrNot: true, //是否新增
      addTaskText: "",
      addTaskItemText: "",
      addTaskDataText: "",
      activeName: "first",
      loading: false,
      loading2: false,
      loading3: false,
      stType_options: [
        {
          value: "task",
          label: "任务"
        },
        {
          value: "work",
          label: "节点"
        }
      ],
      add_rules: {
        dept_id: [{ required: true, message: "请选择部门", trigger: "change" }],
        st_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        st_period: [{ required: true, message: "请填写工期", trigger: "blur" }]
      },
      addItem_rules: {
        item_name: [{ required: true, message: "请选择物料", trigger: "blur" }],
        sti_quantity: [
          { required: true, message: "请填写数量", trigger: "blur" }
        ]
      },
      addData_rules: {
        std_name: [
          { required: true, message: "请填写资料名称", trigger: "blur" }
        ],
        ddt_id: [
          { required: true, message: "请选择资料类型", trigger: "change" }
        ],
        std_quantity: [
          { required: true, message: "请填写数量", trigger: "blur" }
        ]
      }
    };
  },
  filters: {
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
  watch: {
    addTaskVisiable(val) {
      if (val) {
        this.selectDept();
      }
    }
  },
  methods: {
    //刷新任务树
    refreshData() {
      this.taskData = [];
      this.currentRow = {};
      this.bottomDataShow = false;
      this.refreshBottom();
      this.z_get("api/standard_task/treeList", { condition: this.condition })
        .then(res => {
          this.deptDataFilter = res.dict.dept_id;
          this.taskData = res.data;
        })
        .catch(res => {});
    },
    //刷新物料需求
    refreshItemData() {
      this.loading = true;
      this.taskItemData = [];
      this.z_get(
        "api/standard_task_item",
        { st_id: this.currentRow.st_id, condition: this.itemCondition },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.taskItemData = res.data;
        })
        .catch(res => {});
    },
    //刷新资料需求
    refreshDataData() {
      this.taskDataData = [];
      this.z_get(
        "api/standard_task_data",
        { st_id: this.currentRow.st_id, condition: this.dataCondition },
        { loading: false }
      )
        .then(res => {
          this.dataTypeFilter = res.dict.ddt_id;
          this.taskDataData = res.data;
        })
        .catch(res => {});
    },
    //刷新物料item表
    refreshItemListData() {
      this.loading2 = true;
      this.itemListData = [];
      this.z_get(
        "api/item/page",
        {
          condition: this.itemListCondition,
          page: this.currentPage,
          limit: this.limit
        },
        { loading: false }
      )
        .then(res => {
          this.loading2 = false;
          this.itemListData = res.data;
          this.total = res.total;
        })
        .catch(res => {});
    },
    refreshBottom() {
      this.itemCondition = "";
      this.taskItemData = [];
      this.dataCondition = "";
      this.taskDataData = [];
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    searchItem() {
      this.itemCondition = "";
      this.refreshItemData();
    },
    searchItemList() {
      this.itemListCondition = "";
      this.currentPage = 1;
      this.refreshItemListData();
    },
    searchData() {
      this.dataCondition = "";
      this.refreshDataData();
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },
    handleSelectionChange2(val) {
      this.itemSelection = val;
    },
    handleSelectionChange3(val) {
      this.dataSelection = val;
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
    //选中子节点
    selectChildren(val, select) {
      for (var i = 0; i < val.length; i++) {
        if (select && this.selection.indexOf(val[i]) == -1) {
          this.$refs.taskTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.taskTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //显示任务dialog
    addNewTaskShow(type) {
      var titleName = "";
      var st_pid = null;
      if (type == "root") {
        titleName = "";
        this.addTaskText = "新增根节点";
      } else if (type == "children") {
        st_pid = this.currentRow.st_id;
        titleName = this.currentRow.st_name;
        this.addTaskText = "新增[" + titleName + "]的子节点";
      }
      this.taskModel = {
        st_id: 0,
        st_pid: st_pid,
        dept_id: "",
        dept_name: "",
        st_name: "",
        st_type: "task",
        st_period: "",
        st_note: ""
      };
      this.addOrNot = true;
      this.addTaskVisiable = true;
    },
    //保存新增/编辑任务
    onSaveTaskClick() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/standard_task", this.taskModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.taskModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            if (this.taskModel.UpdateColumns) {
              this.z_put("api/standard_task", this.taskModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addTaskVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addTaskVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示编辑任务
    editTaskShow(row) {
      this.taskModel = JSON.parse(JSON.stringify(row));
      this.taskModel.dept_name = this.renderFilter(
        this.taskModel.dept_id,
        this.deptDataFilter
      );
      this.addTaskText = "编辑节点";
      this.addOrNot = false;
      this.addTaskVisiable = true;
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
      this.$confirm("是否删除？节点下的子节点将一并删除！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/standard_task/list", { data: list })
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
    //显示新增物料需求
    addNewTaskItemShow() {
      this.taskItemModelList = [];
      this.searchItemList();
      this.addOrNot = true;
      this.addTaskItemVisible = true;
    },
    //保存/编辑选中物料
    onSaveTaskItemClick() {
      this.$refs.taskItemForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            //新增
            this.taskItemModelList.push(
              JSON.parse(JSON.stringify(this.taskItemModel))
            );
            this.selectItemVisible = false;
          } else {
            //修改
            this.taskItemModel.UpdateColumns = this.$refs.taskItemForm.UpdateColumns;
            if (this.taskItemModel.UpdateColumns) {
              this.z_put("api/standard_task_item", this.taskItemModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshItemData();
                  this.selectItemVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.selectItemVisible = false;
            }
          }
        }
      });
    },
    //保存新增物料需求
    onSaveItemListClick() {
      if (this.taskItemModelList.length > 0) {
        for (var i = 0; i < this.taskItemModelList.length; i++) {
          if (!this.taskItemModelList[i].sti_quantity) {
            this.$alert("物料" + (i + 1) + "数量未填写", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            });
            return;
          }
        }
        this.z_post("api/standard_task_item/list", this.taskItemModelList)
          .then(res => {
            this.$message({
              message: "新增成功!",
              type: "success",
              duration: 1000
            });
            this.addTaskItemVisible = false;
            this.refreshItemData();
          })
          .catch(res => {
            this.$alert("新增失败!", "提示", {
              confirmButtonText: "确定",
              type: "error"
            });
          });
      } else {
        this.$alert("为选中任何物料!", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },
    //显示编辑物料需求
    editItemShow(row) {
      this.taskItemModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.addTaskItemText = "编辑物料需求";
      this.selectItemVisible = true;
    },
    //删除一个物料需求
    deleteOneItem(row) {
      var list = [];
      list.push(row);
      this.onDeleteItemClick(list);
    },
    //删除多个物料需求
    deleteListItem() {
      if (this.itemSelection.length) {
        this.onDeleteItemClick(this.itemSelection);
      }
    },
    //确认删除物料需求
    onDeleteItemClick(list) {
      this.$confirm("是否删除物料？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/standard_task_item/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshItemData();
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
    //显示新增资料需求
    addNewTaskDataShow() {
      this.taskDataModel = {
        std_id: 0,
        st_id: this.currentRow.st_id,
        ddt_id: "",
        std_name: "",
        std_note: "",
        std_quantity: ""
      };
      this.addTaskDataText = "新增资料需求";
      this.addOrNot = true;
      this.addTaskDataVisible = true;
    },
    //新增/编辑资料需求
    onSaveTaskDataClick() {
      this.$refs.taskDataForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/standard_task_data", this.taskDataModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshDataData();
                this.addTaskDataVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.taskDataModel.UpdateColumns = this.$refs.taskDataForm.UpdateColumns;
            if (this.taskDataModel.UpdateColumns) {
              this.z_put("api/standard_task_data", this.taskDataModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshDataData();
                  this.addTaskDataVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addTaskDataVisible = false;
            }
          }
        }
      });
    },
    //显示编辑资料
    editTaskDataShow(row) {
      this.taskDataModel = JSON.parse(JSON.stringify(row));
      this.addTaskDataText = "编辑资料需求";
      this.addOrNot = false;
      this.addTaskDataVisible = true;
    },
    //删除单个资料需求
    deleteOneData(row) {
      var list = [];
      list.push(row);
      this.onDeleteDataClick(list);
    },
    //删除多个资料需求
    deleteListData() {
      if (this.dataSelection.length) {
        this.onDeleteDataClick(this.dataSelection);
      }
    },
    //确认删除资料需求
    onDeleteDataClick(list) {
      this.$confirm("是否删除资料？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/standard_task_data/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshDataData();
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
    //刷新部门数据
    selectDept() {
      this.z_get("api/dept/tree", { condition: "" }, { loading: false })
        .then(res => {
          //如果不一样才赋值
          if (JSON.stringify(this.deptData) != JSON.stringify(res.data)) {
            this.deptData = res.data;
          }
        })
        .catch(res => {});
    },
    //双击选择部门
    handleSelectTreeDblClick(data) {
      this.taskModel.dept_id = data.dept_id;
      this.taskModel.dept_name = data.dept_name;
      this.$refs.select_dept.blur();
    },
    //点击任务行显示下面
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        //点击加载tab数据
        this.refreshBottom();
        this.refreshItemData();
        this.refreshDataData();
      }
      this.bottomDataShow = true;
    },
    //双击选中物料
    handleRowDbClcik(row) {
      this.taskItemModel = {
        st_id: this.currentRow.st_id,
        item_no: row.item_no,
        item_name: row.item_name,
        sti_quantity: "",
        sti_note: ""
      };
      var isContain = false;
      for (var i = 0; i < this.taskItemData.length; i++) {
        if (this.taskItemData[i].item_no == this.taskItemModel.item_no) {
          isContain = true;
          break;
        }
      }
      for (var i = 0; i < this.taskItemModelList.length; i++) {
        if (this.taskItemModelList[i].item_no == this.taskItemModel.item_no) {
          isContain = true;
          break;
        }
      }
      if (isContain) {
        this.$alert("已存在该物料!", "提示", {
          confirmButtonText: "好的",
          type: "warning"
        });
      } else {
        this.addOrNot = true;
        this.addTaskItemText = "新增物料需求";
        this.selectItemVisible = true;
      }
    },
    //展开所有节点
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
    //折叠所有节点
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
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshItemListData();
    },
    //删除选中的物料
    deleteSelectItem(index) {
      this.taskItemModelList.splice(index, 1);
    }
  },
  mounted() {
    this.refreshData();
    this.selectDept();
  }
};
</script>

<style scoped>
.standard-task {
  width: 1100px;
}
.formItem {
  width: 300px;
}
.formItem2 {
  width: 200px;
}
.transferDiv {
  display: inline;
}
.leftTransferItem {
  display: inline-block;
  vertical-align: middle;
  width: 500px;
  height: 400px;
}
.rightTransferItem {
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  width: 350px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.oneItem {
  border: 1px solid #eee;
  margin-bottom: 10px;
}
.bottomButton {
  text-align: center;
  margin: 10px 0;
}
</style>