import { uploadFile } from "../../utils/request";

const app = getApp();

// pages/chat/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loadingSocket: true,
    value: "",
    list: [],
    userName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.alreadyLogin) {
      const userInfo = app.globalData.userInfo;
      // 准备数据
      this.userName = userInfo.loginName;
      this.setData({
        userName: this.userName,
      });
      // 随便输入
      // courseId 分组id 通过这个courseId来标识不同的聊天室
      this.groupId = "web13" + options.postsid;
      // nickName 昵称
      this.nickName = userInfo.userName;
      // 头像
      this.avatar = userInfo.avatar;
      // 登录
      this.connectSocket();

      // 监听链接打开
      this.onSocketOpen();

      // 接受服务器消息
      this.onSocketMessage();
    } else {
      // 未登录
      wx.reLaunch({
        url: "/pages/login/login",
      });
    }
  },

  connectSocket() {
    const url = `wss://showme2.myhope365.com/websocketChat?username=${this.userName}&password=123&courseId=${this.groupId}&nickName=${this.nickName}&avatar=${this.avatar}`;
    // 建立链接
    wx.connectSocket({
      // 要链接的socket服务器的地址
      url,
    });
  },

  onSocketOpen() {
    // 监听链接建立成功
    wx.onSocketOpen((result) => {
      // 当我们socket链接打开之后执行
      // 需要保证的时候，我们在发送消息之前一定要先链接成功
      this.setData({
        loadingSocket: false,
      });
      // 链接打开之后加载历史消息
      this.getHistory();
      // 添加心跳检测
      this.intervalId = setInterval(() => {
        wx.sendSocketMessage({
          data: JSON.stringify({
            cmd: 13, // 固定参数
            hbbyte: "-127", // 固定参数
          }),
        });
      }, 5000);
    });
  },

  onSocketMessage() {
    // 接受服务端的消息
    wx.onSocketMessage((result) => {
      const data = JSON.parse(result.data);
      // 针对不同类型的消息进行一些处理
      if (data.command === 11) {
        // 有新消息
        this.data.list.push(data.data);
        this.setData({
          list: this.data.list,
        });
      } else if (data.command === 20 && data.code === 10018) {
        // 服务端返回了历史消息
        this.setData({
          list: data.data.groups[this.groupId],
        });
      }
    });
  },

  getHistory() {
    const historyBody = {
      cmd: 19, // 命令
      type: 1, // 类型 固定值
      groupId: this.groupId, //  分组的id
      userId: this.userName, // 用户id（这里可以用loginName）
    };

    wx.sendSocketMessage({
      data: JSON.stringify(historyBody),
    });
  },

  sendSocketMsg(content, type) {
    const msgBody = {
      from: this.userName, // 发送人，当前用户的用户名
      createTime: new Date().getTime(), // 发送时间
      cmd: 11, // 命令固定内容
      group_id: this.groupId, // 分组id。  想要发送到哪个组里
      chatType: 1, //  聊天类型 固定内容
      msgType: 0, // 消息类型 固定内容
      content, // 消息内容，自己设计结构，比如你想发送图片（图片上传的接口）
      nickName: this.nickName, // 用户昵称
      avatar: this.avatar, // 用户头像
      type, // 消息类型。 你可以自己设计，发送过去是什么，返回的就是什么（1: 普通文本 2: 图片 3：点赞 4， 送花）
    };

    wx.sendSocketMessage({
      data: JSON.stringify(msgBody),
    });
  },

  sendMsg() {
    if (!this.data.value) {
      wx.showToast({
        title: "请输入消息内容",
        icon: "none",
      });
      return;
    }

    this.sendSocketMsg(this.data.value, "1");

    this.setData({
      value: "",
    });
  },
  sendImg() {
    // 图片上传发送
    uploadFile("https://showme.myhope365.com/api/nos/upload/image", "file", {
      fileUseForEnum: "DEFAULT",
    }).then((res) => {
      this.sendSocketMsg(res.url, "2");
    });
  },
  onUnload() {
    // 进行卸载操作
    wx.closeSocket({
      code: 1000,
    });
    // 清除计时器
    clearInterval(this.intervalId);
  },
});
