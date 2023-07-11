#pragma once

#include <memory>
#include <vector>
#include "core/session_base.h"
#include "core/component_interface.h"

namespace vrd {

class EduSession : public IComponent {
 public:
  static void registerThis();

  void setUserId(const std::string& uid);
  void setToken(const std::string& token);
  void setRoomId(const std::string& roomId);

  std::string _token();
  std::string user_id();

  void initSceneConfig(std::function<void(void)>&& callback);
  void exitScene();

  //----------------------------------interface----------------------------------
  void getCreatedClass(CSTRING_REF_PARAM user_id, CallBackFunction&& callback);
  void eduCreateClass(CSTRING_REF_PARAM room_name, int room_type,
                      CSTRING_REF_PARAM create_user_id, int room_limit,
                      int group_num, int group_limit, int begin_class_time,
                      int end_class_time, CSTRING_REF_PARAM teacher_name,
                      CallBackFunction&& callback);
  void eduCreateClass(CSTRING_REF_PARAM room_name, int room_type,
                      CSTRING_REF_PARAM create_user_id, int room_limit,
                      CSTRING_REF_PARAM teacher_name,
                      CallBackFunction&& callback);
  void getHistoryRoomList(CSTRING_REF_PARAM user_id,
                          CallBackFunction&& callback);
  void getHistoryRecordList(CSTRING_REF_PARAM room_id,
                            CallBackFunction&& callback);
  void eduDeleteRecord(CSTRING_REF_PARAM vid, CallBackFunction&& callback);
  void eduReconnect(CSTRING_REF_PARAM user_id, CallBackFunction&& callback);

  // student interface
  void eduGetActiveClass(CallBackFunction&& callback);

  void beginClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                  CallBackFunction&& callback);
  void teacherGetStudentsInfo(CSTRING_REF_PARAM room_id,
                              CSTRING_REF_PARAM user_id, uint32_t page_number,
                              uint32_t page_size, CallBackFunction&& callback);
  void endClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                CallBackFunction&& callback);
  void openGroupSpeech(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                       CallBackFunction&& callback);
  void closeGroupSpeech(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                        CallBackFunction&& callback);
  void openVideoInteract(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                         CallBackFunction&& callback);
  void closeVideoInteract(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                          CallBackFunction&& cb);
  void stuJoinClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                    CSTRING_REF_PARAM user_name, CallBackFunction&& cb,
                    bool is_reconnect = false);
  void teaJoinClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                    CSTRING_REF_PARAM user_name, CallBackFunction&& cb);
  void stuLeaveClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                     CallBackFunction&& cb);
  void eduTurnOnMic(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                    CallBackFunction&& cb);
  void eduTurnOffMic(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                     CallBackFunction&& cb);
  void eduTurnOnCamera(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                       CallBackFunction&& cb);
  void eduTurnOffCamera(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                        CallBackFunction&& cb);

  private:
  void _beginClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                   CallBackFunction&& callback);
  void _teacherGetStudentsInfo(CSTRING_REF_PARAM room_id,
                               CSTRING_REF_PARAM user_id, uint32_t page_number,
                               uint32_t page_size, CallBackFunction&& callback);
  void _endClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                 CallBackFunction&& callback);
  void _openGroupSpeech(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                        CallBackFunction&& callback);
  void _closeGroupSpeech(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                         CallBackFunction&& callback);
  void _openVideoInteract(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                          CallBackFunction&& cb);
  void _closeVideoInteract(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                           CallBackFunction&& cb);
  void _teaJoinClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                     CSTRING_REF_PARAM user_name, CallBackFunction&& cb);
  void _stuJoinClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                     CSTRING_REF_PARAM user_name, bool is_reconnect,
                     CallBackFunction&& cb);
  void _stuLeaveClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                      CallBackFunction&& cb);
  void _eduTurnOnMic(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                     CallBackFunction&& cb);

  void _getCreatedClass(CSTRING_REF_PARAM user_id, CallBackFunction&& callback);
  void _eduCreateClass(CSTRING_REF_PARAM room_name, int room_type,
                       CSTRING_REF_PARAM create_user_id, int* room_limit,
                       int* group_num, int* group_limit, int* begin_class_time,
                       int* end_class_time, CSTRING_REF_PARAM teacher_name,
                       CallBackFunction&& callback);
  void _getHistoryRoomList(CSTRING_REF_PARAM user_id,
                           CallBackFunction&& callback);
  void _getHistoryRecordList(CSTRING_REF_PARAM room_id,
                             CallBackFunction&& callback);
  void _eduDeleteRecord(CSTRING_REF_PARAM vid, CallBackFunction&& callback);
  void _eduGetActiveClass(CallBackFunction&& callback);
  void _eduTurnOffMic(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                      CallBackFunction&& cb);
  void _eduTurnOnCamera(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                        CallBackFunction&& cb);
  void _eduTurnOffCamera(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                         CallBackFunction&& cb);
  void _eduReconnect(CSTRING_REF_PARAM user_id, CallBackFunction&& cb);
 public:
  void offAll();
  void onLogInElsewhere(
      std::function<void(void)>&& callback);
  void onTeacherLeaveRoom(std::function<void(void)>&& callback);
  void onTeacherJoinRoom(std::function<void(void)>&& callback);
  void onTeacherCameraOff(std::function<void(void)>&& callback);
  void onTeacherCameraOn(std::function<void(void)>&& callback);
  void onTeacherMicOff(std::function<void(void)>&& callback);
  void onTeacherMicOn(std::function<void(void)>&& callback);
  void onCloseVideoInteract(std::function<void(void)>&& callback);
  void onOpenVideoInteract(std::function<void(void)>&& callback);
  void onCloseGroupSpeech(std::function<void(void)>&& callback);
  void onOpenGroupSpeech(std::function<void(void)>&& callback);
  void onEndClass(std::function<void(void)>&& callback);
  void onBeginClass(std::function<void(void)>&& callback);


 public:
  EduSession();
  ~EduSession() = default;

 private:
  std::shared_ptr<SessionBase> base_;
  std::vector<std::function<void(int)>> connectors_;
  std::function<void(int)> reconnenct_;
  std::string app_id_;
};

}  // namespace vrd