// pages/upimage/upimage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageVideoNumber:'',
    imagePicid:'',
    tempFilePaths:[],
    videoPaths:[],
    videoid:'',
  },


  // 上传图片方法=========
  upload: function () {
    let that = this;
    if ((that.data.imageVideoNumber) < 9) {
      wx.chooseImage({
        count: 9 - (that.data.imageVideoNumber), // 默认9 imageVideoNumber 记录图片和视频已经上传的数量
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          wx.showLoading({
            title: '上传中...',
          })
          let tempFilePaths = res.tempFilePaths;
          let newtempFilePaths = res.tempFilePaths; //用于上传服务器的时候 循环新的图片数组
          let arr = that.data.tempFilePaths;
          tempFilePaths = tempFilePaths.concat(arr) //拼接数组的方法
          that.setData({
            imageVideoNumber: tempFilePaths.length + that.data.videoPaths.length,
            tempFilePaths: tempFilePaths //用于页面中显示的图片路径
          })
          /*** 上传完成后把文件上传到服务器 */
          var count = 0;
          for (var i = 0; i < newtempFilePaths.length; i++) {
            wx.uploadFile({
              url: 你需要上传到服务器的urls,
              filePath: tempFilePaths[i],
              name: 'uploadfile_ant',
              header: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/vnd.epet.v1+json",
              },
              success: function (res) {
                count++;
                if (res.statusCode == 200) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: '上传成功',
                    showCancel: false,
                    success: function (res) {
                    }
                  })
                  var imagePicid = res.data;
                  that.data.imagePicid.push(imagePicid)
                  that.setData({
                    imagePicid: that.data.imagePicid //这个以什么方式传给后台，与后台商议，这里传的是ID
                  })
                } else {
                  wx.hideLoading();
                  wx.showModal({
                    title: '错误提示',
                    content: '上传图片失败',
                    showCancel: false,
                    success: function (res) {
                    }
                  })
                }


                //如果是最后一张,则隐藏等待中  
                if (count == tempFilePaths.length) {
                  wx.hideToast();
                }
              },
              fail: function (res) {
                wx.hideToast();
                wx.hideLoading();
                wx.showModal({
                  title: '错误提示',
                  content: '上传图片失败',
                  showCancel: false,
                  success: function (res) {
                  }
                })
              }
            });
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '上传数量已达上限',
        showCancel: false,
        success: function (res) {

        }
      })
    }

  },

  // 删除图片的方法
  dele_image: function (e) {
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    var imagePicid = that.data.imagePicid; //这里的ID是后台返回你的，用于记录给后台传的ID值，如果没有上传成功后台是不会返回的，那删除就不会有作用，视频同理
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          tempFilePaths.splice(index, 1); 
          imagePicid.splice(index, 1);

        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          tempFilePaths: tempFilePaths,
          imageVideoNumber: that.data.imageVideoNumber - 1,
          imagePicid: imagePicid
        });
        // console.log(that.data.tempFilePaths)
        // console.log(that.data.imageVideoNumber)
        // console.log(that.data.imagePicid)
      }
    })

  },

  // 上传视频方法==== 同理上传图片=====
  addVideo: function () {
    var that = this
    if ((that.data.imageVideoNumber) < 9) {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: ['front', 'back'],
        success: function (res) {
          wx.showLoading({
            title: '上传中...',
          })
          let videoPaths = res.tempFilePath;
          that.data.videoPaths.push(videoPaths)
          that.setData({
            imageVideoNumber: that.data.imageVideoNumber + 1,
            videoPaths: that.data.videoPaths,
          })
          var count = 0;

          wx.uploadFile({
            url: '你需要上传到服务器的urls',
            filePath: videoPaths,
            name: 'uploadfile_ant',
            header: {
              "Content-Type": "multipart/form-data",
              "Accept": "application/vnd.epet.v1+json",
            },
            success: function (res) {
              count++;

              if (res.statusCode == 200) {
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  content: '上传成功',
                  showCancel: false,
                  success: function (res) {
                  }
                })
                var videoid = res.data;
                that.data.videoid.push(videoid)
                that.setData({
                  videoid: that.data.videoid
                })
              } else {
                wx.hideLoading();
                wx.showModal({
                  title: '错误提示',
                  content: '上传视频失败',
                  showCancel: false,
                  success: function (res) {
                  }
                })
              }

              //如果是最后一张,则隐藏等待中  
              if (count == videoPaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.hideLoading();

              wx.showModal({
                title: '错误提示',
                content: '上传视频失败',
                showCancel: false,
                success: function (res) {

                }
              })
            }
          });
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '上传数量已达上限',
        showCancel: false,
        success: function (res) {
        }
      })
    }
  },
// 删除视频的方法
  dele_video: function (e) {
    var that = this;
    var videoPaths = that.data.videoPaths;
    var videoid = that.data.videoid;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此视频吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          videoPaths.splice(index, 1);
          videoid.splice(index, 1);

        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          videoPaths: videoPaths,
          imageVideoNumber: that.data.imageVideoNumber - 1,
          videoid: videoid
        });
        // console.log(that.data.videoPaths)
        // console.log(that.data.imageVideoNumber)
        // console.log(that.data.imagePicid)
      }
    })

  },



})