#pragma once
#include "ui_edu_select_widget.h"
#include <QWidget>

class SideHistory;

class EduSelectWidget : public QWidget {
  Q_OBJECT
 public:
  enum {
    kUserRolePage = 0,
    kTeacherCreateRoomPage = 1,
    kSettingPage = 2,
    kTeacherReJoinRoomPage = 3,
    kStudentSelectRoomPage = 4
  };

 public:
  explicit EduSelectWidget(QWidget* parent = nullptr);
  void resizeEvent(QResizeEvent* e);
  void closeEvent(QCloseEvent*);
  void enableMask(bool enabled);

 private:
  void initControls();
  void initConnects();
  void initData();
  void enabledControls(bool enabled);
  void goTeacher();
  void goStudent();

 private:
  bool enabled_controls_;
  Ui::EduSelectWidget ui;
  QWidget* mask_widget_ = nullptr;
  SideHistory* side_widget_ = nullptr;
};