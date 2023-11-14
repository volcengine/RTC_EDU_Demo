import {
  AudioPropertiesInfo,
  LocalAudioPropertiesInfo,
  RemoteAudioPropertiesInfo,
  StreamIndex,
} from '@volcengine/vertc-electron-sdk/js/types';
import { useEffect } from 'react';
import RtcClient from '../rtc/RtcClient';

interface IAudioReportHook {
  onActiveSpeaker: (userId: string) => void;
  onLocalAudio: (audioInfo: AudioPropertiesInfo) => void;
  onRemoteAudio: (audioInfo: Record<string, AudioPropertiesInfo>) => void;
}

const useAudioReportHook = (hook: IAudioReportHook, use: boolean = true) => {
  const { onActiveSpeaker, onLocalAudio, onRemoteAudio } = hook;

  const handleActiveSpeaker = (roomId: string, userId: string) => {
    onActiveSpeaker && onActiveSpeaker(userId);
  };

  // todo 这里的类型不对，要检查
  const handleLocalAudioReport = (info: any /* LocalAudioPropertiesInfo[] */) => {
    // console.log('handleLocalAudioReport', info);
    if (info?.[0]?.audio_properties_info) {
      onLocalAudio(info?.[0]?.audio_properties_info!);
    }
  };

  const handleRemoteAudioReport = (info: any) => {
    // console.log('handleRemoteAudioReport', info);

    const remoteAudioInfo: Record<string, AudioPropertiesInfo> = info
      .filter((audioInfo: any) => audioInfo.stream_key.stream_index === StreamIndex.kStreamIndexMain)
      .reduce((pre: any, cur: any) => {
        pre[cur.stream_key.user_id] = cur.audio_properties_info;
        return pre;
      }, {} as Record<string, AudioPropertiesInfo>);

    onRemoteAudio(remoteAudioInfo);
  };

  useEffect(() => {
    if (use) {
      RtcClient.engine?.on('onLocalAudioPropertiesReport', handleLocalAudioReport);
      RtcClient.engine?.on('onRemoteAudioPropertiesReport', handleRemoteAudioReport);
      RtcClient.engine?.on('onActiveSpeaker', handleActiveSpeaker);
    }
    return () => {
      if (use) {
        RtcClient.engine?.off('onLocalAudioPropertiesReport', handleLocalAudioReport);
        RtcClient.engine?.off('onRemoteAudioPropertiesReport', handleRemoteAudioReport);
        RtcClient.engine?.off('onActiveSpeaker', handleActiveSpeaker);
      }
    };
  }, []);
};

export default useAudioReportHook;
