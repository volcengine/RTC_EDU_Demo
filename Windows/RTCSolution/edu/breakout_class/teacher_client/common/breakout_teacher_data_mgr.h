#ifndef VRD_BREAKOUTTEACHERDATAMGR_H
#define VRD_BREAKOUTTEACHERDATAMGR_H

#include <memory>
#include <list>
#include "core/component_interface.h"
#include "breakout_teacher_session.h"
#include "breakout_teacher_event.h"
#include "breakout_teacher_data_def.h"

namespace vrd
{
	class BreakoutTeacherDataMgr : public IComponent
	{
	public:
		static void registerThis();

	private:
		BreakoutTeacherDataMgr();

	public:
		bool start();
		void end();

	public:
		int getGroupList();
		int getGroupStudents(const std::string &group_id);

		bool hasVideo(const std::string &user_id);
		void setVideoWindow(const std::string &user_id, void *wnd_id);

		void nextGroupRoom(const std::string &room_id, const std::string &room_token);

		BreakoutTeacherEvent *getEvent();

	private:
		int start_count_;

		int max_callback_key_;

		BreakoutTeacherEvent evt_;

		std::shared_ptr<BreakoutTeacherSession> session_;
	};
}

#endif // VRD_BREAKOUTTEACHERDATAMGR_H
