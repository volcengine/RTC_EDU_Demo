import VERTC, { MediaType, UserMessageEvent } from '@volcengine/rtc';
import { useEffect } from 'react';
import { message as Message } from 'antd';
import { RtcClient } from '@/core/rtc';
import useLeaveRoom from '@/core/hooks/useLeaveRoom';

import { setToast } from '@/store/slices/ui';
import { RootState, useDispatch, useSelector } from '@/store';
import { isRtsError } from '@/utils/rtsUtils';

import * as rtsApi from '@/scene/Meeting/apis/rtsApi';

import { FinishRoomReason, InformDataType, IStopRecordReason, RtsEvent } from './informType';
import {
  localUserChangeCamera,
  localUserChangeMic,
  localUserJoinRoom,
  localUserLeaveRoom,
  muteAll,
  remoteApply,
  remoteUserChangeCamera,
  remoteUserChangeMic,
  remoteUserJoinRoom,
  remoteUserLeaveRoom,
  setRecordStatus,
  setSharePermit,
  startShare,
  stopShare,
} from '@/store/slices/meetingRoom';
import {
  ApplyType,
  DeviceState,
  Permission,
  RecordStatus,
  RoomMicStatus,
  ShareStatus,
  ShareType,
  UserRole,
} from '@/types/state';
import { BoardClient } from '@/core/board';
import { ToastType } from '../Room/ToastMessage/types';

let room: RootState['meetingRoom'];

