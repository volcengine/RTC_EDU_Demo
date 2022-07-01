#ifndef VRD_STUDENTVIDEO_H
#define VRD_STUDENTVIDEO_H

#include <QWidget>
#include <QStackedWidget>
#include <QLabel>
#include <QPushButton>
#include "room_presenter.h"

namespace vrd
{
	class StudentVideo : public QWidget
	{
		Q_OBJECT

	public:
		StudentVideo(RoomPresenter *p, QWidget* parent = nullptr);
		~StudentVideo();

	public:
		void init(const std::string &user_id, const std::string &user_name);
		void clean();

		void onVideoAdd();
		void onVideoRemove();

		const std::string &getUserId();
		bool getShowVideo();

		void setUserName(const std::string &name);
		void forceUpdateVideo();

	private slots:
		void onClicked();

	private:
		void tryShowVideo();
		void setShowVideo(bool show);
		WId getVideoWindow();

	private:
		QStackedWidget *wdt_stacked_;
		QLabel *lbl_photo_;
		QWidget *wdt_video_;
		QLabel *lbl_user_name_;
		QPushButton *btn_disconnect_;

		bool show_video_;
		std::string user_id_;

		RoomPresenter *presenter_;
	};
}

#endif // VRD_STUDENTVIDEO_H
