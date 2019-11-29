//app.js
App({
  systemInfo: null,
  isIPhoneX: false,
  phoneType: 3,
  homePageHeight: 0,
  navigationBarHeight: 0,
  tabbarHeight: 0,
  screenHeight: 0,
  screenWidth: 0,
  naviHomeHeight: 0,
  statusBarHeight: 0,
  timer: null,
  isFristLanch: false,

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })


    wx.getSystemInfo({
      success: res => {

        this.systemInfo = res;

        let reg = /ios/i;
        let naviHeight = 44;//导航状态栏高度
        if (reg.test(this.systemInfo.system)) {
          naviHeight = 44;
        } else {
          naviHeight = 48;
        }
        console.log(res);
        this.phoneType = res.model.includes('iPhone') ? 4 : 3;
        this.globalData.phoneType = res.model.includes('iPhone') ? 4 : 3;
        this.statusBarHeight = res.statusBarHeight;
        this.navigationBarHeight = res.statusBarHeight + naviHeight;
        const iphoneX = /iphone x/i.test(res.model);
        const iphoneNew = /iPhone11/i.test(res.model) && res.screenHeight === 812;
        this.isIPhoneX = iphoneX || iphoneNew
        this.homePageHeight = res.screenHeight - (this.isIPhoneX ? 88 : 50);
        this.screenHeight = res.screenHeight;
        this.screenWidth = res.screenHeight;
        this.tabbarHeight = (this.isIPhoneX ? 88 : 50);
        this.naviHomeHeight = res.screenHeight - res.statusBarHeight - naviHeight;
      }
    })

    this.isFristLanch = true;
  },
  globalData: {
    userInfo: null,
    localuserInfo: null,
    userName: null,
    userType: null,
    userID: null,
    Token: null,
    loginInfo: null,
    schoolID: null,
    schoolUrl: null,
    phoneType: 3,
    loginParam: null,
    Psw: null,
  },

  /**
     * 显示success日志
     */
  showToastSuccess: function (message) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 2000
    })
  },

  /**
   * 显示错误日志
   */
  showToastError: function (message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  },

  showLoading: function (text, mask) {
    if (mask) {
      wx.showLoading({
        title: text,
        mask: mask,
      });
    } else {
      wx.showLoading({
        title: text,
        mask: false,
      });
    }
  },

  hideLoading: function () {
    wx.hideLoading()
  },

})