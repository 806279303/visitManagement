// pages/userInfo/userInfo.js
const app = getApp()
import visitorApi from '../../utils/api/visitor'
import {getVisitorRootAPI} from '../../utils/network/service'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhotoUrl:'',
    userPhotoBase64:'',
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.loadUserInfo()
  },
  loadUserInfo(){
    let that = this
    const userType = app.globalData.userType,
          userID = app.globalData.userID
    app.showLoading('用户数据加载中')
    visitorApi.searchVisitorInfoApi(app.globalData.userID).then(res=>{
      app.hideLoading()
      let {result, code} = res
      if(result.length == 0){
        app.showToastError('获取用户信息失败，请重试！')
        return
      }
      that.setData({
        userInfo:result[0],
        userPhotoUrl: getVisitorRootAPI() + result[0].visitor_image 
      })
    })
  },



  chooseUserPhoto() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths;
        for (let x = 0; x < tempFilePaths.length; x++) {
          wx.getFileSystemManager().readFile({
            filePath: tempFilePaths[x], //选择图片返回的相对路径
            encoding: "base64",//这个是很重要的
            success: res => { //成功的回调
              //返回base64格式
              that.setData({
                userPhotoUrl: tempFilePaths[x],
                userPhotoBase64: 'data:image/jpeg;base64,'+res.data
              })
            }
          })
        }
      }
    })
  },

  //--------------------保存用户信息系统更改------------------------
  updateUserInfo(){
    let that = this
    const userInfo = this.data.userInfo,
          newUserInfo = {
      id_num: userInfo.id_num,
      name: userInfo.name,
      phone: userInfo.phone,
      visitor_id:  userInfo.visitor_id,
      base64Str:that.data.userPhotoBase64,
      memo:userInfo.memo
    }
    if(userInfo.name == '' || userInfo.id_num == '' || userInfo.phone == ''){
      app.showToastError('请填写相关必填信息!')
      return
    }
    app.showLoading('稍后')
    visitorApi.putVisitorInfoApi(newUserInfo).then(res=>{
      const {result, code} = res
      if(code == 1){
        app.showToastSuccess('保存成功')
        wx.navigateBack({
          delta: 1
        });
      }else{
        app.showToastError('保存失败，请重试')
      }
    })
  },



  //返回上一层
  backToHisDetail(){
    wx.navigateBack({
      delta: 1
    });
  },
  userNameInput(e){
    const userInfo = this.data.userInfo
    userInfo.name = e.detail.value
    this.setData({userInfo})
  },
  userCardInput(e){
    const userInfo = this.data.userInfo
    userInfo.id_num = e.detail.value
    this.setData({userInfo})
  },
  userPhoneInput(e){
    const userInfo = this.data.userInfo
    userInfo.phone = e.detail.value
    this.setData({userInfo})
  },
  userRemarkInput(e){
    const userInfo = this.data.userInfo
    userInfo.memo = e.detail.value
    this.setData({userInfo})
  },
  userNameInputDel(){
    const userInfo = this.data.userInfo
    userInfo.name = ''
    this.setData({userInfo})
  },
  userCardInputDel(){
    const userInfo = this.data.userInfo
    userInfo.id_num = ''
    this.setData({userInfo})
  },
  userPhoneDel(){
    const userInfo = this.data.userInfo
    userInfo.phone = ''
    this.setData({userInfo})
  },
  userRemarkDel(){
    const userInfo = this.data.userInfo
    userInfo.memo = ''
    this.setData({userInfo})
  },
})