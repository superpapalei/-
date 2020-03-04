
//浮点数运算重构，使用示例 a+b => a.add(b)   a-b => a.sub(b)  a*b => a.mul(b)  a/b => a.div(b)
/**浮点数的加运算*/
Number.prototype.add = function (arg) {
    return operation(this, arg, 'add');
  };
  /**浮点数的减运算*/
  Number.prototype.sub = function (arg) {
    return operation(this, arg, 'subtract');
  };
  /**浮点数的乘运算*/
  Number.prototype.mul = function (arg) {
    return operation(this, arg, 'multiply');
  };
  /**浮点数的除运算*/
  Number.prototype.div = function (arg) {
    return operation(this, arg, 'divide');
  };
  
  function isInteger(obj) {
    return Math.floor(obj) === obj
  }
  /**将浮点数转为整数，并保存放大的倍数。如0.02 返回2，100 */
  function toInteger(floatNum) {
    var ret = { floatLength: 1, intNum: 0 };
    if (isInteger(floatNum)) {//如果是整数
      ret.intNum = floatNum;
    }
    else {
      var strFloat = floatNum + '';
      var dotPosition = strFloat.indexOf('.');
      var len = strFloat.substr(dotPosition + 1).length;
      var floatLength = Math.pow(10, len);
      var intNum = parseInt(Math.abs(floatNum) * floatLength + 0.5, 10);//放大
      ret.floatLength = floatLength;
      if (floatNum < 0) {//负数的处理
        intNum = -intNum;
      }
      ret.intNum = intNum;
    }
    return ret;
  }
  function operation(a, b, opType) {
    var o1 = toInteger(a);
    var o2 = toInteger(b);
    var int1 = o1.intNum;
    var int2 = o2.intNum;
    var langth1 = o1.floatLength;
    var langth2 = o2.floatLength;
    var maxLength = langth1 > langth2 ? langth1 : langth2;//以最大位数为基准
    var result = null;
    switch (opType) {
      case 'add':
        if (langth1 === langth2) { //两个小数位数相同
          result = int1 + int2;
        } else if (langth1 > langth2) {
          result = int1 + int2 * (langth1 / langth2);
        } else {
          result = int1 * (langth2 / langth1) + int2;
        }
        return result / maxLength;
      case 'subtract':
        if (langth1 === langth2) {
          result = int1 - int2;
        } else if (langth1 > langth2) {
          result = int1 - int2 * (langth1 / langth2);
        } else {
          result = int1 * (langth2 / langth1) - int2;
        }
        return result / maxLength;
      case 'multiply':
        result = (int1 * int2) / (langth1 * langth2);
        return result;
      case 'divide':
        result = (int1 / int2) / (langth1 / langth2);
        return result;
    }
  }