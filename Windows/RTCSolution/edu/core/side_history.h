#pragma once
#include "ui_side_history.h"
#include "defination.h"

class SideHistory : public QWidget {
	Q_OBJECT

public:
	explicit SideHistory(QWidget* parent = nullptr);
	void updateData();
	void setUserRole(room_type::USER_ROLE role);
	void paintEvent(QPaintEvent* e);
signals:
	void sigCloseButtonClicked();
	void sigItemButtonClicked(int row);

private:
	Ui::SideHistoryWidget ui;
};