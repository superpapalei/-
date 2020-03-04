import Vue from 'vue';
//封装全局指令

//能触发keypress的按键，去除特殊按键
Vue.directive('enterNumber', {
    inserted: function (el) {
        el.addEventListener("keypress", function (e) {
            e = e || window.event;
            let charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;
            let re = /\d/;
            if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        });
    }
});

//可拖拽el-dialog，未完善
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
      // 获取拖拽内容头部
      const dialogHeaderEl = el.querySelector('.el-dialog__header');
      // 获取拖拽内容整体
      const dragDom = el.querySelector('.el-dialog');
      dialogHeaderEl.style.cursor = 'move';
   
      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
   
      // 鼠标按下事件
      dialogHeaderEl.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;
  
        // 获取到的值带px 正则匹配替换
        let styL, styT;
   
        // 组件自带margin,不能移动到最边边，待解决
        if (sty.left.includes('%')) {
          styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
        } else {
          styL = +sty.left.replace(/\px/g, '');
          styT = +sty.top.replace(/\px/g, '');
        };
   
        // 鼠标拖拽事件
        document.onmousemove = function (e) {
          //计算移动的距离
          const l = e.clientX - disX;
          const t = e.clientY - disY;
  
          let finallyL = l + styL
          let finallyT = t + styT
  
          // 边界值判定 注意clientWidth scrollWidth区别 要减去之前的top left值
          // dragDom.offsetParent表示弹窗阴影部分
          if (finallyL < 0) {
            finallyL = 0
          } else if (finallyL > dragDom.offsetParent.clientWidth - dragDom.clientWidth - dragDom.offsetParent.offsetLeft) {
            finallyL = dragDom.offsetParent.clientWidth - dragDom.clientWidth - dragDom.offsetParent.offsetLeft
          }
  
          if (finallyT < 0) {
            finallyT = 0
          } else if (finallyT > dragDom.offsetParent.clientHeight - dragDom.clientHeight - dragDom.offsetParent.offsetLeft) (
            finallyT = dragDom.offsetParent.clientHeight - dragDom.clientHeight - dragDom.offsetParent.offsetLeft
          )
   
          // 移动当前元素
          dragDom.style.left = `${finallyL}px`;
          dragDom.style.top = `${finallyT}px`;
   
        };
   
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    }
  })