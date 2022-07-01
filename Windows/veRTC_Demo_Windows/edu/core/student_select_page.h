#pragma once
#include <QVector>
#include <QWidget>
#include <QLabel>
#include "flowlayout.h"
class QScrollArea;
class StudentCourseItem;

class StudentSelectPage : public QWidget {
  Q_OBJECT
 public:
  explicit StudentSelectPage(QWidget* parent = nullptr);
  void clearData();
  void updateData();

 signals:
  void sigJoinClassRoom();

 protected:
  void resizeEvent(QResizeEvent* e) override;
  void updateContentLabelGem();
 private:
  void errorHandler(int code);
  // bool joining_ = false;
  QWidget* content_;
  FlowLayout* layout_;
  QScrollArea* sroll_area_;
  QVector<StudentCourseItem*> items_;
  QLabel *m_contentLabel = nullptr;
};
