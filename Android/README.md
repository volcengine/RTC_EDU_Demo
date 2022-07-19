在线课堂是火山引擎实时音视频提供的一个开源示例项目。本文介绍如何快速跑通该示例项目，体验 RTC 在线课堂效果。

## 应用使用说明

使用该工程文件构建应用后，即可使用构建的应用体验在线课堂。
你和你的同事必须加入同一个房间，才能共同体验在线课堂。
如果你已经安装过 火山引擎场景化 Demo 安装包，示例项目编译运行前请先卸载原有安装包，否则会提示安装失败。

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

### **步骤 3：获取 AccountID**

在火山引擎控制台 -> 账号管理-> [基本信息](https://console.volcengine.com/user/basics/)页面获取账号 ID。

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_3b9ac6c5aab55faa3ec24cbccd087967" width="500px" >

### 步骤 4：获取 VodSpace

在火山引擎控制台-> 视频管理 -> [空间管理](https://console.volcengine.com/vod/overview/)页面获取 VodSpace。若不存在空间，请新建空间。

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_4f96eadc89fa828488fbe63b496cdc24" width="500px" >

### 步骤 5：构建工程

1. 使用 Android Studio 打开该项目的`RTC_EDU_Demo-master/Android/veRTC_Demo_Android` 文件夹
	

2. 填写 **LoginUrl。** 
	

进入 `scene-core/gradle.properties` 文件，填写 **LoginUrl**。

当前你可以使用 **`http://rtc-test.bytedance.com/rtc_demo_special/login`** 作为测试服务器域名，仅提供跑通测试服务，无法保障正式需求。

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_3aaaaa571e5f8f2e335a258c8eb58cbf" width="500px" >

3. **填写 APPID、APPKey、AccessKeyID、SecretAccessKey、ACCOUNT\_ID 和 VOD\_SPACE**
	

进入根目录下 `gradle.properties`文件，填写 **APPID、APPKey、AccessKeyID、SecretAccessKey、ACCOUNT\_ID 和 VOD\_SPACE**

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_65379093c831aef59eb9cd045cd0aa6e" width="500px" >

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_479b099eccd68eb417b8f3b8eba00066" width="500px" >

### 步骤 6：编译运行

1. 将手机连接到电脑，并在开发者选项中打开调试功能。连接成功后，设备名称会出现在界面右上方。
	
	<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_72f34b9a8dd32e6eaecdc42e107fcc97" width="500px" >
	

<br>

2. 选择**Run** -> **Run 'app'** ，开始编译。编译成功后你的 Android 设备上会出现新应用。部分手机会出现二次确认，请选择确认安装。
	

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_1a4ff34d1cc86f05ebf8746b05fa5f5a" width="500px" >

运行开始界面如下：
<br>

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_514c83ecf1efa963f4d7bad9927c4824" width="200px" >
<br>
