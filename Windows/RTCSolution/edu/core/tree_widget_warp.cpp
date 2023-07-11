#include "tree_widget_warp.h"
#include <QDateTime>
#include <QHeaderView>
#include <QPainter>
#include <QStyleOption>
#include <QtDebug>

Q_DECLARE_METATYPE(Edu::RecordInfo);
Q_DECLARE_METATYPE(Edu::ClassRoom);

TreeWidgetWarp::TreeWidgetWarp(QWidget* parent) : QTreeWidget(parent) {
  setHeaderHidden(true);
  setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
  setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
  setIndentation(0);
  setFocusPolicy(Qt::NoFocus);
  connect(this, &QTreeWidget::itemSelectionChanged, this,
          &TreeWidgetWarp::onItemSelectionChanged);
  connect(this, &QTreeWidget::itemClicked, this,
          &TreeWidgetWarp::onItemClicked);
  connect(this, &QTreeWidget::itemDoubleClicked, this,
          &TreeWidgetWarp::onItemDBClicked);
  connect(this, &QTreeWidget::itemExpanded, this,
          &TreeWidgetWarp::onItemExpanded);
  connect(this, &QTreeWidget::itemCollapsed, this,
          &TreeWidgetWarp::onItemCollapsed);
}

void TreeWidgetWarp::onItemSelectionChanged() {
  if (selectedItems().size() == 0)
    return;
  auto sel_item = selectedItems().at(0);
  bool is_root = sel_item->data(0, Qt::UserRole).toBool();
  old_select_ = cur_select_;
  cur_select_ = is_root ? nullptr : sel_item;
  if (old_select_ != cur_select_) {
    if (old_select_)
      static_cast<TreeHistroyLeaveItem*>(itemWidget(old_select_, 0))
          ->showBtn(false);
    if (cur_select_)
      static_cast<TreeHistroyLeaveItem*>(itemWidget(cur_select_, 0))
          ->showBtn(true);
  }
}

void TreeWidgetWarp::addTreeHistroyItem(const Edu::ClassRoom& room, const Edu::HistoryRecordList& record_list) {
	auto item = new QTreeWidgetItem;
	item->setData(0, Qt::UserRole, 1);
	QVariant v;
	v.setValue(room);
	item->setData(0, Qt::UserRole + 1, v);
	auto widget = new TreeHistroyNodeItem(0, this);
	widget->setText(room.room_name.c_str());
	widget->setDate(
		QDateTime::fromMSecsSinceEpoch(uint64_t(room.create_time) / 1000000)
		.toString("yyyy/MM/dd"));
	this->addTopLevelItem(item);
	this->setItemWidget(item, 0, widget);
	widget->setLogoQss(
		"background:transparent;background-image:url(:img/"
		"tree_down);background-position:center;background-repeat:"
		"no-repeat;");
	widget->setLogoExpandedQss(
		"background:transparent;background-image:url(:img/"
		"tree_up);background-position:center;background-repeat:"
		"no-repeat;");

	for (const auto& record : record_list) {
		auto item_child = new QTreeWidgetItem;
		item_child->setData(0, Qt::UserRole, 0);
		QVariant v;
		v.setValue(record);
		item_child->setData(0, Qt::UserRole + 1, v);
		auto widget_child = new TreeHistroyLeaveItem(1, widget);
		widget_child->setBtnVisible(visible_);
		list_leaves_.append(widget_child);

		auto date = QDateTime::fromMSecsSinceEpoch(
			uint64_t(record.record_begin_time) / 1000000)
			.toString("yyyy/MM/dd hh:mm:ss") +
			QDateTime::fromMSecsSinceEpoch(
				uint64_t(record.record_end_time) / 1000000)
			.toString("-hh:mm:ss");
		widget_child->setDate(date);
		widget_child->setBtnQss(
			"background:transparent;background-image:url(:img/"
			"dustbin);background-position:center;background-repeat:"
			"no-repeat;");
		connect(widget_child, &TreeHistroyLeaveItem::sigButtonclicked, this,
			[=] { emit sigSubItemButtonClicked(item_child); });
		item->addChild(item_child);
		this->setItemWidget(item_child, 0, widget_child);
	}
}

void TreeWidgetWarp::removeItem(QTreeWidgetItem* item) {
  cur_select_ = nullptr;
  list_leaves_.removeOne(
      static_cast<TreeHistroyLeaveItem*>(itemWidget(item, 0)));
  this->removeItemWidget(item, 0);
}

void TreeWidgetWarp::removeAll() {
  this->clear();
  cur_select_ = nullptr;
  old_select_ = nullptr;
  list_leaves_.clear();
}

void TreeWidgetWarp::setItemEnabled(QTreeWidgetItem* item, bool enabled) {
  auto node = static_cast<TreeHistroyLeaveItem*>(itemWidget(item, 0));
  node->setBtnEnabled(enabled);
}

void TreeWidgetWarp::setItemBtnVisible(bool visible) {
  visible_ = visible;
  foreach (auto item, list_leaves_) { item->setBtnVisible(visible); }
}

void TreeWidgetWarp::onItemExpanded(QTreeWidgetItem* item) {
  bool is_root = item->data(0, Qt::UserRole).toBool();
  if (is_root) {
    TreeHistroyNodeItem* histroy_node =
        static_cast<TreeHistroyNodeItem*>(itemWidget(item, 0));
    if (histroy_node) {
      histroy_node->setExpanded(true);
    }
  }
}

void TreeWidgetWarp::onItemCollapsed(QTreeWidgetItem* item) {
  bool is_root = item->data(0, Qt::UserRole).toBool();
  if (is_root) {
    TreeHistroyNodeItem* histroy_node =
        static_cast<TreeHistroyNodeItem*>(itemWidget(item, 0));
    if (histroy_node) {
      histroy_node->setExpanded(false);
    }
  }
}

