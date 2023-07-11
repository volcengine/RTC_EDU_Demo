#ifndef VRD_GROUPVIEW_H
#define VRD_GROUPVIEW_H

#include <QListWidget>
#include <QLabel>
#include <QCloseEvent>
#include "group_presenter.h"
#include "group_video.h"

namespace vrd
{
	class GroupView : public QListWidget, public IGroupView
	{
		Q_OBJECT

	public:
		GroupView(QWidget* parent = nullptr);

	public:
		void setGroupIndex(int64_t index) override;
		void setClassmates(const std::list<std::unique_ptr<Student>> &classmates, const std::list<std::unique_ptr<Student>> &speakers, bool discuss) override;
		void markSpeakers(const std::list<std::unique_ptr<Student>> &list) override;
		void markDiscussing(bool discuss) override;

		void onVideoAdd(const std::string &user_id) override;
		void onVideoRemove(const std::string &user_id) override;

	private:
		GroupVideo *getGroupVideo(const std::string &user_id);

	private:
		const int kTitleCount = 1;

	private:
		QLabel *lbl_title_;

		GroupPresenter *presenter_;
	};
}

#endif // VRD_GROUPVIEW_H
