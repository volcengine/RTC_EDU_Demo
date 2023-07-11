#pragma once
#include <QWidget>
#include "ui_device_setting.h"

class QTimer;

class DeviceSetting : public QWidget {
  Q_OBJECT

 public:
  DeviceSetting(QWidget* parent = Q_NULLPTR);
  void setButtonEnabled(bool enabled);
  void startTest();
  void stopTest();
  void paintEvent(QPaintEvent* e);
  ~DeviceSetting();

signals:
	void sigJoinClass();

 private:
	 Ui::DeviceSetting ui;
};