void TreeWidgetWarp::onItemDBClicked(QTreeWidgetItem* item, int column) {
  bool is_root = item->data(0, Qt::UserRole).toBool();
  if (!is_root) {
    emit sigSubItemDBClicked(item);
  }
}

void TreeWidgetWarp::onItemClicked(QTreeWidgetItem* item, int column) {
  bool is_root = item->data(0, Qt::UserRole).toBool();
  if (is_root) {
    item->setExpanded(!item->isExpanded());
  } else {
    emit sigSubItemClicked(item);
  }
}

TreeHistroyNodeItem::TreeHistroyNodeItem(int level, QWidget* parent) {
  level_ = level;
  indentation_ = new QSpacerItem(level_ * kIndentation, 1, QSizePolicy::Fixed,
                                 QSizePolicy::Fixed);
  lbl_logo_ = new QLabel(this);
  lbl_logo_->setFixedSize(16, 16);
  lbl_logo_->setStyleSheet("background:transparent;");
  lbl_text_ = new QLabel(this);
  lbl_text_->setStyleSheet("background:transparent;");
  lbl_date_ = new QLabel(this);
  lbl_date_->setStyleSheet("background:transparent;");
  layout_ = new QGridLayout(this);
  layout_->setContentsMargins(20, 10, 40, 10);
  layout_->addItem(indentation_, 0, 0);
  layout_->addWidget(lbl_logo_, 0, 1);
  layout_->addWidget(lbl_text_, 0, 2);
  layout_->addWidget(lbl_date_, 0, 3, Qt::AlignRight);
  this->setLayout(layout_);
}

void TreeHistroyNodeItem::setLogoQss(const QString& qss) {
  logo_qss_ = qss;
  setExpanded(is_expanded_);
}

void TreeHistroyNodeItem::setLogoExpandedQss(const QString& qss) {
  logo_expanded_qss_ = qss;
  setExpanded(is_expanded_);
}

void TreeHistroyNodeItem::setText(const QString& text) {
  lbl_text_->setText(text);
}

void TreeHistroyNodeItem::setDate(const QString& text) {
  lbl_date_->setText(text);
}

void TreeHistroyNodeItem::setExpanded(bool isExpanded) {
  is_expanded_ = isExpanded;
  if (is_expanded_) {
    lbl_logo_->setStyleSheet(logo_expanded_qss_);
  } else {
    lbl_logo_->setStyleSheet(logo_qss_);
  }
}

void TreeHistroyNodeItem::paintEvent(QPaintEvent* e) {
  QStyleOption opt;
  opt.init(this);
  QPainter p(this);
  style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
  QWidget::paintEvent(e);
}

void TreeHistroyNodeItem::enterEvent(QEvent*) {
  this->setStyleSheet("background:#394254;");
}

void TreeHistroyNodeItem::leaveEvent(QEvent*) {
  this->setStyleSheet("background:transparent;");
}

TreeHistroyLeaveItem::TreeHistroyLeaveItem(int level, QWidget* parent)
    : QWidget(parent) {
  level_ = level;
  indentation_ = new QSpacerItem(level_ * kIndentation, 0, QSizePolicy::Fixed,
                                 QSizePolicy::Fixed);
  lbl_date_ = new QLabel(this);
  lbl_date_->setStyleSheet("background:transparent;");
  btn_delete_.reset(new QPushButton);
  btn_delete_->setFixedSize(16, 16);
  btn_delete_->setStyleSheet("background:transparent;");
  placeholder_widget_ = new QWidget(this);
  placeholder_widget_->setFixedSize(16, 16);
  placeholder_widget_->setStyleSheet("background:transparent;");

  layout_ = new QGridLayout(this);
  layout_->setContentsMargins(20, 9, 9, 12);
  layout_->addItem(indentation_, 0, 0);
  layout_->addWidget(lbl_date_, 0, 1);
  showBtn(false);
  setLayout(layout_);
  connect(btn_delete_.get(), &QPushButton::clicked, this,
          [=] { emit sigButtonclicked(); });
}

void TreeHistroyLeaveItem::setDate(const QString& text) {
  lbl_date_->setText(text);
}

void TreeHistroyLeaveItem::setBtnVisible(bool visible) {
  showBtn(false);
  is_btn_visiable_ = visible;
}

void TreeHistroyLeaveItem::setBtnEnabled(bool enabled) {
  is_btn_enabled_ = enabled;
  btn_delete_->setEnabled(enabled);
}

void TreeHistroyLeaveItem::setBtnQss(const QString& qss) {
  btn_delete_->setStyleSheet(qss);
}

void TreeHistroyLeaveItem::showBtn(bool isShow) {
  if (!is_btn_visiable_)
    return;
  is_btn_show_ = isShow;
  if (is_btn_show_) {
    layout_->removeWidget(placeholder_widget_);
    layout_->addWidget(btn_delete_.get(), 0, 2);
    btn_delete_->show();
  } else {
    layout_->removeWidget(btn_delete_.get());
    layout_->addWidget(placeholder_widget_, 0, 2);
    btn_delete_->hide();
  }
}

void TreeHistroyLeaveItem::paintEvent(QPaintEvent* e) {
  QStyleOption opt;
  opt.init(this);
  QPainter p(this);
  style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
  QWidget::paintEvent(e);
}

void TreeHistroyLeaveItem::enterEvent(QEvent*) {
  this->setStyleSheet("background:#394254;");
  showBtn(true);
}

void TreeHistroyLeaveItem::leaveEvent(QEvent*) {
  this->setStyleSheet("background:transparent;");
  showBtn(false);
}
