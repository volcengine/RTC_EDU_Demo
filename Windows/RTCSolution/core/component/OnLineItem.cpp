#include "OnLineItem.h"
#include <QPainter>

OnLineItem::OnLineItem(QWidget* parent)
{
	InitControls();
}

OnLineItem::~OnLineItem()
{
	
}

void OnLineItem::SetUserName(QString name)
{
	auto key = name.mid(0, 1);
	m_lbl_logo->setText(key);
	m_lbl_user->setText(name);
}

void OnLineItem::setLogoStyleSheet(const char* style)
{
	if(m_lbl_logo)
	{
		m_lbl_logo->setStyleSheet(style);
	}
}

void OnLineItem::InitControls()
{
	m_lbl_logo = new QLabel("", this);
	m_lbl_logo->setAlignment(Qt::AlignCenter);
	m_lbl_logo->setStyleSheet(
		"background-image:url(:img/"
		"user_bg);background-position:center;background-repeat:"
		"no-repeat;"
		"color:#fff;"
		"border-radius: 10px;"
		"font-family:\"Microsoft YaHei\";"
		"font-size:14px; font-weight:600;");
	m_lbl_logo->setFixedSize(24, 24);

	m_lbl_user = new QLabel("", this);
	m_lbl_user->setStyleSheet("color:#fff; font-family:\"Microsoft YaHei\"; font-size:14px; font-weight:400; background:transparent");
	m_layout_ = new QHBoxLayout(this);
	m_layout_->setContentsMargins(10, 0, 0, 0);
	m_layout_->setSpacing(8);


	m_layout_->addWidget(m_lbl_logo);
	m_layout_->addWidget(m_lbl_user);
	m_layout_->addItem(new QSpacerItem(0, 0, QSizePolicy::Expanding));
	setLayout(m_layout_);
}

void OnLineItem::showEvent(QShowEvent* e)
{
	setLayout(m_layout_);
}

void OnLineItem::paintEvent(QPaintEvent* e)
{
//	QPainter painter(this);
	//painter.fillRect(rect(), *bg_brush_);
}
