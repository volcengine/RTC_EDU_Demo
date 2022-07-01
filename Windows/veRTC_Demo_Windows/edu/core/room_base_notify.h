#pragma once
#include <string>

#include "rtc/bytertc_advance.h"
#include "rtc/bytertc_defines.h"
#include "rtc/bytertc_engine_interface.h"
#include "rtc/bytertc_engine_lite_interface.h"

using RoomPtr = bytertc::IRtcRoom*;
using Room = bytertc::IRtcRoom;
using Role = bytertc::UserRoleType;
using UserInfo = bytertc::UserInfo;
using RoomType = bytertc::RoomProfileType;

namespace RB {

class NotifyBase {
 public:
  NotifyBase();
  virtual ~NotifyBase();

  virtual void onBeginClass(const std::string& room_id) {}
  virtual void onEndClass(const std::string& room_id) {}
  virtual void onOpenGroupSpeech(const std::string& room_id) {}
  virtual void onCloseGroupSpeech(const std::string& room_id) {}
  virtual void onOpenVideoInteract() {}
  virtual void onCloseVideoInteract() {}
  virtual void onTeacherMicOn(const std::string& room_id) {}
  virtual void onTeacherMicOff(const std::string& room_id) {}
  virtual void onTeacherCameraOn(const std::string& room_id) {}
  virtual void onTeacherCameraOff(const std::string& room_id) {}
  virtual void onTeacherJoinRoom(const std::string& room_id) {}
  virtual void onTeacherLeaveRoom(const std::string& room_id) {}
  virtual void onStudentJoinGroupRoom(const std::string& room_id,
                                      const std::string& user_id,
                                      const std::string& user_name) {}
  virtual void onStudentLeaveGroupRoom(const std::string& room_id,
                                       const std::string& user_id,
                                       const std::string& user_name) {}
  virtual void onLoginElsewhere() {}

 private:
  void _initNotifyEvent();
  int _connKey;
};
}  // namespace RB
