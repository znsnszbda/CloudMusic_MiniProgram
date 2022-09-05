// pages/search/search.js

import request from '../../utils/request'
let isSend = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '搜索',  //placeholder内容
    hotList: [],  // 热搜榜数据
    searchContent: '', // 用户输入的表单数据
    searchList: [],  //搜索模糊匹配的数据
    historyList: [], // 历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取初始化数据
    this.getInitData();
    
  },
  // 获取初始化数据 搜索默认值 热搜榜数据
  async getInitData() {
    let placeholderData = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    });
    // 获取本地历史搜索记录
    this.getSearchHistory();
  },
  // 搜索框 表单内容发生改变的回调
  handleInputChange(e) {
    // 更新表单数据
    this.setData({
      searchContent: e.detail.value.trim()
    });
    // 函数节流
    if(isSend)
      return;
    isSend = true;
    
    setTimeout(() => {
      // 请求获取关键字模糊匹配数据
    this.getSearchList();
      isSend = false;
    }, 500);
  },
  // 获取本地历史搜索记录的功能函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory');
    if(!historyList) {
      historyList = [];
    }
    this.setData({
      historyList
    });
  },
  // 获取关键字模糊匹配数据
  async getSearchList(){
    if(!this.data.searchContent) {
      return;
    }
    let {searchContent, historyList} = this.data;
    let searchListData = await request('/search', {keywords: searchContent, limit: 10});
    this.setData({
      searchList: searchListData.result.songs,
    });
    
    historyList.indexOf(searchContent) !== -1 && historyList.splice(historyList.indexOf(searchContent), 1);
    historyList.unshift(searchContent);
    wx.setStorageSync('searchHistory', historyList);
    this.getSearchHistory();
  },
  // 清空输入的回调
  handleClear(){
    this.setData({
      searchContent: ''
    });
  },
  // 清楚历史记录的回调
  handleDelete() {
    wx.showModal({
      content: '清空？',
      success: (res) => {
        if(res.confirm){
          wx.removeStorageSync('searchHistory');
          this.getSearchHistory();
        }
      }
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