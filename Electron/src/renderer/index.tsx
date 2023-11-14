/**
 * 未完成p0：
 * 成员列表： 展示房间内的用户昵称、麦克风摄像头状态和共享状态，主持人可以操作对应的状态和全体静音
 * 用户角角色：主持人，有主持人的标记
 * 申请开闭麦这些的弹窗
 * 视频头像：展示视频内容或关闭摄像头的状态
 * TODO: 视频区悬浮桌面端（非web），在屏幕共享时悬浮
 * 共享屏幕：共享桌面
 * 停止共享：停止共享
 * 操作栏悬浮： 屏幕共享时，对操作栏悬浮
 * 麦克风状态： 开麦时有麦克风音量波动，闭麦有闭麦状态
 * 活跃说话人： ActiveSpeaker
 * TODO:翻页缩略图或宫格模式下，人数过多，可以翻页
 * 涂鸦工具选择、画笔、文字、橡皮、清除、撤销恢复、设置背景
 * 退出白板退出白板，进入宫格模式
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.less';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
