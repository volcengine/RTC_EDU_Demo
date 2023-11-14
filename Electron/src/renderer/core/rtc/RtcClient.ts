import { veRTCVideo } from '@volcengine/vertc-electron-sdk';
import { Device } from '../../store/modules/devices';
import RTCRoom from '@volcengine/vertc-electron-sdk/js/main/room';
import { v4 as uuidv4 } from 'uuid';
import {
  RenderMode,
  ScreenCaptureParameters,
  ScreenCaptureSourceInfo,
} from '@volcengine/vertc-electron-sdk/js/types';

/**
 * 加入RTC参数
 */
interface EngineOptions {
  appId: string;
  uid: string;
  room_id?: string;
  rtsUid: string;
  device_id: string;
  loginToken: string;
  logPath: string;
  params: string;
  rtmToken: string;
  serverUrl: string;
  serverSignature: string;
}

export class RtcClient {
  engine?: veRTCVideo;
  config!: EngineOptions;
  room?: RTCRoom;
  private _joined: boolean = false;

  private _joinedRTS: boolean = false;

  private _videoCaptured: boolean = false;

  private _screenCaptured: boolean = false;

  /**
   * 创建唯一的RTC引擎
   * @param props
   * @returns
   */
  createEngine = (props: EngineOptions): veRTCVideo => {
    console.log('createEngine', props);
    this.config = props;
    const rtcVideo: veRTCVideo = new window.VERTCVideo() as any;
    this.engine = rtcVideo;
    this.engine.createRTCVideo(this.config.appId, this.config.params);
    // 设置采集设备跟随系统为false，否则改变采集设备和播放不会生效
    this.engine.followSystemCaptureDevice(false);
    this.engine.followSystemPlaybackDevice(false);
    return this.engine;
  };

  setRoomId = (room_id: string) => {
    this.config.room_id = room_id;
  };

  /**
   * 销毁RTC引擎
   */
  destroyEngine = () => {
    if (!this.engine) {
      return;
    }
    this.removeEventListener();
    this.removeDeviceListener();
    this.engine?.destroyRTCVideo();
    this.engine = undefined;
    console.log('销毁RTC引擎');
  };

  /**
   * 获取RTC引擎
   * @returns
   */
  getEngine = () => {
    return this.engine;
  };

  /**
   * 登录RTS服务
   * @returns
   */
  joinWithRTS = () => {
    console.log('joinWithRTS');
    this.engine?.login(this.config.rtmToken, this.config.rtsUid);
    this.engine?.setServerParams(this.config.serverSignature, this.config.serverUrl);
    this._joinedRTS = true;
  };

  leaveRTS = async () => {
    if (this._joinedRTS && this.engine) {
      await this.engine?.logout();
      this._joinedRTS = false;
    }
  };

  sendServerMessage = async <T>(
    eventname: string,
    msgContent: string
  ): Promise<{
    message_type: 'return';
    request_id: string;
    code: number; // 200表示成功
    message: string; // 详细错误信息
    timestamp: number; // 时间戳ms
    response: T;
  }> => {
    return new Promise((resolve, reject) => {
      const requestId = `${eventname}:${uuidv4()}`;

      const content = {
        app_id: this.config.appId,
        room_id: this.config.room_id,
        user_id: this.config.rtsUid,
        login_token: this.config.loginToken,
        device_id: this.config.device_id,
        event_name: eventname,
        request_id: requestId,
        content: msgContent,
      };

      const callback = (userId: string, message: string) => {
        console.log('rtcclient  sendServerMessage', userId, message);

        if (userId === 'server') {
          try {
            const res = JSON.parse(message as string);
            if (res.request_id === requestId) {
              console.log(eventname, res);
              this.engine?.removeListener('onUserMessageReceivedOutsideRoom', callback);
              resolve(res);
            }
          } catch (e) {
            reject(e);
          }
        }
      };

      this.engine?.on('onUserMessageReceivedOutsideRoom', callback);
      this.engine?.sendServerMessage(JSON.stringify(content));
    });
  };

