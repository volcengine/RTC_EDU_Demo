import { ShareConfig } from '@/renderer/types/state';
import { VideoEncodePreference, VideoEncoderConfig } from '@volcengine/vertc-electron-sdk/js/types';

export const getScreenConfig = (newConfig: ShareConfig) => {
  const encodeConfig: VideoEncoderConfig = {
    width: 1920,
    height: 1080,
    frameRate: 15,
    maxBitrate: -1,
    encoderPreference: VideoEncodePreference.kVideoEncodePreferenceQuality,
  };

  if (newConfig === ShareConfig.Motion) {
    encodeConfig.width = 1280;
    encodeConfig.height = 720;
    encodeConfig.frameRate = 30;
    encodeConfig.encoderPreference = VideoEncodePreference.kVideoEncodePreferenceFramerate;
  }

  return encodeConfig;
};
