<template>
  <el-container>
    <el-container class="calendar-container">
      <el-aside width="400px">
        <div class="calendar-box">
          <ul class="calendar-move">
            <li @click="toOtherMonth(-1)" style="cursor:pointer;">上个月</li>
            <li>
              {{ disp_date.getFullYear() }} 年 {{ disp_date.getMonth() + 1 }} 月
            </li>
            <li @click="toOtherMonth(1)" style="cursor:pointer;">下个月</li>
          </ul>
          <ul class="calendar-head">
            <li class="weekend">日</li>
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li class="weekend">六</li>
          </ul>
          <calendarContent ref="calendar_swiper" :checkDate="current_day" @on-change="changeIndex">
            <div v-for="(month, index) in monthList" :key="index" class="month swiper-item">
              <ul v-for="(week, weekindex) in month" :key="weekindex">
                <li v-for="(day, dayindex) in week" @click="
                    chooseDay(
                      day.year,
                      day.month,
                      day.day,
                      day.othermonth,
                      day.mode
                    )
                  ">
                  <div class="week-day" :class="{
                      ischecked: checkedDay == day.date,
                      othermonth: day.othermonth,
                      istoday: day.istoday,
                      isworkday: day.isworkday,
                      is_weekend: day.is_weekend
                    }">
                    <span style="padding-top:2px;display:block;">
                      <i class="day">{{ day.day }}</i>
                      <i>{{ day.nongli.old_str }}</i>
                    </span>
                    <div class="thing">
                      <a :style="{ color: thing.color }" v-for="thing in day.thing">{{ thing.title }}</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </calendarContent>
        </div>
      </el-aside>
      <el-main width="300px">
        <el-container>
          <!-- 时段与操作框-->
          <el-main width="200px">
            <!-- 时段-->
            <el-container>
              <!-- 时段-->
              <el-main width="80px">
                <!-- 时段1-->
                <div class="day-timediv0">
                  <ul v-for="(timeArrange, index) in day_timeList0" :key="index" style="padding:0;margin:0">
                    <div class="day-time" :class="{
                        worktime: index >= 8 && index <= 18
                      }"></div>
                  </ul>
                </div>
              </el-main><!-- 时段1-->
              <el-aside width="75px">
                <!-- 时段2-->
                <div class="day-timediv1">
                  <ul v-for="(timeArrange, index) in day_timeList1" :key="index" style="padding:0;margin:0">
                    <div class="day-time" :class="{
                            worktime: index >= 8 && index <= 18
                      }"></div>
                  </ul>
                </div>
              </el-aside><!-- 时段2-->
            </el-container><!-- 时段-->
          </el-main><!-- 时段-->
          <el-aside width="100px">
            <div class="handleDiv">
              <ul>
                <el-button type="primary" size="mini" @click="handleCancel" icon="el-icon-check">确 定</el-button>
              </ul>
              <ul>
                <el-button type="primary" size="mini" @click="handleCancel" icon="el-icon-close">取 消
                </el-button>
              </ul>

              <ul>
                <el-button type="primary" size="mini" @click="labelToWorkDay(true)" icon="el-icon-service">工 作
                </el-button>
              </ul>
              <ul>
                <el-button type="primary" size="mini" @click="labelToWorkDay(false)">非 工 作</el-button>
              </ul>
              <ul>
                <el-button type="primary" size="mini" @click="labelToWorkDay(false)">周期操作</el-button>
              </ul>
              <ul>
                <el-button type="primary" size="mini" @click="handleCancel" icon="el-icon-question">帮 助
                </el-button>
              </ul>
              <ul style="padding-top:60px">

                <div class="worktime" style="width:20px;display:inline-block;">
                  &nbsp;
                </div>
                <div style="width:30px;display:inline-block;">
                  工作
                </div>
              </ul>
              <ul style="padding-top:10px">

                <div class="noworktime" style="width:20px;display:inline-block;">
                  &nbsp;
                </div>
                <div style="width:30px;display:inline-block;">
                  休息
                </div>
              </ul>
            </div>
          </el-aside>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import calendarContent from "../calen-com/swiper-monthorweek.vue";
