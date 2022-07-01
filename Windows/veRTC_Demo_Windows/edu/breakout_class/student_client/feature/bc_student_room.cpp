#include "bc_student_room.h"

#include <QCloseEvent>
#include <QPushButton>
#include <QTimer>
#include <QVBoxLayout>
#include <QJsonObject>
#include <QJsonDocument>
#include <QJsonArray>

#include "../common/breakout_student_data_mgr.h"
#include "QDatetime"
#include "core/util.h"
#include "core/application.h"
#include "core/edu_rtc_engine_wrap.h"
#include "edu/core/data_mgr.h"
#include "feature/data_mgr.h"
#include "toast.h"
#include "ui_bc_studentlayout.h"
#include "videocell.h"

namespace BC {
StudentRoom::StudentRoom(QWidget* parent)
    : QWidget(parent), m_globalTimer_(new QTimer), ui(new Ui::BCStudentLayout) {
  ui->setupUi(this);
  EduRTCEngineWrap::initDevice();
  setWindowTitle("大班小组课(学生端)");
  InitTimer();
  InitSigSlots();
  RtcInit();
  InitRoomInfos();
}

StudentRoom::~StudentRoom() {
  EduRTCEngineWrap::leaveGroupRoom();
  EduRTCEngineWrap::leaveMainRoom();
  EduRTCEngineWrap::resetDevice();
  delete ui;
}

    void StudentRoom::closeEvent(QCloseEvent* event)
    {
        if (m_is_sure_closing_)
        {
            QWidget::closeEvent(event);
            return;
        }

        if (m_is_leaving_room_) {
            event->ignore();
            return;
        }

        QWidget* dialog = new QWidget(this);
        QWidget* win = new QWidget;
        win->setStyleSheet(
            "background:#272e38;"
            "border-radius:8px;"
            "font-family:\"Microsoft YaHei\";"
        );
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
            "width:20px ; height:20px;"
        );
        auto lbl_tip = new QLabel;
        lbl_tip->setStyleSheet(
            "color:#ffffff;"
            "font:14px;"
            "font-weight:500;"
        );
        lbl_tip->setAlignment(Qt::AlignCenter);
        lbl_tip->setText("正在上课,确定要退出教室吗?");
        h1box->addItem(new QSpacerItem(90, 22, QSizePolicy::Fixed, QSizePolicy::Maximum));
        h1box->addWidget(lbl_warnning);
        h1box->addWidget(lbl_tip);
        h1box->addItem(new QSpacerItem(10, 10, QSizePolicy::Expanding, QSizePolicy::Expanding));
        vbox->addItem(new QSpacerItem(1, 40, QSizePolicy::Fixed, QSizePolicy::Fixed));
        vbox->addLayout(h1box);
        vbox->addItem(new QSpacerItem(1, 47, QSizePolicy::Fixed, QSizePolicy::Fixed));
        vbox->setAlignment(Qt::AlignHCenter);

        auto btn_close = new QPushButton;
        btn_close->setFixedHeight(36);
        btn_close->setFixedSize(240, 36);
        auto btn_cancel = new QPushButton;
        btn_cancel->setFixedHeight(36);
        connect(btn_cancel, &QPushButton::clicked, [dialog]
            {
                dialog->close();
            });
        connect(btn_close, &QPushButton::clicked, [this, dialog]
            {
                Edu::StudentJoinClassRoom si = DATAMGR_INS.student_join_class_room();
				WSS_SESSION->stuLeaveClass(this->m_room_id_, si.user_info.user_id, nullptr);
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
            "border-radius:18px;"
        );
        btn_cancel->setStyleSheet(
            "background:rgba(255,255,255,0.1);"
            "color:#ffffff;"
            "font-weight:400;"
            "font:14px;"
            "border:1px;"
            "border-radius:18px;"
        );
        vbox->addWidget(btn_close, 0, Qt::AlignHCenter);
        vbox->addItem(new QSpacerItem(1, 24, QSizePolicy::Fixed, QSizePolicy::Fixed));
        vbox->addWidget(btn_cancel, 0, Qt::AlignHCenter);
        vbox->addItem(new QSpacerItem(1, 40, QSizePolicy::Expanding, QSizePolicy::Fixed));
        win->setLayout(vbox);
        dialog->setFixedSize(400, 238);
        dialog->setWindowFlags(Qt::FramelessWindowHint);
        dialog->move((this->width() - 400) / 2, (this->height() - 238) / 2);
        dialog->show();
        event->ignore();
    }

void StudentRoom::showEvent(QShowEvent* event) {}

