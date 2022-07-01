#include "menu_warp.h"

MenuWarp::MenuWarp(QWidget* parent) : QMenu(parent) {}

void MenuWarp::focusOutEvent(QFocusEvent* e) { emit sigFocusOut(); }
