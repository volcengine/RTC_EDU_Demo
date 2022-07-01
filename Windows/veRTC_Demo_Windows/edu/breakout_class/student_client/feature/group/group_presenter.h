#ifndef VRD_GROUPPRESENTER_H
#define VRD_GROUPPRESENTER_H

#include <QObject>
#include <qwindowdefs.h>
#include "../../common/breakout_student_data_mgr.h"

namespace vrd
{
	class IGroupView
	{
	public:
		virtual void setGroupIndex(int64_t index) = 0;
		virtual void setClassmates(const std::list<std::unique_ptr<Student>> &classmates, const std::list<std::unique_ptr<Student>> &speakers, bool discuss) = 0;
		virtual void markSpeakers(const std::list<std::unique_ptr<Student>> &list) = 0;
		virtual void markDiscussing(bool discuss) = 0;

		virtual void onVideoAdd(const std::string &user_id) = 0;
		virtual void onVideoRemove(const std::string &user_id) = 0;
	};

	class GroupPresenter : public QObject
	{
		Q_OBJECT

	public:
		GroupPresenter(QObject *parent, IGroupView *v);
		~GroupPresenter();

	public:
		void init();

	public:
		bool hasVideo(const std::string &user_id);
		void setVideoWindow(const std::string &user_id, WId wnd_id);

		bool isMyself(const std::string &user_id);

	private slots:
		void onClassmatesChanged();
		void onSpeakersChanged();
		void onDiscussingChanged(bool discuss);

		void onVideoAdd(const std::string &user_id);
		void onVideoRemove(const std::string &user_id);

	private:
		IGroupView *view_;

		std::shared_ptr<BreakoutStudentDataMgr> data_mgr_;
	};
}

#endif // VRD_GROUPPRESENTER_H
