import { useEffect, useState } from 'react';
import { Button, Form, Input, message, Radio, Tooltip } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreValue } from 'antd/lib/form/interface';

import { useDispatch, useSelector } from '@/store';
import CameraOn from '@/assets/images/CameraOn.svg';
import CameraOff from '@/assets/images/CameraOff.svg';
import MicrophoneOn from '@/assets/images/MicrophoneOn.svg';
import MicrophoneOff from '@/assets/images/MicrophoneOff.svg';
import JoinLoading from '@/assets/images/JoinLoading.svg';

import Setting from '@/assets/images/Setting.svg';

import IconButton from './IconButton';
import styles from './index.module.less';

import { RtcClient } from '@/core/rtc';
import { JoinStatus, SceneType, setJoining } from '@/store/slices/scene';
import { DeviceState, UserRole } from '@/types/state';
import Icon from '@/components/Icon';

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

const SceneTag = {
  [SceneType.Edub]: '大班课',
  [SceneType.Edus]: '小班课',
};

interface JoinParams {
  user_name: string;
  user_role?: UserRole | undefined;
  camera: DeviceState;
  mic: DeviceState;
}

let first = true;

interface IMenuProps {
  onDeviceDetectModal: () => void;
  scene: SceneType;
  beforeJoin?: (formValue: { name: string; roomId: string; user_role: UserRole }) => void;

  localUser: {
    mic: DeviceState;
    camera: DeviceState;
  };

  onChangeCamera?: (state: DeviceState) => void;
  onChangeMic?: (state: DeviceState) => void;
  onJoinRoom: (payload: JoinParams) => Promise<boolean>;
}

