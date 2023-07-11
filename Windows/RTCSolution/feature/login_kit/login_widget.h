#pragma once

#include "ui_login.h"
#include <QWidget>
#include <vector>

class SceneSelectWidget;
/** {zh}
 * 登录页面类，完成用户登录操作
 */

/** {en}
* Login page class, complete user login operation
*/
class LoginWidget : public QWidget {
    Q_OBJECT

public:
    LoginWidget(QWidget* parent = Q_NULLPTR);
    ~LoginWidget() = default;
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
	Ui::LoginWidget ui;
};
