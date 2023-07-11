#include "edu_module.h"

#include "../core/application.h"
#include "../core/navigator_interface.h"
#include "QApplication"
#include "core/edu_rtc_engine_wrap.h"
#include "data_mgr.h"
#include "breakout_class/student_client/common/breakout_student_data_mgr.h"
#include "breakout_class/student_client/common/breakout_student_session.h"
#include "breakout_class/teacher_client/common/breakout_teacher_data_mgr.h"
#include "breakout_class/teacher_client/common/breakout_teacher_session.h"
#include "lecture_hall/student_client/common/lecture_student_data_mgr.h"
#include "lecture_hall/student_client/common/lecture_student_session.h"
#include "lecture_hall/teacher_client/common/lecture_teacher_data_mgr.h"
#include "lecture_hall/teacher_client/common/lecture_teacher_session.h"
#include "edu/core/edu_session.h"
#include "scene_select_widget.h"

namespace vrd {
void EduModule::addThis() {
    Application::getSingleton()
        .getComponent(VRD_UTIL_GET_COMPONENT_PARAM(vrd::INavigator))
        ->add("edu", std::shared_ptr<IModule>((IModule*)(new EduModule())));
    auto scenesList = vrd::DataMgr::instance().scenes_list();
    scenesList.push_back("edu");
    vrd::DataMgr::instance().setScenesList(scenesList);
}

EduModule::EduModule() {
    vrd::EduSession::registerThis();
    vrd::LectureTeacherSession::registerThis();
    vrd::LectureTeacherDataMgr::registerThis();
    vrd::LectureStudentSession::registerThis();
    vrd::LectureStudentDataMgr::registerThis();
    vrd::BreakoutTeacherSession::registerThis();
    vrd::BreakoutTeacherDataMgr::registerThis();
    vrd::BreakoutStudentSession::registerThis();
    vrd::BreakoutStudentDataMgr::registerThis();
}

EduModule::~EduModule() {}

void EduModule::open() { 
    auto session = vrd::Application::getSingleton().getComponent(
        VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
    if (session) {
        session->initSceneConfig([this]() {
            EduRTCEngineWrap::init();
            edu_select_widget_ = new EduSelectWidget();
            SceneSelectWidget::instance().show();
        });
    }
}

void EduModule::close() {
    EduRTCEngineWrap::unInit();
    if (edu_select_widget_) {
        edu_select_widget_->deleteLater();
        edu_select_widget_ = nullptr;
    }

    auto session = vrd::Application::getSingleton().getComponent(
        VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
    if (session) {
        session->exitScene();
    }
}

void EduModule::quit(bool) { 
    EduRTCEngineWrap::unInit(); 
    if (edu_select_widget_) {
        edu_select_widget_->deleteLater();
        edu_select_widget_ = nullptr;
    }

    auto session = vrd::Application::getSingleton().getComponent(
        VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
    if (session) {
        session->exitScene();
    }
}

}  // namespace vrd
