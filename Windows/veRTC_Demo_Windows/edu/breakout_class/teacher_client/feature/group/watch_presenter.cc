#include "watch_presenter.h"
#include "core/application.h"

namespace vrd
{
	WatchPresenter::WatchPresenter(QObject *parent, IWatchView *v)
		: QObject(parent)
		, view_(v)
		, group_list_key_(0)
		, group_students_key_(0)
		, groups_(new std::list<std::unique_ptr<Group>>())
	{
		data_mgr_ = VRD_FUNC_GET_COMPONET(vrd::BreakoutTeacherDataMgr);
	}

	WatchPresenter::~WatchPresenter()
	{
		data_mgr_->end();
	}

	void WatchPresenter::init()
	{
		data_mgr_->start();

		connect(data_mgr_->getEvent(), &BreakoutTeacherEvent::sigGroupListArrived, this, &WatchPresenter::onGroupListArrived);
		connect(data_mgr_->getEvent(), &BreakoutTeacherEvent::sigGroupStudentsArrived, this, &WatchPresenter::onGroupStudentsArrived);
		connect(data_mgr_->getEvent(), &BreakoutTeacherEvent::sigVideoAdd, this, &WatchPresenter::onVideoAdd);
		connect(data_mgr_->getEvent(), &BreakoutTeacherEvent::sigVideoRemove, this, &WatchPresenter::onVideoRemove);

		onNextCircle();
	}

	bool WatchPresenter::hasVideo(const std::string &user_id)
	{
		return data_mgr_->hasVideo(user_id);
	}

	void WatchPresenter::setVideoWindow(const std::string &user_id, WId wnd_id)
	{
		data_mgr_->setVideoWindow(user_id, (void*)wnd_id);
	}

	void WatchPresenter::onGroupListArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Group>>> &list)
	{
		if (key == group_list_key_)
		{
			group_list_key_ = 0;

			if (list)
			{
				groups_ = list;
			}
			else
			{
				groups_->clear();
			}

			if (!groups_->empty())
			{
				onNextGroup();
			}
			else
			{
				QTimer::singleShot(15 * 1000, this, &WatchPresenter::onNextCircle);
			}
		}
	}

	void WatchPresenter::onGroupStudentsArrived(int key, const std::shared_ptr<std::list<std::unique_ptr<Student>>> &list)
	{
		if (key == group_students_key_)
		{
			if (view_ != nullptr)
			{
				if (list)
				{
					view_->setStudents(*list);
				}
			}
		}
	}

	void WatchPresenter::onVideoAdd(const std::string &user_id)
	{
		if (nullptr != view_)
		{
			view_->onVideoAdd(user_id);
		}
	}

	void WatchPresenter::onVideoRemove(const std::string &user_id)
	{
		if (nullptr != view_)
		{
			view_->onVideoRemove(user_id);
		}
	}

	void WatchPresenter::onTimeout()
	{
		if (group_list_key_ != 0)
		{
			group_list_key_ = data_mgr_->getGroupList();

			QTimer::singleShot(10 * 1000, this, &WatchPresenter::onTimeout);
		}
	}

	void WatchPresenter::onNextGroup()
	{
		Group *group = nullptr;

		if (!groups_->empty())
		{
			group = groups_->front().get();
		}

		if (group != nullptr)
		{
			if (view_ != nullptr)
			{
				view_->setGroupIndex(group->group_index);
				view_->setStudents(std::list<std::unique_ptr<Student>>());
			}

			data_mgr_->nextGroupRoom(group->group_room_id, group->group_room_token);
			group_students_key_ = data_mgr_->getGroupStudents(group->group_room_id);

			group = nullptr;
			groups_->pop_front();

			QTimer::singleShot(15 * 1000, this, &WatchPresenter::onNextGroup);
		}
		else
		{
			group_students_key_ = 0;

			QTimer::singleShot(0, this, &WatchPresenter::onNextCircle);
		}
	}

	void WatchPresenter::onNextCircle()
	{
		group_list_key_ = data_mgr_->getGroupList();

		QTimer::singleShot(10 * 1000, this, &WatchPresenter::onTimeout);
	}
}
