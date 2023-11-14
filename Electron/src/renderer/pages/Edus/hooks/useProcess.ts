import { useEffect, useMemo, useState } from 'react';
import { message as Message } from 'antd';
import { ipcRenderer, remote } from 'electron';
import { ApplyType, DeviceState, Permission, ShareType, UserRole } from '@src/types/state';
import { useDispatch, useSelector } from '@src/store';

import * as rtsApi from '../apis';
import {
  localUserChangeCamera,
  localUserChangeMic,
  reviewRemoteApply,
  setSharePermit,
  stopShare,
} from '@src/store/slices/edusRoom';
import {
  MessageType,
  removeAllMicList,
  removeAllRecordList,
  removeAllShareList,
  removeFromMicList,
  removeFromShareList,
  updateMessage,
} from '@src/store/modules/publicMessage';
import { ProcessEvent } from '@/types';
import { RtcClient } from '@src/core/rtc';
import { Device } from '@src/store/modules/devices';
import {
  ScreenCaptureSourceInfo,
  ScreenCaptureSourceType,
} from '@volcengine/vertc-electron-sdk/js/types';
import { isVeRtcApplication } from '@/renderer/utils/screenShare';

const filterConfigs = [] as number[];

/**
 * 进房之后，和其他渲染进程进行通信
 * @returns
 */
