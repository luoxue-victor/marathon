export default class Utile {
    static authorize() {
        return new Promise((resovle)=>{
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.userInfo']) {
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success() {
                                resovle();
                            }
                        })
                    }
                }
            })
        })
    }
    async login() {
        const authorizeRes = await Utile.authorize();
        return authorizeRes;
    }

    async uploadImage() {
        // 发布那里的图片上传逻辑，
        let imageUrl;
        return new Promise((resovle)=>{
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                    wx.showLoading({
                        title: '图片加载中...',
                    })
                    // tempFilePath可以作为img标签的src属性显示图片
                    const tempFilePaths = res.tempFilePaths;
                    wx.cloud.uploadFile({
                        cloudPath: tempFilePaths[0].substr(11, 10),
                        filePath: tempFilePaths[0], // 小程序临时文件路径
                        success: res => {
                            imageUrl = res.fileID;
                            wx.hideLoading()
                            resovle(imageUrl)
                        },
                    })
                }
            });
        })
    }

    async addUser({nickName,avatarUrl}) {
        return new Promise((resovle)=>{
            wx.cloud.callFunction({
                name: 'common',
                data: {
                    method: 'addUserData',
                    data: {
                        nickName,
                        avatarUrl,
                    }
                }
            }).then(res => {
                resovle()
            });
        })
    }

}