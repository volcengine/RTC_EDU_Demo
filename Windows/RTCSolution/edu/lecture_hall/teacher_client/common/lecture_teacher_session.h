#ifndef VRD_LECTURETEACHERSESSION_H
#define VRD_LECTURETEACHERSESSION_H

#include <string>
#include <functional>
#include <list>
#include <memory>
#include "core/component_interface.h"
#include "core/session_base.h"
#include "../../common/lecture_hall_session.h"
#include "lecture_teacher_data_def.h"

namespace vrd
{
	class LectureTeacherSession : public IComponent, public LectureHallSession
	{
	public:
		static void registerThis();

	private:
		LectureTeacherSession();

	public:
		void getHandsUpList(const std::string &room_id, std::function<void(const std::shared_ptr<std::list<std::unique_ptr<Applicant>>> &list)> &&callback);
		void getStuMicOnList(const std::string &room_id, std::function<void(const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list)> &&callback);
		void approveMic(const std::string &room_id, const std::string &student, std::function<void(int64_t code)> &&callback);
		void forceMicOff(const std::string &room_id, const std::string &student, std::function<void(int64_t code)> &&callback);

	private:
		std::shared_ptr<SessionBase> base_;
	};
}

#endif // VRD_LECTURETEACHERSESSION_H
