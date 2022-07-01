#include "label_warp.h"
#include <QTimer>

LabelWarp::LabelWarp(QWidget* parent) : QLabel(parent) {}

void LabelWarp::mousePressEvent(QMouseEvent* e) {
  emit sigPressed();
}