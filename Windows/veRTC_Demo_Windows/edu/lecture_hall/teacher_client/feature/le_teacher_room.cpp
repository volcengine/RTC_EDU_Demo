#include "le_teacher_room.h"

#include <core/application.h>
#include <core/session_base.h>
#include <qdebug.h>

#include <QJsonObject>
#include <QJsonDocument>
#include <QJsonArray>
#include <QCloseEvent>
#include <QTime>
#include <QPoint>
#include <mutex>

#include "core/application.h"
#include "core/navigator_interface.h"
#include "OnLineItem.h"
#include "QSpacerItem"
#include "core/util.h"
#include "core/edu_rtc_engine_wrap.h"
#include "core/util_tip.h"
#include "edu/core/data_mgr.h"
#include "feature/data_mgr.h"
#include "speech/room_view.h"
#include "toast.h"
#include "ui_le_teacherlayout.h"

#pragma region QSS
static constexpr char* kBtnNegative =
    "font:12pt;								"
    "		  "
    "border:2px;							  "
    "border-radius:4px;							"
    "	  "
    "padding:2px 4px;							"
    "		  "
    "background-color:rgba(255, 255, 255, 0.1);		  "
    "font-family:\"Microsoft YaHei\";				  "
    "font-size: 16px;							"
    "		  "
    "color:#4e5969;							"
    "		  "
    "width:80;								"
    "		  "
    "height:32;								"
    "		  ";

static constexpr char* kBtnActive =
    "font:12pt;								"
    "		  "
    "border:2px;							  "
    "border-radius:4px;							"
    "	  "
    "padding:2px 4px;							"
    "		  "
    "background-color:rgba(255, 255, 255, 0.1);		  "
    "font-family:\"Microsoft YaHei\";				  "
    "font-size: 16px;							"
    "		  "
    "color:#FFFFFF;							"
    "		  "
    "width: 80;								"
    "		  "
    "height: 32;							"
    "			  ";

static constexpr char* kBtnStartClass =
    "font: 14pt;							"
    "			  "
    "border:2px;							  "
    "border-radius:4px;							"
    "	  "
    "padding:2px 4px;							"
    "		  "
    "background-color:#4086ff;		  "
    "font-family:\"Microsoft YaHei\";				  "
    "font-size: 16px;							"
    "		  "
    "color: #FFFFFF;							"
    "		  "
    "width: 80;								"
    "		  "
    "height: 32;							"
    "			  ";

static constexpr char* kBtnStopClass =
    "border:2px;							  "
    "border-radius:4px;							"
    "	  "
    "padding:2px 4px;							"
    "		  "
    "background-color:#e63f3f;						  "
    "font-family:\"Microsoft YaHei\";					  "
    "font-size: 16px;							"
    "		  "
    "color: #FFFFFF;							"
    "		  "
    "width : 80;							"
    "			  "
    "height : 32;							"
    "			  "
    "background-image:url(:img/out_of_class);		  "
    "background-position:center;					"
    "	  "
    "background-repeat:no-repeat;					  ";
#pragma endregion

