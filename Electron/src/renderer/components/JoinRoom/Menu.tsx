import React, { useEffect, useState } from 'react';
import { Form, Radio, Input, Button, message as Message, Tooltip } from 'antd';
import styles from './index.less';
import IconButton from './IconButton';
import CameraOn from '@assets/images/CameraOn.svg';
import CameraOff from '@assets/images/CameraOff.svg';
import MicrophoneOn from '@assets/images/MicrophoneOn.svg';
import MicrophoneOff from '@assets/images/MicrophoneOff.svg';
import Setting from '@assets/images/Setting.svg';
import { DeviceState, UserRole } from '@src/types/state';
import { useDispatch, useSelector } from '@src/store';
import { RtcClient } from '@src/core/rtc';

import { JoinStatus, SceneType, setJoining } from '@/renderer/store/slices/scene';
import JoinLoading from '@assets/images/JoinLoading.svg';

import Icon from '../Icon';

const { Item } = Form;

enum ERROR_TYPES {
  VALID = 'valid',
  EMPTY_STRING = 'empty',
  INVALID_CHARACTERS = 'invalid characters',
  TOO_LONG = 'too long',
}
export interface LoginState {
  nameErrType: ERROR_TYPES;
  roomIdErrType: ERROR_TYPES;
}

export interface JoinParams {
  user_name: string;
  user_role?: UserRole | undefined;
  camera: DeviceState;
  mic: DeviceState;
}

const SceneTag = {
  [SceneType.Edub]: '大班课',
  [SceneType.Edus]: '小班课',
};

interface IMenuProps {
  scene: SceneType;
  beforeJoin?: (formValue: JoinParams) => void;

  localUser: {
    mic: DeviceState;
    camera: DeviceState;
  };

  onChangeCamera?: (state: DeviceState) => void;
  onChangeMic?: (state: DeviceState) => void;
  onJoinRoom: (payload: JoinParams) => Promise<boolean>;
  onClickSetting: () => void;
  videoRef: React.MutableRefObject<HTMLDivElement | null>;
}

