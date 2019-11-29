/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-16 06:03:30
 * @LastEditTime: 2019-09-27 11:37:43
 * @LastEditors: Please set LastEditors
 */
// pages/main/index.js
const app = getApp()
import {  getSchoolApi } from "../../../utils/network/service";


Page({
  
    data: {        
        schoolInfo:[],
        schoolSelectIndex:0,
        schoolsName:[],
        schoolName:null,
        namesInfo:[],
        value:0,
    },
        
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
       this.getSchoolInfo()
    },
    
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
    * 生命周期函数--监听页面隐藏
    */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    //获取学校信息
    getSchoolInfo:function () {
        var that = this;
        app.showLoading('加载中...',true)
        getSchoolApi().then(data => {
          app.hideLoading();
          if (data['error'] == 0) {
            var schoolNameInfo = new Array();
            data.data.schools.forEach(item => {
              item.selected = false;
              schoolNameInfo.push(item)
            })

            var schoolData = JSON.stringify(data.data.schools)
            wx.setStorageSync('schoolsInfo', schoolData)
            that.setData({
              schoolInfo: data.data.schools,
              schoolsName: schoolNameInfo
            })
            console.log(schoolNameInfo)
          } else {
            app.hideLoading();
            app.showToastError('获取学校信息失败');

          }
        }).catch(e => {
          app.hideLoading();
          app.showToastError('获取学校信息失败');
          console.error('失败', e);
        })
      },

    
      //选择学校
      onSlelctedIndex(e) {
        console.log(e);
        var that = this
       
        var schoolNameInfo = new Array();
        that.data.schoolsName.forEach((item,index)=> {
          item.selected = false;
          if(index == e.currentTarget.dataset.idx){
            item.selected =true;
          }
          schoolNameInfo.push(item)
        })

        that.setData({
          value: e.currentTarget.dataset.idx,
          schoolName:this.data.schoolsName[e.currentTarget.dataset.idx].SchoolName,
          schoolsName: schoolNameInfo
      })

     
        console.log('radio发生change事件，携带value值为：', e.detail)
    },

    sureAction:function(sender){
      var that = this;
      if(!that.data.schoolName){
        app.showToastError('请选择学校');
      }else{
      
        setTimeout(() => {
          app.showToastError('设置成功')
          var pages = getCurrentPages() // 获取栈中全部界面的, 然后把数据写入相应界面
          var prePage = pages[pages.length - 2]  //上一个界面

          var schoolNameInfo = new Array();
          that.data.schoolsName.forEach((item,index)=> {
            schoolNameInfo.push(item.SchoolName)
          })
  
          if(prePage.route == 'pages/Login/login'){
              wx.navigateBack({
                  success: function(res) {
                      prePage.setData({
                          schoolInfo: that.data.schoolInfo,
                          schoolSelectIndex: that.data.value,
                          schoolsName:schoolNameInfo,
                          schoolName:that.data.schoolName,
                      });
                  },
                  fail: function(res) {
          
                  }
              });
          }
        }, 1000);     
      } 
    },
})