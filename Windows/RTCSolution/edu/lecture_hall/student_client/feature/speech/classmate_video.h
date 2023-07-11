#ifndef VRD_CLASSMATEVIDEO_H
#define VRD_CLASSMATEVIDEO_H

#include <QWidget>
#include <QStackedWidget>
#include <QLabel>
#include "platform_presenter.h"

namespace vrd
{
	class ClassmateVideo : public QWidget
	{
		Q_OBJECT

	public:
		ClassmateVideo(PlatformPresenter *p, QWidget* parent = nullptr);
		~ClassmateVideo();

	public:
		void init(const std::string &user_id, bool myself, const std::string &user_name);
		void clean();

		void onVideoAdd();
		void onVideoRemove();

		const std::string &getUserId();
		bool getShowVideo();

		void setUserName(const std::string &name);
		void forceUpdateVideo();

	private:
		void tryShowVideo();
		void setShowVideo(bool show);
		WId getVideoWindow();

	private:
		QStackedWidget *wdt_stacked_;
		QLabel *lbl_photo_;
		QWidget *wdt_video_;
		QLabel *lbl_user_name_;

		bool show_video_;
		std::string user_id_;
		bool is_myself_;

		PlatformPresenter *presenter_;
	};
}

#endif // VRD_CLASSMATEVIDEO_H