export default function (props: IMenuProps) {
  const {
    onDeviceDetectModal,
    scene,
    beforeJoin,
    localUser,
    onChangeCamera,
    onChangeMic,
    onJoinRoom,
  } = props;
  const [searchParams] = useSearchParams();
  const devicePermissions = useSelector((state) => state.device.devicePermissions);

  const user = useSelector((state) => state.user);
  const joinStatus = useSelector((state) => state.scene.joinStatus);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [roomIdErr, setRoomIdErr] = useState<ERROR_TYPES>(ERROR_TYPES.VALID);
  const [nameErr, setNameErr] = useState<ERROR_TYPES>(ERROR_TYPES.VALID);

  const validatorFields = (
    value: StoreValue,
    name: 'name' | 'roomId',
    isNotMatchRegEx: boolean
  ): Promise<any> => {
    let errorType = ERROR_TYPES.VALID;
    let result: Promise<Error | void> = Promise.resolve();

    if (!value || isNotMatchRegEx) {
      errorType = !value ? ERROR_TYPES.EMPTY_STRING : ERROR_TYPES.INVALID_CHARACTERS;
      result = Promise.reject(new Error(' '));
    } else if (value?.length > 18) {
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

  const renderToolTip = (errorType: ERROR_TYPES, text: '昵称' | '房间ID') => {
    if (errorType === ERROR_TYPES.INVALID_CHARACTERS) {
      return (
        <div className={styles.errTip}>
          {text === '房间ID'
            ? '请输入数字、英文字母或符号@_-'
            : '请输入中文、数字、英文字母或符号@_-'}

          {/* <div className={styles.errTipHeader}>非法输入，输入规则如下：</div>
          <div>1. 26个大写字母 A ~ Z </div>
          <div>2. 26个小写字母 a ~ z </div>
          <div>3. 10个数字 0 ~ 9 </div>
          {text === '用户名' && <div>中文</div>}
          {text === '房间ID' && (
            <div>4. 下划线&quot;_&quot;, at符&quot;@&quot;, 减号&quot;-&quot;</div>
          )} */}
        </div>
      );
    }

    if (errorType === ERROR_TYPES.EMPTY_STRING) {
      return `请输入${text}`;
    }
    return `${text}长度不能超过18位`;
  };

  const handleDeviceChange = async (type: 'mic' | 'camera', state: DeviceState) => {
    if (type === 'mic') {
      if (!devicePermissions.audio) {
        message.error('未获得麦克风权限!');
        return;
      }

      onChangeMic && onChangeMic(state);

      if (state === DeviceState.Open) {
        await RtcClient.startAudioCapture();
      } else if (state === DeviceState.Closed) {
        await RtcClient.stopAudioCapture();
      }
    } else if (type === 'camera') {
      if (!devicePermissions.video) {
        message.error('未获得摄像头权限!');
        return;
      }

      onChangeCamera && onChangeCamera(state);

      if (state === DeviceState.Open) {
        await RtcClient.startVideoCapture();
      } else if (state === DeviceState.Closed) {
        await RtcClient.stopVideoCapture();
      }
    }
  };

  const handleJoinRoom = async () => {
    const formValue: {
      name: string;
      roomId: string;
      user_role: UserRole;
    } = await form.validateFields();

    beforeJoin && beforeJoin(formValue);

    RtcClient.setRoomId(formValue.roomId);

    dispatch(setJoining(JoinStatus.Joinning));

    const payload: JoinParams = {
      user_name: formValue.name,
      camera: localUser.camera,
      mic: localUser.mic,
    };

    if (scene !== SceneType.Meeting) {
      payload.user_role = formValue.user_role;
    }

    const res = await onJoinRoom(payload);

    if (res) {
      let url = `/${scene}?roomId=${formValue.roomId}&username=${formValue.name}`;

      if (formValue.user_role !== undefined) {
        url = `${url}&role=${formValue.user_role}`;
      }
      navigate(url);
      dispatch(setJoining(JoinStatus.Joined));
    } else {
      dispatch(setJoining(JoinStatus.NotJoined));
    }
  };

  useEffect(() => {
    if (first) {
      message.info('*本产品仅用于功能体验，单次房间时长不超过30分钟');
    }
    first = false;
  }, []);

  useEffect(() => {
    if (user?.user_name) {
      form.setFieldValue('name', user?.user_name);
    }
  }, [user?.user_name]);

  return (
    <div
      className={styles.menuContainer}
      style={{
        height: scene === SceneType.Meeting ? 80 : 128,
      }}
    >
      <Form
        form={form}
        onFinish={handleJoinRoom}
        initialValues={{
          user_role: 1,
          name: searchParams.get('username') || user?.user_name,
          roomId: searchParams.get('roomId') || '',
        }}
      >
        {scene !== SceneType.Meeting && (
          <div className={styles.radioWrapper}>
            <Form.Item name="user_role">
              <Radio.Group>
                <Radio value={1}>我是老师</Radio>
                <Radio value={0}>我是学生</Radio>
              </Radio.Group>
            </Form.Item>

            <span className={styles[`${scene}Tag`]}>{SceneTag[scene]}</span>
          </div>
        )}
        <div className={styles.formInLine}>
          <Tooltip
            open={roomIdErr !== ERROR_TYPES.VALID}
            title={renderToolTip(roomIdErr, '房间ID')}
            placement="topLeft"
            overlayClassName={styles.validatorTip}
          >
            <Form.Item
              validateTrigger="onChange"
              name="roomId"
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    const isNotMatchRegEx = !/^[0-9a-zA-Z_\-@]*$/.test(value);
                    return validatorFields(value, 'roomId', isNotMatchRegEx);
                  },
                },
              ]}
            >
              <Input placeholder="请输入房间ID" allowClear />
            </Form.Item>
          </Tooltip>

          <Tooltip
            open={nameErr !== ERROR_TYPES.VALID}
            title={renderToolTip(nameErr, '昵称')}
            overlayClassName={styles.validatorTip}
            placement="topLeft"
          >
            <Form.Item
              name="name"
              validateTrigger="onChange"
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    const isNotMatchRegEx = !/^[0-9a-zA-Z_\-@\u4e00-\u9fa5]*$/.test(value);
                    return validatorFields(value, 'name', isNotMatchRegEx);
                  },
                },
              ]}
            >
              <Input placeholder="请输入昵称" allowClear />
            </Form.Item>
          </Tooltip>

          <Form.Item>
            <IconButton
              onClick={() => {
                handleDeviceChange(
                  'mic',
                  localUser.mic === DeviceState.Open ? DeviceState.Closed : DeviceState.Open
                );
              }}
              src={
                devicePermissions.audio && localUser.mic === DeviceState.Open
                  ? MicrophoneOn
                  : MicrophoneOff
              }
              iconClassName={
                devicePermissions.audio && localUser.mic === DeviceState.Open
                  ? styles.grayIcon
                  : styles.closeIcon
              }
            />
          </Form.Item>
          <Form.Item>
            <IconButton
              onClick={() => {
                handleDeviceChange(
                  'camera',
                  localUser.camera === DeviceState.Open ? DeviceState.Closed : DeviceState.Open
                );
              }}
              src={
                devicePermissions.video && localUser.camera === DeviceState.Open
                  ? CameraOn
                  : CameraOff
              }
              iconClassName={
                devicePermissions.video && localUser.camera === DeviceState.Open
                  ? styles.grayIcon
                  : styles.closeIcon
              }
            />
          </Form.Item>
          <Form.Item>
            <IconButton
              onClick={onDeviceDetectModal}
              src={Setting}
              iconClassName={styles.grayIcon}
            />
          </Form.Item>
          <Form.Item>
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
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
