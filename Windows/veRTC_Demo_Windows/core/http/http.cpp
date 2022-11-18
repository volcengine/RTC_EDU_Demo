#include "http.h"
#include <QTimer>
#include <QtCore/QMetaEnum>

namespace {
    int defaultReadTimeout = 10000;
    int defaultMaxRetries = 3;
}

HttpReply::HttpReply(const HttpRequestData& request, Http& http) 
    :req_(request)
    ,http_(http)
    , retry_times_(0) {
    if (req_.url.isEmpty()) {
        qWarning() << "URL is empty";
    }
    reply_ = getNetworkReply(req_);
    setParent(reply_);
    initReplyConnections();
    
    timeout_timer_ = new QTimer(this);
    timeout_timer_->setInterval(http_.getReadTimeout());
    timeout_timer_->setSingleShot(true);
    connect(timeout_timer_, &QTimer::timeout, this, &HttpReply::readTimeout);
    timeout_timer_->start();
}

QNetworkReply* HttpReply::getNetworkReply(const HttpRequestData& request) {
    QNetworkRequest req(request.url);

    auto& headers = getDefaultRequestHeaders();
    if (!request.headers.isEmpty()) headers = request.headers;

    for (auto& it = headers.cbegin(); it != headers.cend(); ++it) {
        req.setRawHeader(it.key(), it.value());
    }

    QNetworkAccessManager* manager = new QNetworkAccessManager();
    manager->setRedirectPolicy(QNetworkRequest::NoLessSafeRedirectPolicy);
    if (manager->networkAccessible() == QNetworkAccessManager::NotAccessible) {
        manager->setNetworkAccessible(QNetworkAccessManager::Accessible);
    }

    QNetworkReply* networkReply = nullptr;
    switch (request.operation) {
    case QNetworkAccessManager::GetOperation:
        networkReply = manager->get(req);
        break;
    case QNetworkAccessManager::PostOperation:
        networkReply = manager->post(req, request.body);
        break;
    default:
        qWarning() << "not handle this operation:" << request.operation;
    }

    return networkReply;
}

QMap<QByteArray, QByteArray> HttpReply::getDefaultRequestHeaders() {
    QMap<QByteArray, QByteArray> heads;
    heads.insert("Accept-Charset", "utf-8");
    heads.insert("Connection", "Keep-Alive");
    return heads;
}

void HttpReply::initReplyConnections() {
#if QT_VERSION >= QT_VERSION_CHECK(6, 0, 0)
    connect(reply_, &QNetworkReply::errorOccurred, this, &HttpReply::replyError,
        Qt::UniqueConnection);
#else
    connect(reply_, SIGNAL(error(QNetworkReply::NetworkError)),
        SLOT(replyError(QNetworkReply::NetworkError)), Qt::UniqueConnection);
#endif
    connect(reply_, &QNetworkReply::finished, this, &HttpReply::replyFinished, Qt::UniqueConnection);
}

void HttpReply::emitError() {
    if (req_.operation != QNetworkAccessManager::Operation::GetOperation) {
        const QString msg = req_.url.toString() + " " + QString::number(statusCode()) + " " + reasonPhrase();
        qDebug() << "Http:" << msg;
        if (!req_.body.isEmpty()) {
            qDebug() << "Http:" << req_.body;
        }
        emit error(msg);
    }
    emitFinished();
}

void HttpReply::emitFinished() {
    timeout_timer_->stop();
    reply_->disconnect();
    emit finished(*this);
    reply_->deleteLater();
}

void HttpReply::replyFinished() {
    if (isSuccessful()) {
        bytes_ = reply_->readAll();
    }
    emitFinished();
}

int HttpReply::isSuccessful() const {
    return statusCode() >= 200 && statusCode() < 300;
}

void HttpReply::replyError(QNetworkReply::NetworkError code) {
    if (req_.operation != QNetworkAccessManager::Operation::GetOperation) {
        qDebug() << "QNetworkReply::NetworkError::" << QMetaEnum::fromType<QNetworkReply::NetworkError>().valueToKey(code);
    }
    if (retry_times_ <= http_.getMaxRetries() && statusCode() >= 500 && statusCode() < 600 &&
        (reply_->operation() == QNetworkAccessManager::GetOperation ||
            reply_->operation() == QNetworkAccessManager::HeadOperation)) {
        qDebug() << "Retrying" << statusCode() << QVariant(req_.operation).toString() << req_.url;
        QString replayStr = reply_->errorString();
        qDebug() << replayStr;
        reply_->disconnect();
        reply_->deleteLater();

        reply_ = getNetworkReply(req_);
        setParent(reply_);
        initReplyConnections();
        retry_times_++;
        timeout_timer_->start();
    } else {
        emitError();
        return;
    }
}

void HttpReply::readTimeout() {
    qDebug() << "Timeout" << req_.url;

    if (!reply_) return;

    reply_->disconnect();
    reply_->abort();
    reply_->deleteLater();

    if (retry_times_ >= http_.getMaxRetries()) {
        emitError();
        emit finished(*this);
        return;
    }

    retry_times_++;
    reply_ = getNetworkReply(req_);
    setParent(reply_);
    initReplyConnections();
    timeout_timer_->start();
}

int HttpReply::statusCode() const {
    return reply_->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
}

QString HttpReply::reasonPhrase() const {
    return reply_->attribute(QNetworkRequest::HttpReasonPhraseAttribute).toString();
}

QByteArray HttpReply::body() const {
    return bytes_;
}

Http& Http::instance() {
    static Http ins;
    return ins;
}

Http::Http()
    : read_timeout_(defaultReadTimeout),
    max_retries_(defaultMaxRetries) {}

void Http::setReadTimeout(int value) {
    read_timeout_ = value;
}

int Http::getReadTimeout() {
    return read_timeout_;
}

int Http::getMaxRetries() const {
    return max_retries_;
}

void Http::setMaxRetries(int value) {
    max_retries_ = value;
}

HttpReply* Http::get(const QUrl& url) {
    HttpRequestData req;
    req.url = url;
    req.operation = QNetworkAccessManager::Operation::GetOperation;
    return new HttpReply(req, *this);
}

HttpReply* Http::post(const QUrl& url, const QByteArray& body, const QByteArray& contentType) {
    HttpRequestData req;
    req.url = url;
    req.body = body;
    req.operation = QNetworkAccessManager::Operation::PostOperation;

    QByteArray cType = contentType;
    if (cType.isEmpty()) cType = "application/x-www-form-urlencoded";
    req.headers.insert("Content-Type", cType);
    return new HttpReply(req, *this);
}