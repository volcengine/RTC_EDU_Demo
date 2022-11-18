#include "input_dlg.h"
#include <QStyleOption>
#include <QPainter>
#include <QTimer>

static constexpr char* kEdtError =
"font-family : 'Microsoft YaHei UI';"
"font-size : 12px;"
"padding-left : 16px;"
"padding - top:5px;"
"padding - bottom:5px;"
"color : #fff;"
"background : #1C222D;"
"border : 1px solid #F53F3F;"
"border-radius : 4px;";

static constexpr char* kEdtNormal =
"padding-left: 16px;"
"padding-top: 5px;"
"padding-bottom: 5px;"
"background: #1C222D;"
"border-radius: 4px;"
"font-family: 'Microsoft YaHei';"
"font-size: 12px;"
"color: #fff;";


InputDlg::InputDlg(QWidget *parent)
    :QDialog(parent) {
  ui.setupUi(this);
  setWindowFlags(Qt::FramelessWindowHint | Qt::Dialog);
  setAttribute(Qt::WA_TranslucentBackground, true);
  connect(ui.edt_name, &QLineEdit::textChanged, this,
      &InputDlg::validateUserId);
}

void InputDlg::setName(const QString &name) { 
    ui.edt_name->setText(name); 
}

QString InputDlg::name() { 
    return ui.edt_name->text(); 
}

void InputDlg::paintEvent(QPaintEvent *e) {
  QStyleOption opt;
  opt.init(this);
  QPainter p(this);
  style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
  QDialog::paintEvent(e);
}

void InputDlg::validateUserId(QString str) {
    auto user_name_error_ = false;
    auto isOverflow = false;
    if (str.size() > 18) {
        ui.edt_name->setText(str.left(18));
        isOverflow = true;
    }
    auto tmp = ui.edt_name->text();
    for (auto& ch : tmp) {
        ushort uNum = ch.unicode();
        if (!(ch.isDigit() || ch.isUpper() || ch.isLower() || (uNum >= 0x4E00 && uNum <= 0x9FA5))) {
            user_name_error_ = true;
            break;
        }
    }

    if (user_name_error_ || isOverflow) {
        ui.txt_msg->setText(QString::fromUtf8("仅支持中文，字母，数字，1-18位"));
        ui.edt_name->setState(LineEditState::kError);
        ui.edt_name->setStyleSheet(kEdtError);
        if (isOverflow) {
            QTimer* timer = new QTimer(this);
            connect(timer, &QTimer::timeout, [=] {
                if (!user_name_error_) {
                    ui.txt_msg->setText("");
                    ui.edt_name->setStyleSheet(kEdtNormal);
                }

                timer->stop();
                });
            timer->start(2000);
        }
    }
    else {
        ui.txt_msg->setText("");
        ui.edt_name->setState(LineEditState::kNormal);
        ui.edt_name->setStyleSheet(kEdtNormal);
    }

    if (!user_name_error_ && !ui.edt_name->text().isEmpty()) {
        ui.btn_confirm->setEnabled(true);
    }
    else {
        ui.btn_confirm->setEnabled(false);
    }
}
