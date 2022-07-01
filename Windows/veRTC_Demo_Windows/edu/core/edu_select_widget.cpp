#include "edu_select_widget.h"

#include <QListView>
#include "app_ui_state.h"
#include "core/navigator_interface.h"
#include "scene_select_widget.h"
#include "side_history.h"
#include "toast.h"
#include "feature/data_mgr.h"

static constexpr char* kMainQss =
    "#stackedWidget {"
    "    background : #1D2129;"
    "}"

    "#btn_back,#btn_back_2,#btn_back_3,#btn_back_4,#btn_back_5{ "
    "border:none;"
    "background-image:url(:img/back);"
    "background-position:center;"
    "background-repeat:no-repeat;"
    "}"

    "#course_widget,#rejoin_widget{ "
    "    background : #272E3B;"
    "border-radius: 16px;"
    "}"

    "#lbl_course,#lbl_type,#lbl_room_time,#lbl_history,#lbl_history_2,#lbl_"
    "history_3,#lbl_"
    "refresh {"
    "font-family : 'Microsoft YaHei';"
    "font-size : 14px;"
    "color:#fff;"
    "}"

    "#lbl_hint{"
    "font-family : 'Microsoft YaHei';"
    "font-size : 14px;"
    "color:#86909C;"
    "}"

    "#edt_new_room_id {"
    "padding-left : 16px;"
    "padding-top : 13px;"
    "padding-bottom : 13px;"
    "color : #fff;"
    "font-family : 'Microsoft YaHei';"
    "font-size : 14px;"
    "background : #1C222D;"
    "border-radius : 4px;"
    "}"

    "#btn_create_class ,#btn_rejoin{"
    "border : none;"
    "font-family : 'Microsoft YaHei';"
    "font-size : 14px;"
    "color : #fff;"
    "background : #4080FF;"
    "border-radius : 24px;"
    "}"

    "#btn_create_class:disabled,#btn_rejoin:disabled{"
    "background:#2E4675;"
    "}"

    "#lbl_history_logo,#lbl_history_logo_2,#lbl_history_logo_3{"
    "border:none;"
    "background-image:url(:img/history);"
    "background-position:center;"
    "background-repeat:no-repeat;"
    "}"

    "#lbl_refresh_logo{"
    "border:none;"
    "background-image:url(:img/refresh);"
    "background-position:center;"
    "background-repeat:no-repeat;"
    "}"

    "#lbl_course_logo{"
    "border:none;"
    "background-image:url(:img/course_logo);"
    "background-position:center;"
    "background-repeat:no-repeat;"
    "}";

static constexpr char* kComboBoxQss =
    "QComboBox {"
    "font-family : 'Microsoft YaHei';"
    "font-size : 14px;"
    "color:#FFF;"
    "border-radius : 4px;"
    "padding-left : 16px;"
    "padding-top : 13px;"
    "padding-bottom : 13px;"
    "background:#1C222D;"
    "}"

    "QComboBox::drop-down {"
    "  margin-right : 10px;"
    "border:  none;"
    "}"

    "QComboBox::down-arrow {"
    "width:16px;"
    "height:  16px;"
    "background-image : url(:img/down);"
    "background-position:center;"
    "background-repeat:no-repeat;"
    "}"

    "QComboBox QAbstractItemView {"
    "font-family : 'Microsoft YaHei';"
    "font-size : 14px;"
    "border:none;"
    "border-radius : 4px;"
    "padding:  5px;"
    "color:#FFF;"
    "background-color : #1C222D;"
    "}"

    "QComboBox QAbstractItemView::item {"
    "height: 36px;"
    "}"

    "QComboBox QAbstractItemView::item : selected {"
    "background-color : #394254;"
    "}";

static constexpr char* kGrayFontMQss =
    "font-family : 'Microsoft YaHei';"
    "background : transparent;"
    "font-size : 24px;"
    "color : #86909C; ";

static constexpr char* kLightFontQss =
    "font-family : 'Microsoft YaHei';"
    "background:transparent;"
    "font-size : 24px;"
    "color : #fff; ";

EduSelectWidget::EduSelectWidget(QWidget* parent) : QWidget(parent) {
	ui.setupUi(this);
	initControls();
	initConnects();
}

