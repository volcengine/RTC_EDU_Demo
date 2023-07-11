#include "login_widget.h"
#include "core/configer.h"
#include "core/application.h"
#include "core/session_base.h"
#include "core/util_uuid.h"
#include "core/util_tip.h"
#include "data_mgr.h"
#include "rts_params.h"
#include "scene_select_widget.h"
#include "toast.h"
#include "core/http/http.h"

#include <QString>
#include <QTimer>
#include <iostream>
#include <memory>
#include <QDebug>
#include <QJsonObject>
#include <QJsonDocument>

static constexpr char* kEdtUserNameError =
    "font-family : 'Microsoft YaHei UI';"
    "font-size : 14px;"
    "padding-left : 16px;"
    "color : #fff;"
    "background : #1C222D;"
    "border : 1px solid #F53F3F;"
    "border-radius : 8px;";

LoginWidget::LoginWidget(QWidget* parent) : QWidget(parent) {
	ui.setupUi(this);
	initData();
	initViews();
	initConnects();
}

// login button click handler
void LoginWidget::loginBtnClicked() {
	if (!ui.rdo_agree->isChecked()) {
		Toast::showTip(QObject::tr("check_service_agreement_and_privacy_agreement"), this);
		return;
	}
	verifyUserName(ui.edt_username->text());
}

void LoginWidget::checkSaveData() {
    auto login_token = Configer::instance().getData("info/login_token");
    auto user_id = Configer::instance().getData("info/user_id");
    auto user_name = Configer::instance().getData("info/user_name");
    if (!login_token.empty()) {
        auto session = vrd::Application::getSingleton().getComponent(VRD_UTIL_GET_COMPONENT_PARAM(vrd::SessionBase));
        session->setToken(login_token);
        session->setUserId(user_id);
        vrd::DataMgr::instance().setLoginToken(login_token);
        vrd::DataMgr::instance().setUserId(user_id);
        vrd::DataMgr::instance().setUserName(user_name);
        _goMainWidget();
    } else {
        show();
    }
}

void LoginWidget::checkUserName(QString str) {
    bool is_valid = true;
    bool is_overflow = false;
    QString new_str = str;
    if (str.length() > 18) {
        new_str = str.left(18);
        ui.edt_username->setText(new_str);
        is_overflow = true;
    }

    foreach(auto v, new_str) {
        ushort uNum = v.unicode();
        if (!(v.isDigit() || v.isUpper() || v.isLower() || (uNum >= 0x4E00 && uNum <= 0x9FA5))) {
            is_valid = false;
            break;
        }
    }
    username_short_error_ = false;
    if (!is_valid) {
        ui.txt_msg->setText(QObject::tr("only_supports_chinese_letters_numbers"));
        ui.edt_username->setState(LineEditState::kError);
        ui.edt_username->setStyleSheet(kEdtUserNameError);
        return;
    }

    if (is_overflow) {
        QTimer* timer = new QTimer(this);
        timers_.push_back(timer);
        connect(timer, &QTimer::timeout, [=] {
            if (username_short_error_) {
                ui.txt_msg->setText("");
                ui.edt_username->setStyleSheet("");
            }
            timer->stop();
            });
        timer->start(2000);
        ui.txt_msg->setText(QObject::tr("only_supports_chinese_letters_numbers"));
        username_short_error_ = true;
        ui.edt_username->setState(LineEditState::kError);
        ui.edt_username->setStyleSheet(kEdtUserNameError);
    }
    else {
        ui.txt_msg->setText("");
        ui.edt_username->setState(LineEditState::kNormal);
        ui.edt_username->setStyleSheet("");
    }
    ui.btn_login->setEnabled(!new_str.isEmpty() && is_valid);
}

void LoginWidget::closeEvent(QCloseEvent*) {
    QApplication::quit();
}

void LoginWidget::initViews() {
    SceneSelectWidget::instance().hide();
    ui.lbl_rdo_text->setOpenExternalLinks(true);
}

