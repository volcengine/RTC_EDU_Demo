#include "student_video.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QTimer>
#include <QDebug>
#include "core/util_tip.h"

// TODO: 这个视频控件和其他几个视频控件（XxxxVideo）封装为一个通用控件?

namespace vrd
{
	StudentVideo::StudentVideo(RoomPresenter *p, QWidget* parent)
		: QWidget(parent)
		, show_video_(false)
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
		this->wdt_stacked_->setCurrentIndex(0);
		main_layout->addWidget(this->wdt_stacked_, 0, Qt::AlignHCenter);

		QWidget *wdt_bottom = new QWidget();
		wdt_bottom->setFixedSize(170, 32);

		QHBoxLayout *bottom_layout = new QHBoxLayout();
		bottom_layout->setContentsMargins(8, 0, 4, 0);

		this->lbl_user_name_ = new QLabel();
		this->lbl_user_name_->setStyleSheet("font: 12px \"微软雅黑\"; color: #FFFFFF;");
		bottom_layout->addWidget(this->lbl_user_name_);

		bottom_layout->addStretch();

		this->btn_disconnect_ = new QPushButton("断开");
		this->btn_disconnect_->setFlat(true);
		this->btn_disconnect_->setFixedSize(44, 24);
		this->btn_disconnect_->setStyleSheet("border-image: url(:/img/image/disconnect_bg.png); font: 14px \"微软雅黑\"; color: #E63F3F;");
		bottom_layout->addWidget(this->btn_disconnect_);

		wdt_bottom->setLayout(bottom_layout);
		main_layout->addWidget(wdt_bottom, 0, Qt::AlignHCenter);
		this->setLayout(main_layout);

		connect(this->btn_disconnect_, &QPushButton::clicked, this, &StudentVideo::onClicked);
	}

	StudentVideo::~StudentVideo()
	{
		clean();
	}

	void StudentVideo::init(const std::string &user_id, const std::string &user_name)
	{
		user_id_ = user_id;

		setUserName(user_name);

		tryShowVideo();
	}

	void StudentVideo::clean()
	{
		setShowVideo(false);
	}

	void StudentVideo::onVideoAdd()
	{
		setShowVideo(true);
	}

	void StudentVideo::onVideoRemove()
	{
		setShowVideo(false);
	}

	const std::string &StudentVideo::getUserId()
	{
		return user_id_;
	}

	bool StudentVideo::getShowVideo()
	{
		return show_video_;
	}

	void StudentVideo::setUserName(const std::string &name)
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

    void StudentVideo::forceUpdateVideo()
    {
        if (show_video_)
        {
            wdt_video_->setUpdatesEnabled(true);
            QTimer::singleShot(50, this, [this]()
                {
                    wdt_video_->setUpdatesEnabled(false);
                });
        }
    }

    void StudentVideo::onClicked()
    {
        if (nullptr != presenter_)
        {
            auto presenter = presenter_;
            auto user_id = user_id_;

            if (util::showAlertConfirm("是否确认将该学生下台？"))
            {
                presenter->disconnect(user_id);
            }
        }
    }

	void StudentVideo::tryShowVideo()
	{
		if (presenter_ != nullptr)
		{
			//setShowVideo(true);
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

    void StudentVideo::setShowVideo(bool show)
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

	WId StudentVideo::getVideoWindow()
	{
		return wdt_video_->winId();
	}
}
