import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Popover } from 'antd';
import { ipcRenderer, remote } from 'electron';
import { Button, Input, Tooltip, Form } from 'antd';
import Setting from '@assets/images/SettingDark.svg';
import WhiteLogo from '@assets/images/WhiteLogo.png';
import BlackLogo from '@assets/images/BlackLogo.png';
import Maximum from './win/Maximum.svg';
import Minimum from './win/Minimum.svg';
import Close from './win/Close.svg';
import Icon from '../Icon';
import Recording from '@assets/images/Recording.svg';

import { Theme } from '@src/store/slices/ui';
import Toast from '@components/Toast/index';
import { DemoVersion } from '@/renderer/config';
import * as Api from '@src/api';
import { ProcessEvent } from '@/types';
import { useDispatch, useSelector } from '@/renderer/store';
import { changeUserName } from '@/renderer/store/slices/user';
import useLogout from '@/renderer/core/hooks/useLogout';

import styles from './index.less';

interface HeaderProps {
  roomId?: string;
  className?: string;
  time?: string;
  isLoginPage?: boolean;
  isRecording?: boolean;
  recordingTime?: string;
  onLeaveRoom?: () => void;
  right?: React.ReactNode;
}

enum ERROR_TYPES {
  VALID = 'valid',
  EMPTY_STRING = 'empty',
  INVALID_CHARACTERS = 'invalid characters',
  TOO_LONG = 'too long',
}
const { Item } = Form;
const footerWindowId = remote.getGlobal('shareWindowId').footerWindowId;
const memberWindowId = remote.getGlobal('shareWindowId').memberWindowId;
const settingWindowId = remote.getGlobal('shareWindowId').settingWindowId;
const attendeeWindowId = remote.getGlobal('shareWindowId').attendeeWindowId;
// const hostWindowId = remote.getGlobal('shareWindowId').hostWindowId;
const screenWindowId = remote.getGlobal('shareWindowId').screenWindowId;
const hostRecordRecieveWindowId = remote.getGlobal('shareWindowId').hostRecordRecieveWindowId;
const hostRecordComfirmwindowId = remote.getGlobal('shareWindowId').hostRecordComfirmwindowId;

