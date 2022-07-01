#include "lecture_student_event.h"

namespace vrd
{
	void LectureStudentEvent::emitSpeakersChanged()
	{
		emit sigSpeakersChanged();
	}

	void LectureStudentEvent::emitSpeakersChanged4Mark()
	{
		emit sigSpeakersChanged4Mark();
	}

	void LectureStudentEvent::emitVideoAdd(const std::string &user_id)
	{
		emit sigVideoAdd(user_id);
	}

	void LectureStudentEvent::emitVideoRemove(const std::string &user_id)
	{
		emit sigVideoRemove(user_id);
	}

	void LectureStudentEvent::emitApplyChanged(bool applied)
	{
		emit sigApplyChanged(applied);
	}
}
