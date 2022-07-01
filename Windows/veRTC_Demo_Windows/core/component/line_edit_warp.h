#pragma once

#include <QLineEdit>

enum class LineEditState : uint8_t{
  kNormal,
  kError,
};

class LineEditWarp : public QLineEdit {
  Q_OBJECT

 public:
  explicit LineEditWarp(QWidget *parent = nullptr);
  ~LineEditWarp() = default;
  void setState(const LineEditState state);
  LineEditState state();

 protected:
  virtual void focusInEvent(QFocusEvent *e);
  virtual void focusOutEvent(QFocusEvent *e);

 public:
 signals:
  void sigGetFocus();
  void sigReleaseFocus();

 private:
  LineEditState state_;
};