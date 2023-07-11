#pragma once
#include <QHboxLayout>
#include <QLabel>
#include <QWidget>

#include "push_button_warp.h"

class MenuWarp;
/** {zh}
 * 主页面顶部栏，主要包括设置菜单和一些子菜单项
 */

 /** {en}
  * The top bar of the main page, including the settings menu and some submenu items
  */
class TopBarWidget : public QWidget {
    Q_OBJECT

public:
    explicit TopBarWidget(QWidget* parent = nullptr);
    QString userName();
    void setUserName(const QString& name);
    ~TopBarWidget();

private:
    void initContronls();
    void showEvent(QShowEvent* e) override;
    void paintEvent(QPaintEvent* e) override;

signals:
    void sigUserTriggered();
    void sigPrvServTriggered();
    void sigServProtoTriggerd();
    void sigDisclaimerTriggered();
    void sigQuitTriggered();

private:
    QAction* act_user_ = nullptr;
    QAction* act_prv_serv_ = nullptr;
    QAction* act_serv_proto_ = nullptr;
    QAction* act_disclaimer_ = nullptr;
    QAction* act_quit_ = nullptr;
    MenuWarp* menu_ = nullptr;
    QBrush* bg_brush_ = nullptr;
    QHBoxLayout* layout_ = nullptr;
    QLabel* lbl_titile_ = nullptr;
    QLabel* lbl_titile_logo_ = nullptr;
    QLabel* lbl_user_logo_ = nullptr;
    QLabel* lbl_user_ = nullptr;
    QLabel* lbl_setting_logo_ = nullptr;
    PushButtonWarp* lbl_setting_ = nullptr;
};