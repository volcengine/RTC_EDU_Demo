include_directories(
    ${PORJECT_ROOT_PATH}
    ${PORJECT_ROOT_PATH}/core/component 
    ${PORJECT_ROOT_PATH}/core/http 
    ${PORJECT_ROOT_PATH}/feature
    ${PORJECT_ROOT_PATH}/feature/joinRTS_params_kit
	${PORJECT_ROOT_PATH}/feature/login_kit
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

file(GLOB CORE_COMPONENT_FILES
	${PORJECT_ROOT_PATH}/core/component/*.h
	${PORJECT_ROOT_PATH}/core/component/*.cpp
	${PORJECT_ROOT_PATH}/core/component/*.cc
	${PORJECT_ROOT_PATH}/core/component/*.ui
)

file(GLOB FEATURE_FILES
	${PORJECT_ROOT_PATH}/feature/*.h
	${PORJECT_ROOT_PATH}/feature/*.cpp
	${PORJECT_ROOT_PATH}/feature/*.cc
)

file(GLOB RTS_PARAMS_FILES
    ${PORJECT_ROOT_PATH}/feature/joinRTS_params_kit/rtc_build_config.h
	${PORJECT_ROOT_PATH}/feature/joinRTS_params_kit/rts_params.h
	${PORJECT_ROOT_PATH}/feature/joinRTS_params_kit/rts_params.cc
)

file(GLOB LOGIN_FILES
	${PORJECT_ROOT_PATH}/feature/login_kit/login_widget.h
	${PORJECT_ROOT_PATH}/feature/login_kit/login_widget.cpp 
	${PORJECT_ROOT_PATH}/feature/login_kit/login.ui 
)

set(PROJECT_SRC 
	${CORE_CPP_FILES}
	${CORE_COMPONENT_FILES} 
	${FEATURE_FILES} 
	${CORE_HTTP_FILES}
	${LOGIN_FILES}
	${RTS_PARAMS_FILES}
	${PORJECT_ROOT_PATH}/main.cpp
)

set(PROJECT_QRC 
	${PORJECT_ROOT_PATH}/resource/resource.qrc
)


