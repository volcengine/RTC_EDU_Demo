import React, { useRef, useState } from 'react';
import styles from './index.less';
import { Form, Checkbox, Input, Button, message } from 'antd';
import titleLogo from '@assets/images/SceneLogo.png';
import Header from '@components/Header';
import { useDispatch, useSelector } from '@src/store';
import * as Apis from '@/renderer/api/index';
import { ipcRenderer } from 'electron';
import { ProcessEvent } from '@/types';
import Footer from './Footer';

const { Item } = Form;

enum ERROR_TYPES {
  VALID,
  EMPTY_STRING,
  INVALID_CHARACTERS,
}

const messages = {
  userNameErrType: {
    1: '请填写用户名',
    2: '用户名输入有误，请重新输入',
  },
};

interface FormProps {
  userName: string;
  agree: boolean;
}

const Login: React.FC<{}> = (props) => {
  const isOnline = useSelector((state) => state.messageType.netStatus);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // 登陆，验证验证码
  const onFinish = ({ userName, agree }: FormProps): void => {
    console.log('onFinish: ', userName, agree);
    Apis.passwordFreeLogin({
      user_name: userName,
    });
  };
  // 验证手机号码是否合规
  const validator = (
    value: any,
    errorTypeKey: 'userNameErrType',
    regRes: boolean
  ): Promise<void | Error> => {
    let result: Promise<Error | void>;
    if (!value || regRes) {
      const _value = value ? ERROR_TYPES.INVALID_CHARACTERS : ERROR_TYPES.EMPTY_STRING;
      result = Promise.reject(new Error(messages[errorTypeKey][_value]));
    } else {
      result = Promise.resolve();
    }
    return result;
  };

  return (
    <div className={styles.loginWrapper}>
      <Header isLoginPage={true} className={styles.loginHeader} />
      <div className={styles.main}>
        <div className={styles.mainTitle}>
          <img width={400} src={titleLogo} alt="logo" />
        </div>
        <Form form={form} onFinish={onFinish} initialValues={{}}>
          <Item
            name="userName"
            validateTrigger="onChange"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  const res = !/^[0-9a-zA-Z_\-@\u4e00-\u9fa5]*$/.test(value);
                  return validator(value, 'userNameErrType', res);
                },
              },
            ]}
          >
            <Input autoComplete="off" placeholder="输入用户名" className={styles['phone-input']} />
          </Item>
          <Item
            name="agree"
            valuePropName="checked"
            wrapperCol={{ span: 24 }}
            className={styles['login-agree']}
            rules={[
              {
                required: true,
                message: '请先阅读并同意',
              },
            ]}
          >
            <Checkbox>
              已阅读并同意
              <a
                rel="noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  ipcRenderer.send(
                    ProcessEvent.OpenWindow,
                    'https://www.volcengine.com/docs/6348/128955'
                  );
                }}
              >
                《用户协议》
              </a>
              和
              <a
                // href="https://www.volcengine.com/docs/6348/68918"
                // target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  ipcRenderer.send(
                    ProcessEvent.OpenWindow,
                    'https://www.volcengine.com/docs/6348/68918'
                  );
                }}
              >
                《隐私权政策》
              </a>
            </Checkbox>
          </Item>
          <Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.agree !== curValues.agree}
          >
            {({ getFieldValue }) => {
              return (
                <Item>
                  <Button
                    disabled={!getFieldValue('agree') || !isOnline}
                    htmlType="submit"
                    type="primary"
                    className={styles['login-check']}
                  >
                    登录
                  </Button>
                </Item>
              );
            }}
          </Item>
        </Form>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
