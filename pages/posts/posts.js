// index.js
// 获取应用实例
const app = getApp();

import { post } from "../../utils/http";

Page({
  data: {
    pageNum: 1,
    pageSize: 20,
    postList: [],
    leftPostList: [],
    rightPostList: [],
    leftPostListHeight: 0,
    rightPostListHeight: 0,
    finish: false,
  },
  onLoad() {
    this.getPostList();
  },

  // 获取帖子列表
  getPostList() {
    if (this.data.finish) {
      return;
    }
    // 请求帖子列表
    post("/api/bbs/bbsPosts/open/list", {
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum,
    }).then((res) => {
      if (res.data.code == 0) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        // -1 是为了不算上下一页的数据
        if ((this.data.pageNum - 1) * this.data.pageSize >= res.data.total) {
          // 数据已经加载完了，不需要在加载数据了
          wx.showToast({
            title: "到底了 ~",
            icon: "none",
            duration: 2000,
          });
          this.setData({
            finish: true,
          });
        } else {
          this.setData({
            postList: this.data.postList.concat(res.data.rows),
          });
          this.RenderWaterfallFlow();
        }
      }
    });
  },

  // 渲染瀑布流
  RenderWaterfallFlow() {
    if (this.data.postList.length) {
      let tempList = this.data.postList;
      let item = tempList.shift();
      this.setData({
        postList: tempList,
      });
      wx.getImageInfo({
        src: item.coverImgUrl,
        success: (res) => {
          // 判断放到哪一侧
          if (this.data.leftPostListHeight <= this.data.rightPostListHeight) {
            let tempArr = this.data.leftPostList;
            tempArr.push(item);
            this.setData({
              leftPostList: tempArr,
            });
            // 更新列表高度
            let tempHeight = this.data.leftPostListHeight;
            this.setData({
              leftPostListHeight: (tempHeight += res.height / res.width),
            });
          } else {
            let tempArr = this.data.rightPostList;
            tempArr.push(item);
            this.setData({
              rightPostList: tempArr,
            });
            // 更新列表高度
            let tempHeight = this.data.rightPostListHeight;
            this.setData({
              rightPostListHeight: (tempHeight += res.height / res.width),
            });
          }
        },
      });
      this.RenderWaterfallFlow();
    }
  },

  // 触底加载
  onReachBottom() {
    if (this.data.finish) {
      return;
    } else {
      wx.showLoading({
        title: "努力加载中...",
      });
      this.setData({
        pageNum: ++this.data.pageNum,
      });
      this.getPostList();
    }
  },

  // webSocket 聊天室
  wsChat(e) {
    wx.navigateTo({
      url: `/pages/chat/chat?postsid=${e.currentTarget.dataset.postsid}`,
    });
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getPostList();
  },
});
