#ifndef VRD_PLATFORMPRESENTER_H
#define VRD_PLATFORMPRESENTER_H

#include <QObject>
#include <qwindowdefs.h>
#include "../../common/lecture_student_data_mgr.h"

namespace vrd
{
	class IPlatformView
	{
	public:
		virtual void setSpeakers(const std::list<std::unique_ptr<Student>> &list) = 0;

		virtual void onVideoAdd(const std::string &user_id) = 0;
		virtual void onVideoRemove(const std::string &user_id) = 0;

		virtual void onApplyChanged(bool applied) = 0;
	};

	class PlatformPresenter : public QObject
	{
		Q_OBJECT

	public:
		PlatformPresenter(QObject *parent, IPlatformView *v);
		~PlatformPresenter();

	public:
		void init();

	public:
		bool hasVideo(const std::string &user_id);
		void setVideoWindow(const std::string &user_id, WId wnd_id);

		bool isMyself(const std::string &user_id);

		void apply(bool cancel = false);

		void speechEnd();

	private slots:
		void onSpeakersChanged();

		void onVideoAdd(const std::string &user_id);
		void onVideoRemove(const std::string &user_id);

		void onApplyChanged(bool applied);

	private:
		IPlatformView *view_;

		std::shared_ptr<LectureStudentDataMgr> data_mgr_;
	};
}

#endif // VRD_PLATFORMPRESENTER_H
