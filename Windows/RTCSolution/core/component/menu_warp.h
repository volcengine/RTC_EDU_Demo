#pragma once
#include <QMenu>

class MenuWarp : public QMenu {
  Q_OBJECT
 public:
  explicit MenuWarp(QWidget *parent = nullptr);

  void focusOutEvent(QFocusEvent *e) override;
 signals:
  void sigFocusOut();
};
