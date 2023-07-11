#include "list_widget_warp.h"

#include <iostream>
#include <QMouseEvent>

ListWidgetWarp::ListWidgetWarp(QWidget *parent) : QListWidget(parent) {
  connect(this, &QListWidget::itemSelectionChanged, this,
          &ListWidgetWarp::updateSelectedChanged);
}

void ListWidgetWarp::setItemSizeHint(const QSize &size) { item_size_ = size; }

void ListWidgetWarp::addWidget(ListWidgetItemWarp *widget) {
  if (!widget) return;
  auto item = new QListWidgetItem(this);
  item->setSizeHint(item_size_);
  this->addItem(item);
  this->setItemWidget(item, widget);
  connect(widget, &ListWidgetItemWarp::sigButtonclicked,
          [=] { emit sigItemButtonClicked(item); });
}

void ListWidgetWarp::mouseReleaseEvent(QMouseEvent *event) {
  auto item = itemAt(event->pos());
  if (item) setCurrentItem(item);
}

void ListWidgetWarp::updateSelectedChanged() {
  if (selectedItems().size() == 0) return;

  old_select_ = cur_select_;
  cur_select_ =
      static_cast<ListWidgetItemWarp *>(itemWidget(selectedItems().at(0)));
  if (old_select_ != cur_select_) {
    if (old_select_) old_select_->hideBtn();
    if (cur_select_) cur_select_->showBtn();
  }
}

ListWidgetItemWarp::ListWidgetItemWarp(QWidget *parent) : QWidget(parent) {
  lbl_class_room_ = new QLabel(this);
  lbl_class_room_->setStyleSheet(
      "background:transparent; color:#fff; font-size:14px;");
  lbl_date_ = new QLabel(this);
  lbl_date_->setStyleSheet(
      "background:transparent;color:#86909c;font-size:14px;");
  placeholder_widget_ = new QWidget(this);
  btn_delete_ = new QPushButton(this);
  btn_delete_->hide();
  btn_delete_->setFixedSize(16, 16);

  placeholder_widget_->setFixedSize(16, 16);
  placeholder_widget_->setStyleSheet("background:transparent;");
  layout_ = new QGridLayout(parent);
  layout_->setContentsMargins(20, 9, 9, 12);
  connect(btn_delete_, &QPushButton::clicked, [=] { emit sigButtonclicked(); });
  this->setLayout(layout_);
  layout_->addWidget(lbl_class_room_, 0, 0);
  layout_->addWidget(lbl_date_, 0, 1);
  layout_->addWidget(placeholder_widget_, 0, 2);
  layout_->setSpacing(0);
}

void ListWidgetItemWarp::setClassRoomName(const QString &name) {
  lbl_class_room_->setText(name);
}

void ListWidgetItemWarp::setDate(const QString &date) {
  lbl_date_->setText(date);
}

void ListWidgetItemWarp::setButtonImage(const QString &qss) {
  btn_delete_->setStyleSheet(qss);
}

void ListWidgetItemWarp::showBtn() {
  layout_->removeWidget(placeholder_widget_);
  layout_->addWidget(btn_delete_, 0, 2);
  btn_delete_->show();
}

void ListWidgetItemWarp::hideBtn() {
  layout_->removeWidget(btn_delete_);
  layout_->addWidget(placeholder_widget_, 0, 2);
  btn_delete_->hide();
}
