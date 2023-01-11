#include "platform_view.h"
#include <set>
#include <QVBoxLayout>
#include <QLabel>
#include <QTimer>

static const char *kListStyle =
	"QListWidget {"
	"	border: none;"
	"	background: #272E3B;"
	"}"
	"QScrollBar:horizontal {"
	"	border: none;"
	"	background: rgba(0, 0, 0, 0);"
	"	height: 4px;"
	"}"
	"QScrollBar::handle:horizontal {"
	"	border-radius: 2px;"
	"	background: #4E5969;"
	"}"
	"QScrollBar::sub-line:horizontal {"
	"	border: none;"
	"	background: none;"
	"}"
	"QScrollBar::sub-page:horizontal {"
	"	border: none;"
	"	background: none;"
	"}"
	"QScrollBar::add-line:horizontal {"
	"	border: none;"
	"	background: none;"
	"}"
	"QScrollBar::add-page:horizontal {"
	"	border: none;"
	"	background: none;"
	"}";

namespace vrd
{
	PlatformView::PlatformView(QWidget* parent) 
		: QFrame(parent)
		, presenter_(new PlatformPresenter(this, this))
	{
		this->width_limit_ = 0;
		this->is_expanded_ = true;
		this->is_applied_ = false;
		this->is_speaking_ = false;
		this->click_key_ = 0;

		this->setStyleSheet("vrd--PlatformView { border-radius: 8px; background-color: #272E3B; width: 202px; height: 208px; } * { background: none; }");

		QVBoxLayout* main_layout = new QVBoxLayout();
		main_layout->setContentsMargins(14, 0, 14, 16);
		main_layout->setSpacing(0);

		this->btn_expand_ = new QPushButton();
		this->btn_expand_->setFlat(true);
		this->btn_expand_->setFixedSize(QSize(20, 20));
		this->btn_expand_->setStyleSheet("border-radius: 8px; background-color: #272E3B;");
		this->btn_expand_->setIcon(QIcon(":/img/image/fold_btn.png"));
		this->btn_expand_->setIconSize(QSize(16, 5));
		main_layout->addWidget(this->btn_expand_, 0, Qt::AlignHCenter);

		main_layout->addSpacing(4);

		this->wdt_stacked_ = new QStackedWidget();
		this->wdt_stacked_->setFixedHeight(128);
		QWidget *nobody_widget = new QWidget();
		QVBoxLayout *nobody_layout = new QVBoxLayout(nobody_widget);
		nobody_layout->setContentsMargins(2, 0, 2, 8);

		QLabel *nobody_label = new QLabel();
		nobody_label->resize(170, 120);
		nobody_label->setStyleSheet("border-image: url(:/img/image/nobody_tip.png);");
		nobody_layout->addWidget(nobody_label);
		this->wdt_stacked_->addWidget(nobody_widget);

		this->lst_speaker_ = new QListWidget();
		this->lst_speaker_->setViewMode(QListView::IconMode);
		this->lst_speaker_->setWrapping(false);
		this->lst_speaker_->setMovement(QListView::Static);
		this->lst_speaker_->setSelectionMode(QAbstractItemView::NoSelection);
		this->lst_speaker_->setHorizontalScrollMode(QListView::ScrollPerPixel);
		this->lst_speaker_->setStyleSheet(kListStyle);
		this->lst_speaker_->resize(174, 128);
		this->wdt_stacked_->addWidget(this->lst_speaker_);
		main_layout->addWidget(this->wdt_stacked_);

		main_layout->addStretch();

		this->btn_apply_ = new QPushButton("我要举手");
		this->btn_apply_->setFlat(true);
		this->btn_apply_->setFixedSize(80, 32);
		this->btn_apply_->setStyleSheet("border-radius: 16px; background-color: #4080FF; font: 12px \"微软雅黑\"; color: #FFFFFF;");
		main_layout->addWidget(this->btn_apply_, 0, Qt::AlignHCenter);

		this->setLayout(main_layout);

		connect(this->btn_expand_, &QPushButton::clicked, this, &PlatformView::onExpandClicked);
		connect(this->btn_apply_, &QPushButton::clicked, this, &PlatformView::onApplyClicked);

		this->presenter_->init();
	}

	void PlatformView::setSpeakers(const std::list<std::unique_ptr<Student>> &list)
	{
		std::set<std::string> new_user_ids;
		std::set<std::string> old_user_ids;

		for (auto cit = list.cbegin(); cit != list.cend(); ++cit)
		{
			new_user_ids.emplace((*cit)->user_id);
		}

		int video_count = lst_speaker_->count();
		for (int i = 0; i < video_count; ++i)
		{
			QListWidgetItem *list_ltem = lst_speaker_->item(i);
			std::string old_user_id = std::string(list_ltem->data(Qt::UserRole).value<QString>().toUtf8());

			if (new_user_ids.find(old_user_id) == new_user_ids.cend())
			{
				ClassmateVideo *video = qobject_cast<ClassmateVideo*>(lst_speaker_->itemWidget(list_ltem));
				video->clean();

				lst_speaker_->removeItemWidget(list_ltem);
				list_ltem->setHidden(true);
				delete list_ltem;
				list_ltem = nullptr;
				--video_count;
				--i;
			}
			else
			{
				old_user_ids.emplace(old_user_id);
			}
		}

		for (auto cit = list.cbegin(); cit != list.cend(); ++cit)
		{
			Student *speaker = (*cit).get();
			if (old_user_ids.find(speaker->user_id) == old_user_ids.cend())
			{
				ClassmateVideo *video = new ClassmateVideo(presenter_);
				video->init(speaker->user_id, presenter_->isMyself(speaker->user_id), speaker->user_name);

				QListWidgetItem *list_item = new QListWidgetItem();
				list_item->setFlags(Qt::NoItemFlags);
				list_item->setData(Qt::UserRole, QString::fromStdString(speaker->user_id));
				list_item->setSizeHint(video->sizeHint());

				lst_speaker_->insertItem(video_count++, list_item);
				lst_speaker_->setItemWidget(list_item, video);
			}
		}

		bool has_myself = false;
		bool to_expand = false;
		for (auto cit = new_user_ids.begin(); cit != new_user_ids.cend(); ++cit)
		{
			if (presenter_->isMyself(*cit))
			{
				has_myself = true;
				break;
			}
		}
		if (is_speaking_ != has_myself)
		{
			is_speaking_ = has_myself;
			to_expand = is_speaking_;

			if (!is_speaking_)
			{
				setApplied(false);
			}
		}

		if (is_expanded_)
		{
			int item_count = lst_speaker_->count();
			if (0 == item_count)
			{
				wdt_stacked_->setCurrentIndex(0);
			}
			else
			{
				wdt_stacked_->setCurrentIndex(1);
			}

			btn_apply_->setVisible(!is_speaking_);

			resizeWithLimit();
		}
		else
		{
			if (to_expand)
			{
				onExpandClicked();
			}
		}
	}

