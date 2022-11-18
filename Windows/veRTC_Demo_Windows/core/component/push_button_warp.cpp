#include "push_button_warp.h"

#include <QPainter>
PushButtonWarp::PushButtonWarp(QWidget *parent) : QPushButton(parent) {
    setState(PushButtonState::kNormal);
}

void PushButtonWarp::setState(const PushButtonState state) {
    auto find_it = state_map_qss_.find(state);
    if (find_it != state_map_qss_.end()) this->setStyleSheet(find_it->second);
    state_ = state;
}

PushButtonWarp::PushButtonState PushButtonWarp::state() { 
    return state_; 
}

void PushButtonWarp::paintEvent(QPaintEvent *e) { 
    QPushButton::paintEvent(e); 
}

void PushButtonWarp::enterEvent(QEvent *) {
    auto hover_qss = state_map_qss_.find(PushButtonState::kHover);
    if (hover_qss == state_map_qss_.end() || hover_qss->second.isEmpty()) return;
    if (state_ & PushButtonState::kSelect) {
        auto find_it =
            state_map_qss_.find(PushButtonState::kHover | PushButtonState::kSelect);
        if (find_it == state_map_qss_.end() || find_it->second.isEmpty()) return;
        this->setStyleSheet(find_it->second);
    }
    else {
        this->setStyleSheet(hover_qss->second);
    }
}

void PushButtonWarp::leaveEvent(QEvent *) { 
    setState(state_); 
}

void PushButtonWarp::mousePressEvent(QMouseEvent *e) {
    do {
        if (state_ & PushButtonState::kSelect) {
            auto find_it = state_map_qss_.find(PushButtonState::kPress |
                PushButtonState::kSelect);
            if (find_it == state_map_qss_.end() || find_it->second.isEmpty()) break;
            this->setStyleSheet(find_it->second);
        }
        else {
            auto qss = state_map_qss_.find(PushButtonState::kPress);
            if (qss == state_map_qss_.end() || qss->second.isEmpty()) break;
            this->setStyleSheet(qss->second);
        }
    } while (false);
    QPushButton::mousePressEvent(e);
    return;
}

void PushButtonWarp::mouseReleaseEvent(QMouseEvent *e) {
    setState(state_);
    QPushButton::mouseReleaseEvent(e);
    return;
}
