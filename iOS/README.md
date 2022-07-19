在线课堂是火山引擎实时音视频提供的一个开源示例项目。本文介绍如何快速跑通该示例项目，体验 RTC 在线课堂效果。

## 应用使用说明

使用该工程文件构建应用后，即可使用构建的应用体验在线课堂。
你和你的同事必须加入同一个房间，才能共同体验在线课堂。

## 前置条件

- [Xcode](https://developer.apple.com/download/all/?q=Xcode) 12.0+
	

- iOS 12.0+ 真机
	

- 有效的 [AppleID](http://appleid.apple.com/)
	

- 有效的 [火山引擎开发者账号](https://console.volcengine.com/auth/login)
	

- [CocoaPods](https://guides.cocoapods.org/using/getting-started.html#getting-started) 1.10.0+
	

## 操作步骤

### **步骤 1：获取 AppID 和 AppKey**

在火山引擎控制台->[应用管理](https://console.volcengine.com/rtc/listRTC)页面创建应用或使用已创建应用获取 AppID 和 AppAppKey

### **步骤 2：获取 AccessKeyID 和 SecretAccessKey**

在火山引擎控制台-> [密钥管理](https://console.volcengine.com/iam/keymanage/)页面获取 **AccessKeyID 和 SecretAccessKey**

### **步骤 3：获取 AccountID**

在火山引擎控制台 -> 账号管理-> [基本信息](https://console.volcengine.com/user/basics/)页面获取账号 ID。

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_eb8e2eea85b4aec7b6a09ee5bc4badd6" width="500px" >

### 步骤 4：获取 VodSpace

在火山引擎控制台-> 视频管理 -> [空间管理](https://console.volcengine.com/vod/overview/)页面获取 VodSpace。若不存在空间，请新建空间。

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_3eefeaefc280e160a24d62a32fb918a4" width="500px" >

### 步骤 5：构建工程

1. 打开终端窗口，进入 `RTC_EDU_Demo-master/iOS/veRTC_Demo_iOS` 根目录
	

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_04d1023cdee267c4fe3554b909f45876" width="500px" >

2. 执行 `pod install` 命令构建工程
	

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_3a92beea21d6982cba9ba6f9f177c39e" width="500px" >

3. 进入 `RTC_EDU_Demo-master/iOS/veRTC_Demo_iOS` 根目录，使用 Xcode 打开 `veRTC_Demo.xcworkspace`
	

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_cd224a05f52afea62596d20ebba9971e" width="500px" >

4. 在 Xcode 中打开 `Pods/Development Pods/Core/BuildConfig.h` 文件
	

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_8fab8a09dae85ca98923629a7abbce70" width="500px" >

5. 填写 **LoginUrl**
	

当前你可以使用 **`http://rtc-test.bytedance.com/rtc_demo_special/login`** 作为测试服务器域名，仅提供跑通测试服务，无法保障正式需求。

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_5117e5bc13746e8ecf9a63598cc84d59" width="500px" >

6. **填写 APPID、APPKey、AccessKeyID 和 SecretAccessKey**
	

使用在控制台获取的 **APPID、APPKey、AccessKeyID 和 SecretAccessKey** 填写到 `BuildConfig.h`文件的对应位置**。** 

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_6551f3db4c285bf62f7b0cf16ed9d834" width="500px" >

7. **填写 ACCOUNT\_ID 和 VOD\_SPACE**
	

使用在控制台获取的 **ACCOUNT\_ID 和 VOD\_SPACE** 填写到 `Pods/Development Pods/MeetingDemo/MeetingDemoConstants.h` 文件的对应位置。

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_4a8caa7d72205ac1840c33a96d4e02ff" width="500px" >

### **步骤 6：配置开发者证书**

1. 将手机连接到电脑，在 `iOS Device` 选项中勾选您的 iOS 设备。
	

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_352c0e6cf91077c14bfed8fba0145372" width="500px" >

2. 登录 Apple ID。
	

2.1 选择 Xcode 页面左上角 **Xcode** > **Preferences**，或通过快捷键 **Command** + **,**  打开 Preferences。
2.2 选择 **Accounts**，点击左下部 **+**，选择 Apple ID 进行账号登录。

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_4458d8395e60fa03e2b5e65077b7dec1" width="500px" >

3. 配置开发者证书。
	

3.1 单击 Xcode 左侧导航栏中的 `VeRTC_Demo` 项目，单击 `TARGETS` 下的 `VeRTC_Demo` 项目，选择 **Signing & Capabilities** > **Automatically manage signing** 自动生成证书

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_3558fd582f070592a273442279d81c70" width="500px" >

3.2 在 **Team** 中选择 Personal Team。

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_1ab661ca8d313403a1ba85948f6b59fa" width="500px" >

3.3 **修改 Bundle Identifier。** 

默认的 `vertc.veRTCDemo.ios` 已被注册， 将其修改为其他 Bundle ID，格式为 `vertc.xxx`。

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_1ed41779ba4d815e4d6260405e79346a" width="500px" >

### **步骤 5：编译运行**

选择 **Product** > **Run**， 开始编译。编译成功后你的 iOS 设备上会出现新应用。若为免费苹果账号，需先在`设置->通用-> VPN与设备管理 -> 描述文件与设备管理`中信任该描述文件。

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_f9e6bfa906885721aea2a2067f0cce1d" width="500px" >

运行开始界面如下：

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_7b4a2c9e79757b59641de31f0d97056a" width="200px" >
