#pragma once
#include <qstringlist.h>

#include <QComboBox>
#include <QObject>

#include "core/application.h"
#include "core/callback_helper.h"
#include "edu/core/edu_session.h"
#include "defination.h"
#include "rtc/bytertc_engine_interface.h"

#define BoolToQString(b) QVariant(b).toString()
#define IntToQString(i) QString::number(i)

#define ZERO_CHECK(a) \
  if (a == nullptr) return

#define RES_CODE_CHECK(p) \
  if (p != 200) return
#define WSS_SESSION AppUIState::GetInstance().Session()

class AppUIState : public QObject {
  Q_OBJECT

 public:
  static AppUIState &GetInstance();
  ~AppUIState();

  std::shared_ptr<vrd::EduSession> Session() { return session_; }

  // enumerate device
  void GetCameraList(QComboBox *out);
  void GetAudioInDeviceList(QComboBox *out);
  void GetAudioOutDeviceList(QComboBox *out);

  void SetUserRole(room_type::USER_ROLE role);
  void SetClassType(room_type::CLASS_TYPE type);

 signals:
  void sigAudioVolumeIndication(const bytertc::AudioVolumeInfo *speakers,
                                unsigned int speaker_number,
                                int total_remote_volume);
  void sigReturnMainPage();
  void sigReturnRoleSeletePage();

 public Q_SLOTS:
  void StartClass();
  void StopClass();

 private:
  AppUIState();

  std::shared_ptr<vrd::EduSession> session_;
  // in room
  QString m_room_name_;
  QString m_room_id_;
  QWidget *m_room_;

  room_type::USER_ROLE m_cur_user_role_{room_type::USER_ROLE::UNKOWN};
  room_type::CLASS_TYPE m_cur_class_type_{room_type::CLASS_TYPE::UNKOWN};
};
