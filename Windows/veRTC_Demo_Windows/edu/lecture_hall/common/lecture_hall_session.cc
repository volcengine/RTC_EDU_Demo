#include "lecture_hall_session.h"
#include "core/application.h"
#include <QJsonObject>

namespace vrd
{
	LectureHallSession::LectureHallSession()
	{
		base_ = VRD_FUNC_GET_COMPONET(vrd::SessionBase);
	}

	void LectureHallSession::onStuMicOn(std::function<void(const std::string &room_id, const std::string &user_id, const std::string &user_name)> &&listener)
	{
		base_->_onNotify("onStuMicOn", [this, listener](const QJsonObject& data) {
			if (!data.isEmpty()) {
				auto room_id = std::string(data["room_id"].toString().toUtf8());
				auto user_id = std::string(data["user_id"].toString().toUtf8());
				auto user_name = std::string(data["user_name"].toString().toUtf8());

				if (listener) {
					listener(room_id, user_id, user_name);
				}
			}
		});
	}

	void LectureHallSession::offStuMicOn()
	{
		base_->_offNotify("onStuMicOn");
	}

	void LectureHallSession::onStuMicOff(std::function<void(const std::string &room_id, const std::string &user_id)> &&listener)
	{
		base_->_onNotify("onStuMicOff", [this, listener](const QJsonObject& data) {
			if (!data.isEmpty()) {
				auto room_id = std::string(data["room_id"].toString().toUtf8());
				auto user_id = std::string(data["user_id"].toString().toUtf8());
				if (listener) {
					listener(room_id, user_id);
				}
			}
		});
	}

	void LectureHallSession::offStuMicOff()
	{
		base_->_offNotify("onStuMicOff");
	}
}
