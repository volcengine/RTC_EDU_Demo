#include "breakout_teacher_event.h"

namespace vrd
{
	void BreakoutTeacherEvent::emitGroupListArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Group>>> &list)
	{
		emit sigGroupListArrived(key, list);
	}

	void BreakoutTeacherEvent::emitGroupStudentsArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list)
	{
		emit sigGroupStudentsArrived(key, list);
	}

	void BreakoutTeacherEvent::emitVideoAdd(const std::string &user_id)
	{
		emit sigVideoAdd(user_id);
	}

	void BreakoutTeacherEvent::emitVideoRemove(const std::string &user_id)
	{
		emit sigVideoRemove(user_id);
	}
}
