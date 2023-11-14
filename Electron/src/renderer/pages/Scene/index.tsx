import { useEffect } from 'react';
import { RtcClient } from '@src/core/rtc';

import Time from './Time';
import { SceneList } from './constants';
import SceneItem from './SceneItem';
import Footer from './Footer';
import style from './index.module.less';
import Header from '@/renderer/components/Header';
import React from 'react';

function Scene() {
  useEffect(() => {
    const mount = async () => {
      if (!RtcClient.engine) {
        return;
      }

      await RtcClient.stopAudioCapture();
      await RtcClient.stopVideoCapture();
    };
    mount();
  }, []);
  // todo 移除本端播放器，兜底

  console.log('scene render');

  return (
    <div className={style.sceneWrapper}>
      <Header className={style.sceneHeader} />
      <Time />
      <div className={style.sceneList}>
        {SceneList.map((scene) => {
          return <SceneItem {...scene} key={scene.scene} />;
        })}
      </div>
      <Footer />
    </div>
  );
}

export default Scene;
