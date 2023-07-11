#ifndef VRD_NAVIGATOR_H
#define VRD_NAVIGATOR_H

#include <string>
#include <memory>
#include "component_interface.h"
#include "module_interface.h"

namespace vrd
{
	class INavigator : public IComponent
	{
	public:
		virtual void add(std::string&& name, std::shared_ptr<IModule>&& module) = 0;
		virtual void go(const std::string& name) = 0;
		virtual std::shared_ptr<IModule> get(const std::string& name) = 0;
		virtual void quit() = 0;
	};
}

#endif // VRD_NAVIGATOR_H