const useRtcListeners = () => {
  const dispatch = useDispatch();

  room = useSelector((state) => state.meetingRoom);
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => dispatch(localUserLeaveRoom()),
  });

  const isHost = room.localUser.user_role === UserRole.Host;

  const handleMessageReceived = async (e: UserMessageEvent) => {
    const { userId, message } = e;
    if (userId !== 'server') {
      return;
    }

    const msgObj: InformDataType = JSON.parse(message || '{}');
    // console.log('handleMessageReceived', userId, msgObj);

    if (msgObj.message_type !== 'inform') {
      return;
    }

    // 进房
    if (msgObj.event === RtsEvent.vcOnJoinRoom) {
      console.log('进房');
      if (!room.host_user_id) {
        const roomInfo = await rtsApi.reSync();
        if (!isRtsError(roomInfo)) {
          console.log('主持人变化');
          if (roomInfo.response.room.host_user_id) {
            dispatch(localUserJoinRoom(roomInfo.response));
          }
        }
      }

      dispatch(remoteUserJoinRoom(msgObj.data));
    }
    // 退房
    if (msgObj.event === RtsEvent.vcOnLeaveRoom) {
      console.log('退房');
      dispatch(remoteUserLeaveRoom(msgObj.data));
    }

    // 结束会议
    if (msgObj.event === RtsEvent.vcOnFinishRoom) {
      console.log('结束会议');
      const { reason } = msgObj.data;
      if (reason === FinishRoomReason.TimeEnded) {
        await leaveRoom();
        Message.error('本产品仅用于功能体验，单次房间时长不超过30分钟');
      }

      if (reason === FinishRoomReason.HostClose) {
        Message.error('主持人关闭房间,通话已结束');
        await leaveRoom();
        return;
      }

      if (reason === FinishRoomReason.Illegal) {
        await leaveRoom();
        Message.error('审核违规，房间关闭');
      }
    }

    // 用户操作自己的摄像头
    if (msgObj.event === RtsEvent.vcOnOperateSelfCamera) {
      const operation = msgObj.data.operate === DeviceState.Open ? '打开' : '关闭';
      if (room.localUser.user_id !== msgObj.data.user_id) {
        console.log(`远端用户${operation}摄像头`);
        dispatch(remoteUserChangeCamera(msgObj.data));
      } else {
        console.log(`本端用户${operation}摄像头`);
      }
    }

    // 用户操作自己的麦克风
    if (msgObj.event === RtsEvent.vcOnOperateSelfMic) {
      const operation = msgObj.data.operate === DeviceState.Open ? '打开' : '关闭';
      if (room.localUser.user_id !== msgObj.data.user_id) {
        console.log(`远端用户${operation}麦克风`);
        dispatch(remoteUserChangeMic(msgObj.data));
      } else {
        console.log(`本端用户${operation}麦克风`);
      }
    }

    // 全体静音
    if (msgObj.event === RtsEvent.vcOnOperateAllMic) {
      console.log('全体静音');

      if (!isHost) {
        // 主持人自己不受影响
        const { operate } = msgObj.data;
        if (operate === RoomMicStatus.AllMuted) {
          if (room.localUser.mic === DeviceState.Open) {
            await RtcClient.muteStream(MediaType.AUDIO);
            dispatch(localUserChangeMic(DeviceState.Closed));
            Message.info('主持人已将你设置静音');
          }
        }
      }

      dispatch(muteAll(msgObj.data));
    }
    // 房间内有用户共享
    if (msgObj.event === RtsEvent.vcOnStartShare) {
      const { user_name: userName, user_id: userId, share_type: shareType } = msgObj.data;
      const shareTypeStr = shareType === ShareType.Board ? '白板' : '屏幕';
      console.log(`用户${userName}开始分享${shareTypeStr}`);
      dispatch(startShare(msgObj.data));

      // 有人抢当前用户的共享
      if (
        room.localUser?.share_status === ShareStatus.Sharing &&
        room.localUser?.user_id !== userId
      ) {
        Message.error(`${userName}取代您发起共享`);
        await RtcClient.stopScreenCapture();
      }
    }
    // 房间内结束共享
    if (msgObj.event === RtsEvent.vcOnFinishShare) {
      console.log('结束共享');
      BoardClient.leaveRoom();
      dispatch(stopShare(msgObj.data));
    }

    // 主持人改变
    if (msgObj.event === RtsEvent.vcOnHostChange) {
      const roomInfo = await rtsApi.reSync();
      if (!isRtsError(roomInfo)) {
        console.log('主持人变化');
        if (roomInfo.response.room.host_user_id) {
          dispatch(localUserJoinRoom(roomInfo.response));
        }
      }
    }

    // 用户申请操作自己的麦克风
    if (msgObj.event === RtsEvent.vcOnOperateSelfMicApply) {
      if (!isHost) {
        // 如果不是主持人，不处理
        return;
      }

      console.log('远端用户请求开启麦克风');
      const applyUsers = room.remoteUsers?.filter(
        (user) => user.applying.includes(ApplyType.Mic) && user.user_id !== msgObj.data.user_id
      );

      const { user_name: userName } = msgObj.data;

      dispatch(
        setToast({
          open: true,
          title: applyUsers?.length
            ? `${applyUsers.length + 1}位用户正在申请发言`
            : `${userName}正在申请发言`,
          type: ToastType.ApplyMic,
          other: {
            user: msgObj.data,
            text: applyUsers?.length ? '查看详情' : '同意',
          },
        })
      );

      dispatch(
        remoteApply({
          ...msgObj.data,
          applying: ApplyType.Mic,
        })
      );
    }

    // 用户申请使用麦克风权限回复
    if (msgObj.event === RtsEvent.vcOnOperateSelfMicPermit) {
      const { user_id: userId, permit } = msgObj.data;

      if (userId === room.localUser?.user_id && permit === Permission.HasPermission) {
        if (!devicePermissions.audio) {
          Message.error('未获得浏览器麦克风权限!');
          return;
        }

        RtcClient.unmuteStream(MediaType.AUDIO);
        dispatch(localUserChangeMic(DeviceState.Open));
        console.log('本端用户获得开启麦克风权限');
      }
    }

    // 参会人申请共享权限
    if (msgObj.event === RtsEvent.vcOnSharePermissionApply) {
      if (!isHost) {
        // 如果不是主持人，不处理
        return;
      }
      console.log('远端用户申请共享权限');
      const { user_name: userName } = msgObj.data;

      const applyUsers = room.remoteUsers?.filter(
        (user) => user.applying.includes(ApplyType.Screen) && user.user_id !== msgObj.data.user_id
      );

      dispatch(
        setToast({
          open: true,
          title: applyUsers?.length
            ? `${applyUsers.length + 1}位用户正在申请共享`
            : `${userName}正在申请共享`,
          type: ToastType.ApplyShare,
          other: {
            user: msgObj.data,
            text: applyUsers?.length ? '查看详情' : '同意',
          },
        })
      );
      dispatch(
        remoteApply({
          ...msgObj.data,
          applying: ApplyType.Screen,
        })
      );
    }
    // 申请共享权限回复
    if (msgObj.event === RtsEvent.vcOnSharePermissionPermit) {
      const { user_id: userId, permit } = msgObj.data;

      if (userId === room.localUser?.user_id) {
        dispatch(
          setSharePermit({
            permit,
            isLocal: true,
            userId,
          })
        );
        if (permit === Permission.HasPermission) {
          Message.info('主持人授予了你共享权限');
          console.log('主持人授予了你共享权限');

          if (room.share_status === ShareStatus.Sharing && room.share_type === ShareType.Board) {
            await rtsApi.startShare({
              share_type: ShareType.Board,
            });
          }
        } else {
          Message.info('主持人拒绝授予你共享权限');
          console.log('主持人拒绝授予你共享权限');
        }
      }
    }

    // 主持人操作参会人摄像头
    if (msgObj.event === RtsEvent.vcOnOperateOtherCamera) {
      const { operate_user_id: userId, operate } = msgObj.data;

      if (userId === room.localUser?.user_id) {
        const operation = operate === DeviceState.Open ? '打开' : '关闭';
        console.log(`主持人请求${operation}你的摄像头`);

        // 远端主持人请求打开本端用户的摄像头, 需要弹出弹窗, 获得本端
        // 用户同意
        if (operate === DeviceState.Open) {
          dispatch(
            setToast({
              title: '主持人请求打开你的摄像头',
              open: true,
              type: ToastType.HostOpenCamera,
            })
          );
        }

        // 远端主持人请求关闭本端用户的摄像头, 直接关闭, 不需要弹出弹窗
        if (operate === DeviceState.Closed) {
          RtcClient.stopVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Closed));
          Message.info('主持人已关闭了你的摄像头');
          rtsApi.operateSelfCamera({
            operate,
          });
        }
      }
    }

    // 主持人操作参会人麦克风
    if (msgObj.event === RtsEvent.vcOnOperateOtherMic) {
      const { operate_user_id: usesId, operate } = msgObj.data;

      if (usesId === room.localUser?.user_id) {
        const operation = operate === DeviceState.Open ? '打开' : '关闭';
        console.log(`主持人请求${operation}你的麦克风`);

        // 远端主持人请求打开本端用户的麦克风, 需要弹出弹窗, 获得本端
        // 用户同意
        if (operate === DeviceState.Open) {
          dispatch(
            setToast({
              title: '主持人请求打开你的麦克风',
              open: true,
              type: ToastType.HostOpenMic,
            })
          );
        }

        if (operate === DeviceState.Closed) {
          RtcClient.muteStream(MediaType.AUDIO);
          dispatch(localUserChangeMic(DeviceState.Closed));
          Message.info('主持人已将你设置静音');
          rtsApi.operateSelfMic({
            operate,
          });
        }
      }
    }

    // 主持人操作参会人共享权限
    if (msgObj.event === RtsEvent.vcOnOperateOtherSharePermission) {
      const { operate_user_id: usesId, operate } = msgObj.data;
      if (usesId === room.localUser?.user_id) {
        if (room.localUser?.share_permission !== operate) {
          dispatch(
            setSharePermit({
              permit: operate,
              userId,
              isLocal: true,
            })
          );
          if (operate === Permission.HasPermission) {
            Message.info('主持人授予了你共享权限');
          } else if (operate === Permission.NoPermission) {
            Message.info('共享权限已被收回');
            if (room.localUser?.share_status === ShareStatus.Sharing) {
              if (room.share_type === ShareType.Screen) {
                await RtcClient.stopScreenCapture();
                await rtsApi.finishShare();
              }
            }
          }
        }
      } else {
        dispatch(
          setSharePermit({
            permit: operate,
            userId,
            isLocal: true,
          })
        );
      }
    }

    // 收到开始录制申请
    if (msgObj.event === RtsEvent.vcOnStartRecordApply) {
      if (!isHost) {
        // 如果不是主持人，不处理
        return;
      }
      const { user_name: userName, user_id: userId } = msgObj.data;
      dispatch(
        setToast({
          title: `${userName}发起录制请求`,
          open: true,
          type: ToastType.ApplyRecord,
          other: {
            message:
              '*录制功能仅做体验，本产品仅用于功能体验，单次录制时长不超过15分钟，录制文件保留时间为1周',
            userId,
          },
        })
      );
    }

    // (主持人)开始录制
    if (msgObj.event === RtsEvent.vcOnStartRecord) {
      dispatch(setRecordStatus(RecordStatus.Recording));
      Message.info('开始录制');
    }

    // (主持人)结束录制
    if (msgObj.event === RtsEvent.vcOnStopRecord) {
      const { reason } = msgObj.data;
      if (reason === IStopRecordReason.TimeEnded) {
        Message.info('15分钟录制时长已到，已为你停止录制');
      }

      if (reason === IStopRecordReason.HostStop) {
        Message.info('主持人停止录制');
      }

      dispatch(setRecordStatus(RecordStatus.NotRecoading));
    }

    // 主持人回答是否允许录制
    if (msgObj.event === RtsEvent.vcOnStartRecordPermit) {
      const { permit } = msgObj.data;
      if (permit === Permission.NoPermission) {
        Message.info('主持人拒绝了录制申请');
      } else {
        Message.success('主持人同意了录制申请');
      }
    }
  };

  const onUserMessageReceivedOutsideRoom = async (e: UserMessageEvent) => {
    return handleMessageReceived(e);
  };

  const onUserMessageReceived = async (e: UserMessageEvent) => {
    return handleMessageReceived(e);
  };

  const onRoomMessageReceived = async (e: UserMessageEvent) => {
    return handleMessageReceived(e);
  };

  useEffect(() => {
    RtcClient.engine.on(
      VERTC.events.onUserMessageReceivedOutsideRoom,
      onUserMessageReceivedOutsideRoom
    );
    RtcClient.engine.on(VERTC.events.onUserMessageReceived, onUserMessageReceived);
    RtcClient.engine.on(VERTC.events.onRoomMessageReceived, onRoomMessageReceived);
    return () => {
      RtcClient.engine.off(
        VERTC.events.onUserMessageReceivedOutsideRoom,
        onUserMessageReceivedOutsideRoom
      );
      RtcClient.engine.off(VERTC.events.onUserMessageReceived, onUserMessageReceived);
      RtcClient.engine.off(VERTC.events.onRoomMessageReceived, onRoomMessageReceived);
    };
  }, [isHost, devicePermissions]);
};

export default useRtcListeners;
