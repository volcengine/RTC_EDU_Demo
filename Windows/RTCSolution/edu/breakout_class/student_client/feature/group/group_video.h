#ifndef VRD_GROUPVIDEO_H
#define VRD_GROUPVIDEO_H

#include <QWidget>
#include <QStackedWidget>
#include <QLabel>
#include "group_presenter.h"

namespace vrd
{
	class GroupVideo : public QWidget
	{
		Q_OBJECT

	public:
		GroupVideo(GroupPresenter *p, QWidget* parent = nullptr);
		~GroupVideo();

	public:
		enum class VideoState { kNormal = 0, kSpeaking, kDiscussing };

	public:
		void init(const std::string &user_id, bool myself, const std::string &user_name, VideoState s);
		void clean();

		void onVideoAdd();
		void onVideoRemove();

		const std::string &getUserId();

		void setUserName(const std::string &name);
		void setState(VideoState s);
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
		VideoState state_;

		GroupPresenter *presenter_;
	};
}

#endif // VRD_GROUPVIDEO_H
