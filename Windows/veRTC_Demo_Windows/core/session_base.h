#pragma once

#include "callback_helper.h"
#include "component_interface.h"
#include "core/rtc_engine_wrap.h"
#include <QObject>
#include <functional>
#include <map>
#include <memory>
#include <string>

#define CSTRING_REF_PARAM const std::string&

namespace vrd {

using CallBackFunction = std::function<void(int)>;

class SessionBase : public QObject, public IComponent {
	  Q_OBJECT
public:
    SessionBase();
    ~SessionBase();

	void connectRTS(CSTRING_REF_PARAM scenesName, std::function<void(void)>&& callback);
	void disconnectRTS();

public:
	static void registerThis();
	void setUserId(CSTRING_REF_PARAM id);
	void setToken(CSTRING_REF_PARAM t);
	void setRoomId(CSTRING_REF_PARAM roomId);
	void setServerParams(std::string signature, std::string url);

	void changeUserName(CSTRING_REF_PARAM name, CallBackFunction&& callback);
	void _emitMessage(CSTRING_REF_PARAM name, const QJsonObject& content, 
		std::function<void(const QJsonObject& response)>&& callback = nullptr, bool show_err = false);

	void _emitCallback(std::function<void(void)>&& cb);
	void _onNotify(const std::string& event_name, std::function<void(const QJsonObject& data)>&& listener);
	void _offNotify(const std::string& event_name);
	void _off_all_Notify();

	CSTRING_REF_PARAM _userId();
	CSTRING_REF_PARAM _token();

public slots:
	void onLoginResult(const std::string& uid, int error_code, int elapsed);
	void onServerParamsSetResult(int error);
	void onServerMessageSendResult(int64_t msgid, int error, const bytertc::ServerACKMsg& msg);
	void onMessageReceived(const std::string& uid, const std::string& message);

private:
	void initConnections();
    void netBroken();
	void _changeUserName(CSTRING_REF_PARAM name, CallBackFunction&& callback);

	void _loginRTS(const std::string& token, CallBackFunction&& callback);
	void _logoutRTS();

private:
	CallBackFunction engine_login_callback_{nullptr};
	std::function<void(void)> connect_rts_callback_{nullptr};
	CallbackHelper cb_helper_;
	QTimer* net_live_timer_{ nullptr };
	
    std::string user_id_;
	std::string token_;
	std::string room_id_;
	/***是否初始化业务服务器完成*/
    bool init_server_completed_{ false };

	/*** RTS请求消息反馈集合，Key:请求requestId; value为请求回调及数据类型class*/
	std::map<QString, std::tuple<std::function<void(const QJsonObject& response)>, bool>> callback_with_requsetId_;
	/*** RTS请求消息结果集合，Key:发送消息id; value为请求回调*/
	std::map<int64_t, QJsonObject> callback_with_messageId_;
	/*** RTS通知消息监听器*/
	std::map<std::string, std::function<void(const QJsonObject& data)>> event_listeners_;
};
}  // namespace vrd
