#include "lecture_student_session.h"
#include "core/application.h"
#include <QJsonObject>

namespace vrd
{
	void LectureStudentSession::registerThis()
	{
		VRD_FUNC_RIGESTER_COMPONET(vrd::LectureStudentSession, LectureStudentSession);
	}

	LectureStudentSession::LectureStudentSession() {
		base_ = VRD_FUNC_GET_COMPONET(vrd::SessionBase);
	}

	void LectureStudentSession::handsUp(const std::string &room_id, std::function<void(int64_t code)> &&callback) {
		QJsonObject req;
		req["room_id"] = QString::fromStdString(room_id);
		req["user_id"] = QString::fromStdString(base_->_userId());
		req["login_token"] = QString::fromStdString(base_->_token());

		base_->_emitMessage("eduHandsUp", req, [this, callback](const QJsonObject& rsp) {
			auto code = rsp["code"].toInt();
			if (callback) {
				callback(code);
			}
		}, true);
	}

	void LectureStudentSession::cancelHandsUp(const std::string &room_id, std::function<void(int64_t code)> &&callback)
	{
		QJsonObject req;
		req["room_id"] = QString::fromStdString(room_id);
		req["user_id"] = QString::fromStdString(base_->_userId());
		req["login_token"] = QString::fromStdString(base_->_token());

		base_->_emitMessage("eduCancelHandsUp", req, [this, callback](const QJsonObject& rsp) {
			auto code = rsp["code"].toInt();
			if (callback) {
				callback(code);
			}
		}, true);
	}
}
