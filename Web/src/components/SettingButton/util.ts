import { StreamSettings } from '@/store/slices/setting';

export const formatStreamSettings = (res: string, fps: number, bps: number, bpsMin: number) => {
  return {
    resolution: {
      width: parseInt(res.split(' * ')[0]),
      height: parseInt(res.split(' * ')[1]),
    },
    frameRate: fps,
    bitrate: bps,
  };
};

export const diffSetting = (before: StreamSettings, after: StreamSettings): boolean => {
  if (before.bitrate !== after.bitrate) {
    return true;
  }

  if (before.frameRate !== after.frameRate) {
    return true;
  }

  if (
    before.resolution.width !== after.resolution.width ||
    before.resolution.height !== after.resolution.height
  ) {
    return true;
  }

  return false;
};
