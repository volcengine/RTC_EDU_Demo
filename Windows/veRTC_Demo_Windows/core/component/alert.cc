#include "Alert.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QPushbutton>

namespace vrd
{
	Alert::Alert(QWidget *parent)
		: QDialog(parent)
	{
		setWindowFlag(Qt::FramelessWindowHint);
		setAttribute(Qt::WA_TranslucentBackground);
		setAttribute(Qt::WA_DeleteOnClose);
		setWindowModality(Qt::WindowModal);

		QVBoxLayout *wnd_layout = new QVBoxLayout();

		QWidget *wdt_content = new QWidget();
		wdt_content->setStyleSheet("border-radius: 2px; background-color: white;");

		QVBoxLayout *main_layout = new QVBoxLayout();
		main_layout->setContentsMargins(0, 0, 0, 0);
		main_layout->setSpacing(0);

		QHBoxLayout *top_layout = new QHBoxLayout();
		this->lbl_tip_ = new QLabel();
		this->lbl_tip_->setStyleSheet("margin: 6px; font: 12px \"微软雅黑\"; color: black;");
		top_layout->addWidget(this->lbl_tip_, 0, Qt::AlignCenter);
		main_layout->addLayout(top_layout, 1);

		QWidget *wdt_h_sep = new QWidget();
		wdt_h_sep->setStyleSheet("background-color: gray;");
		wdt_h_sep->setFixedHeight(1);
		main_layout->addWidget(wdt_h_sep);

		QHBoxLayout *bottom_layout = new QHBoxLayout();
		QPushButton *cancel_button = new QPushButton("取消");
		cancel_button->setFlat(true);
		cancel_button->setStyleSheet("border: none; margin: 6px; font: 12px \"微软雅黑\"; color: black;");
		connect(cancel_button, &QPushButton::clicked, this, &Alert::onCancelClicked);
		bottom_layout->addWidget(cancel_button);

		QWidget *wdt_v_sep = new QWidget();
		wdt_v_sep->setStyleSheet("background-color: gray;");
		wdt_v_sep->setFixedWidth(1);
		bottom_layout->addWidget(wdt_v_sep);

		QPushButton *btn_ok = new QPushButton("确定");
		btn_ok->setFlat(true);
		btn_ok->setStyleSheet("border: none; margin: 6px; font: 12px \"微软雅黑\"; color: black;");
		btn_ok->setDefault(true);
		connect(btn_ok, &QPushButton::clicked, this, &Alert::onOkClicked);
		bottom_layout->addWidget(btn_ok);
		main_layout->addLayout(bottom_layout);

		wdt_content->setLayout(main_layout);
		wdt_content->setMinimumSize(200, 100);

		wnd_layout->addWidget(wdt_content);
		this->setLayout(wnd_layout);
	}

	void Alert::setText(const QString &info)
	{
		lbl_tip_->setText(info);
	}

	void Alert::onOkClicked()
	{
		accept();
	}

	void Alert::onCancelClicked()
	{
		reject();
	}
}
