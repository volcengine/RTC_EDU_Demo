#include "configer.h"
#include <QSettings>
#include <memory>
#include <QApplication>

static constexpr char* kINIFile = "/veRTCDemo.ini";

Configer& Configer::instance() {
  static Configer conf;
  return conf;
}

std::string Configer::getData(const std::string key) {
  auto settings = std::unique_ptr<QSettings>(new QSettings(
      QApplication::applicationDirPath() + kINIFile, QSettings::IniFormat));
  return settings->value(key.c_str()).toString().toUtf8().constData();
}

void Configer::saveData(const std::string& key, const std::string& name) {
  auto settings = std::unique_ptr<QSettings>(new QSettings(
      QApplication::applicationDirPath() + kINIFile, QSettings::IniFormat));
  settings->setValue(key.c_str(), name.c_str());
}
