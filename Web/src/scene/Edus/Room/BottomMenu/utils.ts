import { BaseUser, DeviceState } from '@/types/state';

export type DeviceType = 'camera' | 'microphone';

export const getDeviceStatus = (
  deviceType: DeviceType,
  user: Partial<BaseUser> | null
): DeviceState => {
  if (user === null) {
    return DeviceState.Open;
  }

  if (deviceType === 'camera') {
    return user.camera!;
  }

  return user.mic!;
};