import format from "../calen-com/format";

export default {
  data() {
    return {
      disp_date: new Date(),
      today: new Date(),
      current_day: new Date(),
      monthList: [],
      checkedDay: "0000-00-00",
      can_click: true,
      day_timeList0: [],
      day_timeList: [],
      workday: [],
      allDay: [
        {
          index: 1,
          timeArrange: "0-30"
        },
        {
          index: 2,
          timeArrange: "0-30"
        },
        {
          index: 3,
          timeArrange: "0-30"
        }
      ]
    };
  },
  created() {
    this.day_timeList0 = this.getDayTime(0);
    this.day_timeList1 = this.getDayTime(1);
    console.log(this.day_timeList);
    this.get3month();
  },
  methods: {
    labelToWorkDay(val) {
      var _year = this.current_day.getFullYear();
      var _month = this.current_day.getMonth();
      var _day = this.current_day.getDate();
      var _cur = this.format(_year, _month, _day);
      if (val) {
        if (this.workday.indexOf(_cur) == -1) {
          this.workday.push(_cur);
          console.log("this.workday!!!!!!!!!!!");
          console.log(this.workday);
        }
      } else {
        if (this.workday.indexOf(_cur) > -1) {
          this.workday.splice(this.workday.indexOf(_cur), 1);
        }
      }
      this.get3month();
    },
    toOtherMonth(val) {
      let year = this.disp_date.getFullYear();
      let month = this.disp_date.getMonth();
      this.disp_date = new Date(year, month + val, 1);

      this.get3month();
    },
    handleCancel() {
      this.$emit("fun", false);
    },
    is_weekend(year, month, day) {
      var thisDay = new Date(year, month, day);
      if (thisDay.getDay() == 0 || thisDay.getDay() == 6) {
        return true;
      } else return false;
    },
    chooseDay(year, month, day, othermonth, mode) {
      //        为了PC端点击事件和移动冲突
      if (!this.can_click) return;
      this.current_day = new Date(year, month, day);
      this.checkedDay = this.format(year, month, day);
      if (othermonth && mode == "month") {
        var _tmpdt = new Date(
          this.disp_date.getFullYear(),
          this.disp_date.getMonth() - othermonth,
          0
        );
        var maxday = _tmpdt.getDate();
        var _day = maxday < day ? maxday : day;
        this.disp_date = new Date(year, month - othermonth, _day);
        this.changeIndex(othermonth, false, true);
      } else if (othermonth && mode == "week") {
        this.disp_date = this.current_day;
      } else {
        this.disp_date = this.current_day;
      }
    },
    format(year, month, day) {
      month++;
      month < 10 && (month = "0" + month);
      day < 10 && (day = "0" + day);
      return year + "-" + month + "-" + day;
    },
    workDayFomat(year, month, day) {
      var _temp = this.format(year, month, day);
      if (year == 2020 && month == 1 && day == 12) {
        console.log(_temp);
        console.log("this.workday123");
        console.log(this.workday);
      }
      if (this.workday.indexOf(_temp) > -1) {
        console.log("包含了，返回true");
        return true;
      } else return false;
    },
    getWeek(year, month, day) {
      var dt = new Date(year, month, day);
      var weekArr = [];
      var dt_first = new Date(year, month, day - ((dt.getDay() + 6) % 7));
      var week = [];
      //        console.log(year,month,day)
      for (var j = 0; j < 7; j++) {
        var newdt = new Date(
          dt_first.getFullYear(),
          dt_first.getMonth(),
          dt_first.getDate() + j
        );
        var _year = newdt.getFullYear();
        var _month = newdt.getMonth();
        var _day = newdt.getDate();
        week.push({
          mode: "week",
          day: _day,
          year: _year,
          month: _month,
          date: this.format(_year, _month, _day),
          nongli: format.solar2lunar(_year, _month + 1, _day),
          istoday:
            this.today.getFullYear() == _year &&
              this.today.getMonth() == _month &&
              this.today.getDate() == _day
              ? true
              : false,
          isworkday: this.workDayFomat(year, month, day),
          ischecked: false,
          othermonth: _month != month
        });
      }
      weekArr.push(week);
      return weekArr;
    },
    getMonth(year, month) {
      //创建单月历
      var monthArr = [];
      var dt_first = new Date(year, month, 1); //每个月第一天
      var dt_last = new Date(year, month + 1, 0); //每个月最后一天
      var monthLength = dt_last.getDate() - dt_first.getDate() + 1;
      var daylist = [];
      var space = (dt_first.getDay() + 7) % 7; //月历前面空格
      //console.log(year,month)
      for (var i = -space; i < 36; i += 7) {
        var week = [];
        for (var j = 0; j < 7; j++) {
          var day = i + j + 1;
          var is_weekend = this.is_weekend(year, month, day);
          if (day > 0 && day <= monthLength) {
            week.push({
              mode: "monthis_weekday=this.isweekDay();",
              day: day,
              is_weekend: is_weekend,
              year: year,
              month: month,
              date: this.format(year, month, day),
              //                日历要显示的其他内容
              // thing:(day == 22 || day == 4) ? [{title:'阁力项目启动',color:'red'},{title:'动员会议',color:'yellow'}]:[],
              nongli: format.solar2lunar(year, month + 1, day), //农历

              istoday:
                this.today.getFullYear() == year &&
                  this.today.getMonth() == month &&
                  this.today.getDate() == day
                  ? true
                  : false,
              isworkday: this.workDayFomat(year, month, day),
              ischecked: false
            });
          } else {
            //其它月份
            //week.push({})
            var newdt = new Date(year, month, day); //不在该月的的范围也可自动计算所在日期，
            var _year = newdt.getFullYear();
            var _month = newdt.getMonth();
            var _day = newdt.getDate();
            week.push({
              mode: "month",
              day: _day,
              is_weekend: false,
              year: _year,
              month: _month,
              date: this.format(year, month, day), //不在该月的的范围也可自动计算所在日期，
              nongli: format.solar2lunar(_year, _month + 1, _day), //根据真实（该月范围内的）日期转化成农历
              istoday:
                this.today.getFullYear() == _year &&
                  this.today.getMonth() == _month &&
                  this.today.getDate() == _day
                  ? true
                  : false,
              ischecked: false,
              isworkday: this.workDayFomat(year, month, day),
              othermonth: day <= 0 ? -1 : 1 //上月和下月
            });
          }
        }
        monthArr.push(week);
      }
      return monthArr;
    },
    get3month() {
      var year = this.disp_date.getFullYear();
      var month = this.disp_date.getMonth();
      this.monthList = [];
      this.monthList.push(this.getMonth(year, month - 1));
      this.monthList.push(this.getMonth(year, month));
      this.monthList.push(this.getMonth(year, month + 1));
    },
    get3week() {
      var year = this.disp_date.getFullYear();
      var month = this.disp_date.getMonth();
      var day = this.disp_date.getDate();
      this.monthList = [];
      this.monthList.push(this.getWeek(year, month, day - 7));
      this.monthList.push(this.getWeek(year, month, day));
      this.monthList.push(this.getWeek(year, month, day + 7));
      // console.log(this.monthList);
    },
    changeIndex(index, is_week, is_click = false) {
      if (index) {
        if (is_week) {
          this.disp_date = new Date(
            this.disp_date.getFullYear(),
            this.disp_date.getMonth(),
            this.disp_date.getDate() + 7 * index
          );
          this.checkedDay = this.format(
            this.disp_date.getFullYear(),
            this.disp_date.getMonth(),
            this.disp_date.getDate()
          );
          this.current_day = this.disp_date;
          this.get3week();
        } else {
          //            console.log(this.disp_date.getMonth()+index)
          var _tmpdt = new Date(
            this.disp_date.getFullYear(),
            this.disp_date.getMonth() + index,
            0
          );
          var maxday = _tmpdt.getDate();
          var _day =
            maxday < this.disp_date.getDate()
              ? maxday
              : this.disp_date.getDate();
          // console.log(_day);

          this.disp_date = new Date(
            this.disp_date.getFullYear(),
            this.disp_date.getMonth() + index,
            _day
          );
          if (!is_click) {
            this.checkedDay = this.format(
              this.disp_date.getFullYear(),
              this.disp_date.getMonth(),
              this.disp_date.getDate()
            );
            // console.log(this.checkedDay);
          }
          //            console.log(this.format(this.disp_date.getFullYear(),this.disp_date.getMonth(),_day))
          this.get3month();

          // console.log("move_change");
        }
        this.$refs.calendar_swiper.move_change();
      }
    },
    getDayTime(val) {
      let day_times = [];
      let time_str = "";
      for (let i = 0; i < 24; i++) {
        let j = 48 / 2;
        if (val == 1) {
          time_str = parseInt(i / 2).toString() + ":30";
        } else {
          time_str = parseInt(i / 2).toString() + ":00";
        }
        day_times.push({
          index: i,
          timeArrange: time_str
        });
      }
      return day_times;
    }
  },
  components: {
    calendarContent
  }
};
</script>
<style scoped>
.calendar-box {
  /* background: #4188d8; */
  background: #f2f6fc;
  color: #000;
  position: relative;
  height: 95%;
  width: 100%;
  z-index: 99;
}
.calendar-head {
  background: #f2f6fc;
  display: flex;
  height: 40px;
  line-height: 40px;
}
.calendar-head li {
  flex-grow: 1;
  text-align: center;
}
.calendar-move {
  font-weight: bold;
  background: #909399;
  display: flex;
  height: 40px;
  line-height: 40px;
}
.calendar-move li {
  flex-grow: 1;
  text-align: center;
}
.calendar-current {
  background: #f2f6fc;
  display: flex;
  height: 40px;
  line-height: 40px;
}
.swiper-item {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
.swiper-item:nth-child(1) {
  left: -100%;
}
.swiper-item:nth-child(2) {
  left: 0;
}
.swiper-item:nth-child(3) {
  left: 100%;
}
.month ul {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 16%;
  min-height: 40px;
  border-right: 1px solid #eee;
}
.month li {
  flex: 1;
  flex-grow: 1;
  overflow: hidden;
}
.week-day {
  position: relative;
  margin: auto;
  font-size: 12px;
  text-align: center;
  border: 0;
  line-height: 10px;
  overflow: hidden;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  z-index: 1;
  height: 140px;
}
.week-day i {
  display: block;
  text-align: center;
  font-size: 10px;
  font-style: normal;
  padding: 1px;
  line-height: 14px;
  height: 14px;
}
.thing a {
  cursor: pointer;
  display: block;
  width: 100%;
  overflow: hidden;
  word-break: break-all;
  line-height: 16px;
  height: 16px;
}
.thing {
  margin-top: 3px;
}
.othermonth {
  color: #909399;
}
.istoday {
  font-weight: bold;
  /* background: #e6a23c !important; */
}

.is_weekend {
  color: #000;
}
.weekend {
  background-color: #67c23a !important;
}

.ischecked {
  border: 1px solid #000;
  /* background-color: #409eff !important; */
}
.isworkday {
  /* font-weight: bold; */

  background: #e6a23c !important;
}
.el-main {
  padding: 1px;
}
.day-timediv0 {
  padding-top: 12px;
  padding-left: 12px;
  margin: 0px;
  background: #fff;
}
.day-timediv1 {
  padding-top: 12px;
  padding-right: 12px;
  margin: 0px;
  background: #fff;
}
.day-time {
  background-color: #f2f6fc;
  position: relative;
  margin: 0;
  padding: 0;
  /* font-size: 12px; */
  /* text-align: center; */
  /* border: 0; */
  /* line-height: 10px; */
  overflow: hidden;
  border: 1px solid #000;
  z-index: 1;
  height: 15px;
}
.worktime {
  background-color: #e6a23c;
}
.noworktime {
  background-color: #f2f6fc;
}
/* .day-time i {
  /* display: block; */
/* text-align: center; */
/* font-size: 10px; */
/* font-style: normal; */
/* padding: 1px; */
/* line-height: 14px; */
/* height: 14px; */
/* } */
/* .calendar-container /deep/ .el-dialog__body{
  padding: 1px;
} */
.handleDiv {
  margin-left: 20px;
}
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}
.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 40px;
}
</style>
