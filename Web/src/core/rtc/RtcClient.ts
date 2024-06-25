import VERTC, {
  VideoRenderMode,
  IRTCEngine,
  StreamIndex,
  RoomProfileType,
  MediaType,
  MirrorType,
  AudioProfileType,
  VideoEncoderConfig,
  UserMessageEvent,
  TrackCaptureConfig,
  ScreenEncoderConfig,
} from '@volcengine/rtc';
import RTCAIAnsExtension from '@volcengine/rtc/extension-ainr';
import { v4 as uuid } from 'uuid';

export const aiAnsExtension = new RTCAIAnsExtension();

interface EngineOptions {
  appId: string;
  uid: string;
  rtsUid: string;
  roomId?: string;
  rtmToken: string;
  serverUrl: string;
  serverSignature: string;
  deviceId: string;
  loginToken: string;
}

export class RtcClient {
  engine!: IRTCEngine;

  hasEngine: boolean = false;

  config!: EngineOptions;

  private _joined: boolean = false;

  private _joinedRTS: boolean = false;

  private _videoCaptureDevice?: string;

  private _audioCaptureDevice?: string;

  private _audioPlaybackDevice?: string;

  private _isLeavingRoom: boolean = false;

  private _videoCaptureConfig: TrackCaptureConfig = {
    width: 1280,
    height: 720,
    frameRate: 15,
  };

  private _videoEncoderConfig: VideoEncoderConfig = {
    width: 1280,
    height: 720,
    frameRate: 15,
    maxKbps: 1200,
  };

  private _screenEncoderConfig: ScreenEncoderConfig = {
    width: 1920,
    height: 1080,
    frameRate: 15,
    maxKbps: 3000,
    contentHint: 'text',
  };

  private _videoCaptured: boolean = false;

  private _audioCaptured: boolean = false;

  private _screenCaptured: boolean = false;

  aiAnsExtensionEnable: boolean = false;

  createEngine = async (props: EngineOptions) => {
    this.config = props;

    this.engine = VERTC.createEngine(this.config.appId);
    this.hasEngine = true;
    try {
      await this.engine.registerExtension(aiAnsExtension);
      aiAnsExtension.enable();
      this.aiAnsExtensionEnable = true;
    } catch (error) {
      console.log((error as any).message);
      this.aiAnsExtensionEnable = false;
    }
  };

  /**
   * 登录即时消息服务器，全局生效一次即可
   */
  joinWithRTS = async () => {
    await this.engine.login(this.config.rtmToken, this.config.rtsUid);
    await this.engine.setServerParams(this.config.serverSignature, this.config.serverUrl);
    this._joinedRTS = true;
  };

  leaveRTS = async () => {
    if (this._joinedRTS) {
      await this.engine.logout();
      this._joinedRTS = false;
    }
  };

