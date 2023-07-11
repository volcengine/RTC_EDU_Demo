#ifndef VRD_CALLBACKOBJECT_H
#define VRD_CALLBACKOBJECT_H

#include <functional>
#include <QObject>

namespace vrd
{
	class CallbackObject : public QObject
	{
		Q_OBJECT

	public:
		CallbackObject();

	public:
		void emitCallback(std::function<void(void)>&& cb);

	private slots:
		void onCallback(const std::function<void(void)>& cb);

	signals:
		void sigCallback(const std::function<void(void)>& cb);
	};
}

#endif // VRD_CALLBACKOBJECT_H
