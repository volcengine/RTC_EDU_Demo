#pragma once
#include <map>
#include <mutex>
#include <string>
#include <vector>

#define DATAMGR_INS Edu::DataMgr::instance()

namespace Edu {
struct RoomChildInfo {
  std::string app_id;
  int64_t id;
  std::string parent_room_id;
  std::string room_id;
  int64_t room_idx;
  std::string room_name;
};

struct ClassRoom {
  std::string app_id;
  bool audio_mute_all;
  int64_t begin_class_time;
  int64_t begin_class_time_real;
  int64_t create_time;
  std::string create_user_id;
  bool enable_group_speech;
  bool enable_interactive;
  int64_t end_class_time;
  int64_t group_limit;
  int64_t id;
  bool is_recording;
  std::vector<RoomChildInfo> room_child_info;
  std::string room_id;
  std::string room_name;
  int64_t room_type;
  /// <summary>
  /// 0 : 未上课 1 : 上课中 2 : 已结束
  /// </summary>
  int64_t status;
  std::string teacher_name;
  std::string token;
  int64_t update_time;
  bool video_mute_all;
  int64_t timestamp;
};

struct TeacherInfo {
  std::string app_id;
  std::string conn_id;
  int64_t create_time;
  bool group_speech_join_rtc;
  int64_t id;
  bool is_camera_on;
  bool is_hands_up;
  bool is_mic_on;
  int64_t join_time;
  int64_t leave_time;
  std::string parent_room_id;
  std::string room_id;
  std::string rtc_token;
  int64_t update_time;
  std::string user_id;
  std::string user_name;
  int64_t user_role;
  int64_t user_status;
};

struct GroupUser {};

struct User {
  std::string app_id;
  std::string room_id;
  std::string conn_id;
  std::string user_id;
  std::string user_name;
  int64_t user_role;
  int64_t user_status;
  int64_t create_time;
  bool group_speech_join_rtc;
  int64_t id;
  bool is_camera_on;
  bool is_hands_up = false;
  bool is_mic_on;
  int64_t join_time;
  int64_t leave_time;
  std::string parent_room_id;
  std::string rtc_token;
  int64_t update_time;
};

struct RecordInfo {
  int64_t id;
  std::string app_id;
  std::string room_id;
  std::string parent_room_id;
  std::string user_id;
  std::string room_name;
  int64_t record_status;
  int64_t create_time;
  int64_t update_time;
  int64_t record_begin_time;
  int64_t record_end_time;
  std::string task_id;
  std::string vid;
  std::string video_url;
};

struct StudentJoinClassRoom {
  std::string token;
  bool is_mic_on;
  ClassRoom room_info;
  User teacher_info;
  User user_info;
  std::vector<User> current_mic_user;
  std::string group_token;
  std::vector<User> group_user_list;
  int64_t room_idx;
  std::string group_room_id;
};

struct StudentsInfo {
  std::map<std::string, std::vector<User>> group_user_list;
  std::vector<User> user_list;
  int64_t room_type;
  std::string room_id;
  std::string timestamp;
  int64_t student_count;
};

struct JoinClassResp {
  ClassRoom room_info;

  bool is_mic_on;
  std::vector<User> current_mic_user;
  User teacher_Info;
  std::string group_token;
  int64_t room_idx;
  std::string group_room_id;
};

struct DevSetting{
	int curVideoDevIndex = -1;
	int curAudioCaptureIndex = -1;
	int curAudioPlaybackIndex = -1;
};

using CreatedClassRoom = std::vector<ClassRoom>;
using CreateClassRoom = ClassRoom;
using Rooms = std::vector<ClassRoom>;
using HistoryRoomList = std::vector<ClassRoom>;
using HistoryRecordList = std::vector<RecordInfo>;
using ActiveClass = std::vector<ClassRoom>;

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

	PROPRETY(CreatedClassRoom, created_class_room, CreatedClassRoom)
	PROPRETY(CreateClassRoom, create_class_room, CreateClassRoom)
	PROPRETY(HistoryRoomList, histroy_room_list, HistoryRoomList)
	PROPRETY(HistoryRecordList, histroy_record_list, HistoryRecordList)
	PROPRETY(ActiveClass, acivte_class, ActiveClass)
	PROPRETY(TeacherInfo, teacher_info, TeacherInfo)
	PROPRETY(StudentJoinClassRoom, student_join_class_room, StudentJoinClassRoom)

	PROPRETY(bool, is_teacher, IsTeacher)
	PROPRETY(std::string, group_room_id, GroupRoomID)
	PROPRETY(int64_t, room_type, RoomType)
	PROPRETY(std::string, token, Token)
	PROPRETY(std::string, group_token, GroupToken)
	PROPRETY(StudentsInfo, stduent_info, StudentInfo)
	PROPRETY(ClassRoom, current_room, CurrentRoom)
	PROPRETY(DevSetting, current_device_setting, DevSetting)
protected:
	DataMgr() = default;
	~DataMgr() = default;

private:
	mutable std::mutex _mutex;
};

#undef PROPRETY
}  // namespace Edu
