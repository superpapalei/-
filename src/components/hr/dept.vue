<template>
<div>
    <div style="margin-top: 20px">
    <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
  </div>
  <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="dept_name"
      label="部门名称"
      width="120">
    </el-table-column>
  </el-table>
  
</div>
</template>

<script>
  import {z_get} from '@/api/httpASP'
  export default {
    data() {
      return {
        tableData: [],
        multipleSelection: []
      }
    },
    created(){
      this.tableData=[];
      z_get("api/depts").then(res=>{
        this.tableData=res.data;
      }).catch(res=>{
        console.log(res.msg);
      })
    },

    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>