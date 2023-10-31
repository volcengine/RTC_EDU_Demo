import { useEffect } from 'react';
import { MediaType, UserInfo } from '@volcengine/rtc';

import { Header, HeaderRoomInfo } from '@/components';

import PlayerWrapper from './PlayerWrapper';
import BottomMenu from './BottomMenu';
import UserList from './UserList';
import styles from './index.module.less';
import { RoomMicStatus, UserRole } from '@/types/state';
import { useDispatch, useSelector } from '@/store';
import { RtcClient } from '@/core/rtc';
import { setActiveSpeaker, setAudioInfo } from '@/store/slices/meetingRoom';
import { useAudioReportHook } from '@/core/rtcHooks';
import ToastMessage from './ToastMessage';

function Room() {
  const room = useSelector((state) => state.meetingRoom);

  const dispatch = useDispatch();

  const handleActiveSpeaker = (userInfo: UserInfo) => {
    dispatch(setActiveSpeaker(userInfo.userId));
  };

  useAudioReportHook(
    {
      onActiveSpeaker: handleActiveSpeaker,
      onLocalAudio: (audioInfo) => {
        dispatch(
          setAudioInfo({
            isLocal: true,
            audioInfo,
          })
        );
      },
      onRemoteAudio: (audioInfos) => {
        dispatch(
          setAudioInfo({
            isLocal: false,
            audioInfo: audioInfos,
          })
        );
      },
    },
    true
  );

  useEffect(() => {
    if (
      room.room_mic_status === RoomMicStatus.AllMuted &&
      room.localUser.user_role === UserRole.Visitor
    ) {
      RtcClient.unpublishStream(MediaType.AUDIO);
    }
  }, [room.room_mic_status]);

  return (
    <>
      <Header room={room}>
        <HeaderRoomInfo room={room} />
      </Header>
      <div className={styles.viewWrapper}>
        <div className={styles.viewLeft}>
          <PlayerWrapper />
          <BottomMenu />
        </div>

        <UserList />
      </div>

      <ToastMessage />
    </>
  );
}

export default Room;
