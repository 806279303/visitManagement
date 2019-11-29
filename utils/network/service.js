/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2018-09-11 23:26:20
 * @LastEditTime: 2019-11-26 19:34:13
 * @LastEditors: Please set LastEditors
 */
/**
 * 此文件管理项目所有接口
 */
import { get, post, put, del, transmitGet, transmitPost, transmitPut, transmitDelete } from './network';

/**
 * 服务器根域名
 * 试玩更多接口看这里
 * http://jsonplaceholder.typicode.com/
 * @type {string}
 */
export const API_CampusRoot = 'https://leave.lancooedu.com';



/**
 * 获取图片
 */
export const getPhoto = (id) => get(`${API_ROOT}/photos/${id}`);

/**
 * 获取html文本
 */
export const getHtmlStrApi = (urlParams) => get(`${API_CampusRoot}/test/getHtmlStr`);



// 校园通相关Api
/**
 * @description: 微信登录，每次进小程序先使用这个登录
 * @param
 * "AppID": "wx92fc55a3df84d816",
  "BrowserInfo": "Andriod",
  "LoginIP": "192.168.2.90",
  "MacAddress": "00-1F-E2-12-91-E3",
  "MachineType": 3,
  "Secret": "592a430724a23709647e5a6771fdfc89",
  "SysTemID": "A123",
  "js_Code": "043GLOGe0d5jJu1JjbKe0mPSGe0GLOGg"
 * @return: 
 */
export const wxLoginApi = (urlParams) => post(`${API_CampusRoot}/wxlogin`, urlParams);

/**
 * @description:  判断是否绑定微信
 * @param unionID
 * @return: 
 */
export const wxUserHasBindApi = (urlParams) => post(`${API_CampusRoot}/wxuser/hasBind`, urlParams);

/**
 * @description: 云平台登入
 * @param {type} 
 * @return: 
 */
export const yunLoginApi = (urlParams) => post(`${API_CampusRoot}/yunlogin`, urlParams);

/**
 * @description: 云平台登出
 * @param {type} 
 * @return: 
 */
export const yunLogoutApi = (urlParams) => post(`${API_CampusRoot}/yunlogout`, urlParams);

/**
 * @description: 获取全部学校
 * @param {type} 
 * @return: 
 */
export const getSchoolApi = () => get(`${API_CampusRoot}/school/getAll`);


export const getRightApi = () => get(`${API_CampusRoot}/right/getAll`);


/**
 * @description: 消息推送
 * @param {type} 
 * @return: 
 */
export const wxPushApi = (urlParams) => post(`${API_CampusRoot}/news/wxPush`, urlParams);


/**
 * @description: 消息推送
 * @param {type} 
 * @return: 
 */
export const wxTempPushApi = (urlParams) => post(`${API_CampusRoot}/news/wxTempPush`, urlParams);

/**
 * @description: 消息推送
 * @param {type} 
 * @return: 
 */
export const wxunbindApi = (urlParams) => post(`${API_CampusRoot}/wxunbind`, urlParams);

/**
 * api转发管理-GET: 
 * @param 
  
 * @return: 请求结果
 */
export const transmitDoGetApi = (urlParamsString) => post(`${API_CampusRoot}/transmit/doGet`, urlParamsString);

// api转发管理 - Post
export const transmitDoPostApi = (urlParamsString) => post(`${API_CampusRoot}/transmit/doPost`, urlParamsString);

// api转发管理 - PostForm
export const transmitdoPostFormApi = (urlParamsString) => post(`${API_CampusRoot}/transmit/doPostForm`, urlParamsString);


// api转发管理 - Post /transmit/doPut
export const transmitDoPutApi = (urlParamsString) => post(`${API_CampusRoot}/transmit/doPutForm`, urlParamsString);

//获取学校子系统URL 
export const subsystemUrlApi = (url, urlParams) => transmitGet(`${url}/Base/WS/Service_Basic.asmx/WS_G_GetSubSystemServerInfoForAllSubject`, urlParams);