    void StudentRoom::resizeEvent(QResizeEvent* event)
    {
        ZERO_CHECK(m_handsupWidget_);
		int wid = this->width() - 240 - 296;
		m_handsupWidget_->setWidthLimit(wid);
		if (!m_is_handsupwidget_collapse_)
		{
			m_handsupWidget_->setFixedHeight(208);
			m_handsupWidget_->move(240, this->height() - 208 - 24);
		}
		else
		{
			m_handsupWidget_->setFixedHeight(20);
			m_handsupWidget_->move((this->width() - 240 - 296 - m_handsupWidget_->width()) / 2 + 240, this->height() - 20 - 24);
		}
    }

void StudentRoom::onTeacherCameraOff(const std::string& room_id) {
  m_teacher_preview_->RemoteSetVideoMute(true);
}

void StudentRoom::onTeacherCameraOn(const std::string& room_id) {
  m_teacher_preview_->RemoteSetVideoMute(false);
}

void StudentRoom::onTeacherMicOn(const std::string& room_id) {
  m_teacher_preview_->RemoteSetAudioMute(false);
}

void StudentRoom::onTeacherMicOff(const std::string& room_id) {
  m_teacher_preview_->RemoteSetAudioMute(true);
}

void StudentRoom::onTeacherJoinRoom(const std::string& room_id) {
  // do nothing
}

void StudentRoom::onTeacherLeaveRoom(const std::string& room_id) {
  // do nothing
}

void StudentRoom::onBeginClass(const std::string& room_id) {
  Edu::ClassRoom room = DATAMGR_INS.current_room();
  m_class_processing_ = true;
}

void StudentRoom::onEndClass(const std::string& room_id) {
	m_class_processing_ = false;
	EduRTCEngineWrap::setupLocalView(
		nullptr, bytertc::RenderMode::kRenderModeHidden, "local");
	this->m_is_sure_closing_ = true;
	this->close();
	emit AppUIState::GetInstance().sigReturnMainPage();
	QTimer::singleShot(500, [] {
		Toast::showTip("老师已经下课", QApplication::activeWindow());
	});
}

void StudentRoom::onOpenGroupSpeech(const std::string& room_id) {
  ShowGroupSpeaker();
}

void StudentRoom::onCloseGroupSpeech(const std::string& room_id) {
  HideGroupSpeaker();
}

