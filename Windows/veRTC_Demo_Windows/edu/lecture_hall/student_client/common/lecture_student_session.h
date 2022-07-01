#ifndef VRD_LETURESTUDENTSESSION_H
#define VRD_LETURESTUDENTSESSION_H

#include "core/component_interface.h"
#include "edu/core/edu_session.h"
#include "../../common/lecture_hall_session.h"

namespace vrd
{
	class LectureStudentSession : public IComponent, public LectureHallSession
	{
	public:
		static void registerThis();

	private:
		LectureStudentSession();

	public:
		void handsUp(const std::string &room_id, std::function<void(int64_t code)> &&callback);
		void cancelHandsUp(const std::string &room_id, std::function<void(int64_t code)> &&callback);

	private:
		std::shared_ptr<SessionBase> base_;
	};
}

#endif // VRD_LETURESTUDENTSESSION_H
