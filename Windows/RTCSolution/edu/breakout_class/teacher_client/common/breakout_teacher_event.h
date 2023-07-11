#ifndef VRD_BREAKOUTTEACHEREVENT_H
#define VRD_BREAKOUTTEACHEREVENT_H

#include <QObject>
#include <memory>
#include "edu/core/data_def_base.h"
#include "breakout_teacher_data_def.h"

namespace vrd
{
	class BreakoutTeacherEvent : public QObject
	{
		Q_OBJECT

	public:
		void emitGroupListArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Group>>> &list);
		void emitGroupStudentsArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list);

		void emitVideoAdd(const std::string &user_id);
		void emitVideoRemove(const std::string &user_id);

	signals:
		void sigGroupListArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Group>>> &list);
		void sigGroupStudentsArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list);

		void sigVideoAdd(const std::string &user_id);
		void sigVideoRemove(const std::string &user_id);
	};
}

#endif // VRD_BREAKOUTTEACHEREVENT_H
