/**
 * 弹窗提示组件
 */
import React, { useEffect, useMemo, useState } from 'react';
import Toast from '@src/components/Toast';
import { Button, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
  MessageType,
  removeAllMicList,
  removeAllRecordList,
  removeAllShareList,
  removeFromMicList,
  removeFromShareList,
  resetMessage,
  setTimeout,
  updateMessage,
} from '@src/store/modules/publicMessage';
import styles from './index.less';
import { removeAllUserInRtcRoom } from '@src/store/modules/rtcRoom';
import { ApplyType, DeviceState, Permission } from '@/renderer/types/state';
import {
  localUserChangeCamera,
  localUserChangeMic,
  localUserLeaveRoom,
  remoteUserChangeMic,
  reviewRemoteApply,
  setSharePermit,
} from '@/renderer/store/slices/edusRoom';
import { useDispatch, useSelector } from '@/renderer/store';
import * as rtsApi from './apis';
import { setUserListDrawOpen } from '@/renderer/store/slices/ui';

const InformToast: React.FC<{}> = () => {
  const ui = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const handleUserList = () => {
    dispatch(setUserListDrawOpen(!ui.userListDrawOpen));
  };

  return (
    <>
      <AttendeeToast />
      <AttenddeApplyMic setIsShowMemberList={handleUserList} />
      <AttenddeApplyRecord />
      <AttenddeApplyShare setIsShowMemberList={handleUserList} />
      <MuteAllToast />
      <HostComfirmRecord />
      <TimeoutToast />
    </>
  );
};
type CBNAME =
  | 'empty'
  | 'handleReqOpenMic'
  | 'handleReqOpenShare'
  | 'handleComfirmOpenMic'
  | 'handleConfirmOpenCamera';

// 学生申请开麦、申请共享、回应老师打开摄像头和麦克风操作
const AttendeeToast: React.FC<{}> = () => {
  const [showMessage, setShowMessage] = useState('');
  const [isShowToast, setIsShowToast] = useState(false);
  const [btnText, setBtnText] = useState('确认');
  const [cbName, setCbName] = useState<CBNAME>('empty');
  const messageInfo = useSelector((state) => state.messageType);
  const dispatch = useDispatch();
  const { message: curMessage } = messageInfo;

  useEffect(() => {
    if (curMessage === MessageType.REQUEST_OPEN_MIC) {
      setIsShowToast(true);
      setCbName('handleReqOpenMic');
      setBtnText('申请发言');
      setShowMessage('无法自行打开麦克风，请向老师申请发言');
    }
    if (curMessage === MessageType.REQUEST_OPEN_SHARE) {
      setIsShowToast(true);
      setCbName('handleReqOpenShare');
      setBtnText('申请共享权限');
      setShowMessage('无法共享，请向老师申请共享权限');
    }
    if (curMessage === MessageType.RECIVE_HOST_REQUEST_OPEN_MIC) {
      setIsShowToast(true);
      setCbName('handleComfirmOpenMic');
      setBtnText('确认');
      setShowMessage('老师请求打开你的麦克风');
    }
    if (curMessage === MessageType.RECIVE_HOST_REQUEST_OPEN_CAMERA) {
      setIsShowToast(true);
      setCbName('handleConfirmOpenCamera');
      setBtnText('确认');
      setShowMessage('老师请求打开你的摄像头');
    }
    if (curMessage === MessageType.EMPTY) {
      setIsShowToast(false);
    }
  }, [curMessage]);
  const onClickConfirm = {
    empty: () => {},
    handleReqOpenMic: () => {
      rtsApi.operateSelfMicApply({
        operate: DeviceState.Open,
      });

      dispatch(updateMessage(MessageType.EMPTY));
    },
    handleReqOpenShare: () => {
      rtsApi.sharePermissionApply();
      dispatch(updateMessage(MessageType.EMPTY));
    },
    handleComfirmOpenMic: () => {
      // 1. 更改mic
      console.log('响应老师打开麦克风');
      dispatch(localUserChangeMic(DeviceState.Open));
      dispatch(updateMessage(MessageType.EMPTY));
    },
    handleConfirmOpenCamera: () => {
      console.log('响应老师打开摄像头');
      // 1. 更改camera
      dispatch(localUserChangeCamera(DeviceState.Open));
      dispatch(updateMessage(MessageType.EMPTY));
    },
  };

  return (
    <Toast isShow={isShowToast} message={showMessage}>
      <div>
        <Button type="primary" onClick={onClickConfirm[cbName]}>
          {btnText}
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            dispatch(updateMessage(MessageType.EMPTY));
          }}
        >
          取消
        </Button>
      </div>
    </Toast>
  );
};

