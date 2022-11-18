#pragma once

#include <string>
#include <functional>

#include "rtc_build_config.h"

namespace vrd
{
	void getJoinRTSParams(const std::string& scenesName, const std::string& loginToken, std::function<void(int)>&& callback);
}