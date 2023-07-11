#ifndef VRD_LECTURETEACHERDATADEF_H
#define VRD_LECTURETEACHERDATADEF_H

#include "edu/core/data_def_base.h"

namespace vrd
{
	struct Applicant : public Student
	{
		bool is_mute = false;
	};
}

#endif // VRD_LECTURETEACHERDATADEF_H
