#ifndef VRD_UTILERROR_H
#define VRD_UTILERROR_H

#include <stdint.h>

namespace vrd
{
	struct ErrorInfo
	{
		int64_t error_code = 0;
		const char *error_msg = nullptr;
		bool is_error = true;
	};

	namespace util
	{
		const ErrorInfo *getErrorInfo(int64_t code);
	}
}

#endif // VRD_UTILERROR_H
