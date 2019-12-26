// pages/history/history.js
import visitorApi from '../../utils/api/visitor'
import visitorRegApi from '../../utils/api/visitorReg'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVisitor:true,
    visInfo:[],//申请列表
    messNum:0,//消息提示
    // isTopRefresh:false,
    isBottomRefresh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    // visitorRegApi.getVisitorManageApi(app.globalData.userID).then(res=>{
    //   console.log(res)
    // })
    let that = this
    that.loadVisitorInfo()
    wx.hideHomeButton()
  },

  onShow(){
    //返回刷新
    let that = this
    that.loadVisitorInfo()
  },
  /**
   * 拉取历史申请数据
   * @param {*} callback 函数回调
   */
  loadVisitorInfo(callback){
    let that = this,
        reqApi = null
    if(app.globalData.userType == 0 || app.globalData.userType == 1 || app.globalData.userType == 5 || app.globalData.userType == 6){
      that.setData({isVisitor:false})
      console.log(that.data.isVisitor)
      reqApi = visitorRegApi.getVisitorManageApi 
    }else{//其他身份-学生、家长、教育专家
      that.setData({isVisitor:true})
      reqApi = visitorRegApi.getVisitorHisApi
    }
    app.showLoading('请稍后',true)
    // '96200d75-752d-4f14-8b99-707cc551ad07'
    reqApi(app.globalData.userID).then(res=>{
      if(res.code == 1){
        const {result} = res 
        that.setData({
          visInfo:result,
        })
        that.loadMessageTip(result,1)
        app.hideLoading()
        callback && callback(result)
      }else{
        app.hideLoading()
        app.showToastError('数据获取失败，请下拉刷新')
      }
    })
  },

  /**
   *
   * 根据result生成消息提醒
   * @param {*} result
   */
  loadMessageTip(result,duration){
    let that = this, messNum = 0
    for(let i=0;i<result.length;i++){
      if(result[i]['approveStatus'] == 1){
        const time = new Date().getTime()
        if(new Date(result[i]['registerTime']).getTime() - time <= 60*60*duration){
          messNum++
        }
      }else{continue}
    }
    that.setData({
      messNum
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (e) {
    let that = this
    // that.setData({
    //   isTopRefresh:true
    // })
    that.loadVisitorInfo((result)=>{
      // //刷新字眼
      // that.setData({
      //   isTopRefresh:false
      // })
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('滑动触底了')
    // let that = this
    // that.setData({
    //   isBottomRefresh:true
    // })
    // that.loadVisitorInfo((result)=>{
    //   that.setData({
    //     isBottomRefresh:false
    //   })
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /* 历史详情 */
  to_detail(e) {
    let that = this
    const sendData = JSON.stringify(that.data.visInfo[e.currentTarget.dataset.index]) 
    let url = ''
    if(that.data.isVisitor){
      url = '../history_detail/history_detail?queryInfo='+sendData
    }else{
      url = '../his_detail_manager/his_detail_manager?queryInfo='+sendData
    }
    wx.navigateTo({
      // url: '../his_detail_manager/his_detail_manager',
      url,
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },
  // 新建预约
  toNewVisitor() {
    wx.navigateTo({
      url: '../newVisitor/newVisitor',
      success: (result) => {

      },
      fail: () => { 

      },
      complete: () => { 

      }
    });
  }
})