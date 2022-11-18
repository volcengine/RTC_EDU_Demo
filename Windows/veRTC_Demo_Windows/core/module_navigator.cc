#include "module_navigator.h"
#include <assert.h>
#include "application.h"

namespace vrd
{
    void ModuleNavigator::registerThis() {
        VRD_FUNC_RIGESTER_COMPONET(vrd::INavigator, ModuleNavigator);
    }

    void ModuleNavigator::add(std::string&& name, std::shared_ptr<IModule>&& module) {
        modules_.emplace(std::move(name), std::move(module));
    }

    void ModuleNavigator::go(const std::string& name) {
        if (name.empty()) {
            return;
        }

        if (!current_.empty()) {
            modules_.at(current_)->close();
        }

        if (name == current_) {
            modules_.at(current_)->open();
            return;
        }
        current_ = name;
        modules_.at(current_)->open();
    }

    std::shared_ptr<IModule> ModuleNavigator::get(const std::string& name) {
        if (name.empty()) {
            assert(false);
        }
        return modules_.at(name);
    }

    void ModuleNavigator::quit() {
        if (!current_.empty()) {
            modules_.at(current_)->quit();
        }
    }
}
