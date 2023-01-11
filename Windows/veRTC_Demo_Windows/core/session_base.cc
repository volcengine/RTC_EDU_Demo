#include "session_base.h"
#include "feature/data_mgr.h"
#include "application.h"
#include "util_error.h"
#include "util_tip.h"
#include "util_uuid.h"
#include "logger.h"
#include "http.h"
#include "scene_select_widget.h"

#include <QTimer>
#include <QJsonObject>
#include <QJsonDocument>

#ifdef VE_RTS_PARAMS
#include "feature/ve_rts_params/rts_params.h"
#endif

#ifdef RTS_PARAMS
#include "feature/rts_params/rts_params.h"
#endif

namespace vrd {
static const QString MESSAGE_TYPE_RETURN = "return";
static const QString MESSAGE_TYPE_INFORM = "inform";

void SessionBase::registerThis() {
	VRD_FUNC_RIGESTER_COMPONET(vrd::SessionBase, SessionBase);
}

SessionBase::SessionBase() {
    net_live_timer_ = new QTimer();
    net_live_timer_->start();
    net_live_timer_->setInterval(3000);
    net_live_timer_->setSingleShot(false);
	initConnections();
}

SessionBase::~SessionBase() {
    net_live_timer_->stop();
    net_live_timer_->deleteLater();
}

void SessionBase::connectRTS(CSTRING_REF_PARAM scenesName, std::function<void(void)>&& callback) {
    vrd::getJoinRTSParams(scenesName, token_, [this, callback](int code) {
    if (code == 200) {
		auto rts_info = vrd::DataMgr::instance().rts_info();
		//创建引擎
		RtcEngineWrap::instance().createEngine(rts_info.app_id);
		//设置业务标识参数
		RtcEngineWrap::instance().getRtcEngine()->setBusinessId(vrd::DataMgr::instance().business_Id().c_str());
		_loginRTS(rts_info.rtm_token, [this, rts_info, callback](int code) {
            if (code == bytertc::LoginErrorCode::kLoginErrorCodeSuccess) {
                setServerParams(rts_info.server_signature, rts_info.server_url);
                connect_rts_callback_ = callback;
            }
            else {
                qWarning() << "login error: error_code" << code;
            }
            });
		}
    });
}

void SessionBase::disconnectRTS() {
	_logoutRTS();
	RtcEngineWrap::instance().destroyEngine();
}

void SessionBase::setUserId(CSTRING_REF_PARAM id) { 
	user_id_ = id; 
}

void SessionBase::setToken(CSTRING_REF_PARAM t) { 
	token_ = t; 
}

void SessionBase::setRoomId(CSTRING_REF_PARAM roomId) {
	room_id_ = roomId;
}

CSTRING_REF_PARAM SessionBase::_userId() { 
	return user_id_;
}

CSTRING_REF_PARAM SessionBase::_token() {
    return token_; 
}

void SessionBase::_emitCallback(std::function<void(void)>&& cb) {
    cb_helper_.emitCallback(std::move(cb));
}

void SessionBase::initConnections() {
    QObject::connect(&RtcEngineWrap::instance(), &RtcEngineWrap::sigOnLoginResult, this, &SessionBase::onLoginResult);
    QObject::connect(&RtcEngineWrap::instance(), &RtcEngineWrap::sigOnServerMessageSendResult,
        this, &SessionBase::onServerMessageSendResult);
    QObject::connect(&RtcEngineWrap::instance(), &RtcEngineWrap::sigOnMessageReceived,
        this, &SessionBase::onMessageReceived);
    QObject::connect(&RtcEngineWrap::instance(), &RtcEngineWrap::sigOnServerParamsSetResult,
        this, &SessionBase::onServerParamsSetResult);

    QObject::connect(net_live_timer_, &QTimer::timeout, this, [this]() {
        auto& httpInstance = Http::instance();
        //only check network connection
        auto reply = httpInstance.get(QUrl(QString::fromStdString(vrd::URL)));
        QObject::connect(reply, &HttpReply::finished, this, [this](auto& reply) {
            auto replyCode = reply.statusCode();
            if (replyCode == 0) {
                netBroken();
            }
            else {
                vrd::util::closeFixedToast();
            }
            });
        });
}


void SessionBase::netBroken() {
    vrd::util::showFixedToastInfo("网络链接已断开，请检查设置");
}

void SessionBase::changeUserName(CSTRING_REF_PARAM name,
                                 CallBackFunction&& callback) {
    _changeUserName(name, std::move(callback));
}

void SessionBase::_onNotify(const std::string& event_name, std::function<void(const QJsonObject& data)>&& listener) {
	event_listeners_[event_name] = listener;
}

void SessionBase::_offNotify(const std::string& eventName) {
	event_listeners_.erase(eventName);
}

void SessionBase::_off_all_Notify() {
	event_listeners_.clear();
}

/**
* 设置业务服务器参数
* 1. 用户必须调用 login 登录后，才能调用本接口;
* 2. 客户端调用 sendServerMessage 或 sendServerBinaryMessage 发送消息给业务服务器之前，
* 必须需要设置有效签名和业务服务器地址
*
* @param signature 签名
* @param url       业务服务器地址
*/
void SessionBase::setServerParams(std::string signature, std::string url) {
    if (signature.empty() || url.empty()) {
        qWarning()<< "setServerParams params is illegal: signature:" << signature.c_str() << ", url: " << url.c_str();
        return;
    }

    if (const auto& engine = RtcEngineWrap::instance().getRtcEngine()) {
        engine->setServerParams(signature.c_str(), url.c_str());
    }
}

/**
* 设置业务服务器参数的返回结果
*
* @param error 设置业务服务器错误的错误码
*/
void SessionBase::onServerParamsSetResult(int code) {
    if (code != 200) {
        qWarning()<< " onServerParamsSetResult fail: errorCode = " << code;
        return;
    }
    init_server_completed_ = true;
    if (connect_rts_callback_) {
        _emitCallback(std::move(connect_rts_callback_));
        connect_rts_callback_ = nullptr;
    }
}

void SessionBase::_emitMessage(CSTRING_REF_PARAM name, const QJsonObject& content,
	std::function<void(const QJsonObject& response)>&& callback, bool show_err) {
	if (!init_server_completed_) {
		qWarning()<< "sendServerMessage failed, init_server_completed_: false";
		return;
	}
	if (content.isEmpty()) {
		content["login_token"] = QString::fromStdString(token_);
	}
	
	QJsonObject message;
	auto res_info = vrd::DataMgr::instance().rts_info();
	message["app_id"] =  QString::fromStdString(res_info.app_id);
	message["room_id"] = QString::fromStdString(room_id_);
	message["user_id"] = QString::fromStdString(user_id_);
	message["event_name"] = QString::fromStdString(name);
	QJsonDocument contentDoc(content);
	message["content"] = QString(contentDoc.toJson(QJsonDocument::Indented));;
	auto requestId = QString::fromStdString(util::newUuid());
	message["request_id"] = requestId;
	message["device_id"] =  QString::fromStdString(util::machineUuid());
	qDebug()<< "sendServerMessage eventName:" << name.c_str() << "message: "<< message;
	auto messageStr = QString(QJsonDocument(message).toJson());
	auto messageStdString = std::string(messageStr.toUtf8());
	if (const auto& engine = RtcEngineWrap::instance().getRtcEngine())
	{
		auto msgId = engine->sendServerMessage(messageStdString.c_str());
		if (msgId > 0) {
			callback_with_requsetId_[requestId] = std::make_tuple(callback, show_err);
			callback_with_messageId_[msgId] = message;
		}
		else {
			qWarning() << "sendServerMessage failed, event_name: " << name.c_str();
		}
	}
}

void SessionBase::onServerMessageSendResult(int64_t msgid, int error, const bytertc::ServerACKMsg& msg) {
	if (error != bytertc::UserMessageSendResult::kUserMessageSendResultSuccess) {
		auto messageJsonObj = callback_with_messageId_[msgid];
		qWarning()<< "Message send result exception, error_code: "<< error << ", event_name: "<< messageJsonObj["event_name"];
	}
	callback_with_messageId_.erase(msgid);
}

/**
* 收到RTM业务请求回调消息及通知消息，并解析
*/
void SessionBase::onMessageReceived(const std::string& uid, const std::string& message) {
	auto messageByteArray = QByteArray(message.data(), static_cast<int>(message.size()));
	auto messageJsonObj = QJsonDocument::fromJson(messageByteArray).object();
	qDebug()<<"SessionBase::onMessageReceived: "<< messageJsonObj;
	auto messageType = messageJsonObj["message_type"].toString();
	if(messageType == vrd::MESSAGE_TYPE_RETURN) {
		auto requestId = messageJsonObj["request_id"].toString();
		if (!requestId.isEmpty()) {
			if (callback_with_requsetId_.count(requestId) == 0) {
				qWarning()<<"cannot find the callback with requestId: "<< requestId;
				return;
			}
			auto mapValue = callback_with_requsetId_[requestId];
			auto callback = std::get<0>(mapValue);
			auto show_error = std::get<1>(mapValue);

			_emitCallback([this, callback, messageJsonObj, show_error]() {
				if (callback) {
					callback(messageJsonObj);
				}
				auto code = messageJsonObj["code"].toInt();
				if (show_error && code != 200) {
					auto errInfo = util::getErrorInfo(code);
					if (errInfo != nullptr) {
						if (errInfo->is_error) {
							util::showToastError(0, errInfo->error_msg);
						}
						else {
							util::showToastInfo(errInfo->error_msg);
						}
					}
					else {
						auto errMsg = messageJsonObj["message"].toString();
						util::showToastError(0, errMsg.toStdString());
					}
				}
			});
			callback_with_requsetId_.erase(requestId);
		}
	}
	else if(messageType == vrd::MESSAGE_TYPE_INFORM) {
		auto eventName = messageJsonObj["event"].toString();
		if(!eventName.isEmpty()) {
			auto eventNameStr = std::string(eventName.toUtf8());
			if (event_listeners_.count(eventNameStr) == 0)
			{
				qWarning()<<"cannot find the event listener with event name: "<< eventName;
				return;
			}
			auto eventListener = event_listeners_[eventNameStr];
			auto dataJsonObj = messageJsonObj["data"].toObject();
			_emitCallback([this, eventListener, dataJsonObj]() {
				if (eventListener) {
					eventListener(dataJsonObj);
				}
			});
		}
	}
}

void SessionBase::onLoginResult(const std::string& uid, int error_code, int elapsed) {
	if (engine_login_callback_){
        engine_login_callback_(error_code);
        engine_login_callback_ = nullptr;
	}

    if (error_code == bytertc::LoginErrorCode::kLoginErrorCodeSuccess) {
		auto res_info = vrd::DataMgr::instance().rts_info();
		setServerParams(res_info.server_signature, res_info.server_url);
	}
	else {
		qWarning()<< "onLoginResult fail: error_code: "<< error_code ;
	}
}

void SessionBase::_changeUserName(CSTRING_REF_PARAM name,
                                  CallBackFunction&& callback) {
    QJsonObject content;
    content["user_name"] = QString::fromStdString(name);
    content["login_token"] = QString::fromStdString(token_);

    QJsonDocument contentDoc(content);
    QJsonObject postDataObj;
    postDataObj["event_name"] = QString::fromStdString("changeUserName");
    postDataObj["content"] = QString(contentDoc.toJson(QJsonDocument::Indented));
    postDataObj["device_id"] = QString::fromStdString(util::machineUuid());

    QJsonDocument doc(postDataObj);
    auto& httpInstance = Http::instance();
    auto reply = httpInstance.post(QUrl(QString::fromStdString(vrd::URL)), doc.toJson(), "application/json");
    QObject::connect(reply, &HttpReply::finished, this, [this, name, callback](auto& reply) {
        if (reply.isSuccessful()) {
            QJsonDocument replyDoc = QJsonDocument::fromJson(reply.body());
            auto obj = replyDoc.object();
            auto code = obj["code"].toInt();
            if (code == 200) {
                vrd::DataMgr::instance().setUserName(name);
				SceneSelectWidget::instance().updateUserName();
            }
            if (callback) {
                callback(code);
            }
        }
        else {
            const QString errMsg = "网络请求异常: " + reply.reasonPhrase() + "错误码：" + QString::number(reply.statusCode());
            qDebug() << errMsg;
            vrd::util::showFixedToastInfo(errMsg.toStdString());
        }
    });
}

/**
* 登陆RTM,必须先登录注册一个 uid，才能发送房间外消息和向业务服务器发送消息
* @param token 登陆token
*/
void SessionBase::_loginRTS(const std::string& token, CallBackFunction&& callback){
	engine_login_callback_ = callback;
	auto userId = _userId();
	if (token.empty() || userId.empty()) {
        qWarning()<< "login fail because params is illegal: token:" 
                    << token.c_str() <<",uid:" << userId.c_str();
		return;
	}

    if (const auto& engine = RtcEngineWrap::instance().getRtcEngine()) {
        engine->login(token.c_str(), userId.c_str());
    }

}

/**
* 登出RTS,调用本接口登出后，无法调用房间外消息以及端到服务器消息相关的方法或收到相关回调。
*/
void SessionBase::_logoutRTS() {
    if (const auto& engine = RtcEngineWrap::instance().getRtcEngine()) {
        engine->logout();
    }
}

}  // namespace vrd
