import VERTC, { MediaType, UserMessageEvent } from '@volcengine/rtc';
import { useEffect } from 'react';
import { message as Message } from 'antd';
import { RtcClient } from '@/core/rtc';
import * as rtsApi from '@/scene/Edub/apis/rtsApi';

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
} from '@/store/slices/edubRoom';
import useLeaveRoom from '@/core/hooks/useLeaveRoom';
import { RootState, useDispatch, useSelector } from '@/store';
import { isRtsError } from '@/utils/rtsUtils';
import { FinishRoomReason, StopRecordReason } from '@/types/rtsTypes';
import { DeviceState, Permission, RecordStatus, UserRole } from '@/types/state';

let room: RootState['edubRoom'];

const useRtcListeners = () => {
  const dispatch = useDispatch();

  room = useSelector((state) => state.edubRoom);

  const devicePermissions = useSelector((state) => state.device.devicePermissions);
  const leaveRoom = useLeaveRoom('/', {
    onLeaveRoom: () => dispatch(localUserLeaveRoom()),
  });

  const linkmicLeave = async ()=> {
    dispatch(setLinkStatus(LinkStatus.NotLink));
      dispatch(
        setSharePermit({
          user_id: room.localUser.user_id!,
          permit: Permission.NoPermission,
        })
      );

      RtcClient.stopAudioCapture();
      dispatch(localUserChangeMic(DeviceState.Closed));

      await rtsApi.operateSelfMic({
        operate: DeviceState.Closed,
      });

      RtcClient.stopVideoCapture();
      dispatch(localUserChangeCamera(DeviceState.Closed));
      // 向房间内通知已经操作自己的摄像头
      rtsApi.operateSelfCamera({
        operate: DeviceState.Closed,
      });
  };

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
    if (msgObj.event === RtsEvent.edubOnJoinRoom) {
      console.log('进房');
      dispatch(remoteUserJoinRoom(msgObj.data));
    }

    // 退房
    if (msgObj.event === RtsEvent.edubOnLeaveRoom) {
      console.log('退房');
      dispatch(remoteUserLeaveRoom(msgObj.data));
    }

    // 结束大班课
    // 1. 老师调用后触发, 通知房间里其他人 -> 老师自己主动调用离房
    // 2. 其他原因，所有人都收到
    if (msgObj.event === RtsEvent.edubOnFinishRoom) {
      console.log('结束大班课');
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
    // 用户操作自己的摄像头
    if (msgObj.event === RtsEvent.edubOnOperateSelfCamera) {
      const operateStr = msgObj.data.operate === DeviceState.Open ? '打开' : '关闭';
      if (room.localUser.user_id === msgObj.data.user_id) {
        console.log(`本地用户${operateStr}摄像头`);
      } else {
        console.log(`远端用户 ${msgObj.data.user_id} ${operateStr}摄像头`);
      }
      dispatch(remoteUserChangeCamera(msgObj.data));
    }

    // 用户操作自己的麦克风
    if (msgObj.event === RtsEvent.edubOnOperateSelfMic) {
      const operateStr = msgObj.data.operate === DeviceState.Open ? '打开' : '关闭';
      if (room.localUser.user_id === msgObj.data.user_id) {
        console.log(`本地用户${operateStr}麦克风`);
      } else {
        console.log(`远端用户 ${msgObj.data.user_id} ${operateStr }麦克风`);
      }
      dispatch(remoteUserChangeMic(msgObj.data));
    }

    // 开始共享，推屏幕流
    if (msgObj.event === RtsEvent.edubOnStartShare) {
      console.log('开始分享');
      dispatch(startShare(msgObj.data));
    }
    // 房间内结束共享，切换成白板模式
    if (msgObj.event === RtsEvent.edubOnFinishShare) {
      console.log('结束共享');
      dispatch(stopShare(msgObj.data));
    }

    // 开始录制
    if (msgObj.event === RtsEvent.edubOnStartRecord) {
      dispatch(setRecordStatus(RecordStatus.Recording));
      Message.info('开始录制');
    }

    // 结束录制
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

    // 老师收到学生的连麦申请
    // 需要主动调用一下连麦列表
    if (msgObj.event === RtsEvent.edubOnLinkmicApplyUserListChange) {
      if (!isHost) {
        return;
      }
      const linkList = await rtsApi.getLinkmicApplyList();
      if (!isRtsError(linkList)) {
        dispatch(setLinkmicApplyList(linkList));
      }

      dispatch(setApplyLinkCount(msgObj.data.apply_user_count));
    }

    // 学生开始连麦
    if (msgObj.event === RtsEvent.edubOnLinkmicJoin) {
      dispatch(setLinkmicJoin(msgObj.data));
    }

    // 学生开始结束连麦
    if (msgObj.event === RtsEvent.edubOnLinkmicLeave) {
      dispatch(setLinkmicLeave(msgObj.data));
      const { user } = msgObj.data;

      if (user?.user_id === room.localUser?.user_id) {
        linkmicLeave();
      }
    }

    // 申请共享(其实是白板权限)
    if (msgObj.event === RtsEvent.edubOnSharePermissionApply) {
      alert('申请共享... prd 只有老师主动授权');
    }
    // 获得白板权限
    if (msgObj.event === RtsEvent.edubOnSharePermissionPermit) {
      console.log('获得白板权限');

      const { permit } = msgObj.data;

      if (permit === Permission.HasPermission) {
        Message.info('老师已授予学生白板权限');
      } else {
        Message.info('老师已关闭学生白板权限');
      }

      dispatch(setSharePermit(msgObj.data));
    }

    // 老师操作学生摄像头
    // 不需要学生同意
    if (msgObj.event === RtsEvent.edubOnOperateOtherCamera) {
      const { operate_user_id: userId, operate } = msgObj.data;

      if (userId === room.localUser?.user_id) {
        if (operate === DeviceState.Open) {
          if (!devicePermissions.video) {
            Message.error('未获得摄像头权限!');
            return;
          }

          await RtcClient.startVideoCapture();
          dispatch(localUserChangeCamera(DeviceState.Open));
          Message.info('老师打开了你的摄像头');
          await rtsApi.operateSelfCamera({
            operate: DeviceState.Open,
          });
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

    // 老师操作学生麦克风
    // 不需要学生同意
    if (msgObj.event === RtsEvent.edubOnOperateOtherMic) {
      const { operate_user_id: usesId, operate } = msgObj.data;

      if (usesId === room.localUser?.user_id) {
        if (operate === DeviceState.Open) {
          if (!devicePermissions.audio) {
            Message.error('未获得麦克风权限!');
            return;
          }

          RtcClient.unmuteStream(MediaType.AUDIO);
          dispatch(localUserChangeMic(DeviceState.Open));
          Message.info('老师打开了你的麦克风');
          console.log('老师打开了你的麦克风');
          await rtsApi.operateSelfMic({
            operate: DeviceState.Open,
          });
        }

        if (operate === DeviceState.Closed) {
          RtcClient.muteStream(MediaType.AUDIO);
          dispatch(localUserChangeMic(DeviceState.Closed));
          Message.info('老师已将你设置静音');
          console.log('老师关闭你的麦克风');
          // 向房间内通知已经操作自己的麦克风
          rtsApi.operateSelfMic({
            operate,
          });
        }
      }
    }

    // 允许连麦
    if (msgObj.event === RtsEvent.edubOnLinkmicPermit) {
      if (msgObj.data.permit === Permission.HasPermission) {
        Message.info('老师已同意你连麦！');
        dispatch(setLinkStatus(LinkStatus.Linking));

        if (!devicePermissions.audio) {
          Message.error('未获得麦克风权限!');
          return;
        }

        RtcClient.unmuteStream(MediaType.AUDIO);
        dispatch(localUserChangeMic(DeviceState.Open));
        await rtsApi.operateSelfMic({
          operate: DeviceState.Open,
        });

        if (!devicePermissions.video) {
          Message.error('未获得摄像头权限!');
          return;
        }

        await RtcClient.startVideoCapture();
        dispatch(localUserChangeCamera(DeviceState.Open));

        await rtsApi.operateSelfCamera({
          operate: DeviceState.Open,
        });
      } else {
        Message.info('老师已拒绝你连麦！');
        dispatch(setLinkStatus(LinkStatus.NotLink));
      }
    }

    // 拒绝连麦
    if (msgObj.event === RtsEvent.edubOnLinkmicKick) {
      Message.info('老师将你下麦！');
      linkmicLeave();
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
