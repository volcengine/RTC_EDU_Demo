import React, { useMemo, useState } from 'react';
import styles from './index.less';
import Close from '@assets/images/Close.svg';
import AllMicOff from '@assets/images/AllMicOff.svg';
import IconButton from './IconButton';
import Icon from '@components/Icon';
import { MessageType, updateMessage } from '@src/store/modules/publicMessage';
import classNames from 'classnames';
import { UserRole } from '@/renderer/types/state';

import { useDispatch, useSelector } from '@/renderer/store';
import AwardShare from './UserList/AwardShare';
import HandleApplyToast from './UserList/HandleApplyToast';
import Member from './UserList/UserInfo';
import { setUserListDrawOpen } from '@/renderer/store/slices/ui';

const MemberList: React.FC<{}> = (props) => {
  const room = useSelector((state) => state.edusRoom);
  const [isShowMic, setIsShowMic] = useState(false);
  const [isShowShare, setIsShowShare] = useState(false);
  const [isShowAwardShare, setIsShowAwardShare] = useState(false);
  const userListDrawOpen = useSelector((state) => state.ui.userListDrawOpen);
  const [operateUser, setOperateUser] = useState<{
    userName: string;
    userId: string;
    shareOperate?: number;
  }>({
    userId: '',
    userName: '',
  });
  const dispatch = useDispatch();

  const me = room.localUser;

  const onClickAllMuteAll = () => {
    console.log('clickmuteALl');
    dispatch(updateMessage(MessageType.HOST_MUTE_ALL));
  };

  const handleCloseIcon = () => {
    dispatch(setUserListDrawOpen(!userListDrawOpen));
  };

  return (
    <div className={styles.memberList} style={{ display: userListDrawOpen ? 'flex' : 'none' }}>
      <div className={styles.header}>
        <div className={styles.memberNum}>成员（{room.remoteUsers.length + 1}）</div>
        <div onClick={handleCloseIcon} className={styles.closeIcon}>
          <IconButton src={Close} />
        </div>
      </div>
      <div className={classNames(styles.body, { [styles.windows]: process.platform === 'win32' })}>
        <Member
          user={me}
          setIsShowMic={setIsShowMic}
          setIsShowShare={setIsShowShare}
          setOperateUser={setOperateUser}
          setIsShowAwardShare={setIsShowAwardShare}
        />

        {room.remoteUsers.map((item) => (
          <Member
            user={item}
            key={item.user_id}
            setIsShowMic={setIsShowMic}
            setIsShowShare={setIsShowShare}
            setOperateUser={setOperateUser}
            setIsShowAwardShare={setIsShowAwardShare}
          />
        ))}
      </div>
      {me.user_role === UserRole.Host && (
        <div className={styles.footer}>
          <div className={styles.allMicBtn} onClick={onClickAllMuteAll}>
            <Icon src={AllMicOff} className={styles.icon} />
            <span>全体静音</span>
          </div>
        </div>
      )}
      <HandleApplyToast
        isShowMic={isShowMic}
        isShowShare={isShowShare}
        setIsShowMic={setIsShowMic}
        setIsShowShare={setIsShowShare}
        userId={operateUser.userId}
        userName={operateUser.userName}
      />
      <AwardShare
        userId={operateUser.userId}
        isShowAwardShare={isShowAwardShare}
        setIsShowAwardShare={setIsShowAwardShare}
        shareOperate={operateUser.shareOperate!}
      />
    </div>
  );
};

export default MemberList;
