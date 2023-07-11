#include "line_edit_warp.h"

#include <QFocusEvent>
LineEditWarp::LineEditWarp(QWidget* parent)
    : QLineEdit(parent), state_(LineEditState::kNormal) {}

void LineEditWarp::setState(const LineEditState state) { this->state_ = state; }

LineEditState LineEditWarp::state() { return state_; }

void LineEditWarp::focusInEvent(QFocusEvent* e) {
  emit sigGetFocus();
  QLineEdit::focusInEvent(e);
}

void LineEditWarp::focusOutEvent(QFocusEvent* e) {
  emit sigReleaseFocus();
  e->accept();
  QLineEdit::focusOutEvent(e);
}
