#ifndef STUDENT_ROOM_H
#define STUDENT_ROOM_H

#include <QTimer>
#include <QWidget>
#include "app_ui_state.h"
#include "edu/core/room_base_notify.h"
#include "speech/platform_view.h"

class Videocell;
class QresizeEvent;

namespace vrd
{
    class CPlatformView;
}

namespace Ui {
    class LEStudentLayout;
}

namespace LE
{
    class StudentRoom : public QWidget, public RB::NotifyBase
    {
        Q_OBJECT

    public:
        explicit StudentRoom(QWidget* parent = nullptr);
        ~StudentRoom();
        void closeEvent(QCloseEvent* event) override;
        virtual void resizeEvent(QResizeEvent* event) override;
        void showEvent(QShowEvent* event) override;

    public slots:
        void TimerTick();
        void SetClassName(const QString& str);
        void SetClassID(const QString& str);
        void ShowGroupSpeaker();
        void CloseGroupSpeaker();
        void UpStage();
        void DownStage();

    protected:
        void onTeacherCameraOff(const std::string& room_id) override;
        void onTeacherCameraOn(const std::string& room_id) override;
        void onTeacherMicOn(const std::string& room_id) override;
        void onTeacherMicOff(const std::string& room_id) override;
        void onTeacherJoinRoom(const std::string& room_id) override;
        void onTeacherLeaveRoom(const std::string& room_id) override;
        void onBeginClass(const std::string& room_id) override;
        void onEndClass(const std::string& room_id) override;
        void onOpenGroupSpeech(const std::string& room_id) override;
        void onCloseGroupSpeech(const std::string& room_id) override;
        void onOpenVideoInteract() override;
        void onCloseVideoInteract() override;

    private:
        void InitSigSlots();
        void InitTimer();
        void DropCall();
        void RtcInit();
        void InitRoomInfo();

    private:
        Ui::LEStudentLayout* ui;
        Videocell* m_teacher_preview_{ nullptr };
        vrd::PlatformView* m_handsupWidget_{ nullptr };
        bool m_is_handsupwidget_collapse_{ false };
        qlonglong m_ticknum_{ 0 };
        qlonglong m_duaration_class{ 0 };
        QTimer* m_globalTimer_{ nullptr };
        QWidget* m_group_speaker_{ nullptr };
        std::string m_room_id_;
        std::string m_user_id_;
        std::string m_teacher_user_name_;
        std::string m_room_name_;
        bool m_is_sure_closing_{ false };
        bool m_is_leaving_room{ false };
        bool m_is_closing_{ false };
        bool m_class_processing_ = false;
    };

}


#endif // STUDENT_ROOM_H
