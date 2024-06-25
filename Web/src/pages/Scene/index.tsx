import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components';
import { RtcClient } from '@/core/rtc';
import { useDispatch, useSelector } from '@/store';
import Time from './Time';
import { SceneList } from './constants';
import SceneItem from './SceneItem';
import Footer from './Footer';
import style from './index.module.less';
import { BoardClient } from '@/core/board';
import { JoinStatus, setJoining } from '@/store/slices/scene';

function Scene() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navToLoginPage = () => {
    navigate('/login');
  };

  const cleanRTCEngine = async () => {
    dispatch(setJoining(JoinStatus.NotJoined));
    if (!RtcClient.engine) {
      return;
    }
    await RtcClient.stopScreenCapture();
    await RtcClient.stopAudioCapture();
    await RtcClient.stopVideoCapture();
    RtcClient.setVideoPlayer(user.user_id!, undefined);
    RtcClient.destroyEngine();
    BoardClient.leaveRoom();
  };

  useEffect(() => {
    cleanRTCEngine();
  }, []);

  return (
    <div className={style.sceneWrapper}>
      <Header showVersion={false} onLogout={navToLoginPage} />
      <div className={style.sceneContentWrapper}>
        <Time />
        <div className={style.sceneList}>
          {SceneList.map((scene) => {
            return <SceneItem {...scene} key={scene.scene} />;
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Scene;
