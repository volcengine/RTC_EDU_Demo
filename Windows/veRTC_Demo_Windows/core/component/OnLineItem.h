#pragma once
#include <qwidget.h>
#include <QHBoxLayout>
#include <QLabel>

class OnLineItem :
	public QWidget
{
	Q_OBJECT
public:
	explicit OnLineItem(QWidget* parent = nullptr);
	~OnLineItem();

	void SetUserName(QString name);
	void setLogoStyleSheet(const char* style);

private:
	void InitControls();
	void showEvent(QShowEvent* e) override;
	void paintEvent(QPaintEvent* e) override;

private:
	QHBoxLayout* m_layout_{ nullptr };
	QLabel* m_lbl_logo{ nullptr };
	QLabel* m_lbl_user{ nullptr };
	QBrush* bg_brush_{ nullptr };
};

