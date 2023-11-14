import { useEffect } from 'react';
import { message as Message } from 'antd';
import { RtcClient } from '@src/core/rtc';
import * as rtsApi from '../apis/rtsApi';

import { InformDataType, RtsEvent } from './informType';

import {
  localUserChangeCamera,
  localUserChangeMic,
  startShare,
  remoteUserChangeCamera,
  remoteUserChangeMic,
  remoteUserJoinRoom,
  remoteUserLeaveRoom,
  setSharePermit,
  stopShare,
  setRecordStatus,
  localUserLeaveRoom,
  setLinkmicApplyList,
  setLinkmicJoin,
  setLinkmicLeave,
  setLinkStatus,
  LinkStatus,
  setApplyLinkCount,
} from '@src/store/slices/edubRoom';
import { RootState, useDispatch, useSelector } from '@src/store';
import { FinishRoomReason, StopRecordReason } from '@src/types/rtsTypes';
import { DeviceState, Permission, RecordStatus, UserRole } from '@src/types/state';
import useLeaveRoom from '@/renderer/core/rtcHooks/useLeaveRoom';
import { isRtsError } from '@/renderer/utils/rtsUtils';
import { MediaStreamType } from '@volcengine/vertc-electron-sdk/js/types';

let room: RootState['edubRoom'];

