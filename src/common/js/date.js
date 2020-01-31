
//给时间加前缀'0'
function addZeroIfNeed(num){
    if(num < 10){
        return '0'+num
    }
    return num
}
//将毫秒数转为标准时间
let toLocale = function(time){
    let _time = new Date(time)
    let year = _time.getFullYear()
    let month = addZeroIfNeed(_time.getMonth()+1)
    let day = addZeroIfNeed(_time.getDate())
    let hour = addZeroIfNeed(_time.getHours())
    let minute = addZeroIfNeed(_time.getMinutes())
    let second = addZeroIfNeed(_time.getSeconds())
    let date = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second
    return date
};
export{
    toLocale
}