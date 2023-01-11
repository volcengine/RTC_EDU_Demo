#include "group_view.h"
#include <set>

static const char *kListStyle =
	"vrd--GroupView {"
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
	GroupView::GroupView(QWidget* parent)
		: QListWidget(parent)
		, presenter_(new GroupPresenter(this, this))
	{
		this->setSelectionMode(QAbstractItemView::NoSelection);
		this->setVerticalScrollMode(QListView::ScrollPerPixel);
		this->setStyleSheet(kListStyle);

		this->lbl_title_ = new QLabel();
		this->lbl_title_->setFixedHeight(50);
		this->lbl_title_->setContentsMargins(16, 0, 16, 0);
		this->lbl_title_->setAlignment(Qt::AlignCenter);
		this->lbl_title_->setStyleSheet("font: 500 16px \"微软雅黑\"; color: #FFFFFF;");

		QListWidgetItem *list_item = new QListWidgetItem();
		list_item->setSizeHint(this->lbl_title_->sizeHint());
		list_item->setFlags(Qt::NoItemFlags);
		this->addItem(list_item);
		this->setItemWidget(list_item, this->lbl_title_);

		this->presenter_->init();
	}

	void GroupView::setGroupIndex(int64_t index)
	{
		lbl_title_->setText(QString::asprintf("第 %d 组", (int)(index + 1)));
	}

	void GroupView::setClassmates(const std::list<std::unique_ptr<Student>> &classmates, const std::list<std::unique_ptr<Student>> &speakers, bool discuss)
	{
		std::set<std::string> speaker_ids;
		if (!discuss)
		{
			for (auto cit = speakers.cbegin(); cit != speakers.cend(); ++cit)
			{
				speaker_ids.emplace((*cit)->user_id);
			}
		}

		std::set<std::string> new_user_ids;
		std::set<std::string> old_user_ids;

		for (auto cit = classmates.cbegin(); cit != classmates.cend(); ++cit)
		{
			new_user_ids.emplace((*cit)->user_id);
		}

		int video_count = count();
		for (int i = kTitleCount; i < video_count; ++i)
		{
			QListWidgetItem *list_item = item(i);
			std::string old_user_id = std::string(list_item->data(Qt::UserRole).value<QString>().toUtf8());
			GroupVideo *video = qobject_cast<GroupVideo*>(itemWidget(list_item));

			if (new_user_ids.find(old_user_id) == new_user_ids.cend())
			{
				video->clean();

				removeItemWidget(list_item);
				list_item->setHidden(true);
				delete list_item, list_item = nullptr;
				--video_count, --i;
			}
			else
			{
				old_user_ids.emplace(old_user_id);

				if (discuss)
				{
					video->setState(GroupVideo::VideoState::kDiscussing);
				}
				else
				{
					if (speaker_ids.find(old_user_id) != speaker_ids.cend())
					{
						video->setState(GroupVideo::VideoState::kSpeaking);
					}
					else
					{
						video->setState(GroupVideo::VideoState::kNormal);
					}
				}
			}
		}

		for (auto cit = classmates.cbegin(); cit != classmates.cend(); ++cit)
		{
			Student *classmate = (*cit).get();
			if (old_user_ids.find(classmate->user_id) == old_user_ids.cend())
			{
				GroupVideo *video = new GroupVideo(presenter_);
				video->init(classmate->user_id, presenter_->isMyself(classmate->user_id), classmate->user_name, 
					(discuss ? GroupVideo::VideoState::kDiscussing : (speaker_ids.find(classmate->user_id) != speaker_ids.cend() ? GroupVideo::VideoState::kSpeaking : GroupVideo::VideoState::kNormal)));

				QListWidgetItem *list_item = new QListWidgetItem();
				list_item->setFlags(Qt::NoItemFlags);
				list_item->setData(Qt::UserRole, QString::fromStdString(classmate->user_id));
				list_item->setSizeHint(video->sizeHint());

				insertItem(video_count++, list_item);
				setItemWidget(list_item, video);
			}
		}
	}

	void GroupView::markSpeakers(const std::list<std::unique_ptr<Student>> &list)
	{
		std::set<std::string> speaker_ids;
		for (auto cit = list.cbegin(); cit != list.cend(); ++cit)
		{
			speaker_ids.emplace((*cit)->user_id);
		}

		int video_count = count();
		for (int i = kTitleCount; i < video_count; ++i)
		{
			QListWidgetItem *list_item = item(i);
			std::string user_id = std::string(list_item->data(Qt::UserRole).value<QString>().toUtf8());
			GroupVideo *video = qobject_cast<GroupVideo*>(itemWidget(list_item));

			if (speaker_ids.find(user_id) != speaker_ids.cend())
			{
				video->setState(GroupVideo::VideoState::kSpeaking);
			}
			else
			{
				video->setState(GroupVideo::VideoState::kNormal);
			}
		}
	}

	void GroupView::markDiscussing(bool discuss)
	{
		int video_count = count();
		for (int i = kTitleCount; i < video_count; ++i)
		{
			QListWidgetItem *list_item = item(i);
			std::string user_id = std::string(list_item->data(Qt::UserRole).value<QString>().toUtf8());
			GroupVideo *video = qobject_cast<GroupVideo*>(itemWidget(list_item));

			if (discuss)
			{
				video->setState(GroupVideo::VideoState::kDiscussing);
			}
			else
			{
				video->setState(GroupVideo::VideoState::kNormal);
			}
		}
	}

	void GroupView::onVideoAdd(const std::string &user_id)
	{
		GroupVideo *video = getGroupVideo(user_id);
		if (video != nullptr)
		{
			video->onVideoAdd();
		}
	}

	void GroupView::onVideoRemove(const std::string &user_id)
	{
		GroupVideo *video = getGroupVideo(user_id);
		if (video != nullptr)
		{
			video->onVideoRemove();
		}
	}

	GroupVideo *GroupView::getGroupVideo(const std::string &user_id)
	{
		int video_count = count();
		for (int i = kTitleCount; i < video_count; ++i)
		{
			QListWidgetItem *list_item = item(i);
			if (std::string(list_item->data(Qt::UserRole).value<QString>().toUtf8()) == user_id)
			{
				return qobject_cast<GroupVideo*>(itemWidget(list_item));
			}
		}

		return nullptr;
	}
}
