#ifndef VRD_LECTURETEACHEDATAMGR_H
#define VRD_LECTURETEACHEDATAMGR_H

#include <memory>
#include <list>
#include "core/component_interface.h"
#include "core/timer_helper.h"
#include "lecture_teacher_session.h"
#include "lecture_teacher_event.h"

namespace vrd
{
	class LectureTeacherDataMgr : public IComponent
	{
	public:
		static void registerThis();

	private:
		LectureTeacherDataMgr();

	public:
		bool start();
		void end();

	public:
		void updateApplicants();
		void updateSpeakers();

		const std::shared_ptr<std::list<std::unique_ptr<Applicant>>> &getApplicants();
		const std::shared_ptr<std::list<std::unique_ptr<Student>>> &getSpeakers();
		
		bool hasVideo(const std::string &user_id);
		void setVideoWindow(const std::string &user_id, void *wndId);

		void approval(const std::string &user_id);
		void disconnect(const std::string &user_id);

		LectureTeacherEvent *getEvent();

	private:
		int start_count_;
		TimerHelper timer_helper_;

		std::shared_ptr<std::list<std::unique_ptr<Applicant>>> applicants_;
		std::shared_ptr<std::list<std::unique_ptr<Student>>> speakers_;

		LectureTeacherEvent evt_;

		std::shared_ptr<LectureTeacherSession> session_;
		std::shared_ptr<SessionBase> session_base_;
	};
}

#endif // VRD_LECTURETEACHEDATAMGR_H
