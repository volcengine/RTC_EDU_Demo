#ifndef VRD_BREAKOUTTEACHERDATADEF_H
#define VRD_BREAKOUTTEACHERDATADEF_H

#include <string>

namespace vrd
{
	struct Group
	{
		int64_t group_index = 0;
		std::string group_room_id;
		std::string group_room_token;
	};
}

#endif // VRD_BREAKOUTTEACHERDATADEF_H
