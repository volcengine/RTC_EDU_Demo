#include "lecture_teacher_event.h"

namespace vrd
{
	void LectureTeacherEvent::emitApplicantsChanged()
	{
		emit sigApplicantsChanged();
	}

	void LectureTeacherEvent::emitSpeakersChanged()
	{
		emit sigSpeakersChanged();
	}

	void LectureTeacherEvent::emitVideoAdd(const std::string &user_id)
	{
		emit sigVideoAdd(user_id);
	}

	void LectureTeacherEvent::emitVideoRemove(const std::string &user_id)
	{
		emit sigVideoRemove(user_id);
	}
}
