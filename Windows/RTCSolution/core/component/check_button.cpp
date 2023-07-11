#include "check_button.h"

#include <QPainter>
#include <QStyleOption>

static constexpr int kPadding = 4;

CheckButton::CheckButton(QWidget* parent) : QWidget(parent) {}

void CheckButton::setChecked(bool enabled) {
    if (enabled != checked_) emit sigChecked(enabled);
    checked_ = enabled;
    update();
}

void CheckButton::paintEvent(QPaintEvent* e) {
    QPainter painter(this);
    QStyleOption opt;
    opt.init(this);
    style()->drawPrimitive(QStyle::PE_Widget, &opt, &painter, this);
    painter.setRenderHint(QPainter::Antialiasing);
    if (checked_) {
        painter.setBrush(QBrush(QColor(0x16, 0x64, 0xFF)));
        painter.setPen(Qt::NoPen);
        painter.drawRoundedRect(rect(), 10, height() / 2);
        painter.setBrush(QBrush(QColor(0xFF, 0xFF, 0xFF)));
        int radius = height() - kPadding * 2;
        painter.drawEllipse(QRect(kPadding, kPadding, radius, radius));
    }
    else {
        painter.setBrush(QBrush(QColor(0xF2, 0xF3, 0xF8)));
        painter.setPen(Qt::NoPen);
        painter.drawRoundedRect(rect(), 10, height() / 2);
        int radius = height() - kPadding * 2;
        painter.setBrush(QBrush(QColor(0xFF, 0xFF, 0xFF)));
        painter.drawEllipse(
            QRect(width() - kPadding - radius, kPadding, radius, radius));
    }
}

void CheckButton::mousePressEvent(QMouseEvent* e) {
    checked_ = !checked_;
    emit sigChecked(checked_);
    update();
}