void EduSelectWidget::initControls() {
	this->setStyleSheet(kMainQss);
	this->setContentsMargins(0, 0, 0, 0);
	QApplication::setEffectEnabled(Qt::UI_AnimateCombo, false);
	ui.cmb_new_room_type->setStyleSheet(kComboBoxQss);
	ui.cmb_room_time->setStyleSheet(kComboBoxQss);

	mask_widget_ = new QWidget(this);
	mask_widget_->setStyleSheet("background:rgba(0,0,0,0.5);");
	mask_widget_->hide();

	ui.btn_teacher->setImgQss(
		"background-image:url(:img/"
		"teacher);background-position:center;background-repeat:"
		"no-repeat;");
	ui.btn_teacher->img()->setMinimumWidth(240);
	ui.btn_teacher->img()->setMinimumHeight(240);
	ui.btn_teacher->setTextQss(kLightFontQss);
	ui.btn_teacher->text()->setAlignment(Qt::AlignHCenter | Qt::AlignVCenter);
	ui.btn_teacher->setText(QString::fromUtf8("我是老师"));

	ui.btn_student->setImgQss(
		"background-image:url(:img/"
		"student);background-position:center;background-repeat:"
		"no-repeat;");
	ui.btn_student->img()->setMinimumWidth(240);
	ui.btn_student->img()->setMinimumHeight(240);
	ui.btn_student->setTextQss(kLightFontQss);
	ui.btn_student->text()->setAlignment(Qt::AlignHCenter | Qt::AlignVCenter);
	ui.btn_student->setText(QString::fromUtf8("我是学生"));
	ui.cmb_new_room_type->setView(new QListView(ui.cmb_new_room_type));
	ui.cmb_new_room_type->view()->window()->setWindowFlags(
		Qt::Popup | Qt::FramelessWindowHint | Qt::NoDropShadowWindowHint);
	ui.cmb_new_room_type->view()->window()->setAttribute(
		Qt::WA_TranslucentBackground);

	ui.cmb_room_time->setView(new QListView(ui.cmb_room_time));
	ui.cmb_room_time->view()->window()->setWindowFlags(
		Qt::Popup | Qt::FramelessWindowHint | Qt::NoDropShadowWindowHint);
	ui.cmb_room_time->view()->window()->setAttribute(
		Qt::WA_TranslucentBackground);
	side_widget_ = new SideHistory(this);
	side_widget_->hide();
	SceneSelectWidget::instance().getMainStackWidget()->insertWidget(1, this);
	SceneSelectWidget::instance().getMainStackWidget()->setCurrentWidget(this);
	ui.stackedWidget->setCurrentIndex(kUserRolePage);
}

