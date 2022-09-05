// pages/video/video.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航标签数据
    navId: '', //导航的标识
    videoList: [], //视频数据列表
    videoId: '', //视频标识
    videoUpdateTime: [], //记录视频播放进度
    isTriggered: false, //标识是否触发下拉刷新状态
    offset: 1, //标识分页参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //  获取导航数据
    this.getVideoGroupListData();
  },

  // 获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })

    // 获取视频列表数据
    this.getVideoList(this.data.navId);
  },

  // 点击切换导航的回调
  changeNav(e){
    let navId = e.currentTarget.id; // 注意：通过e传参，如果传的是Number会自动转化为String
    // let navId = e.currentTarget.dataset.id  // 通过dataset传的就还是Number
    this.setData({
      navId: +navId,
      videoList: []
    })
    // 动态切换视频列表
      // 显示正在加载 当加载完数据需要关闭 
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navId);
  },

  // 获取视频列表数据
  async getVideoList(navId){
    if(!wx.getStorageSync('cookies')){
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    let videoListData = await request('/video/group', {id: navId});
    let index = 0;
    let videoList = videoListData ? videoListData.datas.map(item => {
      item.id = index++;
      return item;
    }) : '';
    this.setData({
      videoList,
      isTriggered: false
    })
    // 加载完关闭显示
    if(videoList){
      wx.hideLoading();
    }
  },

  // 点击播放/继续播放的回调
  handlePlay(e){
    let vid = e.currentTarget.id;
    // // 关闭上一个播放的 
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // this.vid = vid;
    // 更新videoId
    this.setData({
      videoId: vid
    })
    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    // 判断当前视频是否播放过
    let {videoUpdateTime} = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime);
    }
    // this.videoContext.play();
  },
  // 监听视频播放进度的回调
  handleTimeUpdate(e){
    let videoTimeObj = {vid: e.currentTarget.id, currentTime: e.detail.currentTime};
    let {videoUpdateTime} = this.data;
    // 判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放时长记录
    // 如果有，则修改原有播放时间； 如果无，则添加
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
    if(videoItem){
      videoItem.currentTime = videoTimeObj.currentTime;
    } else {
      videoUpdateTime.push(videoTimeObj);
    }
    // 更新videoUpdateTime
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放结束调用的回调
  handleEnded(e) {
    let {videoUpdateTime} = this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === e.currentTarget.id),1);
    this.setData({
      videoUpdateTime
    })
  },
  // 自定义下拉刷新的回调： scroll-view
  handleRefresher(){
    // 再次发请求，获取最新的视频列表数据
    setTimeout(function() {
      this.getVideoList(this.data.navId);
    }.bind(this), 1000);
    // 请求完数据，须自动关闭下拉刷新状态 在this.getVideoList()里面完成
  },
  // 自定义上拉触底的回调： scroll-view
  async handleToLower(){
    // 数据分页： 1. 后端分页 2.前端分页
    let offset = this.data.offset;
    let videoListDataNew = await request('/video/group?', {id: this.data.navId, offset: offset});
    let index = this.data.videoList.length;
    let videoListNew = videoListDataNew ? videoListDataNew.datas.map(item => {
      item.id = index++;
      return item;
    }) : '';
    let videoList = this.data.videoList;
    videoList.push(...videoListNew);
    this.setData({
      videoList,
      offset: offset + 1
    })
  },
  // 跳转搜索页面的回调
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
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