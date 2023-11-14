import { useEffect, useMemo, useState } from 'react';
import { message as Message } from 'antd';
import { ipcRenderer, remote } from 'electron';
import { ApplyType, DeviceState, Permission, ShareType, UserRole } from '@src/types/state';
import { useDispatch, useSelector } from '@src/store';

import * as rtsApi from '../apis/rtsApi';

import { removeAllRecordList } from '@src/store/modules/publicMessage';
import { ProcessEvent } from '@/types';
import { RtcClient } from '@src/core/rtc';
import { Device } from '@src/store/modules/devices';
import {
  MediaStreamType,
  ScreenCaptureSourceInfo,
  ScreenCaptureSourceType,
} from '@volcengine/vertc-electron-sdk/js/types';
import {
  localUserChangeCamera,
  localUserChangeMic,
  setSharePermit,
  stopShare,
} from '@/renderer/store/slices/edubRoom';
import { isVeRtcApplication } from '@/renderer/utils/screenShare';

const filterConfigs = [] as number[];

const resetMainWindowSize = (size: {
  screenX: number;
  screenY: number;
  width: number;
  height: number;
}) => {
  return {
    ...size,
    fixedW: 332,
    fixedH: size.height,
  };
};
/**
 * 进房之后，和其他渲染进程进行通信
 * @returns
 */
const useProcess = () => {
  // 监听其他渲染进程的操作
  const dispatch = useDispatch();
  const devicePermissions = useSelector((state) => state.device.devicePermissions);
  const room = useSelector((state) => state.meetingRoom);
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

      rtsApi.edubOperateSelfCamera({
        operate,
      });

      if (operate === DeviceState.Open) {
        console.log('点击打开摄像头: ', Date.now());
        RtcClient.startVideoCapture();
        RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeVideo);
      } else {
        RtcClient.stopVideoCapture();
        RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeVideo);
      }
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

      rtsApi.edubOperateSelfMic({
        operate: operate,
      });

      if (operate === DeviceState.Open) {
        RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeAudio);
      } else {
        RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeAudio);
      }

      dispatch(localUserChangeMic(operate));
    });

    // 主持人操作参会人摄像头
    ipcRenderer.on('operateUserCamera', (e, operate: DeviceState, userId: string) => {
      console.log('operateUserCamera', operate, userId);

      rtsApi.edubOperateOtherCamera({
        operate_user_id: userId,
        operate,
      });
      if (operate === DeviceState.Open) {
        // Message.success('申请已发送');
      }
    });

    // 主持人操作参会人麦克风
    ipcRenderer.on('operateUserMic', (e, operate: DeviceState, userId: string) => {
      console.log('operateUserMic', operate, userId);

      rtsApi.edubOperateOtherMic({
        operate_user_id: userId,
        operate,
      });
      if (operate === DeviceState.Open) {
        Message.success('申请已发送');
      }
    });

    //   dispatch(removeFromMicList(userId));
    // });
    // 主持人同意参会人共享权限
    // todo 可以直接授予
    // ipcRenderer.on('permitOneShare', (e, userId, permit) => {
    //   rtsApi.edubSharePermissionPermit({
    //     apply_user_id: userId,
    //     permit,
    //   });

    //   // 取消标记参会人
    //   dispatch(
    //     reviewRemoteApply({
    //       userId: userId,
    //       applying: ApplyType.Screen,
    //     })
    //   );
    //   // 更新user共享权限状态
    //   dispatch(setSharePermit({ userId, permit: Permission.HasPermission, isLocal: false }));
    //   dispatch(removeFromShareList(userId));
    // });

    // 连麦状态下处理申请列表
    ipcRenderer.on('handleApply', (e, user, state) => {
      rtsApi.edubLinkmicPermit({
        apply_user_id: user.user_id,
        permit: state,
      });
    });

    // todo 授予和取消可以服用一个 操作参会人共享权限
    ipcRenderer.on('operateUserShare', (e, operate, userId) => {
      console.log('operateUserShare', operate, userId);
      rtsApi.edubSharePermissionPermit({
        apply_user_id: userId,
        permit: operate,
      });
      dispatch(
        setSharePermit({
          user_id: userId,
          permit: operate,
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
          width: screenInfo.width,
          height: screenInfo.height,
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

        ...Object.values(
          resetMainWindowSize({
            screenX: screenInfo.x,
            screenY: screenInfo.y,
            width: screenInfo.width,
            height: screenInfo.height,
          })
        )
      );
    });

    // 切换为共享白板时
    ipcRenderer.on('operateWhiteBoard', (e) => {
      console.log('stopShare');
      rtsApi.edubStopShare();
      RtcClient.engine?.stopScreenVideoCapture();
      RtcClient.engine?.stopScreenAudioCapture();

      // todo 如果当前是在共享白板，需要退白板房间

      dispatch(
        stopShare({
          user_id: localUser.user_id!,
        })
      );
    });

    // 结束屏幕，开始白板共享
    ipcRenderer.on('stopShare', (e) => {
      console.log('stopShare');
      rtsApi.edubStopShare();
      RtcClient.engine?.stopScreenVideoCapture();
      RtcClient.engine?.stopScreenAudioCapture();

      // todo 如果当前是在共享白板，需要退白板房间

      dispatch(
        stopShare({
          user_id: localUser.user_id!,
        })
      );
    });

    // 主持人开启录制
    ipcRenderer.on('startRecord', (e) => {
      rtsApi.edubStartRecord();
      dispatch(removeAllRecordList());
    });

    ipcRenderer.on('stopRecord', (e) => {
      console.log('停止录制', localUser);
      if (localUser.user_role === UserRole.Host) {
        rtsApi.edubStopRecord();
      }
    });

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
