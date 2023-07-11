#include "callback_object.h"
#include <QMetaType>

Q_DECLARE_METATYPE(std::function<void(void)>)

namespace vrd
{
	CallbackObject::CallbackObject()
	{
		connect(this, &CallbackObject::sigCallback, this, &CallbackObject::onCallback, Qt::QueuedConnection);
	}

	void CallbackObject::emitCallback(std::function<void(void)>&& cb)
	{
		emit sigCallback(cb);
	}

	void CallbackObject::onCallback(const std::function<void(void)>& cb) {
		if (cb) {
			cb();
		}
	}
}