const useRtsListeners = () => {
  const dispatch = useDispatch();
  //   const navigate = useNavigate();

  room = useSelector((state) => state.edubRoom);

  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => dispatch(localUserLeaveRoom()),
  });

  const isHost = room.localUser.user_role === UserRole.Host;

  const handleMessageReceived = async (userId: string, message: string) => {
    if (userId !== 'server') {
      return;
    }

    const msgObj: InformDataType = JSON.parse(message || '{}');

    if (msgObj.message_type !== 'inform') {
      return;
    }

    console.log(`${msgObj.event}:`, msgObj);

    // !进房
    if (msgObj.event === RtsEvent.edubOnJoinRoom) {
      //   const { user, user_count } = msgObj.data;
      // todo: 是否允许远端用户进房需要服务端确认
      console.log('进房', msgObj.data);

      dispatch(remoteUserJoinRoom(msgObj.data));
    }
    // !退房
    if (msgObj.event === RtsEvent.edubOnLeaveRoom) {
      console.log('退房', msgObj.data);
      const { user } = msgObj.data;

      if (user.user_id === room.localUser?.user_id) {
        // 本端用户由于断网/休眠等和服务端不同步，下发了离房通知
        leaveRoom();
      } else {
        dispatch(remoteUserLeaveRoom(msgObj.data));
      }
    }

    // !结束大班课
    // 1. 老师调用后触发, 通知房间里其他人 -> 老师自己主动调用离房
    // 2. 其他原因，所有人都收到
    // 这里是
    if (msgObj.event === RtsEvent.edubOnFinishRoom) {
      console.log('结束大班课', msgObj.data);
      const { reason } = msgObj.data;

      if (reason === FinishRoomReason.TimeEnded) {
        await leaveRoom();
        Message.error('本产品仅用于功能体验，单次房间时长不超过30分钟');
      }

      if (reason === FinishRoomReason.HostClose) {
        Message.error('老师关闭房间,通话已结束');
        await leaveRoom();
        return;
      }

      if (reason === FinishRoomReason.Illegal) {
        await leaveRoom();
        Message.error('审核违规，房间关闭');
      }
    }
    // !用户操作自己的摄像头
    if (msgObj.event === RtsEvent.edubOnOperateSelfCamera) {
      console.log('用户操作摄像头');

      dispatch(remoteUserChangeCamera(msgObj.data));
    }

    // !用户操作自己的麦克风
    if (msgObj.event === RtsEvent.edubOnOperateSelfMic) {
      console.log('用户操作麦克风');

      dispatch(remoteUserChangeMic(msgObj.data));
    }

    // !开始共享，推屏幕流
    if (msgObj.event === RtsEvent.edubOnStartShare) {
      console.log('开始分享', room.localUser);
      dispatch(startShare(msgObj.data));
    }
    // !房间内结束共享，切换成白板模式
    if (msgObj.event === RtsEvent.edubOnFinishShare) {
      console.log('结束共享');
      dispatch(stopShare(msgObj.data));
    }

    // !开始录制
    if (msgObj.event === RtsEvent.edubOnStartRecord) {
      dispatch(setRecordStatus(RecordStatus.Recording));
      Message.info('开始录制');
    }

    // !结束录制
    if (msgObj.event === RtsEvent.edubOnStopRecord) {
      const { reason } = msgObj.data;
      if (reason === StopRecordReason.TimeEnded) {
        Message.info('15分钟录制时长已到，已为你停止录制');
      }

      if (reason === StopRecordReason.HostStop) {
        Message.info('老师停止录制');
      }

      dispatch(setRecordStatus(RecordStatus.NotRecoading));
    }

    // !老师收到学生的连麦申请
    // 需要主动调用一下连麦列表
    if (msgObj.event === RtsEvent.edubOnLinkmicApplyUserListChange) {
      console.log('老师收到学生的连麦申请', isHost);
      if (!isHost) {
        return;
      }
      const linkList = await rtsApi.edubGetLinkmicApplyList();
      console.log('linkList', linkList);
      if (!isRtsError(linkList)) {
        dispatch(setLinkmicApplyList(linkList));
      }

      dispatch(setApplyLinkCount(msgObj.data.apply_user_count));
    }

    // !学生开始连麦
    if (msgObj.event === RtsEvent.edubOnLinkmicJoin) {
      dispatch(setLinkmicJoin(msgObj.data));
    }

    // !学生开始结束连麦
    if (msgObj.event === RtsEvent.edubOnLinkmicLeave) {
      dispatch(setLinkmicLeave(msgObj.data));
      dispatch(setLinkStatus(LinkStatus.NotLink));
    }

    // !申请共享(其实是白板权限)
    if (msgObj.event === RtsEvent.edubOnSharePermissionApply) {
      alert('申请共享... prd 只有老师主动授权');
    }
    // !获得白板权限
    if (msgObj.event === RtsEvent.edubOnSharePermissionPermit) {
      const { permit } = msgObj.data;

      if (permit === Permission.HasPermission) {
        Message.info('老师已邀请你操作白板');
      } else {
        Message.info('老师已关闭你的白板操作');
      }
      dispatch(setSharePermit(msgObj.data));
    }

    // !老师操作学生摄像头
    // 不需要学生同意
    if (msgObj.event === RtsEvent.edubOnOperateOtherCamera) {
      console.log('老师操作学生摄像头');
      const { operate_user_id: userId, operate } = msgObj.data;

      if (userId === room.localUser?.user_id) {
        if (operate === DeviceState.Open) {
          if (!devicePermissions.video) {
            Message.error('未获得摄像头权限!');
            return;
          }

          await RtcClient.startVideoCapture();
          RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeVideo);
          dispatch(localUserChangeCamera(DeviceState.Open));
          Message.info('老师打开了你的摄像头');

          await rtsApi.edubOperateSelfCamera({
            operate: DeviceState.Open,
          });
        }

        if (operate === DeviceState.Closed) {
          RtcClient.stopVideoCapture();
          RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeVideo);
          dispatch(localUserChangeCamera(DeviceState.Closed));
          Message.info('老师已关闭了你的摄像头');
          // 向房间内通知已经操作自己的摄像头
          rtsApi.edubOperateSelfCamera({
            operate,
          });
        }
      }
    }

    // !老师操作学生麦克风
    // 不需要学生同意
    if (msgObj.event === RtsEvent.edubOnOperateOtherMic) {
      console.log('老师操作学生麦克风');

      const { operate_user_id: usesId, operate } = msgObj.data;

      if (usesId === room.localUser?.user_id) {
        if (operate === DeviceState.Open) {
          if (!devicePermissions.audio) {
            Message.error('未获得麦克风权限!');
            return;
          }

          RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeAudio);
          dispatch(localUserChangeMic(DeviceState.Open));
          Message.info('老师打开了你的麦克风');

          await rtsApi.edubOperateSelfMic({
            operate: DeviceState.Open,
          });
        }

        if (operate === DeviceState.Closed) {
          //   RtcClient.unpublishStream(MediaType.AUDIO);
          RtcClient.room?.unpublishStream(MediaStreamType.kMediaStreamTypeAudio);
          dispatch(localUserChangeMic(DeviceState.Closed));
          Message.info('老师已将你设置静音');

          // 向房间内通知已经操作自己的麦克风
          rtsApi.edubOperateSelfMic({
            operate,
          });
        }
      }
    }

    // !允许连麦
    if (msgObj.event === RtsEvent.edubOnLinkmicPermit) {
      if (msgObj.data.permit === Permission.HasPermission) {
        Message.info('老师已同意你连麦！');
        dispatch(setLinkStatus(LinkStatus.Linking));

        if (!devicePermissions.audio) {
          Message.error('未获得麦克风权限!');
          return;
        }

        // RtcClient.publishStream(MediaType.AUDIO);
        RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeAudio);

        dispatch(localUserChangeMic(DeviceState.Open));

        await rtsApi.edubOperateSelfMic({
          operate: DeviceState.Open,
        });

        if (!devicePermissions.video) {
          Message.error('未获得摄像头权限!');
          return;
        }

        await RtcClient.startVideoCapture();
        RtcClient.room?.publishStream(MediaStreamType.kMediaStreamTypeVideo);

        dispatch(localUserChangeCamera(DeviceState.Open));

        await rtsApi.edubOperateSelfCamera({
          operate: DeviceState.Open,
        });
      } else {
        Message.info('老师已拒绝你连麦！');
        dispatch(setLinkStatus(LinkStatus.NotLink));
      }
    }

    // !拒绝连麦
    if (msgObj.event === RtsEvent.edubOnLinkmicKick) {
      Message.info('老师将你下麦！');
      dispatch(setLinkStatus(LinkStatus.NotLink));
      dispatch(
        setSharePermit({
          user_id: room.localUser.user_id!,
          permit: Permission.NoPermission,
        })
      );

      RtcClient.stopAudioCapture();
      dispatch(localUserChangeMic(DeviceState.Closed));

      await rtsApi.edubOperateSelfMic({
        operate: DeviceState.Closed,
      });

      RtcClient.stopVideoCapture();
      dispatch(localUserChangeCamera(DeviceState.Closed));
      // 向房间内通知已经操作自己的摄像头
      rtsApi.edubOperateSelfCamera({
        operate: DeviceState.Closed,
      });
    }
  };

  useEffect(() => {
    RtcClient.room?.on('onRoomMessageReceived', handleMessageReceived);
    RtcClient.engine?.on('onUserMessageReceivedOutsideRoom', handleMessageReceived);
    return () => {
      RtcClient.room?.off('onRoomMessageReceived', handleMessageReceived);
      RtcClient.engine?.off('onUserMessageReceivedOutsideRoom', handleMessageReceived);
    };
  }, [room.localUser]);
};

export default useRtsListeners;
