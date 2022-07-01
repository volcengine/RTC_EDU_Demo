#include "input_dlg.h"
#include <QStyleOption>
#include <QPainter>

InputDlg::InputDlg(QWidget *parent):QDialog(parent)
{
  ui.setupUi(this);
  setWindowFlags(Qt::FramelessWindowHint | Qt::Dialog);
  setAttribute(Qt::WA_TranslucentBackground, true);
}

void InputDlg::setName(const QString &name) { ui.edt_name->setText(name); }

QString InputDlg::name() { return ui.edt_name->text(); }

void InputDlg::paintEvent(QPaintEvent *e) {
  QStyleOption opt;
  opt.init(this);
  QPainter p(this);
  style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
  QDialog::paintEvent(e);
}
