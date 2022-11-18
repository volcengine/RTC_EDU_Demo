#include "le_student_room.h"

#include <qmessagebox.h>

#include <QCloseEvent>
#include <QtWidgets>

#include "core/component/videocell.h"
#include "core/edu_rtc_engine_wrap.h"
#include "edu/core/data_mgr.h"
#include "feature/data_mgr.h"
#include "qboxlayout.h"
#include "qlabel.h"
#include "speech/platform_view.h"
#include "toast.h"
#include "ui_le_studentlayout.h"

namespace LE {
StudentRoom::StudentRoom(QWidget* parent)
    : QWidget(parent), m_globalTimer_(new QTimer), ui(new Ui::LEStudentLayout) {
  ui->setupUi(this);
  EduRTCEngineWrap::initDevice();
  InitTimer();
  InitSigSlots();
  setWindowTitle("大班课(学生端)");
  ui->widget->setContentsMargins(0, 0, 0, 0);
  m_teacher_preview_ = new Videocell(false, ui->widget);
  RtcInit();
  InitRoomInfo();

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
      "font:24pt;"
      "color:#86909C;"
      "font-weight:500;");

  ui->horizontalLayout_2->addItem(
      new QSpacerItem(8, 1, QSizePolicy::Fixed, QSizePolicy::Fixed));
  ui->horizontalLayout_2->insertWidget(0, contentWidget, 1);
}

StudentRoom::~StudentRoom() {
  EduRTCEngineWrap::leaveRoom();
  EduRTCEngineWrap::resetDevice();
  delete ui;
}

void StudentRoom::closeEvent(QCloseEvent* event) {
  if (m_is_sure_closing_) {
    QWidget::closeEvent(event);
    return;
  }

  if (m_is_leaving_room) {
    event->ignore();
    return;
  }

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
  lbl_tip->setText("正在上课,确定要退出教室吗?");
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
    WSS_SESSION->stuLeaveClass(this->m_room_id_, this->m_user_id_, nullptr);
    m_is_sure_closing_ = true;
    dialog->close();
    close();
    emit AppUIState::GetInstance().sigReturnMainPage();
  });
  btn_cancel->setFixedSize(240, 36);
  btn_close->setText("确定");

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

void StudentRoom::resizeEvent(QResizeEvent* event) {
  ZERO_CHECK(m_handsupWidget_);
  m_handsupWidget_->move(24, this->height() - m_handsupWidget_->height() - 24);
}

void StudentRoom::showEvent(QShowEvent* event) {}

void StudentRoom::onTeacherCameraOff(const std::string& room_id) {
  qInfo() << "<------ onTeacherCameraOff" << Qt::endl;
  m_teacher_preview_->RemoteSetVideoMute(true);
}

void StudentRoom::onTeacherCameraOn(const std::string& room_id) {
  qInfo() << "<------ onTeacherCameraOn" << Qt::endl;
  m_teacher_preview_->RemoteSetVideoMute(false);
}

void StudentRoom::onTeacherMicOn(const std::string& room_id) {
  qInfo() << "<------ onTeacherMicOn" << Qt::endl;
  m_teacher_preview_->RemoteSetAudioMute(false);
}

void StudentRoom::onTeacherMicOff(const std::string& room_id) {
  qInfo() << "<------ onTeacherMicOff" << Qt::endl;
  m_teacher_preview_->RemoteSetAudioMute(true);
}

void StudentRoom::onTeacherJoinRoom(const std::string& room_id) {
  // do nothing
}

void StudentRoom::onTeacherLeaveRoom(const std::string& room_id) {
  // do nothing
}

void StudentRoom::onBeginClass(const std::string& room_id) {
  qInfo() << "<------ onBeginClass" << Qt::endl;
  m_class_processing_ = true;
}

void StudentRoom::onEndClass(const std::string& room_id) {
	qInfo() << "<------ onEndClass" << Qt::endl;
	m_class_processing_ = false;
	m_is_sure_closing_ = true;
	close();
	emit AppUIState::GetInstance().sigReturnMainPage();
	QTimer::singleShot(
		1000, [] { Toast::showTip("课程已结束", QApplication::activeWindow()); });
}

void StudentRoom::onOpenGroupSpeech(const std::string& room_id) {
  qInfo() << "<------ onOpenGroupSpeech" << Qt::endl;
  ShowGroupSpeaker();
}

void StudentRoom::onCloseGroupSpeech(const std::string& room_id) {
  qInfo() << "<------ onCloseGroupSpeech" << Qt::endl;
  CloseGroupSpeaker();
}

