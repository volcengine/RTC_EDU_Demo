#include <QStandardPaths>
#include <QApplication>
#include <QTranslator>
#include "core/application.h"
#include "core/module_navigator.h"
#include "core/session_base.h"
#include "logger.h"

#include "login_widget.h"

void regComponents();

int main(int argc, char* argv[]) {
    QApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
    QApplication::setAttribute(Qt::AA_UseHighDpiPixmaps);
    QApplication a(argc, argv);

    QTranslator translator;
    if (translator.load(QLocale(), "common", "_", ":/translations")) {
        a.installTranslator(&translator);
    } else if (translator.load(QString("common_zh_CN"), QString(":/translations"))) {
        a.installTranslator(&translator);
    }

    QApplication::setQuitOnLastWindowClosed(false);
    regComponents();

    LoginWidget w;
    w.checkSaveData();
 
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
