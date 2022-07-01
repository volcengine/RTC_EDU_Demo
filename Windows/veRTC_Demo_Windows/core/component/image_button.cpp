#include "image_button.h"
#include <QHBoxLayout>
#include <QStyleOption>
#include <QPainter>

ImageButton::ImageButton(QWidget* parent) : QWidget(parent) {
	text_ = new QLabel(this);
	img_ = new QLabel(this);

	auto layout = new QVBoxLayout(this);
	layout->addItem(new QSpacerItem(40, 0, QSizePolicy::Expanding));
	layout->addWidget(img_);
	layout->addWidget(text_);
	layout->addItem(new QSpacerItem(40, 0, QSizePolicy::Expanding));
	this->setLayout(layout);
}


void ImageButton::setImgQss(const QString& qss) { 
	img_->setStyleSheet(qss); 
}

void ImageButton::setImgText(const QString& str) { 
	img_->setText(str); 
}

void ImageButton::setTextQss(const QString& qss) { 
	text_->setStyleSheet(qss); 
}

void ImageButton::setText(const QString& str) { 
	text_->setText(str); 
}

void ImageButton::paintEvent(QPaintEvent* e) {
	QStyleOption opt;
	opt.init(this);
	QPainter p(this);
	style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
	QWidget::paintEvent(e);
}

void ImageButton::mousePressEvent(QMouseEvent* e) {
	if (enabled_)
		emit sigPressed();
}

void ImageButton::setEnabled(bool enabled)
{
	enabled_ = enabled;
}

