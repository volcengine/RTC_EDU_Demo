#include "volume_widget.h"
#include <QPainter>
#include <QPen>


VolumeWidget::VolumeWidget(QWidget* parent) : QWidget(parent) {
	pixmap_ = QPixmap(size().height(), size().height());
	pixmap_.fill(QColor(0, 0, 0));
	range_ = 255;
	value_ = 0;
	spacer_ = 4;
	rc_size_ = QSize(4, 16);
	bg_color_ = QColor(0xE2, 0xE2, 0xF0);
	front_color_ = QColor(0x00, 0x73, 0xff);
}

void VolumeWidget::setImage(const QPixmap& pixMap) { pixmap_ = pixMap; }

int VolumeWidget::getImageWidth()
{
	return pixmap_.width();
}

void VolumeWidget::setImageStartWidth(int x)
{
	start_image_x_ = x;
}

int VolumeWidget::getImageStartWidth()
{
	return start_image_x_;
}

void VolumeWidget::setBkColor(const QColor& color) { bg_color_ = color; }

void VolumeWidget::setFrontColor(const QColor& color) {
	front_color_ = color;
}

void VolumeWidget::setValue(int value) {
	value_ = value;
	update();
	emit PositonChangeSignal(value_);
}


void VolumeWidget::setSpacer(int value) { spacer_ = value; }

void VolumeWidget::setRange(int value) { range_ = value; }

void VolumeWidget::setRectSize(const QSize& size) { rc_size_ = size; }

int VolumeWidget::getValue() { return value_; }

void VolumeWidget::paintEvent(QPaintEvent* e) {
	QPainter painter(this);
	painter.drawPixmap(0, (height() - pixmap_.height()) / 2, pixmap_);
	QPen penFront;
	QPen penBg;
	penFront.setWidth(rc_size_.width());
	penFront.setColor(front_color_);

	penBg.setWidth(rc_size_.width());
	penBg.setColor(bg_color_);
	int startDrawLinePosX = pixmap_.width() + 10;
	if (start_image_x_ != -1)
		startDrawLinePosX = start_image_x_ + 10;
	int endDrawLinePosX = size().width();
	int drawRcLength = endDrawLinePosX - startDrawLinePosX < 0
		? 0
		: endDrawLinePosX - startDrawLinePosX;
	if (rc_size_.width() == 0 || range_ == 0) return;
	int countRect =
		(drawRcLength - rc_size_.width()) / (rc_size_.width() + spacer_);
	int curMaxRect = countRect * (value_ / (double)range_);
	for (int i = 0; i < countRect; i++) {
		if (i < curMaxRect) {
			painter.setPen(penFront);
		}
		else {
			painter.setPen(penBg);
		}
		painter.drawLine(QPoint(rc_size_.width() / 2 + startDrawLinePosX +
			(rc_size_.width() + spacer_) * i,
			size().height() / 2 + rc_size_.height() / 2),
			QPoint(rc_size_.width() / 2 + startDrawLinePosX +
				(rc_size_.width() + spacer_) * i,
				size().height() / 2 - rc_size_.height() / 2));
	}
}
