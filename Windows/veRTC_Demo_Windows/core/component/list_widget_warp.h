#ifndef LISTWIDGETWARP_H
#define LISTWIDGETWARP_H

#include <QListWidget>
#include <QLabel>
#include <QPushButton>
#include <QSpacerItem>
#include <QGridLayout>

class ListWidgetItemWarp;

class ListWidgetWarp : public QListWidget
{
Q_OBJECT

public:
    explicit ListWidgetWarp(QWidget* parent = nullptr);
    void setItemSizeHint(const QSize& size);
    void addWidget(ListWidgetItemWarp * widget);
    void mouseReleaseEvent(QMouseEvent *event)override;

signals:
    void sigItemButtonClicked(QListWidgetItem * item);

public slots:
    void updateSelectedChanged();
private:
    QSize item_size_;
    QPoint pos_;
    ListWidgetItemWarp * old_select_ = nullptr;
    ListWidgetItemWarp * cur_select_ = nullptr;
};




class ListWidgetItemWarp: public QWidget{
    Q_OBJECT
public:
    explicit ListWidgetItemWarp(QWidget * parent =nullptr);

    void setClassRoomName(const QString& name);
    void setDate(const QString& date);
    void setButtonImage(const QString& qss);
    void showBtn();
    void hideBtn();
signals:
    void sigButtonclicked();
private:
    QGridLayout * layout_;
    QLabel * lbl_class_room_;
    QLabel * lbl_date_;
    QPushButton * btn_delete_;
    QWidget * placeholder_widget_;
};


#endif // LISTWIDGETWARP_H
