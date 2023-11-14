import { useSelector } from '@/renderer/store';
import { EdubRoomState } from '@/renderer/store/slices/edubRoom';
import { EdusRoomState } from '@/renderer/store/slices/edusRoom';
import { MeetingRoomState } from '@/renderer/store/slices/meetingRoom';
import { SceneType } from '@/renderer/store/slices/scene';

const useSceneRoom = (): EdusRoomState | EdubRoomState | MeetingRoomState | undefined => {
  const { scene } = useSelector((state) => state.scene);
  console.log('useSceneRoom:', scene);

  const meetingRoom = useSelector((state) => state.meetingRoom);
  const edubRoom = useSelector((state) => state.edubRoom);
  const edusRoom = useSelector((state) => state.edusRoom);

  if (scene === SceneType.Meeting) {
    return meetingRoom;
  }

  if (scene === SceneType.Edub) {
    return edubRoom;
  }

  if (scene === SceneType.Edus) {
    return edusRoom;
  }
};

export default useSceneRoom;
