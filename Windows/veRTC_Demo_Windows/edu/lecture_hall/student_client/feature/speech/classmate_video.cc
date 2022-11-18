#include "classmate_video.h"
#include <QVBoxLayout>
#include <QTimer>
#include <QDebug>

namespace vrd
{
	ClassmateVideo::ClassmateVideo(PlatformPresenter *p, QWidget* parent)
		: QWidget(parent)
		, show_video_(false)
		, is_myself_(false)
		, presenter_(p)
	{
		QVBoxLayout* main_layout = new QVBoxLayout();
		main_layout->setContentsMargins(2, 0, 2, 0);
		main_layout->setSpacing(0);

		this->wdt_stacked_ = new QStackedWidget();
		this->wdt_stacked_->setFixedSize(170, 100);

		QWidget *wdt_photo = new QWidget();
		wdt_photo->setFixedSize(170, 100);
		wdt_photo->setStyleSheet("border-radius: 2px; background-color: #394254;");
		QVBoxLayout *photo_layout = new QVBoxLayout(wdt_photo);

		this->lbl_photo_ = new QLabel();
		this->lbl_photo_->setFixedSize(36, 36);
		this->lbl_photo_->setStyleSheet("border-image: url(:/img/image/photo_bg.png); font: 16px \"微软雅黑\"; color: #FFFFFF;");
		this->lbl_photo_->setAlignment(Qt::AlignCenter);
		photo_layout->addWidget(this->lbl_photo_, 0, Qt::AlignCenter);
		this->wdt_stacked_->addWidget(wdt_photo);

		this->wdt_video_ = new QWidget();
		this->wdt_video_->setAttribute(Qt::WA_NativeWindow);
		this->wdt_video_->setFixedSize(170, 100);
		this->wdt_video_->setStyleSheet("border-radius: 2px; background-color: black;");
		this->wdt_video_->setUpdatesEnabled(false);
		this->wdt_stacked_->addWidget(this->wdt_video_);
		this->wdt_stacked_->setCurrentIndex(0);
		main_layout->addWidget(this->wdt_stacked_, 0, Qt::AlignHCenter);

		this->lbl_user_name_ = new QLabel();
		this->lbl_user_name_->setFixedHeight(24);
		this->lbl_user_name_->setContentsMargins(8, 0, 8, 0);
		this->lbl_user_name_->setStyleSheet("font: 12px \"微软雅黑\"; color: #FFFFFF;");
		main_layout->addWidget(this->lbl_user_name_, 0, Qt::AlignLeft);

		this->setLayout(main_layout);
	}

	ClassmateVideo::~ClassmateVideo()
	{
		clean();
	}

	void ClassmateVideo::init(const std::string &user_id, bool myself, const std::string &user_name)
	{
		user_id_ = user_id;
		is_myself_ = myself;

		setUserName(user_name);

		tryShowVideo();
	}

	void ClassmateVideo::clean()
	{
		setShowVideo(false);
	}

	void ClassmateVideo::onVideoAdd()
	{
		setShowVideo(true);
	}

	void ClassmateVideo::onVideoRemove()
	{
		setShowVideo(false);
	}

	const std::string &ClassmateVideo::getUserId()
	{
		return user_id_;
	}

	bool ClassmateVideo::getShowVideo()
	{
		return show_video_;
	}

	void ClassmateVideo::setUserName(const std::string &name)
	{
		QString wide_name(name.c_str());
		char32_t first_char[1] = { 0 };

		if (!wide_name.isEmpty())
		{
			first_char[0] = wide_name.toUcs4()[0];
		}

		lbl_photo_->setText(QString::fromUcs4(first_char, 1));
		lbl_user_name_->setText(wide_name + (is_myself_ ? "（我）" : ""));
	}

	void ClassmateVideo::forceUpdateVideo()
	{
		if (show_video_)
		{
			wdt_video_->setUpdatesEnabled(true);

			QTimer::singleShot(50, this, [this]()
				{
					wdt_video_->setUpdatesEnabled(false);
				}
			);
		}
	}

	void ClassmateVideo::tryShowVideo()
	{
		if (presenter_ != nullptr)
		{
			if (presenter_->hasVideo(user_id_))
			{
				setShowVideo(true);
			}
			else
			{
				setShowVideo(false);
			}
		}
	}

	void ClassmateVideo::setShowVideo(bool show)
	{
		if (show_video_ != show)
		{
			show_video_ = show;

			if (show_video_)
			{
				wdt_stacked_->setCurrentIndex(1);

				if (presenter_ != nullptr)
				{
					forceUpdateVideo();
					presenter_->setVideoWindow(user_id_, getVideoWindow());
				}
			}
			else
			{
				wdt_stacked_->setCurrentIndex(0);

				if (presenter_ != nullptr)
				{
					wdt_video_->setUpdatesEnabled(true);
					presenter_->setVideoWindow(user_id_, NULL);
				}
			}
		}
	}

	WId ClassmateVideo::getVideoWindow()
	{
		return wdt_video_->winId();
	}
}
