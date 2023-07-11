#include "application.h"

namespace vrd
{
	Application& Application::getSingleton()
	{
		static Application app;
		return app;
	}
}
