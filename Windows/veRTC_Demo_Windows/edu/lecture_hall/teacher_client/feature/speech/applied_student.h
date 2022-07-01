#ifndef VRD_APPLIEDSTUDENT_H
#define VRD_APPLIEDSTUDENT_H

#include <QWidget>
#include <QLabel>
#include <QPushButton>
#include "room_presenter.h"

namespace vrd
{
	class AppliedStudent : public QWidget
	{
		Q_OBJECT

	public:
		AppliedStudent(RoomPresenter *p, QWidget *parent = nullptr);

	public:
		void setUserId(const std::string &id);
		void setUserName(const std::string &name);
		void setMicrophoneMute(bool mute);

	public:
		QSize sizeHint() const override;

	private slots:
		void onClicked();

	private:
		QLabel *lbl_photo_;
		QLabel *lbl_user_name_;
		QLabel *lbl_microphone_;
		QPushButton *btn_approval_;

		std::string user_id_;

		RoomPresenter *presenter_;
	};
}

#endif // VRD_APPLIEDSTUDENT_H
