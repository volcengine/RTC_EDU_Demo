#pragma once
#include <QObject>
#include "core/module_interface.h"

namespace vrd {
class SceneSelectModule : public QObject, public IModule {
	Q_OBJECT

signals:
	void sigSceneSelectReturn();

public:
	static void addThis();

private:
	SceneSelectModule();

public:
	~SceneSelectModule();

public:
	void open() override;
	void close() override;

public:
	void quit(bool error = false);
};

}  // namespace vrd