    void StudentRoom::onOpenVideoInteract()
    {
		if (m_handsupWidget_ != nullptr)
		{
			return;
		}

        m_handsupWidget_ = new vrd::PlatformView(this);
        m_handsupWidget_->setAttribute(Qt::WA_DeleteOnClose);
        m_handsupWidget_->setFixedHeight(208);
        connect(m_handsupWidget_, &vrd::PlatformView::sigExpandStateChanged, this, [this](bool expanded)
            {
                if (expanded)
                {
                    m_is_handsupwidget_collapse_ = false;
                    m_handsupWidget_->setFixedHeight(208);
                    m_handsupWidget_->move(240, this->height() - 208 - 24);
                }
                else
                {
                    m_is_handsupwidget_collapse_ = true;
                    m_handsupWidget_->setFixedHeight(20);
                    m_handsupWidget_->move((this->width() - 240 - 296 - m_handsupWidget_->width()) / 2 + 240, this->height() - 20 - 24);
                }
            });

		int wid = this->width() - 240 - 296;
		m_handsupWidget_->setWidthLimit(wid);
        m_handsupWidget_->move(240, this->height() - 208 - 24);
        m_handsupWidget_->show();
    }

void StudentRoom::onCloseVideoInteract() {
  ZERO_CHECK(m_handsupWidget_);
  m_handsupWidget_->close();
  m_handsupWidget_ = nullptr;
}

void StudentRoom::InitTimer() {
  m_globalTimer_->setInterval(100);
  connect(m_globalTimer_, &QTimer::timeout, this, &StudentRoom::TimerTick);
}

void StudentRoom::InitSigSlots() {
	connect(ui->pushButton, &QPushButton::clicked, this, &StudentRoom::DropCall);

	connect(&EduRTCEngineWrap::instance(), &EduRTCEngineWrap::sigOnRoomStateChanged, this,
		[this](std::string room_id, std::string uid, int state, std::string extra_info) {
			Edu::StudentJoinClassRoom si = DATAMGR_INS.student_join_class_room();
			if (room_id == m_room_id_ && uid == si.user_info.user_id) {
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

void StudentRoom::DropCall() {
  m_is_leaving_room_ = true;

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
    m_is_leaving_room_ = false;
    dialog->close();
  });
  connect(btn_close, &QPushButton::clicked, [this, dialog] {
    Edu::StudentJoinClassRoom si = DATAMGR_INS.student_join_class_room();
    WSS_SESSION->stuLeaveClass(this->m_room_id_, si.user_info.user_id, NULL);
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
  dialog->move((this->width() - 400) / 2, (this->height() - 238) / 2);
  dialog->setWindowFlags(Qt::FramelessWindowHint);
  dialog->show();
}

void StudentRoom::InitRoomInfos() {
  m_teacher_preview_ = new Videocell(false, ui->widget);
  m_teacher_preview_->RemoteSetAudioMute(false);
  m_teacher_preview_->RemoteSetVideoMute(false);

  m_room_name_ = DATAMGR_INS.current_room().room_name;
  m_room_id_ = DATAMGR_INS.current_room().room_id;
  m_teacher_user_id_ = DATAMGR_INS.current_room().create_user_id;
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
  } else {
    m_teacher_preview_->RemoteSetVideoMute(false);
  }

  if (audio_mute) {
    m_teacher_preview_->RemoteSetAudioMute(true);
  } else {
    m_teacher_preview_->RemoteSetAudioMute(false);
  }

  bytertc::VideoCanvas canvas;
  canvas.render_mode = bytertc::kRenderModeHidden;
  canvas.view = m_teacher_preview_->GetView();
  EduRTCEngineWrap::instance().getMainRtcRoom()->SetRemoteVideoCanvas(
      ti.user_id.c_str(), bytertc::StreamIndex::kStreamIndexMain, canvas);

  pGroupView = new vrd::GroupView();
  pGroupView->setFixedWidth(208);
  pGroupView->setAttribute(Qt::WA_DeleteOnClose);

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

  ui->horizontalLayout_4->addItem(
      new QSpacerItem(8, 1, QSizePolicy::Fixed, QSizePolicy::Fixed));
  ui->horizontalLayout_4->insertWidget(0, contentWidget, 1);
  ui->horizontalLayout_4->insertWidget(0, pGroupView, 1);
  ui->horizontalLayout_4->insertItem(
      0, new QSpacerItem(8, 1, QSizePolicy::Fixed, QSizePolicy::Fixed));

  auto bEnable_interact = DATAMGR_INS.current_room().enable_interactive;
  auto bEnable_group_speech = DATAMGR_INS.current_room().enable_group_speech;

  if (bEnable_group_speech) {
    QTimer::singleShot(500, this, [this]() { onOpenGroupSpeech(""); });
  }
  if (bEnable_interact) {
    QTimer::singleShot(500, this, [this]() { onOpenVideoInteract(); });
  }

  m_globalTimer_->start();

  int status = DATAMGR_INS.current_room().status;

  qInfo("initRoomInfo - status:%d", status);

  if (status == 2) {
    close();
    emit AppUIState::GetInstance().sigReturnMainPage();
  } else if (status == 1) {
    m_class_processing_ = true;
    ui->lbl_time->setVisible(true);
    ui->lbl_rec_icon->setVisible(true);

    QString timestamp =
        QString::number(QDateTime::currentMSecsSinceEpoch() * 1000000);

    uint64_t sec = timestamp.toULongLong();
    uint64_t real = DATAMGR_INS.current_room().begin_class_time_real;
    int diff = (sec - real) / 1000000000;
    m_duaration_class_ = diff;
  }
}

void StudentRoom::RtcInit() {
  std::string roomId = Edu::DataMgr::instance().current_room().room_id;
  std::string groupRoomId =
      Edu::DataMgr::instance().student_join_class_room().group_room_id;
  EduRTCEngineWrap::createMainRoom(roomId);
  EduRTCEngineWrap::createGroupRoom(groupRoomId);

  EduRTCEngineWrap::setMainUserRole(Role::kUserRoleTypeSilentAudience);
  EduRTCEngineWrap::setGroupUserRole(Role::kUserRoleTypeBroadcaster);

  EduRTCEngineWrap::muteLocalAudio(true);
  EduRTCEngineWrap::muteLocalVideo(false);

  std::string token = DATAMGR_INS.student_join_class_room().token;
  std::string uid = vrd::DataMgr::instance().user_id();
  const bytertc::UserInfo user_info{uid.c_str(), nullptr};

  EduRTCEngineWrap::joinMainRoom(token, user_info,
                                 bytertc::kRoomProfileTypeLiveBroadcasting);
  std::string group_token = DATAMGR_INS.student_join_class_room().group_token;
  std::string group_uid = vrd::DataMgr::instance().user_id();
  const bytertc::UserInfo group_user_info{group_uid.c_str(), nullptr};
  EduRTCEngineWrap::joinGroupRoom(group_token, user_info,
                                 bytertc::kRoomProfileTypeLiveBroadcasting);
  EduRTCEngineWrap::publishGroupRoom();
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
      m_duaration_class_++;
      auto h = m_duaration_class_ / 3600;
      auto m = m_duaration_class_ % 3600 / 60;
      auto s = m_duaration_class_ % 3600 % 60;
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

void StudentRoom::SetTeacherName(const QString& str) {
  ZERO_CHECK(m_teacher_preview_);
  m_teacher_preview_->SetDisplayName(str);
}

    void StudentRoom::ShowGroupSpeaker()
    {
        if (m_group_speaker_ == nullptr)
        {
            m_group_speaker_ = new QWidget(this);
            m_group_speaker_->setStyleSheet(
                "background-color:#272e38;"
            );
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
            );
            auto lbl_speaker_icon = new QLabel;
            lbl_speaker_icon->setFixedWidth(50);
            lbl_speaker_icon->setStyleSheet(
                "background-image:url(:img/group_speaker_icon);		  "
                "background-position:center;						  "
                "background-repeat:no-repeat;					  "
            );
            auto lbl_speaker_string2 = new QLabel("请大声说出答案");
            lbl_speaker_string2->setStyleSheet(
                "color:#86909c;"
                "font-weight:400;"
                "font:14px;"
            );
            hbox1->addItem(new QSpacerItem(16, QSizePolicy::Fixed, QSizePolicy::Fixed));
            hbox1->addWidget(lbl_speaker_string, Qt::AlignCenter);
            hbox1->addWidget(lbl_speaker_icon);
            hbox1->addItem(new QSpacerItem(100, 10, QSizePolicy::Expanding, QSizePolicy::Minimum));

            hbox2->addItem(new QSpacerItem(16, QSizePolicy::Fixed, QSizePolicy::Fixed));
            hbox2->addWidget(lbl_speaker_string2);

            m_group_speaker_->setLayout(vBox);
        }

        m_group_speaker_->move(QPoint(8+8+208, 60));
        m_group_speaker_->show();
        UpStage();
    }

void StudentRoom::HideGroupSpeaker() {
  ZERO_CHECK(m_group_speaker_);
  m_group_speaker_->hide();
  DownStage();
}

void StudentRoom::UpStage() {
  VRD_FUNC_GET_COMPONET(vrd::BreakoutStudentDataMgr)->allDiscuss(true);

  EduRTCEngineWrap::enableLocalAudio(true);
  EduRTCEngineWrap::muteLocalAudio(false);
  EduRTCEngineWrap::enableLocalVideo(true);
  EduRTCEngineWrap::muteLocalVideo(false);

  EduRTCEngineWrap::setMainUserRole(Role::kUserRoleTypeBroadcaster);
  EduRTCEngineWrap::publishMainRoom();
}

void StudentRoom::DownStage() {

  EduRTCEngineWrap::unPublishMainRoom();
  EduRTCEngineWrap::setMainUserRole(Role::kUserRoleTypeSilentAudience);


  EduRTCEngineWrap::enableLocalAudio(false);
  EduRTCEngineWrap::muteLocalAudio(true);

  EduRTCEngineWrap::enableLocalVideo(true);
  EduRTCEngineWrap::muteLocalVideo(false);

  VRD_FUNC_GET_COMPONET(vrd::BreakoutStudentDataMgr)->allDiscuss(false);
}
}  // namespace BC
