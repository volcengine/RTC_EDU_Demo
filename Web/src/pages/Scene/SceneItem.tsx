import { Link } from 'react-router-dom';
import { useDispatch } from '@/store';
import { SceneType, setScene } from '@/store/slices/scene';

import style from './index.module.less';

interface ISceneItem {
  scene: SceneType;
  sceneName: string;
  scenePic: string;
}

function SceneItem(props: ISceneItem) {
  const { sceneName, scene, scenePic } = props;

  const dispatch = useDispatch();

  const handleScene = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, scene: SceneType) => {
    // if (scene === SceneType.Edus) {
    //   alert('待完成');
    //   e.stopPropagation();
    //   e.preventDefault();
    //   return;
    // }

    dispatch(setScene(scene));
  };

  return (
    <Link to={scene} className={style.sceneItem} onClick={(e) => handleScene(e, scene)}>
      <div className={style.imgWrapper}>
        <img src={scenePic} alt="meeting" />
      </div>
      <span>{sceneName}</span>
    </Link>
  );
}

export default SceneItem;
