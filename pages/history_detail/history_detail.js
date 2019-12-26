// pages/history_detail/history_detail.js
import visitorRegApi from '../../utils/api/visitorReg'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this,
        queryInfo = JSON.parse(options.queryInfo)
        queryInfo.approveStatus = parseInt(queryInfo.approveStatus)
    that.setData({
      queryInfo:queryInfo
    })
  },
  onReady(){
    console.log(this.data.queryInfo)
  },

  /* 回到历史详情 */
  backToHistory(){
    let that = this
    console.log(that.data.queryInfo)
    visitorRegApi.resetVisitedInfoApi(that.data.queryInfo.registerationId).then(res=>{
      const {result, code} = res
      if(code == 1){
        app.showToastSuccess('取消预约成功')
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          });
        },1000)
      }else{
        app.showToastError('操作失败，请重试')
      }
    })
  },
})