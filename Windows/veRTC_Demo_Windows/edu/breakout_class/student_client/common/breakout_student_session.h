#ifndef VRD_BREAKOUTSTUDENTSESSION_H
#define VRD_BREAKOUTSTUDENTSESSION_H

#include "core/component_interface.h"
#include "core/session_base.h"

namespace vrd
{
	class BreakoutStudentSession : public IComponent
	{
	public:
		static void registerThis();

	private:
		BreakoutStudentSession();

	public:
		void onStudentJoinGroupRoom(std::function<void(const std::string &room_id, const std::string &user_id, const std::string &user_name)> &&listener);
		void onStudentLeaveGroupRoom(std::function<void(const std::string &room_id, const std::string &user_id)> &&listener);

	private:
		std::shared_ptr<SessionBase> base_;
	};
}

#endif // VRD_BREAKOUTSTUDENTSESSION_H
