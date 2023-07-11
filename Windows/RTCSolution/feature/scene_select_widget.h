#include "ui_scene_select.h"

/** {zh}
 * 场景选择主页面，包括场景按钮的初始化和 TopBarWidget
 */

 /** {en}
  * Scene selection main page, including initialization of scene buttons and TopBarWidget
  */
class SceneSelectWidget : public QWidget {
	Q_OBJECT
 public:
	explicit SceneSelectWidget(QWidget* parent = nullptr);
	~SceneSelectWidget();
	static SceneSelectWidget& instance();
	void resizeEvent(QResizeEvent* e);
	void closeEvent(QCloseEvent*);
	void enableMask(bool enabled);
	void updateUserName();
	QStackedWidget* getMainStackWidget();

 signals:
	void sigLogOut();
	void enterScene(QString sceneName);

 private:
	void initControls();
	void initConnects();
	void setupEduSceneButton();
	void setupMoreSceneButton();
	int scene_count_{ 0 };

 private:
	bool enabled_controls_;
	Ui::SceneSelectWidget ui;
	QWidget* mask_widget_{nullptr};
};