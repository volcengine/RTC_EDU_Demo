#include "breakout_student_session.h"
#include "core/application.h"
#include <QJsonObject>

namespace vrd
{
    void BreakoutStudentSession::registerThis()
    {
        VRD_FUNC_RIGESTER_COMPONET(vrd::BreakoutStudentSession, BreakoutStudentSession);
    }

    BreakoutStudentSession::BreakoutStudentSession()
    {
        base_ = VRD_FUNC_GET_COMPONET(vrd::SessionBase);
    }

    void BreakoutStudentSession::onStudentJoinGroupRoom(std::function<void(const std::string& room_id_, const std::string& user_id_, const std::string& user_name)>&& listener)
    {
        base_->_onNotify("onStudentJoinGroupRoom", [this, listener](const QJsonObject& data) {
            if (!data.isEmpty()) {
                auto room_id_ = std::string(data["room_id"].toString().toUtf8());
                auto user_id_ = std::string(data["user_id"].toString().toUtf8());
                auto user_name = std::string(data["user_name"].toString().toUtf8());
                if (listener) {
                    listener(room_id_, user_id_, user_name);
                }
            }
            });
    }

    void BreakoutStudentSession::onStudentLeaveGroupRoom(std::function<void(const std::string& room_id_, const std::string& user_id_)>&& listener)
    {
        base_->_onNotify("onStudentLeaveGroupRoom", [this, listener](const QJsonObject& data) {
            if (!data.isEmpty())
            {
                auto room_id_ = std::string(data["room_id"].toString().toUtf8());
                auto user_id_ = std::string(data["user_id"].toString().toUtf8());
                if (listener)
                {
                    listener(room_id_, user_id_);
                }
            }
            });
    }
}
