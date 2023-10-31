import CameraOn from '@/assets/images/CameraOn.svg';
import CameraOff from '@/assets/images/CameraOff.svg';
import MicrophoneOn from '@/assets/images/MicrophoneOn.svg';
import MicrophoneOff from '@/assets/images/MicrophoneOff.svg';
// import SoundOn from '@/assets/images/SoundOn.svg';
// import RealTimeData from '@/assets/images/RealTimeData.svg';
import Setting from '@/assets/images/Setting.svg';
import Share from '@/assets/images/Share.svg';
import ShareOff from '@/assets/images/ShareOff.svg';
import RecordOff from '@/assets/images/RecordOff.svg';
import RecordOn from '@/assets/images/RecordOn.svg';

import Stop from '@/assets/images/Stop.svg';
import Close from '@/assets/images/Close.svg';

const IconMap = {
  cameraOn: CameraOn,
  cameraOff: CameraOff,
  microphoneOn: MicrophoneOn,
  microphoneOff: MicrophoneOff,
  //   soundOn: SoundOn,
  //   realtime: RealTimeData,
  setting: Setting,
  share: Share,
  shareOff: ShareOff,
  recordOn: RecordOn,
  recordOff: RecordOff,
  stop: Stop,
  close: Close,
};

export const getIcon = (type: string, status = ''): string =>
  IconMap[`${type}${status}` as keyof typeof IconMap];
