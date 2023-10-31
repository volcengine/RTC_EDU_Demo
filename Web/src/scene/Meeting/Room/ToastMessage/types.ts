export enum ToastType {
  Init,
  /**
   * 房间关闭
   */
  RoomEnd,
  /**
   * （主持人收到）参会人申请麦克风权限
   */
  ApplyMic,
  /**
   * （主持人收到）参会人申请共享
   */
  ApplyShare,
  /**
   * （主持人收到）参会人申请录制
   */
  ApplyRecord,
  /**
   * （参会人收到）主持人要求打开摄像头
   */
  HostOpenCamera,
  /**
   * （参会人收到）主持人要求打开麦克风
   */
  HostOpenMic,
}
