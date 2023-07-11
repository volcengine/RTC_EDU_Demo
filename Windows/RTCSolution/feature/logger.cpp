#include "logger.h"
#include <QMutex>
#include <QFile>
#include <QDateTime> 
#include <QTextStream> 
#include <QStandardPaths>
#include <QDir>

namespace Common {
	namespace log {

		static QString getLogFilePath() {
			static QString filePath;
			if (filePath.isEmpty()) {
				auto paths = QStandardPaths::standardLocations(QStandardPaths::StandardLocation::AppDataLocation);
				QString strPath;
				if (paths.empty()) {
					strPath = "vertc_log/";
				}else {
					strPath = paths[0] + "/vertc_log/";
				}
				
				QDir d;
				if (!d.exists(strPath)) {
					d.mkpath(strPath);
				}
				QString date_time = QDateTime::currentDateTime().toString("yyyy-MM-dd_hh-mm-ss");
				auto fileName = date_time + "_log.txt";
				filePath = strPath + fileName;
			}
			return filePath;
		}

		void outputMessage(QtMsgType type, const QMessageLogContext& context, const QString& msg)
		{
			static QMutex mutex;
			mutex.lock();

			QString text;
			switch (type)
			{
			case QtDebugMsg:
				text = QString("Debug:");
				break;
			case QtInfoMsg:
				text = QString("Info:");
				break;
			case QtWarningMsg:
				text = QString("Warning:");
				break;
			case QtCriticalMsg:
				text = QString("Critical:");
				break;
			case QtFatalMsg:
				text = QString("Fatal:");
			}
			//QString context_info = QString("File:(%1) Line:(%2)").arg(QString(context.file)).arg(context.line);
			QString current_date_time = QDateTime::currentDateTime().toString("yyyy-MM-dd hh:mm:ss:zzz");
			QString current_date = QString("%1").arg(current_date_time);
			QString message = QString("%1 %2 %3").arg(current_date).arg(text).arg(msg);
			QFile file(getLogFilePath());
			file.open(QIODevice::WriteOnly | QIODevice::Append);
			QTextStream text_stream(&file);
			text_stream << message << "\r\n";
			file.flush();
			file.close();
			mutex.unlock();
		}
	}
}