#ifndef VRD_CALLBACKHELPER_H
#define VRD_CALLBACKHELPER_H

#include <functional>

namespace vrd
{
	class CallbackObject;

	class CallbackHelper
	{
	public:
		CallbackHelper();
		~CallbackHelper();

	public:
		void emitCallback(std::function<void(void)>&& cb);

	private:
		CallbackObject *object_;
	};
}

#endif // VRD_CALLBACKHELPER_H
