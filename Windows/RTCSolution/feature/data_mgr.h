#pragma once
#include <map>
#include <mutex>
#include <string>
#include <vector>

namespace vrd {

struct VerifySms {
  // {zh} 用户ID
  // {en} user ID
  std::string user_id;
  // {zh} 用户名
  // {en} user name
  std::string user_name;
  // {zh} 登录鉴权字段
  // {en} login authentication field
  std::string login_token;
  // {zh} 创建时间点
  // {en} creation time point
  int64_t create_at = 0;
};

struct RTSInfo {
	// {zh} 每个应用的唯一标识符
	// {en} Unique identifier for each application
	std::string app_id;
	// {zh} appID鉴权字段
	// {en} appID authentication field
	std::string rtm_token;
	// {zh} 服务端URL
	// {en} server URL
	std::string server_url;
	// {zh} 服务端鉴权签名
	// {en} Server authentication signature
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
	PROPRETY(std::vector<std::string>, scenes_list, ScenesList)

protected:
	DataMgr() = default;
	~DataMgr() = default;

private:
	mutable std::mutex _mutex;
};

#undef PROPRETY
}  // namespace vrd
