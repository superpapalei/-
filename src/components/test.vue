<template>
  <div>
    <div>
      <div>
      <p> 星期{{ rq.getDay() }}</p>
      <input v-model="rq">
      </div>
         <div>
      <p> 星期{{ rq1.getDay() }}</p>
      <input v-model="rq1">
      </div>
      <div>
        间隔天数{{Math.floor((rq1-rq) / (24 * 3600 * 1000))}}
      </div>
      <div>
        开始 <input v-model="r1" />
      </div>
      <div>
        结束 <input v-model="r2" />
      </div>
      <div>
        <textarea v-model="message" name="" id="text" cols="90" rows="10">这里输入的数据将保存为txt中</textarea>
        <button @click="getValueRange(r1,r2)" id="save" type="button">产生16进制空日历内容</button>
      </div>
      <div>
        {{message.length}}
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rq:new Date("1900-1-1"),
      rq1:new Date("2100-1-1"),
      r1: 1900,
      r2: 1900,
      inty: "请输入年份",
      intm: "请输入月份",
      hy: "请输入十六进制年份",
      hm: "请输入十六进制月份",
      message: "",
      todos: [
        { text: "学习 JavaScript" },
        { text: "学习 Vue" },
        { text: "整个牛项目" }
      ]
    };
  },
  created(){

  },
  methods: {




    //产生某段时间内的每天半小时段的16进制空日历
    getValueRange(ry1, ry2) {
      this.message="";
      var dday = new Date(ry1, 0, 1);
      while (dday.getFullYear() <= ry2) {
        for (let i = 0; i < 12; i++) {
          this.message += "F";
        }
            console.log(dday);
        dday = new Date(dday.getFullYear(), dday.getMonth(), dday.getDate() + 1);
      }
    },
   //解码2进制转16进制 4位占1位
    getHexTobinary(val) {
      let l=val.length;
      if(l>0){

      }
      if ((parseInt("0x" + val) >= 0 && parseInt("0x" + val) <= 200)) {
        return (parseInt("0x" + val) + 1900).toString();
      }
      return "请在以上输入框输入介于0到8c的十六进制数";
    },
    //解码16进制转2进制 1位占4位
    getBinaryToHex(val) {
      if (val >= 1900 && val <= 2100) {
        if (val - 1900 < 16) {
          return "0" + ((val - 1900).toString(16)).toString();
        }
        return ((val - 1900).toString(16)).toString();
      }
      return "请在以上输入框输入介于1900年到2100年的年份";
    },
  
  

    //班次明细直接用二进制表示即可

  }
};
</script>

<style scoped></style>
