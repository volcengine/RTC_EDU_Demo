import VERTC, {
  AudioPropertiesInfo,
  LocalAudioPropertiesInfo,
  RemoteAudioPropertiesInfo,
  StreamIndex,
  UserInfo,
} from '@volcengine/rtc';
import { useEffect } from 'react';

import { RtcClient } from '@/core/rtc';

interface IAudioReportHook {
  onActiveSpeaker: (userInfo: UserInfo) => void;
  onLocalAudio: (audioInfo: AudioPropertiesInfo) => void;
  onRemoteAudio: (audioInfo: Record<string, AudioPropertiesInfo>) => void;
}

/**
 * 活跃用户变化，每次只有一个
 */
const useAudioReportHook = (hook: IAudioReportHook, use: boolean = true) => {
  const { onActiveSpeaker, onLocalAudio, onRemoteAudio } = hook;

  const handleActiveSpeaker = (user: UserInfo) => {
    onActiveSpeaker && onActiveSpeaker(user);
  };

  const handleLocalAudioReport = (e: LocalAudioPropertiesInfo[]) => {
    const localAudioInfo = e.find(
      (audioInfo) => audioInfo.streamIndex === StreamIndex.STREAM_INDEX_MAIN
    );
    if (localAudioInfo) {
      onLocalAudio(localAudioInfo?.audioPropertiesInfo!);
    }
  };

  const handleRemoteAudioReport = (e: RemoteAudioPropertiesInfo[]) => {
    const remoteAudioInfo: Record<string, AudioPropertiesInfo> = e
      .filter((audioInfo) => audioInfo.streamKey.streamIndex === StreamIndex.STREAM_INDEX_MAIN)
      .reduce((pre, cur) => {
        pre[cur.streamKey.userId] = cur.audioPropertiesInfo;
        return pre;
      }, {} as Record<string, AudioPropertiesInfo>);

    onRemoteAudio(remoteAudioInfo);
  };

  useEffect(() => {
    if (use) {
      RtcClient.engine.on(VERTC.events.onLocalAudioPropertiesReport, handleLocalAudioReport);
      RtcClient.engine.on(VERTC.events.onRemoteAudioPropertiesReport, handleRemoteAudioReport);
      RtcClient.engine.on(VERTC.events.onActiveSpeaker, handleActiveSpeaker);
    }
    return () => {
      if (use) {
        RtcClient.engine.off(VERTC.events.onLocalAudioPropertiesReport, handleLocalAudioReport);
        RtcClient.engine.off(VERTC.events.onRemoteAudioPropertiesReport, handleRemoteAudioReport);
        RtcClient.engine.off(VERTC.events.onActiveSpeaker, handleActiveSpeaker);
      }
    };
  });
};

export default useAudioReportHook;
