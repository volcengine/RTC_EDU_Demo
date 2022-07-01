#ifndef VRD_MODULE_H
#define VRD_MODULE_H

namespace vrd
{
	class IModule
	{
	public:
		virtual ~IModule() {}

	public:
		virtual void open() = 0;
		virtual void close() = 0;
	};
}

#endif // VRD_MODULE_H
