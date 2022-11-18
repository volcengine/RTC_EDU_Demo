#include "rts_params.h"
#include "http.h"
#include "feature/data_mgr.h"
#include "core/util_uuid.h"
#include "core/util_tip.h"

#include <QJsonDocument>
#include <QJsonObject>
#include <QDebug>

namespace vrd
{
    /**
    * 请求场景初始化RTS所需的业务服务器等相关参数
    *
    * @param scenesName     场景名缩写
    * @param loginToken     登陆Token
    * @param callBack       请求回调
    */
    void getJoinRTSParams(const std::string& scenesName, const std::string& loginToken, std::function<void(int)>&& callback) {

        vrd::RTSInfo rts_info;
        rts_info.app_id = std::string(vrd::APPID);
        vrd::DataMgr::instance().setRTSInfo(std::move(rts_info));

        QJsonObject content;
        content["app_id"] = QString::fromStdString(vrd::APPID);
        content["app_key"] = QString::fromStdString(vrd::APPKey);
        content["volc_ak"] = QString::fromStdString(vrd::AccessKeyID);
        content["volc_sk"] = QString::fromStdString(vrd::SecretAccessKey);
        content["account_id"] = QString::fromStdString(vrd::AccountId);
        content["vod_space"] = QString::fromStdString(vrd::VodSpace);

        content["scenes_name"] = QString::fromStdString(scenesName);
        content["login_token"] = QString::fromStdString(loginToken);

        QJsonDocument contentDoc(content);
        QJsonObject postDataObj;
        postDataObj["event_name"] = QString::fromStdString("setAppInfo");
        postDataObj["content"] = QString(contentDoc.toJson(QJsonDocument::Indented));
        postDataObj["device_id"] = QString::fromStdString(util::machineUuid());

        QJsonDocument doc(postDataObj);
        auto& httpInstance = Http::instance();
        auto reply = httpInstance.post(QUrl(QString::fromStdString(vrd::URL)), doc.toJson(), "application/json");

        QObject::connect(reply, &HttpReply::finished,[callback](auto& reply) {
            if (reply.isSuccessful()) {
                QJsonParseError error;
                QJsonDocument replyDoc = QJsonDocument::fromJson(reply.body(), &error);
                if (error.error != QJsonParseError::NoError) {
                    qDebug() << "Json parsing error!";
                    return;
                }

                qDebug() << "set app info success" << reply.body();
                auto obj = replyDoc.object();
                auto code = obj["code"].toInt();
                if (code == 200) {
                    auto responseObj = obj["response"].toObject();

                    vrd::RTSInfo rts_info;
                    auto appId = responseObj["app_id"].toString();
                    rts_info.app_id = std::string(appId.toUtf8());
                    auto rtmToken = responseObj["rtm_token"].toString();
                    rts_info.rtm_token = std::string(rtmToken.toUtf8());
                    auto serverUrl = responseObj["server_url"].toString();
                    rts_info.server_url = std::string(serverUrl.toUtf8());
                    auto serverSignature = responseObj["server_signature"].toString();
                    rts_info.server_signature = std::string(serverSignature.toUtf8());
                    vrd::DataMgr::instance().setRTSInfo(std::move(rts_info));

                    auto businessId = responseObj["bid"].toString();
                    vrd::DataMgr::instance().setBusinessId(std::string(businessId.toUtf8()));
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
}
