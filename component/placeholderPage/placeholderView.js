/*
 * @Author: your name
 * @Date: 2019-11-05 15:05:41
 * @LastEditTime: 2019-11-18 15:20:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /classBoard/component/placeholderPage/placeholderView.js
 */
const { windowWidth, windowHeight } = wx.getSystemInfoSync();
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    appHeight: {
      type: Number,
      value: app.homePageHeight,
      observer: function(newVal,oldVal,changedPath){
        if(!newVal){
          let obj = {};
          obj[changedPath[0]] = oldVal;
          this.setData(obj);
        }
      }
    },
    visible: {
      type: Boolean,
      value: false,
      observer: function(newVal,oldVal,changedPath){
        if(!newVal){
          let obj = {};
          obj[changedPath[0]] = oldVal;
          this.setData(obj);
        }
      }
    },
    imageUrl:{
      type: String,
      value:null,
      observer: function(newVal,oldVal,changedPath){
        if(!newVal){
          let obj = {};
          obj[changedPath[0]] = oldVal;
          this.setData(obj);
        }
      }
    },
    placeholderText:{
      type: String,
      value:null,
      observer: function(newVal,oldVal,changedPath){
        if(!newVal){
          let obj = {};
          obj[changedPath[0]] = oldVal;
          this.setData(obj);
        }
      }
    },
    hasError:{
      type: Boolean,
      value:null,
      observer: function(newVal,oldVal,changedPath){
        if(!newVal){
          let obj = {};
          obj[changedPath[0]] = oldVal;
          this.setData(obj);
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    homePageHeight: app.homePageHeight,
    isVisble:false,
    appWidth:windowWidth,
  },

  lifetimes: {
    attached: function () {
     
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },

    created:function(){
     
    }
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
     
    },
    hide: function () { },
    resize: function () { },
  },

  onPageScroll: function () {

    console.log(1)

  },
  /**
   * 组件的方法列表
   */
  methods: {
     imageDidTap:function(){
      this.triggerEvent('imageTap')
     }
  },
})