namespace LE {
TeacherRoom::TeacherRoom(QWidget* parent)
    : QWidget(parent),
      m_globalTimer_(new QTimer(parent)),
      m_class_status_(CLASS_STATUS::READY),
      ui(new Ui::LETeacherLayout) {
  
    ui->setupUi(this);

	EduRTCEngineWrap::initDevice();
	InitUIElements();
	InitTeacherVideoCell();
	InitRoomInfo();
	InitSigSlots();
	InitTimer();
}

TeacherRoom::~TeacherRoom() {
    EduRTCEngineWrap::resetDevice();
    RtcUnInit();
	delete ui;
}

void TeacherRoom::AddOnlineStudent(std::string& user_id, const QString& name) {
  auto itemWidget = new OnLineItem(this);
  itemWidget->setContentsMargins(16, 0, 0, 0);
  itemWidget->SetUserName(name);
  auto item = new QListWidgetItem();
  item->setSizeHint(QSize(272, 40));

  ui->listWidget->addItem(item);
  ui->listWidget->setItemWidget(item, itemWidget);
  if (m_stu_info_map_.contains(user_id) == false) {
    m_stu_info_map_[user_id] = item;
  }
}

void TeacherRoom::AddTeacherItem(const QString& name) {
  auto widget = new QWidget;
  widget->setContentsMargins(16, 0, 0, 0);
  auto m_lbl_logo = new QLabel;
  m_tearch_name_ = new QLabel;
  auto m_layout_ = new QHBoxLayout;
  m_lbl_logo->setAlignment(Qt::AlignCenter);
  m_lbl_logo->setStyleSheet(
      "background-image:url(:img/"
      "teacher_bg);background-position:center;background-repeat:"
      "no-repeat;");
  m_lbl_logo->setMinimumWidth(28);
  auto key = name.mid(0, 1);
  m_lbl_logo->setText(key);
  m_tearch_name_ = new QLabel(name, this);
  widget->setStyleSheet(
      "color:#fff; font-family:\"Microsoft YaHei\"; font-size:14px;");
  m_layout_ = new QHBoxLayout(this);
  m_layout_->setContentsMargins(10, 0, 0, 0);
  m_layout_->setSpacing(8);

  auto lbl_teacher_const_text = new QLabel;
  lbl_teacher_const_text->setAlignment(Qt::AlignCenter);
  lbl_teacher_const_text->setFixedSize(44, 24);
  lbl_teacher_const_text->setContentsMargins(0, 0, 0, 0);
  lbl_teacher_const_text->setText("老师");
  lbl_teacher_const_text->setStyleSheet(
      "border-radius:12px;background:#1d2129;"
      "color:#4080ff;"
      "font:14px;"
      "font-weight:400;");
  m_layout_->addWidget(m_lbl_logo);
  m_layout_->addWidget(m_tearch_name_);
  m_layout_->addItem(new QSpacerItem(0, 0, QSizePolicy::Expanding));
  m_layout_->addWidget(lbl_teacher_const_text);
  m_layout_->addItem(new QSpacerItem(28, 0, QSizePolicy::Fixed));
  widget->setLayout(m_layout_);
  auto item = new QListWidgetItem();
  item->setSizeHint(QSize(272, 40));

  ui->listWidget->addItem(item);
  ui->listWidget->setItemWidget(item, widget);
}

void TeacherRoom::AddOnlineTitle() {
  m_lbl_students_list_ = new QLabel;
  m_lbl_students_list_->setText("人员列表");
  m_lbl_students_list_->setContentsMargins(18, 0, 0, 0);
  m_lbl_students_list_->setStyleSheet(
      "font-size: 16px;"
      "font-family:\"Microsoft YaHei\";"
      "color: #fff;"
      "font-weight:500;");
  auto item = new QListWidgetItem();
  item->setSizeHint(QSize(272, 56));

  ui->listWidget->addItem(item);
  ui->listWidget->setItemWidget(item, m_lbl_students_list_);
}

void TeacherRoom::AddStudentLine() {
  auto widget = new QWidget;
  auto hbox = new QHBoxLayout;
  auto left_line = new QLabel;
  auto right_line = new QLabel;
  auto student_text = new QLabel;

  student_text->setText("学生");
  student_text->setAlignment(Qt::AlignCenter);
  student_text->setContentsMargins(0, 0, 0, 0);
  student_text->setFixedSize(44, 24);
  student_text->setStyleSheet(
      "border-radius:12px;background:#1d2129;"
      "font-family:\"Microsoft YaHei\";"
      "color:#86909c;"
      "font:14px;"
      "font-weight:400;");

  left_line->setStyleSheet(
      "background-image:url(:img/"
      "student_line_bg);background-position:center;background-repeat:"
      "no-repeat;"
      "width:94px ; height:1px;");

  right_line->setStyleSheet(
      "background-image:url(:img/"
      "student_line_bg);background-position:center;background-repeat:"
      "no-repeat;"
      "width:94px ; height:1px;");

  hbox->addWidget(left_line);
  hbox->addWidget(student_text);
  hbox->addWidget(right_line);

  widget->setLayout(hbox);

  auto item = new QListWidgetItem();
  item->setSizeHint(QSize(272, 56));

  ui->listWidget->addItem(item);
  ui->listWidget->setItemWidget(item, widget);
}

void TeacherRoom::RemoveStudentItem(const std::string& user_id) {
  if (m_stu_info_map_.contains(user_id)) {
    ui->listWidget->removeItemWidget(m_stu_info_map_[user_id]);
    m_stu_info_map_.remove(user_id);
  }
}

void TeacherRoom::closeEvent(QCloseEvent* event) {
  if (m_is_sure_closing) {
    QWidget::closeEvent(event);
    return;
  }

  if (m_is_closing) {
    event->ignore();
    return;
  }
  m_is_closing = true;

  QWidget* dialog = new QWidget(this);
  QWidget* win = new QWidget;
  win->setStyleSheet(
      "background:#272e38;"
      "border-radius:8px;"
      "font-family:\"Microsoft YaHei\";");
  auto layout = new QVBoxLayout;
  layout->setContentsMargins(0, 0, 0, 0);
  dialog->setLayout(layout);
  layout->addWidget(win, 0, Qt::AlignCenter);
  win->setFixedSize(400, 238);
  auto vbox = new QVBoxLayout;
  auto vbox1 = new QVBoxLayout;
  vbox1->setAlignment(Qt::AlignHCenter);
  auto h1box = new QHBoxLayout;
  auto lbl_warnning = new QLabel;
  lbl_warnning->setFixedSize(18, 18);
  lbl_warnning->setStyleSheet(
      "background-image:url(:img/"
      "exit_warning);background-position:center;background-repeat:"
      "no-repeat;"
      "width:20px ; height:20px;");
  auto lbl_tip = new QLabel;
  lbl_tip->setStyleSheet(
      "color:#ffffff;"
      "font:14px;"
      "font-weight:500;");
  lbl_tip->setAlignment(Qt::AlignCenter);
  lbl_tip->setText("正在上课中,选择关闭软件,课程不会结束");
  h1box->addItem(
      new QSpacerItem(55, 22, QSizePolicy::Fixed, QSizePolicy::Maximum));
  h1box->addWidget(lbl_warnning);
  h1box->addWidget(lbl_tip);
  h1box->addItem(
      new QSpacerItem(10, 10, QSizePolicy::Expanding, QSizePolicy::Expanding));
  vbox->addItem(new QSpacerItem(1, 40, QSizePolicy::Fixed, QSizePolicy::Fixed));
  vbox->addLayout(h1box);
  vbox->addItem(new QSpacerItem(1, 47, QSizePolicy::Fixed, QSizePolicy::Fixed));
  vbox->setAlignment(Qt::AlignHCenter);
  // auto hbox = new QHBoxLayout;
  auto btn_close = new QPushButton;
  btn_close->setFixedHeight(36);
  btn_close->setFixedSize(240, 36);
  auto btn_cancel = new QPushButton;
  btn_cancel->setFixedHeight(36);
  connect(btn_cancel, &QPushButton::clicked, [dialog, this] {
    m_is_closing = false;
    dialog->close();
  });
  connect(btn_close, &QPushButton::clicked, [] { 
      VRD_FUNC_GET_COMPONET(vrd::INavigator)->quit();
      QApplication::quit();
  });
  btn_cancel->setFixedSize(240, 36);
  btn_close->setText("仅关闭软件,不下课");

  btn_cancel->setText("取消");
  btn_close->setStyleSheet(
      "background:#e63f3f;"
      "font-weight:400;"
      "color:#ffffff;"
      "font:14px;"
      "border:1px;"
      "border-radius:18px;");
  btn_cancel->setStyleSheet(
      "background:rgba(255,255,255,0.1);"
      "color:#ffffff;"
      "font-weight:400;"
      "font:14px;"
      "border:1px;"
      "border-radius:18px;");
  vbox->addWidget(btn_close, 0, Qt::AlignHCenter);
  vbox->addItem(new QSpacerItem(1, 24, QSizePolicy::Fixed, QSizePolicy::Fixed));
  vbox->addWidget(btn_cancel, 0, Qt::AlignHCenter);
  vbox->addItem(
      new QSpacerItem(1, 40, QSizePolicy::Expanding, QSizePolicy::Fixed));
  win->setLayout(vbox);
  dialog->setFixedSize(400, 238);
  dialog->setWindowFlags(Qt::Tool | Qt::FramelessWindowHint);
  dialog->setWindowModality(Qt::WindowModal);
  dialog->move(mapToGlobal(QPoint((this->width() - 400) / 2, (this->height() - 238) / 2)));
  dialog->show();
  event->ignore();
}

void TeacherRoom::showEvent(QShowEvent* event) { RtcInit(); }

void TeacherRoom::onBeginClass(const std::string& room_id) {}

void TeacherRoom::onOpenVideoInteract() {}

void TeacherRoom::onCloseVideoInteract() {}

void TeacherRoom::onLoginElsewhere() {
  qInfo() << "<------ onLoginElsewhere" << Qt::endl;
  m_is_sure_closing = true;
  close();
  emit AppUIState::GetInstance().sigReturnRoleSeletePage();
  QTimer::singleShot(1000, [] {
    Toast::showTip("用户在其它端加入同一房间", QApplication::activeWindow());
  });
}

void TeacherRoom::onEndClass(const std::string& room_id) {
	if (m_class_status_ == CLASS_STATUS::READY && !m_is_sure_closing) {
		qInfo() << "<------ onEndClass" << Qt::endl;
		if (m_begin_class_alert && m_begin_class_alert->isVisible()) {
			m_begin_class_alert->close();
		}
		m_globalTimer_->stop();
		m_is_sure_closing = true;
		close();
		emit AppUIState::GetInstance().sigReturnRoleSeletePage();
		QTimer::singleShot(1000, [] {
			Toast::showTip("因长时间未开课, 课程已结束", QApplication::activeWindow());
			});
	}
}

void TeacherRoom::UpdateOnlineTitle(int num) {
  QString des = "人员列表 (" + QString::number(num) + ")";
  m_lbl_students_list_->setText(des);
}

void TeacherRoom::InitUIElements() {
  setWindowTitle("大班课(教师端)");
  ui->listWidget->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
  ui->listWidget->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
  ui->listWidget->setFrameShape(QListWidget::NoFrame);
  ui->horizontalLayout->setAlignment(Qt::AlignCenter);
  ui->lab_record->setVisible(false);
  ui->lbl_record_icon->setVisible(false);

  ui->btn_share_screen->setVisible(false);
  ui->btn_share_screen->setStyleSheet(kBtnNegative);
  ui->btn_groupspeak->setStyleSheet(kBtnNegative);
  ui->btn_groupspeak->setEnabled(false);
  ui->btn_interact->setText("视频互动");
  ui->btn_interact->setStyleSheet(kBtnNegative);
  ui->btn_interact->setEnabled(false);
  ui->btn_class->setText("开始上课");
  ui->btn_class->setStyleSheet(kBtnStartClass);
  ui->horizontalLayout_2->addItem(
      new QSpacerItem(8, 1, QSizePolicy::Fixed, QSizePolicy::Fixed));

  auto contentWidget = new QWidget;
  auto content = new QLabel;
  auto vboxlayout = new QVBoxLayout;
  contentWidget->setLayout(vboxlayout);
  vboxlayout->addWidget(content);
  vboxlayout->setAlignment(Qt::AlignHCenter | Qt::AlignVCenter);
  content->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
  content->setAlignment(Qt::AlignCenter);
  content->setText("老师暂未共享屏幕");
  content->setStyleSheet(
      "font-family:\"Microsoft YaHei\";"
      "font:24pt;"
      "color:#86909C;"
      "font-weight:500;");

  ui->hbox_content->addWidget(contentWidget);

  AddOnlineTitle();
  AddTeacherItem(
      QString::fromStdString(DATAMGR_INS.current_room().teacher_name));
  AddStudentLine();
}

void TeacherRoom::InitTeacherVideoCell() {
    m_local_preview_ = new Videocell(true, ui->widget);
    EduRTCEngineWrap::setupLocalView(m_local_preview_->GetView(),
        bytertc::RenderMode::kRenderModeHidden,
        "local");
    m_local_preview_->SetDisplayName(
        QString::fromStdString(DATAMGR_INS.create_class_room().teacher_name));
    m_local_preview_->RemoteSetAudioMute(false);
    m_local_preview_->RemoteSetVideoMute(true);
}

void TeacherRoom::InitRoomInfo() {
  m_room_name_ = DATAMGR_INS.current_room().room_name;
  m_room_id_ = DATAMGR_INS.current_room().room_id;
  m_user_id_ = DATAMGR_INS.current_room().create_user_id;
  m_user_name_ = DATAMGR_INS.current_room().teacher_name;

  bool bMic_On = DATAMGR_INS.teacher_info().is_mic_on;
  bool bCamera_On = DATAMGR_INS.teacher_info().is_camera_on;

  if (bMic_On) {
      EduRTCEngineWrap::enableLocalAudio(true);
      EduRTCEngineWrap::muteLocalAudio(false);
  }
  else {
      EduRTCEngineWrap::enableLocalAudio(false);
      EduRTCEngineWrap::muteLocalAudio(true);
  }
  m_local_preview_->RemoteSetAudioMute(!bMic_On);

  if (bCamera_On) {
      EduRTCEngineWrap::enableLocalVideo(true);
      EduRTCEngineWrap::muteLocalVideo(false);
  }
  else {
      EduRTCEngineWrap::enableLocalVideo(false);
      EduRTCEngineWrap::muteLocalVideo(true);
  }
  m_local_preview_->RemoteSetVideoMute(!bCamera_On);

  ui->lab_room_name->setText(QString::fromStdString(m_room_name_));
  ui->lab_room_id->setText("课堂ID: " + QString::fromStdString(m_room_id_));
  m_local_preview_->SetDisplayName(QString::fromStdString(m_user_name_));

  int status = DATAMGR_INS.current_room().status;
  if (status == 2) {
    close();
    emit AppUIState::GetInstance().sigReturnMainPage();
  } else if (status == 1) {
    m_class_status_ = CLASS_STATUS::PROGRESSING;
    ui->btn_share_screen->setStyleSheet(kBtnActive);
    ui->btn_groupspeak->setStyleSheet(kBtnActive);
    ui->btn_groupspeak->setEnabled(true);
    ui->btn_interact->setStyleSheet(kBtnActive);
    ui->btn_interact->setEnabled(true);
    ui->btn_class->setStyleSheet(kBtnStopClass);
    ui->btn_class->setText("");
    ui->lab_record->setVisible(true);
    ui->lbl_record_icon->setVisible(true);

    QString timestamp =
        QString::number(QDateTime::currentMSecsSinceEpoch() * 1000000);

    uint64_t sec = timestamp.toULongLong();
    uint64_t real = DATAMGR_INS.current_room().begin_class_time_real;
    int diff = (sec - real) / 1000000000;
    m_duaration_class = diff;
  }

  auto bEnable_group_speech = DATAMGR_INS.current_room().enable_group_speech;
  if (bEnable_group_speech) {
      m_is_goupspeak_ = true;
      ui->btn_groupspeak->setStyleSheet(kBtnNegative);
      ui->btn_groupspeak->setText("结束集体发言");
      ui->btn_groupspeak->setFixedWidth(108);
      ui->btn_groupspeak->setStyleSheet(kBtnStartClass);
      ui->btn_interact->setEnabled(false);
      ui->btn_interact->setStyleSheet(kBtnNegative);

      ShowGroupSpeaker();
  }
  auto bEnable_interact = DATAMGR_INS.current_room().enable_interactive;
  if (bEnable_interact) {
      m_is_interacting = true;
      ui->btn_interact->setText("结束视频互动");
      ui->btn_interact->setFixedWidth(108);
      ui->btn_interact->setStyleSheet(kBtnStartClass);
      ui->btn_groupspeak->setEnabled(false);
      ui->btn_groupspeak->setStyleSheet(kBtnNegative);

      speechView = new vrd::RoomView();
      speechView->setFixedWidth(272);
      speechView->setAttribute(Qt::WA_DeleteOnClose);
      ui->hbox_content->insertWidget(0, speechView);
  }
}

void TeacherRoom::InitSigSlots() {
  QObject::connect(m_local_preview_, &Videocell::SigMuteAudio, this,
                   [this](bool mute) {
                     EduRTCEngineWrap::muteLocalAudio(mute);
                     if (mute) {
                       WSS_SESSION->eduTurnOffMic(m_room_id_, m_user_id_, NULL);
                     } else {
                       WSS_SESSION->eduTurnOnMic(m_room_id_, m_user_id_, NULL);
                     }
                   });

  QObject::connect(
      m_local_preview_, &Videocell::SigMuteVideo, this, [this](bool mute) {
        if (mute) {
          EduRTCEngineWrap::stopPreview();
          WSS_SESSION->eduTurnOffCamera(m_room_id_, m_user_id_, NULL);
        } else {
          EduRTCEngineWrap::startPreview();
          WSS_SESSION->eduTurnOnCamera(m_room_id_, m_user_id_, NULL);
        }
      });

  QObject::connect(ui->btn_groupspeak, &QPushButton::clicked, this, [this] {
    ui->btn_groupspeak->setEnabled(false);
    if (m_is_goupspeak_) {
      WSS_SESSION->closeGroupSpeech(
           vrd::DataMgr::instance().room_id(), vrd::DataMgr::instance().user_id(), [this](int code) {
            if (code < 300) {
              m_is_goupspeak_ = false;
              ui->btn_groupspeak->setStyleSheet(kBtnActive);
              ui->btn_groupspeak->setText("集体发言");
              ui->btn_groupspeak->setEnabled(true);
              ui->btn_interact->setFixedWidth(80);
              ui->btn_interact->setEnabled(true);
              ui->btn_interact->setStyleSheet(kBtnActive);

              CloseGroupSpeaker();
            }
          });

    } else {
      WSS_SESSION->openGroupSpeech(
           vrd::DataMgr::instance().room_id(), vrd::DataMgr::instance().user_id(), [this](int code) {
            if (code < 300) {
              m_is_goupspeak_ = true;
              ui->btn_groupspeak->setStyleSheet(kBtnNegative);
              ui->btn_groupspeak->setText("结束集体发言");
              ui->btn_groupspeak->setFixedWidth(108);
              ui->btn_groupspeak->setStyleSheet(kBtnStartClass);
              ui->btn_groupspeak->setEnabled(true);
              ui->btn_interact->setEnabled(false);
              ui->btn_interact->setStyleSheet(kBtnNegative);

              ShowGroupSpeaker();
            }
          });
    }
  });
  QObject::connect(ui->btn_interact, &QPushButton::clicked, this, [this] {
    ui->btn_interact->setEnabled(false);
    if (false == m_is_interacting) {
      WSS_SESSION->openVideoInteract(
           vrd::DataMgr::instance().room_id(), vrd::DataMgr::instance().user_id(), [this](int code) {
            RES_CODE_CHECK(code);
            m_is_interacting = true;
            ui->btn_interact->setText("结束视频互动");
            ui->btn_interact->setFixedWidth(108);
            ui->btn_interact->setStyleSheet(kBtnStartClass);
            ui->btn_interact->setEnabled(true);
            ui->btn_groupspeak->setEnabled(false);
            ui->btn_groupspeak->setStyleSheet(kBtnNegative);

            speechView = new vrd::RoomView();
            speechView->setFixedWidth(272);
            speechView->setAttribute(Qt::WA_DeleteOnClose);
            ui->hbox_content->insertWidget(0, speechView);
          });
    } else {
      WSS_SESSION->closeVideoInteract(
           vrd::DataMgr::instance().room_id(), vrd::DataMgr::instance().user_id(), [this](int code) {
            RES_CODE_CHECK(code);

            m_is_interacting = false;
            ui->btn_interact->setText("视频互动");
            ui->btn_interact->setStyleSheet(kBtnActive);
            ui->btn_interact->setFixedWidth(80);
            ui->btn_interact->setEnabled(true);
            ui->btn_groupspeak->setEnabled(true);
            ui->btn_groupspeak->setStyleSheet(kBtnActive);

            ZERO_CHECK(speechView);
            speechView->close();
            speechView = nullptr;
          });
    }
  });
  QObject::connect(ui->btn_class, &QPushButton::clicked, this, [this] {
    if (m_class_status_ == CLASS_STATUS::READY) {
      TriggerStartClass();
    } else if (m_class_status_ == CLASS_STATUS::PROGRESSING) {
      DropCall();
    }
  });

  QObject::connect(&EduRTCEngineWrap::instance(), &EduRTCEngineWrap::sigOnRoomStateChanged, this,
	  [this](std::string room_id, std::string uid, int state, std::string extra_info) {
		  if (room_id == vrd::DataMgr::instance().room_id()
			  && uid == vrd::DataMgr::instance().user_id()) {
			  auto infoArray = QByteArray(extra_info.data(), static_cast<int>(extra_info.size()));
			  auto infoJsonObj = QJsonDocument::fromJson(infoArray).object();
			  auto joinType = infoJsonObj["join_type"].toInt();
			  if (state == 0 && joinType == 1) {
				  WSS_SESSION->eduReconnect(uid, [this](int code) {
					   if (code == 422 || code == 419 || code == 404) {
						  m_is_sure_closing = true;
						  close();
						  emit AppUIState::GetInstance().sigReturnMainPage();
					  }
				  });
			  }
		  }
	  });
}

void TeacherRoom::InitTimer() {
    m_globalTimer_->setInterval(1000);
    connect(m_globalTimer_, &QTimer::timeout, this, &TeacherRoom::TimerTick);
    m_globalTimer_->start();
}

void TeacherRoom::DropCall() {
  QWidget* dialog = new QWidget(this);
  QWidget* win = new QWidget;
  win->setStyleSheet(
      "background:#272e38;"
      "border-radius:8px;"
      "font-family:\"Microsoft YaHei\";");
  auto layout = new QVBoxLayout;
  layout->setContentsMargins(0, 0, 0, 0);
  dialog->setLayout(layout);
  layout->addWidget(win, 0, Qt::AlignCenter);
  win->setFixedSize(400, 238);
  auto vbox = new QVBoxLayout;
  auto vbox1 = new QVBoxLayout;
  vbox1->setAlignment(Qt::AlignHCenter);
  auto h1box = new QHBoxLayout;
  auto lbl_warnning = new QLabel;
  lbl_warnning->setFixedSize(18, 18);
  lbl_warnning->setStyleSheet(
      "background-image:url(:img/"
      "exit_warning);background-position:center;background-repeat:"
      "no-repeat;"
      "width:20px ; height:20px;");
  auto lbl_tip = new QLabel;
  lbl_tip->setStyleSheet(
      "color:#ffffff;"
      "font:14px;"
      "font-weight:500;");
  lbl_tip->setAlignment(Qt::AlignCenter);
  lbl_tip->setText("结束课堂,学生将被移出房间");
  h1box->addItem(
      new QSpacerItem(90, 22, QSizePolicy::Fixed, QSizePolicy::Maximum));
  h1box->addWidget(lbl_warnning);
  h1box->addWidget(lbl_tip);
  h1box->addItem(
      new QSpacerItem(10, 10, QSizePolicy::Expanding, QSizePolicy::Expanding));
  vbox->addItem(new QSpacerItem(1, 40, QSizePolicy::Fixed, QSizePolicy::Fixed));
  vbox->addLayout(h1box);
  vbox->addItem(new QSpacerItem(1, 47, QSizePolicy::Fixed, QSizePolicy::Fixed));
  vbox->setAlignment(Qt::AlignHCenter);

  auto btn_close = new QPushButton;
  btn_close->setFixedHeight(36);
  btn_close->setFixedSize(240, 36);
  auto btn_cancel = new QPushButton;
  btn_cancel->setFixedHeight(36);
  connect(btn_cancel, &QPushButton::clicked, [dialog] { dialog->close(); });
  connect(btn_close, &QPushButton::clicked, this, [this, dialog] {
    WSS_SESSION->endClass(this->m_room_id_, this->m_user_id_,
                          [this, dialog](int code) {
                            RES_CODE_CHECK(code);

                            m_class_status_ = CLASS_STATUS::READY;
                            ui->btn_share_screen->setStyleSheet(kBtnNegative);
                            ui->btn_groupspeak->setStyleSheet(kBtnNegative);
                            ui->btn_interact->setStyleSheet(kBtnNegative);
                            ui->btn_class->setStyleSheet(kBtnStartClass);
                            ui->btn_class->setText("上课");
                            m_globalTimer_->stop();
                            ui->lab_time->setText("未开始上课");
                            ui->lab_record->setVisible(false);
                            ui->lbl_record_icon->setVisible(false);
                            m_duaration_class = 0;
                            m_is_sure_closing = true;
                            dialog->close();
                            close();
                            emit AppUIState::GetInstance().sigReturnMainPage();
                          });
  });
  btn_cancel->setFixedSize(240, 36);
  btn_close->setText("下课");

  btn_cancel->setText("取消");
  btn_close->setStyleSheet(
      "background:#e63f3f;"
      "font-weight:400;"
      "color:#ffffff;"
      "font:14px;"
      "border:1px;"
      "border-radius:18px;");
  btn_cancel->setStyleSheet(
      "background:rgba(255,255,255,0.1);"
      "color:#ffffff;"
      "font-weight:400;"
      "font:14px;"
      "border:1px;"
      "border-radius:18px;");
  vbox->addWidget(btn_close, 0, Qt::AlignHCenter);
  vbox->addItem(new QSpacerItem(1, 24, QSizePolicy::Fixed, QSizePolicy::Fixed));
  vbox->addWidget(btn_cancel, 0, Qt::AlignHCenter);
  vbox->addItem(
      new QSpacerItem(1, 40, QSizePolicy::Expanding, QSizePolicy::Fixed));
  win->setLayout(vbox);
  dialog->setFixedSize(400, 238);
  dialog->setWindowFlags(Qt::Tool | Qt::FramelessWindowHint);
  dialog->setWindowModality(Qt::WindowModal);
  dialog->move(mapToGlobal(QPoint((this->width() - 400) / 2, (this->height() - 238) / 2)));
  dialog->show();
}

void TeacherRoom::RtcInit() {
    std::string roomID = Edu::DataMgr::instance().current_room().room_id;
    std::string token = DATAMGR_INS.current_room().token;
    std::string uid = vrd::DataMgr::instance().user_id();
    EduRTCEngineWrap::setUserRole(Role::kUserRoleTypeBroadcaster);
    EduRTCEngineWrap::setDefaultVideoProfiles();
    EduRTCEngineWrap::joinRoom(token.c_str(), roomID.c_str(),
        uid.c_str());
}

void TeacherRoom::RtcUnInit() {
    EduRTCEngineWrap::leaveRoom();
}

void TeacherRoom::TriggerStartClass() {
  qInfo() << "------> BeginClass" << Qt::endl;
  ui->btn_class->setEnabled(false);
  WSS_SESSION->beginClass(
       vrd::DataMgr::instance().room_id(), vrd::DataMgr::instance().user_id(), [this](int code) {
        RES_CODE_CHECK(code);
        qInfo() << " eduStartClass success" << Qt::endl;
        m_class_status_ = CLASS_STATUS::PROGRESSING;
        ui->btn_share_screen->setStyleSheet(kBtnActive);
        ui->btn_groupspeak->setStyleSheet(kBtnActive);
        ui->btn_groupspeak->setEnabled(true);
        ui->btn_interact->setStyleSheet(kBtnActive);
        ui->btn_interact->setEnabled(true);
        ui->btn_class->setStyleSheet(kBtnStopClass);
        ui->btn_class->setText("");
        ui->btn_class->setEnabled(true);
        ui->lab_record->setVisible(true);
        ui->lbl_record_icon->setVisible(true);
        ui->lab_time->setText("00:00");
        QTimer::singleShot(500, [] {
          Toast::showTip("本产品仅用于功能体验，单次录制时长不超过15分钟",
                         QApplication::activeWindow());
        });
      });
}

void TeacherRoom::SetClassName(const QString& str) {
  ui->lab_room_name->setText(str);
}

void TeacherRoom::SetClassID(const QString& str) {
  ui->lab_room_id->setText(str);
}

void TeacherRoom::ShowGroupSpeaker() {
  qInfo() << "------> ShowGroupSpeaker" << Qt::endl;
  if (m_group_speaker_ == nullptr) {
    m_group_speaker_ = new QWidget(this);
    m_group_speaker_->setStyleSheet("background-color:#272e38;");
    m_group_speaker_->setFixedSize(272, 84);
    auto vBox = new QVBoxLayout;
    auto hbox1 = new QHBoxLayout;
    auto hbox2 = new QHBoxLayout;
    vBox->addLayout(hbox1, 1);
    vBox->addLayout(hbox2, 1);

    auto lbl_speaker_string = new QLabel("正在集体发言");
    lbl_speaker_string->setStyleSheet(
        "color:#ffffff;"
        "font-weight:500;"
        "font-family:\"Microsoft YaHei\";"
        "font:16px;");
    auto lbl_speaker_icon = new QLabel;
    lbl_speaker_icon->setFixedWidth(16);
    lbl_speaker_icon->setStyleSheet(
        "background-image:url(:img/group_speaker_icon);		  "
        "background-position:center;					"
        "	  "
        "background-repeat:no-repeat;					  ");
    auto lbl_speaker_string2 = new QLabel("您所听的内容与学生相同");
    lbl_speaker_string2->setStyleSheet(
        "color:#86909c;"
        "font-weight:400;"
        "font-family:\"Microsoft YaHei\";				  "
        "font:14px;");
    hbox1->addItem(new QSpacerItem(16, QSizePolicy::Fixed, QSizePolicy::Fixed));
    hbox1->addWidget(lbl_speaker_string, Qt::AlignCenter);
    hbox1->addWidget(lbl_speaker_icon);
    hbox1->addItem(
        new QSpacerItem(120, 10, QSizePolicy::Expanding, QSizePolicy::Minimum));

    hbox2->addItem(new QSpacerItem(16, QSizePolicy::Fixed, QSizePolicy::Fixed));
    hbox2->addWidget(lbl_speaker_string2);

    m_group_speaker_->setLayout(vBox);
  }

  m_group_speaker_->move(QPoint(8, 60));
  m_group_speaker_->show();
}

void TeacherRoom::CloseGroupSpeaker() {
  qInfo() << "------> CloseGroupSpeaker" << Qt::endl;
  ZERO_CHECK(m_group_speaker_);
  m_group_speaker_->close();
}

void TeacherRoom::TeacherGetStudentsListInfo() {
  qInfo() << "------> TeacherGetStudentsListInfo" << Qt::endl;
  WSS_SESSION->teacherGetStudentsInfo(
      DATAMGR_INS.current_room().room_id, m_user_id_, 1, 200, [this](int code) {
        RES_CODE_CHECK(code);

        QMap<std::string, QListWidgetItem*>::iterator iter =
            m_stu_info_map_.begin();
        while (iter != m_stu_info_map_.end()) {
          ui->listWidget->removeItemWidget(iter.value());
          delete iter.value();
          iter++;
        }
        m_stu_info_map_.clear();
        auto stuInfo = DATAMGR_INS.stduent_info();
        UpdateOnlineTitle(stuInfo.user_list.size() + 1);
        if (stuInfo.user_list.size() > 0) {
          for (auto stu : stuInfo.user_list) {
            this->AddOnlineStudent(stu.user_id,
                                   QString::fromStdString(stu.user_name));
          }
        }
      });
}

void TeacherRoom::TimerTick() {
  m_ticknum_++;
  if (m_class_status_ == CLASS_STATUS::PROGRESSING) {
    if (m_ticknum_ % 1 == 0) {
      ui->lbl_record_icon->setStyleSheet(
          "background-image:url(:img/"
          "record_icon);background-position:center;background-repeat:"
          "no-repeat;");

#pragma region duration
      m_duaration_class++;
      auto h = m_duaration_class / 3600;
      auto m = m_duaration_class % 3600 / 60;
      auto s = m_duaration_class % 3600 % 60;
      QString duration;
      if (h == 0) {
        duration = QString("%1").arg(m, 2, 10, QLatin1Char('0')) + ":" +
                   QString("%1").arg(s, 2, 10, QLatin1Char('0'));
      } else {
        duration = QString("%1").arg(h, 2, 10, QLatin1Char('0')) + ":" +
                   QString("%1").arg(m, 2, 10, QLatin1Char('0')) + ":" +
                   QString("%1").arg(s, 2, 10, QLatin1Char('0'));
      }
      ui->lab_time->setText(duration);
#pragma endregion
    }
  }

  if (m_class_status_ == CLASS_STATUS::READY && m_ticknum_ == 120) {
    std::call_once(once_notify_, [this]() {
		m_begin_class_alert = new vrd::Alert(QApplication::activeWindow());
		m_begin_class_alert->setText("不上课会导致没有回放，是否开始上课？");
		m_begin_class_alert->show();
		QObject::connect(m_begin_class_alert, &vrd::Alert::accepted, [this]() {
			TriggerStartClass();
		});
    });
  }

  if (m_ticknum_ == 1 || m_ticknum_ % 5 == 0) {
    TeacherGetStudentsListInfo();
  }
}
}  // namespace LE
