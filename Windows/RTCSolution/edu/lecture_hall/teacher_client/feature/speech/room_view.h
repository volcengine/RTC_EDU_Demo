#ifndef VRD_ROOMVIEW_H
#define VRD_ROOMVIEW_H

#include <QListWidget>
#include <QLabel>
#include "room_presenter.h"
#include "student_video.h"
#include "applied_student.h"

namespace vrd
{
	class RoomView : public QListWidget, public IRoomView
	{
		Q_OBJECT

	public:
		RoomView(QWidget* parent = nullptr);

	public:
		void setApplicants(const std::list<std::unique_ptr<Applicant>> &list) override;
		void setSpeakers(const std::list<std::unique_ptr<Student>> &list) override;

		void onVideoAdd(const std::string &user_id) override;
		void onVideoRemove(const std::string &user_id) override;

	private:
		void setTitleLabel(int number);
		StudentVideo *getStudentVideo(const std::string &user_id);

	private:
		const int kTitleCount = 1;

	private:
		QLabel *lbl_title_;

		int video_count_;

		RoomPresenter *presenter_;
	};
}

#endif // VRD_ROOMVIEW_H