// 收到学生要求开麦
const AttenddeApplyMic: React.FC<{
  setIsShowMemberList?: (show: boolean) => void;
}> = (props) => {
  const { setIsShowMemberList } = props;
  const { reqOpenMicList } = useSelector((state) => state.messageType);
  const dispatch = useDispatch();

  const content = useMemo(() => {
    if (reqOpenMicList.length === 0) {
      return {};
    }
    const { userId, userName } = reqOpenMicList[0];
    if (reqOpenMicList.length === 1) {
      return {
        comfirmText: '同意',
        rejectText: '拒绝',
        title: `${userName}正在申请发言`,
        handleComfirm: () => {
          // 调用rts接口

          rtsApi.operateSelfMicPermit({
            apply_user_id: userId,
            permit: Permission.HasPermission,
          });

          // 更新用户权限状态
          dispatch(remoteUserChangeMic({ user_id: userId, operate: DeviceState.Open }));
          // 取消标记学生

          dispatch(
            reviewRemoteApply({
              userId: userId,
              applying: ApplyType.Mic,
            })
          );

          dispatch(removeFromMicList(userId));
        },
        handleReject: () => {
          rtsApi.operateSelfMicPermit({
            apply_user_id: userId,
            permit: Permission.NoPermission,
          });

          // 取消标记学生
          dispatch(
            reviewRemoteApply({
              userId: userId,
              applying: ApplyType.Mic,
            })
          );
          dispatch(removeFromMicList(userId));
        },
      };
    } else if (reqOpenMicList.length > 1) {
      return {
        comfirmText: '查看详情',
        rejectText: '取消',
        title: `${reqOpenMicList.length}位用户正在申请发言`,
        handleComfirm: () => {
          dispatch(removeAllMicList());
          setIsShowMemberList && setIsShowMemberList(true);
        },
        handleReject: () => {
          dispatch(removeAllMicList());
        },
      };
    }
  }, [reqOpenMicList]);
  return (
    <Toast isShow={reqOpenMicList.length > 0} message={content?.title || ''}>
      <div>
        <Button type="primary" onClick={content?.handleComfirm}>
          {content?.comfirmText}
        </Button>
      </div>
      <div>
        <Button onClick={content?.handleReject}>{content?.rejectText}</Button>
      </div>
    </Toast>
  );
};
// 收到学生要求共享权限
const AttenddeApplyShare: React.FC<{
  setIsShowMemberList?: (show: boolean) => void;
}> = (props) => {
  const { setIsShowMemberList } = props;
  const { reqOpenShareList } = useSelector((state) => state.messageType);
  const dispatch = useDispatch();

  const content = useMemo(() => {
    if (reqOpenShareList.length === 0) {
      return {};
    }
    const { userId, userName } = reqOpenShareList[0];
    if (reqOpenShareList.length === 1) {
      return {
        comfirmText: '同意',
        rejectText: '拒绝',
        title: `${userName}正在申请共享权限`,
        handleComfirm: () => {
          // 调用rts接口

          rtsApi.sharePermissionPermit({
            apply_user_id: userId,
            permit: Permission.HasPermission,
          });

          dispatch(setSharePermit({ userId, permit: Permission.HasPermission, isLocal: false }));
          // 取消标记学生
          dispatch(
            reviewRemoteApply({
              userId: userId,
              applying: ApplyType.Screen,
            })
          );
          dispatch(removeFromShareList(userId));
        },
        handleReject: () => {
          rtsApi.sharePermissionPermit({
            apply_user_id: userId,
            permit: Permission.NoPermission,
          });

          dispatch(
            reviewRemoteApply({
              userId: userId,
              applying: ApplyType.Screen,
            })
          );
          dispatch(removeFromShareList(userId));
        },
      };
    } else if (reqOpenShareList.length > 1) {
      return {
        comfirmText: '查看详情',
        rejectText: '取消',
        title: `${reqOpenShareList.length}位用户正在申请共享权限`,
        handleComfirm: () => {
          dispatch(removeAllShareList());
          setIsShowMemberList && setIsShowMemberList(true);
        },
        handleReject: () => {
          dispatch(removeAllShareList());
        },
      };
    }
  }, [reqOpenShareList]);
  return (
    <Toast isShow={reqOpenShareList.length > 0} message={content?.title || ''}>
      <div>
        <Button type="primary" onClick={content?.handleComfirm}>
          {content?.comfirmText}
        </Button>
      </div>
      <div>
        <Button onClick={content?.handleReject}>{content?.rejectText}</Button>
      </div>
    </Toast>
  );
};