const Menu: React.FC<IMenuProps> = (props) => {
  const {
    onClickSetting,
    videoRef,
    scene,
    beforeJoin,
    localUser,
    onChangeCamera,
    onChangeMic,
    onJoinRoom,
  } = props;
  const [roomIdErr, setRoomIdErr] = useState<ERROR_TYPES>(ERROR_TYPES.VALID);
  const [nameErr, setNameErr] = useState<ERROR_TYPES>(ERROR_TYPES.VALID);
  const userLoginInfo = useSelector((state) => state.user);
  const { devicePermissions } = useSelector((state) => state.device);
  const joinStatus = useSelector((state) => state.scene.joinStatus);

  const audioCaptureAuthority = devicePermissions.audio;
  const videoCaptureAuthority = devicePermissions.video;

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  //   const handleLogout = useLogout({});

  // 进入房间
  const onEnterRoom = async (values: any) => {
    const { userName, roomId, userRole } = values;
    RtcClient.setRoomId(roomId);
    dispatch(setJoining(JoinStatus.Joinning));

    const params: JoinParams = {
      user_name: userName,
      camera: localUser.camera,
      mic: localUser.mic,
    };

    if (scene !== SceneType.Meeting) {
      params.user_role = userRole;
    }

    beforeJoin && beforeJoin(params);

    const res = await onJoinRoom(params);

    if (res) {
      dispatch(setJoining(JoinStatus.Joined));
    } else {
      dispatch(setJoining(JoinStatus.NotJoined));
    }
  };
  // 开闭麦
  const onClickMicrophone = () => {
    if (audioCaptureAuthority === true) {
      if (localUser.mic === DeviceState.Open) {
        RtcClient?.stopAudioCapture();
      } else {
        RtcClient?.startAudioCapture();
      }

      onChangeMic &&
        onChangeMic(localUser.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open);
    } else {
      if (process.platform === 'win32') {
        Message.error('麦克风权限已关闭，请至设备设置页开启，开启后重新启动应用');
      } else {
        Message.error('麦克风权限已关闭，请至设备设置页开启');
      }
    }
  };
  // 开闭摄像头
  const onClickCamera = () => {
    if (videoCaptureAuthority === false) {
      if (process.platform === 'win32') {
        Message.error('摄像头权限已关闭，请至设备设置页开启，然后重新启动应用');
      } else {
        Message.error('摄像头权限已关闭，请至设备设置页开启');
      }
      return;
    }
    if (localUser.camera === DeviceState.Open) {
      RtcClient?.removeVideoPlayer(userLoginInfo.user_id!);
      RtcClient?.stopVideoCapture();
    } else {
      RtcClient?.startVideoCapture();
      videoRef.current && RtcClient?.setVideoPlayer(userLoginInfo.user_id!, videoRef.current);
    }

    onChangeCamera &&
      onChangeCamera(localUser.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open);
  };
  // 校验房间id和用户名
  const validatorFields = (value: any, name: 'name' | 'roomId', regRes: boolean): Promise<any> => {
    let errorType = ERROR_TYPES.VALID;
    let result: Promise<Error | void> = Promise.resolve();

    if (!value || regRes) {
      errorType = !value ? ERROR_TYPES.EMPTY_STRING : ERROR_TYPES.INVALID_CHARACTERS;
      result = Promise.reject(new Error(' '));
    }

    if (value?.length > 18) {
      errorType = ERROR_TYPES.TOO_LONG;
      result = Promise.reject(new Error(' '));
    }

    if (name === 'roomId') {
      setRoomIdErr(errorType);
    } else if (name === 'name') {
      setNameErr(errorType);
    }

    return result;
  };
  const renderToolTip = (errorType: ERROR_TYPES, isUserName: boolean) => {
    if (errorType === ERROR_TYPES.INVALID_CHARACTERS) {
      return isUserName ? '请输入中文、数字、英文字母或符号@_-' : '请输入数字、英文字母或符号@_-';
    }
    if (errorType === ERROR_TYPES.EMPTY_STRING) {
      return isUserName ? '请输入昵称' : '请输入房间ID';
    }
    return isUserName ? '昵称长度不能超过18位' : '房间ID长度不能超过18位';
  };

  useEffect(() => {
    if (userLoginInfo.user_name) {
      form.setFieldValue('userName', userLoginInfo.user_name);
      setNameErr(ERROR_TYPES.VALID);
    }
  }, [userLoginInfo.user_name]);

  return (
    <div
      className={styles.menuContainer}
      style={{
        height: scene === SceneType.Meeting ? 80 : 128,
      }}
    >
      <Form
        onFinish={onEnterRoom}
        initialValues={{
          userRole: 1,
          userName: userLoginInfo.user_name,
        }}
        form={form}
      >
        {scene !== SceneType.Meeting && (
          <div className={styles.radioWrapper}>
            <Item name="userRole">
              <Radio.Group>
                <Radio value={1}>我是老师</Radio>
                <Radio value={0}>我是学生</Radio>
              </Radio.Group>
            </Item>
            <span className={styles[`${scene}Tag`]}>{SceneTag[scene]}</span>
          </div>
        )}
        <div className={styles.formInLine}>
          <Tooltip
            open={roomIdErr !== ERROR_TYPES.VALID}
            title={renderToolTip(roomIdErr, false)}
            placement="topLeft"
            overlayClassName={styles.validatorTip}
          >
            <Item
              name="roomId"
              validateTrigger="onChange"
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    const regRes = !/^[0-9a-zA-Z_\-@]*$/.test(value);
                    return validatorFields(value, 'roomId', regRes);
                  },
                },
              ]}
            >
              <Input placeholder="请输入房间ID" />
            </Item>
          </Tooltip>
          <Tooltip
            open={nameErr !== ERROR_TYPES.VALID}
            title={renderToolTip(nameErr, true)}
            overlayClassName={styles.validatorTip}
            placement="topLeft"
          >
            <Item
              name="userName"
              validateTrigger="onChange"
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    const regRes = !/^[0-9a-zA-Z_\-@\u4e00-\u9fa5]*$/.test(value);
                    return validatorFields(value, 'name', regRes);
                  },
                },
              ]}
            >
              <Input placeholder="请输入昵称" />
            </Item>
          </Tooltip>
          <Item>
            <IconButton
              onClick={onClickMicrophone}
              src={localUser.mic === DeviceState.Open ? MicrophoneOn : MicrophoneOff}
              iconClassName={
                localUser.mic === DeviceState.Open ? styles.grayIcon : styles.closeIcon
              }
            />
          </Item>
          <Item>
            <IconButton
              onClick={onClickCamera}
              src={localUser.camera === DeviceState.Open ? CameraOn : CameraOff}
              iconClassName={
                localUser.camera === DeviceState.Open ? styles.grayIcon : styles.closeIcon
              }
            />
          </Item>
          <Item>
            <IconButton onClick={onClickSetting} src={Setting} iconClassName={styles.grayIcon} />
          </Item>
          <Item>
            <Button
              htmlType="submit"
              type="primary"
              className={`${styles['login-check']} ${
                joinStatus === JoinStatus.Joinning ? styles.loading : ''
              }`}
            >
              {joinStatus === JoinStatus.Joinning && (
                <Icon src={JoinLoading} className={styles.loadingIcon} />
              )}
              进入房间
            </Button>
          </Item>
        </div>
      </Form>
    </div>
  );
};

export default Menu;
