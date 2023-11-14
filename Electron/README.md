## 简介
教育场景化Demo

## 示例项目

### 如何运行示例项目
1. 前往火山引擎控制台, 获取 appId, appKey, accessKeyId, accessKeySecret, accountId 并且填入 src/Config.ts 文件中的 userConfig:

export const userConfig = {
  appId: 'your_app_id',
  appKey: 'your_app_key',
  accessKeyId: 'your_access_key_id',
  accessKeySecret: 'your_access_key_secret',
  accountId: 'your_account_id',
};

2. 前往火山引擎控制台, 获取 TOS 对应的参数，并且填入 src/renderer/Config.ts 文件中的 tosConfig(tosConfig 和 userConfig 可以对应不同的账号配置):

export const tosConfig = {
  accessKeyId: 'your_access_key_id',
  accessKeySecret: 'your_access_key_secret',
  accountId: 'your_account_id',
  region: 'your_bucket_region',
  endpoint: 'your_bucket_endpoint',
  bucket: 'your_bucket_name',
};


3. 本地运行, 开两个终端:

第一个终端:
yarn
yarn dev

第二个终端:
yarn start:main

# 联系我们
如果您遇到任何问题，填写[VolcengineRTC 反馈问卷](https://wenjuan.feishu.cn/m?t=sQrk90adbLwi-6ivu)，我们会竭力为您提供帮助
