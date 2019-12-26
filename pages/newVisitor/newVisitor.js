// pages/newVisitor/newVisitor.js
import visRegApi from '../../utils/api/visitorReg'
import utils from '../../utils/util'
import util from '../../utils/common/util'
import {getVisitorRootAPI} from '../../utils/network/service'
import visitorApi from '../../utils/api/visitor'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVisitorImageErr:true,
    visitorImageUrl:'',


    //受访者输入框点击记录
    newInterviewee:"",
    isVisitedSelect:false,
    interClickTouchStart:null,
    interDebounceTimer:null,
    interInfo:[],
    filterInterInfo:[],
    choosedInterInfo:{},
    //访问时间
    causeTime:'',
    //相关事宜/访问事由
    causeVal: "请选择>",
    causeIndex: 0,
    causeArr: [
      '家长会',
      '教师约谈',
      '公开课',
      '看望学生',
      '其他'
    ],
    causeInputFocus:false,
    causeInputVal:"",
    //随行人员相关
    accomImgUrl:"",
    accomImgBase64:"",
    accomName:"",
    accomCard:"",
    accomPhone:"",
    accomArr:[],
    curAccomInfo:{},
    curAccomIdx:0,

    accomPeo:'',//界面显示

    accomNameList:false,
    accomDebounceTimer:null,
    filterAccomList:[],

    //随行车辆
    isNewCar:false,
    accomCar:'',
    curAccomCarIdx:0,
    accomCarArr:[],
    accomCars:'',

    //表单总data
    newVisData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // visRegApi.getVisitorManageApi(100, 1).then(res => {
    //   console.log(res)
    // })
    let that = this
    visRegApi.getAllVisitedApi(10000, 1).then(res => {
      let that = this
      if(res.code == 1){
        const { result:{ list, size, pages, total, pageSize, pageNum} } = res
        let interInfo = []
        for(let i=0;i<list.length;i++){
          if(list[i].userType == 0 || list[i].userType == 1 || list[i].userType == 5 || list[i].userType == 6){
            interInfo.push(list[i])
          }
        }
        that.setData({
          interInfo
        })
      }

    })
    //获取访客头像信息
    visitorApi.searchVisitorInfoApi(app.globalData.userID).then(res=>{
      const {result, code} = res
      if(code == 1){
        that.setData({
          visitorImageUrl: getVisitorRootAPI() + result[0].visitor_image,
          isVisitorImageErr:false
        })
      }else{
        app.showToastError('用户头像信息获取失败！')
        that.setData({
          isVisitorImageErr:true
        })
      }
    })
  },

  showErrorVisitorImage(){
    this.setData({
      isVisitorImageErr:true
    })
  },
  //个人信息界面
  toUserInfo() {
    // wx.previewImage({
    //   current: 'http://139.9.85.80:10101/App_Data/ClassFacePictures/1574732540.jpg', // 当前显示图片的http链接
    //   urls: ['http://139.9.85.80:10101/App_Data/ClassFacePictures/1574732540.jpg'] // 需要预览的图片http链接列表
    // })
    wx.navigateTo({
      url: '../userInfo/userInfo',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },
  //点击受访者输入框 -单击搜索 双击关闭
  intervieweeClick(e){
    //e.timeStamp：当前点击时的毫秒数；
    // this.touchStartTime： 储存上一次点击时的毫秒数，默认0
    // if(!this.data.interClickTouchStart){
    //   this.data.interClickTouchStart = e.timeStamp
      
    // }
    // if (e.timeStamp - this.data.interClickTouchStart  < 300){
    //   // 双击，进入
    // }else{
    //   // 单击
    // }

    // this.touchStartTime = e.timeStamp;

    let that = this
    that.setData({
      isVisitedSelect:false
    })
  },
  intervieweeBlur(){
    let that = this
    that.setData({
      isVisitedSelect:false
    })
  },


  //---------------随行人员窗口事件-----------------------------------

  //添加人员弹窗
  openNewAccompany() {
    let that = this,
        accomArr = this.data.accomArr,
        curAccomIdx = accomArr.length
    that.setData({
      isNewVisitor: true,
      curAccomIdx,
    })
  },
  closeNewAccompany() {
    let that = this
    //需要清空表单
    that.setData({
      isNewVisitor: false,
      accomImgUrl:""
    })
  },
  accomNameClick(){
    this.setData({
      accomNameList:false
    })
  },
  //----------------------------------------------------------------


  //-------------------受访者监听-----------------
  //监听判断
  matchInterArr(inputVal,attr,interArr){
    return interArr.filter(val=>{
      return val[attr].indexOf(inputVal) !== -1
    })
  },
  debounce(fn, delay) {//防抖
    let that = this
    return function (...args) {
        if (that.data.interDebounceTimer != null) {
          clearTimeout(that.data.interDebounceTimer)
        }
        that.data.interDebounceTimer = setTimeout(() => {
          fn(...args);
        }, delay);
    }
  },

  //受访者监听输入、重置输入
  intervieweeInput(e) { 
    //防抖触发模糊查询
    let that = this,
        val = e.detail.value,
        filterInterInfo = [],
        interInfo = that.data.interInfo
    that.setData({ 
      newInterviewee: val
    }) 
    if(val == ''){
      that.setData({
        isVisitedSelect:false
      })
      return
    }
    that.debounce(()=>{
      filterInterInfo = that.matchInterArr(val,'userName',interInfo)//下拉数组
      that.setData({
        filterInterInfo
      })
      if(that.data.filterInterInfo.length>0){
        that.setData({
          isVisitedSelect:true
        })
      }else{
        that.setData({
          isVisitedSelect:false
        })
      }
    },100)()
  },
  intervieweeBlue(){
    this.setData({
      isVisitedSelect:false
    })
  },
  //下拉列表点击选择受访者
  chooseCurInter(e){
    const curInterInfo = e.currentTarget.dataset.curinterinfo
    this.setData({
      newInterviewee:curInterInfo.userName,
      choosedInterInfo:curInterInfo,
      isVisitedSelect:false
    })
  },
  reset_interviewee() { 
    this.setData({ 
      newInterviewee: '' 
    }) 
  },



  //-------------------------------------------------------------

  
  //时间选择
  timeChanged(e) {
    this.setData({causeTime:e.detail})
  },
  //事宜选择
  causeChanged(e) {
    let that=this,causeVal = that.data.causeArr[e.detail.value]
    this.setData({causeVal})
    if(causeVal=='其他'){
      that.setData({causeInputFocus:true})
    }
  },
  //事宜输入框
  causeInput(e){
    this.setData({
      causeInputVal:e.detail.value
    })
  },





  //----------随行人员相关----------------------------------------------
  
  //检测随行人员见面显示值随便变化 两个人 三个人
  watchAccomPeoLen(){
    const accomArr = this.data.accomArr
    let that = this,
        accomPeoStr = ''
    if(accomArr.length > 2){
      accomPeoStr = accomArr.length+'人'
    }else if(accomArr.length >= 0 && accomArr.length <= 2){
      for(let i=0;i<accomArr.length;i++){
        accomPeoStr+=accomArr[i].accomName+','
      }
      accomPeoStr = accomPeoStr.substring(0,accomPeoStr.length-1)
    }else{
      accomPeoStr = '无'
    }
    that.setData({
      accomPeo:accomPeoStr
    })
  },
  //随行人员照片
  chooseVisImg() {
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
                accomImgUrl: tempFilePaths[x],
                accomImgBase64: 'data:image/jpeg;base64,'+res.data
              })
            }
          })
        }
      }
    })
  },
  accomImgError(){app.showToastError('图片加载失败，请重新选择')},
  //随行人员三个信息
  accomNameDebounce(fn, delay) {//防抖
    let that = this
    return function (...args) {
        if (that.data.accomDebounceTimer != null) {
          clearTimeout(that.data.accomDebounceTimer)
        }
        that.data.accomDebounceTimer = setTimeout(() => {
          fn(...args);
        }, delay);
    }
  },
  accomNameInput(e){
    this.setData({
      accomName:e.detail.value
    })
    let that = this
    //随行人员名字模糊查询
    if(that.data.accomName !== ''){
      that.accomNameDebounce(()=>{
        visRegApi.getAccomVisitedApi(that.data.accomName,app.globalData.userID).then(res=>{
          const {result,code} = res
          if(code == 1){
            that.setData({
              filterAccomList:result,
            })
            if(that.data.filterAccomList.length <= 0){//模糊出来没有数据就不显示，受下拉最小高度影响，不能让他显示出来
              that.setData({
                accomNameList:false
              })
            }else{//有就显示
              that.setData({
                accomNameList:true
              })
            }
          }else{
            // console.log('随行人员列表模糊查询失败')
          }
        })
      },1000)()
    }
  },
  chooseAccomList(e){//点击当前随行人员
    const curAccomList = e.currentTarget.dataset.curaccomlist,
          baseUrl  = app.globalData.assetSystemUrl
    let that = this
    that.setData({accomNameList:true})
    console.log(curAccomList)
    //解析base64
    if(curAccomList.visitor_image !== ''){
      // wx.getFileSystemManager().readFile({
      //   filePath:  baseUrl+curAccomList.visitor_image, //选择图片返回的相对路径
      //   encoding: "base64",//这个是很重要的
      //   success: res => { //成功的回调
      //     //返回base64格式
      //     that.setData({
      //       accomImgUrl: baseUrl+curAccomList.visitor_image,
      //       accomImgBase64: 'data:image/jpeg;base64,'+res.data
      //     })
      //   }
      // })
      that.setData({
        accomImgUrl: baseUrl+curAccomList.visitor_image,
      })
    }
    that.setData({
      accomName:curAccomList.name,
      accomCard:curAccomList.id_num,
      accomPhone:curAccomList.phone,
      accomNameList:false
    })
  },
  accomCardInput(e){this.setData({accomCard:e.detail.value,accomNameList:false})},
  accomPhoneInput(e){this.setData({accomPhone:e.detail.value,accomNameList:false})},
  //添加随行人员
  insertNewAccom(){
    let that = this,
        newAccom = {
          accomImgBase64:that.data.accomImgBase64,
          accomImgUrl:that.data.accomImgUrl,
          accomName:that.data.accomName,
          accomCard:that.data.accomCard,
          accomPhone:that.data.accomPhone,
        },
        accomArr = that.data.accomArr,
        curAccomIdx = that.data.curAccomIdx
    if(that.data.accomName == '' || that.data.accomCard == '' || that.data.accomPhone == ''){
      app.showToastError('请填写随行人员必要信息！')
      return
    }
    accomArr.push(newAccom)
    curAccomIdx++
    that.watchAccomPeoLen()
    //
    that.setData({
      isNewVisitor:false,
      accomArr,
      curAccomIdx,
      accomImgUrl:"",
      accomImgBase64:"",
      accomName:"",
      accomCard:"",
      accomPhone:"",
    })
    app.showToastSuccess('添加随行成功！')
  },
  //上一个随性
  preAccom(){
    let curAccomIdx = this.data.curAccomIdx,
        accomArr = this.data.accomArr,
        that = this
    if(curAccomIdx<=0){
      return
    }else{
      curAccomIdx--
      that.setData({
        curAccomIdx,
        accomImgBase64:accomArr[curAccomIdx].accomImgBase64,
        accomImgUrl:accomArr[curAccomIdx].accomImgUrl,
        accomName:accomArr[curAccomIdx].accomName,
        accomCard:accomArr[curAccomIdx].accomCard,
        accomPhone:accomArr[curAccomIdx].accomPhone,
      })
    }
    console.log(this.data.curAccomIdx)
  },
  //下一个随行
  nextAccom(){
    let curAccomIdx = this.data.curAccomIdx,
    accomArr = this.data.accomArr,
    that = this
    if(curAccomIdx==accomArr.length - 1){
      curAccomIdx++
      that.setData({
        curAccomIdx,
        accomImgUrl:"",
        accomImgBase64:"",
        accomName:"",
        accomCard:"",
        accomPhone:"",
      })
    }else if(curAccomIdx>accomArr.length - 1){
      return
    }else{
      curAccomIdx++
      that.setData({
        curAccomIdx,
        accomImgBase64:accomArr[curAccomIdx].accomImgBase64,
        accomImgUrl:accomArr[curAccomIdx].accomImgUrl,
        accomName:accomArr[curAccomIdx].accomName,
        accomCard:accomArr[curAccomIdx].accomCard,
        accomPhone:accomArr[curAccomIdx].accomPhone,
      })
    }
    console.log(this.data.curAccomIdx)
  },
  //删除当前随行
  delAccom(){
    let curAccomIdx = this.data.curAccomIdx,
        accomArr = this.data.accomArr,
        that = this
    accomArr.splice(curAccomIdx,1)
    if(curAccomIdx == 0){
      that.setData({
        curAccomIdx,
        accomImgBase64:'',
        accomImgUrl:'',
        accomName:'',
        accomCard:'',
        accomPhone:'',
        accomArr
      })
    }else{
      curAccomIdx--
      that.setData({
        curAccomIdx,
        accomImgBase64:accomArr[curAccomIdx].accomImgBase64,
        accomImgUrl:accomArr[curAccomIdx].accomImgUrl,
        accomName:accomArr[curAccomIdx].accomName,
        accomCard:accomArr[curAccomIdx].accomCard,
        accomPhone:accomArr[curAccomIdx].accomPhone,
        accomArr
      })
    }
    that.watchAccomPeoLen()
    app.showToastSuccess('删除随行成功！')
  },
  //更新当前随行
  updateAccom(){
    let curAccomIdx = this.data.curAccomIdx,
        accomArr = this.data.accomArr,
        that = this
    accomArr[curAccomIdx] = {
      accomImgBase64:that.data.accomImgBase64,
      accomImgUrl:that.data.accomImgUrl,
      accomName:that.data.accomName,
      accomCard:that.data.accomCard,
      accomPhone:that.data.accomPhone,
    }
    that.setData({
      accomArr,
      isNewVisitor:false
    })
    that.watchAccomPeoLen()
    app.showToastSuccess('更新随行成功！')
  },

  //-------------------------------------------------------------------------------



  //-------------随行车辆
  openAccompanyCar(){
    let accomCarArr = this.data.accomCarArr
    this.setData({
      isNewCar:true,
      curAccomCarIdx:accomCarArr.length,
      accomCar:''
    })
  },
  closeAccompanyCar(){
    this.setData({
      isNewCar:false
    })
  },
  accomCarInput(e){
    this.setData({
      accomCar:e.detail.value
    })
  },
  insertNewCar(){
    let accomCarArr = this.data.accomCarArr,
        accomCar = this.data.accomCar,
        curAccomCarIdx = this.data.curAccomCarIdx
    if(accomCar == ''){
      app.showToastError('车牌号不能为空!')
      return
    }
    for(let i=0;i<accomCarArr.length;i++){
      if(accomCarArr[i] == accomCar){
        app.showToastError('不能重复添加！')
        return
      }
    }
    accomCarArr.push(accomCar)
    curAccomCarIdx++
    this.setData({
      accomCarArr,
      curAccomCarIdx,
      isNewCar:false
    })
    console.log(accomCarArr,curAccomCarIdx)
    app.showToastSuccess('添加成功')
  },
  preAccomCar(){
    let curAccomCarIdx = this.data.curAccomCarIdx,
        accomCarArr = this.data.accomCarArr
    if(curAccomCarIdx <= 0){
      return
    }
    curAccomCarIdx--
    this.setData({
      accomCar:accomCarArr[curAccomCarIdx],
      curAccomCarIdx,
    })
  },
  nextAccomCar(){
    let curAccomCarIdx = this.data.curAccomCarIdx,
        accomCarArr = this.data.accomCarArr
    if(curAccomCarIdx == accomCarArr.length){
      this.setData({
        accomCar:'',
        curAccomCarIdx
      })
      return
    }
    curAccomCarIdx++
    this.setData({
      accomCar:accomCarArr[curAccomCarIdx],
      curAccomCarIdx
    })
  },
  delAccomCar(){
    let curAccomCarIdx = this.data.curAccomCarIdx,
        accomCarArr = this.data.accomCarArr
    accomCarArr.splice(curAccomCarIdx,1)
    this.setData({
      accomCarArr,
    })
    app.showToastSuccess('删除成功！')
    curAccomCarIdx--
    if(curAccomCarIdx<0){
      this.setData({
        accomCar:'',
        curAccomCarIdx:0
      })
      return
    }else{
      this.setData({
        accomCar:accomCarArr[curAccomCarIdx],
        curAccomCarIdx
      })
    }
  },
  updateAccomCar(){
    let curAccomCarIdx = this.data.curAccomCarIdx,
        accomCarArr = this.data.accomCarArr,
        accomCar = this.data.accomCar
    accomCarArr[curAccomCarIdx] = accomCar
    this.setData({
      accomCarArr
    })
    app.showToastSuccess('修改成功！')
  },
  //-----------------------------





  //-----------预约表单提交-------------------------------------------------------------------

  //表单提交
  newVisInfoSubmit(e){
    let that = this
    const formData = e.detail.value,//受访者 随行车辆 随行物品 备注
          choosedInterInfo = that.data.choosedInterInfo, // 受访者
          accomTime = this.data.causeTime + ':00',//访问时间
          causeVal = this.data.causeVal == '其他'?this.data.causeInputVal:this.data.causeVal,//访问事由
          accomArr = this.data.accomArr,//随行人员
          newVisInfo = {},//params data
          suiteFolloweds = []//接口规范随行人员

    //空值缺值判断
    if(that.data.newInterviewee!=='' || this.data.causeTime !== '' || this.data.causeVal !== '请选择>'){//不为空
      if(choosedInterInfo){//不存在此受访者
        if(choosedInterInfo.userName !== that.data.newInterviewee){
          app.showToastError('系统无此受访者！')
          return
        }
      }
      //估计需要判断当前预约时间
    }else{
      app.showToastError('请填写相关必要信息！')
      return 
    }
          //生成其他主要信息  -受访者 随行车辆 随行物品 备注 访问时间  访问事由 
    const visitorBaeInfo = {
            car_num:that.data.accomCarArr.join('|'),  
            carried_package:formData.accompany_carry,  
            memo:formData.remark,  
            register_time:accomTime,  
            submit_time:utils.formatTime(new Date()),  
            // user_id:choosedInterInfo.userID,  
            // user_name:choosedInterInfo.userName,  
            // user_type:choosedInterInfo.userType,  
            visited_reason:causeVal,  
            visitor_id:app.globalData.userID
          },
          employeeInfo = {
            className: choosedInterInfo.className,
            gender: choosedInterInfo.gender,
            gradeName: choosedInterInfo.gradeName,
            userId: choosedInterInfo.userID,
            userName: choosedInterInfo.userName,
            userType: choosedInterInfo.userType
          }
    

    //生成随行人员数据
    for(let i=0;i<accomArr.length;i++){
      suiteFolloweds.push({
        base64:accomArr[i].accomImgBase64,
        id_num:accomArr[i].accomCard,
        name:accomArr[i].accomName,
        phone:accomArr[i].accomPhone,
      })
    }
    //合并
    newVisInfo.visitorRegisterationInput = visitorBaeInfo
    newVisInfo.suiteFolloweds = suiteFolloweds
    newVisInfo.employeeInfo = employeeInfo

    console.log(JSON.stringify(newVisInfo))
    //调用请求 
    app.showLoading('请稍后')
    visRegApi.insertVisitorApi(newVisInfo).then(res=>{
      const {result, code} = res
      if(code==1){
        app.showToastSuccess('新建成功！')
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)
      }else if(code==2){
        let str = ''
        if(result.list){
          if(result.list.length > 0){
            for(var i=0;i<result.list.length;i++){
              const tempStr = (i+1) +'、随行人员'+result.list[i].name+result.list[i].msg+'。'
              str += tempStr
            }
          }
          else{
            str = '新建预约失败,错误码2,未知原因'
          }
        }
        console.log(str)
        app.hideLoading()
        wx.showModal({
          title: '新建预约失败',
          content: str,
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        app.showToastError('新建预约失败，请重试')
      }
    }).catch(_=>{
      app.hideLoading()
      app.showToastError('新建预约失败，请重试')
    })
  }
})