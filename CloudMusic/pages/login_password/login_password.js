// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', // 手机号
    password: '' // 用户密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 表单项内容发送改变时的回调
  handleInput(e) {
    // let type = e.currentTarget.id;   //用id传值
    let type = e.currentTarget.dataset.type //data-key="value"
    this.setData({
      [type]: e.detail.value
    })
  },

  // 登录的回调
  async login() {
    let {phone, password} = this.data; //提取data里的数据，并且key值要一致
    // 手机号验证
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    // 定义正则表达式
    let phoneReg = /^1[3-9]\d{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }
    // 密码验证
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    // 前端验证通过 后端验证
    let result = await request('/login/cellphone', {phone, password, isLogin: true});
    if(result.code === 200){  //登录成功
      wx.showToast({
        title: '登录成功'
      })
      // 将用户信息存储在本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      // 跳转至个人中心页
      wx.reLaunch({
        url: '../personal/personal',
      })
    } else if(resultLogin.code === 400){
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    } else if(resultLogin.code === 500) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '登录失败，请重新尝试',
        icon: 'none'
      })
    }
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})