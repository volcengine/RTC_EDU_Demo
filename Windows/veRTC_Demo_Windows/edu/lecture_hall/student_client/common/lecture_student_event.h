#ifndef VRD_LECTURESTUDENTEVENT_H
#define VRD_LECTURESTUDENTEVENT_H

#include <QObject>

namespace vrd
{
	class LectureStudentEvent : public QObject
	{
		Q_OBJECT

	public:
		void emitSpeakersChanged();
		void emitSpeakersChanged4Mark();

		void emitVideoAdd(const std::string &user_id);
		void emitVideoRemove(const std::string &user_id);

		void emitApplyChanged(bool applied);

	signals:
		void sigSpeakersChanged();
		void sigSpeakersChanged4Mark();

		void sigVideoAdd(const std::string &user_id);
		void sigVideoRemove(const std::string &user_id);

		void sigApplyChanged(bool applied);
	};
}

#endif // VRD_LECTURESTUDENTEVENT_H
