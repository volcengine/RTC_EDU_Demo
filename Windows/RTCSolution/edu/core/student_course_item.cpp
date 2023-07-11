#include "student_course_item.h"

#include <QPainter>
#include <QStyleOption>

static constexpr char *kNormalQss =
    "#StudentCourseItem{"
    "background-color : #272E3B;"
    "border:none;"
    "border-radius : 16px;"
    "}"

    "*{ font-family : 'Microsoft YaHei UI'; }"

    "#lbl_title {"
    "font-size : 24px;"
    "color: #fff;"
    "}"

    "#lbl_teacher, #lbl_teacher_name, #lbl_cls, #lbl_cls_id {"
    "font-size : 14px;"
    "color : #86909C;"
    "}";

static constexpr char *kHoverQss =
    "#StudentCourseItem{"
    "background-color : #272E3B;"
    "border-radius : 16px;"
    "border:1px solid #1664ff;"
    "}"

    "*{ font-family : 'Microsoft YaHei UI'; }"

    "#lbl_title {"
    "font-size : 24px;"
    "color: #fff;"
    "}"

    "#lbl_teacher, #lbl_teacher_name, #lbl_cls, #lbl_cls_id {"
    "font-size : 14px;"
    "color : #86909C;"
    "}";

StudentCourseItem::StudentCourseItem(QWidget *parent) : QWidget(parent) {
  ui.setupUi(this);
  this->setStyleSheet(kNormalQss);
}

void StudentCourseItem::setTeacherName(const QString &name) {
  ui.lbl_teacher_name->setText(name);
}

QString StudentCourseItem::teacherName() { return ui.lbl_teacher_name->text(); }

void StudentCourseItem::setClassId(const QString &id) {
  ui.lbl_cls_id->setText(id);
}

QString StudentCourseItem::classId() { return ui.lbl_cls_id->text(); }

void StudentCourseItem::setClassName(const QString& name)
{
    ui.lbl_title->setText(name);
}

QString StudentCourseItem::className()
{
    return ui.lbl_title->text();
}

void StudentCourseItem::enterEvent(QEvent *) {
  ui.lbl_hover_logo->setStyleSheet(
      "background-image:url(:img/"
      "cls_hover);background-position:center;background-repeat:"
      "no-repeat;");
  this->setStyleSheet(kHoverQss);
  update();
}
void StudentCourseItem::leaveEvent(QEvent *) {
  ui.lbl_hover_logo->setStyleSheet("background:transparent;");
  this->setStyleSheet(kNormalQss);
  update();
}

void StudentCourseItem::mousePressEvent(QMouseEvent *) { emit sigPressed(); }

void StudentCourseItem::paintEvent(QPaintEvent *e) {
  QStyleOption opt;
  opt.init(this);
  QPainter p(this);
  style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
  QWidget::paintEvent(e);
}
