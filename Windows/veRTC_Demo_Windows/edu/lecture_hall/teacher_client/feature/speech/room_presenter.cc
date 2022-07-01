#include "room_presenter.h"
#include "core/application.h"
#include "data_mgr.h"

namespace vrd
{
	RoomPresenter::RoomPresenter(QObject *parent, IRoomView *v)
		: QObject(parent)
		, view_(v)
	{
		data_mgr_ = VRD_FUNC_GET_COMPONET(vrd::LectureTeacherDataMgr);
	}

	RoomPresenter::~RoomPresenter()
	{
		data_mgr_->end();
	}

	void RoomPresenter::init()
	{
		data_mgr_->start();

		connect(data_mgr_->getEvent(), &LectureTeacherEvent::sigApplicantsChanged, this, &RoomPresenter::onApplicantsChanged);
		connect(data_mgr_->getEvent(), &LectureTeacherEvent::sigSpeakersChanged, this, &RoomPresenter::onSpeakersChanged);
		connect(data_mgr_->getEvent(), &LectureTeacherEvent::sigVideoAdd, this, &RoomPresenter::onVideoAdd);
		connect(data_mgr_->getEvent(), &LectureTeacherEvent::sigVideoRemove, this, &RoomPresenter::onVideoRemove);

		data_mgr_->updateApplicants();
		data_mgr_->updateSpeakers();
	}

	bool RoomPresenter::hasVideo(const std::string &user_id)
	{
		return data_mgr_->hasVideo(user_id);
	}

	void RoomPresenter::setVideoWindow(const std::string &user_id, WId win_id)
	{
		data_mgr_->setVideoWindow(user_id, (void*)win_id);
	}

	int RoomPresenter::getSpeakerCount()
	{
		auto p = data_mgr_->getSpeakers().get();
		if (p != nullptr)
		{
			return p->size();
		}
		return 0;
	}

	void RoomPresenter::approval(const std::string &user_id)
	{
		data_mgr_->approval(user_id);
	}

	void RoomPresenter::disconnect(const std::string &user_id)
	{
		data_mgr_->disconnect(user_id);
	}

	void RoomPresenter::onApplicantsChanged()
	{
		if (nullptr != view_)
		{
			auto p = data_mgr_->getApplicants().get();
			if (p != nullptr)
			{
				view_->setApplicants(*p);
			}
		}
	}

	void RoomPresenter::onSpeakersChanged()
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

	void RoomPresenter::onVideoAdd(const std::string &user_id)
	{
		if (nullptr != view_)
		{
			view_->onVideoAdd(user_id);
		}
	}

	void RoomPresenter::onVideoRemove(const std::string &user_id)
	{
		if (nullptr != view_)
		{
			view_->onVideoRemove(user_id);
		}
	}
}
