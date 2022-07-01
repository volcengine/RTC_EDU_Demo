include_directories(
    ${PORJECT_ROOT_PATH}
    ${PORJECT_ROOT_PATH}/core/component 
	${PORJECT_ROOT_PATH}/core/http 
    ${PORJECT_ROOT_PATH}/feature
)

file(GLOB CORE_CPP_FILES
  ${PORJECT_ROOT_PATH}/core/*.h
  ${PORJECT_ROOT_PATH}/core/*.cc
  ${PORJECT_ROOT_PATH}/core/*.cpp
)

file(GLOB CORE_HTTP_FILES
  ${PORJECT_ROOT_PATH}/core/http/*.h
  ${PORJECT_ROOT_PATH}/core/http/*.cpp
)

file(GLOB USERNAME_LOGIN_FILES
  ${PORJECT_ROOT_PATH}/feature/username_login/username_login_widget.h
  ${PORJECT_ROOT_PATH}/feature/username_login/username_login_widget.cpp 
)

set(COMMON_SRC 
  ${CORE_CPP_FILES} 
  ${CORE_HTTP_FILES}
  ${USERNAME_LOGIN_FILES}
  ${PORJECT_ROOT_PATH}/main.cpp
  ${PORJECT_ROOT_PATH}/core/component/line_edit_warp.h
  ${PORJECT_ROOT_PATH}/core/component/line_edit_warp.cpp
  ${PORJECT_ROOT_PATH}/core/component/push_button_warp.h
  ${PORJECT_ROOT_PATH}/core/component/push_button_warp.cpp
  ${PORJECT_ROOT_PATH}/core/component/image_button.h
  ${PORJECT_ROOT_PATH}/core/component/image_button.cpp
  ${PORJECT_ROOT_PATH}/core/component/input_dlg.h
  ${PORJECT_ROOT_PATH}/core/component/input_dlg.cpp
  ${PORJECT_ROOT_PATH}/core/component/label_warp.h
  ${PORJECT_ROOT_PATH}/core/component/label_warp.cpp
  ${PORJECT_ROOT_PATH}/core/component/menu_warp.h
  ${PORJECT_ROOT_PATH}/core/component/menu_warp.cpp
  ${PORJECT_ROOT_PATH}/core/component/toast.h
  ${PORJECT_ROOT_PATH}/core/component/toast.cpp
  ${PORJECT_ROOT_PATH}/core/component/alert.h
  ${PORJECT_ROOT_PATH}/core/component/alert.cc
  ${PORJECT_ROOT_PATH}/core/component/volume_widget.h
  ${PORJECT_ROOT_PATH}/core/component/volume_widget.cpp
  ${PORJECT_ROOT_PATH}/core/component/flowlayout.cpp
  ${PORJECT_ROOT_PATH}/core/component/list_widget_warp.h
  ${PORJECT_ROOT_PATH}/core/component/list_widget_warp.cpp
  ${PORJECT_ROOT_PATH}/core/component/videocell.h
  ${PORJECT_ROOT_PATH}/core/component/videocell.cpp
  ${PORJECT_ROOT_PATH}/core/component/OnLineItem.cpp
  ${PORJECT_ROOT_PATH}/core/component/OnLineItem.h
  ${PORJECT_ROOT_PATH}/core/component/TreeGroupWidget.h
  ${PORJECT_ROOT_PATH}/core/component/TreeGroupWidget.cpp
  ${PORJECT_ROOT_PATH}/feature/top_bar_widget.h
  ${PORJECT_ROOT_PATH}/feature/top_bar_widget.cpp
  ${PORJECT_ROOT_PATH}/feature/scene_select_widget.h
  ${PORJECT_ROOT_PATH}/feature/scene_select_widget.cpp 
  ${PORJECT_ROOT_PATH}/feature/logger.h
  ${PORJECT_ROOT_PATH}/feature/logger.cpp
  ${PORJECT_ROOT_PATH}/feature/data_mgr.h
  ${PORJECT_ROOT_PATH}/feature/scene_select_module.h
  ${PORJECT_ROOT_PATH}/feature/scene_select_module.cc
)

set(COMMON_QRC 
  ${PORJECT_ROOT_PATH}/resource/resource.qrc
)


