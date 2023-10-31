import { DeviceState } from '@/types/state';

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
