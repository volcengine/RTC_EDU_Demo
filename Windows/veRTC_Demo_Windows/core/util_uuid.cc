#include "util_uuid.h"
#include <QUuid>
#include <QSysInfo>

namespace vrd {
	namespace util {
		std::string newUuid() {
			QUuid uuid = QUuid::createUuid();
			return uuid.toString(QUuid::Id128).toUtf8().constData();
		}

		std::string machineUuid() {
			static std::string machine_uuid;
			if (machine_uuid.empty()) {
				// 在同一台计算机上运行多个实例时，使它们的设备ID不一样。
				QByteArray bytes; // = QSysInfo::machineUniqueId();
				if (!bytes.isEmpty()) {
					QUuid uuid(bytes);
					machine_uuid = uuid.toString(QUuid::Id128).toUtf8();
				}
				else {
					machine_uuid = newUuid();
				}
			}
			return machine_uuid;
		}
	}
}
