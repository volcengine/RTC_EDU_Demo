#ifndef VRD_BREAKOUTSTUDENTEVENT_H
#define VRD_BREAKOUTSTUDENTEVENT_H

#include <QObject>
#include <functional>

namespace vrd
{
	class BreakoutStudentEvent : public QObject
	{
		Q_OBJECT

	public:
		void setMarkListener(std::function<void(void)> &&l);
		void onSpeakersChanged4Mark();

	public:
		void emitClassmatesChanged();
		void emitSpeakersChanged4Mark();
		void emitDiscussingChanged(bool discuss);

		void emitVideoAdd(const std::string &user_id);
		void emitVideoRemove(const std::string &user_id);

	signals:
		void sigClassmatesChanged();
		void sigSpeakersChanged4Mark();
		void sigDiscussingChanged(bool discuss);

		void sigVideoAdd(const std::string &user_id);
		void sigVideoRemove(const std::string &user_id);

	private:
		std::function<void(void)> mark_listener_;
	};
}

#endif // VRD_BREAKOUTSTUDENTEVENT_H
