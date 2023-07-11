#pragma once
#include <qtreewidget.h>

class QGridLayout;
class QLabel;
class QSpacerItem;
class OnLineItem;

typedef QMap<QString, QTreeWidgetItem*> Uid_Item_Map;
typedef QMap<QString, QTreeWidgetItem*>::iterator Uid_Item_Map_Iter;

class RootItemWidget : public QWidget
{
	Q_OBJECT

	static constexpr int kIndentation = 20;

public:
	explicit RootItemWidget(int level ,int room_index ,const QString& name, QWidget* parent = nullptr);
	void setLogoQss(const QString& qss);
	void setLogoExpandedQss(const QString& qss);
	void setExpanded(bool isExpanded);
	int room_index_;

private:
	QGridLayout* layout_{ nullptr };
	QLabel* lbl_logo_{ nullptr };
	QLabel* lbl_text_{ nullptr };
	QSpacerItem* indentation_{ nullptr };
	QString logo_qss_;
	QString logo_expanded_qss_;
	bool is_expanded_{ false };
	int level_{ 0 };
};



class TreeGroupWidget :
	public QTreeWidget
{
	Q_OBJECT
public:
	explicit TreeGroupWidget(QWidget* parent = nullptr);
	void addWidget(QWidget* widget, int w , int h);
	void addGroupNode(int groupName, const QList<std::pair<QString, QString>>& groupStudentNameList);
	void removeItem(const QString& user_id);

public Q_SLOTS:
	void onItemExpanded(QTreeWidgetItem* item);
	void onItemCollapsed(QTreeWidgetItem* item);
	void onClickTopItem();

private :
	Uid_Item_Map item_map_;

};


