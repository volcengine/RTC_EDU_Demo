#pragma once

#include "ui_username_login.h"
#include <QWidget>
#include <vector>

class SceneSelectWidget;

class UserNameLogin : public QWidget {
    Q_OBJECT

public:
    UserNameLogin(QWidget* parent = Q_NULLPTR);
    ~UserNameLogin() = default;
    void checkSaveData();

public slots:
	void loginBtnClicked();
	void checkUserName(QString str);

protected:
	void closeEvent(QCloseEvent*) override;

private:
	void initViews();
	void initData();
	void initConnects();
	void verifyUserName(const QString& userName);
	void _goMainWidget();

private:
	bool username_short_error_;
	std::vector<QTimer*> timers_;
	Ui::UserNameLogin ui;
};
