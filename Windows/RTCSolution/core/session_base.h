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

/** {zh}
 * RTS相关接口和回调封装类
 */

/** {en}
* RTS-related interfaces and callback wrapper class
*/
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
	// {zh} 是否完成业务服务器初始化标志
	// {en} Whether to complete the business server initialization flag
    bool init_server_completed_{ false };

	// {zh} RTS请求消息反馈集合，关键字为请求ID, 值为请求回调及显示错误标志
	// {en} RTS request message feedback collection, the keyword is the request ID, and the value is the request callback and display error flag
	std::map<QString, std::tuple<std::function<void(const QJsonObject& response)>, bool>> callback_with_requsetId_;
	// {zh} RTS请求消息结果集合，关键字为发送消息id, 值为请求回调
	// {en} RTS request message result set, the keyword is the sent message id, and the value is the request callback
	std::map<int64_t, QJsonObject> callback_with_messageId_;
	// {zh} RTS通知消息监听器, 关键字为消息名，值为通知处理回调
	// {en} RTS notification message listener, the keyword is the message name, and the value is the notification processing callback
	std::map<std::string, std::function<void(const QJsonObject& data)>> event_listeners_;
};
}  // namespace vrd
