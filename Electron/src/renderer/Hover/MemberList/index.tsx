import React, { useMemo, useState } from 'react';
import styles from './index.less';
import Close from '@assets/images/Close.svg';

import AllMicOff from '@assets/images/AllMicOff.svg';
import IconButton from '@src/components/IconButton';
import Icon from '@components/Icon';

import { ipcRenderer, remote } from 'electron';
import Toast from '@src/components/Toast';
import { Button, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import classNames from 'classnames';
import { ProcessEvent, WindowType } from '@/types';
import { DeviceState, Permission, UserRole } from '@/renderer/types/state';
import AwardShare from './AwardShare';
import HandleApplyToast from './HandleApplyToast';
import AttenddeApplyShare from './AttenddeApplyShare';
import AttenddeApplyMic from './AttenddeApplyMic';
import Member from './Member';
import useSceneRoom from '@/renderer/core/hooks/useSceneRoom';

const mainWindowId = remote.getGlobal('shareWindowId').mainWindowId;

const MemberList: React.FC = () => {
  const hideWindow = () => {
    ipcRenderer.send(ProcessEvent.OperateWindow, WindowType.MEMBER);
  };

  const room = useSceneRoom();

  const [isShowToast, setIsShowToast] = useState(false);
  const [operateSelfMic, setOperateSelfMic] = useState(1);
  const [isShowMic, setIsShowMic] = useState(false);
  const [isShowShare, setIsShowShare] = useState(false);
  const [isShowAwardShare, setIsShowAwardShare] = useState(false);
  const [operateUser, setOperateUser] = useState<{
    userName: string;
    userId: string;
    shareOperate?: Permission;
  }>({
    userId: '',
    userName: '',
  });

  const onChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setOperateSelfMic(1);
    } else {
      setOperateSelfMic(0);
    }
  };

  const handleMuteAll = () => {
    setIsShowToast(false);
    ipcRenderer.sendTo(mainWindowId, 'muteAll', operateSelfMic);
  };

  const onClickAllMuteAll = () => {
    setIsShowToast(true);
  };

  return (
    <div className={styles.memberList}>
      <div className={styles.header}>
        <div className={styles.memberNum}>成员（{(room?.remoteUsers.length || 0) + 1}）</div>
        <div onClick={hideWindow} className={styles.closeIcon}>
          <IconButton src={Close} />
        </div>
      </div>
      <div className={classNames(styles.body, { [styles.windows]: process.platform === 'win32' })}>
        <Member
          user={room?.localUser}
          room={room}
          key={room?.localUser?.user_id}
          setIsShowMic={setIsShowMic}
          setIsShowShare={setIsShowShare}
          setIsShowAwardShare={setIsShowAwardShare}
          setOperateUser={setOperateUser}
        />

        {room?.remoteUsers.map((item) => (
          <Member
            user={item}
            room={room}
            key={item.user_id}
            setIsShowMic={setIsShowMic}
            setIsShowShare={setIsShowShare}
            setIsShowAwardShare={setIsShowAwardShare}
            setOperateUser={setOperateUser}
          />
        ))}
      </div>
      <Toast isShow={isShowToast} message="将全体以及新参会的人静音">
        <div>
          <Checkbox checked={operateSelfMic === 1} onChange={onChange}>
            参会人自己打开麦克风
          </Checkbox>
          <div>
            <Button type="primary" onClick={handleMuteAll}>
              全体静音
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                setIsShowToast(false);
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </Toast>
      <AttenddeApplyMic />
      <AttenddeApplyShare />
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
      {room?.localUser.user_role === UserRole.Host && (
        <div className={styles.footer}>
          <div className={styles.allMicBtn} onClick={onClickAllMuteAll}>
            <Icon src={AllMicOff} className={styles.icon} />
            <span>全体静音</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;
