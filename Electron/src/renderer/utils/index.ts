import { v4 as uuidv4 } from 'uuid';
import sudo from 'sudo-prompt';
export interface UserInfo {
  created_at?: number;
  user_id?: string;
  user_name?: string;
  login_token?: string;
  device_id?: string;
}

// sudo cp -R <项目中驱动目录>/VeRTCVirtualSoundCard.driver /Library/Audio/Plug-Ins/HAL
// sudo launchctl kickstart -kp system/com.apple.audio.coreaudiod
export const installVirtualCard = async () => {
  const cardPath = window.veTools.getAppPath() + '/VeRTCVirtualSoundCard.driver';
  console.log(cardPath);
  const moveInstruction = `cp -R ${cardPath} /Library/Audio/Plug-Ins/HAL`;
  const laucnInstruction = 'launchctl kickstart -kp system/com.apple.audio.coreaudiod';
  const totalInstruction = `${moveInstruction} && ${laucnInstruction}`;
  try {
    console.log(moveInstruction);
    const res = await new Promise<string>((resolve) => {
      sudo.exec(totalInstruction, { name: 'Electron' }, function (error, stdout, stderr) {
        if (error) {
          resolve('failed');
        } else {
          resolve('success');
        }
      });
    });
    if (res === 'success') {
      console.log('安装虚拟声卡成功');
    } else {
      console.log('安装虚拟声卡失败');
    }
  } catch (err) {
    console.log('安装虚拟声卡发生错误');
  }
};

class Utils {
  private userInfo: UserInfo = {};

  constructor() {
    const userInfo: UserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userInfo = userInfo;
    this.init();
  }

  getUserInfo = (): UserInfo => {
    return this.userInfo;
  };

  setUserInfo = (userInfo: Partial<UserInfo>): void => {
    this.userInfo = {
      ...this.userInfo,
      ...userInfo,
    };
    localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  };

  removeUserInfo = (): void => {
    this.userInfo = {};
    this.init();
  };

  setUserName = (name: string) => {
    const userInfo = {
      ...this.userInfo,
      user_name: name,
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  getDeviceId = (): string | undefined => this.userInfo.device_id;

  setLoginToken = (token: string): void => {
    this.userInfo.login_token = token;
  };

  getLoginToken = (): string | undefined => this.userInfo.login_token;

  formatTime = (time: number): string => {
    if (time < 0) {
      return '00:00';
    }
    let minutes: number | string = Math.floor(time / 60);
    let seconds: number | string = time % 60;
    minutes = minutes > 9 ? `${minutes}` : `0${minutes}`;
    seconds = seconds > 9 ? `${seconds}` : `0${seconds}`;

    return `${minutes}:${seconds}`;
  };
  private init() {
    if (!this.userInfo.device_id) {
      const device_id = uuidv4();
      this.userInfo.device_id = device_id;
    }
    localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  }
}

export default new Utils();
