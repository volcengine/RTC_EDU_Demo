#include "platform_presenter.h"
#include "core/application.h"
#include "data_mgr.h"

namespace vrd
{
	PlatformPresenter::PlatformPresenter(QObject *parent, IPlatformView *v)
		: QObject(parent)
		, view_(v)
	{
		data_mgr_ = VRD_FUNC_GET_COMPONET(vrd::LectureStudentDataMgr);
	}

	PlatformPresenter::~PlatformPresenter()
	{
		data_mgr_->end();
	}

	void PlatformPresenter::init()
	{
		data_mgr_->start();
		data_mgr_->speechStart();

		connect(data_mgr_->getEvent(), &LectureStudentEvent::sigSpeakersChanged, this, &PlatformPresenter::onSpeakersChanged);
		connect(data_mgr_->getEvent(), &LectureStudentEvent::sigVideoAdd, this, &PlatformPresenter::onVideoAdd);
		connect(data_mgr_->getEvent(), &LectureStudentEvent::sigVideoRemove, this, &PlatformPresenter::onVideoRemove);
		connect(data_mgr_->getEvent(), &LectureStudentEvent::sigApplyChanged, this, &PlatformPresenter::onApplyChanged);

		data_mgr_->updateSpeakersAndApplied();
	}

	bool PlatformPresenter::hasVideo(const std::string &user_id)
	{
		return data_mgr_->hasVideo(user_id);
	}

	void PlatformPresenter::setVideoWindow(const std::string &user_id, WId wnd_id)
	{
		data_mgr_->setVideoWindow(user_id, (void*)wnd_id);
	}

	bool PlatformPresenter::isMyself(const std::string &user_id)
	{
		return data_mgr_->isMyself(user_id);
	}

	void PlatformPresenter::apply(bool cancel)
	{
		data_mgr_->apply(cancel);
	}

	void PlatformPresenter::speechEnd()
	{
		data_mgr_->speechEnd();
	}

	void PlatformPresenter::onSpeakersChanged()
	{
		if (nullptr != view_)
		{
			auto p = data_mgr_->getSpeakers().get();
			if (p != nullptr)
			{
				view_->setSpeakers(*p);
			}
		}
	}

	void PlatformPresenter::onVideoAdd(const std::string &user_id)
	{
		if (nullptr != view_)
		{
			view_->onVideoAdd(user_id);
		}
	}

	void PlatformPresenter::onVideoRemove(const std::string &user_id)
	{
		if (nullptr != view_)
		{
			view_->onVideoRemove(user_id);
		}
	}

	void PlatformPresenter::onApplyChanged(bool applied)
	{
		if (nullptr != view_)
		{
			view_->onApplyChanged(applied);
		}
	}
}
