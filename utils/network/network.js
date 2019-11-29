/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2018-09-11 23:26:20
 * @LastEditTime: 2019-10-18 09:27:58
 * @LastEditors: Please set LastEditors
 */
var Utils = require('../../utils/common/util.js');

export const API_CampusRootUrl = 'https://leave.lancooedu.com';
/**
 * 发起get请求
 * @param url 请求路径 必填
 * @param data 请求参数 get请求的参数会自动拼到地址后面
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const get = (url, data, headers) => request('GET', url, data, headers);

/**
 * 发起post请求
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const post = (url, data, headers) => request('POST', url, data, headers);
/**
 * 发起put请求
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const put = (url, data, headers) => request('PUT', url, data, headers);
/**
 * 发起delete请求
 * @param url 请求路径 必填
 * @param data 请求参数 delete请求的参数会自动拼到地址后面
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const del = (url, data, headers) => request('DELETE', url, data, headers);


/**
 * 发起get请求
 * @param url 请求路径 必填
 * @param data 请求参数 get请求的参数会自动拼到地址后面
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const transmitGet = (url, data, headers) => transmitGetRequest('POST', url, data, headers);

/**
 * 发起post请求
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const transmitPost = (url, data, headers) => transmitPostRequest('POST', url, data, headers);


/**
 * 发起PUT请求
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const transmitPut = (url, data, headers) => transmitPutRequest('POST', url, data, headers);

/**
 * 发起PUT请求
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const transmitDelete = (url, data, headers) => transmitDeleteRequest('POST', url, data, headers);


export function request(method, url, data, header = { 'Content-Type': 'application/json' }) {
  console.group('==============>新请求<==============');
  console.info(method, url);
  if (data) console.info('参数：', data);
  return new Promise((resolve, reject) => {
    const response = {};
    wx.request({
      url, method, data, header,
      success: (res) => response.success = res.data,
      fail: (error) => response.fail = error,
      complete() {
        if (response.success) {
          console.info('请求成功：', response.success);
          resolve(response.success)
        } else {
          console.info('请求失败：', response.fail);
          console.info('请求失败：', response)
          reject(response.fail)
        }
      },
    });
  });
}

export function transmitPostRequest(method, url, data, header = { 'Content-Type': 'application/json' }) {
  console.group('==============>新请求<==============');

  var newUrl = API_CampusRootUrl + '/transmit/doPost';
  var transmitParams = Utils.transmitParam(data, url)
  console.info(method, newUrl);
  if (transmitParams) console.info('参数：', transmitParams);
  return new Promise((resolve, reject) => {
    const response = {};
    wx.request({
      url: newUrl,
      method: method,
      data: transmitParams,
      header: header,
      success: (res) => response.success = res.data,
      fail: (error) => response.fail = error,
      complete() {
        if (response.success) {

          if (response.success.data.Result) {
            console.info('请求成功：', response.success);
            try {
              var dataInfo = JSON.parse(response.success.data.Content);
              console.log('转发请求成功数据：', dataInfo)
              resolve(dataInfo)
            } catch (error) {
              console.info('请求成功,但JSON解析失败,请手动处理：', response.success.data.Content);
              resolve(response.success.data.Content)
            }
          } else {
            console.info('请求失败：', response.success.data.Content);
            reject(response.success.data.Content)
          }
        } else {
          console.info('请求失败：', response.fail);
          console.info('请求失败：', response)
          reject(response.fail)
        }
      },
    });
  });
}

export function transmitPutRequest(method, url, data, header = { 'Content-Type': 'application/json' }) {
  console.group('==============>新请求<==============');

  var newUrl = API_CampusRootUrl + '/transmit/doPut';
  var transmitParams = Utils.transmitParam(data, url)
  console.info(method, newUrl);
  if (transmitParams) console.info('参数：', transmitParams);
  return new Promise((resolve, reject) => {
    const response = {};
    wx.request({
      url: newUrl,
      method: method,
      data: transmitParams,
      header: header,
      success: (res) => response.success = res.data,
      fail: (error) => response.fail = error,
      complete() {
        if (response.success) {

          if (response.success.data.Result) {
            console.info('请求成功：', response.success);
            try {
              var dataInfo = JSON.parse(response.success.data.Content);
              console.log('转发请求成功数据：', dataInfo)
              resolve(dataInfo)
            } catch (error) {
              console.info('请求成功,但JSON解析失败,请手动处理：', response.success.data.Content);
              resolve(response.success.data.Content)
            }
          } else {
            console.info('请求失败：', response.success.data.Content);
            reject(response.success.data.Content)
          }
        } else {
          console.info('请求失败：', response.fail);
          console.info('请求失败：', response)
          reject(response.fail)
        }
      },
    });
  });
}


export function transmitDeleteRequest(method, url, data, header = { 'Content-Type': 'application/json' }) {
  console.group('==============>新请求<==============');

  var newUrl = API_CampusRootUrl + '/transmit/doDelete';
  var transmitParams = Utils.transmitParam(data, url)
  console.info(method, newUrl);
  if (data) console.info('参数：', transmitParams);
  return new Promise((resolve, reject) => {
    const response = {};
    wx.request({
      url: newUrl,
      method: method,
      data: transmitParams,
      header: header,
      success: (res) => response.success = res.data,
      fail: (error) => response.fail = error,
      complete() {
        if (response.success) {

          if (response.success.data.Result) {
            console.info('请求成功：', response.success);
            try {
              var dataInfo = JSON.parse(response.success.data.Content);
              console.log('转发请求成功数据：', dataInfo)
              resolve(dataInfo)
            } catch (error) {
              console.info('请求成功,但JSON解析失败,请手动处理：', response.success.data.Content);
              resolve(response.success.data.Content)
            }
          } else {
            console.info('请求失败：', response.success.data.Content);
            reject(response.success.data.Content)
          }
        } else {
          console.info('请求失败：', response.fail);
          console.info('请求失败：', response)
          reject(response.fail)
        }
      },
    });
  });
}


export function transmitGetRequest(method, url, data, header = { 'Content-Type': 'application/json' }) {
  console.group('==============>新请求<==============');
  const newUrl = API_CampusRootUrl + '/transmit/doGet';
  var reuqestUrl = url
  if (data) {
    reuqestUrl = url + '?';
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        reuqestUrl = reuqestUrl + key + '=' + element + '&'
      }
    }
    reuqestUrl = reuqestUrl.substring(0, reuqestUrl.length - 1)
  }
  var transmitParams = Utils.transmitParamGet(reuqestUrl)
  console.info(method, newUrl);
  if (data) console.info('参数：', transmitParams);
  return new Promise((resolve, reject) => {
    const response = {};
    wx.request({
      url: newUrl,
      method: method,
      data: transmitParams,
      header: header,
      success: (res) => response.success = res.data,
      fail: (error) => response.fail = error,
      complete() {
        if (response.success) {
          if (response.success.data.Result) {
            console.info('请求成功：', response.success);
            try {
              var dataInfo = JSON.parse(response.success.data.Content);
              console.log('转发请求成功数据：', dataInfo)
              resolve(dataInfo)
            } catch (error) {
              console.info('请求成功,但JSON解析失败,请手动处理', response.success.data.Content);
              resolve(response.success.data.Content)
            }
          } else {
            console.info('请求失败：', response.success.data.Content);
            reject(response.success.data.Content)
          }

        } else {
          console.info('请求失败：', response.fail);
          console.info('请求失败：', response)
          reject(response.fail)
        }
      },
    });
  });
}






