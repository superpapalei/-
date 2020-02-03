//根据传入的index对应修改其标签页名字
export function tabsName(index) {
  switch (index) {
    case "main":
      return "主页";  
    case "test":
      return "测试";  
      case "/test_canlen/calenda":
      return "日历";  
    default:
      return "xxx";
  }
}
