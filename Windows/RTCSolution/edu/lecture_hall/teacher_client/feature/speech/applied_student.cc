#include "applied_student.h"
#include <QHBoxLayout>
#include <QTimer>
#include "core/util_tip.h"

namespace vrd
{
	AppliedStudent::AppliedStudent(RoomPresenter *p, QWidget *parent)
		: QWidget(parent)
		, presenter_(p)
	{
		QHBoxLayout *main_layout = new QHBoxLayout();
		main_layout->setContentsMargins(16, 0, 16, 0);
		main_layout->setSpacing(8);

		this->lbl_photo_ = new QLabel();
		this->lbl_photo_->setFixedSize(24, 24);
		this->lbl_photo_->setStyleSheet("border-image: url(:/img/image/photo_bg.png); font: 12px \"微软雅黑\"; color: #FFFFFF;");
		this->lbl_photo_->setAlignment(Qt::AlignCenter);
		main_layout->addWidget(this->lbl_photo_);

		this->lbl_user_name_ = new QLabel();
		this->lbl_user_name_->setStyleSheet("font: 14px \"微软雅黑\"; color: #FFFFFF;");
		main_layout->addWidget(this->lbl_user_name_);

		main_layout->addStretch();

		this->lbl_microphone_ = new QLabel();
		this->lbl_microphone_->setFixedSize(16, 16);
		this->lbl_microphone_->setStyleSheet("border-image: url(:/img/audio_unmute);");
		main_layout->addWidget(this->lbl_microphone_);

		this->btn_approval_ = new QPushButton("给麦");
		this->btn_approval_->setFlat(true);
		this->btn_approval_->setFixedSize(36, 22);
		this->btn_approval_->setStyleSheet("border: none; font: 14px \"微软雅黑\"; color: #FFFFFF;");
		main_layout->addWidget(this->btn_approval_);

		this->setLayout(main_layout);

		connect(this->btn_approval_, &QPushButton::clicked, this, &AppliedStudent::onClicked);
	}

	void AppliedStudent::setUserId(const std::string &id)
	{
		user_id_ = id;
	}

	void AppliedStudent::setUserName(const std::string &name)
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

	QSize AppliedStudent::sizeHint() const
	{
		return QSize(200, 40);
	}

	void AppliedStudent::setMicrophoneMute(bool mute)
	{
		if (mute)
		{
			lbl_microphone_->setStyleSheet("border-image: url(:/img/audio_mute);");
		}
		else
		{
			lbl_microphone_->setStyleSheet("border-image: url(:/img/audio_unmute);");
		}
	}

	void AppliedStudent::onClicked()
	{
		if (nullptr != presenter_)
		{
			if (presenter_->getSpeakerCount() < 6)
			{
				btn_approval_->setEnabled(false);
				QTimer::singleShot(3 * 1000, this, [this]()
					{
						btn_approval_->setEnabled(true);
					}
				);

				presenter_->approval(user_id_);
			}
			else
			{
				util::showToastInfo("上台人数已满");
			}
		}
	}
}
