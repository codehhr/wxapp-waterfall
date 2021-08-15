// pages/mv/mv.js

import { get } from "../../utils/http";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    mvList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMvList();
  },

  getMvList() {
    get(`/music-api/mv/all?limit=${this.data.pageSize}`).then((res) => {
      if (res.data.code == 200) {
        this.setData({
          mvList: this.data.mvList.concat(res.data.data),
        });
      }
    });
  },

  goToMvDetail(e) {
    wx.navigateTo({
      url: `/pages/mvdetail/mvdetail?id=${e.currentTarget.dataset.id}`,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      pageSize: (this.data.pageSize += 10),
    });
    this.getMvList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
