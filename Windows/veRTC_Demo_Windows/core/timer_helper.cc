#include "timer_helper.h"
#include "timer_object.h"

namespace vrd
{
	TimerHelper::TimerHelper()
		: object_(new TimerObject())
	{
	}

	TimerHelper::~TimerHelper()
	{
		if (object_ != nullptr)
		{
			object_->deleteLater();
			object_ = nullptr;
		}
	}

	void TimerHelper::start(int msec, std::function<void(void)>&& callback)
	{
		object_->start(msec, std::move(callback));
	}

	void TimerHelper::stop()
	{
		object_->stop();
	}
}
