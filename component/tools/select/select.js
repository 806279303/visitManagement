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
    chosenVal:'初始化文字'
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
      const id = e.currentTarget.dataset.id
      let that = this
      that.setData({
        chosenVal:'当前选择id'+id,
        isList:false
      })
      that.triggerEvent('selectChanged',{value:id})
    }
  }
})
