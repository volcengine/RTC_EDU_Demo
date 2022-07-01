#include <top_bar_widget.h>

#include <QDesktopServices>
#include <QMenu>
#include <QPainter>
#include <QTimer>
#include <QUrl>
#include <QtWidgets/QSpacerItem>
#include <unordered_map>

#include "menu_warp.h"

static constexpr char* kMenuQss =
    "QMenu{ "
    "border-radius:8px;background:#272E3B;"
    "padding-top: 8px;"
    "padding-bottom: 8px;"
    "}"
    "QMenu::item{"
    "border : 0px solid transparent;"
    "background-color : transparent;"
    "font-size: 14px;"
    "height:40px;"
    "width: 120px;"
    "padding-left:16px;"
    "font-family : 'Microsoft YaHei';"
    "color: #fff;"
    "}"
    "QMenu::item::selected{"
    "background-color : #394254"
    "}";

static constexpr char* kNormalSettingLogoQss =
    "background-image:url(:img/"
    "setting);background-position:center;background-repeat:no-repeat;";
static constexpr char* kSelectedSettingLogoQss =
    "background-image:url(:img/"
    "setting_selected);background-position:center;background-repeat:no-repeat;";

static std::unordered_map<int, QString> setting_qss_map = {
    {PushButtonWarp::kNormal, "border:none;background:#1d2129; color:#fff;"},
    {PushButtonWarp::kDisable, "border:none;background:#1d2129; color:#fff"},
    {PushButtonWarp::kSelect,
     "border:none;background:#1d2129; color:#4086FF"}};

TopBarWidget::TopBarWidget(QWidget* parent) : QWidget(parent) {
  initContronls();
  bg_brush_ = new QBrush(QColor(0x1d, 0x21, 0x29));
  setStyleSheet("color:#fff; font-family:'Microsoft YaHei'; font-size:14px;");
}
#define SAFE_FREE(X) \
  do {               \
    if (!X)          \
      break;         \
    delete X;        \
    X = nullptr;     \
  } while (0)

QString TopBarWidget::userName() {
  return lbl_user_->text();
}

void TopBarWidget::setUserName(const QString& name) {
  if (name.size() > 0)
    lbl_user_logo_->setText(name[0].toUpper());
  lbl_user_->setText(name);
}

TopBarWidget::~TopBarWidget() {
  SAFE_FREE(menu_);
  SAFE_FREE(act_disclaimer_);
  SAFE_FREE(act_prv_serv_);
  SAFE_FREE(act_quit_);
  SAFE_FREE(act_serv_proto_);
  SAFE_FREE(act_user_);
}

void TopBarWidget::initContronls() {
  lbl_setting_ = new PushButtonWarp(this);
  lbl_setting_->setStateMapQss(setting_qss_map);
  lbl_setting_->setState(PushButtonWarp::kNormal);
  lbl_setting_->setText(QString::fromUtf8("设置"));
  connect(lbl_setting_, &QPushButton::pressed, [=] {
    if (lbl_setting_->state() == PushButtonWarp::kSelect)
      return;

    lbl_setting_->setState(PushButtonWarp::kSelect);
    lbl_setting_logo_->setStyleSheet(kSelectedSettingLogoQss);
    menu_->setFocus();
    menu_->exec(
        mapToGlobal(lbl_setting_->pos()) +
        QPoint(lbl_setting_->width() - 120, lbl_setting_->height() + 10));
  });
  menu_ = new MenuWarp;
  menu_->setWindowFlags(Qt::WindowStaysOnTopHint | Qt::FramelessWindowHint);
  menu_->setAttribute(Qt::WA_TranslucentBackground);
  menu_->setStyleSheet(kMenuQss);
  auto act_user = new QAction(QString::fromUtf8("用户名"));
  auto act_prv_serv = new QAction(QString::fromUtf8("隐私协议"));
  auto act_serv_proto = new QAction(QString::fromUtf8("服务协议"));
  auto act_disclaimer = new QAction(QString::fromUtf8("免责声明"));
  auto act_quit = new QAction(QString::fromUtf8("退出登录"));
  auto template_func = [=] {
    menu_->hide();
    lbl_setting_->setState(PushButtonWarp::kNormal);
    lbl_setting_logo_->setStyleSheet(kNormalSettingLogoQss);
  };

  connect(menu_, &MenuWarp::sigFocusOut,
          [=] { QTimer::singleShot(0, template_func); });
  connect(act_user, &QAction::triggered, [=] {
    template_func();
    emit sigUserTriggered();
  });
  connect(act_prv_serv, &QAction::triggered, [=] {
    template_func();
    QDesktopServices::openUrl(
        QUrl("https://www.volcengine.com/docs/6348/68918"));
    emit sigPrvServTriggered();
  });
  connect(act_serv_proto, &QAction::triggered, [=] {
    template_func();
    QDesktopServices::openUrl(
        QUrl("https://www.volcengine.com/docs/6348/68917"));
    emit sigServProtoTriggerd();
  });
  connect(act_disclaimer, &QAction::triggered, [=] {
    template_func();
    QDesktopServices::openUrl(
        QUrl("https://www.volcengine.com/docs/6348/68916"));
    emit sigDisclaimerTriggered();
  });
  connect(act_quit, &QAction::triggered, [=] {
    template_func();
    emit sigQuitTriggered();
  });
  menu_->addAction(act_user);
  menu_->addAction(act_prv_serv);
  menu_->addAction(act_serv_proto);
  menu_->addAction(act_disclaimer);
  menu_->addAction(act_quit);
  lbl_setting_logo_ = new QLabel("", this);
  lbl_titile_ = new QLabel("", this);
  lbl_titile_logo_ = new QLabel("", this);
  lbl_user_ = new QLabel("bytedance", this);
  lbl_user_logo_ = new QLabel("B", this);
  lbl_user_logo_->setAlignment(Qt::AlignCenter);
  lbl_setting_logo_->setStyleSheet(kNormalSettingLogoQss);
  lbl_setting_logo_->setMinimumSize(18, 50);

  lbl_titile_->setStyleSheet(
      "background-image:url(:img/"
      "real_time);background-position:center;background-repeat:no-repeat;");
  lbl_titile_->setMinimumWidth(187);

  //lbl_titile_logo_->setStyleSheet(
  //    "background-image:url(:img/"
  //    "demo_logo);margin-top:10px;background-position:center;background-repeat:"
  //    "no-repeat;");
  lbl_titile_logo_->setMinimumWidth(47);

  lbl_user_logo_->setStyleSheet(
      "background-image:url(:img/"
      "user_bg);background-position:center;background-repeat:"
      "no-repeat;");
  lbl_user_logo_->setMinimumWidth(28);

  layout_ = new QHBoxLayout(this);
  layout_->setContentsMargins(24, 0, 24, 0);
  layout_->setSpacing(8);
  layout_->addWidget(lbl_titile_, 0, Qt::AlignRight);
  layout_->addWidget(lbl_titile_logo_, 0, Qt::AlignLeft);
  layout_->addItem(new QSpacerItem(40, 20, QSizePolicy::Expanding));
  layout_->addWidget(lbl_user_logo_);
  layout_->addWidget(lbl_user_);
  layout_->addWidget(lbl_setting_logo_);
  layout_->addWidget(lbl_setting_, 0, Qt::AlignRight);
  setLayout(layout_);
}

void TopBarWidget::showEvent(QShowEvent* e) {}

void TopBarWidget::paintEvent(QPaintEvent* e) {
  QPainter painter(this);
  painter.fillRect(rect(), *bg_brush_);
}
