import { useNavigate } from 'react-router-dom';
import BackToSceneImg from '@/assets/images/scene/BackToScene.png';
import styles from './index.module.less';
import { useDispatch } from '@/store';
import { localUserLeaveRoom as edubLeave } from '@/store/slices/edubRoom';
import { localUserLeaveRoom as edusLeave } from '@/store/slices/edusRoom';
import { localUserLeaveRoom as meetingLeave } from '@/store/slices/meetingRoom';
import { JoinStatus, setJoining } from '@/store/slices/scene';
import { RtcClient } from '@/core/rtc';

function Back() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    navigate('/');

    RtcClient.stopVideoCapture();
    RtcClient.stopAudioCapture();
    RtcClient.destroyEngine();
    dispatch(setJoining(JoinStatus.NotJoined));
    dispatch(edubLeave());
    dispatch(edusLeave());
    dispatch(meetingLeave());
  };

  return (
    <div className={styles.backToScene} onClick={handleClick}>
      <img src={BackToSceneImg} alt="" />
    </div>
  );
}

export default Back;
