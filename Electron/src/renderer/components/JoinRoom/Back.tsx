import BackToSceneImg from '@assets/images/scene/BackToScene.png';
import styles from './index.less';
// import { localUserLeaveRoom as edubLeave } from '@/store/slices/edubRoom';
// import { localUserLeaveRoom as edusLeave } from '@/store/slices/edusRoom';
import { useDispatch } from '@src/store';
import { useHistory } from 'react-router';
import React from 'react';
import { localUserLeaveRoom as meetingLeave } from '@src/store/slices/meetingRoom';
import { localUserLeaveRoom as edubLeave } from '@src/store/slices/edubRoom';
import { localUserLeaveRoom as edusLeave } from '@src/store/slices/edusRoom';

import { JoinStatus, setJoining } from '@/renderer/store/slices/scene';
import { RtcClient } from '@/renderer/core/rtc';

function Back() {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = () => {
    history.push('/');

    dispatch(setJoining(JoinStatus.NotJoined));

    dispatch(meetingLeave());
    dispatch(edubLeave());
    dispatch(edusLeave());
    RtcClient.stopAudioCapture();
    RtcClient.stopVideoCapture();
    RtcClient.destroyEngine();
  };

  return (
    <div className={styles.backToScene} onClick={handleClick}>
      <img src={BackToSceneImg} alt="" />
    </div>
  );
}

export default Back;
