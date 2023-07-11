#ifndef VRD_ALTER_H
#define VRD_ALTER_H

#include <QDialog>
#include <QLabel>

namespace vrd
{
	class Alert : public QDialog
	{
		Q_OBJECT

	public:
		Alert(QWidget *parent = nullptr);

	public:
		void setText(const QString &info);

	public slots:
		void onOkClicked();
		void onCancelClicked();

	private:
		QLabel *lbl_tip_;
	};
}

#endif // VRD_ALTER_H
