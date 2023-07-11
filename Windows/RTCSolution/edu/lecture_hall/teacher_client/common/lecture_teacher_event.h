#ifndef VRD_LECTURETEACHEREVENT_H
#define VRD_LECTURETEACHEREVENT_H

#include <QObject>

namespace vrd
{
	class LectureTeacherEvent : public QObject
	{
		Q_OBJECT

	public:
		void emitApplicantsChanged();
		void emitSpeakersChanged();

		void emitVideoAdd(const std::string &user_id);
		void emitVideoRemove(const std::string &user_id);

	signals:
		void sigApplicantsChanged();
		void sigSpeakersChanged();

		void sigVideoAdd(const std::string &user_id);
		void sigVideoRemove(const std::string &user_id);
	};
}

#endif // VRD_LECTURETEACHEREVENT_H