const Header: React.FC<HeaderProps> = (props) => {
  const {
    roomId,
    time,
    isLoginPage = false,
    className,
    isRecording = false,
    onLeaveRoom,
    right,
  } = props;
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [isShowAlertName, setIsShowAlertName] = useState(false);
  const userLoginInfo = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.ui);
  const [form] = Form.useForm();
  const [nameErr, setNameErr] = useState<ERROR_TYPES>(ERROR_TYPES.VALID);

  const dispatch = useDispatch();
  const handleLogout = useLogout({
    onLeaveRoom,
  });
  // 校验用户名
  const validatorFields = (values: any, regRes: boolean): Promise<any> => {
    const value = form.getFieldValue('name');
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
    setNameErr(errorType);

    return result;
  };

  const renderToolTip = (errorType: ERROR_TYPES) => {
    if (errorType === ERROR_TYPES.INVALID_CHARACTERS) {
      return '请输入中文、数字、英文字母或符号@_-';
    }
    if (errorType === ERROR_TYPES.EMPTY_STRING) {
      return '请输入昵称';
    }
    return '昵称长度不能超过18位';
  };

  useEffect(() => {
    if (!isShowAlertName) {
      setNameErr(ERROR_TYPES.VALID);
    }
  }, [isShowAlertName]);

  // 修改用户名
  const handleChangeUserName = (values: any) => {
    const name = form.getFieldValue('name');
    Api.changeUserName({
      login_token: userLoginInfo.login_token || '',
      user_name: name,
    });
    dispatch(changeUserName(name));
    setIsShowAlertName(false);
  };

  const handleCloseWindow = () => {
    ipcRenderer.send(ProcessEvent.CloseWindow);
  };

  const handleMinsizeWindow = () => {
    ipcRenderer.send(ProcessEvent.MinsizeWindow);
  };

  const handleFullWindow = () => {
    ipcRenderer.send(ProcessEvent.FullScreenWindow);
  };
  return (
    <div className={className}>
      <div className={styles.dragArea} id="dragArea" />
      <header className={styles.header} id="header">
        <div className={styles['header-left']}>
          {process.platform === 'darwin' && (
            <div className={styles.operate} id="operate">
              <div className={styles.red} onClick={handleCloseWindow} />
              <div className={styles.yellow} onClick={handleMinsizeWindow} />
              <div className={styles.green} onClick={handleFullWindow} />
            </div>
          )}
          {!isLoginPage && (
            <div className={styles['header-logo']}>
              <img src={theme === Theme.dark ? WhiteLogo : BlackLogo} />
            </div>
          )}
          {!isLoginPage && !roomId && (
            <div className={styles.versionInfo}>
              Demo版本V{DemoVersion}/SDK版本v{window.VERTCVideo.getSDKVersion()}
            </div>
          )}
        </div>
        {roomId && (
          <div className={styles.roomInfo}>
            <span className={styles.roomId}>房间ID: {roomId}</span>
            <span className={styles.sperature} />
            <span className={styles.time}>{time}</span>
            {isRecording && (
              <>
                <span className={styles.sperature} />
                <div className={styles.recordIcon}>
                  <Icon className={styles.icon} src={Recording} />
                  录制中
                </div>
                {/* <span className={styles.time}>{recordingTime}</span> */}
              </>
            )}
          </div>
        )}

        <div className={styles['header-right']}>
          {right && right}
          {!isLoginPage && !roomId && (
            <div className={styles.user}>
              <span className={styles.avatar}>{userLoginInfo?.user_name?.[0]}</span>
              <span className={styles.userName}>{userLoginInfo.user_name} </span>
            </div>
          )}
          {!isLoginPage && !roomId && (
            <Popover
              trigger="click"
              title={null}
              open={popoverOpen}
              overlayClassName={styles['header-pop']}
              onOpenChange={setPopoverOpen}
              content={
                <ul>
                  <li
                    onClick={() => {
                      setIsShowAlertName(true);
                    }}
                  >
                    用户名
                  </li>
                  <li
                    onClick={() => {
                      setPopoverOpen(false);
                      ipcRenderer.send(
                        ProcessEvent.OpenWindow,
                        'https://www.volcengine.com/docs/6348/68916'
                      );
                    }}
                  >
                    免责声明
                  </li>
                  <li
                    onClick={() => {
                      setPopoverOpen(false);
                      ipcRenderer.send(
                        ProcessEvent.OpenWindow,
                        'https://www.volcengine.com/docs/6348/68918'
                      );
                    }}
                  >
                    隐私政策
                  </li>
                  <li
                    onClick={() => {
                      setPopoverOpen(false);
                      ipcRenderer.send(
                        ProcessEvent.OpenWindow,
                        'https://www.volcengine.com/docs/6348/128955'
                      );
                    }}
                  >
                    用户协议
                  </li>
                  <li onClick={handleLogout}>退出登录</li>
                </ul>
              }
            >
              <div className={styles['header-setting-btn']}>
                <Icon src={Setting} />
                <span>设置</span>
              </div>
            </Popover>
          )}
          {process.platform === 'win32' && (
            <div className={styles.operate}>
              <div className={styles.operateBtn} onClick={handleMinsizeWindow}>
                <Icon className={styles.icon} src={Minimum} />
              </div>
              <div className={styles.operateBtn} onClick={handleFullWindow}>
                <Icon className={styles.icon} src={Maximum} />
              </div>
              <div className={styles.operateBtn} onClick={handleCloseWindow}>
                <Icon className={styles.icon} src={Close} />
              </div>
            </div>
          )}
        </div>
      </header>

      <Toast isShow={isShowAlertName} message="修改用户名">
        <Form
          onFinish={handleChangeUserName}
          form={form}
          initialValues={{
            name: userLoginInfo?.user_name,
          }}
        >
          {isShowAlertName && (
            <Tooltip
              destroyTooltipOnHide={true}
              open={isShowAlertName && nameErr !== ERROR_TYPES.VALID}
              title={renderToolTip(nameErr)}
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
                      const regRes = !/^[0-9a-zA-Z_\-@\u4e00-\u9fa5]*$/.test(value);
                      return validatorFields(value, regRes);
                    },
                  },
                ]}
              >
                <Input placeholder="请输入昵称" allowClear />
              </Form.Item>
            </Tooltip>
          )}
          <Form.Item>
            <Button htmlType="submit" type="primary">
              确定
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              onClick={() => {
                // form.setFieldValue('name', userLoginInfo?.user_name || '');
                form.resetFields();
                setNameErr(ERROR_TYPES.VALID);
                setTimeout(() => {
                  setIsShowAlertName(false);
                });
              }}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Toast>
    </div>
  );
};

export default Header;
