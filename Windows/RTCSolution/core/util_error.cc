#include "util_error.h"
#include<QObject>

static const vrd::ErrorInfo errorInfos[] = 
{
	{ 406, QObject::tr("network_messsage_406").toUtf8().data(), true },
	{ 422, QObject::tr("network_messsage_422").toUtf8().data(), true },
	{ 430, QObject::tr("network_messsage_430").toUtf8().data(), true },
	{ 440, QObject::tr("network_messsage_440").toUtf8().data(), true },
	{ 441, QObject::tr("network_messsage_441").toUtf8().data(), true },
	{ 450, QObject::tr("network_messsage_450").toUtf8().data(), true },
	{ 472, QObject::tr("network_messsage_472").toUtf8().data(), false },
	{ 500, QObject::tr("network_messsage_500").toUtf8().data(), true },
	{ 504, QObject::tr("network_messsage_504").toUtf8().data(), true },
	{ 702, QObject::tr("network_messsage_702").toUtf8().data(), true },

	{ 0, nullptr, false }
};

namespace vrd
{
	namespace util
	{
		const ErrorInfo *getErrorInfo(int64_t code)
		{
			const ErrorInfo *p = errorInfos;
			while (p->error_code != 0)
			{
				if (p->error_code == code)
				{
					return p;
				}

				++p;
			}

			return nullptr;
		}
	}
}
