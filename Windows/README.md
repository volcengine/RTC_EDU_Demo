在线课堂是火山引擎实时音视频提供的一个开源示例项目。本文介绍如何快速跑通该示例项目，体验 RTC 在线课堂效果。

## 应用使用说明

使用该工程文件构建应用后，即可使用构建的应用体验在线课堂。
你和你的同事必须加入同一个房间，才能共同体验在线课堂。

## 前置条件

- Windows 7+，建议 Windows 10 系统

- Visual Studio 2017+

- Qt 5.9+

- Visual Studio 版本对应 Qt 运行环境（如 Visual Studio 2017 对应 msvc 2017）

- cmake 3.14+

- 使用 C++ 作为开发语言，支持 C++ 11 版本

- 有效的 [火山引擎开发者账号](https://console.volcengine.com/auth/login)

### 操作步骤

### **步骤 1：获取 AppID 和 AppKey**

在火山引擎控制台->[应用管理](https://console.volcengine.com/rtc/listRTC)页面创建应用或使用已创建应用获取 AppID 和 AppAppKey

### **步骤 2：获取 AccessKeyID 和 SecretAccessKey**

在火山引擎控制台-> [密钥管理](https://console.volcengine.com/iam/keymanage/)页面获取 **AccessKeyID 和 SecretAccessKey**

### **步骤 3：获取 AccountID**

在火山引擎控制台 -> 账号管理-> [基本信息](https://console.volcengine.com/user/basics/)页面获取账号 ID。

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_97aa5836b4b97dff73b03c867df8cbb9" width="500px" >

### **步骤 4：获取 VodSpace**

在火山引擎控制台-> 视频管理 -> [空间管理](https://console.volcengine.com/vod/overview/)页面获取 VodSpace。若不存在空间，请新建空间。

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_5019d8b56fc34a71a81a4334e064093d" width="500px" >

### **步骤 5：环境变量配置**

配置 QT 环境变量 `Qt32Path`、`Qt64Path` 。

> `Qt32Path`、`Qt64Path` 变量的值为你 QT 安装路径下对应的 cmake 文件夹路径。

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_da3c6ab3221cd2bbdab45dcd05b4714b" width="500px" >

### **步骤 6：配置 Demo 工程文件**

cmd 窗口下进入安装包代码下载的目录，执行 `cmake -G "Visual Studio 16" -Bbuild_win -A "Win32"`（32 位）或`cmake -G "Visual Studio 16" -Bbuild_win -A "x64"`（64位）命令，在 `build_win` 目录下生成工程。

> 命令`cmake -G "Visual Studio 16" -Bbuild_win`中的 `16`为你使用 Visual Studio 版本对应的版本号。例如使用 Visual Studio 2019 时，该值为 `16`，使用 Visual Studio 2017 时，该值为 `15`。Visual Studio 各版本对应版本号可参考：[Visual Studio 内部版本号和发布日期](https://docs.microsoft.com/zh-cn/visualstudio/install/visual-studio-build-numbers-and-release-dates?view=vs-2019)。

<img src="https://lf3-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_46623a1915453d11626ebe5ce4a127b7" width="500px" >

### **步骤 7：填写 LoginUrl**

进入 `RTCSolution/feature/joinRTS_params_kit/rtc_build_config.h` 文件，填写 **URL**字段。

当前你可以使用 **`https://common.rtc.volcvideo.com/rtc_demo_special/login`** 作为测试服务器域名，仅提供跑通测试服务，无法保障正式需求。

<img src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ubrbfuhw/20220919180249image.png" width="900px" >

### **步骤 8：填写 APPID、APPKey、AccessKeyID、SecretAccessKey、AccountId 和 VodSpace**

进入`RTCSolution/feature/joinRTS_params_kit/rtc_build_config.h` 文件，填写 **APPID、APPKey、AccessKeyID、SecretAccessKey、AccountId 和 VodSpace**

<img src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ubrbfuhw/20220919181220image.png" width="900px" >

<img src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ubrbfuhw/20220919181441image.png" width="900px" >

### **步骤 9：编译运行**

1. 进入 `RTCSolution/build_win` 目录，使用 Visual Studio 打开工程文件 `VeRTC.sln`。

<img src="https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_d0f829fb46c7d28183857e58ca7f916f.png" width="500px" >

2. 将VeRTC设置为启动项。

<img src="https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_a8593ecc0389bb0a52a93766f7438c14.png" width="500px" >

3. 点击Visual Studio上方菜单栏【调试】->【开始调试】开始编译并运行项目。

<img src="https://portal.volccdn.com/obj/volcfe/cloud-universal-doc/upload_f44c32e8b5530dec5734beadcb45d5cd.png" width="800px" >

运行开始界面如下：

<img src="https://lf6-volc-editor.volccdn.com/obj/volcfe/sop-public/upload_0f9fcad1494e9b8b7c07f12f657576a3" width="700px" >
<br>
