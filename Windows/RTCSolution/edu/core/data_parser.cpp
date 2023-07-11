#include "data_parser.h"

namespace Edu {

template <>
void DataParser::parser_room(const DataSource<RTS_JSON_DATA>& srouce,
                             ClassRoom& room) {
	auto rsp = srouce.source();
	auto item = rsp["response"].toObject();

	room.app_id = std::string(item["app_id"].toString().toUtf8());
	room.audio_mute_all = item["audio_mute_all"].toBool();
	room.begin_class_time = item["begin_class_time"].toDouble();
	room.begin_class_time_real = item["begin_class_time_real"].toDouble();
	room.create_time = item["create_time"].toDouble();
	room.create_user_id = std::string(item["create_user_id"].toString().toUtf8());

	room.enable_group_speech = item["enable_group_speech"].toBool();
	room.enable_interactive = item["enable_interactive"].toBool();
	room.end_class_time = item["end_class_time"].toDouble();
	room.group_limit = item["group_limit"].toDouble();
	room.id = item["id"].toDouble();
	room.is_recording = item["is_recording"].toBool();

	if (item.contains("room_child_info")) {
		QJsonValue childInfoValue = item.value("room_child_info");
		if (childInfoValue.isArray()) {
			QJsonArray childInfoArray = childInfoValue.toArray();
			for (const auto& childInfoArr : childInfoArray) {
                QJsonObject childInfo = childInfoArr.toObject();
				Edu::RoomChildInfo room_child;
				room_child.app_id = std::string(childInfo["app_id"].toString().toUtf8());
				room_child.id = childInfo["id"].toDouble();
				room_child.parent_room_id = std::string(childInfo["parent_room_id"].toString().toUtf8());
				room_child.room_id = std::string(childInfo["room_id"].toString().toUtf8());
				room_child.room_idx = childInfo["room_idx"].toDouble();
				room_child.room_name = std::string(childInfo["room_name"].toString().toUtf8());
				room.room_child_info.push_back(room_child);
			}
		}
	}

	room.room_id = std::string(item["room_id"].toString().toUtf8());
	room.room_name = std::string(item["room_name"].toString().toUtf8());
	room.room_type = item["room_type"].toDouble();

	room.status = item["status"].toDouble();
	room.teacher_name = std::string(item["teacher_name"].toString().toUtf8());
	room.token = std::string(item["token"].toString().toUtf8());
	room.update_time = item["update_time"].toDouble();
	room.video_mute_all = item["video_mute_all"].toBool();
}

template <>
void DataParser::parser_records(const DataSource<RTS_JSON_DATA>& srouce,
                                HistoryRecordList& rescords) {
	auto rsp = srouce.source();
	auto responseValue = rsp.value("response");
	if (responseValue.isArray()) {
		auto responseArray = responseValue.toArray();
		for (const auto& itemArr : responseArray) {
			QJsonObject item = itemArr.toObject();
			Edu::RecordInfo record;
			record.id = item["id"].toDouble();
			record.app_id = std::string(item["app_id"].toString().toUtf8());
			record.room_id = std::string(item["room_id"].toString().toUtf8());
			record.parent_room_id = std::string(item["parent_room_id"].toString().toUtf8());
			record.user_id = std::string(item["user_id"].toString().toUtf8());
			record.room_name = std::string(item["room_name"].toString().toUtf8());
			record.record_status = item["record_status"].toDouble();
			record.create_time = item["create_time"].toDouble();
			record.update_time = item["update_time"].toDouble();
			record.record_begin_time = item["record_begin_time"].toDouble();
			record.record_end_time = item["record_end_time"].toDouble();
			record.task_id = std::string(item["task_id"].toString().toUtf8());
			record.vid = std::string(item["vid"].toString().toUtf8());
			record.video_url = std::string(item["video_url"].toString().toUtf8());
			rescords.push_back(record);
		}
	}
}

static void _parser_rooms(const QJsonArray& ptrs, Rooms& rooms) {
	for (const auto& itemArr : ptrs) {
		auto item = itemArr.toObject();
		Edu::ClassRoom class_room;
		class_room.app_id = std::string(item["app_id"].toString().toUtf8());
		class_room.audio_mute_all = item["audio_mute_all"].toBool();
		class_room.begin_class_time = item["begin_class_time"].toDouble();
		class_room.begin_class_time_real = item["begin_class_time_real"].toDouble();
		class_room.create_time = item["create_time"].toDouble();
		class_room.create_user_id = std::string(item["create_user_id"].toString().toUtf8());
		class_room.enable_group_speech = item["enable_group_speech"].toBool();
		class_room.enable_interactive = item["enable_interactive"].toBool();
		class_room.end_class_time = item["end_class_time"].toDouble();
		class_room.group_limit = item["group_limit"].toDouble();
		class_room.id = item["id"].toDouble();
		class_room.is_recording = item["is_recording"].toBool();

		if (item.contains("room_child_info")) {
			QJsonValue childInfoValue = item.value("room_child_info");
			if (childInfoValue.isArray()) {
				QJsonArray childInfoArray = childInfoValue.toArray();
				for (const auto& childInfoArr : childInfoArray) {
					QJsonObject childInfo = childInfoArr.toObject();
					Edu::RoomChildInfo room_child;
					room_child.app_id = std::string(childInfo["app_id"].toString().toUtf8());
					room_child.id = childInfo["id"].toDouble();
					room_child.parent_room_id = std::string(childInfo["parent_room_id"].toString().toUtf8());
					room_child.room_id = std::string(childInfo["room_id"].toString().toUtf8());
					room_child.room_idx = childInfo["room_idx"].toDouble();
					room_child.room_name = std::string(childInfo["room_name"].toString().toUtf8());
					class_room.room_child_info.push_back(room_child);
				}
			}
		}

		class_room.room_id = std::string(item["room_id"].toString().toUtf8());
		class_room.room_name = std::string(item["room_name"].toString().toUtf8());
		class_room.room_type = item["room_type"].toDouble();
		class_room.status = item["status"].toDouble();
		class_room.teacher_name = std::string(item["teacher_name"].toString().toUtf8());
		class_room.token = std::string(item["token"].toString().toUtf8());
		class_room.update_time = item["update_time"].toDouble();
		class_room.video_mute_all = item["video_mute_all"].toBool();
		rooms.push_back(class_room);
	}
}

template <>
void DataParser::parser_rooms(const DataSource<RTS_JSON_DATA>& srouce,
                              Rooms& rooms) {
  auto rsp = srouce.source();
  if (rsp["response"].isArray()) {
	_parser_rooms(rsp["response"].toArray(), rooms);
  }
  else {
	  auto responseObj = rsp["response"].toObject();
    _parser_rooms(responseObj["room_list"].toArray(), rooms);
  }
}

template <>
void DataParser::parser_teacher_info(const DataSource<RTS_JSON_DATA>& srouce,
                                     TeacherInfo& room) {
	auto rsp = srouce.source()["response"].toObject();
	room.app_id = std::string(rsp["app_id"].toString().toUtf8());
	room.conn_id = std::string(rsp["conn_id"].toString().toUtf8());
	room.create_time = rsp["create_time"].toDouble();
	room.group_speech_join_rtc = rsp["group_speech_join_rtc"].toBool();
	room.id = rsp["id"].toDouble();
	room.is_camera_on = rsp["is_camera_on"].toBool();
	room.is_hands_up = rsp["is_hands_up"].toBool();
	room.is_mic_on = rsp["is_mic_on"].toBool();
	room.join_time = rsp["join_time"].toDouble();
	room.leave_time = rsp["leave_time"].toDouble();
	room.parent_room_id = std::string(rsp["parent_room_id"].toString().toUtf8());
	room.room_id = std::string(rsp["room_id"].toString().toUtf8());
	room.rtc_token = std::string(rsp["rtc_token"].toString().toUtf8());
	room.update_time = rsp["update_time"].toDouble();
	room.user_id = std::string(rsp["user_id"].toString().toUtf8());
	room.user_name = std::string(rsp["user_name"].toString().toUtf8());
	room.user_role = rsp["user_role"].toDouble();
	room.user_status = rsp["user_status"].toDouble();
}

}  // namespace Edu
