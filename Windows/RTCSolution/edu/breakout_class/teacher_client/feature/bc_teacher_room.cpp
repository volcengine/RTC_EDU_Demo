#include "bc_teacher_room.h"

#include <core/util_tip.h>

#include <QCloseEvent>
#include <QDatetime>
#include <QTimer>
#include <QJsonObject>
#include <QJsonDocument>
#include <QJsonArray>
#include <QtDebug>

#include "core/application.h"
#include "core/navigator_interface.h"
#include "OnLineItem.h"
#include "core/edu_rtc_engine_wrap.h"
#include "edu/core/data_mgr.h"
#include "feature/data_mgr.h"

#include "toast.h"
#include "ui_bc_teacherlayout.h"
#include "videocell.h"
#include <QtDebug>
#include <core/util_tip.h>
#include <algorithm>

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

namespace BC {
TeacherRoom::TeacherRoom(QWidget* parent)
    : QWidget(parent),
      ui(new Ui::BCTeacherLayout),
      m_globalTimer_(new QTimer(parent)),
      m_class_status_(CLASS_STATUS::READY) {
    ui->setupUi(this);

    EduRTCEngineWrap::initDevice();

    InitUIElements();
    InitTeacherVideoCell();
    InitRoomInfos();
    InitTimer();
    InitSigSlots();
    RtcInit();
}

TeacherRoom::~TeacherRoom() {
  if (EduRTCEngineWrap::hasMainRoom()) {
    EduRTCEngineWrap::leaveMainRoom();
  }
  if (EduRTCEngineWrap::hasGroupRoom()) {
    EduRTCEngineWrap::destoryGroupRoom();
  }
  EduRTCEngineWrap::resetDevice();
  delete ui;
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
  dialog->setFixedSize(this->width(), this->height());
  dialog->setWindowFlags(Qt::FramelessWindowHint);
  dialog->setStyleSheet("background:rgba(0,0,0,0.5);");
  dialog->show();
  event->ignore();
}

void TeacherRoom::showEvent(QShowEvent* event) {}

void TeacherRoom::onLoginElsewhere() {
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
        if (m_begin_class_alert && m_begin_class_alert->isVisible()){
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

void TeacherRoom::AddTeacherItem(const QString& name) {
	auto widget = new QWidget;
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
	lbl_teacher_const_text->setText("老师");
	lbl_teacher_const_text->setAlignment(Qt::AlignCenter);
	lbl_teacher_const_text->setFixedSize(44, 24);
	lbl_teacher_const_text->setContentsMargins(0, 0, 0, 0);
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
	ui->treeWidget->addWidget(widget, 272, 40);
}

void TeacherRoom::AddOnlineTitle() {
	if (m_lbl_students_list_) {
		delete m_lbl_students_list_;
	}
	m_lbl_students_list_ = new QLabel;
	m_lbl_students_list_->setContentsMargins(18, 0, 0, 0);
	m_lbl_students_list_->setStyleSheet(
		"font-size: 16px;"
		"color: #fff;"
		"font-family:\"Microsoft YaHei\";"
		"font-weight:500;");
	m_lbl_students_list_->setText("人员列表");

	ui->treeWidget->addWidget(m_lbl_students_list_, 272, 56);
}

void TeacherRoom::AddStudentLine() {
  auto widget = new QWidget;
  auto hbox = new QHBoxLayout;
  auto left_line = new QLabel;
  auto right_line = new QLabel;
  auto student_text = new QLabel;

  student_text->setText("学生");
  student_text->setFixedSize(44, 24);
  student_text->setContentsMargins(0, 0, 0, 0);
  student_text->setAlignment(Qt::AlignCenter);
  student_text->setStyleSheet(
      "width:44px; height:24px;"
      "border-radius:12px;background:#1d2129;"
      "color:#86909c;"
      "font-family:\"Microsoft YaHei\";"
      "font-weight:500;");

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

  ui->treeWidget->addWidget(widget, 272, 56);
}

void TeacherRoom::UpdateGroupStudentInfo() {
	WSS_SESSION->teacherGetStudentsInfo(
		DATAMGR_INS.current_room().room_id,
		m_user_id_,
		1,
		200,
		[this](int code)
	{
		RES_CODE_CHECK(code);

		while (ui->treeWidget->topLevelItemCount())
		{
			QTreeWidgetItem* item = ui->treeWidget->takeTopLevelItem(0);
			delete item;
		}
		ui->treeWidget->clear();

		AddOnlineTitle();
		AddTeacherItem(QString::fromStdString(m_user_name_));
		AddStudentLine();
		auto stuInfo = DATAMGR_INS.stduent_info();
		int total = 1;

		int groupLen = qMin((int)stuInfo.group_user_list.size(), 35);
		for (int i = 0; i < groupLen; i++)
		{
			auto && strNum = std::to_string(i);
			QList<std::pair<QString, QString>> groupList;
			if (stuInfo.group_user_list.find(strNum) != stuInfo.group_user_list.end())
			{
				auto&  users = stuInfo.group_user_list[strNum];

				for (auto user : users)
				{
					groupList.push_back(std::make_pair(QString::fromStdString(user.user_id), QString::fromStdString(user.user_name)));
				}
			}
			ui->treeWidget->addGroupNode(i, groupList);
		}

		UpdateOnlineTitle(stuInfo.student_count + 1);
	});
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

  QObject::connect(ui->btn_inspect, &QPushButton::clicked, this, [this] {
    if (m_is_inspecting) {
      m_is_inspecting = false;
      ui->btn_inspect->setEnabled(true);
      ui->btn_inspect->setText("开启监督");
      ui->btn_inspect->setStyleSheet(kBtnActive);
      ui->btn_groupspeak->setEnabled(true);
      ui->btn_groupspeak->setStyleSheet(kBtnActive);
      ui->btn_interact->setStyleSheet(kBtnActive);
      ui->btn_interact->setEnabled(true);
      ZERO_CHECK(pWatchView_);
      pWatchView_->close();
    } else {
      m_is_inspecting = true;
      ui->btn_inspect->setEnabled(true);
      ui->btn_inspect->setStyleSheet(kBtnStartClass);
      ui->btn_inspect->setText("结束监督");
      ui->btn_groupspeak->setStyleSheet(kBtnNegative);
      ui->btn_groupspeak->setEnabled(false);
      ui->btn_interact->setStyleSheet(kBtnNegative);
      ui->btn_interact->setEnabled(false);
      pWatchView_ = new vrd::WatchView();
      pWatchView_->setFixedWidth(208);
      pWatchView_->setAttribute(Qt::WA_DeleteOnClose);
      ui->hbox_content->insertWidget(0, pWatchView_);
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
              ui->btn_inspect->setEnabled(true);
              ui->btn_inspect->setStyleSheet(kBtnActive);

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
              ui->btn_inspect->setEnabled(false);
              ui->btn_inspect->setStyleSheet(kBtnNegative);

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
            ui->btn_inspect->setEnabled(false);
            ui->btn_inspect->setStyleSheet(kBtnNegative);

            pRoomView_ = new vrd::RoomView();
            pRoomView_->setFixedWidth(272);
            pRoomView_->setAttribute(Qt::WA_DeleteOnClose);
            ui->hbox_content->insertWidget(0, pRoomView_);
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
            ui->btn_inspect->setEnabled(true);
            ui->btn_inspect->setStyleSheet(kBtnActive);

            ZERO_CHECK(pRoomView_);
            pRoomView_->close();
            pRoomView_ = nullptr;
          });
    }
  });

  QObject::connect(ui->btn_finish_class, &QPushButton::clicked, this, [this] {
    if (m_class_status_ == CLASS_STATUS::READY) {
      TriggerStartClass();
    } else if (m_class_status_ == CLASS_STATUS::PROGRESSING) {
      DropCall();
    }
  });

  connect(&EduRTCEngineWrap::instance(), &EduRTCEngineWrap::sigForceExitRoom, this,
      [this]() {
          m_is_sure_closing = true;
          close();
          emit AppUIState::GetInstance().sigReturnMainPage();
      });

  QObject::connect(&EduRTCEngineWrap::instance(), &EduRTCEngineWrap::sigOnRoomStateChanged, this, 
      [this](std::string room_id, std::string uid, int state, std::string extra_info){
            if(room_id == vrd::DataMgr::instance().room_id() 
                && uid == vrd::DataMgr::instance().user_id()){
				auto infoArray = QByteArray(extra_info.data(), static_cast<int>(extra_info.size()));
				auto infoJsonObj = QJsonDocument::fromJson(infoArray).object();
                auto joinType = infoJsonObj["join_type"].toInt();
                if (state == 0 && joinType == 1) {
                    WSS_SESSION->eduReconnect(uid, [this](int code){
                        if (code == 422 || code == 419){
							m_is_sure_closing = true;
							close();
							emit AppUIState::GetInstance().sigReturnMainPage();
                        }
                    });
                } else if (state == 0 && joinType == 0 && m_local_preview_) {
                    m_local_preview_->SigMuteAudio(m_local_preview_->isAudioMute());
                    m_local_preview_->SigMuteVideo(m_local_preview_->isVideoMute());
                }
            }
      });
}

void TeacherRoom::TriggerStartClass() {
  qInfo() << "------> BeginClass" << Qt::endl;
  ui->btn_finish_class->setEnabled(false);
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
        ui->btn_finish_class->setStyleSheet(kBtnStopClass);
        ui->btn_finish_class->setText("");
        ui->btn_finish_class->setEnabled(true);
        ui->btn_inspect->setStyleSheet(kBtnActive);
        ui->btn_inspect->setEnabled(true);
        ui->lab_record->setVisible(true);
        ui->lbl_record_icon->setVisible(true);
        ui->lab_time->setText("00:00");
        QTimer::singleShot(500, [] {
          Toast::showTip("本产品仅用于功能体验，单次录制时长不超过15分钟",
                         QApplication::activeWindow());
        });
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
      "font-weight:500;"
      "font-family:\"Microsoft YaHei\";");
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
  connect(btn_close, &QPushButton::clicked, [this, dialog] {
    WSS_SESSION->endClass(this->m_room_id_, this->m_user_id_,
                          [this, dialog](int code) {
                            RES_CODE_CHECK(code);
                            m_class_status_ = CLASS_STATUS::READY;
                            ui->btn_share_screen->setStyleSheet(kBtnNegative);
                            ui->btn_groupspeak->setStyleSheet(kBtnNegative);
                            ui->btn_interact->setStyleSheet(kBtnNegative);
                            ui->btn_finish_class->setStyleSheet(kBtnStartClass);
                            ui->btn_finish_class->setText("上课");
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
      "border-radius:18px;"
      "font-family:\"Microsoft YaHei\";");
  btn_cancel->setStyleSheet(
      "background:rgba(255,255,255,0.1);"
      "color:#ffffff;"
      "font-weight:400;"
      "font:14px;"
      "border:1px;"
      "border-radius:18px;"
      "font-family:\"Microsoft YaHei\";");
  vbox->addWidget(btn_close, 0, Qt::AlignHCenter);
  vbox->addItem(new QSpacerItem(1, 24, QSizePolicy::Fixed, QSizePolicy::Fixed));
  vbox->addWidget(btn_cancel, 0, Qt::AlignHCenter);
  vbox->addItem(
      new QSpacerItem(1, 40, QSizePolicy::Expanding, QSizePolicy::Fixed));
  win->setLayout(vbox);
  dialog->setFixedSize(this->width(), this->height());
  dialog->setWindowFlags(Qt::FramelessWindowHint);
  dialog->setStyleSheet("background:rgba(0,0,0,0.5);");
  dialog->show();
}

void TeacherRoom::RtcInit() {
    auto roomId = vrd::DataMgr::instance().room_id();
    EduRTCEngineWrap::createMainRoom(roomId);
    EduRTCEngineWrap::setMainUserRole(Role::kUserRoleTypeBroadcaster);
    const auto token = DATAMGR_INS.current_room().token;
    const auto uid = vrd::DataMgr::instance().user_id();
    EduRTCEngineWrap::setDefaultVideoProfiles();
    EduRTCEngineWrap::joinMainRoom(token, roomId, uid);
    EduRTCEngineWrap::publishMainRoom();
}

void TeacherRoom::InitRoomInfos() {
	m_room_name_ = DATAMGR_INS.current_room().room_name;
	m_room_id_ = DATAMGR_INS.current_room().room_id;
	m_user_id_ = DATAMGR_INS.current_room().create_user_id;
	m_user_name_ = DATAMGR_INS.current_room().teacher_name;

	bool bMic_on = DATAMGR_INS.teacher_info().is_mic_on;
	bool bCamera_on = DATAMGR_INS.teacher_info().is_camera_on;

	if (bMic_on) {
		EduRTCEngineWrap::enableLocalAudio(true);
		EduRTCEngineWrap::muteLocalAudio(false);
	}
	else {
		EduRTCEngineWrap::enableLocalAudio(false);
		EduRTCEngineWrap::muteLocalAudio(true);
	}
	m_local_preview_->RemoteSetAudioMute(!bMic_on);

	if (bCamera_on) {
		EduRTCEngineWrap::enableLocalVideo(true);
		EduRTCEngineWrap::muteLocalVideo(false);
	}
	else {
		EduRTCEngineWrap::enableLocalVideo(false);
		EduRTCEngineWrap::muteLocalVideo(true);
	}
	m_local_preview_->RemoteSetVideoMute(!bCamera_on);

	ui->lab_room_name->setText(QString::fromStdString(m_room_name_));
	ui->lab_room_id->setText("课堂ID: " + QString::fromStdString(m_room_id_));
	m_local_preview_->SetDisplayName(QString::fromStdString(m_user_name_));

	int status = DATAMGR_INS.current_room().status;
	if (status == 2) {
		close();
		emit AppUIState::GetInstance().sigReturnMainPage();
	}
	else if (status == 1) {
		m_class_status_ = CLASS_STATUS::PROGRESSING;
		ui->btn_share_screen->setStyleSheet(kBtnActive);
		ui->btn_groupspeak->setStyleSheet(kBtnActive);
		ui->btn_groupspeak->setEnabled(true);
		ui->btn_interact->setStyleSheet(kBtnActive);
		ui->btn_interact->setEnabled(true);
		ui->btn_inspect->setStyleSheet(kBtnActive);
		ui->btn_inspect->setEnabled(true);
		ui->btn_finish_class->setStyleSheet(kBtnStopClass);
		ui->btn_finish_class->setText("");
		ui->lab_record->setVisible(true);
		ui->lbl_record_icon->setVisible(true);

		QString timestamp =
			QString::number(QDateTime::currentMSecsSinceEpoch() * 1000000);

		uint64_t sec = timestamp.toULongLong();
		uint64_t real = DATAMGR_INS.current_room().begin_class_time_real;
		int diff = (sec - real) / 1000000000;
		m_duaration_class = diff;
	}

    bool bEnable_group_speech = DATAMGR_INS.current_room().enable_group_speech;
    if (bEnable_group_speech) {
        m_is_goupspeak_ = true;
        ui->btn_groupspeak->setStyleSheet(kBtnNegative);
        ui->btn_groupspeak->setText("结束集体发言");
        ui->btn_groupspeak->setFixedWidth(108);
        ui->btn_groupspeak->setStyleSheet(kBtnStartClass);
        ui->btn_interact->setEnabled(false);
        ui->btn_interact->setStyleSheet(kBtnNegative);
        ui->btn_inspect->setEnabled(false);
        ui->btn_inspect->setStyleSheet(kBtnNegative);

        ShowGroupSpeaker();
    }

    bool bEnable_interact = DATAMGR_INS.current_room().enable_interactive;
    if (bEnable_interact) {
        m_is_interacting = true;
        ui->btn_interact->setText("结束视频互动");
        ui->btn_interact->setFixedWidth(108);
        ui->btn_interact->setStyleSheet(kBtnStartClass);
        ui->btn_groupspeak->setEnabled(false);
        ui->btn_groupspeak->setStyleSheet(kBtnNegative);
        ui->btn_inspect->setEnabled(false);
        ui->btn_inspect->setStyleSheet(kBtnNegative);

        pRoomView_ = new vrd::RoomView();
        pRoomView_->setFixedWidth(272);
        pRoomView_->setAttribute(Qt::WA_DeleteOnClose);
        ui->hbox_content->insertWidget(0, pRoomView_);
    }
}

void TeacherRoom::InitUIElements() {
  setWindowTitle("大班小组课(教师端)");
  ui->btn_share_screen->setVisible(false);
  ui->btn_groupspeak->setStyleSheet(kBtnNegative);
  ui->btn_groupspeak->setEnabled(false);
  ui->btn_interact->setText("视频互动");
  ui->btn_interact->setStyleSheet(kBtnNegative);
  ui->btn_interact->setEnabled(false);
  ui->btn_inspect->setText("开启监督");
  ui->btn_inspect->setStyleSheet(kBtnNegative);
  ui->btn_inspect->setEnabled(false);
  ui->btn_finish_class->setText("开始上课");
  ui->btn_finish_class->setStyleSheet(kBtnStartClass);
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
  AddTeacherItem(QString::fromStdString(m_user_name_));
  AddStudentLine();
}

void TeacherRoom::InitTeacherVideoCell() {
    m_local_preview_ = new Videocell(true, ui->widget);
    EduRTCEngineWrap::setupLocalView(m_local_preview_->GetView(), bytertc::RenderMode::kRenderModeHidden, "local");
    m_local_preview_->RemoteSetAudioMute(false);
    m_local_preview_->RemoteSetVideoMute(true);
}

void TeacherRoom::UpdateOnlineTitle(int num) {
  QString des = "人员列表 (" + QString::number(num) + ")";
  m_lbl_students_list_->setText(des);
}

void TeacherRoom::TimerTick() {
    m_ticknum++;

    if (m_class_status_ == CLASS_STATUS::PROGRESSING) {
        if (m_ticknum % 1 == 0) {
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
	        }
	        else {
		        duration = QString("%1").arg(h, 2, 10, QLatin1Char('0')) + ":" +
			        QString("%1").arg(m, 2, 10, QLatin1Char('0')) + ":" +
			        QString("%1").arg(s, 2, 10, QLatin1Char('0'));
	        }
	        ui->lab_time->setText(duration);
#pragma endregion
        }
    }

	if (m_class_status_ == CLASS_STATUS::READY && m_ticknum == 120) {
		m_begin_class_alert = new vrd::Alert(QApplication::activeWindow());
		m_begin_class_alert->setText("不上课会导致没有回放，是否开始上课？");
		m_begin_class_alert->show();
		QObject::connect(m_begin_class_alert, &vrd::Alert::accepted, [this]() {
			TriggerStartClass();
		});
	}

    if (m_ticknum == 1 || m_ticknum % 5 == 0) {
		UpdateGroupStudentInfo();
	}
}

void TeacherRoom::SetClassName(const QString& str) const {
  ui->lab_room_name->setText(str);
}

void TeacherRoom::SetClassID(const QString& str) const {
  ui->lab_room_id->setText(str);
}

void TeacherRoom::ShowGroupSpeaker() {
  if (m_group_speaker == nullptr) {
    m_group_speaker = new QWidget(this);
    m_group_speaker->setStyleSheet("background-color:#272e38;");
    m_group_speaker->setFixedSize(272, 84);
    auto vBox = new QVBoxLayout;
    auto hbox1 = new QHBoxLayout;
    auto hbox2 = new QHBoxLayout;
    vBox->addLayout(hbox1, 1);
    vBox->addLayout(hbox2, 1);

    auto lbl_speaker_string = new QLabel("正在集体发言");
    lbl_speaker_string->setStyleSheet(
        "color:#ffffff;"
        "font-weight:500;"
        "font:16px;"
        "font-family:\"Microsoft YaHei\";");
    auto lbl_speaker_icon = new QLabel;
    lbl_speaker_icon->setFixedWidth(50);
    lbl_speaker_icon->setStyleSheet(
        "background-image:url(:img/group_speaker_icon);		  "
        "background-position:center;					"
        "	  "
        "background-repeat:no-repeat;					  ");
    auto lbl_speaker_string2 = new QLabel("您所听的内容与学生相同");
    lbl_speaker_string2->setStyleSheet(
        "color:#86909c;"
        "font-weight:400;"
        "font:14px;"
        "font-family:\"Microsoft YaHei\";");
    hbox1->addItem(new QSpacerItem(16, QSizePolicy::Fixed, QSizePolicy::Fixed));
    hbox1->addWidget(lbl_speaker_string, Qt::AlignCenter);
    hbox1->addWidget(lbl_speaker_icon);
    hbox1->addItem(
        new QSpacerItem(120, 10, QSizePolicy::Expanding, QSizePolicy::Minimum));

    hbox2->addItem(new QSpacerItem(16, QSizePolicy::Fixed, QSizePolicy::Fixed));
    hbox2->addWidget(lbl_speaker_string2);

    m_group_speaker->setLayout(vBox);
  }

  m_group_speaker->move(QPoint(8, 60));
  m_group_speaker->show();
}

void TeacherRoom::CloseGroupSpeaker() const {
  ZERO_CHECK(m_group_speaker);
  m_group_speaker->close();
}

}  // namespace BC
