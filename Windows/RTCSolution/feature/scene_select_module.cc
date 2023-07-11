#include "scene_select_module.h"

#include "core/application.h"
#include "core/navigator_interface.h"
#include "QApplication"

namespace vrd {
void SceneSelectModule::addThis() {
  Application::getSingleton()
      .getComponent(VRD_UTIL_GET_COMPONENT_PARAM(vrd::INavigator))
      ->add("scene_select",
            std::shared_ptr<IModule>((IModule*)(new SceneSelectModule())));
}

SceneSelectModule::SceneSelectModule() {}

SceneSelectModule::~SceneSelectModule() {}

void SceneSelectModule::open() {}

void SceneSelectModule::close() {}

void SceneSelectModule::quit(bool) {}
}  // namespace vrd
