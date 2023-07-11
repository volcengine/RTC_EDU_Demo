#include "breakout_teacher_data_mgr.h"

#include "app_ui_state.h"
#include "core/application.h"
#include "core/edu_rtc_engine_wrap.h"
#include "edu/core/data_mgr.h"
#include "feature/data_mgr.h"

namespace vrd {
void BreakoutTeacherDataMgr::registerThis() {
  VRD_FUNC_RIGESTER_COMPONET(vrd::BreakoutTeacherDataMgr,
                             BreakoutTeacherDataMgr);
}

BreakoutTeacherDataMgr::BreakoutTeacherDataMgr()
    : start_count_(0), max_callback_key_(0) {
  session_ = VRD_FUNC_GET_COMPONET(vrd::BreakoutTeacherSession);
}

bool BreakoutTeacherDataMgr::start() {
  if (0 == start_count_) {
    EduRTCEngineWrap::setGroupStreamListener(
        [this](const std::string &user_id, bool add) {
          if (add) {
            evt_.emitVideoAdd(user_id);
          } else {
            evt_.emitVideoRemove(user_id);
          }
        });
  }

  ++start_count_;

  return true;
}

void BreakoutTeacherDataMgr::end() {
  if (start_count_ > 0) {
    --start_count_;
    if (0 == start_count_) {
      EduRTCEngineWrap::setGroupStreamListener(nullptr);
    }
  }
}


int BreakoutTeacherDataMgr::getGroupList() {
  int key = ++max_callback_key_;
  session_->getGroupClassInfo(
      vrd::DataMgr::instance().room_id(),
      [this,
       key](const std::shared_ptr<std::list<std::unique_ptr<Group>>> &list) {
        evt_.emitGroupListArrived(key, list);
      });
  return key;
}

int BreakoutTeacherDataMgr::getGroupStudents(const std::string &groupId) {
  int key = ++max_callback_key_;
  session_->teacherGetGroupStudentsInfo(
      groupId,
      [this,
       key](const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list) {
        evt_.emitGroupStudentsArrived(key, list);
      });
  return key;
}

bool BreakoutTeacherDataMgr::hasVideo(const std::string &user_id) {
  return EduRTCEngineWrap::mainHasVideoStream(user_id);
}

void BreakoutTeacherDataMgr::setVideoWindow(const std::string &user_id,
                                            void *wnd_id) {
  if (EduRTCEngineWrap::hasGroupRoom()) {
    EduRTCEngineWrap::setupRemoteViewGroupRoom(
        wnd_id, bytertc::kRenderModeHidden, user_id);
  }
}

void BreakoutTeacherDataMgr::nextGroupRoom(const std::string &room_id,
                                           const std::string &room_token) {
  if (EduRTCEngineWrap::hasGroupRoom()) {
    EduRTCEngineWrap::destoryGroupRoom();
  }

  EduRTCEngineWrap::createGroupRoom(room_id);
  if (EduRTCEngineWrap::hasGroupRoom()) {
    EduRTCEngineWrap::setGroupUserRole(bytertc::kUserRoleTypeSilentAudience);
    EduRTCEngineWrap::joinGroupRoom(room_token, room_id,
                                    vrd::DataMgr::instance().user_id());
  }
}

BreakoutTeacherEvent *BreakoutTeacherDataMgr::getEvent() { return &evt_; }
}  // namespace vrd
