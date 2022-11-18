#include "app_ui_state.h"

#include <Windows.h>

#include <cassert>

#include "breakout_class/student_client/feature/bc_student_room.h"
#include "breakout_class/teacher_client/feature/bc_teacher_room.h"
#include "core/util.h"
#include "core/application.h"
#include "lecture_hall/student_client/feature/le_student_room.h"
#include "lecture_hall/teacher_client/feature/le_teacher_room.h"
#include "rtc/bytertc_advance.h"
#include "rtc/bytertc_defines.h"
#include "rtc/bytertc_engine_interface.h"

AppUIState& AppUIState::GetInstance() {
  static AppUIState ins;
  return ins;
}

AppUIState::AppUIState()
    : session_(vrd::Application::getSingleton().getComponent(
          VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession)))
{
}

AppUIState::~AppUIState() {  }

void AppUIState::GetCameraList(QComboBox* out) {
	out->clear();
}

void AppUIState::GetAudioInDeviceList(QComboBox* out) {
	out->clear();
}

void AppUIState::GetAudioOutDeviceList(QComboBox* out) { 
	out->clear(); 
}

void AppUIState::SetUserRole(room_type::USER_ROLE role) {
	m_cur_user_role_ = role;
}

void AppUIState::SetClassType(room_type::CLASS_TYPE type) {
	m_cur_class_type_ = type;
}

void AppUIState::StartClass() {
	if (m_cur_class_type_ == room_type::CLASS_TYPE::LECTURE_HALL) {
		if (m_cur_user_role_ == room_type::USER_ROLE::TEACHER) {
			m_room_ = new LE::TeacherRoom;
		}
		else {
			m_room_ = new LE::StudentRoom;
		}
	}
	else {
		if (m_cur_user_role_ == room_type::USER_ROLE::TEACHER) {
			m_room_ = new BC::TeacherRoom;
		}
		else {
			m_room_ = new BC::StudentRoom;
		}
	}
	m_room_->setAttribute(Qt::WA_DeleteOnClose);
	m_room_->show();
}

void AppUIState::StopClass() {
	m_room_->close();
	m_room_ = nullptr;
}

