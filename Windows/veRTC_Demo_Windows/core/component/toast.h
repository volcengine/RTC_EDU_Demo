#include <QtWidgets/QWidget>
#include <QtWidgets/QLabel>
#include <QtWidgets/QPushButton>

class Toast : public QWidget
{
	Q_OBJECT

public:
	Toast(QWidget* parent = nullptr);
	~Toast(){};

	void setError(bool error);
	void setText(const QString& text);
	void showTip(int timeout);

public:
	static void showTip(const QString& text, QWidget* parent, int timeout = 2000, bool error = false);
	static void showFixedTip(const QString& text, QWidget* parent);
	static void closeFixedTip();

private:
	static Toast& _getStaticToast(QWidget* parent);

protected:
	void paintEvent(QPaintEvent* event) override;

private:
	QLabel* lbl_icon_ = nullptr;
	QLabel* lbl_text_ = nullptr;
	QPushButton* btn_close_ = nullptr;
};
