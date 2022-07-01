#pragma once

#include "core/component/videocell.h"
#include "core/session_base.h"
#include "app_ui_state.h"
#include "edu/core/room_base_notify.h"
#include "speech/room_view.h"
#include "core/component/alert.h"

#include <QPointer>
#include <QWidget>
#include <QLabel>
#include <QBoxLayout>
#include <QTimer>
#include <QListWidget>

#include <mutex>

namespace Ui {
    class LETeacherLayout;
}

namespace LE
{
    class TeacherRoom : public QWidget, public RB::NotifyBase
    {
        enum CLASS_STATUS {
            READY,
            PROGRESSING
        };

        Q_OBJECT

    public:
        explicit TeacherRoom(QWidget* parent = nullptr);
        ~TeacherRoom();
        void AddOnlineStudent(std::string& user_id, const QString& name);
        void AddTeacherItem(const QString& name);
        void AddOnlineTitle();
        void AddStudentLine();
        void RemoveStudentItem(const std::string& uid);

    public slots:
        void TimerTick();
        void SetClassName(const QString& str);
        void SetClassID(const QString& str);
        void ShowGroupSpeaker();
        void CloseGroupSpeaker();
        void TeacherGetStudentsListInfo();

    protected:
        void closeEvent(QCloseEvent* event) override;
        void showEvent(QShowEvent* event) override;
        void onBeginClass(const std::string& room_id) override;
        void onOpenVideoInteract() override;
        void onCloseVideoInteract() override;
        void onLoginElsewhere() override;
        void onEndClass(const std::string& room_id) override;

    private:
        void UpdateOnlineTitle(int num);
        void InitUIElements();
        void InitTeacherVideoCell();
        void InitRoomInfo();
        void InitSigSlots();
        void InitTimer();
        void DropCall();
        void RtcInit();
        void RtcUnInit();
        void TriggerStartClass();

    private:
        qlonglong m_ticknum_{ 0 };
        qlonglong m_duaration_class{ 0 };
        Ui::LETeacherLayout* ui;
        QTimer* m_globalTimer_{ nullptr };
        QLabel* m_lbl_students_list_{ nullptr };
        QLabel* m_tearch_name_{ nullptr };
        Videocell* m_local_preview_{ nullptr };
        QWidget* m_group_speaker_{ nullptr };
        vrd::RoomView* speechView{ nullptr };
        QMap<std::string, QListWidgetItem*> m_stu_info_map_;
        QPointer<vrd::Alert> m_begin_class_alert;
        std::string m_room_id_;
        std::string m_user_id_;
        std::string m_user_name_;
        std::string m_room_name_;
        std::once_flag once_notify_;
        CLASS_STATUS m_class_status_;
        bool m_is_goupspeak_{ false };
        bool m_is_interacting{ false };
        bool m_is_sure_closing{ false };
        bool m_is_closing{ false };
    };
}


