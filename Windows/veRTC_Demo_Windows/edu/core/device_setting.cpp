#include "device_setting.h"

#include <QListView>
#include <QPainter>
#include <QStyleOption>
#include <QTimer>
#include <random>

#include "app_ui_state.h"
#include "core/edu_rtc_engine_wrap.h"
#include "edu/core/data_mgr.h"

static void init_cmb_data(QComboBox* cmb, std::vector<RtcDevice> devices,int curIndex) {
	cmb->blockSignals(true);
	cmb->clear();
	for (size_t i = 0; i < devices.size(); i++) {
		cmb->addItem(devices[i].name.c_str());
	}
	if (curIndex < devices.size() &&
		curIndex >= 0) {
		cmb->setCurrentIndex(curIndex);
	}
	cmb->blockSignals(false);
}

DeviceSetting::DeviceSetting(QWidget* parent) : QWidget(parent) {
	ui.setupUi(this);
	ui.vol_mic->setImage(QPixmap(":/img/mic"));
	ui.vol_play->setImage(QPixmap(":/img/volume"));
	ui.vol_play->setImageStartWidth(ui.vol_mic->getImageWidth());
	auto set_combobox = [](QComboBox* cmb) {
		auto list_view = new QListView(cmb);
		list_view->setFocusPolicy(Qt::NoFocus);
		cmb->setView(list_view);
		cmb->view()->window()->setWindowFlags(Qt::Popup | Qt::FramelessWindowHint |
			Qt::NoDropShadowWindowHint);
		cmb->view()->window()->setAttribute(Qt::WA_TranslucentBackground);
	};
	set_combobox(ui.cmb_camrea);
	set_combobox(ui.cmb_micro);
	set_combobox(ui.cmb_audio_play);

	QObject::connect(ui.cmb_camrea,
		QOverload<int>::of(&QComboBox::currentIndexChanged), this,
		[=](int index) {
			if (index == -1) return;
			auto setting = Edu::DataMgr::instance().current_device_setting();
			EduRTCEngineWrap::setVideoCaptureDevice(index);
			setting.curVideoDevIndex = index;
			Edu::DataMgr::instance().setDevSetting(setting);
		});
	QObject::connect(ui.cmb_micro,
		QOverload<int>::of(&QComboBox::currentIndexChanged), this,
		[=](int index) {
			if (index == -1) return;
			auto setting = Edu::DataMgr::instance().current_device_setting();
			EduRTCEngineWrap::setAudioInputDevice(index);
			setting.curAudioCaptureIndex = index;
			Edu::DataMgr::instance().setDevSetting(setting);
		});
	QObject::connect(ui.cmb_audio_play,
		QOverload<int>::of(&QComboBox::currentIndexChanged), this,
		[=](int index) {
			if (index == -1) return;
			auto setting = Edu::DataMgr::instance().current_device_setting();
			EduRTCEngineWrap::setAudioOutputDevice(index);
			setting.curAudioPlaybackIndex = index;
		});
	connect(ui.btn_confirm, &QPushButton::clicked, this,
		[=] { 
			emit sigJoinClass(); 
		});

	connect(&EduRTCEngineWrap::instance(),
		&EduRTCEngineWrap::sigAudioVolumeIndication,
		this,
		[=](std::vector<AudioVolumeInfoWrap> volumes, int total_val) {
			(void)volumes;
			ui.vol_mic->setValue(total_val);
		});

	connect(ui.btn_play, &QPushButton::clicked, this, [=] {
		EduRTCEngineWrap::stopPlaybackDeviceTest();
		QString file = QApplication::applicationDirPath() + "/peace.mp4";
		EduRTCEngineWrap::startPlaybackDeviceTest(file.toUtf8().constData());
		timer_->stop();
		timer_->start(10);
		});

    QObject::connect(
        &RtcEngineWrap::instance(), &RtcEngineWrap::sigOnAudioDeviceStateChanged,
        this, [=](std::string device_id, bytertc::RTCAudioDeviceType type,
            bytertc::MediaDeviceState state, bytertc::MediaDeviceError error) {
				if (this->isVisible() && type == bytertc::kRTCAudioDeviceTypeCaptureDevice) {
                    std::vector<RtcDevice> devices;
                    auto setting = Edu::DataMgr::instance().current_device_setting();
                    RtcEngineWrap::instance().getAudioInputDevices(devices);
                    init_cmb_data(ui.cmb_micro, devices, setting.curAudioCaptureIndex);
                    RtcEngineWrap::instance().getAudioOutputDevices(devices);
                    init_cmb_data(ui.cmb_audio_play, devices, setting.curAudioPlaybackIndex);
                }
        });

    QObject::connect(
        &RtcEngineWrap::instance(), &RtcEngineWrap::sigOnVideoDeviceStateChanged,
        this, [=](std::string device_id, bytertc::RTCVideoDeviceType type,
            bytertc::MediaDeviceState state, bytertc::MediaDeviceError error) {
                if (this->isVisible() && type == bytertc::kRTCVideoDeviceTypeCaptureDevice) {
                    std::vector<RtcDevice> devices;
					auto setting = Edu::DataMgr::instance().current_device_setting();
                    EduRTCEngineWrap::getVideoCaptureDevices(devices);
                    init_cmb_data(ui.cmb_camrea, devices, setting.curVideoDevIndex);
                }
        });

	timer_ = new QTimer(this);
	connect(timer_, &QTimer::timeout, [=]() {
		std::random_device rd;
		std::mt19937 mt(rd());
		ui.vol_play->setValue(mt() % 255);
	});
}

void DeviceSetting::setButtonEnabled(bool enabled) {
  ui.btn_play->setEnabled(enabled);
  ui.btn_confirm->setEnabled(enabled);
}

void DeviceSetting::startTest() {
  std::vector<RtcDevice> devices;
  EduRTCEngineWrap::initDevice();
  auto setting = Edu::DataMgr::instance().current_device_setting();
  EduRTCEngineWrap::getAudioInputDevices(devices);
  init_cmb_data(ui.cmb_micro, devices,setting.curAudioCaptureIndex);
  EduRTCEngineWrap::getAudioOutputDevices(devices);
  init_cmb_data(ui.cmb_audio_play, devices,setting.curAudioPlaybackIndex);
  EduRTCEngineWrap::getVideoCaptureDevices(devices);
  init_cmb_data(ui.cmb_camrea, devices,setting.curVideoDevIndex);
  EduRTCEngineWrap::startPreview();
  EduRTCEngineWrap::startRecordingDeviceTest(10);
  EduRTCEngineWrap::setupLocalView((HWND)ui.content->winId(),
                                   bytertc::RenderMode::kRenderModeHidden,
                                   "local");
}

void DeviceSetting::stopTest() {
  EduRTCEngineWrap::stopPreview();
  EduRTCEngineWrap::stopPlaybackDeviceTest();
  EduRTCEngineWrap::stopRecordingDeviceTest();
  timer_->stop();
  ui.vol_play->setValue(0);
  ui.vol_mic->setValue(0);
}

void DeviceSetting::paintEvent(QPaintEvent* e) {
  QStyleOption opt;
  opt.init(this);
  QPainter p(this);
  style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
  QWidget::paintEvent(e);
}

DeviceSetting::~DeviceSetting() { 
	stopTest(); 
}
