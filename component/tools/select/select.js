// components/tools/select/select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Object
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isList:false,
    chosenVal:''
  },

  lifetimes:{
    attached(){

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showList(){
      let that = this
      that.setData({
        isList:!that.data.isList
      })
    },
    //选择当前行
    chooseCurRow(e){
      const val = e.currentTarget.dataset.val
      let that = this
      that.setData({
        chosenVal:val,
        isList:false
      })
      that.triggerEvent('selectChanged',{value:val})
    }
  }
})
