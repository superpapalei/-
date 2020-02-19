<template>
  <div class="controller-container">
    <!-- 定义控件大小范围 -->
    <div :style="{
        height: initHeight + 'px',
        width:
          initWidth.toString().indexOf('%') == -1 ? initWidth + 'px' : initWidth
      }">
      <!-- 画图区域 -->
      <div class="area-paint" :style="{ width: initIsShowDetailArea ? '85%' : '100%' }">
        <!-- 相对日历，只计算跨度，不要求具体时间。此处后面需要修改为兼容相对和绝对 -->
        <div class="table-head-area-container" :style="{
            height: initTableHeadCellHeight * initTableHeadRowNum + 'px'
          }" ref="headAreaContainer">
          <!-- 表头宽度需要加上滚动条宽度20px-->
          <div class="table-head-area"
            :style="{ width: initCellWidth * (tableHeadData2.length ? tableHeadData2.length : 104) + 20 + 'px', height: '100%' }">
            <!-- 第一行表头 -->
            <div>
              <div v-for="(item, index) in tableHeadData1" :key="'year' + index" class="table-head-cell" :style="{
                  width: item.width + 'px',
                  height: initTableHeadCellHeight + 'px',
                  top: 0 + 'px',
                  left: item.left + 'px'
                }">
                <div class="cell-text">{{ item.text }}</div>
              </div>
            </div>
            <!-- 第二行表头-->
            <div>
              <div v-for="(item, index) in tableHeadData2" :key="'week' + index" class="table-head-cell" :style="{
                  width: item.width + 'px',
                  height: initTableHeadCellHeight + 'px',
                  top: initTableHeadCellHeight + 'px',
                  left: item.width * index + 'px'
                }">
                <div class="cell-text">{{ item.text }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 单元格区域 -->
        <div class="table-cell-area-container" :style="{
            height:
              initHeight - initTableHeadCellHeight * initTableHeadRowNum + 'px'
          }" ref="cellAreaContainer">
          <div class="table-cell-area" :style="{
              width: initCellWidth * tableHeadData2.length + 'px',
              height: initCellHeight * initCellRowNum + 'px'
            }">
            <div class="table-row-div">
              <!-- 默认先加载10行initCellRowNum -->
              <div class="table-row" v-for="item in initCellRowNum" :key="'table-row' + (item - 1)" :style="{
                  top: initCellHeight * (item - 1) + 'px',
                  height: initCellHeight + 'px'
                }">
                <div v-for="item2 in tableHeadData2.length" :key="'table-cell' + (item2 - 1)" class="table-cell" :style="{
                    width: initCellWidth + 'px',
                    left: initCellWidth * (item2 - 1) + 'px'
                  }"></div>
              </div>
            </div>
            <!-- 实际拖动的控件区域 -->
            <div class="control-tool-area">
              <!-- 实际拖动的基准节点图标 -->
              <div class="barBlcok divHide" style="top:0;left:0;" ref="controlBarBlcok">
                <div class="qigan"></div>
                <div class="yuan"></div>
                <div class="sanjiao"></div>
                <div class="barText"></div>
              </div>
              <!-- 实际拖动的工作节点图标 -->
              <div class="barBlcok divHide" style="top:0;left:0;" ref="controlBarBlcok_work">
                <!-- <div class="qigan"></div> -->
                <div class="yuan"></div>
                <!-- <div class="sanjiao"></div> -->
                <div class="barText"></div>
              </div>
              <!-- 实际拉出来的虚线 -->
              <div class="dragLine" :style="{
                  top: dragLineControl.top + 'px',
                  left: dragLineControl.left + 'px',
                  width: dragLineControl.width + 'px',
                  transform: 'rotate(' + dragLineControl.transform + 'rad)'
                }"></div>
              <!-- 拖动时显示虚线 -->
            </div>
            <!-- 节点及线等的显示区域 -->
            <div class="bar-area">
              <!-- 第一种节点和第二种的显示区域 -->
              <div>
                <div v-for="(item, index) in barBlcokList" :key="'barBlcok' + index" class="barBlcok"
                  :style="{ top: item.top + 'px', left: item.left + 'px' }" :ref="'barBlcokList_' + index"
                  @mousedown="onMouseDown($event, 'real-barBlcok', index)"
                  @mouseover="onMouseOver($event, index, 'realBarOver')"
                  @mouseout="onMouseOut($event, index, 'realBarOut')"
                  @mouseup="onMouseUp($event, index, 'control-barBlcok')"
                  @dblclick="onDBClick($event, item, index, 'barBlcokList')">
                  <div class="qigan" v-if="item.type == 'base'"></div>
                  <div class="yuan" :class="{ backgroundDo: item.status == 'complete' }"></div>
                  <div class="sanjiao" v-if="item.type == 'base'"></div>
                  <div class="barText" @dblclick.stop.prevent="
                      onDBClick($event, item, index, 'barBlcokListText')
                    ">
                    {{ item.text }}
                  </div>
                </div>
              </div>
              <!-- 第一种节点和第二种的控制点 -->
              <div>
                <div v-for="(item, index) in barBlockControlList" :key="'barBlockControlList' + index"
                  class="barBlockControlRight" :ref="'barBlockControlList_' + index" :style="{
                    top: item.top + 'px',
                    left: item.left + 'px',
                    'background-color': 'rgba(0, 0, 0, 0)'
                  }" @mousedown="onMouseDown($event, 'control-barBlcok', index)"
                  @mouseover="onMouseOver($event, index, 'controlOver')"
                  @mouseout="onMouseOut($event, index, 'controlOut')"></div>
              </div>
              <!-- 实际连接线条的集合 -->
              <div>
                <!-- 线条和箭头的容器 -->
                <div v-for="(lineArr, lineArrIndex) in dragLineList" :key="'dragLineList' + lineArrIndex">
                  <div v-for="(line, index) in lineArr.lineList" :key="'lineList' + index" class="lineContainer"
                    :class="{ divHide: !lineArr.show }" :style="{
                      width: line.width + 'px',
                      height: line.height + 'px',
                      left: line.left + 'px',
                      top: line.top + 'px',
                      'padding-top':
                        line.arrow && line.arrowDir == 'top' ? '6px' : '0px',
                      'padding-right':
                        line.arrow && line.arrowDir == 'right' ? '6px' : '0px',
                      'padding-bottom':
                        line.arrow && line.arrowDir == 'bottom' ? '6px' : '0px',
                      'padding-left':
                        line.arrow && line.arrowDir == 'left' ? '6px' : '0px'
                    }">
                    <!-- 文字在哪个线上根据横线的长度决定 -->
                    <div class="lineText" :class="{
                        'lineText-horizental': lineArr.textDir == 'horizental',
                        'lineText-vertical': lineArr.textDir == 'vertical'
                      }" v-if="lineArr.textDir == line.type" @dblclick="
                        onDBClick($event, lineArr, lineArrIndex, 'lineText')
                      ">
                      {{ lineArr.text }}
                    </div>
                    <!-- 根据是否有箭头和箭头的方向取不同的class -->
                    <div class="connentLine" :class="{
                        'connentLine-vertical':
                          line.type == 'vertical' && line.borderType != 'dash',
                        'connentLine-vertical-dash':
                          line.type == 'vertical' && line.borderType == 'dash',
                        'connentLine-vertical-scale100':
                          line.type == 'vertical' && !line.arrow,
                        'connentLine-vertical-scale99':
                          line.type == 'vertical' && line.arrow,
                        'connentLine-vertical-bottom':
                          line.arrow && line.arrowDir == 'bottom',
                        'connentLine-vertical-top':
                          line.arrow && line.arrowDir == 'top',
                        'connentLine-horizental':
                          line.type == 'horizental' &&
                          line.borderType != 'dash',
                        'connentLine-horizental-dash':
                          line.type == 'horizental' &&
                          line.borderType == 'dash',
                        'connentLine-horizental-scale100':
                          line.type == 'horizental' && !line.arrow,
                        'connentLine-horizental-scale99':
                          line.type == 'horizental' && line.arrow,
                        'connentLine-horizental-right':
                          line.arrow && line.arrowDir == 'right',
                        'connentLine-horizental-left':
                          line.arrow && line.arrowDir == 'left'
                      }" :ref="'dragLineList' + lineArrIndex + 'lineList' + index"
                      @mouseover="onMouseOver($event, lineArrIndex, 'lineOver')"
                      @mouseout="onMouseOut($event, lineArrIndex, 'lineOut')" @dblclick="
                        onDBClick(
                          $event,
                          lineArr,
                          lineArrIndex,
                          'lineContainer'
                        )
                      "></div>
                    <!-- 箭头的方向class -->
                    <div :class="{
                        'lineArrow-base': line.arrow,
                        'lineArrow-top': line.arrow && line.arrowDir == 'top',
                        'lineArrow-right':
                          line.arrow && line.arrowDir == 'right',
                        'lineArrow-bottom':
                          line.arrow && line.arrowDir == 'bottom',
                        'lineArrow-left': line.arrow && line.arrowDir == 'left'
                      }"></div>
                  </div>
                </div>
              </div>
              <!-- 实际线条对应的虚线 -->
              <div>
                <div v-for="(dashLine, index) in dragLineDashList" :key="'dashLine' + index" class="dragLine"
                  :class="{ divHide: !dashLine.show }" :style="{
                    top: dashLine.top + 'px',
                    left: dashLine.left + 'px',
                    width: dashLine.width + 'px',
                    transform: 'rotate(' + dashLine.transform + 'rad)'
                  }"></div>
              </div>
            </div>
          </div>
          <!-- 工具栏区域 -->
          <div class="tool-split" :style="{
              width: toolBarCollapse ? '8px' : initToolBarWidth + 'px',
              height: initToolBarHeight + 'px',
              top: toolBarTop + 'px',
              left: toolBarLeft + 'px'
            }">
            <div class="tool-area" :style="{
                width: toolBarCollapse ? '0px' : initToolBarWidth - 8 + 'px'
              }">
              <div class="tool-item">
                <!-- 工具栏基准节点图标 -->
                <div class="barBlcok" :class="{ divHide: toolBarCollapse }"
                  @mousedown.stop.prevent="onMouseDown($event, 'tool-barBlcok')">
                  <div class="qigan"></div>
                  <div class="yuan"></div>
                  <div class="sanjiao"></div>
                  <div class="barText">基准节点</div>
                </div>
              </div>
              <div class="tool-item">
                <!-- 工具栏工作节点图标 -->
                <div class="barBlcok" :class="{ divHide: toolBarCollapse }" @mousedown.stop.prevent="
                    onMouseDown($event, 'tool-barBlcok-work')
                  ">
                  <!-- <div class="qigan"></div> -->
                  <div class="yuan"></div>
                  <!-- <div class="sanjiao"></div> -->
                  <div class="barText">作业节点</div>
                </div>
              </div>
              <div class="tool-item"></div>
            </div>
            <div class="tool-split-bar">
              <div class="split-toogle" :class="{
                  'split-toogle-left': !toolBarCollapse,
                  'split-toogle-right': toolBarCollapse
                }" @click="toogleSplit"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 图示区域 -->
      <div class="area-graphic-expression" v-show="initIsShowDetailArea"></div>
    </div>
    <!-- barblock里面的input不能编辑，暂时用弹出层来解决 -->
    <el-dialog :visible.sync="isEdit" width="250px" title="编辑文字" top="40vh">
      <input type="text" v-model="editText" @focus="onFocus" ref="inputVal" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEdit = false" size="small">取 消</el-button>
        <el-button type="primary" @click="editInput" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // data: Array, //传入的数据
    value: {
      //传入的数据,使用v-model方式传入
      type: Array,
      default: () => []
    },
    height: Number, //整个控件的高度（不要使用百分比，计算不出来）
    width: [String, Number], //整个控件的宽度（没有地方用到，可以使用百分比）
    cellHeight: Number, //画图区域单元格高度(再小可能放不下了)
    cellWidth: Number, //画图区域单元格宽度
    tableHeadCellHeight: Number, //表头单元格高度
    cellRowNum: Number, //初始显示行数
    isShowDetailArea: {
      type: Boolean,
      default: undefined
    }, //是否显示右边区域
    toolBarCollapsed: {
      type: Boolean,
      default: undefined
    }, //左边工具栏是否初始折叠
    toolBarHeight: Number, //工具栏高度
    toolBarWidth: Number, //工具栏宽度
    loadDataRowNum: Number, //初始加载数据所在行数
    XAisWeltAuto: {
      type: Boolean,
      default: undefined
    }, //横坐标自动贴边
    hightLightNo: Number //绑定高亮事件
  },
  watch: {
    value: {
      handler() {
        if (!this.dataChange) {
          for (var i = 0; i < this.data.length; i++) {
            var connectBlcok = this.barBlcokList.filter(
              item => item.dataNo == this.data[i].no
            );
            if (connectBlcok.length > 0) {
              //说明改变的是节点数据
              connectBlcok = connectBlcok[0];
              if (connectBlcok.text != this.data[i].TaskName) {
                //文字的改变
                connectBlcok.text = this.data[i].TaskName;
              }
              if (
                this.formatDate(connectBlcok.dateData) !=
                this.formatDate(this.data[i].EndTime)
              ) {
                //结束时间改变
                connectBlcok.dateData = new Date(this.data[i].EndTime);
                //计算时间跨度
                var left =
                  ((connectBlcok.dateData.getTime() -
                    this.startAxisTime.getTime()) /
                    86400000) *
                    (this.initCellWidth / this.unitCellDay) -
                  15;
                connectBlcok.left = left;
                //寻找相关联的线
                var connectLineList = this.dragLineList.filter(
                  item =>
                    item.star == connectBlcok.no || item.end == connectBlcok.no
                );
                if (connectLineList.length > 0) {
                  for (var l = 0; l < connectLineList.length; l++) {
                    var lineConnect = connectLineList[l];
                    this.changeLine(lineConnect, connectBlcok, true);
                  }
                }
              }
            } else {
              //说明改变的是线数据
              connectBlcok = this.dragLineList.filter(
                item => item.dataNo == this.data[i].no
              );
              if (connectBlcok.length > 0) {
                connectBlcok = connectBlcok[0];
                if (connectBlcok.text != this.data[i].TaskName) {
                  //文字的改变
                  connectBlcok.text = this.data[i].TaskName;
                }
                //寻找线两端的端点
                var connectBlcokList = this.barBlcokList.filter(
                  item =>
                    item.no == connectBlcok.star || item.no == connectBlcok.end
                );
                if (connectBlcokList.length == 2) {
                  var barBlock1 = []; //起始节点
                  var barBlock2 = []; //结束节点
                  if (connectBlcokList[0].no == connectBlcok.star) {
                    barBlock1 = connectBlcokList[0];
                    barBlock2 = connectBlcokList[1];
                  } else {
                    barBlock1 = connectBlcokList[1];
                    barBlock2 = connectBlcokList[0];
                  }
                  //只有非基准节点才要改变，基准节点在上面已经改变了
                  if (
                    barBlock1.type == "work" &&
                    this.formatDate(barBlock1.dateData) !=
                      this.formatDate(this.data[i].StartTime)
                  ) {
                    //结束时间改变
                    barBlock1.dateData = new Date(this.data[i].StartTime);
                    //计算时间跨度
                    var left =
                      ((barBlock1.dateData.getTime() -
                        this.startAxisTime.getTime()) /
                        86400000) *
                        (this.initCellWidth / this.unitCellDay) -
                      15;
                    barBlock1.left = left;
                    //获得与这个节点相关联的线段
                    var connectLineList = this.dragLineList.filter(
                      item =>
                        item.star == barBlock1.no || item.end == barBlock1.no
                    );
                    if (connectLineList.length > 0) {
                      for (var l = 0; l < connectLineList.length; l++) {
                        var lineConnect = connectLineList[l];
                        this.changeLine(lineConnect, barBlock1, true);
                      }
                    }
                  }
                  if (
                    barBlock2.type == "work" &&
                    this.formatDate(barBlock2.dateData) !=
                      this.formatDate(this.data[i].EndTime)
                  ) {
                    //结束时间改变
                    barBlock2.dateData = new Date(this.data[i].EndTime);
                    //计算时间跨度
                    var left =
                      ((barBlock2.dateData.getTime() -
                        this.startAxisTime.getTime()) /
                        86400000) *
                        (this.initCellWidth / this.unitCellDay) -
                      15;
                    barBlock2.left = left;
                    //获得与这个节点相关联的线段
                    var connectLineList = this.dragLineList.filter(
                      item =>
                        item.star == barBlock2.no || item.end == barBlock2.no
                    );
                    if (connectLineList.length > 0) {
                      for (var l = 0; l < connectLineList.length; l++) {
                        var lineConnect = connectLineList[l];
                        this.changeLine(lineConnect, barBlock2, true);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.dataChange = false;
      },
      deep: true
    },
    height() {
      this.initAttribute();
    },
    width() {
      this.initAttribute();
    },
    cellHeight() {
      this.initAttribute();
    },
    cellWidth() {
      this.initAttribute();
    },
    tableHeadCellHeight() {
      this.initAttribute();
    },
    cellRowNum() {
      this.initAttribute();
    },
    isShowDetailArea() {
      this.initAttribute();
    },
    toolBarCollapsed() {
      this.initAttribute();
    },
    toolBarHeight() {
      this.initAttribute();
    },
    toolBarWidth() {
      this.initAttribute();
    },
    loadDataRowNum() {
      this.initAttribute();
    },
    XAisWeltAuto() {
      this.initAttribute();
    },
    hightLightNo() {
      if (this.hightLightNo) {
        for (var i = 0; i < this.dragLineList.length; i++) {
          this.onMouseOut(null, i, "lineOut");
        }
        var lineConnect = this.dragLineList.filter(
          item => item.dataNo == this.hightLightNo
        );
        if (lineConnect.length > 0) {
          lineConnect = lineConnect[0];
          var index = this.dragLineList.indexOf(lineConnect);
          this.onMouseOver(null, index, "lineOver");
          var startBlock = this.barBlcokList.filter(
            item => item.no == lineConnect.star
          )[0];
          this.$refs.cellAreaContainer.scrollLeft = startBlock.left - 100;
        }
      }
    }
  },
  data() {
    return {
      data: this.value,
      initHeight: 650, //整个控件的高度（不要使用百分比，计算不出来）
      initWidth: "100%", //整个控件的宽度（没有地方用到，可以使用百分比）
      initCellHeight: 60, //画图区域单元格高度(再小可能放不下了)
      initCellWidth: 84, //画图区域单元格宽度
      initTableHeadCellHeight: 40, //表头单元格高度
      initTableHeadRowNum: 2, //初始表头行数（后面需要计算得出）
      initCellRowNum: 10, //初始显示行数
      initIsShowDetailArea: false, //是否显示右边区域（暂时没想到放什么，估计可以放图示）
      initToolBarCollapsed: false, //左边工具栏是否初始折叠
      initToolBarHeight: 350, //工具栏高度
      initToolBarWidth: 60, //工具栏宽度
      initXAisWeltAuto: true, //横坐标是否自动贴边，可以精确到天或者小时
      initLoadDataRowNum: 3, //初始加载数据所在行数
      tableHeadData1: [],
      tableHeadData2: [],
      toolBarCollapse: false, //工具栏是否被折叠标志
      toolBarTop: 0, //工具栏距离画图顶部的距离实际
      toolBarLeft: 0, //工具栏左边距离跟随滚动条
      isDown: false, //鼠标是否按下
      moveDiv: [], //当前操作的块
      moveDivIndex: [], //当前块索引
      moveLine: [], //当前操作块关联的线条
      xPoint: 0, //当前鼠标x坐标
      yPoint: 0, //当亲鼠标y坐标
      topPonit: 0, //当前块离顶部的位置
      leftPoint: 0, //当前块离左边位置
      operationType: "", //操作类型
      barBlcokList: [], //节点集合,需要属性，编号(连接线的时候需要用)，top，left，text
      lineLis: [], //线集合
      isEdit: false, //进入编辑状态。barblock里面的input不能编辑，暂时用弹出层来解决
      editText: "", //正在编辑的文字
      editType: "", //编辑文字的类型，编辑节点文字，编辑线文字
      dragLineControl: {
        top: 0,
        left: 0,
        width: 0,
        transform: 0
      }, //总体拉出来的线
      dragLineList: [], //线的集合，暂时确定每条线最多一个折
      dragLineDashList: [], // 线转化成的虚线集合
      moveDiveConnectLine: [], // 移动的div相关联的线的no集合
      unitCellDay: 7, //单元格代表的天数
      startAxisTime: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ), //x轴开始时间,如果一开始没有数据，默认为今天。相对时间
      axisType: "relative", //坐标轴类型 相对relative 绝对absolute
      dataChange: false
    };
  },
  computed: {
    //控件的控制块使用computed加载
    barBlockControlList() {
      var barBlockControlListTemp = [];
      for (var i = 0; i < this.barBlcokList.length; i++) {
        barBlockControlListTemp.push({
          no: this.barBlcokList[i].no,
          top: this.barBlcokList[i].top,
          left: this.barBlcokList[i].left
        });
      }
      return barBlockControlListTemp;
    }
  },
  methods: {
    //收起展开工具栏
    toogleSplit() {
      this.toolBarCollapse = !this.toolBarCollapse;
    },
    //鼠标按下，表明要开始拖动，赋予各初始值
    onMouseDown(e, type, index) {
      //标识为鼠标按下
      this.isDown = true;
      //获取x,y坐标
      this.xPoint = e.clientX;
      this.yPoint = e.clientY;
      //赋予操作类型
      this.operationType = type;
      if (type == "tool-barBlcok") {
        //第一种情况，拖拽工具栏里的【基准节点】工具
        //鼠标按下时，初始化控件位置，实际拖动的是一个隐藏的div，left要根据滚动条来算
        this.moveDiv = this.$refs.controlBarBlcok;
        let scrollLeft = this.$refs.cellAreaContainer.scrollLeft; //获取滚动条
        this.moveDiv.style.top = this.toolBarTop + 5 + "px"; //第一个距离上面 toolBarTop + 5  #0002(由于外层有个border所以这里会少1，给与视觉上点出来了)
        this.topPonit = this.toolBarTop + 5;
        this.moveDiv.style.left = 10 + scrollLeft + "px"; //左边10+滚动条  #0001
        this.leftPoint = 10 + scrollLeft;
        this.moveDiv.classList.remove("divHide"); //显示出来
      } else if (type == "tool-barBlcok-work") {
        //第二种情况，拖拽工具栏里的【工作节点】工具
        //鼠标按下时，初始化控件位置，实际拖动的是一个隐藏的div，left要根据滚动条来算
        this.moveDiv = this.$refs.controlBarBlcok_work;
        let scrollLeft = this.$refs.cellAreaContainer.scrollLeft; //获取滚动条
        this.moveDiv.style.top = this.toolBarTop + 52 + 5 + "px"; //第二个距离上面 toolBarTop + 52+ 5  #0002(由于外层有个border所以这里会少1，给与视觉上点出来了)
        this.topPonit = this.toolBarTop + 52 + 5;
        this.moveDiv.style.left = 10 + scrollLeft + "px"; //左边10+滚动条  #0001
        this.leftPoint = 10 + scrollLeft;
        this.moveDiv.classList.remove("divHide"); //显示出来
      } else if (type == "real-barBlcok") {
        //操作真正的节点
        this.moveDiv = e.currentTarget;
        this.moveDivIndex = index;
        this.topPonit = Number(this.moveDiv.style.top.replace("px", ""));
        this.leftPoint = Number(this.moveDiv.style.left.replace("px", ""));
        //获取相关联的线条
        var connectLineList = this.dragLineList.filter(
          item =>
            item.star == this.barBlcokList[this.moveDivIndex].no ||
            item.end == this.barBlcokList[this.moveDivIndex].no
        );
        if (connectLineList.length > 0) {
          for (var i = 0; i < connectLineList.length; i++) {
            this.moveDiveConnectLine.push(connectLineList[i].no);
          }
        }
      } else if (type == "control-barBlcok") {
        this.moveDivIndex = index;
      }
    },
    //双击事件
    onDBClick(e, item, index, type) {
      if (type == "barBlcokListText" || type == "lineText") {
        this.isEdit = true;
        this.editText = item.text;
        this.editType = type;
        this.moveDivIndex = index;
        this.$nextTick(function() {
          //DOM 更新后获得焦点
          this.$refs.inputVal.focus();
        });
      } else if (type == "lineContainer") {
        this.$confirm("是否删除该线条？", "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
          .then(() => {
            this.dragLineList.splice(index, 1);
            this.dragLineDashList.splice(index, 1);
          })
          .catch(() => {});
      } else if (type == "barBlcokList") {
        this.$confirm("是否删除该节点？与该节点相关的线将一并删除！", "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
          .then(() => {
            //获取相关联的线条
            var connectLineList = this.dragLineList.filter(
              item =>
                item.star == this.barBlcokList[index].no ||
                item.end == this.barBlcokList[index].no
            );
            if (connectLineList.length > 0) {
              for (var i = this.dragLineList.length - 1; i >= 0; i--) {
                if (
                  connectLineList.filter(
                    item => item.no == this.dragLineList[i].no
                  ).length > 0
                ) {
                  //删除关联线条
                  this.dragLineList.splice(i, 1);
                  this.dragLineDashList.splice(i, 1);
                }
              }
            }
            this.barBlcokList.splice(index, 1);
          })
          .catch(() => {});
      }
    },
    //获得焦点时选中全部文字
    onFocus(e) {
      e.currentTarget.select();
    },
    //编辑文字
    editInput() {
      if (this.editType == "barBlcokListText") {
        this.barBlcokList[this.moveDivIndex].text = this.editText;
        if (this.barBlcokList[this.moveDivIndex].dataNo) {
          var connectData = this.data.filter(
            item => item.no == this.barBlcokList[this.moveDivIndex].dataNo
          );
          if (connectData.length > 0) {
            connectData = connectData[0];
            connectData.TaskName = this.editText;
            this.$emit("input", this.data);
            this.dataChange = true;
          }
        }
      } else if (this.editType == "lineText") {
        this.dragLineList[this.moveDivIndex].text = this.editText;
        if (this.dragLineList[this.moveDivIndex].dataNo) {
          var connectData = this.data.filter(
            item => item.no == this.dragLineList[this.moveDivIndex].dataNo
          );
          if (connectData.length > 0) {
            connectData = connectData[0];
            connectData.TaskName = this.editText;
            this.$emit("input", this.data);
            this.dataChange = true;
          }
        }
      }
      this.isEdit = false;
    },
    onMouseOver(e, index, type) {
      if (this.operationType == "control-barBlcok") return;
      if (type == "controlOver") {
        e.currentTarget.style.backgroundColor = "rgba(224, 224, 224, 224)"; //显示控制块
      } else if (type == "realBarOver") {
        this.$refs["barBlockControlList_" + index][0].style.backgroundColor =
          "rgba(224, 224, 224, 224)"; //显示控制块
      } else if (type == "lineOver") {
        var line1 = this.$refs["dragLineList" + index + "lineList" + 0][0];
        var line2 = this.$refs["dragLineList" + index + "lineList" + 1][0];
        line1.style.boxShadow = "0 0 3px #ffa011";
        line1.style.cursor = "pointer";
        line2.style.boxShadow = "0 0 3px #ffa011"; //高亮
        line2.style.cursor = "pointer";
      }
    },
    onMouseOut(e, index, type) {
      if (type == "controlOut") {
        e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0)"; //隐藏控制块
      } else if (type == "realBarOut") {
        this.$refs["barBlockControlList_" + index][0].style.backgroundColor =
          "rgba(0, 0, 0, 0)"; //隐藏控制块
      } else if (type == "lineOut") {
        var line1 = this.$refs["dragLineList" + index + "lineList" + 0][0];
        var line2 = this.$refs["dragLineList" + index + "lineList" + 1][0];
        line1.style.boxShadow = "";
        line1.style.cursor = "default";
        line2.style.boxShadow = ""; //取消高亮
        line2.style.cursor = "default";
      }
    },
    onMouseUp(e, index, type) {
      if (
        this.operationType == "control-barBlcok" &&
        type == "control-barBlcok"
      ) {
        //第一种情况，第一种控件拉出，在第一种控件放下。
        //看两个控件之间有没有线，有就不操作
        var lineLive = this.dragLineList.filter(
          item =>
            (item.star == this.barBlcokList[this.moveDivIndex].no &&
              item.end == this.barBlcokList[index].no) ||
            (item.star == this.barBlcokList[index].no &&
              item.end == this.barBlcokList[this.moveDivIndex].no)
        );
        if (lineLive.length > 0) return;
        if (this.moveDivIndex == index) return;
        var barBlock1 = this.barBlcokList[this.moveDivIndex]; //拉出线的那个
        var barBlock2 = this.barBlcokList[index]; //放下鼠标的那个
        var taskName = "新任务";

        var realNo = "";
        var maxNo = this.data.length
          ? Math.max.apply(
              Math,
              this.data.map(item => {
                return item.no;
              })
            ) + 10
          : 10;
        realNo = maxNo;
        if (barBlock2.type == "base") {
          //如果也是基准节点，往后移动一位
          var noData = this.data.filter(item => item.no == barBlock2.dataNo)[0];
          realNo = noData.no;
          noData.no = maxNo;
          barBlock2.dataNo = maxNo;
        }
        var lineData = {
          no: realNo,
          TaskName: taskName,
          StartTime: this.formatDate(barBlock1.dateData),
          EndTime: this.formatDate(barBlock2.dateData)
        };
        this.data.push(lineData);
        this.addLine(barBlock1, barBlock2, "solid", lineData);
        this.$emit("input", this.data);
        this.dataChange = true;
      }
    },
    //添加线的方法，前面连到后面，注意传入顺序
    addLine(barBlock1, barBlock2, lineType, lineData) {
      //获取两个控件之间的相对位置
      var no =
        this.dragLineList.length == 0
          ? 0
          : this.dragLineList[this.dragLineList.length - 1].no + 1;
      var lineArr = {
        no: no,
        star: barBlock1.no,
        end: barBlock2.no,
        textDir: "",
        text: lineData.TaskName,
        lineList: [],
        show: true,
        dataNo: lineData.no
      };
      //每组线由两个部分组成，竖直线，水平线。分别计算
      //长度
      var lineWidth = Math.abs(barBlock2.left - barBlock1.left);
      var trueLineWidth = Math.abs(barBlock2.left - barBlock1.left); //真正的跨度
      //高度
      var lineHeight = Math.abs(barBlock2.top - barBlock1.top);
      var widthLeft = 0;
      var heightLeft = barBlock1.left + 15 - 10; //竖线的left以拉出线的那个为准 减去线宽一半10 #0005 #0009
      var widthTop = barBlock2.top + 20 + 7.5 - 10; // 横线的top以放下鼠标那个top为准 减去线高的一半 #0006 #0007 #0009
      var heightTop = 0;
      var widthDir = "";
      if (barBlock2.left - barBlock1.left > 0) {
        widthDir = "right"; //往右连
        if (lineHeight == 0) {
          widthLeft = barBlock1.left + 15 + 7.5; //横线的left以靠左边那个left为准 #0005 #0006
          lineWidth = lineWidth - 15; // #0006
        } else {
          widthLeft = barBlock1.left + 15 - 1; //稍微有个1px的偏移，更能连在一起 #0005 #0006
          lineWidth = lineWidth - 7.5 + 1; //稍微有个1px的偏移，更能连在一起 #0006
        }
      } else if (barBlock2.left - barBlock1.left < 0) {
        widthDir = "left"; //往左连
        widthLeft = barBlock2.left + 15 + 7.5; //横线的left以靠左边那个left为准 #0005 #0006
        if (lineHeight == 0) {
          //如果没有竖直线，水平线要短一点
          lineWidth = lineWidth - 15; // #0006
        } else {
          lineWidth = lineWidth - 7.5 + 1; // 稍微有个1px的偏移，更能连在一起 #0006
        }
      }
      if (lineWidth < 7) lineWidth = 0; //留下线的箭头的距离 如果没有箭头，就连到上面 #0008
      var heightDir = "";
      if (barBlock2.top - barBlock1.top > 0) {
        heightDir = "bottom"; //往下连
        if (lineWidth == 0) {
          //如果没有水平线，竖直线要短一点
          lineHeight = lineHeight - 50; //#0005
          heightTop = barBlock1.top + 50; //#0005
        } else {
          lineHeight = lineHeight - 50 + 20 + 7.5; //#0005 #0006 #0007
          heightTop = barBlock1.top + 50 + 1; //稍微有个1px的偏移，更能连在一起 #0005
        }
      } else if (barBlock2.top - barBlock1.top < 0) {
        heightDir = "top"; //往上连
        if (lineWidth == 0) {
          //如果没有水平线，竖直线要短一点
          lineHeight = lineHeight - 50; //#0005
          heightTop = barBlock1.top - lineHeight; //#0005
        } else {
          lineHeight = lineHeight - 20 - 7.5; // #0006 #0007
          heightTop = barBlock1.top - lineHeight - 1; //稍微有个1px的偏移，更能连在一起
        }
        if (barBlock1.type == "work") {
          //需要变更长度的只有一种情况，即从工作节点拉出线并向上走的时候
          lineHeight = lineHeight + 20; //加上旗杆的长度  #0007
        }
      }
      //添加竖直线
      lineArr.lineList.push({
        type: "vertical",
        borderType: lineType,
        width: 20, //#0009
        height: lineHeight,
        left: heightLeft,
        top: heightTop,
        arrow: lineWidth == 0,
        arrowDir: heightDir,
        trueLineWidth: trueLineWidth
      });
      //添加水平线
      lineArr.lineList.push({
        type: "horizental",
        borderType: lineType,
        width: lineWidth,
        height: 20, //#0009
        left: widthLeft,
        top: widthTop,
        arrow: lineWidth != 0,
        arrowDir: widthDir,
        trueLineWidth: trueLineWidth
      });
      lineArr.textDir =
        lineWidth > 50 || lineHeight == 0 ? "horizental" : "vertical";
      this.dragLineList.push(lineArr);
      //添加虚线，起点为拉出线条的控件。后面如果要拖动，再来改变起点等属性
      var dashLeft = barBlock1.left + 15; // #0005
      var dashLeft2 = barBlock2.left + 15; // #0005
      var dashTop = barBlock1.top + 20 + 7.5; // #0006 #0007
      var dashTop2 = barBlock2.top + 20 + 7.5; // #0006 #0007
      var relativeMoveX = dashLeft2 - dashLeft;
      var relativeMoveY = dashTop2 - dashTop;
      //求弧度
      var rad = Math.atan(relativeMoveY / relativeMoveX);
      if (dashLeft2 < dashLeft) {
        if (dashTop2 <= dashTop) {
          rad += Math.PI;
        } else {
          rad -= Math.PI;
        }
      }
      var dashWidth = Math.sqrt(
        relativeMoveX * relativeMoveX + relativeMoveY * relativeMoveY,
        2
      );
      this.dragLineDashList.push({
        no: no,
        top: dashTop,
        left: dashLeft,
        width: dashWidth,
        transform: rad,
        show: false
      });
    },
    changeLine(lineConnect, connectBlcok, changeData) {
      var otherDiv = [];
      var otherNo = 0;
      var barBlock1 = []; //拉出线的那个
      var barBlock2 = []; //放下鼠标的那个
      var changeTime = new Date(
        ((connectBlcok.left + 15) / (this.initCellWidth / this.unitCellDay)) *
          86400000 +
          this.startAxisTime.getTime()
      );
      if (lineConnect.star == connectBlcok.no) {
        //线开始的节点
        otherNo = lineConnect.end;
        barBlock1 = connectBlcok;
        if (changeData) {
          if (this.data && this.data.length) {
            var connectData = this.data.filter(
              item => item.no == lineConnect.dataNo
            );
            if (connectData.length > 0) {
              connectData = connectData[0];
              connectData.StartTime = this.formatDate(changeTime);
              this.$emit("input", this.data);
              this.dataChange = true;
            }
          }
        }
      } else if (lineConnect.end == connectBlcok.no) {
        otherNo = lineConnect.star;
        barBlock2 = connectBlcok;
        if (changeData) {
          if (this.data && this.data.length) {
            var connectData = this.data.filter(
              item => item.no == lineConnect.dataNo
            );
            if (connectData.length > 0) {
              connectData = connectData[0];
              connectData.EndTime = this.formatDate(changeTime);
              this.$emit("input", this.data);
              this.dataChange = true;
            }
          }
        }
      }
      if (otherNo < 10000) {
        //说明是barblocklist控件
        otherDiv = this.barBlcokList.filter(item => item.no == otherNo)[0];
        if (barBlock1 && barBlock1.no >= 0) barBlock2 = otherDiv;
        else barBlock1 = otherDiv;
      } else if (otherNo >= 10000) {
        //其他控件
      }
      if (otherDiv) {
        //每组线由两个部分组成，竖直线，水平线。分别计算
        //长度
        var lineWidth = Math.abs(barBlock2.left - barBlock1.left);
        var trueLineWidth = Math.abs(barBlock2.left - barBlock1.left); //真正的跨度
        //高度
        var lineHeight = Math.abs(barBlock2.top - barBlock1.top);
        var widthLeft = 0;
        var heightLeft = barBlock1.left + 15 - 10; //竖线的left以拉出线的那个为准 减去线宽一半10 #0005 #0009
        var widthTop = barBlock2.top + 20 + 7.5 - 10; // 横线的top以放下鼠标那个top为准 减去线高的一半 #0006 #0007 #0009
        var heightTop = 0;
        var widthDir = "";
        if (barBlock2.left - barBlock1.left > 0) {
          widthDir = "right"; //往右连
          if (lineHeight == 0) {
            widthLeft = barBlock1.left + 15 + 7.5; //横线的left以靠左边那个left为准 #0005 #0006
            lineWidth = lineWidth - 15; // #0006
          } else {
            widthLeft = barBlock1.left + 15 - 1; //稍微有个1px的偏移，更能连在一起 #0005 #0006
            lineWidth = lineWidth - 7.5 + 1; //稍微有个1px的偏移，更能连在一起 #0006
          }
        } else if (barBlock2.left - barBlock1.left < 0) {
          widthDir = "left"; //往左连
          widthLeft = barBlock2.left + 15 + 7.5; //横线的left以靠左边那个left为准 #0005 #0006
          if (lineHeight == 0) {
            //如果没有竖直线，水平线要短一点
            lineWidth = lineWidth - 15; // #0006
          } else {
            lineWidth = lineWidth - 7.5 + 1; // 稍微有个1px的偏移，更能连在一起 #0006
          }
        }
        if (lineWidth < 7) lineWidth = 0; //留下线的箭头的距离 如果没有箭头，就连到上面 #0008
        var heightDir = "";
        if (barBlock2.top - barBlock1.top > 0) {
          heightDir = "bottom"; //往下连
          if (lineWidth == 0) {
            //如果没有水平线，竖直线要短一点
            lineHeight = lineHeight - 50; //#0005
            heightTop = barBlock1.top + 50; //#0005
          } else {
            lineHeight = lineHeight - 50 + 20 + 7.5; //#0005 #0006 #0007
            heightTop = barBlock1.top + 50 + 1; //稍微有个1px的偏移，更能连在一起 #0005
          }
        } else if (barBlock2.top - barBlock1.top < 0) {
          heightDir = "top"; //往上连
          if (lineWidth == 0) {
            //如果没有水平线，竖直线要短一点
            lineHeight = lineHeight - 50; //#0005
            heightTop = barBlock1.top - lineHeight; //#0005
          } else {
            lineHeight = lineHeight - 20 - 7.5; // #0006 #0007
            heightTop = barBlock1.top - lineHeight - 1; //稍微有个1px的偏移，更能连在一起
          }
          if (barBlock1.type == "work") {
            //需要变更长度的只有一种情况，即从工作节点拉出线并向上走的时候
            lineHeight = lineHeight + 20; //加上旗杆的长度  #0007
          }
        }
        //修改竖直线
        var lineConnectV = lineConnect.lineList.filter(
          item => item.type == "vertical"
        )[0];
        if (lineConnectV) {
          lineConnectV.height = lineHeight;
          lineConnectV.left = heightLeft;
          lineConnectV.top = heightTop;
          lineConnectV.arrow = lineWidth == 0;
          lineConnectV.arrowDir = heightDir;
          lineConnectV.trueLineWidth = trueLineWidth;
        }
        //修改水平线
        var lineConnectH = lineConnect.lineList.filter(
          item => item.type == "horizental"
        )[0];
        if (lineConnectH) {
          lineConnectH.width = lineWidth;
          lineConnectH.left = widthLeft;
          lineConnectH.top = widthTop;
          lineConnectH.arrow = lineWidth != 0;
          lineConnectH.arrowDir = widthDir;
          lineConnectH.trueLineWidth = trueLineWidth;
        }
        //文字方向
        lineConnect.textDir =
          lineWidth > 50 || lineHeight == 0 ? "horizental" : "vertical";
      }
    },
    formatDate(date) {
      if (date != null) {
        date = new Date(date);
        var month = date.getMonth() + 1;
        if (month < 10) month = "0" + month;
        var day = date.getDate();
        if (day < 10) day = "0" + day;
        return date.getFullYear() + "-" + month + "-" + day;
      }
    },
    //扩展时间，开始时间往前1个月，结束时间往后一年
    expandTime(t1, t2) {
      var minTime = new Date(t1);
      var maxTime = new Date(t2);
      minTime = new Date(minTime.setMonth(minTime.getMonth() - 1));
      maxTime = new Date(maxTime.setYear(maxTime.getFullYear() + 1));
      //如果开始时间不是星期天，往前减去
      if (minTime.getDay() != 0) {
        minTime = new Date(
          minTime.setDate(minTime.getDate() - minTime.getDay())
        );
      }
      //如果结束时间不是星期六，往后加
      if (maxTime.getDay() != 6) {
        maxTime = new Date(
          maxTime.setDate(maxTime.getDate() - maxTime.getDay() + 6)
        );
      }
      return [minTime, maxTime];
    },
    //初始化坐标轴
    initAxis() {
      this.tableHeadData1 = [];
      this.tableHeadData2 = [];
      var minTime = null;
      var maxTime = null;
      if (this.data && this.data.length > 0) {
        //获得最小和最大的时间，这里先不绑定字段
        for (var i = 0; i < this.data.length; i++) {
          var dtData = this.data[i];
          if (dtData.StartTime) {
            if (
              !minTime ||
              (minTime && new Date(minTime) > new Date(dtData.StartTime))
            ) {
              minTime = dtData.StartTime;
            }
          }
          if (dtData.EndTime) {
            if (
              !maxTime ||
              (maxTime && new Date(maxTime) < new Date(dtData.EndTime))
            ) {
              maxTime = dtData.EndTime;
            }
          }
        }
        this.axisType = "absolute"; //绝对坐标
      } else {
        minTime = new Date(this.startAxisTime.getTime());
        maxTime = new Date(this.startAxisTime.getTime());
        this.axisType = "relative"; //相对坐标
      }
      [minTime, maxTime] = this.expandTime(minTime, maxTime);
      this.startAxisTime = minTime;
      for (
        var nowTime = new Date(minTime);
        nowTime <= maxTime;
        nowTime = new Date(nowTime.setDate(nowTime.getDate() + 7))
      ) {
        var weekEnd = new Date(nowTime.getTime());
        weekEnd = new Date(weekEnd.setDate(weekEnd.getDate() + 6));
        this.tableHeadData2.push({
          width: this.initCellWidth,
          text: nowTime.getDate() + "~" + weekEnd.getDate()
        });
      }
      var nowMonth = new Date(minTime.getTime());
      nowMonth = new Date(nowMonth.setDate(1));
      var leftAcc = 0;
      for (
        ;
        nowMonth <= maxTime;
        nowMonth = new Date(nowMonth.setMonth(nowMonth.getMonth() + 1))
      ) {
        //获取每个月的天数
        var monthDay = new Date(
          nowMonth.getFullYear(),
          nowMonth.getMonth() + 1,
          0
        ).getDate();
        if (
          nowMonth.getFullYear() == minTime.getFullYear() &&
          nowMonth.getMonth() == minTime.getMonth()
        ) {
          //第一个月
          monthDay = monthDay - minTime.getDate() + 1;
        } else if (
          nowMonth.getFullYear() == maxTime.getFullYear() &&
          nowMonth.getMonth() == maxTime.getMonth()
        ) {
          //最后一个月
          monthDay = maxTime.getDate();
        }
        var width = monthDay * (this.initCellWidth / this.unitCellDay); //天数跨越的长度
        this.tableHeadData1.push({
          width: width,
          left: leftAcc,
          text:
            nowMonth.getFullYear() +
            " - " +
            (nowMonth.getMonth() + 1 <= 10
              ? "0" + (nowMonth.getMonth() + 1)
              : nowMonth.getMonth() + 1) +
            (this.axisType == "relative" ? "(相对)" : "")
        });
        leftAcc += width; //累加宽度
      }
    },
    //初始化属性
    initAttribute() {
      //初始化各属性
      if (this.height && typeof this.height == "number")
        this.initHeight = this.height;
      if (
        this.width &&
        (typeof this.width == "number" || typeof this.width == "string")
      )
        this.initWidth = this.width;
      if (
        this.cellHeight &&
        typeof this.cellHeight == "number" &&
        this.cellHeight >= this.initCellHeight
      )
        this.initCellHeight = this.cellHeight; //再小就没地方了
      if (this.cellWidth && typeof this.cellWidth == "number")
        this.initCellWidth = this.cellWidth;
      if (
        this.tableHeadCellHeight &&
        typeof this.tableHeadCellHeight == "number"
      )
        this.initTableHeadCellHeight = this.tableHeadCellHeight;
      if (this.cellRowNum && typeof this.cellRowNum == "number")
        this.initCellRowNum = this.cellRowNum;
      if (
        this.isShowDetailArea != undefined &&
        typeof this.isShowDetailArea == "boolean"
      )
        this.initIsShowDetailArea = this.isShowDetailArea;
      if (
        this.toolBarCollapsed != undefined &&
        typeof this.toolBarCollapsed == "boolean"
      )
        this.initToolBarCollapsed = this.toolBarCollapsed;
      if (this.toolBarHeight && typeof this.toolBarHeight == "number")
        this.initToolBarHeight = this.toolBarHeight;
      if (
        this.toolBarWidth &&
        typeof this.toolBarWidth == "number" &&
        this.toolBarWidth >= this.initToolBarWidth
      )
        this.initToolBarWidth = this.toolBarWidth; //再小就没地方了
      if (this.loadDataRowNum && typeof this.loadDataRowNum == "number") {
        this.initLoadDataRowNum = this.loadDataRowNum;
      }
      if (
        this.XAisWeltAuto != undefined &&
        typeof this.XAisWeltAuto == "boolean"
      )
        this.initXAisWeltAuto = this.XAisWeltAuto;
      //初始化工具栏位置
      this.toolBarTop =
        (this.initHeight -
          this.initTableHeadCellHeight * this.initTableHeadRowNum) /
          2 -
        this.initToolBarHeight / 2;
    },
    //根据各属性初始化数据
    initData() {
      this.barBlcokList = [];
      this.dragLineList = [];
      this.dragLineDashList = [];
      if (this.data && this.data.length > 0) {
        //第一步，寻找线段，并添加两端虚拟节点
        var lineData = this.data.filter(item => item.StartTime && item.EndTime);
        for (var i = 0; i < lineData.length; i++) {
          //循环每个线段，添加两边端点，并连线
          var startDate = new Date(lineData[i].StartTime);
          var endDate = new Date(lineData[i].EndTime);
          //添加开始节点
          var startBlock = this.barBlcokList.filter(
            item => item.dateData.getTime() == startDate.getTime()
          );
          if (startBlock.length > 0) {
            //有这个节点
            startBlock = startBlock[0];
          } else {
            //没有这个节点,添加一个虚拟节点
            let length =
              this.barBlcokList.length == 0
                ? 0
                : this.barBlcokList[this.barBlcokList.length - 1].no + 1;
            //计算时间跨度
            var left =
              ((startDate.getTime() - this.startAxisTime.getTime()) /
                86400000) *
                (this.initCellWidth / this.unitCellDay) -
              15;
            startBlock = {
              no: length,
              top:
                this.initCellHeight * (this.initLoadDataRowNum - 1) +
                (this.initCellHeight - 50) / 2, // #0005 默认从第三行开始，好看点,
              left: left,
              text: "虚拟节点",
              type: "work",
              status: "undo", //状态，改变颜色
              dateData: startDate //绑定的数据
            };
            this.barBlcokList.push(startBlock);
          }
          //添加结束节点
          var endBlock = this.barBlcokList.filter(
            item => item.dateData.getTime() == endDate.getTime()
          );
          if (endBlock.length > 0) {
            //有这个节点
            endBlock = endBlock[0];
          } else {
            //没有这个节点,添加一个虚拟节点
            let length =
              this.barBlcokList.length == 0
                ? 0
                : this.barBlcokList[this.barBlcokList.length - 1].no + 1;
            //计算时间跨度
            var left =
              ((endDate.getTime() - this.startAxisTime.getTime()) / 86400000) *
                (this.initCellWidth / this.unitCellDay) -
              15;
            endBlock = {
              no: length,
              top:
                this.initCellHeight * (this.initLoadDataRowNum - 1) +
                (this.initCellHeight - 50) / 2, // #0005 默认从第三行开始，好看点,
              left: left,
              text: "虚拟节点",
              type: "work",
              status: "undo", //状态，改变颜色
              dateData: endDate //绑定的数据
            };
            this.barBlcokList.push(endBlock);
          }
          //添加线
          this.addLine(startBlock, endBlock, "solid", lineData[i]);
        }
        //第二步，获取节点，把已有的虚拟节点转为基准节点
        var baseBlock = this.data.filter(
          item => item.StartTime == "" || item.EndTime == ""
        );
        for (var i = 0; i < baseBlock.length; i++) {
          var blockDate = baseBlock[i].StartTime
            ? new Date(baseBlock[i].StartTime)
            : new Date(baseBlock[i].EndTime);
          var liveBlock = this.barBlcokList.filter(
            item => item.dateData.getTime() == blockDate.getTime()
          );
          if (liveBlock.length > 0) {
            //有这个节点
            liveBlock = liveBlock[0];
            //修改
            liveBlock.text = baseBlock[i].TaskName;
            liveBlock.type = "base";
            liveBlock.dataNo = baseBlock[i].no;
          } else {
            //没有这个节点，添加一个,并连上虚拟线
            let length =
              this.barBlcokList.length == 0
                ? 0
                : this.barBlcokList[this.barBlcokList.length - 1].no + 1;
            //计算时间跨度
            var left =
              ((blockDate.getTime() - this.startAxisTime.getTime()) /
                86400000) *
                (this.initCellWidth / this.unitCellDay) -
              15;
            liveBlock = {
              no: length,
              top:
                this.initCellHeight * (this.initLoadDataRowNum - 1) +
                (this.initCellHeight - 50) / 2, // #0005 默认从第三行开始，好看点,
              left: left,
              text: baseBlock[i].TaskName,
              type: "base",
              status: "undo", //状态，改变颜色
              dateData: blockDate, //绑定的数据
              dataNo: baseBlock[i].no
            };
            var lastBlock = this.barBlcokList[this.barBlcokList.length - 1];
            this.barBlcokList.push(liveBlock);
            this.addLine(lastBlock, liveBlock, "dash", "虚拟任务");
          }
        }
        //移动滚动条
        if (this.barBlcokList.length) {
          if (this.barBlcokList[0].left > 200) {
            this.$nextTick(function() {
              //DOM 更新后移动滚动条
              this.$refs.cellAreaContainer.scrollLeft =
                this.barBlcokList[0].left - 100;
            });
          }
        }
      }
    },
    //初始化方法
    initFunc() {
      var me = this;
      //滚动条联动，为了制造固定表头的效果
      this.$refs.cellAreaContainer.addEventListener("scroll", () => {
        if (me.$refs.headAreaContainer)
          me.$refs.headAreaContainer.scrollLeft =
            me.$refs.cellAreaContainer.scrollLeft;
        me.toolBarLeft = me.$refs.cellAreaContainer.scrollLeft; //工具栏移动
        me.toolBarTop =
          (me.initHeight -
            me.initTableHeadCellHeight * me.initTableHeadRowNum) /
            2 -
          me.initToolBarHeight / 2 +
          me.$refs.cellAreaContainer.scrollTop;
      });
      //监控全局鼠标放开事件
      window.onmouseup = function() {
        me.isDown = false;
        if (
          me.operationType == "tool-barBlcok" ||
          me.operationType == "tool-barBlcok-work"
        ) {
          //第一种情况，拖拽工具栏里的【节点】工具,鼠标放下时，操作的工具隐藏，根据是否移出工具栏区域，增加一个对应的div在画图区域中
          me.moveDiv.classList.add("divHide");
          //往节点集合里面增加一个
          let scrollLeft = me.$refs.cellAreaContainer.scrollLeft;
          let scrollTop = me.$refs.cellAreaContainer.scrollTop;
          let length =
            me.barBlcokList.length == 0
              ? 0
              : me.barBlcokList[me.barBlcokList.length - 1].no + 1;
          let top = Number(me.moveDiv.style.top.replace("px", ""));
          let left = Number(me.moveDiv.style.left.replace("px", ""));
          //首先判断鼠标放下的地方，要完全超出工具栏才行
          let relativeTop = top - scrollTop;
          let relativeLeft = left - scrollLeft;
          if (
            (relativeTop > me.toolBarTop ||
              relativeTop < me.toolBarTop + me.initToolBarHeight) &&
            relativeLeft < me.initToolBarWidth
          ) {
            return;
          }
          //贴边处理，判断top是几倍的单元格高度。
          let criticalTop = me.initCellHeight - 50 / 2; // #0005 需要判断的临界top
          let cellIndex = 0;
          while (me.initCellHeight * cellIndex + criticalTop <= top) {
            //如果不在这个范围之内,行数++
            cellIndex++;
          }
          top = me.initCellHeight * cellIndex + (me.initCellHeight - 50) / 2; // #0005 真正的top
          if (me.initXAisWeltAuto) {
            //如果横坐标也要贴边
            let unitWidth = me.initCellWidth / me.unitCellDay;
            let criticalLeft = unitWidth / 2; //临界left
            cellIndex = 0;
            while (unitWidth * cellIndex + criticalLeft <= left + 15) {
              cellIndex++;
            }
            left = unitWidth * cellIndex - 15;
          }
          var taskName = "新节点";
          var maxNo = "";
          var changeTime = new Date(
            ((left + 15) / (me.initCellWidth / me.unitCellDay)) * 86400000 +
              me.startAxisTime.getTime()
          );
          //把节点数据加入data里面
          if (me.operationType == "tool-barBlcok") {
            if (me.data == undefined) me.data = [];
            maxNo = me.data.length
              ? Math.max.apply(
                  Math,
                  me.data.map(item => {
                    return item.no;
                  })
                ) + 10
              : 10;
            //加入节点对应的数据
            me.data.push({
              no: maxNo,
              TaskName: taskName,
              StartTime: "",
              EndTime: me.formatDate(changeTime)
            });
            me.$emit("input", me.data);
            me.dataChange = true;
          }
          //加入节点
          me.barBlcokList.push({
            no: length,
            top: top,
            left: left,
            text: taskName,
            type: me.operationType == "tool-barBlcok" ? "base" : "work", //节点类型，是否有旗子
            status: "undo", //状态，改变颜色
            dateData: changeTime, //绑定的数据
            dataNo: maxNo
          }); //拖拽放开后加入一个新节点
        } else if (me.operationType == "real-barBlcok") {
          //第二种情况，拖拽画图区域实际的控件，鼠标放下时要做贴边处理,并对线的位置进行处理
          let top = Number(me.moveDiv.style.top.replace("px", ""));
          let criticalTop = me.initCellHeight - 50 / 2; // #0005 需要判断的临界top
          let cellIndex = 0;
          while (me.initCellHeight * cellIndex + criticalTop <= top) {
            //如果不在这个范围之内,行数++
            cellIndex++;
          }
          //me.moveDiv.style.top =
          // this.initCellHeight * cellIndex + (me.initCellHeight - 50) / 2 + "px";//二选一改变即可 #0005
          me.barBlcokList[me.moveDivIndex].top =
            me.initCellHeight * cellIndex + (me.initCellHeight - 50) / 2; //二选一改变即可 #0005
          if (me.initXAisWeltAuto) {
            //如果横坐标也要贴边
            let left = Number(me.moveDiv.style.left.replace("px", ""));
            let unitWidth = me.initCellWidth / me.unitCellDay;
            let criticalLeft = unitWidth / 2; //临界left
            cellIndex = 0;
            while (unitWidth * cellIndex + criticalLeft <= left + 15) {
              cellIndex++;
            }
            me.barBlcokList[me.moveDivIndex].left = unitWidth * cellIndex - 15;
          }
          //改变节点数据的结束时间
          var changeTime = new Date(
            ((me.barBlcokList[me.moveDivIndex].left + 15) /
              (me.initCellWidth / me.unitCellDay)) *
              86400000 +
              me.startAxisTime.getTime()
          );
          me.barBlcokList[me.moveDivIndex].dateData = changeTime;
          if (me.barBlcokList[me.moveDivIndex].dataNo) {
            var connectData = me.data.filter(
              item => item.no == me.barBlcokList[me.moveDivIndex].dataNo
            )[0];
            connectData.EndTime = me.formatDate(changeTime);
            me.$emit("input", me.data);
            me.dataChange = true;
          }
          //如果有相关联的线条，改变线条的位置
          if (me.moveDiveConnectLine.length > 0) {
            //显示虚线，隐藏实线，并改变虚线的位置
            for (var i = 0; i < me.moveDiveConnectLine.length; i++) {
              var lineConnect = me.dragLineList.filter(
                item => item.no == me.moveDiveConnectLine[i]
              )[0];
              lineConnect.show = true;
              var lineConnectDash = me.dragLineDashList.filter(
                item => item.no == me.moveDiveConnectLine[i]
              )[0];
              lineConnectDash.show = false;
              me.changeLine(
                lineConnect,
                me.barBlcokList[me.moveDivIndex],
                true
              );
            }
          }
        } else if (me.operationType == "control-barBlcok") {
          me.dragLineControl.width = 0;
        }
        me.operationType = "";
        me.moveDiveConnectLine = [];
      };
      //监控全局鼠标移动事件
      window.onmousemove = function(e) {
        if (!me.isDown) return;
        if (me.isEdit) return;
        //获取x,y坐标
        var nx = e.clientX;
        var ny = e.clientY;
        //计算相对位移，有正负
        var relativeMoveX = nx - me.xPoint;
        var relativeMoveY = ny - me.yPoint;
        //计算偏移量  原来左偏移量 + 相对位移x 原来的上偏移量 + 相对位移y
        var nl = me.leftPoint + relativeMoveX;
        var nt = me.topPonit + relativeMoveY;
        //获取滚动条位置
        var scrollLeft = me.$refs.cellAreaContainer.scrollLeft; //获取滚动条
        var scrollTop = me.$refs.cellAreaContainer.scrollTop;
        if (
          me.operationType == "tool-barBlcok" ||
          me.operationType == "real-barBlcok" ||
          me.operationType == "tool-barBlcok-work"
        ) {
          //第一种情况，拖拽工具栏里的【节点】工具
          //第二种情况，拖拽画图区域实际的控件，与第一种情况一样。不同的是放下鼠标的时候
          if (nl < -15 + scrollLeft) nl = -15 + scrollLeft; //真正的left，旗杆决定 #0005  左边界限 #0005 30/2=15
          if (nl > me.$refs.cellAreaContainer.offsetWidth - 30 + scrollLeft)
            nl = me.$refs.cellAreaContainer.offsetWidth - 30 + scrollLeft; // #0005 右边界限
          if (nt < 0) nt = 0; //上面界限
          if (nt > me.$refs.cellAreaContainer.offsetHeight - 50 + scrollTop)
            nt = me.$refs.cellAreaContainer.offsetHeight - 50 + scrollTop; //#0005 下面界限
          me.moveDiv.style.left = nl + "px";
          me.moveDiv.style.top = nt + "px";
          if (me.operationType == "real-barBlcok") {
            me.barBlcokList[me.moveDivIndex].left = Number(nl);
            me.barBlcokList[me.moveDivIndex].top = Number(nt);
            if (me.moveDiveConnectLine.length > 0) {
              //显示虚线，隐藏实线，并改变虚线的位置
              for (var i = 0; i < me.moveDiveConnectLine.length; i++) {
                var lineConnect = me.dragLineList.filter(
                  item => item.no == me.moveDiveConnectLine[i]
                )[0];
                lineConnect.show = false;
                var lineConnectDash = me.dragLineDashList.filter(
                  item => item.no == me.moveDiveConnectLine[i]
                )[0];
                lineConnectDash.show = true;
                //获取线条的另外一个控件
                var otherDiv = [];
                var otherNo = 0;
                if (lineConnect.star == me.barBlcokList[me.moveDivIndex].no)
                  otherNo = lineConnect.end;
                else if (lineConnect.end == me.barBlcokList[me.moveDivIndex].no)
                  otherNo = lineConnect.star;
                if (otherNo < 10000) {
                  //说明是barblocklist
                  otherDiv = me.barBlcokList.filter(
                    item => item.no == otherNo
                  )[0];
                } else if (otherNo >= 10000) {
                }
                if (otherDiv) {
                  //另外一个控件一般不会动，当作支点
                  var dashLeft = otherDiv.left + 15; // #0005
                  var dashLeft2 = me.barBlcokList[me.moveDivIndex].left + 15; // #0005
                  var dashTop = otherDiv.top + 20 + 7.5; // #0006 #0007
                  var dashTop2 =
                    me.barBlcokList[me.moveDivIndex].top + 20 + 7.5; // #0006 #0007
                  var relativeMoveX = dashLeft2 - dashLeft;
                  var relativeMoveY = dashTop2 - dashTop;
                  //求弧度
                  var rad = Math.atan(relativeMoveY / relativeMoveX);
                  if (dashLeft2 < dashLeft) {
                    if (dashTop2 <= dashTop) {
                      rad += Math.PI;
                    } else {
                      rad -= Math.PI;
                    }
                  }
                  var dashWidth = Math.sqrt(
                    relativeMoveX * relativeMoveX +
                      relativeMoveY * relativeMoveY,
                    2
                  );
                  lineConnectDash.width = dashWidth;
                  lineConnectDash.left = dashLeft;
                  lineConnectDash.top = dashTop;
                  lineConnectDash.transform = rad;
                }
              }
            }
          }
        } else if (me.operationType == "control-barBlcok") {
          //拉出一条线
          //求弧度
          var rad = Math.atan(relativeMoveY / relativeMoveX);
          if (nx < me.xPoint) {
            if (ny <= me.yPoint) {
              rad += Math.PI;
            } else {
              rad -= Math.PI;
            }
          }
          var rect = me.$el.getBoundingClientRect();
          //长度为三角形斜边
          me.dragLineControl.width = Math.sqrt(
            relativeMoveX * relativeMoveX + relativeMoveY * relativeMoveY,
            2
          );
          me.dragLineControl.top =
            me.yPoint -
            rect.top -
            me.initTableHeadCellHeight * me.initTableHeadRowNum +
            scrollTop;
          me.dragLineControl.left = me.xPoint - rect.left + scrollLeft;
          me.dragLineControl.transform = rad;
        }
      };
    }
  },
  created() {
    //各控件位置索引 只索引那些不在参数里面自己写的，方便联动修改
    //工具距离左边位置，left 10px，索引#0001
    //各工具距离各自div顶部距离 top 5px，索引#0002
    //第一个工具的宽高30*50 索引#0005
    //第一个工具中圆的直径 15px 索引#0006
    //第一个工具中旗杆的高度 20px 索引#0007
    //线中箭头的高度宽度 索引#0008
    //线条的宽度或高度 20px 索引#0009
    //控件初始位置，左边10 + 滚动条，第一个距离上面 toolBarTop + 5
    //第二个距离上面 toolBarTop + 52 + 5
  },
  mounted() {
    this.initAxis(); //初始化坐标轴数据
    this.initAttribute(); //初始化各属性
    this.initData(); //初始化集合数据
    this.initFunc(); //初始化方法
  }
  // activated() {
  //   this.initAttribute();
  //   this.initFunc();
  //   this.initAxis();
  // }
};
</script>

<style scoped>
.controller-container {
  background-color: white;
}
.area-paint {
  height: 100%;
  float: left;
  border: 1px solid black;
}
.area-graphic-expression {
  height: 100%;
  width: 14.5%;
  min-width: 100px;
  display: inline-block;
  border: 1px solid black;
  margin-left: -1px;
}
.table-head-area-container {
  position: relative;
  overflow: scroll;
}
.table-head-area-container::-webkit-scrollbar {
  display: none;
  /* 不显示滚动条，用另一个联动 */
}
.table-cell-area-container {
  position: relative;
  overflow: scroll;
}
.table-head-cell {
  position: absolute;
  background-color: #f5f7fa;
  border-right: 1px solid #bdbdbd;
  border-bottom: 1px solid #bdbdbd;
  box-sizing: border-box;
  vertical-align: middle;
  user-select: none;
}
.cell-text {
  width: 100%;
  text-align: center;
  vertical-align: middle;
  line-height: 20px;
  font-size: 14px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
}
.table-row {
  position: absolute;
  width: 100%;
}
.table-cell {
  height: 100%;
  position: absolute;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  box-sizing: border-box;
}
.tool-split {
  position: absolute;
  margin-left: 0;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  border-top: 1px solid #eeeeee;
  background-color: rgba(56, 146, 211, 0.3);
  user-select: none;
  transition: width 0.4s;
  box-sizing: border-box;
  z-index: 999;
}
.tool-area {
  height: 100%;
  position: absolute;
  left: 0;
}
.tool-split-bar {
  width: 8px;
  height: 100%;
  position: absolute;
  right: 0;
}
.split-toogle {
  width: 8px;
  height: 48px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.split-toogle-left {
  background: url("../../assets/img/mini-left.png") no-repeat;
}
.split-toogle-right {
  background: url("../../assets/img/mini-right.png") no-repeat;
}
/* 各工具距离左边位置，left10px，由此处决定，索引#0001 */
/* 各工具距离各自div顶部距离，索引#0002 */
.tool-item {
  width: 100%;
  height: 52px;
  padding: 0 10px;
  box-sizing: border-box;
  padding-top: 5px;
}
.tool-area :hover .tool-item {
  border: 1px solid black;
}
.bar-area {
  width: 100%;
}
.control-tool-area {
  width: 100%;
}
/* 第一个工具的宽高 索引#0005 */
.barBlcok {
  position: absolute;
  width: 30px;
  height: 50px;
  z-index: 999;
  user-select: none;
}
.barBlcok:hover {
  cursor: pointer;
}
/* 工具的真正指针位置为旗杆的位置，索引#0005 */
/* 第一个工具中旗杆的高度 索引#0007 */
.qigan {
  position: absolute;
  width: 15px;
  height: 20px;
  border-right: 1px solid black;
  box-sizing: border-box;
}
/* 第一个工具中圆的直径 索引#0006 */
.yuan {
  position: absolute;
  width: 15px;
  height: 15px;
  border: 1px solid black;
  border-radius: 7.5px;
  bottom: 15px;
  left: 7.5px;
  box-sizing: border-box;
}
.sanjiao {
  position: absolute;
  width: 0;
  height: 0;
  left: 15px;
  border-top: 12px solid transparent;
  border-right: 12px solid transparent;
  border-left: 12px solid black;
  display: inline-block;
  box-sizing: border-box;
}
.barText {
  position: absolute;
  width: 250%;
  height: 15px;
  bottom: 0;
  transform: translateX(-30%);
  font-size: 12px;
  text-align: center;
  box-sizing: border-box;
}
/*  控制块 #0005 */
.barBlockControlRight {
  position: absolute;
  width: 15px;
  height: 15px;
  margin-left: 30px;
  margin-top: 17.5px;
  border-radius: 7.5px;
  z-index: 999;
  user-select: none;
}
.barBlockControlRight:hover {
  cursor: pointer;
}
/* 隐藏div */
.divHide {
  display: none;
}
.dragLine {
  position: absolute;
  height: 0;
  border: 0 none #ffa011;
  border-bottom-style: dashed;
  border-bottom-width: 2px;
  transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  -webkit-transform-origin: 0 0;
}
.lineContainer {
  position: absolute;
  user-select: none;
  box-sizing: border-box;
  z-index: 998;
}
.lineText {
  position: absolute;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.lineText-horizental {
  height: 9px;
  top: -10px;
  width: 100%;
  /* left: 50%;
  transform: translateX(-50%); */
}
.lineText-vertical {
  top: 50%;
  transform: translateY(-50%);
  width: 9px;
  left: -10px;
}
.connentLine {
  position: absolute;
  /* background-color: #ffa011; */
}
.connentLine:hover {
  cursor: pointer;
}
.connentLine-vertical {
  /* width: 2px; */
  background-color: #ffa011;
  border-left: 1px solid #ffa011;
  border-right: 1px solid #ffa011;
  left: 9px;
}
.connentLine-vertical-dash {
  /* width: 2px; */
  border-left: 2px dashed #ffa011;
  /* border-right: 1px dashed #ffa011; */
  left: 9px;
}
.connentLine-vertical-scale100 {
  height: 100%;
}
.connentLine-vertical-scale99 {
  height: 99.5%;
}
.connentLine-vertical-top {
  bottom: 0;
}
.connentLine-vertical-bottom {
  top: 0;
}
.connentLine-horizental {
  /* height: 2px; */
  background-color: #ffa011;
  border-top: 1px solid #ffa011;
  border-bottom: 1px solid #ffa011;
  top: 9px;
}
.connentLine-horizental-dash {
  /* height: 2px; */
  border-top: 2px dashed #ffa011;
  /* border-bottom: 1px dashed #ffa011; */
  top: 9px;
}
.connentLine-horizental-scale100 {
  width: 100%;
}
.connentLine-horizental-scale99 {
  width: 99.5%;
}
.connentLine-horizental-left {
  right: 0;
}
.connentLine-horizental-right {
  left: 0;
}
.lineArrow-base {
  position: absolute;
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-width: 6px;
}
.lineArrow-right {
  right: -6px;
  top: 4px;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: #ffa011;
}
.lineArrow-left {
  left: -6px;
  top: 4px;
  border-top-color: transparent;
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-right-color: #ffa011;
}
.lineArrow-top {
  top: -6px;
  left: 4px;
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: #ffa011;
}
.lineArrow-bottom {
  bottom: -6px;
  left: 4px;
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: #ffa011;
}
.backgroundComplete {
  background-color: #7ed321;
}
.backgroundDoing {
  background-color: #f5a623;
}
.backgroundStop {
  background-color: #d0021b;
}
.backgroundPause {
  background-color: #979797;
}
</style>