void EduSelectWidget::initConnects() {
    connect(ui.btn_back_2, &QPushButton::clicked, this, [=] {
		initData();
		ui.stackedWidget->setCurrentIndex(kUserRolePage);
		side_widget_->hide();
    });
    connect(ui.btn_back_3, &QPushButton::clicked, this, [=] {
        ui.stackedWidget->setCurrentIndex(kTeacherCreateRoomPage);
        ui.device_setting->stopTest();
        side_widget_->hide();
    });
    connect(ui.btn_back_4, &QPushButton::clicked, this, [=] {
		ui.stackedWidget->setCurrentIndex(kUserRolePage);
		side_widget_->hide();
    });
    connect(ui.btn_back_5, &QPushButton::clicked, this, [=] {
		ui.stackedWidget->setCurrentIndex(kUserRolePage);
		side_widget_->hide();
    });

	connect(ui.btn_back, &QPushButton::clicked, this, [=] {
		SceneSelectWidget::instance().getMainStackWidget()->removeWidget(this);
		SceneSelectWidget::instance().getMainStackWidget()->setCurrentIndex(0);
		VRD_FUNC_GET_COMPONET(vrd::INavigator)->go("scene_select");
		side_widget_->hide();
	});

    connect(ui.btn_teacher, &ImageButton::sigPressed, this, [=] { goTeacher(); });
    connect(ui.lbl_history, &LabelWarp::sigPressed, this, [=] {
		side_widget_->updateData();
		side_widget_->show();
    });
    connect(ui.lbl_history_2, &LabelWarp::sigPressed, this, [=] {
		side_widget_->updateData();
		side_widget_->show();
    });
    connect(ui.lbl_history_3, &LabelWarp::sigPressed, this, [=] {
		side_widget_->updateData();
		side_widget_->show();
    });

    connect(side_widget_, &SideHistory::sigCloseButtonClicked, this,
            [=] { side_widget_->hide(); 
        });

    connect(ui.btn_student, &ImageButton::sigPressed, this, [=] { goStudent(); });
    connect(ui.lbl_refresh, &LabelWarp::sigPressed, this, [=] {
		enabledControls(false);
		ui.student_select_page->clearData();
		auto session = vrd::Application::getSingleton().getComponent(
			VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
		session->eduGetActiveClass([=](int code) {
			enabledControls(true);
			if (code != 200) return;
			Edu::DataMgr::instance().setIsTeacher(false);
			side_widget_->setUserRole(room_type::USER_ROLE::STUDENT);
			ui.student_select_page->updateData();
			ui.stackedWidget->setCurrentIndex(kStudentSelectRoomPage);
			});
    });

    connect(side_widget_, &SideHistory::sigItemButtonClicked, this, [=](int row) {
    // item button clicked. row is index.
    });

    connect(ui.btn_create_class, &QPushButton::clicked, this, [=] {
        enabledControls(false);
        auto session = vrd::Application::getSingleton().getComponent(
            VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
        session->eduCreateClass(ui.edt_new_room_id->text().toUtf8().constData(),
                                ui.cmb_new_room_type->currentIndex(),
                                vrd::DataMgr::instance().user_id(),
                                (ui.cmb_room_time->currentIndex() + 1) * 30 * 60,
                                vrd::DataMgr::instance().user_name(),
                                [=](int code) {
                                    enabledControls(true);
                                    if (code == 430) {
										Toast::showTip(
											"输入内容包含敏感词，请重新输入",
											QApplication::activeWindow());
										return;
                                    }else  if (code != 200) {
										Toast::showTip(
											"该用户正在使用学生身份，当前无法使用老师身份",
											QApplication::activeWindow());
										return;
                                    }
                                    ui.edt_new_room_id->clear();
                                    ui.btn_create_class->setEnabled(false);
                                    Edu::DataMgr::instance().setCurrentRoom(
                                        Edu::DataMgr::instance().create_class_room());
                                    side_widget_->hide();
                                    ui.stackedWidget->setCurrentIndex(kSettingPage);
                                    ui.device_setting->startTest();
                                });
    });

    // join
    connect(ui.device_setting, &DeviceSetting::sigJoinClass, this, [=] {
        enabledControls(false);
        auto session = vrd::Application::getSingleton().getComponent(
            VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
        session->teaJoinClass(
            vrd::DataMgr::instance().room_id(), vrd::DataMgr::instance().user_id(),
            vrd::DataMgr::instance().user_name(), [=](int code) {
                enabledControls(true);
                if (code != 200) {
                Toast::showTip("加入教室失败", this);
                return;
                }
		        auto cur = Edu::DataMgr::instance().current_room();
		        cur.token = Edu::DataMgr::instance().teacher_info().rtc_token;
		        Edu::DataMgr::instance().setCurrentRoom(std::move(cur));
                ui.device_setting->stopTest();
                Edu::DataMgr::instance().setIsTeacher(true);
                AppUIState::GetInstance().SetUserRole(room_type::USER_ROLE::TEACHER);
                AppUIState::GetInstance().SetClassType(
                    Edu::DataMgr::instance().room_type()
                        ? room_type::CLASS_TYPE::BREAK_OUT
                        : room_type::CLASS_TYPE::LECTURE_HALL);
                AppUIState::GetInstance().StartClass();
                SceneSelectWidget::instance().hide();
            });
    });

    // rejoin
    connect(ui.btn_rejoin, &QPushButton::clicked, this, [=] {
		enabledControls(false);
		auto session = vrd::Application::getSingleton().getComponent(
			VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
		session->teaJoinClass(
			vrd::DataMgr::instance().room_id(), vrd::DataMgr::instance().user_id(),
			vrd::DataMgr::instance().user_name(), [=](int code) {
				enabledControls(true);
				if (code != 200) {
					Toast::showTip("加入教室失败", this);
					return;
				}
				side_widget_->hide();
				Edu::DataMgr::instance().setIsTeacher(true);
				Edu::DataMgr::instance().setCurrentRoom(
					Edu::DataMgr::instance().created_class_room()[0]);
				auto cur = Edu::DataMgr::instance().current_room();
				cur.token = Edu::DataMgr::instance().teacher_info().rtc_token;
				Edu::DataMgr::instance().setCurrentRoom(std::move(cur));
				AppUIState::GetInstance().SetUserRole(room_type::USER_ROLE::TEACHER);
				AppUIState::GetInstance().SetClassType(
					Edu::DataMgr::instance().room_type()
					? room_type::CLASS_TYPE::BREAK_OUT
					: room_type::CLASS_TYPE::LECTURE_HALL);
				AppUIState::GetInstance().StartClass();
				SceneSelectWidget::instance().hide();
		});
    });

    connect(ui.edt_new_room_id, &QLineEdit::textEdited, this, [=](QString str) {
		if (str.isEmpty()) {
			ui.btn_create_class->setEnabled(false);
		}
		else {
			if (enabled_controls_) ui.btn_create_class->setEnabled(true);
		}
    });

    // show main page
    connect(&AppUIState::GetInstance(), &AppUIState::sigReturnMainPage, this,
		[=] {
			if (Edu::DataMgr::instance().is_teacher()) {
				goTeacher();
			}
			else {
				goStudent();
			}
        });

    connect(&AppUIState::GetInstance(), &AppUIState::sigReturnRoleSeletePage,
        this, [=] {
			ui.stackedWidget->setCurrentIndex(kUserRolePage);
			SceneSelectWidget::instance().show();
    });

    connect(ui.student_select_page, &StudentSelectPage::sigJoinClassRoom, this,
		[=] {
			side_widget_->hide();
			SceneSelectWidget::instance().hide();
		});
}

void EduSelectWidget::initData() {
	ui.edt_new_room_id->setText(
		QString("%1的课堂").arg(vrd::DataMgr::instance().user_name().c_str()));
	ui.cmb_new_room_type->setCurrentIndex(0);
	ui.cmb_room_time->setCurrentIndex(0);
}

void EduSelectWidget::enabledControls(bool enable) {
	enabled_controls_ = enable;
	ui.btn_back->setEnabled(enable);
	ui.btn_back_2->setEnabled(enable);
	ui.btn_back_3->setEnabled(enable);
	ui.btn_back_4->setEnabled(enable);
	ui.btn_back_5->setEnabled(enable);
	if (ui.edt_new_room_id->text().isEmpty())
		ui.btn_create_class->setEnabled(false);
	else
		ui.btn_create_class->setEnabled(enable);
	ui.btn_rejoin->setEnabled(enable);
	ui.btn_teacher->setEnabled(enable);
	ui.btn_student->setEnabled(enable);
	ui.device_setting->setEnabled(enable);
}

void EduSelectWidget::goTeacher() {
	enabledControls(false);
	Edu::DataMgr::instance().setIsTeacher(true);
	side_widget_->setUserRole(room_type::USER_ROLE::TEACHER);
	auto session = vrd::Application::getSingleton().getComponent(
		VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
	session->getCreatedClass(vrd::DataMgr::instance().user_id(), [=](int code) {
		initData();
		enabledControls(true);
		if (code != 200){
			Toast::showTip(QString("请求失败， 错误码：%d").arg(code),
				QApplication::activeWindow());
            return;
        }
		if (Edu::DataMgr::instance().created_class_room().empty()) {
			ui.stackedWidget->setCurrentIndex(kTeacherCreateRoomPage);
		}
		else {
			ui.stackedWidget->setCurrentIndex(kTeacherReJoinRoomPage);
		}
        SceneSelectWidget::instance().show();
	});
}

void EduSelectWidget::goStudent() {
	enabledControls(false);
	auto session = vrd::Application::getSingleton().getComponent(
		VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
	session->eduGetActiveClass([=](int code) {
		enabledControls(true);
		if (code != 200) {
			Toast::showTip(QString("请求失败， 错误码：%d").arg(code),
				QApplication::activeWindow());
			return;
		}
		Edu::DataMgr::instance().setIsTeacher(false);
		side_widget_->setUserRole(room_type::USER_ROLE::STUDENT);
		ui.student_select_page->updateData();
		ui.stackedWidget->setCurrentIndex(kStudentSelectRoomPage);
        SceneSelectWidget::instance().show();
	});
}

void EduSelectWidget::resizeEvent(QResizeEvent* e) {
  mask_widget_->setGeometry(ui.stackedWidget->geometry());
  side_widget_->setGeometry(geometry().width() - 400, 0, 400, height());
}

void EduSelectWidget::closeEvent(QCloseEvent*) { 
    QApplication::quit(); 
}

void EduSelectWidget::enableMask(bool enabled) {
    mask_widget_->setVisible(enabled);
}