const useProcess = () => {
  // 监听其他渲染进程的操作
  const dispatch = useDispatch();
  const devicePermissions = useSelector((state) => state.device.devicePermissions);
  const room = useSelector((state) => state.edusRoom);
  const localUser = room.localUser;

  const [screenList, setScreenList] = useState<ScreenCaptureSourceInfo[]>([]);
  const [filterScreenIds, setFilterScreenIds] = useState<number[]>([]);

  // todo 封装对应的hook,抽离逻辑
  useEffect(() => {
    // 开闭摄像头
    ipcRenderer.on('operateCamera', (e, operate: DeviceState) => {
      if (devicePermissions.video === false) {
        if (process.platform === 'win32') {
          Message.error('摄像头权限已关闭，请至设备设置页开启，然后重新启动应用');
        } else {
          Message.error('摄像头权限已关闭，请至设备设置页开启');
        }
        return;
      }
      console.log('其他渲染进程操作摄像头');
      dispatch(localUserChangeCamera(operate));
    });
    // 开/闭麦
    ipcRenderer.on('operateMic', (e, operate: DeviceState) => {
      if (devicePermissions.audio === false) {
        if (process.platform === 'win32') {
          Message.error('麦克风权限已关闭，请至设备设置页开启，开启后重新启动应用');
        } else {
          Message.error('麦克风权限已关闭，请至设备设置页开启');
        }
        return;
      }
      dispatch(localUserChangeMic(operate));
    });

    // 开麦申请
    ipcRenderer.on('handleReqOpenMic', (e) => {
      if (devicePermissions.audio === false) {
        if (process.platform === 'win32') {
          Message.error('麦克风权限已关闭，请至设备设置页开启，开启后重新启动应用');
        } else {
          Message.error('麦克风权限已关闭，请至设备设置页开启');
        }
        return;
      }
      console.log('handleReqOpenMic');

      rtsApi.operateSelfMicApply({
        operate: DeviceState.Open,
      });
    });

    // 学生回应开麦
    ipcRenderer.on('handleComfirmOpenMic', (e, operate) => {
      dispatch(updateMessage(MessageType.EMPTY));
      if (operate === DeviceState.Open && devicePermissions.audio === false) {
        if (process.platform === 'win32') {
          Message.error('麦克风权限已关闭，请至设备设置页开启，开启后重新启动应用');
        } else {
          Message.error('麦克风权限已关闭，请至设备设置页开启');
        }
        return;
      }
      dispatch(localUserChangeMic(operate));
    });
    // 学生回应开摄像头
    ipcRenderer.on('handleConfirmOpenCamera', (e, operate) => {
      dispatch(updateMessage(MessageType.EMPTY));
      console.log('其他渲染进程同意开摄像头');
      if (operate === DeviceState.Open && devicePermissions.video === false) {
        if (process.platform === 'win32') {
          Message.error('摄像头权限已关闭，请至设备设置页开启，然后重新启动应用');
        } else {
          Message.error('摄像头权限已关闭，请至设备设置页开启');
        }
        return;
      }
      dispatch(localUserChangeCamera(operate));
    });

    // 老师操作学生摄像头
    ipcRenderer.on('operateUserCamera', (e, operate: DeviceState, userId: string) => {
      console.log('operateUserCamera', operate, userId);

      rtsApi.operateOtherCamera({
        operate_user_id: userId,
        operate,
      });
      if (operate === DeviceState.Open) {
        Message.success('申请已发送');
      }
    });

    // 老师操作学生麦克风
    ipcRenderer.on('operateUserMic', (e, operate: DeviceState, userId: string) => {
      console.log('operateUserMic', operate, userId);

      rtsApi.operateOtherMic({
        operate_user_id: userId,
        operate,
      });
      if (operate === DeviceState.Open) {
        Message.success('申请已发送');
      }
    });
    // 老师同意学生开麦
    ipcRenderer.on('permitOneMic', (e, userId, permit) => {
      rtsApi.operateSelfMicPermit({
        apply_user_id: userId,
        permit,
      });
      // 取消标记学生

      dispatch(
        reviewRemoteApply({
          userId: userId,
          applying: ApplyType.Mic,
        })
      );

      dispatch(removeFromMicList(userId));
    });
    // 老师同意学生共享权限
    ipcRenderer.on('permitOneShare', (e, userId, permit) => {
      rtsApi.sharePermissionPermit({
        apply_user_id: userId,
        permit,
      });

      // 取消标记学生
      dispatch(
        reviewRemoteApply({
          userId: userId,
          applying: ApplyType.Screen,
        })
      );
      // 更新user共享权限状态
      dispatch(setSharePermit({ userId, permit: Permission.HasPermission, isLocal: false }));
      dispatch(removeFromShareList(userId));
    });
    // 清空请求开麦列表
    ipcRenderer.on('clearAllMic', (e, permit) => {
      dispatch(removeAllMicList());
    });
    // 清空请求共享列表
    ipcRenderer.on('clearAllShare', (e, permit) => {
      dispatch(removeAllShareList());
    });

    // 操作学生共享权限
    ipcRenderer.on('operateUserShare', (e, operate, userId) => {
      console.log('operateUserShare', operate, userId);
      rtsApi.operateOtherSharePermission({
        operate_user_id: userId,
        operate,
      });
      dispatch(
        setSharePermit({
          userId: userId,
          permit: operate,
          isLocal: false,
        })
      );
    });

    // 其他渲染进程切换屏幕共享的内容
    ipcRenderer.on('handleScreenShare', (e, screenInfo, shareAudio) => {
      RtcClient.engine?.stopScreenVideoCapture();
      RtcClient.engine?.stopScreenAudioCapture();
      RtcClient.engine?.startScreenVideoCapture(screenInfo, {
        region_rect: {
          x: 0,
          y: 0,
          width: 1280,
          height: 720,
        },
        capture_mouse_cursor: 1,
        filter_config: filterConfigs,
        highlight_config: {
          enableHighlight: true,
          borderColor: 0xff29cca3,
          borderWidth: 4,
        },
      });
      if (shareAudio) {
        if (process.platform === 'darwin') {
          const audioCaptureDevices = RtcClient.engine?.enumerateAudioCaptureDevices() as Device[];
          const virtualCard = audioCaptureDevices.find(
            (item) => item.device_name === 'VeRTCVirtualSoundCard'
          );
          console.log('采集屏幕音频：', virtualCard);
          RtcClient.engine?.startScreenAudioCapture(virtualCard?.device_id);
        } else {
          RtcClient.engine?.startScreenAudioCapture();
        }
      } else {
        RtcClient.engine?.stopScreenAudioCapture();
      }
      ipcRenderer.once('mainWindowChangeFinish', (e, mid, screenHeight) => {
        ipcRenderer.send(ProcessEvent.ShowFooter, mid, screenHeight);
      });
      ipcRenderer.send(
        ProcessEvent.ChangeMainWindow,
        screenInfo.x,
        screenInfo.y,
        screenInfo.width,
        screenInfo.height
      );
    });

    // 切换为共享白板时
    ipcRenderer.on('operateWhiteBoard', (e) => {
      RtcClient.engine?.stopScreenVideoCapture();
      RtcClient.engine?.stopScreenAudioCapture();
      // 会有通知修改房间共享状态
      rtsApi.startShare({ share_type: ShareType.Board });
    });

    // 结束共享时
    ipcRenderer.on('stopShare', (e) => {
      console.log('stopShare');
      rtsApi.finishShare();
      RtcClient.engine?.stopScreenVideoCapture();
      RtcClient.engine?.stopScreenAudioCapture();

      // todo 如果当前是在共享白板，需要退白板房间

      dispatch(stopShare({}));
    });

    // 老师开启录制
    ipcRenderer.on('startRecord', (e) => {
      rtsApi.startRecord();
      dispatch(removeAllRecordList());
    });
    // 老师拒绝开启录制
    ipcRenderer.on('rejectRecord', (e) => {
      dispatch(removeAllRecordList());
    });
    //  学生请求录制
    ipcRenderer.on('reqRecord', (e) => {
      rtsApi.startRecordApply();
      Message.success('已向老师发起录制请求');
    });
    // 停止录制
    ipcRenderer.on('stopRecord', (e) => {
      console.log('停止录制', localUser);
      if (localUser.user_role === UserRole.Host) {
        rtsApi.stopRecord();
      } else {
        Message.error('老师才能停止录制');
      }
    });

    // 全体静音
    ipcRenderer.on('muteAll', (e, operateSelfMic) => {
      rtsApi.vcOperateAllMic({
        operate: DeviceState.Closed,
        operate_self_mic_permission: operateSelfMic,
      });
    });
    // 更新屏幕列表
    ipcRenderer.on('updateScreenList', (e) => {
      const tempList = RtcClient.engine?.getScreenCaptureSourceList()?.filter((item) => {
        return item.source_name !== 'veRTC';
      });
      setScreenList(tempList || []);
    });

    // 更新采集屏幕过滤
    ipcRenderer.on('updateScreenFilter', (e) => {
      const screenList = RtcClient.engine?.getScreenCaptureSourceList();
      screenList?.forEach((item) => {
        if (isVeRtcApplication(item)) {
          // eslint-disable-next-line max-nested-callbacks
          if (!filterConfigs.some((windowId) => item.source_id === windowId)) {
            filterConfigs.push(item.source_id);
          }
        }
      });
      console.log('filterScreens: ', filterConfigs);
      setFilterScreenIds(filterConfigs);
      RtcClient.engine?.updateScreenCaptureFilterConfig(filterConfigs);
    });

    return () => {
      ipcRenderer.removeAllListeners('operateCamera');
      ipcRenderer.removeAllListeners('operateMic');
      ipcRenderer.removeAllListeners('handleReqOpenMic');
      ipcRenderer.removeAllListeners('handleComfirmOpenMic');
      ipcRenderer.removeAllListeners('handleConfirmOpenCamera');
      ipcRenderer.removeAllListeners('operateUserCamera');
      ipcRenderer.removeAllListeners('operateUserMic');
      ipcRenderer.removeAllListeners('permitOneMic');
      ipcRenderer.removeAllListeners('permitOneShare');
      ipcRenderer.removeAllListeners('clearAllMic');
      ipcRenderer.removeAllListeners('clearAllShare');
      ipcRenderer.removeAllListeners('operateUserShare');
      ipcRenderer.removeAllListeners('handleScreenShare');
      ipcRenderer.removeAllListeners('operateWhiteBoard');
      ipcRenderer.removeAllListeners('stopShare');
      ipcRenderer.removeAllListeners('startRecord');
      ipcRenderer.removeAllListeners('rejectRecord');
      ipcRenderer.removeAllListeners('reqRecord');
      ipcRenderer.removeAllListeners('stopRecord');
      ipcRenderer.removeAllListeners('muteAll');
      ipcRenderer.removeAllListeners('updateScreenList');
      ipcRenderer.removeAllListeners('updateDevices');
      ipcRenderer.removeAllListeners('updateScreenFilter');
    };
  }, [localUser.user_role, devicePermissions]);

  const screenListInfo = useMemo(() => {
    return screenList.map((item) => {
      let {
        type,
        source_id,
        source_name = '',
        application = '',
        primaryMonitor,
        pid,
        region_rect,
      } = item;
      if (type === ScreenCaptureSourceType.kScreenCaptureSourceTypeScreen) {
        source_name = '桌面';
      }
      // 获取共享对象缩略图
      const thumbnail = RtcClient.engine?.getThumbnail(type, source_id, 160, 90);
      return {
        type,
        source_id,
        source_name,
        application,
        primaryMonitor,
        pid,
        region_rect,
        thumbnail,
      };
    });
  }, [screenList]);

  return {
    screenListInfo,
    setScreenList,
    filterScreenIds,
    setFilterScreenIds,
  };
};

export default useProcess;
