export enum ToastType {
  Init,
  /**
   * 房间关闭
   */
  RoomEnd,
  /**
   * （老师收到）学生申请麦克风权限
   */
  ApplyMic,
  /**
   * （老师收到）学生申请共享
   */
  ApplyShare,
  /**
   * （老师收到）学生申请录制
   */
  ApplyRecord,
  /**
   * （学生收到）老师要求打开摄像头
   */
  HostOpenCamera,
  /**
   * （学生收到）老师要求打开麦克风
   */
  HostOpenMic,
}
