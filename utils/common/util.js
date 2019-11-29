/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-24 16:57:18
 * @LastEditTime: 2019-11-20 19:47:05
 * @LastEditors: Please set LastEditors
 */
import objectUtil from './object.util'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getCurrentMonthTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return [year, month].map(formatNumber).join('-') 
}

// 获取前一个月
function getPreMonth(date) {
      console.log(date);
      var arr = date.split('-');
      var year = arr[0]; //获取当前日期的年份  
      var month = arr[1]; //获取当前日期的月份  
    
      var year2 = year;
      var month2 = parseInt(month) - 1;
      if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
      }
      
      if (month2 < 10) {
        month2 = '0' + month2;
      }
      var t2 = year2 + '-' + month2;
      return t2;
}

// 获取指定月 
function getDefineMonth(date,num) {
 
  var arr = date.split('-');
  var year = arr[0]; //获取当前日期的年份  
  var month = arr[1]; //获取当前日期的月份  

  var year2 = year;
  var month2 = parseInt(month) - num;
  if (month2 <= 0) {
    year2 = parseInt(year2) - 1;
    month2 = month2 + 12;
  }

  if (month2 < 10) {
    month2 = '0' + month2;
  }
  var t2 = year2 + '-' + month2;
  return t2;
}


/** 
* 获取下一个月 
* 
* @date 格式为yyyy-mm的日期，如：2014-01 
*/
function getNextMonth(date) {

    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份  
    var month = arr[1]; //获取当前日期的月份  
  
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
      year2 = parseInt(year2) + 1;
      month2 = 1;
    }
   
    if (month2 < 10) {
      month2 = '0' + month2;
    }

    var t2 = year2 + '-' + month2;
    return t2;
}  

// 判断两个时间的大小
function validTime(startTime, endTime) {

  startTime = startTime.replace("-", "/");//替换字符，变成标准格式  
  endTime = endTime.replace("-", "/");
  var startTimeDate = new Date(startTime);
  var enTimeDate = new Date(endTime);
  if(startTimeDate > enTimeDate){
    return true;
  }else{
    return false;
  }
  return false;
}


/**
 * 判断是否为空
 */
function isEmpty(str) {
  if (Object.prototype.toString.call(str) === '[object Undefined]') { //空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else  {
    return true
  }
}

/**
 * 判断手机号码是否合法
 */
function validatemobile(mobile) {
  if (mobile.length == 0) {
    alert('请输入手机号码！');
    document.form1.mobile.focus();
    return false;
  }
  if (mobile.length != 11) {
    alert('请输入有效的手机号码！');
    document.form1.mobile.focus();
    return false;
  }

  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
    alert('请输入有效的手机号码！');
    document.form1.mobile.focus();
    return false;
  }
} 

const $init = (page) => {
  page.$data = objectUtil.$copy(page.data, true)
}

const $digest = (page) => {
  let data = page.data
  let $data = page.$data
  let ready2set = {}

  for (let k in data) {
    if (!objectUtil.$isEqual(data[k], $data[k])) {
      ready2set[k] = data[k]
      $data[k] = objectUtil.$copy(data[k], true)
    }
  }

  if (Object.keys(ready2set).length) {
    page.setData(ready2set)
  }
}

/**
  *
  * json转字符串
  */
function stringToJson(data) {
  return JSON.parse(data);
}
/**
*字符串转json
*/
function jsonToString(data) {
  return JSON.stringify(data);
}
/**
*map转换为json
*/
function mapToJson(map) {
  return JSON.stringify(strMapToObj(map));
}
/**
*json转换为map
*/
function jsonToMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}


/**
*map转化为对象（map所有键都是字符串，可以将其转换为对象）
*/
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

/**
*对象转换为Map
*/
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}


/**
* 获取转发参数
*/
export function transmitParam(Param,Url) {
  
  var StrMapParam = this.objToStrMap(Param)
  var JsonParam = this.mapToJson(StrMapParam)
  const app = getApp()
  var Param = {
      "AppID":"wx9e4895714e80e3f1",
      "SchoolID":app.globalData.schoolID,
      "Param":JsonParam,
      "Url":Url,
      "UserID":app.globalData.userID,
  }

  return Param
}

export function transmitParamGet(Url) {
  
  const app = getApp()
  var Param = {
      "AppID":"wx9e4895714e80e3f1",
      "SchoolID":app.globalData.schoolID,
      "Param":null,
      "Url":Url,
      "UserID":app.globalData.userID,
  }

  return Param
}

export function transmitParamPut(Url) {
  
  const app = getApp()
  var Param = {
      "AppID":"wx9e4895714e80e3f1",
      "SchoolID":app.globalData.schoolID,
      "Param":{},
      "Url":Url,
      "UserID":app.globalData.userID,
  }

  return Param
}

export function convertHtmlToText(inputText) {
  var returnText = "" + inputText;
  returnText = returnText.replace(/<\/div>/ig, '\r\n');
  returnText = returnText.replace(/<\/li>/ig, '\r\n');
  returnText = returnText.replace(/<li>/ig, '  *  ');
  returnText = returnText.replace(/<\/ul>/ig, '\r\n');
  //-- remove BR tags and replace them with line break
  returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

  //-- remove P and A tags but preserve what's inside of them
  returnText = returnText.replace(/<p.*?>/gi, "\r\n");
  returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

  //-- remove all inside SCRIPT and STYLE tags
  returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- remove all else
  returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

  //-- get rid of more than 2 multiple line breaks:
  returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

  //-- get rid of more than 2 spaces:
  returnText = returnText.replace(/ +(?= )/g, '');

  //-- get rid of html-encoded characters:
  returnText = returnText.replace(/ /gi, " ");
  returnText = returnText.replace(/&/gi, "&");
  returnText = returnText.replace(/"/gi, '"');
  returnText = returnText.replace(/</gi, '<');
  returnText = returnText.replace(/>/gi, '>');

  return returnText;
}


module.exports = {
  isEmpty: isEmpty,
  validTime: validTime,
  validatemobile: validatemobile,
  init: $init,
  digest: $digest,
  formatTime: formatTime,
  getCurrentMonthTime: getCurrentMonthTime,
  getPreMonth: getPreMonth,
  getNextMonth: getNextMonth,
  getDefineMonth: getDefineMonth,
  stringToJson: stringToJson,
  jsonToString: jsonToString,
  mapToJson: mapToJson,
  jsonToMap: jsonToMap,
  strMapToObj: strMapToObj,
  objToStrMap: objToStrMap,
  transmitParam: transmitParam,
  transmitParamGet:transmitParamGet,
  transmitParamPut:transmitParamPut,
}