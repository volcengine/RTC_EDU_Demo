import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { StoreValue } from 'antd/lib/form/interface';
import SceneLogo from '@/assets/images/SceneLogo.png';
import * as Apis from '@/apis/login';
import { useDispatch } from '@/store';
import { login } from '@/store/slices/user';
import Footer from './Footer';
import styles from './index.module.less';

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

export default function () {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /**
   * 验证码登陆
   * 1. 校验验证码
   * 2. 校验成功后，拿返回到 login_token 并存储
   * 3. 跳转到进房页面
   * @returns
   */
  const handleLogin = async () => {
    // 验证校验码格式正确性
    const formValue = await form.validateFields();
    const res = await Apis.freeLoginApi({
      user_name: formValue.user_name,
    });
    if (res.code !== 200) {
      message.error(res.message);
      return;
    }
    dispatch(login(res.response));
    navigate(`/${location.search}`);
  };

  const validator = (
    value: StoreValue,
    errorTypeKey: 'userNameErrType',
    regRes: boolean
  ): Promise<void | Error> => {
    let result: Promise<Error | void>;
    if (!value) {
      const _value = value ? ERROR_TYPES.INVALID_CHARACTERS : ERROR_TYPES.EMPTY_STRING;
      result = Promise.reject(new Error(messages[errorTypeKey][_value]));
    } else {
      result = Promise.resolve();
    }
    return result;
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.mainWrapper}>
        <div className={styles.main}>
          <div className={styles.mainTitle}>
            <img width={400} src={SceneLogo} alt="logo" />
          </div>
          <Form form={form} onFinish={handleLogin} initialValues={{}}>
            <Form.Item
              name="user_name"
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
            </Form.Item>
            <Form.Item
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
                <a href="https://www.volcengine.com/docs/6348/128955" target="_blank" rel="noreferrer">
                  《用户协议》
                </a>
                和
                <a href="https://www.volcengine.com/docs/6348/68918" target="_blank" rel="noreferrer">
                  《隐私权政策》
                </a>
              </Checkbox>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) => prevValues.agree !== curValues.agree}
            >
              {({ getFieldValue }) => {
                return (
                  <Form.Item>
                    <Button
                      disabled={!getFieldValue('agree')}
                      htmlType="submit"
                      type="primary"
                      className={styles['login-check']}
                    >
                      登录
                    </Button>
                  </Form.Item>
                );
              }}
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