void StudentRoom::onOpenVideoInteract() {
  qInfo() << "<------ onOpenVideoInteract" << Qt::endl;
  m_handsupWidget_ = new vrd::PlatformView(this);
  m_handsupWidget_->setFixedHeight(208);
  connect(m_handsupWidget_, &vrd::PlatformView::sigExpandStateChanged, this,
          [this](bool expanded) {
            if (expanded) {
              m_is_handsupwidget_collapse_ = false;
              m_handsupWidget_->setFixedHeight(208);
              m_handsupWidget_->move(24, this->height() - 208 - 24);
            } else {
              m_is_handsupwidget_collapse_ = true;
              m_handsupWidget_->setFixedHeight(20);
              m_handsupWidget_->move((1160 - m_handsupWidget_->width()) / 2,
                                     this->height() - 20 - 24);
            }
          });
  m_handsupWidget_->setAttribute(Qt::WA_DeleteOnClose);
  m_handsupWidget_->move(24, this->height() - 208 - 24);
  m_handsupWidget_->show();
}

void StudentRoom::onCloseVideoInteract() {
  qInfo() << "<------ onCloseVideoInteract" << Qt::endl;
  ZERO_CHECK(m_handsupWidget_);
  m_handsupWidget_->close();
  m_handsupWidget_ = nullptr;
}

void StudentRoom::InitSigSlots() {
	connect(ui->pushButton, &QPushButton::clicked, this, &StudentRoom::DropCall);

	connect(&EduRTCEngineWrap::instance(), &EduRTCEngineWrap::sigOnRoomStateChanged, this,
		[this](std::string room_id, std::string uid, int state, std::string extra_info) {
			if (room_id == m_room_id_ && uid == m_user_id_) {
				auto infoArray = QByteArray(extra_info.data(), static_cast<int>(extra_info.size()));
				auto infoJsonObj = QJsonDocument::fromJson(infoArray).object();
				auto joinType = infoJsonObj["join_type"].toInt();
				if (state == 0 && joinType == 1) {
					WSS_SESSION->eduReconnect(uid, [this](int code) {
						if (code == 422 || code == 419 || code == 404) {
							m_is_sure_closing_ = true;
							close();
							emit AppUIState::GetInstance().sigReturnMainPage();
						}
					});
				}
			}
		});
}

void StudentRoom::InitTimer() {
	m_globalTimer_->setInterval(100);
	connect(m_globalTimer_, &QTimer::timeout, this, &StudentRoom::TimerTick);
}

