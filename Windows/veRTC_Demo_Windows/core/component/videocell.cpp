#include "videocell.h"
#include <QVBoxlayout>
#include <QSpacerItem>
#include <QLabel>
#include <QEvent>
#include <QMouseEvent>
#include <QStackedWidget>

static constexpr char* kDisplayNameQSS =
"color:#ffffff;"
"font-weight:400;"
"font:12px;"
"font-family:\"Microsoft YaHei\";"
;

static constexpr char* kAudioMuteQSS =
"background-image:url(:img/"
"audio_mute);background-position:center;background-repeat:"
"no-repeat;"
;

static constexpr char* kAudioUnmuteQSS =
"background-image:url(:img/"
"audio_unmute);background-position:center;background-repeat:"
"no-repeat;"
;

static constexpr char* kVideoMuteQSS =
"background-image:url(:img/"
"video_mute);background-position:center;background-repeat:"
"no-repeat;"
;

static constexpr char* kVideoUnmuteQSS =
"background-image:url(:img/"
"video_unmute);background-position:center;background-repeat:"
"no-repeat;"
;

static constexpr char* kCameraQSS =
"background-image:url(:img/"
"local_camera_mute);background-position:center;background-repeat:"
"no-repeat;"
;
Videocell::Videocell(bool ennaleClick, QWidget* p)
	:QWidget(p),
	m_can_click_(ennaleClick)
{
	this->setContentsMargins(0, 0, 0, 0);
	this->setMinimumWidth(p->width()+20);
	this->setMaximumWidth(p->width()+20);
    pPreview = new QWidget;
	pPreview->setMinimumWidth(272);
	pPreview->setMaximumWidth(272);
	pPreview->setUpdatesEnabled(false);
	auto pBgWidget = new QWidget;
	auto cameraLogo = new QLabel;
	cameraLogo->setMinimumWidth(55);
	cameraLogo->setMinimumHeight(65);
	auto vvbox = new QVBoxLayout;
	vvbox->addWidget(cameraLogo, 0, Qt::AlignCenter);
	cameraLogo->setStyleSheet(kCameraQSS);
	pBgWidget->setStyleSheet("background:#394254;");
	pBgWidget->setLayout(vvbox);
	auto layout = new QVBoxLayout;
	m_stacked_widget_ = new QStackedWidget;
	m_stacked_widget_->setContentsMargins(0, 0, 0, 0);
	m_stacked_widget_->addWidget(pPreview);
	m_stacked_widget_->addWidget(pBgWidget);

	auto hbox = new QHBoxLayout;
	this->setLayout(layout);
	layout->setContentsMargins(0, 0, 0, 0);
	layout->addWidget(m_stacked_widget_);
	m_stacked_widget_->setFixedSize(p->width(), p->height() - 26);

	m_display_name_ = new QLabel;
	m_display_name_->setStyleSheet(kDisplayNameQSS);

	m_audio_label_ = new QLabel;
	m_audio_label_->setFixedSize(14, 14);
	m_video_label_ = new QLabel;
	m_video_label_->setFixedSize(16, 16);
	if (m_can_click_)
	{
		m_audio_label_->installEventFilter(this);
		m_video_label_->installEventFilter(this);
	}
	hbox->setContentsMargins(0, 0, 16, 0);
	hbox->setAlignment(Qt::AlignVCenter);
	hbox->addItem(new QSpacerItem(16, 0, QSizePolicy::Fixed, QSizePolicy::Minimum));
	hbox->addWidget(m_display_name_, 0, Qt::AlignVCenter);
	hbox->addItem(new QSpacerItem(10, 0, QSizePolicy::Expanding, QSizePolicy::Minimum));
	hbox->addWidget(m_audio_label_, 0, Qt::AlignVCenter);
	hbox->addItem(new QSpacerItem(18, 0, QSizePolicy::Preferred, QSizePolicy::Minimum));
	hbox->addWidget(m_video_label_, 0, Qt::AlignTop);
	hbox->addItem(new QSpacerItem(17, 0, QSizePolicy::Fixed, QSizePolicy::Fixed));

	layout->addLayout(hbox);
}

Videocell::~Videocell()
{

}

void Videocell::SetDisplayName(const QString& name)
{
	m_display_name_->setText(name);
}

void Videocell::RemoteSetVideoMute(bool mute)
{
	updateVideoIcon(mute);
}

void Videocell::updateAudioIcon(bool mute)
{
	m_baudiomute = mute;

	if (mute) {
		m_audio_label_->setStyleSheet(kAudioMuteQSS);
	}
	else {
		m_audio_label_->setStyleSheet(kAudioUnmuteQSS);
	}
	emit SigMuteAudio(mute);
}

void Videocell::updateVideoIcon(bool mute)
{
	m_bvideomute = mute;

	if (mute) {
		m_stacked_widget_->setCurrentIndex(1);
		m_video_label_->setStyleSheet(kVideoMuteQSS);
	}
	else {
		m_stacked_widget_->setCurrentIndex(0);
		m_video_label_->setStyleSheet(kVideoUnmuteQSS);
	}
	emit SigMuteVideo(mute);
}

void Videocell::RemoteSetAudioMute(bool mute)
{
	updateAudioIcon(mute);
}

bool Videocell::eventFilter(QObject* obj, QEvent* event)
{
	if (obj == m_video_label_ || obj == m_audio_label_)//指定某个QLabel
	{
		if (event->type() == QEvent::MouseButtonPress) //鼠标点击
		{
			QMouseEvent* mouseEvent = static_cast<QMouseEvent*>(event); // 事件转换

			if (mouseEvent->button() == Qt::LeftButton)
			{
				if (obj == m_video_label_)
				{
					updateVideoIcon(!m_bvideomute);
				}
				else
				{
					updateAudioIcon(!m_baudiomute);
				}
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}
	else
	{
		// pass the event on to the parent class
		return QWidget::eventFilter(obj, event);
	}
}

HWND Videocell::GetView()
{
	return (HWND)pPreview->winId();
}
