#ifndef TEACHERLAYOUT_H
#define TEACHERLAYOUT_H
#include <lecture_hall/teacher_client/feature/speech/room_view.h>

#include "edu/core/room_base_notify.h"
#include "app_ui_state.h"
#include "group/watch_view.h"
#include "core/component/alert.h"
#include <QPointer>

class QWidget;
class QLabel;
class QTimer;
class Videocell;

namespace Ui {
class BCTeacherLayout;
}

namespace BC {
class TeacherRoom : public QWidget, public RB::NotifyBase {
  enum CLASS_STATUS { READY, PROGRESSING };

  Q_OBJECT

 public:
  explicit TeacherRoom(QWidget* parent = nullptr);
  ~TeacherRoom();
  void AddTeacherItem(const QString& name);
  void AddOnlineTitle();
  void AddStudentLine();
  void UpdateGroupStudentInfo();

 public slots:
  void TimerTick();
  void SetClassName(const QString& str) const;
  void SetClassID(const QString& str) const;
  void ShowGroupSpeaker();
  void CloseGroupSpeaker() const;

 protected:
  void closeEvent(QCloseEvent* event) override;
  void showEvent(QShowEvent* event) override;
  void onLoginElsewhere() override;
  void onEndClass(const std::string& room_id) override;

 private:
  void InitSigSlots();
  void TriggerStartClass();
  void InitTimer();
  void DropCall();
  void RtcInit();
  void InitRoomInfos();
  void InitUIElements();
  void InitTeacherVideoCell();
  void UpdateOnlineTitle(int num);

 private:
  Ui::BCTeacherLayout* ui;
  qlonglong m_ticknum{0};
  qlonglong m_duaration_class{0};
  QTimer* m_globalTimer_{nullptr};
  QLabel* m_lbl_students_list_{nullptr};
  QLabel* m_tearch_name_{nullptr};
  Videocell* m_local_preview_{nullptr};
  QWidget* m_group_speaker{nullptr};
  vrd::WatchView* pWatchView_;
  vrd::RoomView* pRoomView_;
  CLASS_STATUS m_class_status_;
  QPointer<vrd::Alert> m_begin_class_alert;
  bool m_is_goupspeak_{false};
  bool m_is_interacting{false};
  bool m_is_inspecting{false};
  bool m_is_sure_closing{false};
  bool m_is_closing{false};
  std::string m_room_id_;
  std::string m_user_id_;
  std::string m_user_name_;
  std::string m_room_name_;
  // RoomPtr m_room_host_;
};
}  // namespace BC
#endif  // TEACHERLAYOUT_H
