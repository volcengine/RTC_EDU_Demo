#include "side_history.h"
#include <QDatetime>
#include <QDesktopServices>
#include <QGraphicsDropShadowEffect>
#include <QPainter>
#include <QUrl>
#include "core/application.h"
#include "edu_session.h"
#include "edu/core/data_mgr.h"
#include "feature/data_mgr.h"

static constexpr char* kMainQss =
    "QWidget{"
    "font-size: 14px;"
    "font-family : 'Microsoft YaHei';"
    "background:#272e3b;"
    "color:#fff;"
    "border:none;"
    "}"
    "#btn_close{"
    "background-image:url(:img/close);"
    " background-position : center;"
    "background-repeat : no-repeat;"
    "}";

static constexpr char* kListWidgetQss =
    "QTreeWidget{"
    "background:#272e3b; "
    "border:0px; "
    "margin:0px 0px 0px 0px;"
    "}"
    "QTreeWidget::Item{height:40px; border:0px;}";

static constexpr char* kDeleteButtonQss =
    "background:transparent; color:#fff;"
    "background-image:url(:img/dustbin);"
    "background-position:center;background-repeat:no-repeat;";

static constexpr char* kInfoQss =
    "background:transparent; color:#fff;"
    "background-image:url(:img/info);"
    "background-position:center;"
    "background-repeat:no-repeat;";

Q_DECLARE_METATYPE(Edu::RecordInfo);
Q_DECLARE_METATYPE(Edu::ClassRoom);
SideHistory::SideHistory(QWidget* parent) : QWidget(parent) {
  ui.setupUi(this);
  QGraphicsDropShadowEffect* effect = new QGraphicsDropShadowEffect(this);
  effect->setOffset(0, 0);
  effect->setColor(QColor(0, 0, 0));
  effect->setBlurRadius(20);
  this->setGraphicsEffect(effect);
  this->setStyleSheet(kMainQss);
  ui.lbl_info_logo->setStyleSheet(kInfoQss);
  ui.treeWidget->setStyleSheet(kListWidgetQss);
  connect(ui.btn_close, &QPushButton::clicked, this,
          [=] { emit sigCloseButtonClicked(); });

  connect(ui.treeWidget, &TreeWidgetWarp::sigSubItemButtonClicked,
          [=](QTreeWidgetItem* item) {
            ui.treeWidget->setItemEnabled(item, false);
            auto session = vrd::Application::getSingleton().getComponent(
                VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
            session->eduDeleteRecord(
                item->data(0, Qt::UserRole + 1).value<Edu::RecordInfo>().vid,
                [=](int code) {
                  ui.treeWidget->setItemEnabled(item, true);
                  if (code != 200)
                    return;
                  ui.treeWidget->removeItem(item);
                  delete item;
                });
          });
  connect(
      ui.treeWidget, &TreeWidgetWarp::sigSubItemClicked, this,
      [=](QTreeWidgetItem* item) {
        QDesktopServices::openUrl(QUrl(QString(item->data(0, Qt::UserRole + 1)
                                                   .value<Edu::RecordInfo>()
                                                   .video_url.c_str())));
      });
}

void SideHistory::updateData() {
  ui.treeWidget->removeAll();
  auto session = vrd::Application::getSingleton().getComponent(
      VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
  session->getHistoryRoomList(
      vrd::DataMgr::instance().user_id(), [=](int code) {
        if (code != 200) 
          return;
        auto history_room_list = Edu::DataMgr::instance().histroy_room_list();
        for (const auto& room : history_room_list) {
          session->getHistoryRecordList(room.room_id, [=](int code) {
            Edu::HistoryRecordList history_record_list;
            {
                if (code == 200) {
                history_record_list =
                    Edu::DataMgr::instance().histroy_record_list();
              }
            }
            ui.treeWidget->addTreeHistroyItem(room, history_record_list);
          });
        }
      });
}

void SideHistory::setUserRole(room_type::USER_ROLE role) {
  if (role == room_type::USER_ROLE::STUDENT) {
    ui.treeWidget->setItemBtnVisible(false);
  } else {
    ui.treeWidget->setItemBtnVisible(true);
  }
}

void SideHistory::paintEvent(QPaintEvent* e) {
  Q_UNUSED(e);
  QPainter painter(this);
  painter.fillRect(rect(), QBrush(QColor(0x27, 0x2e, 0x3b)));
}
