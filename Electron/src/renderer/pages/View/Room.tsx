import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message as Message } from 'antd';

import styles from './index.less';
import { useDispatch, useSelector } from '@src/store';

import Header from '@src/components/Header';
import Footer from './Footer';
import MemberList from './MemberList';
import Utils from '@src/utils';
import { MediaStreamType, RenderMode } from '@volcengine/vertc-electron-sdk/js/types/index';
import useRoomTime from './utils';
import InformToast from './Inform';
import ShareLayout from '@src/components/ShareLayout';
import { MessageType, updateMessage } from '@src/store/modules/publicMessage';
import { ipcRenderer, remote } from 'electron';
import PlayerWrapper from './PlayerWrapper';
import ScreenListModal from './ScreenListModal';
import SettingModal from './SettingModal';

import WhiteBoard from '@src/components/WhiteBoard';

import { RtcClient } from '@src/core/rtc';
import { ProcessEvent, WindowType } from '@/types';
import {
  DeviceState,
  Permission,
  RecordStatus,
  ShareStatus,
  ShareType,
  UserRole,
} from '@/renderer/types/state';

import {
  localUserJoinRoom,
  localUserLeaveRoom,
  setActiveSpeaker,
  setAudioInfo,
} from '@/renderer/store/slices/meetingRoom';

import * as rtsApi from './apis';
import { isRtsError } from '@/renderer/utils/rtsUtils';
import useNetStatusChange from '@/renderer/core/hooks/useNetStatusChange';
import useLogout from '@/renderer/core/hooks/useLogout';

import useProcess from './hooks/useProcess';
import useRTCEventListener from './hooks/useRTCEventListener';
import useAudioReportHook from '@/renderer/core/rtcHooks/useAudioReportHook';
import useLeaveRoom from '@/renderer/core/rtcHooks/useLeaveRoom';
import { isVeRtcApplication } from '@/renderer/utils/screenShare';

const memberWindowId = remote.getGlobal('shareWindowId').memberWindowId;
const screenWindowId = remote.getGlobal('shareWindowId').screenWindowId;
const footerWindowId = remote.getGlobal('shareWindowId').footerWindowId;
const attendeeWindowId = remote.getGlobal('shareWindowId').attendeeWindowId;
const hostRecordComfirmwindowId = remote.getGlobal('shareWindowId').hostRecordComfirmwindowId;
const hostRecordRecieveWindowId = remote.getGlobal('shareWindowId').hostRecordRecieveWindowId;
// const hostWindowId = remote.getGlobal('shareWindowId').hostWindowId;
const filterConfigs = [] as number[];

