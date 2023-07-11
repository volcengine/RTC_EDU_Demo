#ifndef VRD_APPLICATION_H
#define VRD_APPLICATION_H

#include <string>
#include <memory>
#include <map>
#include "component_interface.h"

#define VRD_UTIL_COMPONENT_INTERFACE_NAME(I)			"Interface_"#I"_Ptr"

#define VRD_UTIL_REGISTER_COMPONENT_PARAM(I, C)			VRD_UTIL_COMPONENT_INTERFACE_NAME(I), std::shared_ptr<I>(new C())
#define VRD_UTIL_GET_COMPONENT_PARAM(I)					VRD_UTIL_COMPONENT_INTERFACE_NAME(I), (I*)nullptr

namespace vrd
{
	class Application final
	{
	public:
		static Application& getSingleton();

	private:
		Application() {}

	public:
		template<typename T> bool registerComponent(std::string&& name, std::shared_ptr<T>&& component)
		{
			auto ret = components_.emplace(std::move(name), std::move(component));
			return ret.second;
		}

		template<typename T> std::shared_ptr<T> getComponent(const std::string& name, T*)
		{
			return std::static_pointer_cast<T>(components_.at(name));
		}

	private:
		std::map<std::string, std::shared_ptr<IComponent>> components_;
	};
}

#define VRD_FUNC_RIGESTER_COMPONET(I, C)				vrd::Application::getSingleton().registerComponent(VRD_UTIL_REGISTER_COMPONENT_PARAM(I, C))
#define VRD_FUNC_GET_COMPONET(I)						vrd::Application::getSingleton().getComponent(VRD_UTIL_GET_COMPONENT_PARAM(I))

#endif // VRD_APPLICATION_H
