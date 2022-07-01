#ifndef VRD_LECTUREHALLSESSION_H
#define VRD_LECTUREHALLSESSION_H

#include <string>
#include <functional>
#include "core/session_base.h"

namespace vrd
{
	class LectureHallSession
	{
	public:
		LectureHallSession();

	public:
		void onStuMicOn(std::function<void(const std::string &room_id, const std::string &user_id, const std::string &user_name)> &&listener);
		void offStuMicOn();

		void onStuMicOff(std::function<void(const std::string &room_id, const std::string &user_id)> &&listener);
		void offStuMicOff();

	private:
		std::shared_ptr<SessionBase> base_;
	};
}

#endif // VRD_LECTUREHALLSESSION_H
