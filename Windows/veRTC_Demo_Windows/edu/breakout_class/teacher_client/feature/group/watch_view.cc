#include "watch_view.h"
#include <set>

static const char *kListStyle =
	"vrd--WatchView {"
	"	border-radius: 2px;"
	"	background: #272E3B;"
	"	width: 208px;"
	"}"
	"QScrollBar:vertical {"
	"	border: none;"
	"	background: rgba(0, 0, 0, 0);"
	"	width: 4px;"
	"}"
	"QScrollBar::handle:vertical {"
	"   border-radius: 2px;"
	"	background: #4E5969;"
	"}"
	"QScrollBar::sub-line:vertical {"
	"	border: none;"
	"	background: none;"
	"}"
	"QScrollBar::sub-page:vertical {"
	"	border: none;"
	"	background: none;"
	"}"
	"QScrollBar::add-line:vertical {"
	"	border: none;"
	"	background: none;"
	"}"
	"QScrollBar::add-page:vertical {"
	"	border: none;"
	"	background: none;"
	"}"
	"* {"
	"	background: none;"
	"}";

namespace vrd
{
	WatchView::WatchView(QWidget* parent)
		: QListWidget(parent)
		, presenter_(new WatchPresenter(this, this))
	{
		this->setSelectionMode(QAbstractItemView::NoSelection);
		this->setVerticalScrollMode(QListView::ScrollPerPixel);
		this->setStyleSheet(kListStyle);

		this->lbl_title_ = new QLabel("正在监督：");
		this->lbl_title_->setFixedHeight(50);
		this->lbl_title_->setContentsMargins(16, 0, 16, 0);
		this->lbl_title_->setStyleSheet("font: 500 16px \"微软雅黑\"; color: #FFFFFF;");

		QListWidgetItem *list_item = new QListWidgetItem();
		list_item->setSizeHint(this->lbl_title_->sizeHint());
		list_item->setFlags(Qt::NoItemFlags);
		this->addItem(list_item);
		this->setItemWidget(list_item, this->lbl_title_);

		this->presenter_->init();
	}

	void WatchView::setGroupIndex(int64_t index)
	{
		lbl_title_->setText(QString::asprintf("正在监督：第 %d 组", (int)(index + 1)));
	}

	void WatchView::setStudents(const std::list<std::unique_ptr<Student>> &list)
	{
		std::set<std::string> new_user_ids;
		std::set<std::string> old_user_ids;

		for (auto cit = list.cbegin(); cit != list.cend(); ++cit)
		{
			new_user_ids.emplace((*cit)->user_id);
		}

		int video_count = count();
		for (int i = kTitleCount; i < video_count; ++i)
		{
			QListWidgetItem *list_item = item(i);
			std::string old_user_id = list_item->data(Qt::UserRole).value<QString>().toUtf8();

			if (new_user_ids.find(old_user_id) == new_user_ids.cend())
			{
				WatchVideo *video = qobject_cast<WatchVideo*>(itemWidget(list_item));
				video->clean();

				removeItemWidget(list_item);
				delete list_item, list_item = nullptr;
				--video_count, --i;
			}
			else
			{
				old_user_ids.emplace(old_user_id);
			}
		}

		for (auto cit = list.cbegin(); cit != list.cend(); ++cit)
		{
			Student *student = (*cit).get();
			if (old_user_ids.find(student->user_id) == old_user_ids.cend())
			{
				WatchVideo *video = new WatchVideo(presenter_);
				video->init(student->user_id, student->user_name);

				QListWidgetItem *list_item = new QListWidgetItem();
				list_item->setFlags(Qt::NoItemFlags);
				list_item->setData(Qt::UserRole, student->user_id.c_str());
				list_item->setSizeHint(video->sizeHint());

				insertItem(video_count++, list_item);
				setItemWidget(list_item, video);
			}
		}
	}

	void WatchView::onVideoAdd(const std::string &user_id)
	{
		WatchVideo *video = getWatchVideo(user_id);
		if (video != nullptr)
		{
			video->onVideoAdd();
		}
	}

	void WatchView::onVideoRemove(const std::string &user_id)
	{
		WatchVideo *video = getWatchVideo(user_id);
		if (video != nullptr)
		{
			video->onVideoRemove();
		}
	}

	WatchVideo *WatchView::getWatchVideo(const std::string &user_id)
	{
		int video_count = count();
		for (int i = kTitleCount; i < video_count; ++i)
		{
			QListWidgetItem *list_item = item(i);
			if (std::string(list_item->data(Qt::UserRole).value<QString>().toUtf8()) == user_id)
			{
				return qobject_cast<WatchVideo*>(itemWidget(list_item));
			}
		}

		return nullptr;
	}
}
