#include <QMouseEvent>

#include "ui_student_course_item.h"

class StudentCourseItem : public QWidget {
Q_OBJECT

public:
  explicit StudentCourseItem(QWidget *parent = nullptr);

  void setTeacherName(const QString &name);
  QString teacherName();
  void setClassId(const QString &id);
  QString classId();
  void setClassName(const QString& name);
  QString className();

signals:
  void sigPressed();

 protected:
  void enterEvent(QEvent *) override;
  void leaveEvent(QEvent *) override;
  void mousePressEvent(QMouseEvent *) override;
  void paintEvent(QPaintEvent *);
 private:
  Ui::StudentCourseItem ui;
};
