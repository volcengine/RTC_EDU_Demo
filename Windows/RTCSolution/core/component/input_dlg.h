#pragma once
#include <QDialog>

#include "ui_input_dlg.h"

class InputDlg : public QDialog {
  Q_OBJECT

public:
    explicit InputDlg(QWidget* parent = nullptr);
    void setName(const QString& name);
    QString name();
    void paintEvent(QPaintEvent* e);

private:
    void validateUserId(QString str);

private:
    Ui::InputDlg ui;
};