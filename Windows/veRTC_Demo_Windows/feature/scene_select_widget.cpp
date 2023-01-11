#include "scene_select_widget.h"
#include "core/configer.h"
#include "feature/data_mgr.h"
#include "core/application.h"
#include "core/navigator_interface.h"
#include "core/session_base.h"
#include "input_dlg.h"
#include "core/util_tip.h"
#include "core/component/image_button.h"
#include <QDebug>

#ifdef EDU_SCENE
#include "edu/edu_module.h"
#endif // EDU_SCENE

#ifdef MORE_SCENE
#include "feature/scene_select_module.h"
#endif // MORE_SCENE

static constexpr char* kMainQss =
    "#stackedWidget {"
    "    background : #1D2129;"
    "}"

    "#txt_sdk_ver {"
    "font-family : 'Microsoft YaHei';"
    "font-size : 12px;"
    "color : #86909C "
    "}";

static constexpr char* kGrayFontMQss =
    "font-family : 'Microsoft YaHei';"
    "background : transparent;"
    "font-size : 20px;"
    "color : #86909C; ";

static constexpr char* kLightFontQss =
    "font-family : 'Microsoft YaHei';"
    "background:transparent;"
    "font-size : 20px;"
    "color : #ffffff; ";

SceneSelectWidget& SceneSelectWidget::instance() {
    static SceneSelectWidget sceneSelect;
    return sceneSelect;
}

SceneSelectWidget::SceneSelectWidget(QWidget* parent) : QWidget(parent) {
	ui.setupUi(this);
	initControls();
	initConnects();
}

SceneSelectWidget::~SceneSelectWidget() {
}

void SceneSelectWidget::initControls() {
    this->resize(QSize(1180, 700));
	this->setStyleSheet(kMainQss);
	this->setContentsMargins(0, 0, 0, 0);
	ui.txt_sdk_ver->setText(QString("App版本 v12.0.5 / SDK版本 v") +
		RtcEngineWrap::getSDKVersion().c_str());
	QApplication::setEffectEnabled(Qt::UI_AnimateCombo, false);

#ifdef EDU_SCENE
	vrd::EduModule::addThis();
	setupEduSceneButton();
#endif // EDU_SCENE

#ifdef MORE_SCENE
	vrd::SceneSelectModule::addThis();
	setupMoreSceneButton();
#endif // MORE_SCENE

	mask_widget_ = new QWidget(this);
	mask_widget_->setStyleSheet("background:rgba(0,0,0,0.5);");
	mask_widget_->hide();
}

void SceneSelectWidget::initConnects() {
    connect(ui.top_bar, &TopBarWidget::sigUserTriggered, this, [=] {
        auto dlg = new InputDlg(this);
        dlg->setName(ui.top_bar->userName());
        enableMask(true);
        if (dlg->exec() == QDialog::Accepted) {
            auto session = vrd::Application::getSingleton().getComponent(
                VRD_UTIL_GET_COMPONENT_PARAM(vrd::SessionBase));
            session->changeUserName(dlg->name().toUtf8().constData(), [=](int code) {
                if (code == 200) {
                    Configer::instance().saveData("info/user_name",
                        dlg->name().toUtf8().constData());
                    ui.top_bar->setUserName(dlg->name());
                }
                else if (code == 430) {
                    vrd::util::showToastInfo("输入内容包含敏感词，请重新输入");
                }
                else if (code == 500) {
                    vrd::util::showToastInfo("系统繁忙，请稍后重试");
                }
                else {
                    vrd::util::showToastInfo("修改昵称失败, 请换个昵称重试");
                }
                dlg->deleteLater();
            });
        }
        else {
            dlg->deleteLater();
        }
        enableMask(false);
        });
    connect(ui.top_bar, &TopBarWidget::sigQuitTriggered, this,
        [=] { emit sigLogOut();
        });
}

void SceneSelectWidget::setupEduSceneButton() {
    auto eduBtn = new ImageButton(this);
    ui.sceneSelectLayout->addWidget(eduBtn, scene_count_ / 4,
        scene_count_ < 4 ? scene_count_ : scene_count_ % 4);
    scene_count_++;
	eduBtn->img()->setFixedHeight(128);
	eduBtn->setImgQss(
		"background-image:url(:img/"
		"online_class);margin-top:10px;background-position:center;background-"
		"repeat:"
		"no-repeat;");
	eduBtn->setStyleSheet("border-radius:14px;"
		"background:#272E3B;");
	eduBtn->setTextQss(kLightFontQss);
	eduBtn->text()->setAlignment(Qt::AlignHCenter |
		Qt::AlignVCenter);
	eduBtn->setText(QString::fromUtf8("在线课堂"));
    eduBtn->setFixedSize(QSize(220,220));
	connect(eduBtn, &ImageButton::sigPressed, this,
		[=] {
			VRD_FUNC_GET_COMPONET(vrd::INavigator)->go("edu");
			emit enterScene("edu");
		});
}

void SceneSelectWidget::setupMoreSceneButton() {
	auto moreBtn = new ImageButton(this);
    ui.sceneSelectLayout->addWidget(moreBtn, scene_count_ / 4,
        scene_count_ < 4 ? scene_count_ : scene_count_ % 4);
    scene_count_++;

	moreBtn->layout()->setSpacing(20);
	moreBtn->setImgText(QString::fromUtf8("更多场景"));
	moreBtn->img()->setAlignment(Qt::AlignHCenter | Qt::AlignBottom);
	moreBtn->setImgQss(kGrayFontMQss);
	moreBtn->setStyleSheet("border-radius:14px;"
		"background:#272E3B;");

	moreBtn->setText(QString::fromUtf8("敬请期待"));
	moreBtn->setTextQss(kGrayFontMQss);
	moreBtn->text()->setAlignment(Qt::AlignHCenter | Qt::AlignTop);
    moreBtn->setFixedSize(QSize(220,220));
}

void SceneSelectWidget::updateUserName() {
	ui.top_bar->setUserName(
		QString::fromStdString(vrd::DataMgr::instance().user_name()));
}

void SceneSelectWidget::resizeEvent(QResizeEvent* e) {
  mask_widget_->setGeometry(ui.stackedWidget->geometry());
}

void SceneSelectWidget::closeEvent(QCloseEvent* e) { 
    VRD_FUNC_GET_COMPONET(vrd::INavigator)->quit();
    QApplication::quit(); 
    QWidget::closeEvent(e);
}

void SceneSelectWidget::enableMask(bool enabled) {
    mask_widget_->setVisible(enabled);
}

QStackedWidget* SceneSelectWidget::getMainStackWidget() {
    return ui.stackedWidget;
}
