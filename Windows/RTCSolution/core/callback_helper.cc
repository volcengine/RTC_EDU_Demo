#include "callback_helper.h"
#include "callback_object.h"

namespace vrd
{
	CallbackHelper::CallbackHelper()
		: object_(new CallbackObject())
	{
	}

	CallbackHelper::~CallbackHelper()
	{
		if (object_ != nullptr)
		{
			object_->deleteLater();
			object_ = nullptr;
		}
	}

	void CallbackHelper::emitCallback(std::function<void(void)>&& cb)
	{
		object_->emitCallback(std::move(cb));
	}
}
