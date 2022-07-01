#pragma once
#include <QPushButton>
#include <unordered_map>



class PushButtonWarp : public QPushButton {
 public:
  enum PushButtonState : uint8_t {
    kNormal = 0x1,
    kDisable = 0x02,
    kSelect = 0x04,
    kPress = 0x08,
    kHover = 0x10
  };

  Q_OBJECT
 public:
  explicit PushButtonWarp(QWidget *parent = nullptr);
  void setState(const PushButtonState state);
  void setStateMapQss(const std::unordered_map<int, QString> &state_map) {
    state_map_qss_ = state_map;
    setState(state_);
  }
  PushButtonState state();

  void paintEvent(QPaintEvent *e) override;
  void enterEvent(QEvent *) override;
  void leaveEvent(QEvent *) override;
  void mousePressEvent(QMouseEvent *) override;
  void mouseReleaseEvent(QMouseEvent *) override;

 private:
  PushButtonState state_;
  std::unordered_map<int, QString> state_map_qss_;
};