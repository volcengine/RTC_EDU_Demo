add_definitions(-DEDU_SCENE)
file(GLOB LECTUREHALL_CPP_FILES
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/common/*.h
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/common/*.cc
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/teacher_client/common/*.h
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/teacher_client/common/*.cc
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/teacher_client/feature/speech/*.h
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/teacher_client/feature/speech/*.cc
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/student_client/common/*.h
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/student_client/common/*.cc
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/student_client/feature/speech/*.h
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/student_client/feature/speech/*.cc
)

file(GLOB BREAKOUTCLASS_CPP_FILES
  ${PORJECT_ROOT_PATH}/edu/breakout_class/common/*.h
  ${PORJECT_ROOT_PATH}/edu/breakout_class/common/*.cc
  ${PORJECT_ROOT_PATH}/edu/breakout_class/teacher_client/common/*.h
  ${PORJECT_ROOT_PATH}/edu/breakout_class/teacher_client/common/*.cc
  ${PORJECT_ROOT_PATH}/edu/breakout_class/teacher_client/feature/group/*.h
  ${PORJECT_ROOT_PATH}/edu/breakout_class/teacher_client/feature/group/*.cc
  ${PORJECT_ROOT_PATH}/edu/breakout_class/student_client/common/*.h
  ${PORJECT_ROOT_PATH}/edu/breakout_class/student_client/common/*.cc
  ${PORJECT_ROOT_PATH}/edu/breakout_class/student_client/feature/group/*.h
  ${PORJECT_ROOT_PATH}/edu/breakout_class/student_client/feature/group/*.cc
)

FILE(GLOB UI_FILES
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/teacher_client/feature/*.ui
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/student_client/feature/*.ui
  ${PORJECT_ROOT_PATH}/edu/breakout_class/teacher_client/feature/*.ui
  ${PORJECT_ROOT_PATH}/edu/breakout_class/student_client/feature/*.ui
  ${PORJECT_ROOT_PATH}/edu/core/*.ui
)


FILE(GLOB CORE
  ${PORJECT_ROOT_PATH}/edu/core/edu_rtc_engine_wrap.h
  ${PORJECT_ROOT_PATH}/edu/core/edu_rtc_engine_wrap.cc
  ${PORJECT_ROOT_PATH}/edu/core/data_mgr.h
  ${PORJECT_ROOT_PATH}/edu/core/edu_session.h
  ${PORJECT_ROOT_PATH}/edu/core/edu_session.cc
  ${PORJECT_ROOT_PATH}/edu/core/data_def_base.h
  ${PORJECT_ROOT_PATH}/edu/core/data_parser.h
  ${PORJECT_ROOT_PATH}/edu/core/data_parser.cpp
  ${PORJECT_ROOT_PATH}/edu/core/room_base_notify.h
  ${PORJECT_ROOT_PATH}/edu/core/room_base_notify.cpp
  ${PORJECT_ROOT_PATH}/edu/core/edu_select_widget.h
  ${PORJECT_ROOT_PATH}/edu/core/edu_select_widget.cpp
  ${PORJECT_ROOT_PATH}/edu/core/app_ui_state.h
  ${PORJECT_ROOT_PATH}/edu/core/app_ui_state.cpp
  ${PORJECT_ROOT_PATH}/edu/core/device_setting.h
  ${PORJECT_ROOT_PATH}/edu/core/device_setting.cpp
  ${PORJECT_ROOT_PATH}/edu/core/side_history.h
  ${PORJECT_ROOT_PATH}/edu/core/side_history.cpp
  ${PORJECT_ROOT_PATH}/edu/core/student_course_item.h
  ${PORJECT_ROOT_PATH}/edu/core/student_course_item.cpp
  ${PORJECT_ROOT_PATH}/edu/core/student_select_page.h
  ${PORJECT_ROOT_PATH}/edu/core/student_select_page.cpp
  ${PORJECT_ROOT_PATH}/edu/core/tree_widget_warp.h
  ${PORJECT_ROOT_PATH}/edu/core/tree_widget_warp.cpp
)

include_directories(
  ${PORJECT_ROOT_PATH}/edu
  ${PORJECT_ROOT_PATH}/edu/core
)

set(EDU_MODULE
  ${PORJECT_ROOT_PATH}/edu/edu_module.h
  ${PORJECT_ROOT_PATH}/edu/edu_module.cc
  )

set(PROJECT_SRC 
  ${PROJECT_SRC}
  ${CORE}
  ${LECTUREHALL_CPP_FILES}
  ${BREAKOUTCLASS_CPP_FILES}
  ${EDU_MODULE}
  #-------LectureHall----------------------------------------------------
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/teacher_client/feature/le_teacher_room.h
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/teacher_client/feature/le_teacher_room.cpp
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/student_client/feature/le_student_room.h
  ${PORJECT_ROOT_PATH}/edu/lecture_hall/student_client/feature/le_student_room.cpp
  #----------------------------------------------------------------------
  #-------BreakoutClass--------------------------------------------------
  ${PORJECT_ROOT_PATH}/edu/breakout_class/teacher_client/feature/bc_teacher_room.h
  ${PORJECT_ROOT_PATH}/edu/breakout_class/teacher_client/feature/bc_teacher_room.cpp
  ${PORJECT_ROOT_PATH}/edu/breakout_class/student_client/feature/bc_student_room.h
  ${PORJECT_ROOT_PATH}/edu/breakout_class/student_client/feature/bc_student_room.cpp
  #----------------------------------------------------------------------
)

set(PROJECT_QRC 
  ${PROJECT_QRC}
  ${PORJECT_ROOT_PATH}/edu/resource/edu_resource.qrc
)
