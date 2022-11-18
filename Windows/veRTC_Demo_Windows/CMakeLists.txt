cmake_minimum_required(VERSION 3.4.1)

project(VeRTCDemo LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG ${EXECUTABLE_OUTPUT_PATH}/$(Configuration)/VeRTCDemo)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${EXECUTABLE_OUTPUT_PATH}/$(Configuration)/VeRTCDemo)
set(CMAKE_OUTPUT_DIR ${EXECUTABLE_OUTPUT_PATH}/$(Configuration)/VeRTCDemo)

set(PORJECT_ROOT_PATH ${CMAKE_CURRENT_LIST_DIR})
include(cmake/common.cmake)
include(cmake/edu.cmake)
add_definitions(-DEDU_SCENE)
add_definitions(-DMORE_SCENE)
 

if(MSVC)
  if(CMAKE_CL_64)
    set(PLATFORM "Win64")
  else()
    set(PLATFORM "Win32")
  endif()
  message(STATUS "MSVC_VERSION is ${MSVC_VERSION}")
  if(MSVC_VERSION LESS 1920)
    set(VS_VER "MSVC2015")
	message(STATUS "SELECT Visual Studio 17")
  else()
    set(VS_VER "MSVC2016")
	message(STATUS "SELECT Visual Studio 19")
  endif()
endif()

# windows configure
if(WIN32)
#  message(${CMAKE_BUILD_TYPE})  
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
    set(win64 1)
	set(PLATFORM win64)
  ELSE()
    set(win32 1)
	set(PLATFORM win32)
  ENDIF()

  IF (win32)
    list(APPEND CMAKE_PREFIX_PATH "$ENV{Qt32Path}")
    set(WINDEPLOYQT_PATH $ENV{Qt32Path}\\..\\..\\bin)
  ELSE ()
    list(APPEND CMAKE_PREFIX_PATH "$ENV{Qt64Path}")
    set(WINDEPLOYQT_PATH $ENV{Qt64Path}\\..\\..\\bin)
  ENDIF ()

  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /utf-8")
  find_package(Qt5 COMPONENTS Widgets Network REQUIRED)

  set (SOURCE_FILE 
    ${COMMON_SRC}
    ${COMMON_QRC}
    ${EDU_SRC}
    ${EDU_QRC}
    ${CMAKE_CURRENT_LIST_DIR}/resource/app.manifest
  )

  add_executable(VeRTCDemo
    ${SOURCE_FILE}
    ${RC_FILES}           #windows rc complier to gen ico
  )
  source_group(TREE ${CMAKE_SOURCE_DIR}  FILES ${SOURCE_FILE})
  qt5_use_modules(VeRTCDemo Widgets Network)


  IF (win32)
	target_link_directories(VeRTCDemo PUBLIC ${CMAKE_CURRENT_LIST_DIR}/vertc_sdk/lib/Win32)
  ELSE ()
    target_link_directories(VeRTCDemo PUBLIC ${CMAKE_CURRENT_LIST_DIR}/vertc_sdk/lib/x64)
  ENDIF ()
  
  target_include_directories(VeRTCDemo PUBLIC ${CMAKE_CURRENT_LIST_DIR}/vertc_sdk/include)

  target_link_libraries(VeRTCDemo VolcEngineRTC.lib)
  target_link_libraries(VeRTCDemo kernel32.lib user32.lib gdi32.lib winspool.lib shell32.lib ole32.lib oleaut32.lib uuid.lib comdlg32.lib advapi32.lib)

  # set compile definitions
  target_compile_definitions(VeRTCDemo PRIVATE UNICODE _UNICODE WIN32_LEAN_AND_MEAN BOOST_ALL_NO_LIB BOOST_ERROR_CODE_HEADER_ONLY)
  # set compile options
  target_compile_options(VeRTCDemo PRIVATE /MP)
  target_compile_options(VeRTCDemo PRIVATE "$<$<CONFIG:Debug>:/MTd>")
  target_compile_options(VeRTCDemo PRIVATE "$<$<CONFIG:Release>:/MT>" "$<$<CONFIG:Release>:/ZI>")

  #set properties
  set_target_properties(VeRTCDemo PROPERTIES
        LINK_FLAGS "/SUBSYSTEM:WINDOWS /SAFESEH:NO /ENTRY:mainCRTStartup"
        OUTPUT_NAME "VeRTCDemo")

  IF (win32)
    set(SDK_DIR ${CMAKE_SOURCE_DIR}/vertc_sdk/bin/win32)
    string(REPLACE "/" "\\" SDK_DIR ${SDK_DIR})
  ELSE ()
    set(SDK_DIR ${CMAKE_SOURCE_DIR}/vertc_sdk/bin/x64)
    string(REPLACE "/" "\\" SDK_DIR ${SDK_DIR})
  ENDIF ()
  message(${SDK_DIR})
  
  set(SRC_FILE1 \"${CMAKE_CURRENT_LIST_DIR}/resource/audio/peace.mp4\")
  string(REPLACE "/" "\\" SRC_FILE1 ${SRC_FILE1})
  set(DEPENDS_DIR ${CMAKE_SOURCE_DIR}/Depends/${PLATFORM})
  string(REPLACE "/" "\\" DEPENDS_DIR ${DEPENDS_DIR})
  message(${DEPENDS_DIR})

  add_custom_command(TARGET VeRTCDemo POST_BUILD
	COMMAND copy ${SDK_DIR}\\*.dll \"${CMAKE_OUTPUT_DIR}/\" /y
    COMMAND copy ${SRC_FILE1} \"${CMAKE_OUTPUT_DIR}/\" /y
	COMMAND copy ${DEPENDS_DIR}\\*.dll \"${CMAKE_OUTPUT_DIR}/\" /y
	COMMAND cd /d ${WINDEPLOYQT_PATH}
	COMMAND if $(Configuration) equ Debug (${WINDEPLOYQT_PATH}\\windeployqt.exe --debug ${CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG}/VeRTCDemo.exe)
    COMMAND if $(Configuration) equ Release (${WINDEPLOYQT_PATH}\\windeployqt.exe --release  ${CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE}/VeRTCDemo.exe)
  )

endif()