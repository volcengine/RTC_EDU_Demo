#ifndef VRD_PLATFORMVIEW_H
#define VRD_PLATFORMVIEW_H

#include <QFrame>
#include <QPushButton>
#include <QStackedWidget>
#include <QListWidget>
#include <QCloseEvent>
#include "platform_presenter.h"
#include "classmate_video.h"

namespace vrd
{
	class PlatformView : public QFrame, public IPlatformView
	{
		Q_OBJECT

	public:
		PlatformView(QWidget* parent = nullptr);

	public:
		void setSpeakers(const std::list<std::unique_ptr<Student>> &list) override;

		void onVideoAdd(const std::string &user_id) override;
		void onVideoRemove(const std::string &user_id) override;

		void onApplyChanged(bool applied) override;

		void setWidthLimit(int width);

	public:
		bool getExpandState();

	signals:
		void sigExpandStateChanged(bool expanded);

	private slots:
		void onExpandClicked();
		void onApplyClicked();

	private:
		void setApplied(bool applied);
		void resizeWithLimit();
		ClassmateVideo *getClassmateVideo(const std::string &user_id);

	private:
		void closeEvent(QCloseEvent *evt) override;

	private:
		QPushButton *btn_expand_;
		QStackedWidget *wdt_stacked_;
		QListWidget *lst_speaker_;
		QPushButton *btn_apply_;

		int width_limit_;
		bool is_expanded_;
		bool is_applied_;
		bool is_speaking_;
		int click_key_;

		PlatformPresenter *presenter_;
	};
}

#endif // CPLATFORMVIEW_H
