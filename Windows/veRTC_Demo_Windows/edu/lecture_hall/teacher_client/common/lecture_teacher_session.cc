#include "lecture_teacher_session.h"
#include "core/application.h"
#include <QJsonObject>
#include <QJsonArray>

namespace vrd
{
	void LectureTeacherSession::registerThis()
	{
		VRD_FUNC_RIGESTER_COMPONET(vrd::LectureTeacherSession, LectureTeacherSession);
	}

	LectureTeacherSession::LectureTeacherSession()
	{
		base_ = VRD_FUNC_GET_COMPONET(vrd::SessionBase);
	}

	void LectureTeacherSession::getHandsUpList(const std::string &room_id, std::function<void(const std::shared_ptr<std::list<std::unique_ptr<Applicant>>> &list)> &&callback)
	{
		QJsonObject req;
		req["room_id"] = QString::fromStdString(room_id);
		req["user_id"] = QString::fromStdString(base_->_userId());
		req["login_token"] = QString::fromStdString(base_->_token());

		base_->_emitMessage("eduGetHandsUpList", req, [this, callback](const QJsonObject& rsp) {
				std::shared_ptr<std::list<std::unique_ptr<Applicant>>> list;
				if (!rsp.isEmpty()) {
					auto code = rsp["code"].toInt();
					if (200 == code) {
						list.reset(new std::list<std::unique_ptr<Applicant>>());
						auto applicantArray = rsp["response"].toArray();

						for (const auto& applicantItem : applicantArray) {
							QJsonObject applicantObj = applicantItem.toObject();
							std::unique_ptr<Applicant> applicant(new Applicant());
							applicant->user_id = std::string(applicantObj["user_id"].toString().toUtf8());
							applicant->user_name = std::string(applicantObj["user_name"].toString().toUtf8());
							applicant->is_mute = applicantObj["is_mic_on"].toBool();
							list->emplace_back(std::move(applicant));
						}
					}
				}

				if (callback) {
					callback(list);
				}
			}, true);
	}

	void LectureTeacherSession::getStuMicOnList(const std::string &room_id, std::function<void(const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list)> &&callback)
	{
		QJsonObject req;
		req["room_id"] = QString::fromStdString(room_id);
		req["user_id"] = QString::fromStdString(base_->_userId());
		req["login_token"] = QString::fromStdString(base_->_token());

		base_->_emitMessage("eduGetStuMicOnList", req, [this, callback](const QJsonObject& rsp) {
				std::shared_ptr<std::list<std::unique_ptr<Student>>> list;
				if (!rsp.isEmpty()) {
					auto code = rsp["code"].toInt();
					if (200 == code) {
						list.reset(new std::list<std::unique_ptr<Student>>());
						auto responseObj = rsp["response"].toObject();
						auto speakerArray = responseObj["user_list"].toArray();

						for (const auto& speakerItem : speakerArray) {
							auto speakerObj = speakerItem.toObject();
							std::unique_ptr<Student> speaker(new Student());
							speaker->user_id = std::string(speakerObj["user_id"].toString().toUtf8());
							speaker->user_name = std::string(speakerObj["user_name"].toString().toUtf8());
							list->emplace_back(std::move(speaker));
						}
					}
				}

				if (callback) {
					callback(list);
				}
		}, true);
	}

	void LectureTeacherSession::approveMic(const std::string &room_id, const std::string &student, std::function<void(int64_t code)> &&callback)
	{
		QJsonObject req;
		req["room_id"] = QString::fromStdString(room_id);
		req["user_id"] = QString::fromStdString(student);
		req["login_token"] = QString::fromStdString(base_->_token());

		base_->_emitMessage("eduApproveMic", req, [this, callback](const QJsonObject& rsp) {
				int64_t code = -1;
				if (!rsp.isEmpty()) {
					code = rsp["code"].toInt();
				}

				if (callback) {
					callback(code);
				}
		}, true);
	}

	void LectureTeacherSession::forceMicOff(const std::string &room_id, const std::string &student, std::function<void(int64_t code)> &&callback)
	{
		QJsonObject req;
		req["room_id"] = QString::fromStdString(room_id);
		req["user_id"] = QString::fromStdString(student);
		req["login_token"] = QString::fromStdString(base_->_token());

		base_->_emitMessage("eduForceMicOff", req, [this, callback](const QJsonObject& rsp) {
				int64_t code = -1;
				if (!rsp.isEmpty()) {
					code = rsp["code"].toInt();
				}

				if (callback) {
					callback(code);
				}
			}, true);
	}
}
