#pragma once
#include <mutex>
#include <unordered_map>
#include <QString>
#include <QDateTime>
#include <string>
#include <vector>
#include <sstream>
#include <QFont>

namespace util {
	class SimpleMemoryPool {
	private:
		struct Item {
			unsigned char* addr = nullptr;
			unsigned int size = 0;
			unsigned long ref = 0;

			Item() = default;
			Item(unsigned char* a, unsigned int s, unsigned long r) : addr(a), size(s), ref(r) {
			}
		};

	public:
		~SimpleMemoryPool();
		unsigned char* Malloc(unsigned int size);
		bool Free(unsigned char* addr);
		void CleanFragment();

	private:
		std::list<Item> mFreePools;
		std::unordered_map<unsigned char*, Item> mAllocPools;
		std::mutex mMutex;
	};

	std::string urlEncoder(const std::string &str);
    std::string urlDecoder(const std::string &str);
	QDateTime UTC2Local(const QString& utc_time);

	std::string GetDeviceID();

	QString elideText(const QFont& font, const QString& str, int width);
	
}

