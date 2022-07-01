#include "group_video.h"
#include <QVBoxLayout>
#include <QTimer>

namespace vrd
{
	GroupVideo::GroupVideo(GroupPresenter *p, QWidget* parent)
		: QWidget(parent)
		, show_video_(false)
		, is_myself_(false)
		, state_(VideoState::kNormal)
		, presenter_(p)
	{
		QVBoxLayout* main_layout = new QVBoxLayout();
		main_layout->setContentsMargins(2, 4, 2, 0);
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

		QWidget *wdt_speak = new QWidget();
		wdt_speak->setFixedSize(170, 100);
		wdt_speak->setStyleSheet("border-radius: 2px; background-color: #394254;");
		QVBoxLayout *speak_layout = new QVBoxLayout(wdt_speak);

		QLabel *lbl_speak = new QLabel("上台中");
		lbl_speak->setFixedSize(42, 22);
		lbl_speak->setAlignment(Qt::AlignCenter);
		lbl_speak->setStyleSheet("font: 14px \"微软雅黑\"; color: #86909C;");
		speak_layout->addWidget(lbl_speak, 0, Qt::AlignCenter);
		this->wdt_stacked_->addWidget(wdt_speak);

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

	GroupVideo::~GroupVideo()
	{
		clean();
	}

	void GroupVideo::init(const std::string &user_id, bool myself, const std::string &user_name, VideoState s)
	{
		user_id_ = user_id;
		is_myself_ = myself;

		setUserName(user_name);

		if ((VideoState::kNormal == state_) && (VideoState::kNormal == s))
		{
			tryShowVideo();
		}
		else
		{
			setState(s);
		}
	}

	void GroupVideo::clean()
	{
		setShowVideo(false);
	}

	void GroupVideo::onVideoAdd()
	{
		if (VideoState::kNormal == state_)
		{
			setShowVideo(true);
		}
	}

	void GroupVideo::onVideoRemove()
	{
		if (VideoState::kNormal == state_)
		{
			setShowVideo(false);
		}
	}

	const std::string &GroupVideo::getUserId()
	{
		return user_id_;
	}

	void GroupVideo::setUserName(const std::string &name)
	{
		QString wName(name.c_str());
		char32_t firstChar[1] = { 0 };

		if (!wName.isEmpty())
		{
			firstChar[0] = wName.toUcs4()[0];
		}

		lbl_photo_->setText(QString::fromUcs4(firstChar, 1));
		lbl_user_name_->setText(wName + (is_myself_ ? "（我）" : ""));
	}

	void GroupVideo::setState(VideoState s)
	{
		if (state_ != s)
		{
			state_ = s;

			if (VideoState::kNormal == state_)
			{
				wdt_stacked_->setCurrentIndex(0);
				tryShowVideo();
			}
			else if (VideoState::kSpeaking == state_)
			{
				setShowVideo(false);
				wdt_stacked_->setCurrentIndex(2);
			}
			else if (VideoState::kDiscussing == state_)
			{
				setShowVideo(false);
				wdt_stacked_->setCurrentIndex(0);
			}
		}
	}

	void GroupVideo::forceUpdateVideo()
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

	void GroupVideo::tryShowVideo()
	{
		if (presenter_ != nullptr)
		{
            setShowVideo(true);
			/*if (presenter_->hasVideo(user_id_))
			{
				setShowVideo(true);
			}
			else
			{
				setShowVideo(false);
			}*/
		}
	}

	void GroupVideo::setShowVideo(bool show)
	{
		if (show_video_ != show)
		{
			show_video_ = show;

			if (show_video_)
			{
				wdt_stacked_->setCurrentIndex(1);

				if (presenter_ != nullptr)
				{
					presenter_->setVideoWindow(user_id_, getVideoWindow());
				}
			}
			else
			{
				wdt_stacked_->setCurrentIndex(0);

				if (presenter_ != nullptr)
				{
					presenter_->setVideoWindow(user_id_, NULL);
				}
			}
		}
	}

	WId GroupVideo::getVideoWindow()
	{
		return wdt_video_->winId();
	}
}
