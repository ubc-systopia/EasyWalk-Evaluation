cmake_minimum_required(VERSION 3.21)

project(EasyWalk-Evaluation C)

set(CMAKE_VERBOSE_MAKEFILE on)
set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

include(ExternalProject)
enable_testing()

include(Dependencies.cmake)

file(GLOB SCRIPT_FILES CONFIGURE_DEPENDS ${CMAKE_SOURCE_DIR}/targets/target-*.js)

add_subdirectory(microwalk-js)
add_subdirectory(microwalk-rt)
