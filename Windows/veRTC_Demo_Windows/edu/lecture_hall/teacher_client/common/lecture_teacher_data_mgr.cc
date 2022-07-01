#include "lecture_teacher_data_mgr.h"

#include "app_ui_state.h"
#include "core/application.h"
#include "core/edu_rtc_engine_wrap.h"
#include "edu/core/data_mgr.h"
#include "feature/data_mgr.h"

namespace vrd {
void LectureTeacherDataMgr::registerThis() {
  VRD_FUNC_RIGESTER_COMPONET(vrd::LectureTeacherDataMgr, LectureTeacherDataMgr);
}

LectureTeacherDataMgr::LectureTeacherDataMgr()
    : start_count_(0),
      applicants_(new std::list<std::unique_ptr<Applicant>>()),
      speakers_(new std::list<std::unique_ptr<Student>>())
{
  session_ = VRD_FUNC_GET_COMPONET(vrd::LectureTeacherSession);
  session_base_ = VRD_FUNC_GET_COMPONET(vrd::SessionBase);
}

bool LectureTeacherDataMgr::start() {
  if (0 == start_count_) {
    EduRTCEngineWrap::setMainStreamListener(
        [this](const std::string &user_id, bool add) {
          if (add) {
            evt_.emitVideoAdd(user_id);
          } else {
            evt_.emitVideoRemove(user_id);
          }
        });

    session_->onStuMicOn(
        [this](const std::string &room_id, const std::string &user_id,
               const std::string &user_name) { updateSpeakers(); });
    session_->onStuMicOff(
        [this](const std::string &room_id, const std::string &user_id) {
          updateSpeakers();
        });

    timer_helper_.start(5000, [this]() { updateApplicants(); });
  }

  ++start_count_;

  return true;
}

void LectureTeacherDataMgr::end() {
	if (start_count_ > 0) {
		--start_count_;
		if (0 == start_count_) {
			timer_helper_.stop();

			session_->offStuMicOn();
			session_->offStuMicOff();

			EduRTCEngineWrap::setMainStreamListener(nullptr);

			speakers_->clear();
			applicants_->clear();
		}
	}
}

void LectureTeacherDataMgr::updateApplicants() {
  session_->getHandsUpList(
      vrd::DataMgr::instance().room_id(),
      [this](
          const std::shared_ptr<std::list<std::unique_ptr<Applicant>>> &list) {
        if (list) {
          applicants_ = list;
        }
        evt_.emitApplicantsChanged();
      });
}

void LectureTeacherDataMgr::updateSpeakers() {
  session_->getStuMicOnList(
      vrd::DataMgr::instance().room_id(),
      [this](const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list) {
        if (list) {
          speakers_ = list;
        }
        evt_.emitSpeakersChanged();
      });
}

const std::shared_ptr<std::list<std::unique_ptr<Applicant>>>
    &LectureTeacherDataMgr::getApplicants() {
  return applicants_;
}

const std::shared_ptr<std::list<std::unique_ptr<Student>>>
    &LectureTeacherDataMgr::getSpeakers() {
  return speakers_;
}

bool LectureTeacherDataMgr::hasVideo(const std::string &user_id) {
  return EduRTCEngineWrap::instance().mainHasVideoStream(user_id);
}

void LectureTeacherDataMgr::setVideoWindow(const std::string &user_id,
                                           void *wnd_id) {
  if (!EduRTCEngineWrap::hasMainRoom()) {
    EduRTCEngineWrap::setupRemoteView(wnd_id, bytertc::kRenderModeHidden,
                                      user_id);
  } else {
    EduRTCEngineWrap::setupRemoteViewMainRoom(
        wnd_id, bytertc::kRenderModeHidden, user_id);
  }
}

void LectureTeacherDataMgr::approval(const std::string &user_id) {
  session_->approveMic(vrd::DataMgr::instance().room_id(), user_id,
	  [this](int64_t code) {
		  if (code == 200) {
			  updateApplicants();
		  }
	  });
}

void LectureTeacherDataMgr::disconnect(const std::string &user_id) {
  session_->forceMicOff(vrd::DataMgr::instance().room_id(), user_id,
	  [this](int64_t code) {
		  if (code == 200) {
			  updateSpeakers();
		  }
	  });
}

LectureTeacherEvent *LectureTeacherDataMgr::getEvent() { 
    return &evt_; 
}
}  // namespace vrd
