#ifndef VOLUMEWIDGET_H
#define VOLUMEWIDGET_H

#include <QColor>
#include <QPixmap>
#include <QSize>
#include <QWidget>

class VolumeWidget:public QWidget
{
 Q_OBJECT

public:
    VolumeWidget(QWidget *parent);
    void setImage(const QPixmap &pixMap);
    int getImageWidth();
    void setImageStartWidth(int x);
    int getImageStartWidth();
    void setBkColor(const QColor &color);
    void setFrontColor(const QColor &color);

    void setValue(int value);
    void setSpacer(int value);
    void setRange(int value);
    void setRectSize(const QSize &size);
    int getValue();
protected:
 void paintEvent(QPaintEvent *e);

signals:
 void PositonChangeSignal(qreal curValue);

private:
 QColor bg_color_;
 QColor front_color_;
 QPixmap pixmap_;
 QSize rc_size_;
 int start_image_x_ = -1;
 int spacer_;
 int range_;
 int value_;
};

#endif // VOLUMEWIDGET_H
