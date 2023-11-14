import MeetingImg from '@assets/images/scene/Meeting.png';
import SmallImg from '@assets/images/scene/Small.png';
import LargeImg from '@assets/images/scene/Large.png';
import { SceneType } from '@src/store/slices/scene';

export const SceneList = [
  {
    sceneName: '视频会议',
    scene: SceneType.Meeting,
    scenePic: MeetingImg,
  },
  {
    sceneName: '小班课课堂',
    scene: SceneType.Edus,
    scenePic: SmallImg,
  },
  {
    sceneName: '大班课课堂',
    scene: SceneType.Edub,
    scenePic: LargeImg,
  },
];
