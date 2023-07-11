#ifndef VRD_TIMEOBJECT_H
#define VRD_TIMEOBJECT_H

#include <functional>
#include <QTimer>

namespace vrd
{
	class TimerObject : public QObject
	{
	public:
		TimerObject();

	public:
		void start(int msec, std::function<void(void)>&& callback);
		void stop();

	private slots:
		void onTimeout();

	private:
		QTimer timer_;
		std::function<void(void)> cb_;
	};
}

#endif // VRD_TIMEOBJECT_H
