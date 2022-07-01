#include "TreeGroupWidget.h"
#include "OnLineItem.h"
#define MAXGROUPSIZE 35 

static int expandedArray[MAXGROUPSIZE]={0};
static QMap<int, QString> convert = { {0, "零"},{1, "一"}, {2, "二"}, {3, "三"}, {4, "四"}, {5, "五"}, {6, "六"}, {7, "七"}, {8, "八"}, {9, "九"}, {10, "十"}};

static QString getChineseNum(int num)
{
	if (num <= 10) 
	{
		return convert[num];
	}
	else 
	{
		int nTenDigit = num / 10;
		int nOneDigit = num % 10;
		QString strResult;
		if (nTenDigit > 1) 
		{
			strResult += convert[nTenDigit];
		}
		strResult += QString("十");
		if (nOneDigit > 0) 
		{
			strResult += convert[nOneDigit];
		}
		return strResult;
	}
}

RootItemWidget::RootItemWidget(int level,int romm_index, const QString& name, QWidget* parent)
	:QWidget(parent), room_index_(romm_index)
{
	level_ = level;
	indentation_ = new QSpacerItem(level_ * kIndentation, 1, QSizePolicy::Fixed, QSizePolicy::Fixed);

	lbl_logo_ = new QLabel;
	lbl_logo_->setFixedSize(16, 16);
	lbl_logo_->setStyleSheet("background:transparent;");
	lbl_text_ = new QLabel;
	lbl_text_->setText(name);
	lbl_text_->setStyleSheet(
		"background:transparent;"
		"font:14px;"
		"font-weight:500;"
		"color:#ffffff;"
		"font-family:\"Microsoft YaHei\";"
	);
	layout_ = new QGridLayout;
	layout_->setContentsMargins(20, 10, 40, 10);
	layout_->addItem(indentation_, 0, 0);
	layout_->addWidget(lbl_logo_, 0, 1);
	layout_->addWidget(lbl_text_, 0, 2);
	setLayout(layout_);
}

void RootItemWidget::setLogoQss(const QString& qss)
{
	logo_qss_ = qss;
	setExpanded(is_expanded_);
}

void RootItemWidget::setLogoExpandedQss(const QString& qss)
{
	logo_expanded_qss_ = qss;
	setExpanded(is_expanded_);
}

void RootItemWidget::setExpanded(bool isExpanded)
{
	is_expanded_ = isExpanded;
	if (is_expanded_) {
		lbl_logo_->setStyleSheet(logo_expanded_qss_);
	}
	else {
		lbl_logo_->setStyleSheet(logo_qss_);
	}
}


TreeGroupWidget::TreeGroupWidget(QWidget* parent)
	:QTreeWidget(parent)
{
	setHeaderHidden(true);
	setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
	setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
	setIndentation(0);
	setFocusPolicy(Qt::NoFocus);
	setExpandsOnDoubleClick(false);

	connect(this, &QTreeWidget::itemExpanded, this, &TreeGroupWidget::onItemExpanded);
	connect(this, &QTreeWidget::itemCollapsed, this, &TreeGroupWidget::onItemCollapsed);
}

void TreeGroupWidget::addWidget(QWidget* widget, int w, int h)
{
	auto item = new QTreeWidgetItem;
	item->setSizeHint(0, QSize(w, h));
	item->setData(0, Qt::UserRole, 1);
	this->addTopLevelItem(item);
	this->setItemWidget(item, 0, widget);
}


void  TreeGroupWidget::onClickTopItem()
{
	if (this->isExpanded(this->currentIndex())) {
		this->collapse(this->currentIndex());
	}
	else {
		this->setExpanded(this->currentIndex(), true);
	}
}

void TreeGroupWidget::addGroupNode(int room_index, const QList<std::pair<QString, QString>>& groupStudentNameList)
{
	auto chineseNum = getChineseNum(room_index + 1);
	auto groupName = "第" + chineseNum+ "组";

	disconnect(this, &QTreeWidget::clicked, this, &TreeGroupWidget::onClickTopItem);

	auto item = new QTreeWidgetItem;
	item->setData(0, Qt::UserRole, 1);
	auto widget = new RootItemWidget(0, room_index, groupName, this);
	widget->setLogoQss("background:gray;");
	widget->setLogoExpandedQss("background:white;");
	connect(this, &QTreeWidget::clicked,this, &TreeGroupWidget::onClickTopItem);

	this->addTopLevelItem(item);
	this->setItemWidget(item, 0, widget);
	widget->setLogoQss("background:transparent;background-image:url(:img/"
		"tree_down);background-position:center;background-repeat:"
		"no-repeat;");
	widget->setLogoExpandedQss("background:transparent;background-image:url(:img/"
		"tree_up);background-position:center;background-repeat:"
		"no-repeat;");


	if (expandedArray[room_index] == 1)
	{
		item->setExpanded(true);
	}


	for (auto& pair : groupStudentNameList)
	{
		auto childItem = new QTreeWidgetItem;
		childItem->setData(0, Qt::UserRole, 0);
		auto child = new OnLineItem;
		child->setStyleSheet("background:transparent;");
		child->setContentsMargins(40, 0, 0, 0);
		childItem->setSizeHint(0, QSize(272, 40));
		child->SetUserName(pair.second);
		item->addChild(childItem);
		this->setItemWidget(childItem, 0, child);
		item_map_[pair.first] = childItem;
	}

}

void TreeGroupWidget::removeItem(const QString& user_id)
{
	if (item_map_.find(user_id) != item_map_.end())
	{
		item_map_.remove(user_id);
		this->removeItemWidget(item_map_[user_id], 0);
	}
}


void TreeGroupWidget::onItemExpanded(QTreeWidgetItem* item)
{
	bool isRoot = item->data(0, Qt::UserRole).toBool();
	if (isRoot)
	{
		RootItemWidget* itemNode = dynamic_cast<RootItemWidget*>(itemWidget(item, 0));
		if (itemNode)
		{
			itemNode->setExpanded(true);
			expandedArray[itemNode->room_index_] = 1;
		}
	}
}

void TreeGroupWidget::onItemCollapsed(QTreeWidgetItem* item)
{
	bool isRoot = item->data(0, Qt::UserRole).toBool();
	if (isRoot)
	{
		RootItemWidget* itemNode = dynamic_cast<RootItemWidget*>(itemWidget(item, 0));
		if (itemNode)
		{
			itemNode->setExpanded(false);
			expandedArray[itemNode->room_index_] = 0;
		}
	}
}
