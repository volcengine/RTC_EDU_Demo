import { SharedRoomInfo } from "../types/common";
import veRTCRoom from "../main/room";
import veRTCMediaPlayer from "../main/media_player";
declare const sharedUserInfo: SharedRoomInfo;
export declare const createdRooms: Map<string, veRTCRoom>;
export declare const createdMediaPlayer: Map<number, veRTCMediaPlayer>;
export default sharedUserInfo;
