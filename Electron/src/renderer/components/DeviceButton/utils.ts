import MicroPhoneDark from '@assets/images/MicroPhoneDark.svg';
import MicroPhoneOff from '@assets/images/MicrophoneOff.svg';
import CameraDark from '@assets/images/CameraDark.svg';
import CameraOff from '@assets/images/CameraOff.svg';
import { DeviceState } from '@/renderer/types/state';
export enum DeviceType {
  Camera = 'camera',
  Microphone = 'microphone',
}

export const getDeviceStatus = (
  deviceType: DeviceType,
  user: {
    camera: DeviceState;
    mic: DeviceState;
  } | null
): DeviceState => {
  if (user === null) {
    return DeviceState.Open;
  }

  if (deviceType === DeviceType.Camera) {
    return user.camera!;
  }

  return user.mic!;
};

const IconMap = {
  cameraOn: CameraDark,
  cameraOff: CameraOff,
  microphoneOn: MicroPhoneDark,
  microphoneOff: MicroPhoneOff,
  //   soundOn: SoundOn,
  //   realtime: RealTimeData,
  //   setting: Setting,
  //   share: Share,
  //   shareOff: ShareOff,
  //   recordOn: RecordOn,
  //   recordOff: RecordOff,
  //   stop: Stop,
  //   close: Close,
};

export const getIcon = (type: string, status = ''): string =>
  IconMap[`${type}${status}` as keyof typeof IconMap];
