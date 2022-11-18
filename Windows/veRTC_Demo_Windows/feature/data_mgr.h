#pragma once
#include <map>
#include <mutex>
#include <string>
#include <vector>

namespace vrd {

struct VerifySms {
  std::string user_id;
  std::string user_name;
  std::string login_token;
  int64_t create_at = 0;
};

struct RTSInfo {
	std::string app_id;
	std::string rtm_token;
	std::string server_url;
	std::string server_signature;
};

#define PROPRETY(CLASS, MEMBER, UPPER_MEMBER)   \
 private:                                       \
  CLASS MEMBER##_;                              \
                                                \
 public:                                        \
  CLASS MEMBER() const {                        \
    std::lock_guard<std::mutex> _(_mutex);      \
    return MEMBER##_;                           \
  }                                             \
  void set##UPPER_MEMBER(const CLASS& MEMBER) { \
    std::lock_guard<std::mutex> _(_mutex);      \
    MEMBER##_ = MEMBER;                         \
  }                                             \
  void set##UPPER_MEMBER(CLASS&& MEMBER) {      \
    std::lock_guard<std::mutex> _(_mutex);      \
    MEMBER##_ = std::move(MEMBER);              \
  }

class DataMgr {
public:
	static DataMgr& instance() {
		static DataMgr data_mgr;
		return data_mgr;
	}

	PROPRETY(VerifySms, verify_sms, VerifySms)
	PROPRETY(std::string, login_token, LoginToken)
	PROPRETY(std::string, user_name, UserName)
	PROPRETY(std::string, user_id, UserId)
	PROPRETY(std::string, room_id, RoomId)
	PROPRETY(std::string, business_Id, BusinessId)
	PROPRETY(RTSInfo, rts_info, RTSInfo)

protected:
	DataMgr() = default;
	~DataMgr() = default;

private:
	mutable std::mutex _mutex;
};

#undef PROPRETY
}  // namespace Edu
