<template>
  <div>
    <div>
      <input v-model="hy" />
      <p>{{ getIntYear(hy) }}</p>
    </div>
    <div>
      <input v-model="inty" />
      <p>{{ getHexYear(inty) }}</p>
    </div>
    <div>
      <div>
        <input v-model="hm" />
        <p>{{ getIntMonth(hm) }}</p>
      </div>
      <div>
        <input v-model="intm" />
        <p>{{ getHexMonth(intm) }}</p>
      </div>
      <div>
         开始 <input v-model="r1" />  
      </div>
      <div>
        结束 <input v-model="r2" />  
      </div>
      <div>
        <textarea v-model="message" name="" id="text" cols="90" rows="10">这里输入的数据将保存为txt中</textarea>
        <button @click="getValueRange(r1,r2)"  id="save" type="button">产生日期间隔值</button>
      </div>
      <div>
        <ol>
          <li v-for="todo in todos">
            {{ todo.text }}
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      r1:1990,
      r2:2100,
      inty: "请输入年份",
      intm: "请输入月份",
      hy: "请输入十六进制年份",
      hm: "请输入十六进制月份",
      message: "hello",
      todos: [
        { text: "学习 JavaScript" },
        { text: "学习 Vue" },
        { text: "整个牛项目" }
      ]
    };
  },
  methods: {
    //将年份1900-2100转16进制 两位
    getHexYear(val) {
      if (val >= 1900 && val <= 2100) {
        if (val - 1900 < 16) {
          return "0" + ((val - 1900).toString(16)).toString();
        }
        return ((val - 1900).toString(16)).toString();
      }
      return "请在以上输入框输入介于1900年到2100年的年份";
    },
    getIntYear(val) {
      if ((parseInt("0x" + val) >= 0 && parseInt("0x" + val) <= 200)) {
        return (parseInt("0x" + val) + 1900).toString();
      }
      return "请在以上输入框输入介于0到8c的十六进制数";
    },
    //将月份转16进制 一位
    getHexMonth(val) {
      if (val >= 1 && val <= 12) {
        return ((val - 1).toString(16)).toString();
      }
      return "请在以上输入框输入月份";
    },
    getIntMonth(val) {
      if ((parseInt("0x" + val) >= 0 && parseInt("0x" + val) <= 11)) {
        return (parseInt("0x" + val) + 1).toString();
      }
      return "请在以上输入框输入介于0到b的十六进制数月份";
    },
    
   
      getHexTimeRange(val) {
      if (val >= 0 && val <= 47) {
        if (val >= 1 && val <= 9) {
          return "0" + ((val - 1).toString(16)).toString();
        }
        return ((val - 1).toString(16)).toString();
      }
      return "请在以上输入框输入月份";
    },
    getInttimeRange(val) {
      if ((parseInt("0x" + val) >= 0 && parseInt("0x" + val) <= 30)) {
        if ((parseInt("0x" + val) >= 0 && parseInt("0x" + val) <= 8)) {
          return "0" + (parseInt("0x" + val) + 1).toString();
        }
        return (parseInt("0x" + val) + 1).toString();
      }
      return "请在以上输入框输入介于0到b的十六进制数月份";
    },
    //16进制转年份
    //月份转16进制
    //16进制转月份
    //日期转16进制
    //16进制转日期
    //循环生成1900到2100年每半个小时为单位的true or false 表
    getValueRange(ry1,ry2) {
      let all_str = "";
      let hy = "";
      let hm = "";
      let hd = "";
      let hsh = "";
      var dday = new Date(ry1, 1, 1);
      while (dday.getFullYear() <= ry2) {
        hy = this.getHexYear(dday.getFullYear());
        hm = this.getHexMonth(dday.getMonth() + 1);
        hd = dday.getDate();
        for(let i=0;i<48;i++){
          if(i<10){
              hsh="0"+i.toString();
          }
          else
          {
              hsh=i.toString();
          }
          all_str+=hy+hm+hd+hsh+"0"+",";
        }
        dday=new Date(dday.getFullYear(),dday.getMonth(),dday.getDate()+1);

      }
       this.message= all_str;
    }
  }
};
</script>

<style scoped></style>
