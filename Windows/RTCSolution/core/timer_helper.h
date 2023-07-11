#ifndef VRD_TIMERHELPER_H
#define VRD_TIMERHELPER_H

#include <functional>

namespace vrd
{
	class TimerObject;

	class TimerHelper
	{
	public:
		TimerHelper();
		~TimerHelper();

	public:
		void start(int msec, std::function<void(void)>&& callback);
		void stop();

	private:
		TimerObject *object_;
	};
}

#endif // VRD_TIMERHELPER_H
