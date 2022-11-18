#pragma once

#include <QNetworkRequest>
#include <QNetworkReply>
#include <QNetworkAccessManager>
#include <QPointer>

struct HttpRequestData {
    QUrl url;
    QByteArray body;
    QNetworkAccessManager::Operation operation;
    QMap<QByteArray, QByteArray> headers;
};
class Http;

class HttpReply : public QObject {
    Q_OBJECT

public:
    HttpReply(const HttpRequestData& request, Http& http);
    int statusCode() const;
    QString reasonPhrase() const;
    QByteArray body() const;
    int isSuccessful() const;

private slots:
    void replyFinished();
    void replyError(QNetworkReply::NetworkError);
    void readTimeout();

signals:
    void error(const QString& message);
    void finished(const HttpReply& reply);

private:
    QNetworkReply* getNetworkReply(const HttpRequestData& request);
    QMap<QByteArray, QByteArray> getDefaultRequestHeaders();
    void initReplyConnections();
    void emitError();
    void emitFinished();

    HttpRequestData req_;
    QPointer<QNetworkReply> reply_;
    QByteArray bytes_;
    Http& http_;
    QTimer* timeout_timer_;
    int retry_times_;
};

class Http {
public:
    static Http& instance();
    Http();
    ~Http() = default;

    void setReadTimeout(int value);
    int getReadTimeout();

    int getMaxRetries() const;
    void setMaxRetries(int value);

    HttpReply* get(const QUrl& url);
    HttpReply* post(const QUrl& url, const QByteArray& body, const QByteArray& contentType);

private:
    int read_timeout_;
    int max_retries_;
};
