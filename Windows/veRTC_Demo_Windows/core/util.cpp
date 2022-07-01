#include "util.h"

#include <windows.h>

#include <QUrl>
#include <algorithm>
#include <cassert>
#define kBIN_PLACE_HOLDER "_placeholder"

namespace util {
SimpleMemoryPool::~SimpleMemoryPool() {
  std::lock_guard<std::mutex> guard(mMutex);
  for (auto& item : mFreePools) {
    delete[] item.addr;
  }
  mFreePools.clear();

  for (auto& item : mAllocPools) {
    delete[] item.second.addr;
  }
  mAllocPools.clear();
}

unsigned char* SimpleMemoryPool::Malloc(unsigned int size) {
  std::lock_guard<std::mutex> guard(mMutex);
  if (!mFreePools.empty()) {
    auto pos = std::find_if(
        mFreePools.begin(), mFreePools.end(),
        [size](const Item& item) -> bool { return item.size == size; });

    if (pos != mFreePools.end()) {
      pos->ref++;
      unsigned char* addr = pos->addr;
      mAllocPools[addr] = *pos;

      assert(pos->size == size);
      mFreePools.erase(pos);

      memset(addr, 0x00, size);
      return addr;
    }
  }

  unsigned char* addr = new unsigned char[size];
  Item item(addr, size, 0);
  mAllocPools[addr] = item;

  memset(addr, 0x00, size);
  return addr;
}

bool SimpleMemoryPool::Free(unsigned char* addr) {
  std::lock_guard<std::mutex> guard(mMutex);
  auto pos = mAllocPools.find(addr);
  if (pos == mAllocPools.end()) {
    return false;
  }

  mFreePools.emplace_front(pos->second.addr, pos->second.size, pos->second.ref);
  mAllocPools.erase(pos);

  return true;
}

void SimpleMemoryPool::CleanFragment() {
  std::lock_guard<std::mutex> guard(mMutex);

  for (auto pos = mFreePools.begin(); pos != mFreePools.end();) {
    if (pos->ref == 0) {
      delete[] pos->addr;
      pos = mFreePools.erase(pos);
    } else {
      pos->ref = 0;
      ++pos;
    }
  }
}

std::string urlEncoder(const std::string& str) {
  QString row_data(str.c_str());
  return QUrl::toPercentEncoding(row_data).constData();
}

std::string urlDecoder(const std::string& str) {
  QString row_data(str.c_str());
  QString res = QUrl::fromPercentEncoding(row_data.toUtf8());
  return res.toUtf8().constData();
}

QDateTime UTC2Local(const QString& utc_time) {
  QString tmp = utc_time.left(utc_time.size() - 6);
  QDateTime dt = QDateTime::fromString(tmp, "yyyy-MM-ddTHH:mm:ss");
  dt = dt.addSecs(3600 * 8);
  return dt.toLocalTime();
}

std::string GetDeviceID() {
  const char* data_Set = "SOFTWARE\\Microsoft\\Cryptography";
  HKEY hKEY = nullptr;
  std::string key = "MachineGuid";
  std::string deviceId = "";

  int res = ::RegOpenKeyExA(HKEY_LOCAL_MACHINE, data_Set, 0,
                            KEY_READ | KEY_WOW64_64KEY, &hKEY);
  DWORD dwType = REG_SZ;
  DWORD dwSize = 0;
  if (ERROR_SUCCESS == res) {
    res = ::RegQueryValueExA(hKEY, key.c_str(), 0, &dwType, nullptr, &dwSize);
  }
  std::vector<BYTE> regData;
  if (ERROR_SUCCESS == res && dwSize > 0) {
    regData.resize(dwSize);
    res = ::RegQueryValueExA(hKEY, key.c_str(), 0, &dwType, regData.data(),
                             &dwSize);
  }

  if (!regData.empty()) {
    deviceId = (char*)regData.data();
  }

  // close registry
  if (hKEY != nullptr) {
    ::RegCloseKey(hKEY);
    hKEY = nullptr;
  }

  return deviceId;
}

}  // namespace util
