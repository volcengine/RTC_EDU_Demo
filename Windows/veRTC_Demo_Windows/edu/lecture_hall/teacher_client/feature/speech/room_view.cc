#include "room_view.h"
#include <set>

static const char *kListStyle = 
	"vrd--RoomView {"
	"	border-radius: 2px;"
	"	background: #272E3B;"
	"	width: 272px;"
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
	RoomView::RoomView(QWidget* parent)
		: QListWidget(parent)
		, video_count_(0)
		, presenter_(new RoomPresenter(this, this))
	{
		this->setSelectionMode(QAbstractItemView::NoSelection);
		this->setVerticalScrollMode(QListView::ScrollPerPixel);
		this->setStyleSheet(kListStyle);

		this->lbl_title_ = new QLabel("举手列表（0）");
		this->lbl_title_->setFixedHeight(50);
		this->lbl_title_->setContentsMargins(16, 0, 16, 0);
		this->lbl_title_->setStyleSheet("font: 500 16px \"微软雅黑\"; color: #FFFFFF;");

		QListWidgetItem *list_item = new QListWidgetItem();
		list_item->setFlags(Qt::NoItemFlags);
		list_item->setSizeHint(this->lbl_title_->sizeHint());
		this->addItem(list_item);
		this->setItemWidget(list_item, this->lbl_title_);

		this->presenter_->init();
	}

	void RoomView::setApplicants(const std::list<std::unique_ptr<Applicant>> &list)
	{
		setTitleLabel(list.size());

		int index = video_count_ + kTitleCount;

		for (auto cit = list.cbegin(); cit != list.cend(); ++cit, ++index)
		{
			Applicant *applicant = (*cit).get();

			if (index < count())
			{
				QListWidgetItem *list_item = item(index);
				AppliedStudent *student = qobject_cast<AppliedStudent*>(itemWidget(list_item));
				student->setUserId(applicant->user_id);
				student->setUserName(applicant->user_name);
				student->setMicrophoneMute(applicant->is_mute);
			}
			else
			{
				AppliedStudent *student = new AppliedStudent(presenter_);
				student->setUserId(applicant->user_id);
				student->setUserName(applicant->user_name);
				student->setMicrophoneMute(applicant->is_mute);

				QListWidgetItem *list_item = new QListWidgetItem();
				list_item->setFlags(Qt::NoItemFlags);
				list_item->setSizeHint(student->sizeHint());

				addItem(list_item);
				setItemWidget(list_item, student);
			}
		}

		for (int m = (count() - 1); m >= index; --m)
		{
			QListWidgetItem *list_item = takeItem(m);
			delete list_item, list_item = nullptr;
		}
	}

	void RoomView::setSpeakers(const std::list<std::unique_ptr<Student>> &list)
	{
		std::set<std::string> new_user_ids;
		std::set<std::string> old_user_ids;

		for (auto cit = list.cbegin(); cit != list.cend(); ++cit)
		{
			new_user_ids.emplace((*cit)->user_id);
		}

		for (int i = 0; i < video_count_; ++i)
		{
			QListWidgetItem *list_item = item(i);
			std::string old_user_id = list_item->data(Qt::UserRole).value<QString>().toUtf8();

			if (new_user_ids.find(old_user_id) == new_user_ids.cend())
			{
				StudentVideo *video = qobject_cast<StudentVideo*>(itemWidget(list_item));
				video->clean();

				removeItemWidget(list_item);
				delete list_item, list_item = nullptr;
				--video_count_, --i;
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
				StudentVideo *video = new StudentVideo(presenter_);
				video->init(speaker->user_id, speaker->user_name);

				QListWidgetItem *list_item = new QListWidgetItem();
				list_item->setFlags(Qt::NoItemFlags);
				list_item->setData(Qt::UserRole, speaker->user_id.c_str());
				list_item->setSizeHint(video->sizeHint());

				insertItem(video_count_++, list_item);
				setItemWidget(list_item, video);
			}
		}
	}

	void RoomView::onVideoAdd(const std::string &user_id)
	{
		StudentVideo *video = getStudentVideo(user_id);
		if (video != nullptr)
		{
			video->onVideoAdd();
		}
	}

	void RoomView::onVideoRemove(const std::string &user_id)
	{
		StudentVideo *video = getStudentVideo(user_id);
		if (video != nullptr)
		{
			video->onVideoRemove();
		}
	}

	void RoomView::setTitleLabel(int number)
	{
		lbl_title_->setText(QString::asprintf("举手列表（%d）", number));
	}

	StudentVideo *RoomView::getStudentVideo(const std::string &user_id)
	{
		for (int i = 0; i < video_count_; ++i)
		{
			QListWidgetItem *list_item = item(i);
			if (std::string(list_item->data(Qt::UserRole).value<QString>().toUtf8()) == user_id)
			{
				return qobject_cast<StudentVideo*>(itemWidget(list_item));
			}
		}

		return nullptr;
	}
}
