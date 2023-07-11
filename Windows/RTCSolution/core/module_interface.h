#ifndef VRD_MODULE_H
#define VRD_MODULE_H

namespace vrd
{
	/** {zh}
	* 场景模块基类，每个场景都继承于该类，用于完成场景的进入和退出
	*/

	/** {en}
	* scene module base class, each scene is inherited from this class, used to complete the entry and exit of the scene
	*/
	class IModule
	{
	public:
		virtual ~IModule() {}

	public:
		virtual void open() = 0;
		virtual void close() = 0;
		virtual void quit(bool error = false) = 0;
	};
}

#endif // VRD_MODULE_H
