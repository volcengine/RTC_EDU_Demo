#include "breakout_teacher_session.h"
#include "core/application.h"
#include <QJsonObject>
#include <QJsonArray>

namespace vrd
{
	void BreakoutTeacherSession::registerThis()
	{
		VRD_FUNC_RIGESTER_COMPONET(vrd::BreakoutTeacherSession, BreakoutTeacherSession);
	}

	BreakoutTeacherSession::BreakoutTeacherSession()
	{
		base_ = VRD_FUNC_GET_COMPONET(vrd::SessionBase);
	}

	void BreakoutTeacherSession::getGroupClassInfo(const std::string &room_id, std::function<void(const std::shared_ptr<std::list<std::unique_ptr<Group>>> &list)> &&callback)
	{
		QJsonObject req;
		req["room_id"] = QString::fromStdString(room_id);
		req["user_id"] = QString::fromStdString(base_->_userId());
		req["login_token"] = QString::fromStdString(base_->_token());

		base_->_emitMessage("eduGetGroupClassInfo", req, [this, callback](const QJsonObject& rsp) {
				std::shared_ptr<std::list<std::unique_ptr<Group>>> list;
				if (!rsp.isEmpty()) {
					auto code = rsp["code"].toInt();
					if (200 == code) {
						list.reset(new std::list<std::unique_ptr<Group>>());
						auto groupArray = rsp["response"].toArray();
						for (const auto& groupItem : groupArray) {
							QJsonObject groupObj = groupItem.toObject();
							std::unique_ptr<Group> group(new Group());
							group->group_index = groupObj["room_idx"].toDouble();
							group->group_room_id = std::string(groupObj["room_id"].toString().toUtf8());
							group->group_room_token = std::string(groupObj["token"].toString().toUtf8());
							list->emplace_back(std::move(group));
						}
					}
				}

				if (callback) {
					callback(list);
				}
		}, true);
	}

	void BreakoutTeacherSession::teacherGetGroupStudentsInfo(const std::string &group_room_id, std::function<void(const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list)> &&callback)
	{
		QJsonObject req;
		req["group_room_id"] = QString::fromStdString(group_room_id);
		req["user_id"] = QString::fromStdString(base_->_userId());
		req["login_token"] = QString::fromStdString(base_->_token());

		base_->_emitMessage("eduTeacherGetGroupStudentsInfo", req, [this, callback](const QJsonObject& rsp) {
				std::shared_ptr<std::list<std::unique_ptr<Student>>> list;
				if (!rsp.isEmpty()) {
					auto code = rsp["code"].toInt();
					if (200 == code)
					{
						list.reset(new std::list<std::unique_ptr<Student>>());
						auto studentArray = rsp["response"].toArray();
						for (const auto& studentItem : studentArray) {
							QJsonObject studentObj = studentItem.toObject();
							std::unique_ptr<Student> student(new Student());
							student->user_id = std::string(studentObj["user_id"].toString().toUtf8());
							student->user_name = std::string(studentObj["user_name"].toString().toUtf8());
							list->emplace_back(std::move(student));
						}
					}
				}

				if (callback) {
					callback(list);
				}
		}, true);
	}
}
