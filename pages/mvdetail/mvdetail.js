import { get } from "../../utils/http";

function getRandomColor() {
  const rgb = [];
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16);
    color = color.length === 1 ? "0" + color : color;
    rgb.push(color);
  }
  return "#" + rgb.join("");
}

Page({
  inputValue: "",
  data: {
    src: "",
    mvDetail: {},
    danmuList: [
      {
        text: "第 1s 出现的弹幕",
        color: "#ff0000",
        time: 1,
      },
      {
        text: "第 3s 出现的弹幕",
        color: "#ff00ff",
        time: 3,
      },
    ],
  },

  onLoad(options) {
    this.getMvDetail(options.id);
  },

  getMvDetail(id) {
    get(`http://music.163.com/api/mv/detail?id=${id}&type=mp4`).then((res) => {
      if (res.data.code == 200) {
        this.setData({
          mvDetail: res.data.data,
				});
				console.log(res.data.data);
      }
    });
  },

  onShareAppMessage() {
    return {
      title: "",
      path: "/pages/mvdetail/mvdetail",
    };
  },

  onReady() {
    this.videoContext = wx.createVideoContext("myVideo");
  },

  onHide() {},

  bindInputBlur(e) {
    this.inputValue = e.detail.value;
  },

  // bindButtonTap() {
  //   const that = this;
  //   wx.chooseVideo({
  //     sourceType: ["album", "camera"],
  //     maxDuration: 60,
  //     camera: ["front", "back"],
  //     success(res) {
  //       that.setData({
  //         src: res.tempFilePath,
  //       });
  //     },
  //   });
  // },

  bindVideoEnterPictureInPicture() {
    console.log("进入小窗模式");
  },

  bindVideoLeavePictureInPicture() {
    console.log("退出小窗模式");
  },

  bindPlayVideo() {
    console.log("playing");
    this.videoContext.play();
  },
  bindSendDanmu() {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor(),
    });
  },

  videoErrorCallback(e) {
    console.log("视频错误信息:");
    console.log(e.detail.errMsg);
  },
});
