import React, { useEffect, useRef, useState } from 'react';
import { ipcRenderer, remote } from 'electron';
import { useSelector, useDispatch } from '@src/store';
import Utils from '@src/utils';
import * as rtsApi from '../apis/rtsApi';
import EdubView from './EdubView';
import BottomMenu from './BottomMenu';
import { message as Message } from 'antd';
import Header from '@src/components/Header';

import styles from './index.module.less';
import UserInfoList, { UserListProps } from './UserInfoList';
import LinkedUserList, { LinkedUserListProps } from './LinkedUserList';
import HeaderRight from './HeaderRight';
import { ShareLayout } from '@/renderer/components';
import {
  BaseUser,
  Permission,
  RecordStatus,
  ShareStatus,
  ShareType,
  UserRole,
} from '@/renderer/types/state';
import InformToast from './Inform';
import { useRoomTime } from '@/renderer/core/hooks/useRoomTime';
import useLogout from '@/renderer/core/hooks/useLogout';
import {
  localUserJoinRoom,
  localUserLeaveRoom,
  setAudioInfo,
} from '@/renderer/store/slices/edubRoom';
import useProcess from '../hooks/useProcess';
import { useRTCEventListener } from '../hooks';
import useNetStatusChange from '@/renderer/core/hooks/useNetStatusChange';
import useAudioReportHook from '@/renderer/core/rtcHooks/useAudioReportHook';
import { isRtsError } from '@/renderer/utils/rtsUtils';
import useLeaveRoom from '@/renderer/core/rtcHooks/useLeaveRoom';
import Hover from '../components/Player/Hover';

const memberWindowId = remote.getGlobal('shareWindowId').memberWindowId;
const applyLinkWindowId = remote.getGlobal('shareWindowId').applyLinkWindowId;

const screenWindowId = remote.getGlobal('shareWindowId').screenWindowId;
const footerWindowId = remote.getGlobal('shareWindowId').footerWindowId;
const attendeeWindowId = remote.getGlobal('shareWindowId').attendeeWindowId;
const hostRecordComfirmwindowId = remote.getGlobal('shareWindowId').hostRecordComfirmwindowId;
const hostRecordRecieveWindowId = remote.getGlobal('shareWindowId').hostRecordRecieveWindowId;
// const hostWindowId = remote.getGlobal('shareWindowId').hostWindowId;

