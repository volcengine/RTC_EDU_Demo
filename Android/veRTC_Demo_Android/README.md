本项目是火山引擎实时音视频提供的一个开源示例项目。本文介绍如何快速跑通该示例项目，体验视频会议、小班课、大班课相关场景的效果。

## 应用使用说明

使用该工程文件构建应用后，即可使用构建的应用体验视频会议、小班课、大班课相关场景效果。
你和你的同事必须加入同一场景的同一个房间，才能一同体验。
如果你已经安装过火山引擎场景化 Demo安装包，示例项目编译运行前请先卸载原有安装包，否则会提示安装失败。

## 前置条件

- Android Studio （推荐版本 [Chipmunk](https://developer.android.com/studio/releases)）


- [Gradle](https://gradle.org/releases/) （版本： gradle-7.4.2-all）


- Android 4.4+ 真机


- 有效的 [火山引擎开发者账号](https://console.volcengine.com/auth/login)


### 操作步骤

### **步骤 1：获取 AppID 和 AppKey**

在火山引擎控制台->[应用管理](https://console.volcengine.com/rtc/listRTC)页面创建应用或使用已创建应用获取 AppID 和 AppAppKey

### **步骤 2：获取 AccessKeyID 和 SecretAccessKey**

在火山引擎控制台-> [密钥管理](https://console.volcengine.com/iam/keymanage/)页面获取 **AccessKeyID 和 SecretAccessKey**

### 步骤 3：构建工程

1. 使用 Android Studio 打开该项目的`Meeting/Android/RTCSolution` 文件夹

2. 填写 **LOGIN_URL。** <br>
   进入 `login` 目录下 `gradle.properties`文件，填写 **LOGIN_URL**。<br>
   当前你可以使用 **`http://rtc-test.bytedance.com/vertc_demo_me_os/login`** 作为测试服务器域名，仅提供跑通测试服务，无法保障正式需求。<br>
   <img src="https://github.com/volcengine/RTC_EDU_Demo/blob/master/Android/veRTC_Demo_Android/login/pic/login_url.png" width="500px" >

3. **填写 APPID、APPKey、AccessKeyID、SecretAccessKey**
   进入 `login` 目录下 `gradle.properties`文件，使用从火山引擎控制台获取的 **APPID、APPKey、AccessKeyID、SecretAccessKey 填写到该文件相应位置。<br>
   <img src="https://github.com/volcengine/RTC_EDU_Demo/blob/master/Android/veRTC_Demo_Android/login/pic/app_id.png" width="500px" >
### 步骤 4：编译运行

1. 将手机连接到电脑，并在开发者选项中打开调试功能。连接成功后，设备名称会出现在界面右上方。<br>
   <img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_a6621b8cb6b615378c306d026e0de317" width="500px" >

2. 选择**Run** -> **Run**，开始编译。编译成功后你的 Android 设备上会出现新应用。部分手机会出现二次确认，请选择确认安装。
   <img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_b882b65e75cc7406c1d8f2e2beebbf0a" width="500px" >

## 运行开始界面
<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_37abcf3600012d35d7b2e2b144fd35b0" width="200px" >