  setRoomId = (roomId: string) => {
    this.config.roomId = roomId;
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
      const requestId = `${eventname}:${uuid()}`;
      const content = {
        app_id: this.config.appId,
        room_id: this.config.roomId,
        device_id: this.config.deviceId,
        user_id: this.config.rtsUid,
        login_token: this.config.loginToken,
        request_id: requestId,
        event_name: eventname,
        content: msgContent,
      };
      const callback = (e: UserMessageEvent) => {
        const { userId, message } = e;

        if (userId === 'server') {
          try {
            const res = JSON.parse(message as string);
            if (res.request_id === requestId) {
              this.engine.removeListener(VERTC.events.onUserMessageReceivedOutsideRoom, callback);
              resolve(res);
            }
          } catch (e) {
            reject(e);
          }
        }
      };

      this.engine.on(VERTC.events.onUserMessageReceivedOutsideRoom, callback);
      try {
        // console.log(`call RtcClient.sendServerMessage for ${eventname}: `, content);
        const sendMessagePromise = this.engine.sendServerMessage(JSON.stringify(content));
        sendMessagePromise.catch((e) => {
          console.log(`RtcClient.sendServerMessage for ${eventname} reject with error: `, e);
        });
      } catch (e) {
        console.log(`RtcClient.sendServerMessage for ${eventname} throw unexpected error: `, e);
      }
    });
  };

  joinRoom = (token: string | null, username: string): Promise<void> => {
    this.engine.enableAudioPropertiesReport({ interval: 2000 });
    this._joined = true;
    return this.engine.joinRoom(
      token,
      `${this.config.roomId!}`,
      {
        userId: this.config.uid!,
        extraInfo: JSON.stringify({
          user_name: username,
          user_id: this.config.uid,
        }),
      },
      {
        isAutoPublish: true,
        isAutoSubscribeAudio: true,
        isAutoSubscribeVideo: true,
        roomProfileType: RoomProfileType.meeting,
      }
    );
  };

  /**
   * rtc 退出房间,停止音频/视频/屏幕采集
   */
  leaveRoom = async () => {
    if (this._isLeavingRoom) {
      return;
    }
    this._isLeavingRoom = true;
    await this.stopAudioCapture();
    await this.stopVideoCapture();
    await this.stopScreenCapture();
    await this.engine.unpublishStream(MediaType.AUDIO_AND_VIDEO);

    if (this._joined) {
      await this.engine.leaveRoom();
      this._joined = false;
    }

    this.destroyEngine();
    this._isLeavingRoom = false;
  };

  checkPermission(): Promise<{
    video: boolean;
    audio: boolean;
  }> {
    return VERTC.enableDevices({
      video: true,
      audio: true,
    });
  }

  /**
   * get the devices
   * @returns
   */
  async getDevices(): Promise<{
    audioInputs: MediaDeviceInfo[];
    videoInputs: MediaDeviceInfo[];
    audioOutputs: MediaDeviceInfo[];
  }> {
    const permissions = await this.checkPermission();
    let audioInputs: MediaDeviceInfo[] = [];

    if (permissions.audio) {
      audioInputs = await VERTC.enumerateAudioCaptureDevices();
      audioInputs = audioInputs.filter((i) => i.deviceId);
    }

    let videoInputs: MediaDeviceInfo[] = [];
    if (permissions.video) {
      videoInputs = await VERTC.enumerateVideoCaptureDevices();
      videoInputs = videoInputs.filter((i) => i.deviceId);
    }

    let audioOutputs = await VERTC.enumerateAudioPlaybackDevices();
    audioOutputs = audioOutputs.filter((i) => i.deviceId);

    this._audioCaptureDevice = audioInputs.filter((i) => i.deviceId)?.[0]?.deviceId;
    this._videoCaptureDevice = videoInputs.filter((i) => i.deviceId)?.[0]?.deviceId;
    this._audioPlaybackDevice = audioOutputs.filter((i) => i.deviceId)?.[0]?.deviceId;

    return {
      audioInputs,
      videoInputs,
      audioOutputs,
    };
  }

  startAudioCapture = async (mic?: string) => {
    if (this._audioCaptured) {
      return;
    }

    this._audioCaptureDevice = mic || this._audioCaptureDevice;
    if (!this._audioCaptureDevice) {
      await this.getDevices();
    }

    this._audioCaptured = true;
    await this.engine.startAudioCapture(this._audioCaptureDevice);
  };

  stopAudioCapture = async () => {
    if (!this._audioCaptured) {
      return;
    }
    this._audioCaptured = false;
    await this.engine.stopAudioCapture();
  };

  startVideoCapture = async (camera?: string) => {
    if (this._videoCaptured) {
      return;
    }

    this._videoCaptured = true;
    this.setVideoConfig();

    this._videoCaptureDevice = camera || this._videoCaptureDevice;

    if (!this._videoCaptureDevice) {
      await this.getDevices();
    }

    await this.engine.startVideoCapture(this._videoCaptureDevice);
  };

  stopVideoCapture = async () => {
    if (!this._videoCaptured) {
      return;
    }

    this._videoCaptured = false;
    await this.engine.stopVideoCapture();
  };

  unmuteStream = async (mediaType: MediaType) => {
    if (mediaType === MediaType.VIDEO) {
      this.startVideoCapture();
    }
    if (mediaType === MediaType.AUDIO) {
      this.startAudioCapture();
    }
    this.engine.publishStream(mediaType);
  };

  muteStream = async (mediaType: MediaType) => {
    if (mediaType === MediaType.VIDEO) {
      this.stopVideoCapture();
    }
    if (mediaType === MediaType.AUDIO) {
      this.stopAudioCapture();
    }
    this.engine.unpublishStream(mediaType);
  };

  /**
   * 设置视频流播放器
   * @param userId
   * @param renderDom
   */
  setVideoPlayer = (userId: string, renderDom?: string | HTMLElement) => {
    // 本端用户
    if (userId === this.config?.uid) {
      this.engine.setLocalVideoPlayer(StreamIndex.STREAM_INDEX_MAIN, {
        renderDom,
        userId,
        renderMode: VideoRenderMode.RENDER_MODE_FIT,
      });
    }
    // 远端用户
    else {
      this.engine.setRemoteVideoPlayer(StreamIndex.STREAM_INDEX_MAIN, {
        renderDom,
        userId,
        renderMode: VideoRenderMode.RENDER_MODE_FIT,
      });
    }
  };

  /**
   * 设置分享流播放器
   * @param userId
   * @param renderDom
   */
  setScreenPlayer = (userId: string, renderDom?: string | HTMLElement) => {
    // 本端用户
    if (userId === this.config.uid) {
      this.engine.setLocalVideoPlayer(StreamIndex.STREAM_INDEX_SCREEN, {
        renderDom,
        userId,
        renderMode: VideoRenderMode.RENDER_MODE_FIT,
      });
    }
    // 远端用户
    else {
      this.engine.setRemoteVideoPlayer(StreamIndex.STREAM_INDEX_SCREEN, {
        renderDom,
        userId,
        renderMode: VideoRenderMode.RENDER_MODE_FIT,
      });
    }
  };

  /**
   * 订阅远端用户屏幕流
   * @param userId
   */
  subscribeScreen = async (userId: string): Promise<void> => {
    await this.engine.subscribeScreen(userId, MediaType.AUDIO_AND_VIDEO);
  };

  /**
   * 设置业务标识参数
   * @param businessId
   */
  setBusinessId = (businessId: string) => {
    this.engine.setBusinessId(businessId);
  };

  /**
   * 开始屏幕共享
   */
  startScreenCapture = async () => {
    try {
      await this.engine.startScreenCapture({
        enableAudio: true,
      });
      await this.engine.publishScreen(MediaType.AUDIO_AND_VIDEO);
      this._screenCaptured = true;
      return 'success';
    } catch (e: any) {
      this._screenCaptured = false;
      return e?.error?.message || e?.code || 'Screen Capture Failed';
    }
  };

  /**
   * 停止屏幕共享
   */
  stopScreenCapture = async () => {
    if (!this._screenCaptured) {
      return;
    }

    await this.engine.stopScreenCapture();
    if (this._joined) {
      await this.engine.unpublishScreen(MediaType.AUDIO_AND_VIDEO);
    }

    this._screenCaptured = false;
  };

  /**
   * 订阅
   */
  subscribeStream(userId: string, mediaType: MediaType) {
    if (this._joined) {
      return this.engine.subscribeStream(userId, mediaType);
    }
  }

  /**
   * 取消订阅
   */
  unsubscribeStream(userId: string, mediaType: MediaType) {
    if (this._joined) {
      return this.engine.unsubscribeStream(userId, mediaType);
    }
  }

  /**
   * 镜像模式
   * @param mirrorType
   */
  setMirrorType = (mirrorType: MirrorType) => {
    this.engine.setLocalVideoMirrorType(mirrorType);
  };

  /**
   * 设置音质档位
   */
  setAudioProfile = (profile: AudioProfileType) => this.engine.setAudioProfile(profile);

  /**
   * 设置画质
   * @param streamIndex
   * @param descriptions
   */
  setVideoConfig = async (
    captureConfig?: TrackCaptureConfig,
    encoderConfig?: VideoEncoderConfig
  ) => {
    this._videoCaptureConfig = captureConfig || this._videoCaptureConfig;
    this._videoEncoderConfig = encoderConfig || this._videoEncoderConfig;
    await this.engine.setVideoCaptureConfig(this._videoCaptureConfig);
    await this.engine.setVideoEncoderConfig(this._videoEncoderConfig);
  };

  setScreenConfig = async (description: ScreenEncoderConfig) => {
    this._screenEncoderConfig = description;
    await this.engine.setScreenEncoderConfig(this._screenEncoderConfig);
  };

  /**
   * 切换设备
   */
  switchDevice = (deviceType: 'camera' | 'microphone' | 'playback', deviceId: string) => {
    if (deviceType === 'microphone') {
      this._audioCaptureDevice = deviceId;
      this.engine.setAudioCaptureDevice(deviceId);
    } else if (deviceType === 'camera') {
      this._videoCaptureDevice = deviceId;
      this.engine.setVideoCaptureDevice(deviceId);
    } else {
      this._audioPlaybackDevice = deviceId;
      this.engine.setAudioPlaybackDevice(deviceId);
    }
  };

  destroyEngine = () => {
    if (this.hasEngine) {
      this.hasEngine = false;
      this._audioCaptureDevice = undefined;
      this._videoCaptureDevice = undefined;
      this._audioPlaybackDevice = undefined;
      this._videoCaptured = false;
      this._audioCaptured = false;
      this._screenCaptured = false;
      this._joined = false;
      this._joinedRTS = false;
      VERTC.destroyEngine(this.engine);
    }
  };
}

export default new RtcClient();