const View: React.FC<{}> = (props) => {
  const [isShowScreenList, setIsShowScreenList] = useState(false);
  const [isShowSettingModal, setIsShowSettingModal] = useState(false);
  const [meShareScreen, setMeShareScreen] = useState(false);
  const [preShareUser, setPreShareUser] = useState<string>('');
  const room = useSelector((state) => state.meetingRoom);

  const messageInfo = useSelector((state) => state.messageType);
  const screenRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const localUser = room.localUser;

  const leftTime = useRoomTime(room.start_time, room.base_time, room.experience_time_limit!);

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
  const onClickScreenShare = () => {
    if (localUser.share_permission === Permission.NoPermission) {
      dispatch(updateMessage(MessageType.REQUEST_OPEN_SHARE));
    } else {
      const screenList = RtcClient.engine?.getScreenCaptureSourceList();
      const tempList = screenList?.filter((item) => {
        if (isVeRtcApplication(item)) {
          if (!filterConfigs.some((windowId) => item.source_id === windowId)) {
            filterConfigs.push(item.source_id);
          }
        }
        return !isVeRtcApplication(item);
      });
      console.log('screenList: ', screenList, tempList);
      setFilterScreenIds(filterConfigs);
      setScreenList(tempList || []);
      setIsShowScreenList(true);
    }
  };

  // 点击底部白板共享按钮，发送信令
  const onClickWhiteBoardShare = () => {
    if (localUser.share_permission === Permission.NoPermission) {
      dispatch(updateMessage(MessageType.REQUEST_OPEN_SHARE));
    } else {
      RtcClient.engine?.stopScreenAudioCapture();
      RtcClient.engine?.stopScreenVideoCapture();

      rtsApi.startShare({
        share_type: ShareType.Board,
      });
    }
  };

  // 点击停止白板共享
  const onClickStopWhiteBoardShare = () => {
    rtsApi.finishShare();
  };

  // 点击录制按钮
  // todo 改成浮窗的形式，不再弹窗
  const onClickRecord = () => {
    if (localUser.user_role === UserRole.Host) {
      if (room.record_status === RecordStatus.NotRecoading) {
        dispatch(updateMessage(MessageType.HOST_START_RECORD));
      } else {
        dispatch(updateMessage(MessageType.HOST_STOP_RECORD));
      }
    } else {
      if (room.record_status === RecordStatus.NotRecoading) {
        rtsApi.startRecordApply();
        Message.success('已向主持人发起录制请求');
      } else {
        Message.error('主持人才能停止录制');
      }
    }
  };

  useRTCEventListener(screenRef);

  // 我的共享权限被收回时
  useEffect(() => {
    if (
      room.share_status === ShareStatus.Sharing &&
      room.share_user_id === localUser.user_id &&
      localUser.share_permission === Permission.NoPermission
    ) {
      console.log('共享时共享权限被收回');
      ipcRenderer.send(ProcessEvent.RecoverWindow);
      setMeShareScreen(false);
      rtsApi.finishShare();
      RtcClient.stopScreenVideoCapture();
      RtcClient.stopScreenAudioCapture();
    }
  }, [localUser.share_permission]);

  // 监听摄像头变化
  useEffect(() => {
    // 发送消息
    rtsApi.operateSelfCamera({
      operate: localUser.camera!,
    });

    if (localUser.camera === DeviceState.Open) {
      console.log('点击打开摄像头: ', Date.now());
      RtcClient.startVideoCapture();
      RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeVideo);
    } else {
      RtcClient.stopVideoCapture();
      RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeVideo);
    }
  }, [localUser.camera]);

  // 监听麦克风变化
  useEffect(() => {
    rtsApi.operateSelfMic({
      operate: localUser.mic!,
    });

    if (localUser.mic === DeviceState.Open) {
      RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeAudio);
    } else {
      RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeAudio);
    }
  }, [localUser.mic]);

  // screenRef变化：1.进入房间和离开房间 2.窗口变化时
  // 窗口变化原因： 1.自己共享屏幕 2.共享屏幕时切白板 3.共享屏幕被抢占
  useEffect(() => {
    if (screenRef.current) {
      if (room.share_type === ShareType.Screen && room.share_user_id !== localUser.user_id) {
        RtcClient.engine?.removeRemoteScreen(preShareUser, room.room_id!);
        setPreShareUser(room.share_user_id!);
        RtcClient.engine?.setupRemoteScreen(room.share_user_id!, room.room_id!, screenRef.current, {
          renderMode: RenderMode.FIT,
          mirror: false,
        });
      }
    }
  }, [screenRef.current]);

  // 监听共享状态的变化
  useEffect(() => {
    if (room.share_type === ShareType.Screen) {
      if (room.share_user_id && room.share_user_id !== localUser.user_id) {
        if (meShareScreen) {
          setMeShareScreen(false);
          console.log('共享屏幕被抢占');
          // 共享被抢占
          RtcClient.stopScreenAudioCapture();
          RtcClient.stopScreenVideoCapture();
          ipcRenderer.send(ProcessEvent.RecoverWindow);
        } else {
          if (screenRef.current) {
            console.log('别人共享屏幕');
            // 清除上一个用户
            if (screenRef.current) {
              RtcClient.engine?.removeRemoteScreen(preShareUser, room.room_id!);
              setPreShareUser(room.share_user_id);
              RtcClient.engine?.setupRemoteScreen(
                room.share_user_id,
                room.room_id!,
                screenRef.current,
                {
                  renderMode: RenderMode.FIT,
                  mirror: false,
                }
              );
            }
            RtcClient.room?.subscribeScreen(
              room.share_user_id,
              MediaStreamType.kMediaStreamTypeBoth
            );
          }
        }
      } else if (room.share_user_id === localUser.user_id) {
        console.log('自己共享屏幕');
        setMeShareScreen(true);
      }
    } else if (room.share_type === ShareType.Board) {
      if (room.share_user_id !== localUser.user_id) {
        if (meShareScreen) {
          console.log('共享屏幕被抢占');
          RtcClient.stopScreenAudioCapture();
          RtcClient.stopScreenVideoCapture();
          ipcRenderer.send(ProcessEvent.RecoverWindow);
        }
        console.log('有人共享白板');
      }
      setMeShareScreen(false);
    } else {
      setMeShareScreen(false);
    }
  }, [room.share_user_id, room.share_type]);

  // 当roomInfo改变时发送消息通知使用到该信息的渲染进程
  useEffect(() => {
    ipcRenderer.sendTo(memberWindowId, 'updateRoomInfo', room);
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
  useEffect(() => {
    if (meShareScreen) {
      if (
        messageInfo.message === MessageType.RECIVE_HOST_REQUEST_OPEN_CAMERA ||
        messageInfo.message === MessageType.RECIVE_HOST_REQUEST_OPEN_MIC
      ) {
        // 参会人在共享屏幕状态下收到主持人开麦和摄像头申请，打开modal窗口
        ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.ATTENDEE_MODAL, 'open');
      }
    }
  }, [messageInfo.message]);

  // 共享屏幕状态下主持人收到参会人权限申请
  useEffect(() => {
    if (meShareScreen) {
      if (messageInfo.reqOpenMicList.length + messageInfo.reqOpenShareList.length > 0) {
        console.log('有人请求');
        // 主持人在屏幕共享状态下打开请求modal窗口
        ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.MEMBER, 'open');
      }
    }
  }, [messageInfo.reqOpenMicList, messageInfo.reqOpenShareList]);

  // 共享状态下主持人收到参会人打开录制
  useEffect(() => {
    if (meShareScreen) {
      if (
        messageInfo.reqOpenRecordList.length > 0 &&
        room.record_status === RecordStatus.NotRecoading
      ) {
        ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.HOST_RECORD_RECIVE, 'open');
      }
    }
  }, [messageInfo.reqOpenRecordList.length]);

  // 当屏幕列表改变时发送消息通知使用该信息的渲染进程
  useEffect(() => {
    console.log('getScreenInfo: ', screenListInfo);
    ipcRenderer.sendTo(screenWindowId, 'getScreenList', screenListInfo);
  }, [screenListInfo]);

  useAudioReportHook({
    onActiveSpeaker: (userId: string) => {
      dispatch(setActiveSpeaker(userId));
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
      const res = await rtsApi.reSync();
      console.log('vcResync', res);

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

  return (
    <>
      {!meShareScreen ? (
        <div className={styles.view}>
          <Header
            roomId={room.room_id}
            time={Utils.formatTime(leftTime)}
            className={styles.viewHeader}
            isRecording={room.record_status === RecordStatus.Recording}
          />
          <div className={styles.body}>
            <div className={styles.main}>
              <div className={styles.middle}>
                <PlayerWrapper />
                <div
                  style={{
                    display:
                      room.share_status === ShareStatus.Sharing &&
                      room.share_type === ShareType.Screen &&
                      room.share_user_id !== localUser.user_id
                        ? 'block'
                        : 'none',
                  }}
                  className={styles.screen}
                  ref={screenRef}
                />
                {room.share_status === ShareStatus.Sharing &&
                  room.share_type === ShareType.Board && (
                    <div className={styles.board}>
                      <WhiteBoard
                        room={room}
                        localEditPermission={
                          !!localUser.share_permission || localUser.user_role === UserRole.Host
                            ? Permission.HasPermission
                            : Permission.NoPermission
                        }
                      />
                    </div>
                  )}
              </div>
              <Footer
                onClickScreenShare={onClickScreenShare}
                onClickWhiteBoardShare={onClickWhiteBoardShare}
                onClickStopWhiteBoardShare={onClickStopWhiteBoardShare}
                onClickSetting={() => {
                  setIsShowSettingModal(!isShowSettingModal);
                }}
                onClickRecord={onClickRecord}
              />
            </div>
            <MemberList />
          </div>

          <InformToast />
          <ScreenListModal
            isShowScreenList={isShowScreenList}
            filterScreenIds={filterScreenIds}
            screenListInfo={screenListInfo}
            setIsShowScreenList={setIsShowScreenList}
            setMeShareScreen={setMeShareScreen}
          />
          <SettingModal
            setIsShowSetting={setIsShowSettingModal}
            isShowSetting={isShowSettingModal}
          />
        </div>
      ) : (
        <ShareLayout isMesharingScreen={true} room={room} />
      )}
    </>
  );
};

export default View;
