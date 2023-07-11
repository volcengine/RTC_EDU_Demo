#ifndef VRD_WATCHVIEW_H
#define VRD_WATCHVIEW_H

#include <QListWidget>
#include <QLabel>
#include "watch_presenter.h"
#include "watch_video.h"

namespace vrd
{
	class WatchView : public QListWidget, public IWatchView
	{
		Q_OBJECT

	public:
		WatchView(QWidget* parent = nullptr);

	public:
		void setGroupIndex(int64_t index);
		void setStudents(const std::list<std::unique_ptr<Student>> &list) override;

		void onVideoAdd(const std::string &user_id) override;
		void onVideoRemove(const std::string &user_id) override;

	private:
		WatchVideo *getWatchVideo(const std::string &user_id);

	private:
		const int kTitleCount = 1;

	private:
		QLabel *lbl_title_;

		WatchPresenter *presenter_;
	};
}

#endif // VRD_WATCHVIEW_H
