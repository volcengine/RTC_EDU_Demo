import { useEffect } from 'react';
import { message as Message } from 'antd';
import { RtcClient } from '@src/core/rtc';

// import { setToast } from '@src/store/slices/ui';

import * as rtsApi from '@/renderer/pages/Edus/apis';

import { FinishRoomReason, InformDataType, IEdusStopRecordReason, RtsEvent } from './informType';
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
} from '@src/store/slices/edusRoom';
import {
  ApplyType,
  DeviceState,
  Permission,
  RecordStatus,
  RoomMicStatus,
  ShareStatus,
  UserRole,
} from '@src/types/state';
import { ShareType } from '@/renderer/types/state';
import {
  insertToMicList,
  insertToRecordList,
  insertToShareList,
  MessageType,
  updateMessage,
} from '@/renderer/store/modules/publicMessage';
import { RootState, useDispatch, useSelector } from '@src/store';
import { isRtsError } from '@/renderer/utils/rtsUtils';

import useLeaveRoom from '@/renderer/core/rtcHooks/useLeaveRoom';
import { MediaStreamType } from '@volcengine/vertc-electron-sdk/js/types';
import { BoardClient } from '@/renderer/core/board';

let room: RootState['edusRoom'];

const useRtsListeners = () => {
  const dispatch = useDispatch();

  room = useSelector((state) => state.edusRoom);

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => dispatch(localUserLeaveRoom()),
  });

  const localUser = room.localUser;
  const isHost = room.localUser.user_role === UserRole.Host;

  // 监听房间广播消息
  const handleMessageReceived = async (userId: string, message: string) => {
    if (userId !== 'server') {
      return;
    }

    const msgObj: InformDataType = JSON.parse(message || '{}');

    if (msgObj.message_type !== 'inform') {
      return;
    }

    console.log('房间广播消息handleMessageReceived', msgObj);

    // !进房
    if (msgObj.event === RtsEvent.edusOnJoinRoom) {
      console.log('进房', msgObj.data);

      // todo 本地用户进房，更新房间信息
      if (!room.host_user_id) {
        const roomInfo = await rtsApi.reSync();
        if (!isRtsError(roomInfo)) {
          console.log('房间内没有老师，同步一下信息', roomInfo);
          if (roomInfo.response.room.host_user_id) {
            dispatch(localUserJoinRoom(roomInfo.response));
          }
        }
      }

      const userId = msgObj.data.user.user_id;
      if (userId !== localUser.user_id) {
        dispatch(remoteUserJoinRoom(msgObj.data));
      }
    }
    // !退房
    if (msgObj.event === RtsEvent.edusOnLeaveRoom) {
      console.log('退房', msgObj.data);

      const { user } = msgObj.data;

      if (user.user_id === localUser?.user_id) {
        // 本端用户由于断网/休眠等和服务端不同步，下发了离房通知
        leaveRoom();
      } else {
        dispatch(remoteUserLeaveRoom(msgObj.data));
      }
    }

    // !结束会议
    if (msgObj.event === RtsEvent.edusOnFinishRoom) {
      console.log('结束会议', localUser);
      const { reason } = msgObj.data;

      //   ------------------

      //   if (reason === FinishRoomReason.HostClose) {
      //     if (localUser.user_role !== UserRole.Host) {
      //       Message.info('通话已经结束');
      //     }
      //     console.log('finishRoom: ', reason);
      //   } else {
      //     Message.info('体验时间已经到了');
      //     // dispatch(setTimeout(true));
      //   }

      //   dispatch(localUserLeaveRoom());
      //   dispatch(setJoining(JoinStatus.NotJoined));
      //   dispatch(removeAllUserInRtcRoom());

      //   ------------------
      //   ipcRenderer.send(ProcessEvent.RecoverWindow);

      if (reason === FinishRoomReason.TimeEnded) {
        await leaveRoom();
        // message = '本产品仅用于功能体验，单次房间时长不超过30分钟';
        Message.error('本产品仅用于功能体验，单次房间时长不超过30分钟');
      }

      if (reason === FinishRoomReason.HostClose) {
        // title = '老师关闭房间';
        if (!isHost) {
          Message.error('老师关闭房间,通话已结束');
          await leaveRoom();
        } else {
          Message.info('通话已经结束');
        }
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
            await RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeAudio);
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

      const { user_name: userName, user_id: userId, share_type: shareType } = msgObj.data;
      dispatch(startShare(msgObj.data));

      // 有人抢当前用户的共享
      if (
        room.localUser?.share_status === ShareStatus.Sharing &&
        room.localUser?.user_id !== userId
      ) {
        const content = shareType === ShareType.Screen ? '屏幕' : '白板';

        // todo 实现停止屏幕采集
        Message.error(`${userName}正在共享${content}`);
        RtcClient.engine?.stopScreenVideoCapture();
        RtcClient.engine?.stopScreenAudioCapture();
      }
    }
    // 房间内结束共享
    if (msgObj.event === RtsEvent.edusOnFinishShare) {
      console.log('结束共享');
      BoardClient.leaveRoom();
      dispatch(stopShare(msgObj.data));
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

  // 监听单播消息
  const handleMessageRecievedOutSideRoom = async (userId: string, message: string) => {
    if (userId !== 'server') {
      return;
    }

    const msgObj: InformDataType = JSON.parse(message || '{}');

    if (msgObj.message_type !== 'inform') {
      return;
    }

    console.log('监听单播消息handleMessageReceived', msgObj);

    // !用户申请操作自己的麦克风
    if (msgObj.event === RtsEvent.edusOnOperateSelfMicApply) {
      console.log('用户申请操作自己的麦克风');

      if (!isHost) {
        // 如果不是老师，不处理
        return;
      }

      const { user_id: userId, user_name: userName } = msgObj.data;

      // 插入请求打开麦克风的列表中
      dispatch(
        insertToMicList({
          userId,
          userName,
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

      if (userId === room.localUser?.user_id) {
        if (permit === Permission.NoPermission) {
          Message.warning('老师拒绝了你的申请');
        } else {
          Message.success('老师已将你的静音取消');
        }
        dispatch(localUserChangeMic(DeviceState.Open));

        // todo 检查一下，开启麦克风应该是在设备的组件里useEffect统一处理的
        // if (!devicePermissions.audio) {
        //   Message.error('未获得麦克风权限!');
        //   return;
        // }

        // RtcClient.publishStream(MediaType.AUDIO);
        // dispatch(localUserChangeMic(DeviceState.Open));
      }
    }

    // !学生申请共享权限
    if (msgObj.event === RtsEvent.edusOnSharePermissionApply) {
      console.log('用户申请共享权限');
      if (!isHost) {
        // 如果不是老师，不处理
        return;
      }
      const { user_name: userName, user_id } = msgObj.data;

      // 插入请求打开共享权限的列表中
      dispatch(
        insertToShareList({
          userId: user_id,
          userName,
        })
      );

      // 标记学生
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
        if (permit === Permission.NoPermission) {
          Message.warning('老师拒绝了你的申请');
        } else {
          Message.success('老师已授予你共享权限');
        }

        dispatch(
          setSharePermit({
            permit,
            isLocal: true,
            userId,
          })
        );
      }
    }
    // !老师操作学生摄像头
    if (msgObj.event === RtsEvent.edusOnOperateOtherCamera) {
      console.log('老师操作学生摄像头');
      const { operate_user_id: userId, operate } = msgObj.data;

      if (userId === room.localUser?.user_id) {
        if (operate === DeviceState.Open) {
          dispatch(updateMessage(MessageType.RECIVE_HOST_REQUEST_OPEN_CAMERA));
        }

        if (operate === DeviceState.Closed) {
          //   RtcClient.stopVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Closed));
          Message.info('老师已关闭了你的摄像头');
          // todo 应该不需要？ 向房间内通知已经操作自己的摄像头
          //   rtsApi.operateSelfCamera({
          //     operate,
          //   });
        }
      }
    }
    // !老师操作学生麦克风
    if (msgObj.event === RtsEvent.edusOnOperateOtherMic) {
      console.log('老师操作学生麦克风');

      const { operate_user_id: usesId, operate } = msgObj.data;

      if (usesId === room.localUser?.user_id) {
        if (operate === DeviceState.Closed) {
          Message.info('老师已将你设置静音');
          dispatch(localUserChangeMic(operate));
        } else {
          // 更该消息，弹出对应弹窗让用户确定
          dispatch(updateMessage(MessageType.RECIVE_HOST_REQUEST_OPEN_MIC));
        }

        // todo 应该是在设备的地方，更新了推流状态
        // if (operate === DeviceState.Closed) {
        //   RtcClient.unpublishStream(MediaType.AUDIO);
        //   dispatch(localUserChangeMic(DeviceState.Closed));
        //   Message.info('老师已将你设置静音');

        //   // 向房间内通知已经操作自己的麦克风
        //   rtsApi.operateSelfMic({
        //     operate,
        //   });
        // }
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
              RtcClient.stopScreenVideoCapture();
              RtcClient.stopScreenAudioCapture();

              rtsApi.finishShare();
            }
          }
        }
      }
    }

    if (msgObj.event === RtsEvent.edusOnStartRecordApply) {
      if (!isHost) {
        return;
      }
      const { user_name: userName, user_id: userId } = msgObj.data;
      dispatch(
        insertToRecordList({
          userId,
          userName,
        })
      );
    }
  };

  useEffect(() => {
    RtcClient.room?.on('onRoomMessageReceived', handleMessageReceived);
    RtcClient.room?.on('onRoomMessageReceived', handleMessageRecievedOutSideRoom);

    RtcClient.engine?.on('onUserMessageReceivedOutsideRoom', handleMessageRecievedOutSideRoom);
    RtcClient.engine?.on('onUserMessageReceivedOutsideRoom', handleMessageReceived);

    return () => {
      RtcClient.room?.off('onRoomMessageReceived', handleMessageReceived);
      RtcClient.room?.off('onRoomMessageReceived', handleMessageRecievedOutSideRoom);
      RtcClient.engine?.off('onUserMessageReceivedOutsideRoom', handleMessageReceived);
      RtcClient.engine?.off('onUserMessageReceivedOutsideRoom', handleMessageRecievedOutSideRoom);
    };
  }, [localUser.join_time]);
};

export default useRtsListeners;
