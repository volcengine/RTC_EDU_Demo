#include "util_tip.h"
#include <QApplication>
#include <QMessageBox>
#include "component/toast.h"
#include "component/alert.h"
#include "util_error.h"

namespace vrd
{
	namespace util
	{
		void showToastInfo(const std::string &info, int duration)
		{
			Toast::showTip(info.c_str(), QApplication::activeWindow(), duration);
		}

		void showToastError(int64_t err_code, const std::string &err_msg, int duration)
		{
			if (0 != err_code)
			{
				Toast::showTip(QString::asprintf("(%d) %s", (int)err_code, err_msg.c_str()), QApplication::activeWindow(), duration, true);
			}
			else
			{
				Toast::showTip(err_msg.c_str(), QApplication::activeWindow(), duration, true);
			}
		}

		void showBackendError(int64_t err_code, const std::string& err_msg)
		{
			auto err_info = util::getErrorInfo(err_code);
			if (err_info != nullptr)
			{
				if (err_info->is_error) {
					util::showToastError(0, err_info->error_msg);
				}
				else
				{
					util::showToastInfo(err_info->error_msg);
				}
			}
			else
			{
				util::showToastError(0, err_msg);
			}
		}

		void showFixedToastInfo(const std::string& info)
		{
			Toast::showFixedTip(info.c_str(), QApplication::activeWindow());
		}

		void closeFixedToast()
		{
			Toast::closeFixedTip();
		}

		bool showAlertConfirm(const std::string &info)
		{
			Alert*  alert = new Alert(QApplication::activeWindow());
			alert->setText(info.c_str());
            return (QDialog::Accepted == alert->exec());
		}
	}
}
