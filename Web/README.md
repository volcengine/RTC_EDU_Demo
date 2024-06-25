# demo

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

2. 前往火山引擎控制台, 获取 TOS 对应的参数，并且填入 src/Config.ts 文件中的 tosConfig(tosConfig 和 userConfig 可以对应不同的账号配置):

export const tosConfig = {
  accessKeyId: 'your_access_key_id',
  accessKeySecret: 'your_access_key_secret',
  accountId: 'your_account_id',
  region: 'your_bucket_region',
  endpoint: 'your_bucket_endpoint',
  bucket: 'your_bucket_name',
};


3. 本地运行
yarn
yarn start

http://localhost:3000/rtc/solution/vertcroom/login 打开应用

## 参考

## 反馈

## 相关资源