  getDevices = () => {
    const tempVideoCaptureDevices = this.engine?.enumerateVideoCaptureDevices() as Device[];

    const curCamera = this.engine?.getVideoCaptureDevice() || '';

    const tempAudipCaptureDevices = this.engine?.enumerateAudioCaptureDevices() as Device[];
    const curMic = this.engine?.getAudioCaptureDevice() || '';

    const tempAudipPlaybackDevices = this.engine?.enumerateAudioPlaybackDevices() as Device[];

    const audioPlaybackDeviceId = this.engine?.getAudioPlaybackDevice() || '';

    return {
      curCamera,
      curMic,
      curPlayback: audioPlaybackDeviceId,
      videoInputs: tempVideoCaptureDevices.filter((i) => i.device_id),
      audioInputs: tempAudipCaptureDevices.filter((i) => i.device_id),
      audioOutputs: tempAudipPlaybackDevices.filter((i) => i.device_id),
    };
  };
  /**
   * 监听RTC回调事件
   * @param handlers
   * @returns
   */
  addEventListener = (handlers: {
    onLoginResult: (uid: string, error_code: number, elapsed: number) => void;
    onLogout: () => void;
    onLocalAudioPropertiesReport: (info: any) => void;
    onRemoteAudioPropertiesReport: (info: any) => void;
    onActiveSpeaker: (room_id: string, userId: string) => void;
  }) => {
    this.engine?.on('onLoginResult', handlers.onLoginResult);
    this.engine?.on('onLogout', handlers.onLogout);
    this.engine?.on('onLocalAudioPropertiesReport', handlers.onLocalAudioPropertiesReport);
    this.engine?.on('onRemoteAudioPropertiesReport', handlers.onRemoteAudioPropertiesReport);
    this.engine?.on('onActiveSpeaker', handlers.onActiveSpeaker);
  };

  /**
   * 取消监听RTC回调事件
   * @returns
   */
  removeEventListener = () => {
    this.engine?.removeAllListeners('onLoginResult');
    this.engine?.removeAllListeners('onLogout');
    this.engine?.removeAllListeners('onLocalAudioPropertiesReport');
    this.engine?.removeAllListeners('onRemoteAudioPropertiesReport');
    this.engine?.removeAllListeners('onActiveSpeaker');

    this.engine?.enableAudioPropertiesReport(-1, false, false);
  };

  /**
   * 监听本地音频和视频设备回调事件
   * @param handlers
   * @returns
   */
  addDeviceListener = (handlers: {
    onVideoDeviceStateChanged: (
      device_id: string,
      device_type: number,
      device_state: number,
      device_error: number
    ) => void;
  }) => {
    this.engine?.on('onVideoDeviceStateChanged', handlers.onVideoDeviceStateChanged);
  };

  /**
   * 取消监听本地音频和视频设备回调事件
   */
  removeDeviceListener = () => {
    this.engine?.removeAllListeners('onVideoDeviceStateChanged');
    this.engine?.removeAllListeners('onAudioDeviceStateChanged');
  };

  /**
   * 获取视频采集设备列表
   * @returns
   */
  getVideoCaptureDevices = () => {
    const devices = this.engine?.enumerateVideoCaptureDevices() as Device[];
    console.log('getVideoCaptureDevices', devices);
    return devices;
  };

  /**
   * 切换视频采集设备
   * @param device_id
   */
  setVideoCaptureDevice = (device_id: string) => {
    console.log('setVideoCaptureDevice', device_id);
    this.engine?.setVideoCaptureDevice(device_id);
  };

  /**
   * 获取音频采集设备列表
   * @returns
   */
  getAudioCaptureDevices = () => {
    const devices = this.engine?.enumerateAudioCaptureDevices() as Device[];
    console.log('getAudioCaptureDevices', devices);
    return devices;
  };

  /**
   * 切换音频采集设备
   * @param device_id
   */
  setAudioCaptureDevice = (device_id: string) => {
    console.log('setAudioCaptureDevice', device_id);
    this.engine?.setAudioCaptureDevice(device_id);
  };

  /**
   * 获取音频播放设备列表
   * @returns
   */
  getAudioPlaybackDevices = () => {
    const devices = this.engine?.enumerateAudioPlaybackDevices() as Device[];
    console.log('getAudioPlaybackDevices', devices);
    return devices;
  };

