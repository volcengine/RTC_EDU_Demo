#ifndef VRD_BREAKOUTSTUDENTDATAMGR_H
#define VRD_BREAKOUTSTUDENTDATAMGR_H

#include "edu/core/data_def_base.h"
#include "lecture_hall/student_client/common/lecture_student_data_mgr.h"
#include "breakout_student_session.h"
#include "breakout_student_event.h"
#include "edu/core/edu_session.h"

namespace vrd
{
	class BreakoutStudentDataMgr : public IComponent
	{
	public:
		static void registerThis();

	private:
		BreakoutStudentDataMgr();

	public:
		bool start();
		void end();

	public:
		void updateClassmates();

		int64_t getGroupIndex();
		const std::shared_ptr<std::list<std::unique_ptr<Student>>> &getClassmates();
		const std::shared_ptr<std::list<std::unique_ptr<Student>>> &getSpeakers();
		bool getDiscussing();

		bool hasVideo(const std::string &user_id);
		void setVideoWindow(const std::string &user_id, void *wnd_id);

		bool isMyself(const std::string &user_id);

		void allDiscuss(bool discuss);

		BreakoutStudentEvent *getEvent();

	private:
		void refreshPublish();
		void publish2Group(bool pulish);

	private:
		int start_count_;

		int64_t group_index_;
		std::string group_room_id_;

		std::shared_ptr<std::list<std::unique_ptr<Student>>> classmates_;
		bool is_pulishing_;
		bool is_discussing_;

		BreakoutStudentEvent evt_;

		std::shared_ptr<LectureStudentDataMgr> data_mgr_base_;

		std::shared_ptr<BreakoutStudentSession> session_;

		int conn_key_;
		std::shared_ptr<EduSession> session_base_;
	};
}

#endif // VRD_BREAKOUTSTUDENTDATAMGR_H
