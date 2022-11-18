#include "toast.h"

#include <QGuiApplication>
#include <QHBoxLayout>
#include <QPainter>
#include <QPropertyAnimation>
#include <QScreen>
#include <QTimer>
#include <QPointer>
	
QPointer<Toast> t = nullptr;
static int totalTips = 0;

Toast::Toast(QWidget* parent) : QWidget(parent) {
    setWindowFlags(Qt::Tool | Qt::FramelessWindowHint);
    setAttribute(Qt::WA_TranslucentBackground);
    setStyleSheet("* { background: none; }");

    auto hbox_layout = new QHBoxLayout(this);
    lbl_icon_ = new QLabel();
    lbl_icon_->setFixedSize(16, 16);
    lbl_icon_->setStyleSheet("border-image: url(:/img/image/error.png);");
    hbox_layout->addWidget(lbl_icon_, 0, Qt::AlignVCenter);
    lbl_text_ = new QLabel();
    lbl_text_->setStyleSheet(
        "font-family: 'Microsoft YaHei'; font-size: 14px; color: black; "
        "margin-bottom: 1px;");
    hbox_layout->addWidget(lbl_text_);
    btn_close_ = new QPushButton();
    btn_close_->setFlat(true);
    btn_close_->setFixedSize(16, 16);
    btn_close_->setIcon(QIcon(":/img/close"));
    btn_close_->setIconSize(QSize(12, 12));
    btn_close_->setStyleSheet("border: none;");
    hbox_layout->addWidget(btn_close_, 0, Qt::AlignVCenter);

    connect(btn_close_, &QPushButton::clicked, this, [=] {
        close();
        deleteLater();
    });
}

void Toast::setError(bool error) { 
    lbl_icon_->setVisible(error); 
}

void Toast::setText(const QString& text) { 
    lbl_text_->setText(text); 
}

void Toast::showTip(int timeout) {
    QTimer::singleShot(timeout, this, [this] {
        close();
        totalTips--;
        deleteLater();
    });
}

void Toast::showFixedTip(const QString& text, QWidget* parent) {
    if (t && t->isVisible()) {
        return;
    }
    t = new Toast(parent);

    t->setText(text);
    t->adjustSize();
    if (parent) {
        auto pos = parent->pos();
        t->move(pos.x() + (parent->width() - t->width()) / 2, pos.y() + 60);
    }
    else {
        QScreen* screen = QGuiApplication::primaryScreen();
        t->move((screen->size().width() - t->width()) / 2, 60);
    }
    t->show();
}

void Toast::closeFixedTip() {
    if (t && t->isVisible()) {
        t->hide();
    }
}

void Toast::showTip(const QString& text, QWidget* parent, int timeout,
                    bool error) {
    Toast* toast = new Toast(parent);
    toast->setAttribute(Qt::WA_DeleteOnClose);
    toast->setError(error);
    toast->setText(text);
    toast->adjustSize();
    if (parent) {
        auto pos = parent->pos();
        toast->move(pos.x() + (parent->width() - toast->width()) / 2, pos.y() + 60 + totalTips * 60);
    } else {
        QScreen* screen = QGuiApplication::primaryScreen();
        toast->move((screen->size().width() - toast->width()) / 2, 60 + totalTips * 60);
    }
    toast->showTip(timeout);
    toast->show();
    totalTips++;
}

void Toast::paintEvent(QPaintEvent* event) {
    QPainter painter(this);
    painter.setPen(Qt::NoPen);
    painter.setBrush(QBrush(QColor(0xFF, 0xFF, 0xFF)));
    painter.drawRoundedRect(rect(), 4, 4, Qt::RelativeSize);
}

Toast& Toast::_getStaticToast(QWidget* parent) {
    static Toast ins_(parent);
    return ins_;
}
