/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 20:43:52
 * @LastEditTime: 2019-11-27 13:53:19
 * @LastEditors: Please set LastEditors
 */
//index.js
//获取应用实例

/*
 * 登录逻辑：
 *  ① Onload:进入页面获取微信用户的基本信息(1.用户授权情况 2.微信用户的基本信息:openid、uinionID)(未授权或者获取失败弹框提醒)     
 *  ② 获取完基本信息后,执行 wxLoginHandler 判断是否已绑定，若绑定直接自动登录，若未绑定则需要用户手动选择登录(同时获取学校信息))  
 *  ③ 用户手动登录  
 */
const app = getApp()
var MD5 = require('../../utils/common/md5.js');
var Parser = require('../../utils/xmlParse/dom-parser.js')
import { wxLoginApi, yunLoginApi, getSchoolApi,subsystemUrlApi } from "../../utils/network/service";

Page({
  data: {
    currentRole: 0,
    schoolInfo:[],
    schoolSelectIndex:0,
    schoolsName:[],
    schoolName:null,
    account:null,
    password:null,
    appRes:null,
    userInfo: {},
    hasUserInfo: false,
    encryptedData:null,
    iv:null,
    wxLoginInfo:null,
    loginInfo: {
      title: '微信授权',
      content: '获得您的公开信息(昵称、头像等)',
      logName: '',
      logImage: '../../images/login-icon.png',
    }  
  },
   
  onLoad: function () {
    wx.hideTabBar();  
    this.getUserInfo();
  },

  onShow:function(){},

  //①检查用户授权情况
  getUserInfo: function(e) {
     let that = this;
     let userInfo = wx.getStorageSync('userInfo')
     console.log(userInfo);
     let dialogComponent = this.selectComponent('.wxc-dialog');    
     if (!userInfo) {//未授权,弹出
       dialogComponent && dialogComponent.show();
     } else {//已授权
       dialogComponent && dialogComponent.hide();
       this.setData({
         userInfo: userInfo
       })
       //获取用户信息
       that.wxgetUserInfo();  
     }
  },

  //②获取用户信息
  wxgetUserInfo:function(){
    var that = this;
    wx.showLoading({
      title: '登录中...',
      mask:true
    })
    wx.getUserInfo({
    success(res) {
      wx.hideLoading();
      console.log("获取用户信息成功", res)
      app.globalData.userInfo = res.userInfo  
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        iv:res.iv,
        encryptedData:res.encryptedData
      })
      wx.setStorageSync('userInfo', res.userInfo)
      that.wxLoginHandler()
    },
    fail(res) {
      console.log("获取用户信息失败", res)
      wx.hideLoading();
      that.showgetUserInfoAgain("获取用户信息失败");
     }
    })
   },
  
  // ③先执行微信登录，获取code到后台获取unionID
  wxLoginHandler:function(){
    let that = this
    wx.showLoading({
      title: '登录中...',
      mask:true,
    })
    // 微信登录
    wx.login({ 
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId 
        if (res.code) {
          app.globalData.appRes = res; 
          that.setData({
            appRes:res
          })
          that.autoLoginCheck(res)
        } else {
          console.log('登录失败！' + res.errMsg);
          wx.showModal({
            title: '提示！',
            confirmText: '重新登录',
            showCancel: false,
            content: "获取用户失败",
            success: function(res) {
              if (res.confirm) {
                that.wxLoginHandler();
              }
            }
          })
         }
      },
      fail(res){
         that.wxReloginHandler();
      }
    })
  },
   
   //④执行后台检测绑定API,获取到信息证明已绑定,直接登录
   autoLoginCheck:function(res){
    
    var that = this;   
    var urlParam = {
      "AppID": "wxe6be07562204f345",
      "BrowserInfo": "Andriod",
      "LoginIP": "192.168.2.90",
      "MacAddress": '',
      "MachineType": app.globalData.phoneType,
      "Secret": "ff6de5c33cf2c775a9128b874d1c11ae",
      "SysTemID": "E43",
      "js_Code": res.code,
      "encryptedData": that.data.encryptedData,
      "iv": that.data.iv,
      "WXName": app.globalData.userInfo.nickName,
      "WXPhoto": app.globalData.userInfo.avatarUrl,
      "phone": "null"
    }
    
    wxLoginApi(urlParam).then(data => {
      wx.hideLoading();
      if (data['error'] == 0) {
        console.log(data.data['msg'])
         if(data.data['userInfo']){
          that.setData({
            wxLoginInfo:data.data
          })
           that.loginToMainPageWithData(data)
         }else{                           
          that.setData({
             wxLoginInfo:data.data
          })
          that.sendSchoolsInfoRequst();  
          app.showToastError('用户未绑定，请绑定登录绑定')
         }
      }else{
        app.showToastError('登录失败,请重新登录')
      }
    }).catch(e => {
      app.showToastError('请求失败,请重新登录')
      that.wxReloginHandler();
    })
   },

   //获取学校信息
  sendSchoolsInfoRequst:function(){
    getSchoolApi().then(data => {
      var that = this;
      if (data['error'] == 0) {
        var schoolNameInfo =  new Array();
        data.data.schools.forEach(item => {            
        schoolNameInfo.push(item.SchoolName)
       })
      //缓存学校信息
      var schoolsInfo = JSON.stringify(data.data.schools)
      wx.setStorage({
        key: "schoolsInfo",
        data: schoolsInfo
      })
      that.setData({
        schoolInfo:data.data.schools,
        schoolsName:schoolNameInfo
      })
       console.log(that.data.schoolsName)
      }else{
        wx.getStorage({
          key: 'schoolsInfo',
          success: function (res) {
            var schoolsName = []
            var schoolsInfoArr = JSON.parse(res.data)
            schoolsInfoArr.forEach(element => {
              schoolsName.push(element.SchoolName)
            });
            that.setData({
              schoolInfo: data.data.schools,
              schoolsName: schoolsName
            })
          },
        })
      }
    }).catch(e => {
      wx.getStorage({
        key: 'schoolsInfo',
        success: function (res) {
          var schoolsName = []
          var schoolsInfoArr = JSON.parse(res.data)
          schoolsInfoArr.forEach(element => {
            schoolsName.push(element.SchoolName)
          });
          that.setData({
            schoolInfo: schoolsInfoArr,
            schoolsName: schoolsName
          })
        },
      })
    })
  },

   //手动登录
   loginAction:function(){
     
     let userInfo = wx.getStorageSync('userInfo')
     let dialogComponent = this.selectComponent('.wxc-dialog');
     console.log(this.data.account)
     if (!userInfo) {
       dialogComponent && dialogComponent.show();
       return;
     }

   
      if(!this.data.schoolName){
        app.showToastError('请选择学校')
        return;
      }

      if(!this.data.account){
        app.showToastError('请输入账号')
        return;
      }

      if(!this.data.password){
        app.showToastError('请输入密码')
        return;
      }

     if (!this.data.wxLoginInfo.wxsession) {
       app.showToastError('获取用户信息失败,请退出重试')
       return;
     }

     
     wx.showLoading({
       title: '登录中...',
       mask:true
     })
       
      var urlParam = {
        "AppID": "wxe6be07562204f345",//wx9e4895714e80e3f1
        "BrowserInfo": "Andriod",
        "LoginIP": "192.168.2.90",
        "MacAddress": '',
        "MachineType": app.globalData.phoneType,
        "OpenID": this.data.wxLoginInfo.wxsession.openid,
        "PSW":MD5.reverseMD5String(this.data.password),
        "SchoolID": this.data.schoolInfo[this.data.schoolSelectIndex].SchoolID,
        "SysTemID": "E43",
        "UnionID": this.data.wxLoginInfo.wxsession.unionid,
        "UserID": this.data.account,
        "WXName": app.globalData.userInfo.nickName,
        "WXPhoto": app.globalData.userInfo.avatarUrl,
        "phone": "null"
      } 

     app.globalData.loginParam = urlParam;
     var password = MD5.reverseMD5String(this.data.password)
     wx.setStorageSync('password', password)
      yunLoginApi(urlParam).then(data => {
        var that = this;
        wx.hideLoading();
        if (data['error'] == 0) {
          if(data.data['userInfo']){
            that.loginToMainPageWithData(data)
          } else if (data.data['msg'] == '账号密码不匹配') {
            app.showToastError('账号密码不匹配,请重新输入')
          }else{               
            app.showToastError(data.data['msg'])
            that.setData({
                wxLoginInfo:data.data
            })
          }
        }else{
          app.showToastError('登录失败,请稍后再试');
        }
      }).catch(e => {
        app.showToastError('请求失败');
        console.error('请求失败',e);
      })

   },

  //获取数据成功，登录到对应页面
  loginToMainPageWithData:function(data){
    var that = this
   
    app.globalData.loginInfo = data.data
    app.globalData.userName = data.data.userInfo.UserName
    app.globalData.Token = data.data.userInfo.Token
    app.globalData.schoolID = data.data.schoolInfo.SchoolID
    app.globalData.userID = data.data.userInfo.UserID
    app.globalData.schoolUrl = data.data.schoolInfo.HostServerUrl
    app.globalData.Psw = data.data.userInfo.Psw

    var curRole = 2;
    var userClassStr = data.data.userInfo.UserClass;
    switch (data.data.userInfo.UserType) {
      case 0, 6: {
        curRole = 0;
        break;
      };
      case 1: {
        curRole = 1;
        break;
      };
      case 2: {
        curRole = 2;
        break;
      };
      case 3: {
        curRole = 3;
        break;
      };
      default:
        curRole = 0;
        break;
    }
    app.globalData.userType = curRole
    that.setData({
      wxLoginInfo: data.data,
      currentRole: curRole
    })

    // app.Token(),
    app.refreshToken(data.data.schoolInfo.HostServerUrl);
    //发起网络请求
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 2000,
      success: function () {

        if (that.data.currentRole == 2) {
          app.showToastError('正在跳转...');
          wx.redirectTo({
            url: '../../pages/Student/student',
          })
        } else if (that.data.currentRole == 0) {
          app.showToastError('正在跳转...');
          wx.redirectTo({
            url: '../../pages/Admin/admin',
          })
        } else if(that.data.currentRole == 1) {
          app.showToastError('正在跳转...');
          wx.redirectTo({
            url: '../../pages/Teacher/teacher',
          })
        } else if(that.data.currentRole == 3){
          wx.redirectTo({
            url: '../../pages/Parent/parent',
          })
        }
      }
    })
  },

  //获取资产子系统地址
   getsubsystemUrlRequest:function(){
    // app.showLoading("获取系统信息...",true)
    var that = this;
    var schoolUrl = app.globalData.schoolUrl
    var params = {"sysID": "E44",}
  
    subsystemUrlApi(schoolUrl,params).then(data => {
       app.hideLoading();
       console.log(data);
       var XMLParser = new Parser.DOMParser()
       var doc = XMLParser.parseFromString(data)  
       var domInfo = doc.getElementsByTagName('WebSvrAddr')['0'];
         
       try {
          var  systemUrl = domInfo.firstChild.nodeValue;
          if(systemUrl){
              app.assetSystemUrl = systemUrl;
              console.log(app.assetSystemUrl);
          }else{
             app.showToastError("获取子系统失败")
          }
       } catch (error) {
          app.showToastError("获取子系统失败")
       }

    }).catch(e => {
        console.log("错误了");
        app.showToastError("请求异常,请稍后再试")
    }) 
   },

  
  //学校选择操作
  schoolChooseHandler:function(sender){
    this.setData({
      schoolName: this.data.schoolsName[sender.detail.value],
      schoolSelectIndex:sender.detail.value,
    })
    console.log(this.data.schoolName);
    },
    
    //跳转到学校列表
    schoolListInfoHander:function(){
      wx.navigateTo({
        url: '../../pages/Login/schoolList/schoolList',
      })
    },
  
    //账号输入
    accountAction:function(e){
    console.log('111');
    this.setData({
      account: e.detail.value,
    });
    },

    
    //密码输入
    passwordAction:function(sender){
    console.log(sender.detail.value);
    this.setData({
      password: sender.detail.value,
    });
    },

  //获取用户信息失败,重新获取用户信息
  showgetUserInfoAgain:function(e){
    var that = this;
      wx.showModal({
        title: '提示！',
        confirmText: '重新获取',
        showCancel: true,
        content: "获取用户信息失败",
        success: function(res) {
          if (res.confirm) {
              that.wxgetUserInfo();
          }
        }
      })
  },

  //登录(请求)失败,弹框重新执行登录操作
  wxReloginHandler:function(){
    let that = this
    wx.hideLoading();
    wx.showModal({
      title: '提示！',
      confirmText: '重新登录',
      showCancel: false,
      content: "登录失败",
      success: function(res) {
        if (res.confirm) {
          that.wxLoginHandler();
        }
      }
    })     
  },
  
  //授权操作
  onConfirm(e) { // 点击允许
    let dialogComponent = this.selectComponent('.wxc-dialog');
    dialogComponent && dialogComponent.hide();
    let userInfo = JSON.parse(e.detail.detail.rawData)
    wx.setStorageSync('userInfo', userInfo)
    this.wxgetUserInfo();
  },
  onCancel() { // 点击拒绝
    let dialogComponent = this.selectComponent('.wxc-dialog');
    dialogComponent && dialogComponent.hide();
  },

  
})

