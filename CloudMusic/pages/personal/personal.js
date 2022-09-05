// pages/personal/personal.js
import request from '../../utils/request'

//不是配置项，写在外面
let startY = 0; //手指起始的坐标
let moveY = 0;  //手指移动的坐标
let moveDistance = 0; //手指移动的距离
// function getUserRecentPlayList() {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0rpx)',
    coverTransition: '',
    userInfo: '', //  用户信息
    recentPlayList: [], //用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 读取本地用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){ //需要判空，如果没登录就没用户信息
      this.setData({
        userInfo:  JSON.parse(userInfo), 
      })
      // 获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId);      
    };
  },
  // 获取用户播放记录的功能函数 避免在生命周期函数加async
  async getUserRecentPlayList(userId) {
    let recentPlayListData = await request('/user/record', {uid: userId, type: 1})
    let index = 0
    let recentPlayList = recentPlayListData.weekData.splice(0, 10).map(item => {
      item.id = index++;
      return item;
    }) 
    this.setData({
      recentPlayList 
    })
  },
  


  // 拖拽事件
  handleTouchStart(e){
    startY = e.touches[0].clientY;
    this.setData({
      coverTransition: ''
    })
  },
  handleTouchMove(e) {
    moveY = e.touches[0].clientY;
    moveDistance = moveY - startY;
    if(moveDistance <= 0)
      return;
    moveDistance = Math.min(moveDistance, 80);
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform .8s linear'
    })
  },

  //跳转至登录页的回调
  tologin(){
    // 如果已登录（已有用户本地存储信息）则不跳转登录页
    if(this.data.userInfo){
      return
    }
    wx.navigateTo({
      url: '../login_captcha/login_captcha'
    })
  },
  // 退出登录的回调
  async logout(){
    if(!this.data.userInfo){
      wx.showToast({
        title: '您未登录，请先登录',
        icon: 'none'
      })
      return 
    }
    let result = await request('/logout')
    if(result.code === 200){
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('cookies');
      wx.showToast({
        title: '退出登录成功',
      })
      wx.reLaunch({
        url: '../personal/personal',
      })
    } else {
      wx.showToast({
        title: '退出失败，请稍后再试',
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
    // 生成tabBar实例
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    };
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