#include <QStandardPaths>
#include <QApplication>

#include "core/application.h"
#include "core/module_navigator.h"
#include "core/session_base.h"
#include "logger.h"

#ifdef USERNAME_LOGIN
#include "username_login/username_login_widget.h"
#endif

void regComponents();

int main(int argc, char* argv[]) {
    QApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
    QApplication::setAttribute(Qt::AA_UseHighDpiPixmaps);
    QApplication a(argc, argv);
    QApplication::setQuitOnLastWindowClosed(false);
    regComponents();

 #ifdef USERNAME_LOGIN
    UserNameLogin w;
    w.checkSaveData();
 #endif // USERNAME_LOGIN

    qInstallMessageHandler(Common::log::outputMessage);
    qInfo("-----------app start");
    int nRet = a.exec();
    qInfo("-----------app quit");
    qInstallMessageHandler(nullptr);
    return nRet;
}

void regComponents() {
  vrd::SessionBase::registerThis();
  vrd::ModuleNavigator::registerThis();
}
