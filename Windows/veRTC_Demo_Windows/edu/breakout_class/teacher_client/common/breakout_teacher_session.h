#ifndef VRD_BREAKOUTTEACHERSESSION_H
#define VRD_BREAKOUTTEACHERSESSION_H

#include <memory>
#include <list>
#include "core/component_interface.h"
#include "core/session_base.h"
#include "edu/core/data_def_base.h"
#include "breakout_teacher_data_def.h"

namespace vrd
{
	class BreakoutTeacherSession : public IComponent
	{
	public:
		static void registerThis();

	private:
		BreakoutTeacherSession();

	public:
		void getGroupClassInfo(const std::string &room_id, std::function<void(const std::shared_ptr<std::list<std::unique_ptr<Group>>> &list)> &&callback);
		void teacherGetGroupStudentsInfo(const std::string &group_room_id, std::function<void(const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list)> &&callback);

	private:
		std::shared_ptr<SessionBase> base_;
	};
}

#endif // VRD_BREAKOUTTEACHERSESSION_H