// 收到学生要求打开录制
const AttenddeApplyRecord: React.FC<{}> = () => {
  const { reqOpenRecordList } = useSelector((state) => state.messageType);
  const dispatch = useDispatch();

  const content = useMemo(() => {
    if (reqOpenRecordList.length === 0) {
      return {};
    }
    const { userName } = reqOpenRecordList[0];
    if (reqOpenRecordList.length === 1) {
      return {
        comfirmText: '同意',
        rejectText: '拒绝',
        title: `${userName}正在申请打开录制`,
        handleComfirm: () => {
          // 调用rts接口

          rtsApi.startRecord();
          // todo 需要发送拒绝吗
          dispatch(removeAllRecordList());
        },
        handleReject: () => {
          dispatch(removeAllRecordList());
        },
      };
    } else if (reqOpenRecordList.length > 1) {
      return {
        comfirmText: '同意',
        rejectText: '拒绝',
        title: `${reqOpenRecordList.length}位用户正在申请打开录制`,
        handleComfirm: () => {
          // 调用rts接口
          rtsApi.startRecord();
          //   reqOpenRecordList.forEach((item) => {
          //     handleRTS(RTSEventName.vcStartRecordPermit, {
          //       permit: Permission.HasPermission,
          //       apply_user_id: item.userId,
          //     });
          //   });
          dispatch(removeAllRecordList());
        },
        handleReject: () => {
          //   reqOpenRecordList.forEach((item) => {
          //     handleRTS(RTSEventName.vcStartRecordPermit, {
          //       permit: Permission.HasPermission,
          //       apply_user_id: item.userId,
          //     });
          //   });
          dispatch(removeAllRecordList());
        },
      };
    }
  }, [reqOpenRecordList]);
  return (
    <Toast isShow={reqOpenRecordList.length > 0} message={content?.title || ''}>
      <div>
        <Button type="primary" onClick={content?.handleComfirm}>
          {content?.comfirmText}
        </Button>
      </div>
      <div>
        <Button onClick={content?.handleReject}>{content?.rejectText}</Button>
      </div>
    </Toast>
  );
};

// 老师确认打开/关闭录制
const HostComfirmRecord: React.FC<{}> = () => {
  const { message } = useSelector((state) => state.messageType);
  const dispatch = useDispatch();

  const content = useMemo(() => {
    if (message === MessageType.HOST_START_RECORD) {
      return {
        title: '会议录制',
        btnText: '开始录制',
        text: '录制功能仅做体验，本产品仅用于功能体验， 单次录制不超过15分钟，录制文件保留时间为1周。',
        handleComfirm: () => {
          rtsApi.startRecord();
          dispatch(updateMessage(MessageType.EMPTY));
        },
      };
    } else if (message === MessageType.HOST_STOP_RECORD) {
      return {
        title: '确定要停止录制',
        btnText: '停止录制',
        text: '',
        handleComfirm: () => {
          rtsApi.stopRecord();

          dispatch(updateMessage(MessageType.EMPTY));
        },
      };
    }
  }, [message]);
  return (
    <Toast
      isShow={message === MessageType.HOST_START_RECORD || message === MessageType.HOST_STOP_RECORD}
      message={content?.title || ''}
    >
      {content?.text && (
        <div className={styles.text}>
          <span className={styles.symbol}>*</span>
          <span>{content.text}</span>
        </div>
      )}
      <div>
        <Button type="primary" onClick={content?.handleComfirm}>
          {content?.btnText}
        </Button>
      </div>
      <div>
        <Button
          onClick={() => {
            dispatch(updateMessage(MessageType.EMPTY));
          }}
        >
          取消
        </Button>
      </div>
    </Toast>
  );
};

// 老师开启全体静音
const MuteAllToast: React.FC<{}> = () => {
  const [isShowToast, setIsShowToast] = useState(false);
  const [operateSelfMic, setOperateSelfMic] = useState(1);
  const dispatch = useDispatch();
  const { message: curMessage } = useSelector((state) => state.messageType);

  const onChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      console.log('允许自己开启');
      setOperateSelfMic(1);
    } else {
      console.log('不允许自己开启');
      setOperateSelfMic(0);
    }
  };

  useEffect(() => {
    if (curMessage === MessageType.HOST_MUTE_ALL) {
      setIsShowToast(true);
    }
  }, [curMessage]);
  const handleMuteAll = () => {
    // 调用rts接口
    rtsApi.vcOperateAllMic({
      operate: DeviceState.Closed,
      operate_self_mic_permission: operateSelfMic,
    });

    setIsShowToast(false);
    dispatch(updateMessage(MessageType.EMPTY));
  };
  return (
    <Toast isShow={isShowToast} message="将全体以及新参会的人静音">
      <div>
        <Checkbox checked={operateSelfMic === 1} onChange={onChange}>
          学生自己打开麦克风
        </Checkbox>
        <div>
          <Button type="primary" onClick={handleMuteAll}>
            全体静音
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              setIsShowToast(false);
              dispatch(updateMessage(MessageType.EMPTY));
            }}
          >
            取消
          </Button>
        </div>
      </div>
    </Toast>
  );
};

const TimeoutToast = () => {
  const isTimeout = useSelector((state) => state.messageType.isTimeout);
  const dispatch = useDispatch();
  // 体验时间到了,发送信令
  const onClickTimeout = () => {
    dispatch(setTimeout(false));

    dispatch(localUserLeaveRoom());
    dispatch(resetMessage());
    dispatch(removeAllUserInRtcRoom());
  };
  return (
    <Toast isShow={isTimeout} message="体验时间已经到了">
      <div className={styles.text}>
        <span>本产品仅用于功能体验，单次房间时长不超过30分钟 </span>
      </div>
      <Button onClick={onClickTimeout} type="primary">
        确定
      </Button>
    </Toast>
  );
};

export default InformToast;
