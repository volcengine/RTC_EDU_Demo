import { v4 as uuidv4 } from 'uuid';

export interface UserInfo {
  created_at?: number;
  user_id?: string;
  user_name?: string;
  login_token?: string;
  deviceId?: string;
}

class Utils {
  private userInfo: UserInfo = {};

  constructor() {
    const userInfo: UserInfo = JSON.parse(localStorage.getItem('meetingEduInfo') || '{}');
    this.userInfo = userInfo;
    this.init();
  }

  private init() {
    if (!this.userInfo.deviceId) {
      const deviceId = uuidv4();
      this.userInfo.deviceId = deviceId;
    }
    localStorage.setItem('meetingEduInfo', JSON.stringify(this.userInfo));
  }

  getUserInfo = (): UserInfo => {
    return this.userInfo;
  };

  setUserInfo = (userInfo: Partial<UserInfo>): void => {
    this.userInfo = {
      ...this.userInfo,
      ...userInfo,
    };
    localStorage.setItem('meetingEduInfo', JSON.stringify(this.userInfo));
  };

  removeUserInfo = (): void => {
    this.userInfo = {};
    this.init();
  };

  setUserName = (name: string): void => {
    this.userInfo = {
      ...this.userInfo,
      user_name: name,
    };
    localStorage.setItem('meetingEduInfo', JSON.stringify(this.userInfo));
  };

  getDeviceId = (): string | undefined => this.userInfo.deviceId;

  setLoginToken = (token: string): void => {
    this.userInfo = {
      ...this.userInfo,
      login_token: token,
    };
    this.setUserInfo(this.userInfo);
  };

  getLoginToken = (): string | undefined => this.userInfo.login_token;
}

export default new Utils();
