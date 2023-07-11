#pragma once

#include <QWidget>

#include "edu/core/room_base_notify.h"
#include "app_ui_state.h"
#include "group/group_view.h"
#include "lecture_hall/student_client/feature/speech/platform_view.h"

class Videocell;

namespace Ui {
class BCStudentLayout;
}

typedef qlonglong ll;

namespace BC {
class StudentRoom final : public QWidget, public RB::NotifyBase {
  Q_OBJECT

 public:
  explicit StudentRoom(QWidget* parent = nullptr);
  ~StudentRoom();
  void closeEvent(QCloseEvent* event) override;
  void showEvent(QShowEvent* event) override;
  void resizeEvent(QResizeEvent* event) override;

  void onTeacherCameraOff(const std::string& room_id) override;
  void onTeacherCameraOn(const std::string& room_id) override;
  void onTeacherMicOn(const std::string& room_id) override;
  void onTeacherMicOff(const std::string& room_id) override;
  void onTeacherJoinRoom(const std::string& room_id) override;
  void onTeacherLeaveRoom(const std::string& room_id) override;
  void onBeginClass(const std::string& room_id) override;
  void onEndClass(const std::string& room_id) override;
  void onOpenGroupSpeech(const std::string& room_id) override;
  void onCloseGroupSpeech(const std::string& room_id) override;
  void onOpenVideoInteract() override;
  void onCloseVideoInteract() override;

  void RtcInit();
  void InitTimer();
  void InitSigSlots();
  void DropCall();
  void InitRoomInfos();

 private:
  Ui::BCStudentLayout* ui;
  Videocell* m_teacher_preview_{nullptr};
  vrd::PlatformView* m_handsupWidget_{nullptr};
  vrd::GroupView* pGroupView{nullptr};
  ll m_ticknum_{0};
  ll m_duaration_class_{0};
  QTimer* m_globalTimer_{nullptr};
  QWidget* m_group_speaker_{nullptr};
  bool m_is_handsupwidget_collapse_{false};
  bool m_class_processing_{false};
  bool m_is_sure_closing_{false};
  bool m_is_leaving_room_{false};

  std::string m_room_id_;
  std::string m_teacher_user_id_;
  std::string m_teacher_user_name_;
  std::string m_room_name_;

 public slots:
  void TimerTick();
  void SetClassName(const QString& str);
  void SetClassID(const QString& str);
  void SetTeacherName(const QString& str);
  void ShowGroupSpeaker();
  void HideGroupSpeaker();
  void UpStage();
  void DownStage();
};
}  // namespace BC
