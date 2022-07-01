#ifndef VRD_LETURESTUDENTDATAMGR_H
#define VRD_LETURESTUDENTDATAMGR_H

#include "core/component_interface.h"
#include "edu/core/data_def_base.h"
#include "lecture_student_session.h"
#include "lecture_student_event.h"

namespace vrd
{
	class LectureStudentDataMgr : public IComponent
	{
	public:
		static void registerThis();

	private:
		LectureStudentDataMgr();

	public:
		bool start();
		void end();

	public:
		void updateSpeakersAndApplied();

		const std::shared_ptr<std::list<std::unique_ptr<Student>>> &getSpeakers();
		bool getApplied();

		bool hasVideo(const std::string &user_id);
		void setVideoWindow(const std::string &user_id, void *wnd_id);

		bool isMyself(const std::string &user_id);

		void apply(bool cancel);

		void speechStart();
		void speechEnd();

		LectureStudentEvent *getEvent();

	private:
		void emitSpeakersChanged();

	private:
		void setSpeaking(bool speaking);

	private:
		int start_count_;

		std::shared_ptr<std::list<std::unique_ptr<Student>>> speakers_;
		bool is_applied_;
		bool speech_open_;
		bool is_speaking_;

		LectureStudentEvent evt_;

		std::shared_ptr<LectureStudentSession> session_;

		int conn_key_;
		std::shared_ptr<EduSession> session_base_;
	};
}

#endif // VRD_LETURESTUDENTDATAMGR_H
