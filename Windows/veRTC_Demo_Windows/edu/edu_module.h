#pragma once
#include <QObject>
#include "core/module_interface.h"
#include "edu_select_widget.h"

namespace vrd {
class EduModule : public QObject, public IModule {
  Q_OBJECT

signals:
	void sigEduModuleReturn();

public:
	static void addThis();

private:
	EduModule();

public:
	~EduModule();

public:
	void open() override;
	void close() override;
	void quit(bool error = false) override;

private:
	EduSelectWidget* edu_select_widget_{nullptr};
};

}  // namespace vrd

