function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

function debounce(fn,delay) {//节流
  let timerId;
  return function (...args) {
      if (timerId) {
          clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
          fn(...args);
          timerId = null;
      }, delay);
  }
}

function getClientInfoOfRPX(){
  let that = this,width,height
  // 获取系统信息
  wx.getSystemInfo({
    success: function (res) {
      // 获取可使用窗口宽度
      let clientHeight = res.windowHeight;
      // 获取可使用窗口高度
      let clientWidth = res.windowWidth;
      // 算出比例
      let ratio = 750 / clientWidth;
      // 算出高度(单位rpx)
      height = clientHeight * ratio;
      width = clientWidth * ratio;
    }
  })
  
  return { width, height}
}
export default {
  formatNumber,
  formatTime,
  debounce,
  getClientInfoOfRPX
}
