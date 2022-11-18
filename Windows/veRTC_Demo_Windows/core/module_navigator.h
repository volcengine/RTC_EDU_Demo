#ifndef VRD_MODULENAVIGATOR_H
#define VRD_MODULENAVIGATOR_H

#include <string>
#include <memory>
#include <map>
#include "navigator_interface.h"
#include "module_interface.h"

namespace vrd
{
	class ModuleNavigator final : public INavigator
	{
	public:
		static void registerThis();

	private:
		ModuleNavigator() {}

	public:
		void add(std::string&& name, std::shared_ptr<IModule>&& module) override;
		void go(const std::string& name) override;
		std::shared_ptr<IModule> get(const std::string& name) override;
		void quit() override;

	private:
		std::map<std::string, std::shared_ptr<IModule>> modules_;
		std::string current_;
	};
}

#endif // VRD_MODULENAVIGATOR_H