void StudentRoom::DropCall() {
	m_is_leaving_room = true;
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
	lbl_tip->setText("正在上课,确定要退出教室吗?");
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
	connect(btn_cancel, &QPushButton::clicked, [dialog, this] {
		m_is_leaving_room = false;
		dialog->close();
		});
	connect(btn_close, &QPushButton::clicked, [this, dialog] {
		WSS_SESSION->stuLeaveClass(this->m_room_id_, this->m_user_id_, NULL);
		m_is_sure_closing_ = true;
		dialog->close();
		close();
		emit AppUIState::GetInstance().sigReturnMainPage();
		});
	btn_cancel->setFixedSize(240, 36);
	btn_close->setText("确定");

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

void StudentRoom::RtcInit() {
	std::string roomID = Edu::DataMgr::instance().current_room().room_id;
	std::string token = DATAMGR_INS.student_join_class_room().token;
	std::string uid = vrd::DataMgr::instance().user_id();
	EduRTCEngineWrap::setDefaultVideoProfiles();
	EduRTCEngineWrap::setUserRole(Role::kUserRoleTypeSilentAudience);
	EduRTCEngineWrap::joinRoom(token.c_str(), roomID.c_str(), uid.c_str());
}

void StudentRoom::InitRoomInfo() {
	m_room_name_ = DATAMGR_INS.current_room().room_name;
	m_room_id_ = DATAMGR_INS.current_room().room_id;
	m_user_id_ = vrd::DataMgr::instance().user_id();
	m_teacher_user_name_ = DATAMGR_INS.current_room().teacher_name;

	ui->lbl_class_name->setText(QString::fromStdString(m_room_name_));
	ui->lbl_class_id->setText("课堂ID: " + QString::fromStdString(m_room_id_));
	m_teacher_preview_->SetDisplayName(
		QString::fromStdString(m_teacher_user_name_));

	Edu::User ti = DATAMGR_INS.student_join_class_room().teacher_info;
	bool video_mute = !ti.is_camera_on;
	bool audio_mute = !ti.is_mic_on;

	if (video_mute) {
		m_teacher_preview_->RemoteSetVideoMute(true);
	}
	else {
		m_teacher_preview_->RemoteSetVideoMute(false);
	}

	if (audio_mute) {
		m_teacher_preview_->RemoteSetAudioMute(true);
	}
	else {
		m_teacher_preview_->RemoteSetAudioMute(false);
	}

	void* view = m_teacher_preview_->GetView();
	EduRTCEngineWrap::setupRemoteView(
		view, bytertc::RenderMode::kRenderModeHidden, ti.user_id);

	m_globalTimer_->start();

	auto bEnable_interact = DATAMGR_INS.current_room().enable_interactive;
	auto bEnable_group_speech = DATAMGR_INS.current_room().enable_group_speech;

	if (bEnable_group_speech) {
		QTimer::singleShot(500, this, [this]() { onOpenGroupSpeech(""); });
	}
	if (bEnable_interact) {
		QTimer::singleShot(500, this, [this]() { onOpenVideoInteract(); });
	}

	int status = DATAMGR_INS.current_room().status;

	qInfo() << "initRoomInfo - status:" << status << Qt::endl;

	if (status == 2) {
		close();
		emit AppUIState::GetInstance().sigReturnMainPage();
	}
	else if (status == 1) {
		m_class_processing_ = true;
		ui->lbl_time->setVisible(true);
		ui->lbl_rec_icon->setVisible(true);

		QString timestamp =
			QString::number(QDateTime::currentMSecsSinceEpoch() * 1000000);

		uint64_t sec = timestamp.toULongLong();
		uint64_t real = DATAMGR_INS.current_room().begin_class_time_real;
		int diff = (sec - real) / 1000000000;
		m_duaration_class = diff;
	}
}

void StudentRoom::TimerTick() {
  m_ticknum_++;
  if (m_class_processing_) {
    if (m_ticknum_ % 10 == 0) {
      ui->lbl_rec_icon->setStyleSheet(
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
      ui->lbl_time->setText(duration);
#pragma endregion
    }
  }
}

void StudentRoom::SetClassName(const QString& str) {
  ui->lbl_class_name->setText(str);
}

void StudentRoom::SetClassID(const QString& str) {
  ui->lbl_class_id->setText(str);
}

void StudentRoom::ShowGroupSpeaker() {
  if (m_group_speaker_ == nullptr) {
    m_group_speaker_ = new QWidget(this);
    m_group_speaker_->setStyleSheet("background-color:#272e38;");
    m_group_speaker_->setFixedSize(272, 84);
    auto vBox = new QVBoxLayout;
    auto hbox1 = new QHBoxLayout;
    auto hbox2 = new QHBoxLayout;
    vBox->addLayout(hbox1, 1);
    vBox->addLayout(hbox2, 1);

    auto lbl_speaker_string = new QLabel("老师开启了集体发言");
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
    auto lbl_speaker_string2 = new QLabel("请大声说出答案");
    lbl_speaker_string2->setStyleSheet(
        "color:#86909c;"
        "font-weight:400;"
        "font-family:\"Microsoft YaHei\";"
        "font-size:14px;");
    hbox1->addItem(new QSpacerItem(16, QSizePolicy::Fixed, QSizePolicy::Fixed));
    hbox1->addWidget(lbl_speaker_string, Qt::AlignCenter);
    hbox1->addWidget(lbl_speaker_icon);
    hbox1->addItem(
        new QSpacerItem(100, 10, QSizePolicy::Expanding, QSizePolicy::Minimum));

    hbox2->addItem(new QSpacerItem(16, QSizePolicy::Fixed, QSizePolicy::Fixed));
    hbox2->addWidget(lbl_speaker_string2);

    m_group_speaker_->setLayout(vBox);
  }

  m_group_speaker_->move(QPoint(8, 60));
  m_group_speaker_->show();
  UpStage();
}

void StudentRoom::CloseGroupSpeaker() {
  ZERO_CHECK(m_group_speaker_);
  m_group_speaker_->hide();
  DownStage();
}

void StudentRoom::UpStage() {
  EduRTCEngineWrap::setUserRole(Role::kUserRoleTypeBroadcaster);
  EduRTCEngineWrap::muteLocalAudio(false);
  EduRTCEngineWrap::muteLocalVideo(false);
}

void StudentRoom::DownStage() {
  EduRTCEngineWrap::muteLocalAudio(true);
  EduRTCEngineWrap::muteLocalVideo(true);
  EduRTCEngineWrap::setUserRole(Role::kUserRoleTypeSilentAudience);
}

}  // namespace LE
