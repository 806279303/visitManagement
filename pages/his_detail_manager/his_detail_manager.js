// pages/his_detail_manager/his_detail_manager.js

import tools from '../../utils/util'
import visitorRegApi from '../../utils/api/visitorReg'
import visitorApi from '../../utils/api/visitor'
import util from '../../utils/util'
import utils from '../../utils/common/util'
import {getVisitorRootAPI} from '../../utils/network/service'
var app =  getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHei:null,
    isChoosePlaceOfVisitor:false,
    isChooseRejectOfVisitor:false,

    queryInfo:{},

    isVisitorImageErr:false,


    buildings:[],
    chosenBuildingName:'',
    rooms:[],
    chosenRoomName:'',
    buildingsAndRooms:[],

    rejectReason:['出差中','上课中','其他'],
    chosenRejectReason:'',
    rejectRemark:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this,
        queryInfo = JSON.parse(options.queryInfo)
    queryInfo.approveStatus = parseInt(queryInfo.approveStatus) 
    queryInfo.visitor_image = getVisitorRootAPI() + queryInfo.visitor_image
    const { height : winHei } = tools.getClientInfoOfRPX()
    that.setData({
      winHei:winHei-96+'rpx',
      queryInfo,
    })

    //尝试获取教室身份信息
    visitorApi.searchVisitorInfoApi(app.globalData.userID).then(res=>{
      const {result, code} = res
      if(code == 1){
        queryInfo.visitor_image = getVisitorRootAPI() + result[0].visitor_image
        console.log(queryInfo.visitor_image)
        that.setData({
          queryInfo,
          isVisitorImageErr:false
        })
      }
    })
  },

  toUserInfo(){
    wx.navigateTo({
      url: '../userInfo/userInfo',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  showErrorVisitorImage(){
    this.setData({
      isVisitorImageErr:true
    })
  },
  //设置rooms
  setRooms(){
    const chosenBuildingName = this.data.chosenBuildingName,
          buildingsAndRooms = this.data.buildingsAndRooms
    let rooms = [],that =this
    if(chosenBuildingName == '')return
    for(let i=0;i<buildingsAndRooms.length;i++){
      console.log(buildingsAndRooms[i].buildingName)
      console.log(chosenBuildingName)
      if(buildingsAndRooms[i].buildingName == chosenBuildingName){
        rooms.push(buildingsAndRooms[i].roomName)
      }
    }
    that.setData({rooms})
    console.log(that.data.rooms)
  },
  //选择接访地点
  openVisOptions(){
    let that = this
    app.showLoading('楼宇加载中',true)
    that.setData({
      isChoosePlaceOfVisitor:true
    })
    visitorRegApi.getAllBuildingApi().then(res=>{
      const { result, code } = res
      if(code == 1){
        app.hideLoading()
        let buildings = [], rooms = []
        // utils
        for(let i=0;i<result.length;i++){
          // buildings.push({
          //   buildingName:result[i].buildingName,
          //   buildingId:result[i].buildingId
          // })
          buildings.push(result[i].buildingName)
        }
        buildings = utils.unique(buildings)
        console.log(buildings)
        that.setData({
          buildingsAndRooms:result,
          buildings
        })
        that.setRooms()
      }else{
        app.hideLoading()
        app.showToastError('获取楼宇信息失败，请重新打开')
      }
    })
  },
  buildingChanged(e){
    this.setData({
      chosenBuildingName:e.detail.value
    })
    this.setRooms()
  },
  roomChanged(e){
    this.setData({
      chosenRoomName:e.detail.value
    })
  },


  confirmVisOptions(){//确认通过
    let that = this,roomId=null
    const buildingName = this.data.chosenBuildingName,
          roomName = this.data.chosenRoomName,
          buildingsAndRooms = this.data.buildingsAndRooms
    for(let i=0;i<buildingsAndRooms.length;i++){
      if(buildingsAndRooms[i].buildingName == buildingName && buildingsAndRooms[i].roomName == roomName){
        roomId = buildingsAndRooms[i].roomId
      }
    }
    if(!roomId){
      app.showToastError('获取异常，请重新选择')
      return
    }
    const sendData = {
      approve_status: "1",
      check_time:util.formatTime(new Date()),
      greetplace:buildingName + roomId,
      registeration_id:that.data.queryInfo.registerationId
    }
    console.log(sendData)
    visitorRegApi.updateVisitedInfoApi(sendData).then(res=>{
      const { result, code } = res
      if(code == 1){
        console.log(result)
        app.showToastSuccess('通过操作成功')
        wx.navigateBack({
          delta: 1
        });
      }else{
        app.showToastError('操作失败，请重试')
      }
    })
  },
  //取消选择接访地点
  cancelVisOptions(){
    let that = this
    that.setData({
      isChoosePlaceOfVisitor:false,
      chosenBuildingName:'',
      chosenRoomName:'',
    })
  },
  closeRejectOfVisitor(){
    let that = this
    that.setData({
      isChooseRejectOfVisitor:false
    })
  },
  rejectVis(){
    let that = this
    that.setData({
      isChooseRejectOfVisitor:true
    })
  },
  rejectReasonChanged(e){
    this.setData({
      chosenRejectReason:e.detail.value
    })
  },
  rejectRemarkInput(e){
    this.setData({
      rejectRemark:e.detail.value
    })
  },
  rejectVisOptions(){//驳回提交
    let that = this
    const sendData = {
      approve_status: "2",
      check_time:util.formatTime(new Date()),
      deny_reason:this.data.chosenRejectReason,
      memo:this.data.rejectRemark,
      registeration_id:that.data.queryInfo.registerationId
    }
    visitorRegApi.updateVisitedInfoApi(sendData).then(res=>{
      const { result, code } = res
      if(code == 1){
        console.log(result)
        app.showToastSuccess('驳回成功')
        wx.navigateBack({
          delta: 1
        });
      }else{
        app.showToastError('驳回失败，请重试')
      }
    })
  },
})