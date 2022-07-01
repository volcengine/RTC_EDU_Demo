#include "group_presenter.h"
#include "core/application.h"
#include "data_mgr.h"

namespace vrd
{
	GroupPresenter::GroupPresenter(QObject *parent, IGroupView *v)
		: QObject(parent)
		, view_(v)
	{
		data_mgr_ = VRD_FUNC_GET_COMPONET(vrd::BreakoutStudentDataMgr);
	}

	GroupPresenter::~GroupPresenter()
	{
		data_mgr_->end();
	}

	void GroupPresenter::init()
	{
		data_mgr_->start();

		connect(data_mgr_->getEvent(), &BreakoutStudentEvent::sigClassmatesChanged, this, &GroupPresenter::onClassmatesChanged);
		connect(data_mgr_->getEvent(), &BreakoutStudentEvent::sigSpeakersChanged4Mark, this, &GroupPresenter::onSpeakersChanged);
		connect(data_mgr_->getEvent(), &BreakoutStudentEvent::sigDiscussingChanged, this, &GroupPresenter::onDiscussingChanged);
		connect(data_mgr_->getEvent(), &BreakoutStudentEvent::sigVideoAdd, this, &GroupPresenter::onVideoAdd);
		connect(data_mgr_->getEvent(), &BreakoutStudentEvent::sigVideoRemove, this, &GroupPresenter::onVideoRemove);

		if (view_ != nullptr)
		{
			view_->setGroupIndex(data_mgr_->getGroupIndex());
		}

		data_mgr_->updateClassmates();
	}

	bool GroupPresenter::hasVideo(const std::string &user_id)
	{
		return data_mgr_->hasVideo(user_id);
	}

	void GroupPresenter::setVideoWindow(const std::string &user_id, WId wnd_id)
	{
		data_mgr_->setVideoWindow(user_id, (void*)wnd_id);
	}

	bool GroupPresenter::isMyself(const std::string &user_id)
	{
		return data_mgr_->isMyself(user_id);
	}

	void GroupPresenter::onClassmatesChanged()
	{
		if (view_ != nullptr)
		{
			auto c = data_mgr_->getClassmates();
			auto s = data_mgr_->getSpeakers();
			auto d = data_mgr_->getDiscussing();

			if (c && s)
			{
				view_->setClassmates(*c, *s, d);
			}
		}
	}

	void GroupPresenter::onSpeakersChanged()
	{
		if (view_ != nullptr)
		{
			auto p = data_mgr_->getSpeakers();
			if (p)
			{
				view_->markSpeakers(*p);
			}
		}
	}

	void GroupPresenter::onDiscussingChanged(bool discuss)
	{
		if (view_ != nullptr)
		{
			view_->markDiscussing(discuss);
		}
	}

	void GroupPresenter::onVideoAdd(const std::string &user_id)
	{
		if (nullptr != view_)
		{
			view_->onVideoAdd(user_id);
		}
	}

	void GroupPresenter::onVideoRemove(const std::string &user_id)
	{
		if (nullptr != view_)
		{
			view_->onVideoRemove(user_id);
		}
	}
}
