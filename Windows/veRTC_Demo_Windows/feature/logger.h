#pragma once
#include <QtGlobal>
class QMessageLogContext;
class QString;

namespace Common {
	namespace log {
		void outputMessage(QtMsgType type, const QMessageLogContext& context, const QString& msg);
	}
}

