import { useEffect, useState } from 'react';
import VERTC from '@volcengine/rtc';
import { Form, Input, message, Popover, Tooltip } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { StoreValue } from 'antd/lib/form/interface';
import Setting from '@/assets/images/Setting.svg';
import Logo from '@/assets/images/Logo.svg';
import LogoLight from '@/assets/images/LogoLight.png';
import { Theme } from '@/store/slices/ui';
import { useDispatch, useSelector } from '@/store';
import { DemoVersion, Disclaimer, ReversoContex, UserAgreement } from '@/config';
import { changeUserName, logout } from '@/store/slices/user';
import * as Apis from '@/apis/login';

import Icon from '../Icon';
import styles from './index.module.less';
import Toast from '../Toast';
import { BaseUser } from '@/types/state';

interface HeaderProps {
  children?: React.ReactNode;
  hide?: boolean;
  showVersion?: boolean;
  right?: React.ReactNode;
  room?: {
    localUser?: Partial<BaseUser>;
    room_id?: string;
  };
  /**
   * 退出登录
   * @returns
   */
  onLogout?: () => void;
  /**
   * 修改用户名
   */
  onChangeUserName?: (name: string) => void;
}

enum ERROR_TYPES {
  VALID = 'valid',
  EMPTY_STRING = 'empty',
  INVALID_CHARACTERS = 'invalid characters',
  TOO_LONG = 'too long',
}

export default function (props: HeaderProps) {
  const { children, hide, showVersion = true, right, onLogout, onChangeUserName, room } = props;
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const user = useSelector((state) => state.user);

  const [searchParams] = useSearchParams();
  const theme = useSelector((state) => state.ui.theme);
  const [form] = Form.useForm();

  const [nameErr, setNameErr] = useState<ERROR_TYPES>(ERROR_TYPES.VALID);
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();

  // 退出登录，
  // 1. 场景选择页
  // 2. 进房页
  const handleLogout = async () => {
    dispatch(logout());
    onLogout && onLogout();
    window.open('https://bytedance.larkoffice.com/share/base/form/shrcn238aNIfy3vjlN9GQ46eR0f', '_blank', 'noopener, noreferrer');
  };

  const handleChangeUserName = async () => {
    const name = form.getFieldValue('name');
    if (nameErr !== ERROR_TYPES.VALID) {
      return;
    }
    const res = await Apis.changeUserName({
      login_token: user!.login_token!,
      user_name: name,
    });

    if (res.code === 200) {
      dispatch(changeUserName(name));

      onChangeUserName && onChangeUserName(name);
    } else {
      form.setFieldValue('name', user?.user_name || '');

      message.error('修改用户名失败');
    }

    setModalOpen(false);
  };

  const validatorFields = (value: StoreValue, isNotMatchRegEx: boolean): Promise<any> => {
    let errorType = ERROR_TYPES.VALID;
    let result: Promise<Error | void> = Promise.resolve();

    if (!value || isNotMatchRegEx) {
      errorType = !value ? ERROR_TYPES.EMPTY_STRING : ERROR_TYPES.INVALID_CHARACTERS;
      result = Promise.reject(new Error(' '));
    } else if (value?.length > 18) {
      errorType = ERROR_TYPES.TOO_LONG;
      result = Promise.reject(new Error(' '));
    }

    setNameErr(errorType);

    return result;
  };

  const renderToolTip = (errorType: ERROR_TYPES, text: string) => {
    if (errorType === ERROR_TYPES.INVALID_CHARACTERS) {
      return (
        <div className={styles.errTip}>
          请输入中文、数字、英文字母或符号@_-
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

    if (errorType === ERROR_TYPES.VALID) {
      return null;
    }

    return `${text}长度不能超过18位`;
  };

  useEffect(() => {
    if (!modalOpen) {
      form.setFieldValue('name', user?.user_name);
      form.validateFields();
    }
  }, [modalOpen]);

  return (
    <>
      <header
        className={styles.header}
        style={{
          display: hide ? 'none' : 'flex',
        }}
      >
        <div className={styles['header-logo']}>
          {theme === Theme.dark ? <Icon src={Logo} /> : <img src={LogoLight} alt="logo" />}
        </div>

        {children}

        <div className={styles['header-right']}>
          {showVersion && (
            <span className={styles.version}>
              Demo版本 v{DemoVersion}/ SDK版本 v{VERTC.getSdkVersion()}
            </span>
          )}
          {(room?.localUser?.user_name || user?.user_name) &&
            searchParams.get('visibility') !== 'false' && (
              <div className={styles.avatar}>
                <span className={styles.avatarIcon}>
                  {(user?.user_name || room?.localUser?.user_name)?.[0]}
                </span>
                <span className={styles.userName}>
                  {user?.user_name || room?.localUser?.user_name}
                </span>
              </div>
            )}

          {right && right}

          {!right && !room?.room_id && (
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
                      setPopoverOpen(false);
                      setModalOpen(true);
                    }}
                  >
                    用户名
                  </li>
                  <li
                    onClick={() => {
                      setPopoverOpen(false);
                      window.open(Disclaimer, '_blank');
                    }}
                  >
                    免责声明
                  </li>
                  <li
                    onClick={() => {
                      setPopoverOpen(false);
                      window.open(ReversoContex, '_blank');
                    }}
                  >
                    隐私政策
                  </li>
                  <li
                    onClick={() => {
                      setPopoverOpen(false);
                      window.open(UserAgreement, '_blank');
                    }}
                  >
                    用户协议
                  </li>

                  <li
                    onClick={() => {
                      setPopoverOpen(false);
                      handleLogout();
                    }}
                  >
                    退出登录
                  </li>
                </ul>
              }
            >
              <button className={styles['header-setting-btn']}>
                <Icon src={Setting} />
                <span>设置</span>
              </button>
            </Popover>
          )}
        </div>
      </header>

      <Toast open={modalOpen} title="修改用户名" width={320}>
        <Form
          form={form}
          initialValues={{
            name: user?.user_name,
          }}
        >
          {modalOpen && (
            <Tooltip
              open={modalOpen && nameErr !== ERROR_TYPES.VALID}
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
                      return validatorFields(value, isNotMatchRegEx);
                    },
                  },
                ]}
              >
                <Input placeholder="请输入昵称" allowClear />
              </Form.Item>
            </Tooltip>
          )}
        </Form>

        <button className={styles.confirmBtn} onClick={handleChangeUserName}>
          确定
        </button>

        <button
          className={styles.canceLBtn}
          onClick={() => {
            setNameErr(ERROR_TYPES.VALID);
            setTimeout(() => {
              setModalOpen(false);
            });
          }}
        >
          取消
        </button>
      </Toast>
    </>
  );
}