  /**
   * 切换音频播放设备
   * @param device_id
   */
  setAudioPlaybackDevice = (device_id: string) => {
    console.log('setAudioPlaybackDevice', device_id);
    this.engine?.setAudioPlaybackDevice(device_id);
  };

  /**
   * 开始视频采集
   */
  startVideoCapture = () => {
    console.log('startVideoCapture', this.engine);

    if (this.engine && !this._videoCaptured) {
      console.log('startVideoCapture', this.engine);
      this.engine?.setScreenVideoEncoderConfig(
        {
          width: 1280,
          height: 720,
          frameRate: 15,
          maxBitrate: -1,
          encoderPreference: 0,
        },
      );
      this.engine?.setVideoCaptureConfig({
        width: 1280,
        height: 720,
        frameRate: 15,
        capturePreference: 2,
      });
      this.engine?.startVideoCapture();
      this._videoCaptured = true;
    }
  };

  /**
   * 关闭视频采集
   */
  stopVideoCapture = () => {
    if (!this._videoCaptured) {
      return;
    }

    console.log('stopVideoCapture');
    this.engine?.stopVideoCapture();
    this._videoCaptured = false;
  };

  /**
   * 开始视音频采集
   */
  startAudioCapture = () => {
    console.log('startAudioCapture', this.engine);
    this.engine?.startAudioCapture();
  };

  stopAudioCapture = () => {
    console.log('stopAudioCapture');

    this.engine?.stopAudioCapture();
  };

  startScreenAudioCapture = (device_id?: string) => {
    this.engine?.startScreenAudioCapture(device_id);
  };
  stopScreenAudioCapture = () => {
    this.engine?.stopScreenAudioCapture();
  };
  startScreenVideoCapture = (info: ScreenCaptureSourceInfo, params: ScreenCaptureParameters) => {
    this.engine?.startScreenVideoCapture(info, params);
  };
  stopScreenVideoCapture = () => {
    this.engine?.stopScreenVideoCapture();
  };

  /**
   * 加入room
   * @param info
   */
  joinRoom = (token: string) => {
    this.engine?.enableAudioPropertiesReport(2000, false, false);

    this.room = this.engine?.createRTCRoom(this.config.room_id!);

    let roomConfig = {
      room_profile_type: 1,
      is_auto_publish: true,
      is_auto_subscribe_audio: true,
      is_auto_subscribe_video: true,
      remote_video_config: {
        framerate: 0,
        resolution_height: 0,
        resolution_width: 0,
      },
    };
    this.room?.joinRoom(token, { uid: this.config.uid, extra_info: '' }, roomConfig);
    this._joined = true;
  };

  /** {en}
   * @brief
   */

  /** {zh}
   * @brief rtc 退出房间,停止音频/视频/屏幕采集
   */
  leaveRoom = () => {
    this.stopAudioCapture();
    this.stopVideoCapture();
    this.stopScreenAudioCapture();
    this.stopScreenVideoCapture();

    if (this._joined) {
      this.room?.leaveRoom();
      this._joined = false;
    }
  };

  /**
   * 设置视频流播放器
   * @param userId
   * @param renderDom
   */
  setVideoPlayer = (userId: string, renderDom: HTMLDivElement) => {
    // 本端用户
    if (userId === this.config?.uid || userId === '') {
      this.engine?.setupLocalVideo(renderDom, this.config.room_id || '', {
        renderMode: RenderMode.FIT,
        mirror: true,
      });
    }
    // 远端用户
    else {
      this.engine?.setupRemoteVideo(userId, this.config.room_id!, renderDom, {
        renderMode: RenderMode.FIT,
        mirror: false,
      });
    }
  };

  removeVideoPlayer = (userId: string) => {
    // 本端用户
    if (userId === this.config?.uid || userId === '') {
      this.engine?.removeLocalVideo(this.config.room_id || '');
    }
    // 远端用户
    else {
      this.engine?.removeRemoteVideo(userId, this.config.room_id!);
    }
  };

  /**
   * 获取room实例
   * @returns
   */
  getRoom = () => {
    return this.room;
  };
}

export default new RtcClient();
