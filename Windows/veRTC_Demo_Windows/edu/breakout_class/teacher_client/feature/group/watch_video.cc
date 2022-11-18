#include "watch_video.h"
#include <QVBoxLayout>

namespace vrd
{
	WatchVideo::WatchVideo(WatchPresenter *p, QWidget* parent)
		: QWidget(parent)
		, show_video_(false)
		, presenter_(p)
	{
		QVBoxLayout* main_layout = new QVBoxLayout();
		main_layout->setContentsMargins(2, 4, 2, 0);
		main_layout->setSpacing(0);

		this->wdt_stacked_ = new QStackedWidget();
		this->wdt_stacked_->setFixedSize(170, 100);

		QWidget *wdt_photo_ = new QWidget();
		wdt_photo_->setFixedSize(170, 100);
		wdt_photo_->setStyleSheet("border-radius: 2px; background-color: #394254;");
		QVBoxLayout *photo_layout = new QVBoxLayout(wdt_photo_);

		this->lbl_photo_ = new QLabel();
		this->lbl_photo_->setFixedSize(36, 36);
		this->lbl_photo_->setStyleSheet("border-image: url(:/img/image/photo_bg.png); font: 16px \"微软雅黑\"; color: #FFFFFF;");
		this->lbl_photo_->setAlignment(Qt::AlignCenter);
		photo_layout->addWidget(this->lbl_photo_, 0, Qt::AlignCenter);
		this->wdt_stacked_->addWidget(wdt_photo_);

		this->wdt_video_ = new QWidget();
		this->wdt_video_->setAttribute(Qt::WA_NativeWindow);
		this->wdt_video_->setFixedSize(170, 100);
		this->wdt_video_->setStyleSheet("border-radius: 2px; background-color: black;");
		this->wdt_video_->setUpdatesEnabled(false);
		this->wdt_stacked_->addWidget(this->wdt_video_);
		this->wdt_stacked_->setCurrentIndex(0);
		main_layout->addWidget(this->wdt_stacked_, 0, Qt::AlignHCenter);

		QWidget *wdt_bottom = new QWidget();
		wdt_bottom->setFixedSize(170, 32);

		QHBoxLayout *bottom_layout = new QHBoxLayout();
		bottom_layout->setContentsMargins(8, 0, 8, 0);

		this->lbl_user_name_ = new QLabel();
		this->lbl_user_name_->setFixedHeight(32);
		this->lbl_user_name_->setStyleSheet("font: 12px \"微软雅黑\"; color: #FFFFFF;");
		bottom_layout->addWidget(this->lbl_user_name_, 0, Qt::AlignLeft);

		wdt_bottom->setLayout(bottom_layout);
		main_layout->addWidget(wdt_bottom, 0, Qt::AlignHCenter);
		this->setLayout(main_layout);
	}

	WatchVideo::~WatchVideo()
	{
		clean();
	}

	void WatchVideo::init(const std::string &user_id, const std::string &user_name)
	{
		user_id_ = user_id;

		setUserName(user_name);

		tryShowVideo();
	}

	void WatchVideo::clean()
	{
		setShowVideo(false);
	}

	void WatchVideo::onVideoAdd()
	{
		setShowVideo(true);
	}

	void WatchVideo::onVideoRemove()
	{
		setShowVideo(false);
	}

	const std::string &WatchVideo::getUserId()
	{
		return user_id_;
	}

	void WatchVideo::setUserName(const std::string &name)
	{
		QString wide_name(name.c_str());
		char32_t first_char[1] = { 0 };

		if (!wide_name.isEmpty())
		{
			first_char[0] = wide_name.toUcs4()[0];
		}

		lbl_photo_->setText(QString::fromUcs4(first_char, 1));
		lbl_user_name_->setText(wide_name);
	}

	void WatchVideo::forceUpdateVideo()
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

	void WatchVideo::tryShowVideo()
	{
		setShowVideo(true);
        //if (presenter_ != nullptr)
        //{
        //    if (presenter_->hasVideo(user_id_))
        //    {
        //        setShowVideo(true);
        //    }
        //    else
        //    {
        //        setShowVideo(false);
        //    }
        //}
	}

	void WatchVideo::setShowVideo(bool show)
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

	WId WatchVideo::getVideoWindow()
	{
		return wdt_video_->winId();
	}
}
