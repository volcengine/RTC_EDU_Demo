#include "edu_session.h"
#include "core/util.h"
#include "core/application.h"
#include "edu/core/data_parser.h"
#include "feature/data_mgr.h"

#include <QJsonObject>
#include <QJsonArray>
#include <memory>

namespace vrd {

void EduSession::registerThis() {
  VRD_FUNC_RIGESTER_COMPONET(vrd::EduSession, EduSession);
}

void EduSession::setUserId(const std::string& uid) { 
	base_->setUserId(uid); 
}

void EduSession::setToken(const std::string& token) { 
	base_->setToken(token); 
}

void EduSession::setRoomId(const std::string& roomId) {
	base_->setRoomId(roomId); 
}

std::string EduSession::_token() { return base_->_token(); }

std::string EduSession::user_id() { return base_->_userId(); }

void EduSession::initSceneConfig(std::function<void(void)>&& callback) {
	base_->connectRTS("edu", [this, callback]() {
		if (callback) {
			callback();
		}
	});
}

void EduSession::exitScene() {
	base_->disconnectRTS();
}

void EduSession::beginClass(CSTRING_REF_PARAM room_id,
                            CSTRING_REF_PARAM user_id,
                            CallBackFunction&& callback) {
  _beginClass(room_id, user_id, std::move(callback));
}

void EduSession::teacherGetStudentsInfo(CSTRING_REF_PARAM room_id,
                                        CSTRING_REF_PARAM user_id,
                                        uint32_t page_number,
                                        uint32_t page_size,
                                        CallBackFunction&& callback) {
  _teacherGetStudentsInfo(room_id, user_id, page_number, page_size,
                          std::move(callback));
}

void EduSession::getCreatedClass(CSTRING_REF_PARAM user_id,
                                 CallBackFunction&& callback) {
  _getCreatedClass(user_id, std::move(callback));
}

void EduSession::eduCreateClass(CSTRING_REF_PARAM room_name, int room_type,
                                CSTRING_REF_PARAM create_user_id,
                                int room_limit, int group_num, int group_limit,
                                int begin_class_time, int end_class_time,
                                CSTRING_REF_PARAM teacher_name,
                                CallBackFunction&& callback) {
  _eduCreateClass(room_name, room_type, create_user_id, &room_limit, &group_num,
                  &group_limit, &begin_class_time, &end_class_time,
                  teacher_name, std::move(callback));
}

void EduSession::eduCreateClass(CSTRING_REF_PARAM room_name, int room_type,
                                CSTRING_REF_PARAM create_user_id,
                                int room_limit, CSTRING_REF_PARAM teacher_name,
                                CallBackFunction&& callback) {
  _eduCreateClass(room_name, room_type, create_user_id, &room_limit, nullptr,
                  nullptr, nullptr, nullptr, teacher_name, std::move(callback));
}

void EduSession::getHistoryRoomList(CSTRING_REF_PARAM user_id,
                                    CallBackFunction&& callback) {
  _getHistoryRoomList(user_id, std::move(callback));
}

void EduSession::getHistoryRecordList(CSTRING_REF_PARAM room_id,
                                      CallBackFunction&& callback) {
  _getHistoryRecordList(room_id, std::move(callback));
}

void EduSession::eduDeleteRecord(CSTRING_REF_PARAM vid,
                                 CallBackFunction&& callback) {
  _eduDeleteRecord(vid, std::move(callback));
}

void EduSession::eduReconnect(CSTRING_REF_PARAM user_id, CallBackFunction&& callback) {
	_eduReconnect(user_id, std::move(callback));
}

void EduSession::endClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                          CallBackFunction&& callback) {
  _endClass(room_id, user_id, std::move(callback));
}

void EduSession::eduGetActiveClass(CallBackFunction&& callback) {
  _eduGetActiveClass(std::move(callback));
}

void EduSession::openGroupSpeech(CSTRING_REF_PARAM room_id,
                                 CSTRING_REF_PARAM user_id,
                                 CallBackFunction&& callback) {
  _openGroupSpeech(room_id, user_id, std::move(callback));
}

