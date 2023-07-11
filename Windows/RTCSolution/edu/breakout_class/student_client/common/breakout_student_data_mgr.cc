#include "breakout_student_data_mgr.h"

#include "app_ui_state.h"
#include "core/application.h"
#include "core/edu_rtc_engine_wrap.h"
#include "edu/core/data_mgr.h"
#include "feature/data_mgr.h"
namespace vrd {
void BreakoutStudentDataMgr::registerThis() {
  VRD_FUNC_RIGESTER_COMPONET(vrd::BreakoutStudentDataMgr,
                             BreakoutStudentDataMgr);
}

BreakoutStudentDataMgr::BreakoutStudentDataMgr()
    : start_count_(0),
      group_index_(0),
      classmates_(new std::list<std::unique_ptr<Student>>()),
      is_pulishing_(false),
      is_discussing_(false),
      conn_key_(0) {
  data_mgr_base_ = VRD_FUNC_GET_COMPONET(vrd::LectureStudentDataMgr);
  session_ = VRD_FUNC_GET_COMPONET(vrd::BreakoutStudentSession);
  session_base_ = VRD_FUNC_GET_COMPONET(vrd::EduSession);

  QObject::connect(data_mgr_base_->getEvent(),
                   &LectureStudentEvent::sigSpeakersChanged4Mark, getEvent(),
                   &BreakoutStudentEvent::onSpeakersChanged4Mark);
}

bool BreakoutStudentDataMgr::start() {
	if (0 == start_count_) {
		group_index_ = Edu::DataMgr::instance().student_join_class_room().room_idx;
		group_room_id_ = Edu::DataMgr::instance().student_join_class_room().group_room_id;

		EduRTCEngineWrap::setGroupStreamListener(
			[this](const std::string& user_id, bool add) {
				if (add) {
					evt_.emitVideoAdd(user_id.empty() ? vrd::DataMgr::instance().user_id() : user_id);
				}
				else {
					evt_.emitVideoRemove(user_id.empty() ? vrd::DataMgr::instance().user_id() : user_id);
				}
			});

		evt_.setMarkListener([this]() {
			auto p = data_mgr_base_->getSpeakers();
			if (p) {
				bool speaking = false;
				std::string myself = vrd::DataMgr::instance().user_id();
				for (auto cit = p->cbegin(); cit != p->cend(); ++cit) {
					if ((*cit)->user_id == myself) {
						speaking = true;
						break;
					}
				}
				publish2Group(!speaking);
				evt_.emitSpeakersChanged4Mark();
			}
			});

		session_->onStudentJoinGroupRoom([this](const std::string& room_id,
			const std::string& user_id,
			const std::string& user_name) {
				if (room_id ==
					Edu::DataMgr::instance().student_join_class_room().group_room_id) {
					bool add = true;
					for (auto cit = classmates_->cbegin(); cit != classmates_->cend();
						++cit) {
						if ((*cit)->user_id == user_id) {
							add = false;
							break;
						}
					}

					if (add) {
						std::unique_ptr<Student> classmate(new Student());
						classmate->user_id = user_id;
						classmate->user_name = user_name;
						classmates_->emplace_back(std::move(classmate));

						evt_.emitClassmatesChanged();
					}
				}
			});
		session_->onStudentLeaveGroupRoom([this](const std::string& room_id,
			const std::string& user_id) {
				if (room_id ==
					Edu::DataMgr::instance().student_join_class_room().group_room_id) {
					bool del = false;
					for (auto cit = classmates_->cbegin(); cit != classmates_->cend();) {
						if ((*cit)->user_id == user_id) {
							del = true;
							cit = classmates_->erase(cit);
						}
						else {
							++cit;
						}
					}

					if (del) {
						evt_.emitClassmatesChanged();
					}
				}
			});

		std::shared_ptr<std::list<std::unique_ptr<Student>>> list(
			new std::list<std::unique_ptr<Student>>());

		auto group_users =
			Edu::DataMgr::instance().student_join_class_room().group_user_list;
		for (auto cit = group_users.cbegin(); cit != group_users.cend(); ++cit) {
			std::unique_ptr<Student> classmate(new Student());
			classmate->user_id = cit->user_id;
			classmate->user_name = cit->user_name;
			list->emplace_back(std::move(classmate));
		}

		classmates_ = list;

		publish2Group(true);
	}

	++start_count_;

	return true;
}

void BreakoutStudentDataMgr::end() {
  if (start_count_ > 0) {
    --start_count_;

    if (0 == start_count_) {
      evt_.setMarkListener(nullptr);
      conn_key_ = 0;

      EduRTCEngineWrap::setGroupStreamListener(nullptr);
    }
  }
}

void BreakoutStudentDataMgr::updateClassmates() {
  session_base_->stuJoinClass(
      Edu::DataMgr::instance().student_join_class_room().room_info.room_id,
      vrd::DataMgr::instance().user_id(), vrd::DataMgr::instance().user_name(),
      [this](int code) {
        if (200 == code) {
          std::shared_ptr<std::list<std::unique_ptr<Student>>> list(
              new std::list<std::unique_ptr<Student>>());

          auto groupUsers = Edu::DataMgr::instance()
                                .student_join_class_room()
                                .group_user_list;
          for (auto cit = groupUsers.cbegin(); cit != groupUsers.cend();
               ++cit) {
            std::unique_ptr<Student> classmate(new Student());
            classmate->user_id = cit->user_id;
            classmate->user_name = cit->user_name;
            list->emplace_back(std::move(classmate));
          }

          classmates_ = list;
          evt_.emitClassmatesChanged();
        }
      },
      true);
}

int64_t BreakoutStudentDataMgr::getGroupIndex() { return group_index_; }

const std::shared_ptr<std::list<std::unique_ptr<Student>>>
    &BreakoutStudentDataMgr::getClassmates() {
  return classmates_;
}

const std::shared_ptr<std::list<std::unique_ptr<Student>>>
    &BreakoutStudentDataMgr::getSpeakers() {
  return data_mgr_base_->getSpeakers();
}

bool BreakoutStudentDataMgr::getDiscussing() { return is_discussing_; }

bool BreakoutStudentDataMgr::hasVideo(const std::string &user_id) {
	if (isMyself(user_id)) {
		return true/*EduRTCEngineWrap::groupHasVideoStream("")*/;
	}
	return EduRTCEngineWrap::groupHasVideoStream(user_id);
}

void BreakoutStudentDataMgr::setVideoWindow(const std::string &user_id,
                                            void *wnd_id) {
  bytertc::VideoCanvas canvas(wnd_id, bytertc::kRenderModeHidden, 0);
  if (isMyself(user_id)) {
    EduRTCEngineWrap::setupLocalView(wnd_id, bytertc::kRenderModeHidden,
                                     user_id);
  } else {
    if (EduRTCEngineWrap::hasGroupRoom()) {
      EduRTCEngineWrap::setupRemoteViewGroupRoom(
          wnd_id, bytertc::kRenderModeHidden, user_id);
    }
  }
}

bool BreakoutStudentDataMgr::isMyself(const std::string &user_id) {
  return !user_id.empty() && (user_id == vrd::DataMgr::instance().user_id());
}

void BreakoutStudentDataMgr::allDiscuss(bool discuss) {
  if (is_discussing_ != discuss) {
    is_discussing_ = discuss;

    if (is_discussing_) {
      publish2Group(false);
    } else {
      publish2Group(true);
    }

    evt_.emitDiscussingChanged(is_discussing_);
  }
}

BreakoutStudentEvent *BreakoutStudentDataMgr::getEvent() { return &evt_; }

void BreakoutStudentDataMgr::publish2Group(bool pulish) {
  if (is_pulishing_ != pulish) {
    is_pulishing_ = pulish;

    if (is_pulishing_) {
      EduRTCEngineWrap::enableLocalVideo(true);
      EduRTCEngineWrap::enableLocalAudio(false);
      EduRTCEngineWrap::muteLocalVideo(false);
      EduRTCEngineWrap::muteLocalAudio(true);

      EduRTCEngineWrap::setGroupUserRole(bytertc::kUserRoleTypeBroadcaster);
	  EduRTCEngineWrap::unPublishGroupRoom(bytertc::kMediaStreamTypeAudio);
      EduRTCEngineWrap::publishGroupRoom(bytertc::kMediaStreamTypeVideo);
    } else {
	  EduRTCEngineWrap::unPublishGroupRoom(bytertc::kMediaStreamTypeAudio);
      EduRTCEngineWrap::unPublishGroupRoom(bytertc::kMediaStreamTypeVideo);
      EduRTCEngineWrap::setGroupUserRole(bytertc::kUserRoleTypeSilentAudience);
    }
  }
}  // namespace vrd
}  // namespace vrd