#pragma once

#include <QLabel>



class LabelWarp : public QLabel
{
Q_OBJECT
public :
    explicit LabelWarp(QWidget * parent = nullptr);
    void mousePressEvent(QMouseEvent *e) override;
signals:
    void sigPressed();
};