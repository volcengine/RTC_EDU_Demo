import { UserInfo } from '@volcengine/rtc';
import { useSearchParams } from 'react-router-dom';
import { Header, HeaderRoomInfo } from '@/components';
import { useSelector, useDispatch } from '@/store';
import { UserRole } from '@/types/state';
import EdubView from './EdubView';
import BottomMenu from './BottomMenu';
import { useAudioReportHook } from '@/core/rtcHooks';
import styles from './index.module.less';
import UserInfoList, { UserListProps } from './UserInfoList';
import LinkedUserList, { LinkedUserListProps } from './LinkedUserList';
import { setActiveSpeaker, setAudioInfo } from '@/store/slices/edubRoom';
import HeaderRight from './HeaderRight';
import AudioAskModal from '@/components/AudioAskModal';

interface EdubViewProps {
  role: UserRole;
}

function Room(props: EdubViewProps) {
  const { role } = props;

  const room = useSelector((state) => state.edubRoom);
  const ui = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const visibility = searchParams.get('visibility');

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

  return (
    <>
      <Header right={role === UserRole.Visitor && <HeaderRight />} room={room}>
        <HeaderRoomInfo room={room} />
      </Header>
      <div className={styles.viewWrapper}>
        <div
          className={styles.content}
          style={{
            width: ui.userListDrawOpen && role === UserRole.Host ? 'calc(100% - 248px)' : '100%',
          }}
        >
          <div
            className={styles.contentTop}
            style={{
              height: role === UserRole.Host ? 'calc(100% - 64px)' : '100%',
            }}
          >
            <EdubView />
            <LinkedUserList room={room as unknown as LinkedUserListProps['room']} />
          </div>
          {role === UserRole.Host && <BottomMenu />}
        </div>
        {role === UserRole.Host && <UserInfoList room={room as unknown as UserListProps['room']} />}
      </div>
      {visibility !== 'false' && <AudioAskModal />}
    </>
  );
}

export default Room;
