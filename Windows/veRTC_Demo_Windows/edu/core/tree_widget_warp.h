#ifndef TREEWIDGETWARP_H
#define TREEWIDGETWARP_H

#include <QHBoxLayout>
#include <QLabel>
#include <QPushButton>
#include <QTreeWidget>
#include <memory>
#include <tuple>
#include <mutex>
#include "edu/core/data_mgr.h"

class TreeHistroyNodeItem : public QWidget {
	Q_OBJECT
	static constexpr int kIndentation = 20;

public:
	TreeHistroyNodeItem(int level, QWidget* parent = nullptr);
	void setLogoQss(const QString& qss);
	void setLogoExpandedQss(const QString& qss);
	void setText(const QString& text);
	void setDate(const QString& text);
	void setExpanded(bool isExpanded);

protected:
	void paintEvent(QPaintEvent*) override;
	void enterEvent(QEvent*) override;
	void leaveEvent(QEvent*) override;

private:
	QGridLayout* layout_ = nullptr;
	QLabel* lbl_logo_ = nullptr;  // indicator
	QLabel* lbl_text_ = nullptr;  // text
	QLabel* lbl_date_ = nullptr;
	QSpacerItem* indentation_ = nullptr;
	QString logo_qss_;
	QString logo_expanded_qss_;
	bool is_expanded_ = false;
	int level_ = 0;
};

class TreeHistroyLeaveItem : public QWidget {
	Q_OBJECT

	static constexpr int kIndentation = 20;

public:
	TreeHistroyLeaveItem(int level, QWidget* parent = nullptr);
	void setDate(const QString& text);
	void setBtnVisible(bool visible);
	void setBtnEnabled(bool enabled);
	void setBtnQss(const QString& qss);
	void showBtn(bool isShow);

protected:
	void paintEvent(QPaintEvent*) override;
	void enterEvent(QEvent*) override;
	void leaveEvent(QEvent*) override;

signals:
	void sigButtonclicked();

private:
	QGridLayout* layout_ = nullptr;
	QLabel* lbl_date_ = nullptr;
	std::unique_ptr<QPushButton> btn_delete_;
	bool is_btn_visiable_ = true;
	bool is_btn_enabled_ = true;
	bool is_btn_show_ = false;
	QWidget* placeholder_widget_ = nullptr;
	QSpacerItem* indentation_ = nullptr;
	int level_ = 0;
};

class TreeWidgetWarp : public QTreeWidget {
	Q_OBJECT

public:
	explicit TreeWidgetWarp(QWidget* parent = nullptr);

	void addTreeHistroyItem(const Edu::ClassRoom& room,
		const Edu::HistoryRecordList& record_list);
	void removeItem(QTreeWidgetItem* item);
	void setItemBtnVisible(bool visible);
	void removeAll();
	void setItemEnabled(QTreeWidgetItem* item, bool enabled);
signals:
	void sigSubItemButtonClicked(QTreeWidgetItem* item);
	void sigSubItemDBClicked(QTreeWidgetItem* item);
	void sigSubItemClicked(QTreeWidgetItem* item);
public slots:
	void onItemSelectionChanged();
	void onItemExpanded(QTreeWidgetItem* item);
	void onItemCollapsed(QTreeWidgetItem* item);
	void onItemDBClicked(QTreeWidgetItem* item, int column);
	void onItemClicked(QTreeWidgetItem* item, int column);

private:
	QList<TreeHistroyLeaveItem*> list_leaves_;
	bool visible_ = true;
	QTreeWidgetItem* old_select_ = nullptr;
	QTreeWidgetItem* cur_select_ = nullptr;
};

#endif  // TREEWIDGETWARP_H
