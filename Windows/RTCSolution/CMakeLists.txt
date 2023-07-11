cmake_minimum_required(VERSION 3.4.1)

project(VeRTC LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG ${EXECUTABLE_OUTPUT_PATH}/$(Configuration)/${PROJECT_NAME})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${EXECUTABLE_OUTPUT_PATH}/$(Configuration)/${PROJECT_NAME})
set(CMAKE_OUTPUT_DIR ${EXECUTABLE_OUTPUT_PATH}/$(Configuration)/${PROJECT_NAME})
set(PORJECT_ROOT_PATH ${CMAKE_CURRENT_LIST_DIR})

# windows configure
if(WIN32)
  set(ICON_FILE  ${CMAKE_CURRENT_LIST_DIR}/resource/ico/AppLogo.ico)
  configure_file("${CMAKE_CURRENT_LIST_DIR}/resource/resource.rc.in"
    "resource.rc"
  )
  set(RES_FILES "resource.rc")
  set(CMAKE_RC_COMPILER_INIT windres)
  ENABLE_LANGUAGE(RC)
  SET(CMAKE_RC_COMPILE_OBJECT "<CMAKE_RC_COMPILER> <FLAGS> -O coff <DEFINES> -i <SOURCE> -o <OBJECT>")
  set(RC_FILES ${RES_FILES})

  IF(CMAKE_CL_64)
    set(win32 0)
	set(PLATFORM "x64")
  ELSE()
    set(win32 1)
	set(PLATFORM "Win32")
  ENDIF()

  IF(win32)
    list(APPEND CMAKE_PREFIX_PATH "$ENV{Qt32Path}")
    set(WINDEPLOYQT_PATH $ENV{Qt32Path}\\..\\..\\bin)
	set(QT_LRELEASE_EXECUTABLE $ENV{Qt32Path}\\..\\..\\bin\\lrelease.exe)
  ELSE ()
    list(APPEND CMAKE_PREFIX_PATH "$ENV{Qt64Path}")
    set(WINDEPLOYQT_PATH $ENV{Qt64Path}\\..\\..\\bin)
	set(QT_LRELEASE_EXECUTABLE $ENV{Qt64Path}\\..\\..\\bin\\lrelease.exe)
  ENDIF ()

  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /utf-8")
  find_package(Qt5 COMPONENTS Widgets Core Network LinguistTools REQUIRED)
  
  file(GLOB TS_FILES resource/translations/*.ts)

  # 遍历所有 .ts 文件，为每个文件生成一个 .qm 文件
  foreach(_ts_file ${TS_FILES})
	get_filename_component(_ts_file_name ${_ts_file} NAME_WE)
	add_custom_command(
		OUTPUT "${CMAKE_CURRENT_LIST_DIR}/resource/translations/${_ts_file_name}.qm"
		COMMAND ${QT_LRELEASE_EXECUTABLE} ${_ts_file} -qm "${CMAKE_CURRENT_LIST_DIR}/resource/translations/${_ts_file_name}.qm"
		DEPENDS ${_ts_file}
		COMMENT "Generating ${_ts_file_name}.qm"
	)
  endforeach()

  include(cmake/common.cmake)
  add_definitions(-DMORE_SCENE)
  include(cmake/edu.cmake)

  set(SOURCE_FILE 
    ${PROJECT_SRC}
    ${PROJECT_QRC}
    ${CMAKE_CURRENT_LIST_DIR}/resource/app.manifest
  )

  add_executable(${PROJECT_NAME}
    ${SOURCE_FILE}
    ${RC_FILES}           #windows rc complier to gen ico
  )
  
  source_group(TREE ${CMAKE_SOURCE_DIR} FILES ${SOURCE_FILE})
  qt5_use_modules(${PROJECT_NAME} Widgets Core Network)

  target_include_directories(${PROJECT_NAME} PUBLIC ${CMAKE_CURRENT_LIST_DIR}/rtc_sdk/VolcEngineRTC/include)
  target_link_directories(${PROJECT_NAME} PUBLIC ${CMAKE_CURRENT_LIST_DIR}/rtc_sdk/VolcEngineRTC/lib/${PLATFORM})

  target_link_libraries(${PROJECT_NAME} VolcEngineRTC.lib)
  target_link_libraries(${PROJECT_NAME} kernel32.lib user32.lib gdi32.lib winspool.lib shell32.lib ole32.lib oleaut32.lib uuid.lib comdlg32.lib advapi32.lib)
	

  # set compile definitions
  target_compile_definitions(${PROJECT_NAME} PRIVATE UNICODE _UNICODE WIN32_LEAN_AND_MEAN BOOST_ALL_NO_LIB BOOST_ERROR_CODE_HEADER_ONLY)
  # set compile options
  target_compile_options(${PROJECT_NAME} PRIVATE /MP)
  target_compile_options(${PROJECT_NAME} PRIVATE "$<$<CONFIG:Debug>:/MDd>")
  target_compile_options(${PROJECT_NAME} PRIVATE "$<$<CONFIG:Release>:/MD>" "$<$<CONFIG:Release>:/ZI>")

  #set properties
  set_target_properties(${PROJECT_NAME} PROPERTIES
        LINK_FLAGS "/SUBSYSTEM:WINDOWS /SAFESEH:NO /ENTRY:mainCRTStartup"
        OUTPUT_NAME "${PROJECT_NAME}")

  set(SDK_DIR ${CMAKE_SOURCE_DIR}/rtc_sdk/VolcEngineRTC/bin/${PLATFORM})
  string(REPLACE "/" "\\" SDK_DIR ${SDK_DIR})
  
  set(SRC_FILE1 \"${CMAKE_CURRENT_LIST_DIR}/resource/audio/peace.mp4\")
  string(REPLACE "/" "\\" SRC_FILE1 ${SRC_FILE1})
  set(DEPENDS_DIR ${CMAKE_SOURCE_DIR}/depends/${PLATFORM})
  string(REPLACE "/" "\\" DEPENDS_DIR ${DEPENDS_DIR})
  message(${DEPENDS_DIR})
  
  add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
	COMMAND copy ${SDK_DIR}\\*.dll \"${CMAKE_OUTPUT_DIR}/\" /y
    COMMAND copy ${SRC_FILE1} \"${CMAKE_OUTPUT_DIR}/\" /y
	COMMAND copy ${DEPENDS_DIR}\\*.dll \"${CMAKE_OUTPUT_DIR}/\" /y
	COMMAND cd /d ${WINDEPLOYQT_PATH}
	COMMAND if $(Configuration) equ Debug (${WINDEPLOYQT_PATH}\\windeployqt.exe --debug ${CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG}/${PROJECT_NAME}.exe)
    COMMAND if $(Configuration) equ Release (${WINDEPLOYQT_PATH}\\windeployqt.exe --release  ${CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE}/${PROJECT_NAME}.exe)
	COMMAND ${CMAKE_COMMAND} -E remove_directory ${CMAKE_OUTPUT_DIR}/translations
  )

endif()