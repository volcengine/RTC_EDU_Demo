#pragma once
#include <QWidget>
#include <QLabel>

class QStackedWidget;

enum class VideoStatus {
	UNKONWN,
	RECVING,
	RECEIVED,
	CLOSED
};

class Videocell :public QWidget
{
	Q_OBJECT
public:
	explicit  Videocell(bool enableClick = true, QWidget* p = nullptr);
	~Videocell();
	const char* local_description = "local";
	void SetDisplayName(const QString& name);

signals:
	void SigMuteAudio(bool mute);
	void SigMuteVideo(bool mute);

public slots:
	void RemoteSetAudioMute(bool mute);
	void RemoteSetVideoMute(bool mute);
	bool eventFilter(QObject* obj, QEvent* event);
	HWND GetView();

private:
	//VideoStatus m_video_status_;
	QLabel* m_audio_label_{ nullptr };
	QLabel* m_video_label_{ nullptr };
	QLabel* m_display_name_{ nullptr };
	bool m_bvideomute = false;
	bool m_baudiomute = false;
	bool m_can_click_;
	QStackedWidget* m_stacked_widget_;
    QWidget* pPreview;
	void updateAudioIcon(bool mute);
	void updateVideoIcon(bool mute);

};

