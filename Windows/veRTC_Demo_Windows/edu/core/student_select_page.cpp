#include "student_select_page.h"
#include <qscrollbar.h>
#include <QScrollArea>
#include "app_ui_state.h"
#include "core/session_base.h"
#include "edu/core/data_mgr.h"
#include "feature/data_mgr.h"
#include "student_course_item.h"
#include "toast.h"

StudentSelectPage::StudentSelectPage(QWidget* parent) : QWidget(parent) {
  content_ = new QWidget(this);
  layout_ = new FlowLayout(this, -1, 24, 24);
  layout_->setContentsMargins(36, -1, -1, -1);
  content_->setLayout(layout_);
  sroll_area_ = new QScrollArea(this);
  sroll_area_->setStyleSheet("background:transparent; border:none;");
  sroll_area_->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
  sroll_area_->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
  sroll_area_->setWidget(content_);

  m_contentLabel = new QLabel(this);
  m_contentLabel->setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);
  m_contentLabel->setAlignment(Qt::AlignCenter);
  m_contentLabel->setText("当前没有教室在上课");
  m_contentLabel->setStyleSheet(
	  "font:24pt;"
	  "color:#86909C;"
	  "font-weight:500;");
  m_contentLabel->hide();
}

void StudentSelectPage::updateData() {
  foreach (auto item, items_) {
    layout_->removeWidget(item);
    delete item;
  }
  items_.clear();
  auto active = Edu::DataMgr::instance().acivte_class();

  if (active.empty())
  {
	  m_contentLabel->show();
	  updateContentLabelGem();
	  return;
  }
  else 
  {
	  m_contentLabel->hide();
  }

  for (auto cls : active) {
    auto student_course_item = new StudentCourseItem(content_);
    items_.push_back(student_course_item);
    student_course_item->setTeacherName(cls.teacher_name.c_str());
    student_course_item->setClassId(cls.room_id.c_str());
    student_course_item->setClassName(cls.room_name.c_str());
    layout_->addWidget(student_course_item);
    connect(student_course_item, &StudentCourseItem::sigPressed, this, [=] {
      auto session = vrd::Application::getSingleton().getComponent(
          VRD_UTIL_GET_COMPONENT_PARAM(vrd::EduSession));
      Edu::DataMgr::instance().setCurrentRoom(cls);     
      session->setRoomId(cls.room_id);
      session->stuJoinClass(
          cls.room_id, vrd::DataMgr::instance().user_id(),
          vrd::DataMgr::instance().user_name(), [=](int code) {
            if (code != 200) {
              errorHandler(code);
              return;
            }
            AppUIState::GetInstance().SetUserRole(
                room_type::USER_ROLE::STUDENT);
            AppUIState::GetInstance().SetClassType(
                cls.room_type == 0 ? room_type::CLASS_TYPE::LECTURE_HALL
                                   : room_type::CLASS_TYPE::BREAK_OUT);
            AppUIState::GetInstance().StartClass();
            emit sigJoinClassRoom();
          });
    });
  }
  show();
  adjustSize();
}

void StudentSelectPage::clearData() {
  foreach (auto item, items_) {
    layout_->removeWidget(item);
    delete item;
  }
  items_.clear();
}

void StudentSelectPage::resizeEvent(QResizeEvent* e) {
  QSize s;
  s.setWidth(width());
  s.setHeight(layout_->heightForWidth(size().width()));
  content_->setMinimumSize(s);
  content_->setMaximumSize(s);
  sroll_area_->setFixedSize(size());
   updateContentLabelGem();
}

void StudentSelectPage::errorHandler(int code) {
  switch (code) {
    case 405:
      Toast::showTip("该用户正在使用老师的身份上课，当前无法使用学生的身份",
                     QApplication::activeWindow());
      break;
    default:
      Toast::showTip("加入房间失败", QApplication::activeWindow());
  }
}

void StudentSelectPage::updateContentLabelGem() 
{
	if (m_contentLabel == nullptr) 
	{
		return;
	}
    m_contentLabel->adjustSize();
	auto selfRect = m_contentLabel->geometry();
	selfRect.moveCenter(this->rect().center());
	m_contentLabel->setGeometry(selfRect);
}