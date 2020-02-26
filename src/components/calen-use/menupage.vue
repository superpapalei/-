<template>
  <div class="calen_menu">
   <el-dialog
      width="700px"
     title="日历"
      :visible.sync="calen_comVisible"
      :close-on-click-modal="false"
      append-to-body>
      <div slot="title" class="header-title">
        
        <span class="el-icon-date"> 编辑日历</span>
      </div>
   <calendarMonth v-on:fun="closeCalendarMonth">

   </calendarMonth>

    </el-dialog>
    <el-container>
      <el-aside width="90px">
        <ul>
          <el-button type="primary" size="mini" @click="handleClose" icon="el-icon-close">关 闭</el-button>
        </ul>
        <ul>
          <el-button type="primary" size="mini" @click="handleEdit" icon="el-icon-circle-plus-outline">新 增
          </el-button>
        </ul>
        <ul>
          <el-button type="primary" size="mini" @click="handleEdit" icon="el-icon-edit-outline">修 改
          </el-button>
        </ul>
        <ul>
          <el-button type="primary" size="mini" @click="handleDelete" icon="el-icon-delete">删 除</el-button>
        </ul>
        <ul>
          <el-button type="primary" size="mini" @click="setCurrent(gridData[1])"  icon="el-icon-view">查 看</el-button>
        </ul>

        <ul>
          <el-button type="primary" size="mini"  disabled>转成全局</el-button>
        </ul>
        <ul>
          <el-button type="primary" size="mini"  disabled>转成共享</el-button>
        </ul>
        <ul>
          <el-button type="primary" size="mini"  disabled>转成个人</el-button>
        </ul>
        <ul>
          <el-button type="primary" size="mini"  icon="el-icon-question" disabled>帮 助
          </el-button>
        </ul>
      </el-aside>
      <el-container>
        <el-header style="background: #fff;height:20px">
          <el-radio-group v-model="radio2" @change="calenChange">
            <el-radio :label="3">全局日历</el-radio>
            <el-radio :label="6">项目日历</el-radio>
            <el-radio :label="9">资源日历</el-radio>
          </el-radio-group>
        </el-header>
        <el-main>
          <el-table 
          :data="gridData" 
          highlight-current-row
           ref="singleTable"
           @current-change="currentChange">
            <el-table-column property="calendar_name" label="名称" width="300"></el-table-column>

            <el-table-column label="默认" width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" :key="scope.row.calendar_id" @change="selectDefault($event,scope.row.calendar_id)"></el-checkbox>
              </template></el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>

</template>
<script>
  import calendarMonth from '../calen-com/calendar.vue'
export default {
  data() {
    return {
      calen_visible: false,
      radio2: 3,
      currentRow: null,
      calen_comVisible:false,
      gridData: [
        {
          calendar_id: 1,
          calendar_type: 1,
          calendar_name: "标准日历5×8",
          date: "2016-05-02",
          checked: true,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 2,
          calendar_type: 1,
          calendar_name: "标准日历5×12",
          date: "2016-05-04",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 3,
          calendar_type: 1,
          calendar_name: "标准日历6×12",
          date: "2016-05-01",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 4,
          calendar_type: 1,
          calendar_name: "标准日历7×12",
          date: "2016-05-03",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      gridData3: [
         {
          calendar_id: 1,
          calendar_type: 1,
          calendar_name: "标准日历5×8",
          date: "2016-05-02",
          checked: true,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 2,
          calendar_type: 1,
          calendar_name: "标准日历5×12",
          date: "2016-05-04",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 3,
          calendar_type: 1,
          calendar_name: "标准日历6×12",
          date: "2016-05-01",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 4,
          calendar_type: 1,
          calendar_name: "标准日历7×12",
          date: "2016-05-03",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        }

      ],
      gridData6: [
        {
          calendar_id: 8,
          calendar_type: 2,
          calendar_name: "项目日历5×12",
          date: "2016-05-02",
          checked: false,

          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 9,
          calendar_type: 2,
          calendar_name: "项目日历6×8",
          date: "2016-05-04",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 10,
          calendar_type: 2,
          calendar_name: "项目日历7×24",
          date: "2016-05-01",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        },

      ],
      gridData9: [
        {
          calendar_id: 11,
          calendar_type: 3,
          calendar_name: "人力资源日历5×8",
          date: "2016-05-02",
          checked: false,

          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 12,
          calendar_type: 3,
          calendar_name: "工具类日历5×12",
          date: "2016-05-04",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          calendar_id: 13,
          calendar_type: 3,
          calendar_name: "采购员日历5×10",
          date: "2016-05-01",
          checked: false,
          address: "上海市普陀区金沙江路 1518 弄"
        },

      ]
    };
  },
  
updated:function(){
       this.setCurrent(this.gridData[0]);
 },
 mounted:function(){
   this.setCurrent(this.gridData[0]);
 },
  methods: {
     closeCalendarMonth() {
      this.calen_comVisible = false;
      //this.$router.go(0);//刷新页面
    },
         handleDelete() {
           let tip="";
           let message="";
           let type="success"
          if(this.currentRow.checked) {
              tip="该日历是默认全局日历，无法删除，请先取消该日历的默认选项！";
              message="取消删除";
               type="warning"
          }  
          else {
            tip="使用该日历的对象将替换为使用默认全局日历！是否继续？"
             
          }
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
      if(!this.currentRow.checked){
        message="删除成功！";
         type="success"
      let index= this.gridData.indexOf(this.currentRow);
       this.gridData.splice(index,1);
      }
          this.$message({
            type: type,
            message: message
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    //自动选中首行
       setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
    //切换当前选中行
    currentChange(val) {
      // this.$refs.singleTable.setCurrentRow(row);
       this.currentRow = val;
     
     
    },
    calenChange(val) {
      if (val == 3) {
        this.gridData = this.gridData3;
      }
      else if (val == 6) {
        this.gridData = this.gridData6;
      }
      else {
        this.gridData = this.gridData9;
      }
    },
    selectDefault(val,val1) {
      let bo=val;
      let id=val1;
  
      this.gridData.forEach(function(value){
         if(value.calendar_id==val1&&value.calendar_type==1){
         value.checked=true;
      }
         else value.checked=false

      })
     
  
    },
    handleClose() {
      this.$emit('fun', false)
    },
     handleEdit() {
 
      this.calen_comVisible=true;
    },
   
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    // }
  },
  components: {
    calendarMonth
  }
};
</script>
<style scoped>



/* .lanJuport2 .el-input__inner{
  height: 30px;
} */
</style>