void EduSession::closeGroupSpeech(CSTRING_REF_PARAM room_id,
                                  CSTRING_REF_PARAM user_id,
                                  CallBackFunction&& callback) {
  _closeGroupSpeech(room_id, user_id, std::move(callback));
}

void EduSession::openVideoInteract(CSTRING_REF_PARAM room_id,
                                   CSTRING_REF_PARAM user_id,
                                   CallBackFunction&& callback) {
  _openVideoInteract(room_id, user_id, std::move(callback));
}

void EduSession::closeVideoInteract(CSTRING_REF_PARAM room_id,
                                    CSTRING_REF_PARAM user_id,
                                    CallBackFunction&& cb) {
  _closeVideoInteract(room_id, user_id, std::move(cb));
}

void EduSession::stuJoinClass(CSTRING_REF_PARAM room_id,
                              CSTRING_REF_PARAM user_id,
                              CSTRING_REF_PARAM user_name,
                              CallBackFunction&& cb, bool is_reconnect) {
  _stuJoinClass(room_id, user_id, user_name, is_reconnect, std::move(cb));
}

void EduSession::teaJoinClass(CSTRING_REF_PARAM room_id,
                              CSTRING_REF_PARAM user_id,
                              CSTRING_REF_PARAM user_name,
                              CallBackFunction&& cb) {
  _teaJoinClass(room_id, user_id, user_name, std::move(cb));
}

void EduSession::stuLeaveClass(CSTRING_REF_PARAM room_id,
                               CSTRING_REF_PARAM user_id,
                               CallBackFunction&& cb) {
  _stuLeaveClass(room_id, user_id, std::move(cb));
}

void EduSession::eduTurnOnMic(CSTRING_REF_PARAM room_id,
                              CSTRING_REF_PARAM user_id,
                              CallBackFunction&& cb) {
  _eduTurnOnMic(room_id, user_id, std::move(cb));
}

void EduSession::eduTurnOffMic(CSTRING_REF_PARAM room_id,
                               CSTRING_REF_PARAM user_id,
                               CallBackFunction&& cb) {
  _eduTurnOffMic(room_id, user_id, std::move(cb));
}

void EduSession::eduTurnOnCamera(CSTRING_REF_PARAM room_id,
                                 CSTRING_REF_PARAM user_id,
                                 CallBackFunction&& cb) {
  _eduTurnOnCamera(room_id, user_id, std::move(cb));
}

void EduSession::eduTurnOffCamera(CSTRING_REF_PARAM room_id,
                                  CSTRING_REF_PARAM user_id,
                                  CallBackFunction&& cb) {
    _eduTurnOffCamera(room_id, user_id, std::move(cb));
}

void EduSession::_beginClass(CSTRING_REF_PARAM room_id,
                             CSTRING_REF_PARAM user_id,
                             CallBackFunction&& callback) {
	QJsonObject req;
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);
	req["login_token"] = QString::fromStdString(base_->_token());

	base_->_emitMessage("eduBeginClass", req,
		[this, callback](const QJsonObject& rsp) {
			int code = -1;
			code = rsp["code"].toInt();
			qInfo("<------ _beginClass : ", rsp);
			if (callback) {
				callback(code);
			}
	});
}

