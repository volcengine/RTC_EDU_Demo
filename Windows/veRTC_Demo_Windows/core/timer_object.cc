#include "timer_object.h"
#include <QMetaType>

namespace vrd
{
	TimerObject::TimerObject()
		: timer_(this)
	{
		connect(&timer_, &QTimer::timeout, this, QOverload<>::of(&TimerObject::onTimeout));
	}

	void TimerObject::start(int msec, std::function<void(void)> &&callback)
	{
		cb_ = callback;
		timer_.start(msec);
	}

	void TimerObject::stop()
	{
		timer_.stop();
	}

	void TimerObject::onTimeout()
	{
		if (cb_)
		{
			cb_();
		}
	}
}
