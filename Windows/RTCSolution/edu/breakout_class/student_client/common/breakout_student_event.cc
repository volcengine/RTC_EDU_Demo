#include "breakout_student_event.h"

namespace vrd
{
	void BreakoutStudentEvent::setMarkListener(std::function<void(void)> &&l)
	{
		mark_listener_ = std::move(l);
	}

	void BreakoutStudentEvent::onSpeakersChanged4Mark()
	{
		if (mark_listener_)
		{
			mark_listener_();
		}
	}

	void BreakoutStudentEvent::emitClassmatesChanged()
	{
		emit sigClassmatesChanged();
	}

	void BreakoutStudentEvent::emitSpeakersChanged4Mark()
	{
		emit sigSpeakersChanged4Mark();
	}

	void BreakoutStudentEvent::emitDiscussingChanged(bool discuss)
	{
		emit sigDiscussingChanged(discuss);
	}

	void BreakoutStudentEvent::emitVideoAdd(const std::string &user_id)
	{
		emit sigVideoAdd(user_id);
	}

	void BreakoutStudentEvent::emitVideoRemove(const std::string &user_id)
	{
		emit sigVideoRemove(user_id);
	}
}
