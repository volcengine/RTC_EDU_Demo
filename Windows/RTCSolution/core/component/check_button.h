#ifndef CHECK_BUTTON_H
#define CHECK_BUTTON_H

#include <QWidget>


class CheckButton : public QWidget
{
    Q_OBJECT

public:
    explicit CheckButton(QWidget *parent = nullptr);
    ~CheckButton() = default;
    void setChecked(bool enabled);

signals:
    void sigChecked(bool checked);

protected:
    void paintEvent(QPaintEvent *e)override;
    void mousePressEvent(QMouseEvent *e) override;
private:
    bool checked_ = false;
};

#endif // CHECK_BUTTON_H
