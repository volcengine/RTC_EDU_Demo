#ifndef VRD_WATCHVIDEO_H
#define VRD_WATCHVIDEO_H

#include <QWidget>
#include <QStackedWidget>
#include <QLabel>
#include "watch_presenter.h"

namespace vrd
{
	class WatchVideo : public QWidget
	{
		Q_OBJECT

	public:
		WatchVideo(WatchPresenter *p, QWidget* parent = nullptr);
		~WatchVideo();

	public:
		void init(const std::string &user_id, const std::string &user_name);
		void clean();

		void onVideoAdd();
		void onVideoRemove();

		const std::string &getUserId();

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

		WatchPresenter *presenter_;
	};
}

#endif // VRD_WATCHVIDEO_H