function Room() {
  const room = useSelector((state) => state.edubRoom);
  const ui = useSelector((state) => state.ui);
  const role = room.localUser.user_role;

  const messageInfo = useSelector((state) => state.messageType);
  //   const screenRef = useRef<HTMLDivElement | null>(null);

  //   const localUser = room.localUser;
  const leftTime = useRoomTime(room.start_time, room.base_time, room.experience_time_limit!);
  const dispatch = useDispatch();

  const handleLogout = useLogout({
    onLeaveRoom: () => {
      dispatch(localUserLeaveRoom());
    },
  });

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => dispatch(localUserLeaveRoom()),
  });

  const { screenListInfo, setScreenList, filterScreenIds, setFilterScreenIds } = useProcess();

  // 点击底部屏幕共享按钮,展示共享窗口列表信息
  //   const onClickScreenShare = () => {
  //     if (localUser.share_permission === Permission.NoPermission) {
  //       dispatch(updateMessage(MessageType.REQUEST_OPEN_SHARE));
  //     } else {
  //       const screenList = RtcClient.engine?.getScreenCaptureSourceList();
  //       console.log('screenList: ', screenList);
  //       const tempList = screenList?.filter((item) => {
  //         if (item.source_name === 'veRTC') {
  //           if (!filterConfigs.some((windowId) => item.source_id === windowId)) {
  //             filterConfigs.push(item.source_id);
  //           }
  //         }
  //         return item.source_name !== 'veRTC';
  //       });
  //       setFilterScreenIds(filterConfigs);
  //       setScreenList(tempList || []);
  //       setIsShowScreenList(true);
  //     }
  //   };

  // todo rtc用户重新进房时，可能需要重新订阅白板屏幕流
  useRTCEventListener();

  // 我的共享权限被收回时
  //   useEffect(() => {
  //     if (
  //       room.share_status === ShareStatus.Sharing &&
  //       room.share_user_id === localUser.user_id &&
  //       localUser.share_permission === Permission.NoPermission
  //     ) {
  //       console.log('共享时共享权限被收回');
  //       ipcRenderer.send(ProcessEvent.RecoverWindow);
  //       setMeShareScreen(false);
  //       rtsApi.finishShare();
  //       RtcClient.stopScreenVideoCapture();
  //       RtcClient.stopScreenAudioCapture();
  //     }
  //   }, [localUser.share_permission]);

  // 监听摄像头变化
  //   useEffect(() => {
  //     // 发送消息
  //     rtsApi.operateSelfCamera({
  //       operate: localUser.camera!,
  //     });

  //     if (localUser.camera === DeviceState.Open) {
  //       console.log('点击打开摄像头: ', Date.now());
  //       RtcClient.startVideoCapture();
  //       RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeVideo);
  //     } else {
  //       RtcClient.stopVideoCapture();
  //       RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeVideo);
  //     }
  //   }, [localUser.camera]);

  // 监听麦克风变化
  //   useEffect(() => {
  //     rtsApi.operateSelfMic({
  //       operate: localUser.mic!,
  //     });

  //     if (localUser.mic === DeviceState.Open) {
  //       RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeAudio);
  //     } else {
  //       RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeAudio);
  //     }
  //   }, [localUser.mic]);

  // 监听共享状态的变化
  //   useEffect(() => {
  //     if (room.share_type === ShareType.Screen) {
  //       if (room.share_user_id && room.share_user_id !== localUser.user_id) {
  //         if (screenRef.current) {
  //           RtcClient.room?.subscribeScreen(room.share_user_id, MediaStreamType.kMediaStreamTypeBoth);
  //           RtcClient.engine?.setupRemoteScreen(
  //             room.share_user_id!,
  //             room.room_id!,
  //             screenRef.current,
  //             {
  //               renderMode: RenderMode.FIT,
  //               mirror: false,
  //             }
  //           );
  //         }
  //       }
  //     }
  //   }, [room.share_type, screenRef.current]);

  // 当roomInfo改变时发送消息通知使用到该信息的渲染进程
  useEffect(() => {
    ipcRenderer.sendTo(memberWindowId, 'updateRoomInfo', room);
    ipcRenderer.sendTo(applyLinkWindowId, 'updateRoomInfo', room);
    ipcRenderer.sendTo(footerWindowId, 'updateRoomInfo', room);
    ipcRenderer.sendTo(hostRecordComfirmwindowId, 'updateRoomInfo', room);
  }, [room]);

  //   messageInfo改变时发送消息通知使用到该信息的渲染进程
  useEffect(() => {
    ipcRenderer.sendTo(memberWindowId, 'getMessageInfo', messageInfo);
    ipcRenderer.sendTo(attendeeWindowId, 'getMessageInfo', messageInfo);
    ipcRenderer.sendTo(hostRecordRecieveWindowId, 'getMessageInfo', messageInfo);
  }, [messageInfo]);

  // 共享屏幕状态下收到主持人要求开麦和摄像头
  //   useEffect(() => {
  //     if (meShareScreen) {
  //       if (
  //         messageInfo.message === MessageType.RECIVE_HOST_REQUEST_OPEN_CAMERA ||
  //         messageInfo.message === MessageType.RECIVE_HOST_REQUEST_OPEN_MIC
  //       ) {
  //         // 参会人在共享屏幕状态下收到主持人开麦和摄像头申请，打开modal窗口
  //         ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.ATTENDEE_MODAL, 'open');
  //       }
  //     }
  //   }, [messageInfo.message]);

  // todo 收到连麦申请，应该通知其他渲染进程更新连麦用户列表
  //   useEffect(() => {
  //     if (meShareScreen) {
  //       if (messageInfo.reqOpenMicList.length + messageInfo.reqOpenShareList.length > 0) {
  //         console.log('有人请求');
  //         // 主持人在屏幕共享状态下打开请求modal窗口
  //         ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.MEMBER, 'open');
  //       }
  //     }
  //   }, [messageInfo.reqOpenMicList, messageInfo.reqOpenShareList]);

  // 共享状态下主持人收到参会人打开录制
  //   useEffect(() => {
  //     if (meShareScreen) {
  //       if (
  //         messageInfo.reqOpenRecordList.length > 0 &&
  //         room.record_status === RecordStatus.NotRecoading
  //       ) {
  //         ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.HOST_RECORD_RECIVE, 'open');
  //       }
  //     }
  //   }, [messageInfo.reqOpenRecordList.length]);

  // 当屏幕列表改变时发送消息通知使用该信息的渲染进程
  useEffect(() => {
    console.log('getScreenInfo: ', screenListInfo);
    ipcRenderer.sendTo(screenWindowId, 'getScreenList', screenListInfo);
  }, [screenListInfo]);

  useAudioReportHook({
    onActiveSpeaker: (userId: string) => {
      //   dispatch(setActiveSpeaker(userId));
    },
    onLocalAudio: (audioInfo) => {
      dispatch(
        setAudioInfo({
          isLocal: true,
          audioInfo,
        })
      );
    },
    onRemoteAudio: (audioInfos) => {
      dispatch(
        setAudioInfo({
          isLocal: false,
          audioInfo: audioInfos,
        })
      );
    },
  });

  useNetStatusChange({
    onNetOffline: () => {
      leaveRoom();
    },
    onNetOnline: async () => {
      console.log('vcResync');

      const res = await rtsApi.reSync();
      if (!isRtsError(res)) {
        const { code, response } = res;
        if (code === 450) {
          Message.error('登陆token过期');
          handleLogout();
        }
        if (code === 451) {
          Message.error('token为空');
          handleLogout();
        }
        if (code === 452) {
          Message.error('token和用户id不符');
          handleLogout();
        }

        if (code === 200) {
          dispatch(localUserJoinRoom(response));
        }
      }
    },
  });

  const renderHover = (
    user: Partial<BaseUser>,
    room: {
      localUser: Partial<BaseUser>;
    }
  ) => {
    return <Hover user={user} localUser={room.localUser}></Hover>;
  };

  if (room.localUser.user_role === UserRole.Host && room.share_type === ShareType.Screen) {
    return (
      <ShareLayout
        isMesharingScreen={true}
        room={{
          ...room,
          remoteUsers: room.linkmic_user_list,
        }}
        renderHover={renderHover}
      />
    );
  }

  return (
    <div className={styles.view}>
      <Header
        // todo 大班课 学生 挂断
        roomId={room.room_id}
        time={Utils.formatTime(leftTime)}
        className={styles.viewHeader}
        isRecording={room.record_status === RecordStatus.Recording}
        right={role === UserRole.Visitor && <HeaderRight />}
      />

      <div className={styles.viewWrapper}>
        <div
          className={styles.content}
          style={{
            width: ui.userListDrawOpen && role === UserRole.Host ? 'calc(100% - 248px)' : '100%',
          }}
        >
          <div
            className={styles.contentTop}
            style={{
              height: role === UserRole.Host ? 'calc(100% - 64px)' : '100%',
            }}
          >
            <EdubView />
            <LinkedUserList room={room as unknown as LinkedUserListProps['room']} />
          </div>
          {role === UserRole.Host && (
            <BottomMenu
              filterScreenIds={filterScreenIds}
              screenListInfo={screenListInfo}
              setScreenList={setScreenList}
              setFilterScreenIds={setFilterScreenIds}
            />
          )}
        </div>
        {role === UserRole.Host && <UserInfoList room={room as unknown as UserListProps['room']} />}
      </div>

      <InformToast />
    </div>
  );
}

export default Room;
