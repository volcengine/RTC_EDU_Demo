#pragma once
#include <QLabel>
#include <QWidget>

enum class ImageButtonState : uint8_t {
	kNormal,
	kSelected,
};

class ImageButton : public QWidget {
	Q_OBJECT

public:
	ImageButton(QWidget* parent = nullptr);
	void setImgQss(const QString& qss);
	void setImgText(const QString& str);
	QLabel* img() { return img_; }
	QLabel* text() { return text_; }
	void setTextQss(const QString& qss);
	void setText(const QString& str);
	void paintEvent(QPaintEvent* e) override;
	void mousePressEvent(QMouseEvent* e) override;
	void setEnabled(bool enabled);
signals:
	void sigPressed();

private:
	bool enabled_ = true;
	QLabel* img_ = nullptr;   // store image
	QLabel* text_ = nullptr;  // text to descript button function
};