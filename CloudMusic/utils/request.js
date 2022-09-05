//发送ajax请求
// 1. 封装功能函数
import config from './config';

export default (url, data={}, method='GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url, //设置接口路径  mobileHost host
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        // console.log('请求成功', res);
        resolve(res.data);
        if(data.isLogin || data.captcha){ //登录请求
          // 将用户的cookie存入本地
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
      },
      fail: (err) => {
        // console.log('请求失败', err);
        reject(err);
      }
    })
  })
  
}