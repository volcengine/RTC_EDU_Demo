import { Link } from 'react-router-dom';
import { ipcRenderer, remote } from 'electron';
import style from './index.module.less';
import React from 'react';
import { useAppDispatch } from '@src/store/hooks';
import { SceneType, setScene } from '@src/store/slices/scene';

interface ISceneItem {
  scene: SceneType;
  sceneName: string;
  scenePic: string;
}

const memberWindowId = remote.getGlobal('shareWindowId').memberWindowId;
const screenWindowId = remote.getGlobal('shareWindowId').screenWindowId;
const settingWindowId = remote.getGlobal('shareWindowId').settingWindowId;
const footerWindowId = remote.getGlobal('shareWindowId').footerWindowId;
const applyLinkWindowId = remote.getGlobal('shareWindowId').applyLinkWindowId;

const attendeeWindowId = remote.getGlobal('shareWindowId').attendeeWindowId;
const hostRecordComfirmwindowId = remote.getGlobal('shareWindowId').hostRecordComfirmwindowId;
const hostRecordRecieveWindowId = remote.getGlobal('shareWindowId').hostRecordRecieveWindowId;

function SceneItem(props: ISceneItem) {
  const { sceneName, scene, scenePic } = props;

  const dispatch = useAppDispatch();

  const handleScene = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, scene: SceneType) => {
    dispatch(setScene(scene));
    ipcRenderer.sendTo(memberWindowId, 'setScene', scene);
    ipcRenderer.sendTo(footerWindowId, 'setScene', scene);
    ipcRenderer.sendTo(applyLinkWindowId, 'setScene', scene);

    ipcRenderer.sendTo(hostRecordComfirmwindowId, 'setScene', scene);
  };

  return (
    <Link to={`/${scene}`} className={style.sceneItem} onClick={(e) => handleScene(e, scene)}>
      <div className={style.imgWrapper}>
        <img src={scenePic} alt="meeting" />
      </div>
      <span>{sceneName}</span>
    </Link>
  );
}

export default SceneItem;