void LoginWidget::initData() {
    ui.rdo_agree->setChecked(false);
    ui.edt_username->setText("");
    ui.txt_msg->setText("");
    ui.btn_login->setEnabled(false);
    ui.edt_username->setStyleSheet("");
    ui.lbl_rdo_text->setText(tr("agree_service_privacy").arg("<a href=\"https://www.volcengine.com/docs/6348/70241\"><span style=\"text-decoration: underline; color:#4080ff; \">"
       + QObject::tr("terms_service") + "</span></a>").arg("<a href=\"https://www.volcengine.com/docs/6348/68918\"><span style=\"text-decoration: underline; color:#4080ff; \">"
           + QObject::tr("privacy_policy") + "</span></a>"));
}

void LoginWidget::initConnects() {
    QObject::connect(ui.edt_username, &LineEditWarp::textEdited, this, &LoginWidget::checkUserName);
    connect(&SceneSelectWidget::instance(), &SceneSelectWidget::sigLogOut, [=] {
	    // logout
	    Configer::instance().saveData("info/login_token", "");
	    Configer::instance().saveData("info/user_id", "");
	    Configer::instance().saveData("info/user_name", "");
	    SceneSelectWidget::instance().hide();
	    initData();
	    show();
    });
}


void LoginWidget::verifyUserName(const QString& userName) {
    QJsonObject content;
    content["user_name"] = userName;
    QJsonDocument contentDoc(content);
    QJsonObject postDataObj;
    postDataObj["event_name"] = QString::fromStdString("passwordFreeLogin");
    postDataObj["content"] = QString(contentDoc.toJson(QJsonDocument::Indented));
    postDataObj["device_id"] = QString::fromStdString(vrd::util::machineUuid());

    QJsonDocument doc(postDataObj);
    auto& httpInstance = Http::instance();
    auto reply = httpInstance.post(QUrl(QString::fromStdString(vrd::URL)), doc.toJson(), "application/json");
    QObject::connect(reply, &HttpReply::finished, this, [this](auto& reply) {
        if (reply.isSuccessful()) {

            QJsonParseError error;
            QJsonDocument replyDoc = QJsonDocument::fromJson(reply.body(), &error);
            if (error.error != QJsonParseError::NoError) {
                qDebug() << "Json parsing error!";
                return;
            }

            auto obj = replyDoc.object();
            auto code = obj["code"].toInt();
            if (code == 200) {
                auto responseObj = obj["response"].toObject();
                vrd::VerifySms sms;
                QString userId = responseObj["user_id"].toString();
                sms.user_id = std::string(userId.toUtf8());
                sms.create_at = responseObj["created_at"].toDouble();
                auto userName = responseObj["user_name"].toString();
                sms.user_name = std::string(userName.toUtf8());
                auto loginToken = responseObj["login_token"].toString();
                sms.login_token = std::string(loginToken.toUtf8());
                vrd::DataMgr::instance().setUserId(sms.user_id);
                vrd::DataMgr::instance().setUserName(sms.user_name);
                vrd::DataMgr::instance().setLoginToken(sms.login_token);
                vrd::DataMgr::instance().setVerifySms(std::move(sms));

                auto session = vrd::Application::getSingleton().getComponent(VRD_UTIL_GET_COMPONENT_PARAM(vrd::SessionBase));
                session->setToken(vrd::DataMgr::instance().login_token());
                session->setUserId(vrd::DataMgr::instance().user_id());

            }
            else {
                Toast::showTip(QObject::tr("request_failed"), this);
                return;
            }

            Configer::instance().saveData("info/login_token",
                vrd::DataMgr::instance().login_token());
            Configer::instance().saveData("info/user_id",
                vrd::DataMgr::instance().user_id());
            Configer::instance().saveData("info/user_name",
                vrd::DataMgr::instance().user_name());
            _goMainWidget();
        }
        else {
            const QString errMsg = QObject::tr("network_messsage_101") + reply.reasonPhrase() + QObject::tr("network_status") + QString::number(reply.statusCode());
            qDebug() << errMsg;
            vrd::util::showFixedToastInfo(errMsg.toStdString());
        }
        });
}

void LoginWidget::_goMainWidget() {
    hide();
    for each (auto var in timers_) var->stop();
    timers_.clear();
    SceneSelectWidget::instance().updateUserName();
    SceneSelectWidget::instance().show();
}
