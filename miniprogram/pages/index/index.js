let jsonData = require('data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: "Key_Home_Info_List_NEW",
    bannerUnitId: getApp().globalData.bannerUnitId,
    videoUnitId: getApp().globalData.videoUnitId,
    title: "主页",
    listDataSuccess: false,
    isShowBottomAd: false,
    classlist: [],
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: this.data.title
    });
    const fs = wx.getFileSystemManager()
    const cacheFileDir = getApp().globalData.cacheFileDir
    try {
      fs.rmdirSync(cacheFileDir, true)
    } catch (e) {}
    try {
      fs.mkdirSync(cacheFileDir, true)
    } catch (e) {}

    // try {
    //   let value = wx.getStorageSync(this.data.key);
    //   let item = JSON.parse(value);
    //   this.setData({
    //     classlist: item
    //   })
    // } catch (error) {}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getListInfo()
  },

  onShareAppMessage: function () {},
  onShareTimeline: function () {},

  //点击提交生成请求
  async submitGenerateImage(event) {
    console.log(1111, this.data.inputValue)
    if(!this.data.inputValue){
      wx.showToast({
        title: "请输入你的绘图描述",
        icon: "none"
      })
    }
    // TODO 提交请求
    wx.request({
      url: 'http://localhost:5001/aliai/generateimage', //仅为示例，并非真实的接口地址
      data: {
        prompt: this.data.inputValue
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
      }
    })
  },
  getInputValue(e){
    this.data.inputValue = e.detail.value
    console.log(this.data.inputValue)// {value: "ff", cursor: 2}  
  },
  //获取功能列表
  getListInfo() {
    let _this = this;

    let data = jsonData.data.result[0].itemsList
    data = this.sortFun(data, "sort", "order");
    console.log(data)
    _this.setData({
      classlist: data,
      listDataSuccess: true
    })
  },
  /**
   * @method sortFun
   * @param arr 要传递的排序对象数组
   * @param name 要传递的排序字段
   * @param type 要传递的排序类型 默认升序:order 降序:desc
   */
  sortFun(arr, name, type) {
    const compare = (prop) => {
      return function (obj1, obj2) {
        let val1 = obj1[prop];
        let val2 = obj2[prop];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    if (type == 'desc') {
      return arr.sort(compare(name));
    } else {
      return arr.sort(compare(name)).reverse();
    }
  }

})