	void PlatformView::onVideoAdd(const std::string &user_id)
	{
		ClassmateVideo *video = getClassmateVideo(user_id);
		if (video != nullptr)
		{
			video->onVideoAdd();
		}
	}

	void PlatformView::onVideoRemove(const std::string &user_id)
	{
		ClassmateVideo *video = getClassmateVideo(user_id);
		if (video != nullptr)
		{
			video->onVideoRemove();
		}
	}

	void PlatformView::onApplyChanged(bool applied)
	{
		setApplied(applied);
	}

	void PlatformView::setWidthLimit(int width)
	{
		if (width > 0)
		{
			width_limit_ = width;

			resizeWithLimit();
		}
	}

	bool PlatformView::getExpandState()
	{
		return is_expanded_;
	}

	void PlatformView::onExpandClicked()
	{
		if (is_expanded_)
		{
			is_expanded_ = false;

			layout()->setContentsMargins(0, 0, 0, 0);
			btn_expand_->setFixedSize(240, 20);
			btn_expand_->setIcon(QIcon(":/img/image/expand_btn.png"));
			wdt_stacked_->hide();
			btn_apply_->hide();
		}
		else
		{
			is_expanded_ = true;

			layout()->setContentsMargins(14, 0, 14, 16);
			btn_expand_->setFixedSize(20, 20);
			btn_expand_->setIcon(QIcon(":/img/image/fold_btn.png"));
			wdt_stacked_->show();

			int item_count = lst_speaker_->count();
			if (0 == item_count)
			{
				wdt_stacked_->setCurrentIndex(0);
			}
			else
			{
				wdt_stacked_->setCurrentIndex(1);
			}

			if (!is_speaking_)
			{
				btn_apply_->show();
			}
		}

		resizeWithLimit();

		emit sigExpandStateChanged(is_expanded_);
	}

	void PlatformView::onApplyClicked()
	{
		int key = ++click_key_;
		btn_apply_->setEnabled(false);

		QTimer::singleShot(3 * 1000, this, [this, key]()
			{
				if (key == click_key_)
				{
					btn_apply_->setEnabled(true);
				}
			}
		);
		presenter_->apply(is_applied_);
	}

	void PlatformView::resizeWithLimit()
	{
		if (is_expanded_)
		{
			int item_count = lst_speaker_->count();
			int width = (item_count > 0 ? item_count : 1) * 174 + 28;

			if (width_limit_ > 0)
			{
				width = qMin(width, width_limit_);
			}
			
			resize(width, 208);

		}
		else
		{
			int width = 240;

			if (width_limit_ > 0)
			{
				width = qMin(width, width_limit_);
			}

			resize(width, 20);
		}
	}

	void PlatformView::setApplied(bool applied)
	{
		if (is_applied_ != applied)
		{
			is_applied_ = applied;

			btn_apply_->setEnabled(true);

			if (is_applied_)
			{
				btn_apply_->setText("取消举手");
				btn_apply_->setStyleSheet("border-radius: 16px; background-color: rgba(255, 255, 255, 0.1); font: 12px \"微软雅黑\"; color: #FFFFFF;");
			}
			else
			{
				btn_apply_->setText("我要举手");
				btn_apply_->setStyleSheet("border-radius: 16px; background-color: #4080FF; font: 12px \"微软雅黑\"; color: #FFFFFF;");
			}
		}
	}

	ClassmateVideo *PlatformView::getClassmateVideo(const std::string &user_id)
	{
		int video_count = lst_speaker_->count();
		for (int i = 0; i < video_count; ++i)
		{
			QListWidgetItem *list_item = lst_speaker_->item(i);
			if (std::string(list_item->data(Qt::UserRole).value<QString>().toUtf8()) == user_id)
			{
				return qobject_cast<ClassmateVideo*>(lst_speaker_->itemWidget(list_item));
			}
		}

		return nullptr;
	}

	void PlatformView::closeEvent(QCloseEvent *evt)
	{
		int video_count = lst_speaker_->count();
		for (int i = 0; i < video_count; ++i)
		{
			QListWidgetItem *list_item = lst_speaker_->item(i);
			ClassmateVideo *video = qobject_cast<ClassmateVideo*>(lst_speaker_->itemWidget(list_item));
			video->clean();
		}

		presenter_->speechEnd();
		evt->accept();
	}
}
