#include "room_base_notify.h"
#include "app_ui_state.h"

namespace RB {
NotifyBase::NotifyBase() {
  _initNotifyEvent();
}

NotifyBase::~NotifyBase() { WSS_SESSION->offAll(); }

void NotifyBase::_initNotifyEvent() {

  WSS_SESSION->onBeginClass([this]() { this->onBeginClass(""); });
  WSS_SESSION->onEndClass([this]() { this->onEndClass(""); });
  WSS_SESSION->onOpenGroupSpeech([this]() { this->onOpenGroupSpeech(""); });
  WSS_SESSION->onCloseGroupSpeech([this]() { this->onCloseGroupSpeech(""); });
  WSS_SESSION->onCloseVideoInteract(
      [this]() { this->onCloseVideoInteract(); });
  WSS_SESSION->onOpenVideoInteract([this]() { this->onOpenVideoInteract(); });
  WSS_SESSION->onTeacherMicOn([this]() { this->onTeacherMicOn(""); });
  WSS_SESSION->onTeacherMicOff([this]() { this->onTeacherMicOff(""); });
  WSS_SESSION->onTeacherCameraOn([this]() { this->onTeacherCameraOn(""); });
  WSS_SESSION->onTeacherCameraOff([this]() { this->onTeacherCameraOff(""); });
  WSS_SESSION->onTeacherJoinRoom([this]() { this->onTeacherJoinRoom(""); });
  WSS_SESSION->onTeacherLeaveRoom([this]() { this->onTeacherLeaveRoom(""); });
  WSS_SESSION->onLogInElsewhere([this]() { this->onLoginElsewhere(); });
 
}
}  // namespace RB
