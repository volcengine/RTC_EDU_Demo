enum RTSEventName {
  vcJoinRoom = 'vcJoinRoom',
  vcGetUserList = 'vcGetUserList',
  vcLeaveRoom = 'vcLeaveRoom',
  vcOperateSelfCamera = 'vcOperateSelfCamera',
  vcOperateSelfMic = 'vcOperateSelfMic',
  vcFinishRoom = 'vcFinishRoom',
  vcOperateOtherCamera = 'vcOperateOtherCamera',
  vcOperateOtherMic = 'vcOperateOtherMic',
  vcOperateSelfMicApply = 'vcOperateSelfMicApply',
  vcSharePermissionApply = 'vcSharePermissionApply',
  vcOperateOtherSharePermission = 'vcOperateOtherSharePermission',
  vcOperateSelfMicPermit = 'vcOperateSelfMicPermit',
  vcSharePermissionPermit = 'vcSharePermissionPermit',
  vcOperateAllMic = 'vcOperateAllMic',
  vcStartShare = 'vcStartShare',
  vcFinishShare = 'vcFinishShare',
  vcResync = 'vcResync',
  vcStartRecord = 'vcStartRecord',
  vcStopRecord = 'vcStopRecord',
  vcStartRecordApply = 'vcStartRecordApply',
  vcGetRecordList = 'vcGetRecordList',
  vcStartRecordPermit = 'vcStartRecordPermit',
}
enum State {
  OFF = 0,
  ON = 1,
}

enum UserRole {
  PARTICIPATOR = 0,
  HOST = 1,
}

enum RoomFinishReason {
  HOST_CLOSE = 0,
  TIMEOUT = 1,
}

export { RTSEventName, State, UserRole, RoomFinishReason };
