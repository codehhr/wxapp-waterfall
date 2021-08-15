import { get, post } from "../../utils/http.js";

const app = getApp();

Page({
  onShareAppMessage() {
    return {
      title: "swiper",
      path: "page/component/pages/swiper/swiper",
    };
  },
  onShareTimeline() {},

  data: {
    // 新闻列表
    newsList: [],
    // 轮播图
    background: ["demo-text-1", "demo-text-2", "demo-text-3"],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    pageNum: 1,
    pageSize: 10,
  },

  onLoad() {
    this.initData();
  },

  initData() {
    this.getSwiper();
    this.getNewsList();
  },

  // 获取轮播图
  getSwiper() {
    post("/api/cms/article/open/banner/list", {
      pageNum: 1,
      pageSize: 4,
    }).then((res) => {
      if (res.data.code === 0) {
        this.setData({
          background: res.data.rows,
        });
      }
    });
  },

  // 获取新闻列表
  getNewsList() {
    post("/api/cms/article/open/hot/list", {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
    }).then((res) => {
      if (res.data.code === 0) {
        wx.stopPullDownRefresh();
        if ((this.data.pageNum - 1) * this.data.pageSize >= res.data.total) {
          wx.showToast({
            title: "到底了",
            icon: "none",
            duration: 200,
          });
        } else {
          this.setData({
            newsList: this.data.newsList.concat(res.data.rows),
          });
        }
        wx.hideLoading();
      }
    });
  },

  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots,
    });
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay,
    });
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value,
    });
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value,
    });
  },

  showArticleDetail(e) {
    get(
      `/api/cms/article/open/detail/${e.currentTarget.dataset.articleid}`
    ).then((res) => {
      if (res.data.code == 0) {
        let tempData = res.data.data;
        tempData.content = tempData.content.replace(
          "<img",
          "<img style='width: 100%;'"
        );
        app.globalData.newsDetail = tempData;
        wx.navigateTo({
          url: "/pages/newsdetail/newsdetail",
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "error",
          duration: 2000,
        });
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.initData();
  },

  // 触底加载
  onReachBottom() {
    wx.showLoading({
      title: "努力加载中...",
    });
    this.setData({
      pageNum: ++this.data.pageNum,
    });
    this.getNewsList();
  },
});
