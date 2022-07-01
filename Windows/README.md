## 目录结构说明

本目录包含 windows 版 VolcEngineRTC 的教育场景 Demo 源代码：

```
├─ veRTC_Demo_windows           // VolcEngineRTC会议场景化Demo工程目录
│  │─ cmake                     // 编译工程文件的cmake脚本
│  │- CMakeLists.txt            // 编译工程文件的cmake脚本
│  │- core                      // 编译工程通用的源代码，包括工具包,RTC封装,http请求等
│  │─ Depends                   // windows平台下的代码运行依赖库
│  │─ feature                   // 场景选择，用户登录等通用模块源码
│  │─ edu                       // 教育场景Demo的主要源码，资源文件等
│  │─ resource                  // 场景通用资源文件
│  │─ vertc_sdk                 // RTC SDK的头文件以及库文件
│  │─ main.cpp                  // 控制程序启动入口的主文件 

```
