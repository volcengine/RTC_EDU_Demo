#ifndef VRD_UTILTOAST_H
#define VRD_UTILTOAST_H

#include <string>

namespace vrd
{
	namespace util
	{
		void showToastInfo(const std::string &info, int duration = 2 * 1000);
		void showToastError(int64_t err_code, const std::string &err_msg, int duration = 2 * 1000);
		void showBackendError(int64_t err_code, const std::string& err_msg);

		void showFixedToastInfo(const std::string& info);
		void closeFixedToast();

		bool showAlertConfirm(const std::string &info);
	}
}

#endif // VRD_UTILTOAST_H
