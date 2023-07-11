#include "lecture_student_data_mgr.h"

#include "app_ui_state.h"
#include "core/application.h"
#include "feature/data_mgr.h"
#include "edu/core/data_mgr.h"
#include "edu/core/edu_rtc_engine_wrap.h"

namespace vrd {
void LectureStudentDataMgr::registerThis() {
  VRD_FUNC_RIGESTER_COMPONET(vrd::LectureStudentDataMgr, LectureStudentDataMgr);
}

LectureStudentDataMgr::LectureStudentDataMgr()
    : start_count_(0),
      speakers_(new std::list<std::unique_ptr<Student>>()),
      is_applied_(false),
      speech_open_(false),
      is_speaking_(false),
      conn_key_(0) {
  session_ = VRD_FUNC_GET_COMPONET(vrd::LectureStudentSession);
  session_base_ = VRD_FUNC_GET_COMPONET(vrd::EduSession);
}

bool LectureStudentDataMgr::start() {
  if (0 == start_count_) {
    EduRTCEngineWrap::setMainStreamListener(
        [this](const std::string &user_id, bool add) {
          if ("" == user_id) {
            if (add) {
              evt_.emitVideoAdd(vrd::DataMgr::instance().user_id());
            } else {
              evt_.emitVideoRemove(vrd::DataMgr::instance().user_id());
            }
          } else {
            if (add) {
              evt_.emitVideoAdd(user_id);
            } else {
              evt_.emitVideoRemove(user_id);
            }
          }
        });

    session_->onStuMicOn([this](const std::string &room_id,
                                const std::string &user_id,
                                const std::string &user_name) {
      if (room_id == Edu::DataMgr::instance()
                         .student_join_class_room()
                         .room_info.room_id) {
        bool add = true;
        for (auto cit = speakers_->cbegin(); cit != speakers_->cend(); ++cit) {
          if ((*cit)->user_id == user_id) {
            add = false;
            break;
          }
        }

        if (add) {
          std::unique_ptr<Student> speaker(new Student());
          speaker->user_id = user_id;
          speaker->user_name = user_name;
          speakers_->emplace_back(std::move(speaker));

          emitSpeakersChanged();
        }
      }
    });
    session_->onStuMicOff(
        [this](const std::string &room_id, const std::string &user_id) {
          if (room_id == Edu::DataMgr::instance()
                             .student_join_class_room()
                             .room_info.room_id) {
            bool del = false;
            for (auto cit = speakers_->cbegin(); cit != speakers_->cend();) {
              if ((*cit)->user_id == user_id) {
                del = true;
                cit = speakers_->erase(cit);
              } else {
                ++cit;
              }
            }

            if (del) {
              emitSpeakersChanged();
            }
          }
        });

    std::shared_ptr<std::list<std::unique_ptr<Student>>> list(
        new std::list<std::unique_ptr<Student>>());

    auto speak_users =
        Edu::DataMgr::instance().student_join_class_room().current_mic_user;
    for (auto cit = speak_users.cbegin(); cit != speak_users.cend(); ++cit) {
      std::unique_ptr<Student> speaker(new Student());
      speaker->user_id = cit->user_id;
      speaker->user_name = cit->user_name;
      list->emplace_back(std::move(speaker));
    }

    speakers_ = list;
    is_applied_ = Edu::DataMgr::instance()
                      .student_join_class_room()
                      .user_info.is_hands_up;
  }

  ++start_count_;

  return true;
}

void LectureStudentDataMgr::end() {
  if (start_count_ > 0) {
    --start_count_;

    if (0 == start_count_) {
      session_->offStuMicOn();
      session_->offStuMicOff();
      conn_key_ = 0;

      EduRTCEngineWrap::setMainStreamListener(nullptr);

      speakers_->clear();
    }
  }
}

void LectureStudentDataMgr::updateSpeakersAndApplied() {
  session_base_->stuJoinClass(
      Edu::DataMgr::instance().student_join_class_room().room_info.room_id,
      vrd::DataMgr::instance().user_id(), vrd::DataMgr::instance().user_name(),
      [this](int code) {
        if (200 == code) {
          std::shared_ptr<std::list<std::unique_ptr<Student>>> list(
              new std::list<std::unique_ptr<Student>>());

          auto speak_users = Edu::DataMgr::instance()
                                 .student_join_class_room()
                                 .current_mic_user;
          for (auto cit = speak_users.cbegin(); cit != speak_users.cend();
               ++cit) {
            std::unique_ptr<Student> speaker(new Student());
            speaker->user_id = cit->user_id;
            speaker->user_name = cit->user_name;
            list->emplace_back(std::move(speaker));
          }

          speakers_ = list;
          emitSpeakersChanged();

          is_applied_ = Edu::DataMgr::instance()
                            .student_join_class_room()
                            .user_info.is_hands_up;
          evt_.emitApplyChanged(is_applied_);
        }
      },
      true);
}

const std::shared_ptr<std::list<std::unique_ptr<Student>>>
    &LectureStudentDataMgr::getSpeakers() {
  return speakers_;
}

bool LectureStudentDataMgr::getApplied() { return is_applied_; }

bool LectureStudentDataMgr::hasVideo(const std::string &user_id) {
  if (isMyself(user_id)) {
    return EduRTCEngineWrap::mainHasVideoStream("");
  }

  return EduRTCEngineWrap::mainHasVideoStream(user_id);
}

void LectureStudentDataMgr::setVideoWindow(const std::string &user_id,
                                           void *wnd_id) {
  if (isMyself(user_id)) {
    EduRTCEngineWrap::setupLocalView(wnd_id, bytertc::kRenderModeHidden,
                                     user_id);
  } else {
    if (!EduRTCEngineWrap::hasMainRoom()) {
      EduRTCEngineWrap::setupRemoteView(wnd_id, bytertc::kRenderModeHidden,
                                        user_id);
    } else {
      EduRTCEngineWrap::setupRemoteViewMainRoom(
          wnd_id, bytertc::kRenderModeHidden, user_id);
    }
  }
}

bool LectureStudentDataMgr::isMyself(const std::string &user_id) {
  return !user_id.empty() && (user_id == vrd::DataMgr::instance().user_id());
}

void LectureStudentDataMgr::apply(bool cancel) {
  if (!cancel) {
    session_->handsUp(
        Edu::DataMgr::instance().student_join_class_room().room_info.room_id,
        [this](int64_t code) {
          if (200 == code) {
            is_applied_ = true;
            evt_.emitApplyChanged(is_applied_);
          }
        });
  } else {
    session_->cancelHandsUp(
        Edu::DataMgr::instance().student_join_class_room().room_info.room_id,
        [this](int64_t code) {
          if (200 == code) {
            is_applied_ = false;
            evt_.emitApplyChanged(is_applied_);
          }
        });
  }
}

void LectureStudentDataMgr::speechStart() { speech_open_ = true; }

void LectureStudentDataMgr::speechEnd() {
  speakers_->clear();
  emitSpeakersChanged();

  speech_open_ = false;
}

LectureStudentEvent *LectureStudentDataMgr::getEvent() { return &evt_; }

void LectureStudentDataMgr::emitSpeakersChanged() {
  if (!speech_open_) {
    return;
  }

  bool speaking = false;

  std::string myself = vrd::DataMgr::instance().user_id();
  for (auto cit = speakers_->cbegin(); cit != speakers_->cend(); ++cit) {
    if ((*cit)->user_id == myself) {
      speaking = true;
      break;
    }
  }

  if (speaking) {
    evt_.emitSpeakersChanged4Mark();
    evt_.emitSpeakersChanged();

    setSpeaking(true);
  } else {
    setSpeaking(false);

    evt_.emitSpeakersChanged();
    evt_.emitSpeakersChanged4Mark();
  }
}

void LectureStudentDataMgr::setSpeaking(bool speaking) {
  if (is_speaking_ != speaking) {
    is_speaking_ = speaking;

    if (is_speaking_) {
      EduRTCEngineWrap::enableLocalVideo(true);
      EduRTCEngineWrap::enableLocalAudio(true);
      EduRTCEngineWrap::muteLocalVideo(bytertc::kMuteStateOff);
      EduRTCEngineWrap::muteLocalAudio(bytertc::kMuteStateOff);

      if (!EduRTCEngineWrap::hasMainRoom()) {
        EduRTCEngineWrap::setUserRole(bytertc::kUserRoleTypeBroadcaster);
        EduRTCEngineWrap::publish();
      } else {
        EduRTCEngineWrap::setMainUserRole(bytertc::kUserRoleTypeBroadcaster);
        EduRTCEngineWrap::publishMainRoom();
      }
    } else {
      if (!EduRTCEngineWrap::hasMainRoom()) {
        EduRTCEngineWrap::unPublish();
        EduRTCEngineWrap::setUserRole(bytertc::kUserRoleTypeSilentAudience);
      } else {
        EduRTCEngineWrap::unPublishMainRoom();
        EduRTCEngineWrap::setMainUserRole(bytertc::kUserRoleTypeSilentAudience);
      }
    }
  }
}
}  // namespace vrd
