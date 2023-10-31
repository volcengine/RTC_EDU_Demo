import VERTC, { MediaType, UserMessageEvent } from '@volcengine/rtc';
import { useEffect } from 'react';
import { message as Message } from 'antd';
import { RtcClient } from '@/core/rtc';
import useLeaveRoom from '@/core/hooks/useLeaveRoom';

import { setToast } from '@/store/slices/ui';
import { RootState, useDispatch, useSelector } from '@/store';
import { isRtsError } from '@/utils/rtsUtils';

import * as rtsApi from '@/scene/Edus/apis/rtsApi';

import { FinishRoomReason, IEdusStopRecordReason, InformDataType, RtsEvent } from './informType';
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
} from '@/store/slices/edusRoom';
import { BoardClient } from '@/core/board';
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
import { ToastType } from '../Room/ToastMessage/types';

let room: RootState['edusRoom'];

const useRtcListeners = () => {
  const dispatch = useDispatch();
  //   const navigate = useNavigate();

  room = useSelector((state) => state.edusRoom);
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

    if (msgObj.message_type !== 'inform') {
      return;
    }
    console.log('handleMessageReceived', msgObj);

    // !进房
    if (msgObj.event === RtsEvent.edusOnJoinRoom) {
      //   const { user, user_count } = msgObj.data;
      // todo: 是否允许远端用户进房需要服务端确认
      console.log('进房', msgObj.data);

      if (!room.host_user_id) {
        const roomInfo = await rtsApi.reSync();
        if (!isRtsError(roomInfo)) {
          console.log('房间内没有老师，同步一下信息', roomInfo);
          if (roomInfo.response.room.host_user_id) {
            dispatch(localUserJoinRoom(roomInfo.response));
          }
        }
      }

      dispatch(remoteUserJoinRoom(msgObj.data));
    }
    // !退房
    if (msgObj.event === RtsEvent.edusOnLeaveRoom) {
      console.log('退房', msgObj.data);
      //  todo ：server fix： 进房时通知user_count=2，离房时user_count=0
      // todo： 房间里的分享状态是否同步用户状态
      dispatch(remoteUserLeaveRoom(msgObj.data));
    }

    // !结束小班课
    if (msgObj.event === RtsEvent.edusOnFinishRoom) {
      console.log('结束小班课');
      const { reason } = msgObj.data;
      //   let title = '';
      //   let message = '';
      if (reason === FinishRoomReason.TimeEnded) {
        // title = '体验时间已结束';
        // Message.error('体验时间已结束');
        await leaveRoom();
        // message = '本产品仅用于功能体验，单次房间时长不超过30分钟';
        Message.error('本产品仅用于功能体验，单次房间时长不超过30分钟');
      }

      if (reason === FinishRoomReason.HostClose) {
        // title = '老师关闭房间';
        // if (!isHost) {
        Message.info('课程已结束');
        await leaveRoom();
        // }
        return;
      }

      if (reason === FinishRoomReason.Illegal) {
        // title = '审核违规，房间关闭';
        await leaveRoom();
        Message.error('审核违规，房间关闭');
      }
    }
    // !用户操作自己的摄像头
    if (msgObj.event === RtsEvent.edusOnOperateSelfCamera) {
      console.log('用户操作摄像头');

      dispatch(remoteUserChangeCamera(msgObj.data));
    }

    // !用户操作自己的麦克风
    if (msgObj.event === RtsEvent.edusOnOperateSelfMic) {
      console.log('用户操作麦克风');

      dispatch(remoteUserChangeMic(msgObj.data));
    }
    // !全体静音
    if (msgObj.event === RtsEvent.edusOnOperateAllMic) {
      console.log('全体静音', msgObj.data);

      if (!isHost) {
        // 老师自己不受影响
        const { operate } = msgObj.data;
        if (operate === RoomMicStatus.AllMuted) {
          if (room.localUser.mic === DeviceState.Open) {
            await RtcClient.unpublishStream(MediaType.AUDIO);
            dispatch(localUserChangeMic(DeviceState.Closed));
            Message.info('老师已将你设置静音');
          }
        }
      }

      dispatch(muteAll(msgObj.data));
    }
    // 房间内有用户共享
    if (msgObj.event === RtsEvent.edusOnStartShare) {
      console.log('开始分享', room.localUser);

      const { user_name: userName, user_id: userId } = msgObj.data;
      dispatch(startShare(msgObj.data));

      // 有人抢当前用户的共享
      if (
        room.localUser?.share_status === ShareStatus.Sharing &&
        room.localUser?.user_id !== userId
      ) {
        Message.error(`${userName}正在共享`);
        await RtcClient.stopScreenCapture();
      }
    }
    // 房间内结束共享
    if (msgObj.event === RtsEvent.edusOnFinishShare) {
      console.log('结束共享');
      BoardClient.leaveRoom();
      dispatch(stopShare(msgObj.data));
    }

    // !用户申请操作自己的麦克风
    if (msgObj.event === RtsEvent.edusOnOperateSelfMicApply) {
      console.log('用户申请操作自己的麦克风');

      if (!isHost) {
        // 如果不是老师，不处理
        return;
      }

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
    // !申请操作自己麦克风回复
    if (msgObj.event === RtsEvent.edusOnOperateSelfMicPermit) {
      console.log('申请操作自己麦克风回复', msgObj);
      const { user_id: userId, permit } = msgObj.data;

      if (userId === room.localUser?.user_id && permit === Permission.HasPermission) {
        if (!devicePermissions.audio) {
          Message.error('未获得麦克风权限!');
          return;
        }
        Message.info('老师已同意发言');
        RtcClient.publishStream(MediaType.AUDIO);
        dispatch(localUserChangeMic(DeviceState.Open));
      }
    }
    // !学生申请共享权限
    if (msgObj.event === RtsEvent.edusOnSharePermissionApply) {
      console.log('用户申请共享权限');
      if (!isHost) {
        // 如果不是老师，不处理
        return;
      }
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
    // !申请共享权限回复
    if (msgObj.event === RtsEvent.edusOnSharePermissionPermit) {
      console.log('申请共享权限回复', msgObj.data);

      const { user_id: userId, permit } = msgObj.data;

      if (userId === room.localUser?.user_id) {
        // RtcClient.publishStream(MediaType.AUDIO);
        dispatch(
          setSharePermit({
            permit,
            isLocal: true,
            userId,
          })
        );
        if (permit === Permission.HasPermission) {
          Message.info('老师授予了你共享权限');

          if (room.share_status === ShareStatus.Sharing && room.share_type === ShareType.Board) {
            await rtsApi.startShare({
              share_type: ShareType.Board,
            });
          }
        }
      }
    }
    // !老师操作学生摄像头
    if (msgObj.event === RtsEvent.edusOnOperateOtherCamera) {
      console.log('老师操作学生摄像头');
      const { operate_user_id: userId, operate } = msgObj.data;

      if (userId === room.localUser?.user_id) {
        if (operate === DeviceState.Open) {
          dispatch(
            setToast({
              title: '老师请求打开你的摄像头',
              open: true,
              type: ToastType.HostOpenCamera,
            })
          );
        }

        if (operate === DeviceState.Closed) {
          RtcClient.stopVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Closed));
          Message.info('老师已关闭了你的摄像头');
          // 向房间内通知已经操作自己的摄像头
          rtsApi.operateSelfCamera({
            operate,
          });
        }
      }
    }
    // !老师操作学生麦克风
    if (msgObj.event === RtsEvent.edusOnOperateOtherMic) {
      console.log('老师操作学生麦克风');

      const { operate_user_id: usesId, operate } = msgObj.data;

      if (usesId === room.localUser?.user_id) {
        if (operate === DeviceState.Open) {
          dispatch(
            setToast({
              title: '老师请求打开你的麦克风',
              open: true,
              type: ToastType.HostOpenMic,
            })
          );
        }

        if (operate === DeviceState.Closed) {
          RtcClient.unpublishStream(MediaType.AUDIO);
          dispatch(localUserChangeMic(DeviceState.Closed));
          Message.info('老师已将你设置静音');

          // 向房间内通知已经操作自己的麦克风
          rtsApi.operateSelfMic({
            operate,
          });
        }
      }
    }

    // !老师操作学生共享权限
    if (msgObj.event === RtsEvent.edusOnOperateOtherSharePermission) {
      console.log('老师操作学生共享权限');
      const { operate_user_id: usesId, operate } = msgObj.data;
      if (usesId === room.localUser?.user_id) {
        if (operate === Permission.HasPermission) {
          dispatch(
            setSharePermit({
              permit: Permission.HasPermission,
              userId,
              isLocal: true,
            })
          );
          Message.info('老师授予了你共享权限');
        }

        if (operate === Permission.NoPermission) {
          dispatch(
            setSharePermit({
              permit: Permission.NoPermission,
              userId,
              isLocal: true,
            })
          );
          Message.info('共享权限已被收回');

          if (room.localUser?.share_status === ShareStatus.Sharing) {
            if (room.share_type === ShareType.Screen) {
              await RtcClient.stopScreenCapture();
              rtsApi.finishShare();
            }
          }
        }
      } else {
        dispatch(
          setSharePermit({
            permit: operate,
            userId,
            isLocal: false,
          })
        );
      }
    }

    if (msgObj.event === RtsEvent.edusOnStartRecordApply) {
      if (!isHost) {
        // 如果不是老师，不处理
        return;
      }
      const {
        user_name: userName,
        user_id: userId,
      } = msgObj.data;
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
    if (msgObj.event === RtsEvent.edusOnStartRecord) {
      dispatch(setRecordStatus(RecordStatus.Recording));
      Message.info('开始录制');
    }
    if (msgObj.event === RtsEvent.edusOnStopRecord) {
      const { reason } = msgObj.data;
      if (reason === IEdusStopRecordReason.TimeEnded) {
        Message.info('15分钟录制时长已到，已为你停止录制');
      }

      if (reason === IEdusStopRecordReason.HostStop) {
        Message.info('老师停止录制');
      }

      dispatch(setRecordStatus(RecordStatus.NotRecoading));
    }
  };

  useEffect(() => {
    RtcClient.engine.on(VERTC.events.onUserMessageReceivedOutsideRoom, handleMessageReceived);
    RtcClient.engine.on(VERTC.events.onUserMessageReceived, handleMessageReceived);
    RtcClient.engine.on(VERTC.events.onRoomMessageReceived, handleMessageReceived);
    return () => {
      RtcClient.engine.off(VERTC.events.onUserMessageReceivedOutsideRoom, handleMessageReceived);
      RtcClient.engine.off(VERTC.events.onUserMessageReceived, handleMessageReceived);
      RtcClient.engine.off(VERTC.events.onRoomMessageReceived, handleMessageReceived);
    };
  }, [isHost, devicePermissions]);
};

export default useRtcListeners;
