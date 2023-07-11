#ifndef VRD_ROOMPRESENTER_H
#define VRD_ROOMPRESENTER_H

#include <QObject>
#include <qwindowdefs.h>
#include "../../common/lecture_teacher_data_mgr.h"
#include "../../common/lecture_teacher_data_def.h"

namespace vrd
{
	class IRoomView
	{
	public:
		virtual void setApplicants(const std::list<std::unique_ptr<Applicant>> &list) = 0;
		virtual void setSpeakers(const std::list<std::unique_ptr<Student>> &list) = 0;

		virtual void onVideoAdd(const std::string &user_id) = 0;
		virtual void onVideoRemove(const std::string &user_id) = 0;
	};

	class RoomPresenter : public QObject
	{
		Q_OBJECT

	public:
		RoomPresenter(QObject *parent, IRoomView *v);
		~RoomPresenter();

	public:
		void init();

	public:
		bool hasVideo(const std::string &user_id);
		void setVideoWindow(const std::string &user_id, WId wnd_id);

		int getSpeakerCount();

		void approval(const std::string &user_id);
		void disconnect(const std::string &user_id);

	private slots:
		void onApplicantsChanged();
		void onSpeakersChanged();

		void onVideoAdd(const std::string &user_id);
		void onVideoRemove(const std::string &user_id);

	private:
		IRoomView *view_;

		std::shared_ptr<LectureTeacherDataMgr> data_mgr_;
	};
}

#endif // VRD_ROOMPRESENTER_H 
