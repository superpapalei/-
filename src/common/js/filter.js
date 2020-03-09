/**保留两位小数*/
let numberFilter = data => {
    if (typeof (data) !== 'number') return '';
    return data.toFixed(2);
}
/**保留两位小数*/
let dosageFilter = data => {
    if (typeof (data) !== 'number') return '';
    return Math.round(data * 100) / 100;
}
// 向右移位
function shiftRight(number, digit) {
    digit = parseInt(digit, 10);
    var value = number.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + digit) : digit))
}
// 向左移位
function shiftLeft(number, digit) {
    digit = parseInt(digit, 10);
    var value = number.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - digit) : -digit))
}
/**金额转大写*/
let digitUppercase = function (n) {
    var fraction = ['角', '分'];
    var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
    ];
    var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(shiftRight(n, 1 + i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(shiftLeft(n, 1));
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');
};

//给时间加前缀'0'
function addZeroIfNeed(num) {
    if (num < 10) {
        return '0' + num
    }
    return num
}
/**将毫秒数转为标准时间*/
let toLocale = function (time) {
    let _time = new Date(time)
    let year = _time.getFullYear()
    let month = addZeroIfNeed(_time.getMonth() + 1)
    let day = addZeroIfNeed(_time.getDate())
    let hour = addZeroIfNeed(_time.getHours())
    let minute = addZeroIfNeed(_time.getMinutes())
    let second = addZeroIfNeed(_time.getSeconds())
    let date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    return date
};
let dateFormat = function (time, format) {
    if (!isNaN(time)) return "";
    let _time = new Date(time);
    let year = _time.getFullYear();
    let month = addZeroIfNeed(_time.getMonth() + 1);
    let day = addZeroIfNeed(_time.getDate());
    let hour = addZeroIfNeed(_time.getHours());
    let minute = addZeroIfNeed(_time.getMinutes());
    let second = addZeroIfNeed(_time.getSeconds());
    let date =
        year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    if (format == "yyyy-MM-dd") {
        date = year + "-" + month + "-" + day;
    }
    return date;
}

function dateFilter(value) {
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

/**全局渲染方法*/
function renderFilter(id, renderData) {
    var name = id;
    if (renderData) {
        var displayName = renderData.filter(item => item.value == id);
        if (displayName.length) {
            name = displayName[0].display;
        }
    }
    return name;
}

export {
    numberFilter,
    dosageFilter,
    digitUppercase,
    toLocale,
    dateFormat,
    dateFilter,
    renderFilter
}