void EduSession::_getCreatedClass(CSTRING_REF_PARAM user_id,
                                  CallBackFunction&& callback) {
	QJsonObject req;
	req["user_id"] = QString::fromStdString(user_id);
	req["login_token"] = QString::fromStdString(base_->_token());

	base_->_emitMessage(
		"eduGetCreatedClass", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();

			Edu::Rooms rooms;
			Edu::DataParser::parser_rooms(Edu::DataSource<Edu::RTS_JSON_DATA>(msg), rooms);
			for (auto& room : rooms) {
				room.room_name = std::move(::util::urlDecoder(room.room_name));
			}
			if (rooms.size() > 0) {
				vrd::DataMgr::instance().setRoomId(rooms[0].room_id);
				base_->setRoomId(rooms[0].room_id);
				Edu::DataMgr::instance().setRoomType(rooms[0].room_type);
			}
			Edu::DataMgr::instance().setCreatedClassRoom(std::move(rooms));

			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_eduCreateClass(CSTRING_REF_PARAM room_name, int room_type,
                                 CSTRING_REF_PARAM create_user_id,
                                 int* room_limit, int* group_num,
                                 int* group_limit, int* begin_class_time,
                                 int* end_class_time,
                                 CSTRING_REF_PARAM teacher_name,
                                 CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
    req["room_name"] = QString::fromStdString(::util::urlEncoder(room_name));
    req["room_type"] = room_type;
    req["create_user_id"] = QString::fromStdString(create_user_id);
	if (room_limit) {
        req["room_limit"] = *room_limit;
    }
	if (group_num) {
        req["group_num"] = *group_num;
    }
	if (group_limit) {
        req["group_limit"] = *group_limit;
    }
	if (begin_class_time){
		req["begin_class_time"] = *begin_class_time;
    }
	if (end_class_time){
		req["end_class_time"] = *end_class_time;
    }
	req["teacher_name"] = QString::fromStdString(teacher_name);

	base_->_emitMessage("eduCreateClass", req,
		[this, callback](const QJsonObject& msg) {
			int code =  msg["code"].toInt();
			if (code == 200) {
				Edu::ClassRoom class_room;
				Edu::DataParser::parser_room(
					Edu::DataSource<Edu::RTS_JSON_DATA>(msg), class_room);
				class_room.room_name = ::util::urlDecoder(class_room.room_name);
				vrd::DataMgr::instance().setRoomId(class_room.room_id);
				base_->setRoomId(class_room.room_id);
				Edu::DataMgr::instance().setRoomType(class_room.room_type);
				Edu::DataMgr::instance().setCreateClassRoom(std::move(class_room));
			}
 
			if (callback) {
				callback(code);
			}
	});
}

void EduSession::_teaJoinClass(CSTRING_REF_PARAM room_id,
                               CSTRING_REF_PARAM user_id,
                               CSTRING_REF_PARAM user_name,
                               CallBackFunction&& callback) {
	QJsonObject req;
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);
	req["user_name"] = QString::fromStdString(user_name);
	req["login_token"] = QString::fromStdString(base_->_token());

	base_->_emitMessage(
		"eduTeacherJoinClass", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();
			if (code == 200) {
				Edu::TeacherInfo teacher_info;
				Edu::DataParser::parser_teacher_info(
					Edu::DataSource<Edu::RTS_JSON_DATA>(msg), teacher_info);
				Edu::DataMgr::instance().setTeacherInfo(std::move(teacher_info));
			}
			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_getHistoryRoomList(CSTRING_REF_PARAM user_id,
                                     CallBackFunction&& callback) {
	QJsonObject req;
	req["user_id"] = QString::fromStdString(user_id);
	req["login_token"] = QString::fromStdString(base_->_token());

	base_->_emitMessage("eduGetHistoryRoomList", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();
			if (code == 200) {
				Edu::Rooms rooms;
				Edu::DataParser::parser_rooms(
					Edu::DataSource<Edu::RTS_JSON_DATA>(msg), rooms);
				for (auto& room : rooms) {
					room.room_name = ::util::urlDecoder(room.room_name);
				}
				Edu::DataMgr::instance().setHistoryRoomList(std::move(rooms));
			}
			if (callback) {
				callback(code);
			}
	});
}

void EduSession::_getHistoryRecordList(const std::string& room_id,
                                       CallBackFunction&& callback) {
	QJsonObject req;
	req["room_id"] = QString::fromStdString(room_id);
	req["login_token"] = QString::fromStdString(base_->_token());

	base_->_emitMessage("eduGetHistoryRecordList", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();
			if (code == 200) {
				Edu::HistoryRecordList records;
				Edu::DataParser::parser_records(
					Edu::DataSource<Edu::RTS_JSON_DATA>(msg), records);
				for (auto& record : records) {
					record.room_name = ::util::urlDecoder(record.room_name);
				}
				Edu::DataMgr::instance().setHistoryRecordList(std::move(records));
			}

			if (callback) {
				callback(code);
			}
	});
}

void EduSession::_eduDeleteRecord(CSTRING_REF_PARAM vid,
                                  CallBackFunction&& callback) {
	QJsonObject req;
	req["vid"] = QString::fromStdString(vid);
	req["login_token"] = QString::fromStdString(base_->_token());

	base_->_emitMessage("eduDeleteRecord", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();
			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_eduGetActiveClass(CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());

	base_->_emitMessage(
		"eduGetActiveClass", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();
			Edu::Rooms rooms;
			Edu::DataParser::parser_rooms(
				Edu::DataSource<Edu::RTS_JSON_DATA>(msg), rooms);
			for (auto& room : rooms) {
				room.room_name = std::move(::util::urlDecoder(room.room_name));
			}
			Edu::DataMgr::instance().setActiveClass(std::move(rooms));

			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_teacherGetStudentsInfo(CSTRING_REF_PARAM room_id,
                                         CSTRING_REF_PARAM user_id,
                                         uint32_t page_number,
                                         uint32_t page_size,
                                         CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
    req["room_id"] = QString::fromStdString(room_id);
    req["user_id"] = QString::fromStdString(user_id);
	req["page_number"] = static_cast<int>(page_number);
	req["page_size"] = static_cast<int>(page_size);

    base_->_emitMessage("eduTeacherGetStudentsInfo", req,
        [this, callback](const QJsonObject& msg) {
            int code = msg["code"].toInt();
            if (code != 200) return;
            Edu::StudentsInfo students_info;
            auto response = msg["response"].toObject();

            students_info.room_id = std::string(response["room_id"].toString().toUtf8());
            students_info.room_type = response["room_type"].toDouble();

            auto cnt = response.value("student_count");
            if (cnt.isDouble()) {
                students_info.student_count = response["student_count"].toDouble();
            }
            auto user_list = response["user_list"];
            if (!user_list.isNull()) {
                auto userListArray = user_list.toArray();
                for (const auto& userItem : userListArray) {
                    auto info = userItem.toObject();
                    Edu::User usr;
                    usr.user_id = std::string(info["user_id"].toString().toUtf8());
                    usr.app_id = std::string(info["app_id"].toString().toUtf8());
                    usr.conn_id = std::string(info["conn_id"].toString().toUtf8());
                    usr.create_time = info["create_time"].toDouble();
                    usr.is_camera_on = info["is_camera_on"].toBool();
                    usr.is_hands_up = info["is_hands_up"].toBool();
                    usr.is_mic_on = info["is_mic_on"].toBool();
                    usr.group_speech_join_rtc = info["group_speech_join_rtc"].toBool();
                    usr.id = info["id"].toDouble();
                    usr.join_time = info["join_time"].toDouble();
                    usr.leave_time = info["leave_time"].toDouble();
                    usr.rtc_token = std::string(info["rtc_token"].toString().toUtf8());
                    usr.user_status = info["user_status"].toDouble();
                    usr.user_role = info["user_role"].toDouble();
                    usr.user_name = std::string(info["user_name"].toString().toUtf8());
                    usr.parent_room_id = std::string(info["parent_room_id"].toString().toUtf8());
                    usr.update_time = info["update_time"].toDouble();
                    students_info.user_list.emplace_back(std::move(usr));
                }
            }
            auto group_user_list = response["group_user_list"];

            if (!group_user_list.isNull()) {
				auto groupUserListObj = group_user_list.toObject();
				for (const auto& userkey : groupUserListObj.keys()) {
                    auto listArray = groupUserListObj[userkey].toArray();
                    std::vector<Edu::User> l;
                    for(const auto& listItem : listArray){
                        Edu::User usr;
                        auto list = listItem.toObject();

						usr.user_id = std::string(list["user_id"].toString().toUtf8());
						usr.app_id = std::string(list["app_id"].toString().toUtf8());
						usr.conn_id = std::string(list["conn_id"].toString().toUtf8());
						usr.create_time = list["create_time"].toDouble();
						usr.is_camera_on = list["is_camera_on"].toBool();
						usr.is_hands_up = list["is_hands_up"].toBool();
						usr.is_mic_on = list["is_mic_on"].toBool();
						usr.group_speech_join_rtc = list["group_speech_join_rtc"].toBool();
						usr.id = list["id"].toDouble();
						usr.join_time = list["join_time"].toDouble();
						usr.leave_time = list["leave_time"].toDouble();
						usr.rtc_token = std::string(list["rtc_token"].toString().toUtf8());
						usr.user_status = list["user_status"].toDouble();
						usr.user_role = list["user_role"].toDouble();
						usr.user_name = std::string(list["user_name"].toString().toUtf8());
						usr.parent_room_id = std::string(list["parent_room_id"].toString().toUtf8());
						usr.update_time = list["update_time"].toDouble();
						l.push_back(std::move(usr));
                        
                        students_info.user_list.emplace_back(usr);
                    }
					students_info.group_user_list.insert(
						std::make_pair(std::string(userkey.toUtf8()), std::move(l)));
                }
            }
            Edu::DataMgr::instance().setStudentInfo(std::move(students_info));

			if (callback) {
				callback(code);
			}
        });
}

void EduSession::_endClass(CSTRING_REF_PARAM room_id, CSTRING_REF_PARAM user_id,
                           CallBackFunction&& callback) {
  QJsonObject req;
  req["login_token"] = QString::fromStdString(base_->_token());
  req["room_id"] = QString::fromStdString(room_id);
  req["user_id"] = QString::fromStdString(user_id);

  base_->_emitMessage("eduEndClass", req,
	  [this, callback](const QJsonObject& msg) {
		  int code = msg["code"].toInt();

		  if (callback) {
			  callback(code);
		  }
	  });
}

void EduSession::_openGroupSpeech(CSTRING_REF_PARAM room_id,
                                  CSTRING_REF_PARAM user_id,
                                  CallBackFunction&& callback) {
    QJsonObject req;
    req["login_token"] = QString::fromStdString(base_->_token());
    req["room_id"] = QString::fromStdString(room_id);
    req["user_id"] = QString::fromStdString(user_id);

    base_->_emitMessage("eduOpenGroupSpeech", req,
        [this, callback](const QJsonObject& msg) {
            int code = msg["code"].toInt();

            if (callback) {
                callback(code);
            }
        });
}

void EduSession::_closeGroupSpeech(CSTRING_REF_PARAM room_id,
                                   CSTRING_REF_PARAM user_id,
                                   CallBackFunction&& callback) {
    QJsonObject req;
    req["login_token"] = QString::fromStdString(base_->_token());
    req["room_id"] = QString::fromStdString(room_id);
    req["user_id"] = QString::fromStdString(user_id);

    base_->_emitMessage("eduCloseGroupSpeech", req,
        [this, callback](const QJsonObject& msg) {
            int code = msg["code"].toInt();

            if (callback) {
                callback(code);
            }
        });
}

void EduSession::_openVideoInteract(CSTRING_REF_PARAM room_id,
                                    CSTRING_REF_PARAM user_id,
                                    CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);

	base_->_emitMessage("eduOpenVideoInteract", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();

			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_closeVideoInteract(CSTRING_REF_PARAM room_id,
                                     CSTRING_REF_PARAM user_id,
                                     CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);

	base_->_emitMessage("eduCloseVideoInteract", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();

			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_stuJoinClass(CSTRING_REF_PARAM room_id,
                               CSTRING_REF_PARAM user_id,
                               CSTRING_REF_PARAM user_name, bool is_reconnect,
                               CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);
	req["user_name"] = QString::fromStdString(user_name);
	req["is_reconnect"] = is_reconnect;

	base_->_emitMessage(
		"eduJoinClass", req, [this, callback](const QJsonObject& msg) {
			Edu::StudentJoinClassRoom info;
			int code = msg["code"].toInt();
			if (code == 200) {
				auto response = msg["response"].toObject();
				for (const auto& userItem : response["current_mic_user"].toArray()) {
					auto user = userItem.toObject();
					Edu::User u;
					u.app_id = std::string(user["app_id"].toString().toUtf8());
					u.conn_id = std::string(user["conn_id"].toString().toUtf8());
					u.create_time = user["create_time"].toDouble();
					u.group_speech_join_rtc = user["group_speech_join_rtc"].toBool();
					u.id = user["id"].toDouble();
					u.is_camera_on = user["is_camera_on"].toBool();
					u.is_hands_up = user["is_hands_up"].toBool();
					u.is_mic_on = user["is_mic_on"].toBool();
					u.join_time = user["join_time"].toDouble();
					u.leave_time = user["leave_time"].toDouble();
					u.parent_room_id = std::string(user["parent_room_id"].toString().toUtf8());
					u.room_id = std::string(user["room_id"].toString().toUtf8());
					u.rtc_token = std::string(user["rtc_token"].toString().toUtf8());
					u.update_time = user["update_time"].toDouble();
					u.user_id = std::string(user["user_id"].toString().toUtf8());
					u.user_name = std::string(user["user_name"].toString().toUtf8());
					u.user_role = user["user_role"].toDouble();
					u.user_status = user["user_status"].toDouble();
					info.current_mic_user.push_back(u);
				}
				if (!response["group_user_list"].isNull())
					for (const auto& userItem : response["group_user_list"].toArray()) {
						auto user = userItem.toObject();
						Edu::User u;
						u.app_id = std::string(user["app_id"].toString().toUtf8());
						u.conn_id = std::string(user["conn_id"].toString().toUtf8());
						u.create_time = user["create_time"].toDouble();
						u.group_speech_join_rtc = user["group_speech_join_rtc"].toBool();
						u.id = user["id"].toDouble();
						u.is_camera_on = user["is_camera_on"].toBool();
						u.is_hands_up = user["is_hands_up"].toBool();
						u.is_mic_on = user["is_mic_on"].toBool();
						u.join_time = user["join_time"].toDouble();
						u.leave_time = user["leave_time"].toDouble();
						u.parent_room_id = std::string(user["parent_room_id"].toString().toUtf8());
						u.room_id = std::string(user["room_id"].toString().toUtf8());
						u.rtc_token = std::string(user["rtc_token"].toString().toUtf8());
						u.update_time = user["update_time"].toDouble();
						u.user_id = std::string(user["user_id"].toString().toUtf8());
						u.user_name = std::string(user["user_name"].toString().toUtf8());
						u.user_role = user["user_role"].toDouble();
						u.user_status = user["user_status"].toDouble();
						info.group_user_list.push_back(u);
					}

				{
					const auto& room = response["room_info"].toObject();
					info.room_info.app_id = std::string(room["app_id"].toString().toUtf8());
					info.room_info.audio_mute_all = room["audio_mute_all"].toBool();
					info.room_info.begin_class_time = room["begin_class_time"].toDouble();
					info.room_info.begin_class_time_real = room["begin_class_time_real"].toDouble();
					info.room_info.create_time = room["create_time"].toDouble();
					info.room_info.create_user_id = std::string(room["create_user_id"].toString().toUtf8());
					info.room_info.enable_group_speech = room["enable_group_speech"].toBool();
					info.room_info.enable_interactive = room["enable_interactive"].toBool();
					info.room_info.end_class_time = room["end_class_time"].toDouble();
					info.room_info.group_limit = room["group_limit"].toDouble();
					info.room_info.id = room["id"].toDouble();
					info.room_info.is_recording = room["is_recording"].toBool();
					info.room_info.room_id = std::string(room["room_id"].toString().toUtf8());
					info.room_info.room_name = ::util::urlDecoder(std::string(room["room_name"].toString().toUtf8()));
					info.room_info.room_type = room["room_type"].toDouble();
					info.room_info.status = room["status"].toDouble();
					info.room_info.teacher_name = std::string(room["teacher_name"].toString().toUtf8());
					info.room_info.token = std::string(room["token"].toString().toUtf8());
					info.room_info.update_time = room["update_time"].toDouble();
					info.room_info.video_mute_all = room["video_mute_all"].toBool();
				}
				const auto& teacher_info = response["teacher_info"].toObject();
				if (!teacher_info.isEmpty()) {
					info.teacher_info.app_id = std::string(teacher_info["app_id"].toString().toUtf8());
					info.teacher_info.conn_id = std::string(teacher_info["conn_id"].toString().toUtf8());
					info.teacher_info.create_time = teacher_info["create_time"].toDouble();
					info.teacher_info.group_speech_join_rtc = teacher_info["group_speech_join_rtc"].toBool();
					info.teacher_info.id = teacher_info["id"].toDouble();
					info.teacher_info.is_camera_on = teacher_info["is_camera_on"].toBool();
					info.teacher_info.is_hands_up = teacher_info["is_hands_up"].toBool();
					info.teacher_info.is_mic_on = teacher_info["is_mic_on"].toBool();
					info.teacher_info.join_time = teacher_info["join_time"].toDouble();
					info.teacher_info.leave_time = teacher_info["leave_time"].toDouble();
					info.teacher_info.room_id = std::string(teacher_info["room_id"].toString().toUtf8());
					info.teacher_info.rtc_token = std::string(teacher_info["rtc_token"].toString().toUtf8());
					info.teacher_info.update_time = teacher_info["update_time"].toDouble();
					info.teacher_info.user_id = std::string(teacher_info["user_id"].toString().toUtf8());
					info.teacher_info.user_role = teacher_info["user_role"].toDouble();
					info.teacher_info.user_status = teacher_info["user_status"].toDouble();
				}
				const auto& user_info = response["user_info"].toObject();
				if (!user_info.isEmpty()) {
					info.user_info.app_id = std::string(user_info["app_id"].toString().toUtf8());
					info.user_info.conn_id = std::string(user_info["conn_id"].toString().toUtf8());
					info.user_info.create_time = user_info["create_time"].toDouble();
					info.user_info.group_speech_join_rtc = user_info["group_speech_join_rtc"].toBool();
					info.user_info.id = user_info["id"].toDouble();
					info.user_info.is_camera_on = user_info["is_camera_on"].toBool();
					info.user_info.is_hands_up = user_info["is_hands_up"].toBool();
					info.user_info.is_mic_on = user_info["is_mic_on"].toBool();
					info.user_info.join_time = user_info["join_time"].toDouble();
					info.user_info.leave_time = user_info["leave_time"].toDouble();
					info.user_info.room_id = std::string(user_info["room_id"].toString().toUtf8());
					info.user_info.rtc_token = std::string(user_info["rtc_token"].toString().toUtf8()); 
					info.user_info.update_time = user_info["update_time"].toDouble();
					info.user_info.user_id = std::string(user_info["user_id"].toString().toUtf8()); 
					info.user_info.user_role = user_info["user_role"].toDouble();
					info.user_info.user_status = user_info["user_status"].toDouble();
				}
				info.group_room_id = std::string(response["group_room_id"].toString().toUtf8()); 
				info.group_token = std::string(response["group_token"].toString().toUtf8());
				info.is_mic_on = response["is_mic_on"].toBool();
				info.room_idx = response["room_idx"].toDouble();
				info.token = std::string(response["token"].toString().toUtf8());
				Edu::DataMgr::instance().setStudentJoinClassRoom(std::move(info));
			}

			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_stuLeaveClass(CSTRING_REF_PARAM room_id,
                                CSTRING_REF_PARAM user_id,
                                CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);

	base_->_emitMessage("eduLeaveClass", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();

			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_eduTurnOnMic(CSTRING_REF_PARAM room_id,
                               CSTRING_REF_PARAM user_id,
                               CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);


	base_->_emitMessage("eduTurnOnMic", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();

			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_eduTurnOffMic(CSTRING_REF_PARAM room_id,
                                CSTRING_REF_PARAM user_id,
                                CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);

	base_->_emitMessage("eduTurnOffMic", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();
			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_eduTurnOnCamera(CSTRING_REF_PARAM room_id,
                                  CSTRING_REF_PARAM user_id,
                                  CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);

  base_->_emitMessage("eduTurnOnCamera", req,
	  [this, callback](const QJsonObject& msg) {
		  int code = msg["code"].toInt();

		  if (callback) {
			  callback(code);
		  }
	  });
}

void EduSession::_eduTurnOffCamera(CSTRING_REF_PARAM room_id,
                                   CSTRING_REF_PARAM user_id,
                                   CallBackFunction&& callback) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
	req["room_id"] = QString::fromStdString(room_id);
	req["user_id"] = QString::fromStdString(user_id);

	base_->_emitMessage("eduTurnOffCamera", req,
		[this, callback](const QJsonObject& msg) {
			int code = msg["code"].toInt();

			if (callback) {
				callback(code);
			}
		});
}

void EduSession::_eduReconnect(CSTRING_REF_PARAM user_id, CallBackFunction&& cb) {
	QJsonObject req;
	req["login_token"] = QString::fromStdString(base_->_token());
	if (!user_id.empty()) {
		req["user_id"] = QString::fromStdString(user_id);
	}

	base_->_emitMessage("eduReconnect", req,
		[this,cb](const QJsonObject& msg) {
			int code = msg["code"].toInt();
			if (cb) {
				cb(code);
			}
	});
}

void EduSession::offAll() { base_->_off_all_Notify(); }

void EduSession::onLogInElsewhere(std::function<void(void)>&& callback) {
	base_->_onNotify("onLogInElsewhere", [=](const QJsonObject& dataObj) {
		base_->_emitCallback([=] {
			callback();
			});
	});
}

void EduSession::onTeacherLeaveRoom(std::function<void(void)>&& callback) {
  base_->_onNotify("onTeacherLeaveRoom", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onTeacherJoinRoom(std::function<void(void)>&& callback) {
  base_->_onNotify("onTeacherJoinRoom", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onTeacherCameraOff(std::function<void(void)>&& callback) {
  base_->_onNotify("onTeacherCameraOff", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onTeacherCameraOn(std::function<void(void)>&& callback) {
  base_->_onNotify("onTeacherCameraOn", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onTeacherMicOff(std::function<void(void)>&& callback) {
  base_->_onNotify("onTeacherMicOff", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onTeacherMicOn(std::function<void(void)>&& callback) {
  base_->_onNotify("onTeacherMicOn", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onCloseVideoInteract(std::function<void(void)>&& callback) {
  base_->_onNotify("onCloseVideoInteract", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onOpenVideoInteract(std::function<void(void)>&& callback) {
  base_->_onNotify("onOpenVideoInteract", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}



void EduSession::onCloseGroupSpeech(std::function<void(void)>&& callback) {
  base_->_onNotify("onCloseGroupSpeech", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onOpenGroupSpeech(std::function<void(void)>&& callback) {
  base_->_onNotify("onOpenGroupSpeech", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onEndClass(std::function<void(void)>&& callback) {
  base_->_onNotify("onEndClass", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

void EduSession::onBeginClass(std::function<void(void)>&& callback) {
  base_->_onNotify("onBeginClass", [=](const QJsonObject& dataObj) {
    base_->_emitCallback([=] { callback(); });
  });
}

EduSession::EduSession() { 
	base_ = VRD_FUNC_GET_COMPONET(vrd::SessionBase); 
}

}  // namespace vrd
