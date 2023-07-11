#ifndef VRD_WATCHPRESENTER_H
#define VRD_WATCHPRESENTER_H

#include <QObject>
#include <QTimer>
#include <qwindowdefs.h>
#include "../../common/breakout_teacher_data_mgr.h"

namespace vrd
{
	class IWatchView
	{
	public:
		virtual void setGroupIndex(int64_t index) = 0;
		virtual void setStudents(const std::list<std::unique_ptr<Student>> &list) = 0;

		virtual void onVideoAdd(const std::string &user_id) = 0;
		virtual void onVideoRemove(const std::string &user_id) = 0;
	};

	class WatchPresenter : public QObject
	{
		Q_OBJECT

	public:
		WatchPresenter(QObject *parrent, IWatchView *v);
		~WatchPresenter();

	public:
		void init();

	public:
		bool hasVideo(const std::string &user_id);
		void setVideoWindow(const std::string &user_id, WId wnd_id);

	private slots:
		void onGroupListArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Group>>> &list);
		void onGroupStudentsArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list);

		void onVideoAdd(const std::string &user_id);
		void onVideoRemove(const std::string &user_id);

		void onTimeout();

		void onNextGroup();
		void onNextCircle();

	private:
		IWatchView *view_;

		int group_list_key_;
		int group_students_key_;

		std::shared_ptr<std::list<std::unique_ptr<Group>>> groups_;

		std::shared_ptr<BreakoutTeacherDataMgr> data_mgr_;
	};
}

#endif // VRD_WATCHPRESENTER_H
