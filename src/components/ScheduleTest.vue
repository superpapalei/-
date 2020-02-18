<template>
  <el-card>
    <div style="width:35%;height:500px;display:inline-block;">
      <el-button @click="onClick" type="primary">手动改数据</el-button>
      <el-table border style="width: 100%;" :data="tableData" @row-click="rowClock">
        <el-table-column prop="no" label="No" align="center" width="50"></el-table-column>
        <el-table-column prop="TaskName" label="任务名" align="center"></el-table-column>
        <el-table-column prop="StartTime" label="开始时间" align="center" width="100"><template slot-scope="scope">{{
            scope.row.StartTime | datatrans
          }}</template></el-table-column>
        <el-table-column prop="EndTime" label="结束时间" align="center" width="100"><template slot-scope="scope">{{
            scope.row.EndTime | datatrans
          }}</template></el-table-column>
        <!-- <el-table-column
          prop="belongto.belongno"
          label="从属节点"
          align="center"
          width="90"
        ></el-table-column> -->
      </el-table>
    </div>
    <div style="width:64%;min-height:500px;display:inline-block;">
      <schedule v-model="tableData" :height="500" :width="'100%'" :hightLightNo="hightLightNo"></schedule>
    </div>
  </el-card>
</template>

<script>
import schedule from "./control/ScheduleControl";
export default {
  data() {
    return {
      hightLightNo: 0,
      tableData: [
        {
          no: 10,
          TaskName: "需求调研",
          StartTime: "2020-1-20",
          EndTime: "2020-1-26",
          ResponsibleRol: "项目经理",
          planlevel: "base",
          belongto: [],
          children: []
        },
        {
          no: 20,
          TaskName: "调研汇报完成",
          StartTime: "",
          EndTime: "2020-1-26",
          ResponsibleRol: "项目经理",
          planlevel: "base",
          belongto: [
            {
              belongno: 10,
              relation: "FS",
              relationspan: 10
            }
          ],
          type: "keynote",
          children: []
        },
        {
          no: 30,
          TaskName: "方案设计",
          StartTime: "2020-1-26",
          EndTime: "2020-2-20",
          ResponsibleRol: "项目经理",
          planlevel: "base",
          belongto: [
            {
              belongno: 20,
              relation: "FS",
              relationspan: 10
            }
          ],
          type: "work",
          children: [
            {
              no: 3010,
              TaskName: "计划方案设计",
              StartTime: "2020-1-26",
              EndTime: "2020-2-20",
              ResponsibleRol: "项目经理",
              planlevel: "detail",
              belongto: [
                {
                  belongno: 20,
                  relation: "FS",
                  relationspan: 10
                }
              ],
              type: "work",
              children: []
            },
            {
              no: 3020,
              TaskName: "计划方案设计",
              StartTime: "",
              EndTime: "2020-2-20",
              ResponsibleRol: "项目经理",
              planlevel: "detail",
              belongto: [
                {
                  belongno: 3010,
                  relation: "FS",
                  relationspan: 10
                }
              ],
              type: "keynote",
              children: []
            },
            {
              no: 3030,
              TaskName: "监控方案设计",
              StartTime: "",
              EndTime: "2020-2-20",
              ResponsibleRol: "项目经理",
              planlevel: "detail",
              belongto: [
                {
                  belongno: 20,
                  relation: "FS",
                  relationspan: 10
                }
              ],
              type: "work",
              children: []
            }
          ]
        },
        {
          no: 40,
          TaskName: "方案设计确认完成",
          StartTime: "",
          EndTime: "2020-2-20",
          ResponsibleRol: "项目经理",
          planlevel: "base",
          belongto: [
            {
              belongno: 3020,
              relation: "FS",
              relationspan: 10
            },
            {
              belongno: 3030,
              relation: "FS",
              relationspan: 10
            }
          ],
          type: "keynote",
          children: []
        },
        {
          no: 50,
          TaskName: "原型设计",
          StartTime: "2020-2-20",
          EndTime: "2020-3-1",
          ResponsibleRol: "项目经理",
          planlevel: "base",
          belongto: [
            {
              belongno: 40,
              relation: "FS",
              relationspan: 10
            }
          ],
          type: "work",
          children: []
        },
        {
          no: 60,
          TaskName: "原型设计",
          StartTime: "2020-3-1",
          EndTime: "2020-4-1",
          ResponsibleRol: "项目经理",
          planlevel: "base",
          belongto: [
            {
              belongno: 50,
              relation: "FS",
              relationspan: 10
            }
          ],
          type: "work",
          children: []
        },
        {
          no: 70,
          TaskName: "系统开发",
          StartTime: "2020-4-1",
          EndTime: "2020-5-20",
          ResponsibleRol: "项目经理",
          planlevel: "base",
          belongto: [
            {
              belongno: 60,
              relation: "FS",
              relationspan: 10
            }
          ],
          type: "work",
          children: []
        },
        {
          no: 80,
          TaskName: "实施上线",
          StartTime: "2020-5-20",
          EndTime: "2020-5-25",
          ResponsibleRol: "项目经理",
          planlevel: "base",
          belongto: [
            {
              belongno: 70,
              relation: "FS",
              relationspan: 10
            }
          ],
          type: "work",
          children: []
        },
        {
          no: 90,
          TaskName: "验收成功",
          StartTime: "",
          EndTime: "2020-6-10",
          ResponsibleRol: "项目经理",
          planlevel: "base",
          belongto: [
            {
              belongno: 80,
              relation: "FS",
              relationspan: 10
            }
          ],
          type: "keynote",
          children: []
        }
      ]
    };
  },
  components: {
    schedule
  },
  methods: {
    onClick() {
      (this.tableData[0].StartTime = "2020-1-20"),
        (this.tableData[0].EndTime = "2020-1-26"),
        (this.tableData[0].TaskName = "xxx"),
        (this.tableData[1].EndTime = "2020-1-26"),
        (this.tableData[2].StartTime = "2020-1-26");
      this.tableData[5].StartTime = "2020-3-1";
      this.tableData[5].EndTime = "2020-4-1";
    },
    rowClock(row) {
      this.hightLightNo = row.no;
    }
  },
  watch: {
    tableData() {
      //console.log(this.tableData)
      // this.tableData.sort(function(a,b){
      //   return a.no>b.no ?1:-1;
      // })
    }
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
    }
  }
};
</script>