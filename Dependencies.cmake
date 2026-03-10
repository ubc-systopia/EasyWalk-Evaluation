find_program(NODE_EXE NAMES node REQUIRED)
find_program(NPM_EXE NAMES npm REQUIRED)
find_program(DOTNET_EXE NAMES dotnet REQUIRED)

# Microwalk
set(MWRT_SRC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/microwalk)
set(MWRT_PREFIX_DIR ${CMAKE_CURRENT_BINARY_DIR}/microwalk)
set(MWRT_INSTALL_DIR ${MWRT_PREFIX_DIR}/install)
set(MWRT_INCLUDE_DIR ${MWRT_INSTALL_DIR}/include)
set(MWRT_JAVASCRIPT_TRACER_DIR ${MWRT_SRC_DIR}/JavascriptTracer)

set(INTEL_PIN_PREFIX_DIR ${CMAKE_CURRENT_BINARY_DIR}/intel-pin)
set(INTEL_PIN_INSTALL_DIR ${INTEL_PIN_PREFIX_DIR}/src/intel-pin)

ExternalProject_Add(
    intel-pin
    URL https://software.intel.com/sites/landingpage/pintool/downloads/pin-external-3.31-98869-gfa6f126a8-gcc-linux.tar.gz
    URL_HASH SHA256=82216144e3df768f0203b671ff48605314f13266903eb42dac01b91310eba956
    PREFIX ${INTEL_PIN_PREFIX_DIR}
    INSTALL_DIR ${INTEL_PIN_INSTALL_DIR}
    CONFIGURE_COMMAND ""
    BUILD_COMMAND ""
    INSTALL_COMMAND ""
)

set(MWRT_PIN_TRACER_DIR ${MWRT_SRC_DIR}/PinTracer)

externalproject_add(
    microwalk
    PREFIX ${MWRT_PREFIX_DIR}
    SOURCE_DIR ${MWRT_SRC_DIR}
    INSTALL_DIR ${MWRT_INSTALL_DIR}

    CONFIGURE_COMMAND ""

    BUILD_COMMAND dotnet build -c Release ${MWRT_SRC_DIR} &&
        ${CMAKE_COMMAND} -E make_directory ${MWRT_PIN_TRACER_DIR}/obj-intel64 &&
        $(MAKE) -C ${MWRT_PIN_TRACER_DIR} PIN_ROOT=${INTEL_PIN_INSTALL_DIR} obj-intel64/PinTracer.so &&
        ${NPM_EXE} install --prefix ${MWRT_JAVASCRIPT_TRACER_DIR}

    INSTALL_COMMAND dotnet publish -c Release ${MWRT_SRC_DIR}/Microwalk/Microwalk.csproj --property:PublishDir=${MWRT_INSTALL_DIR}/bin &&
        dotnet publish -c Release ${MWRT_SRC_DIR}/Tools/MapFileGenerator/MapFileGenerator.csproj --property:PublishDir=${MWRT_INSTALL_DIR}/bin &&
        dotnet publish -c Release ${MWRT_SRC_DIR}/Microwalk.Plugins.PinTracer/Microwalk.Plugins.PinTracer.csproj --property:PublishDir=${MWRT_INSTALL_DIR}/lib &&
        dotnet publish -c Release ${MWRT_SRC_DIR}/Microwalk.Plugins.JavascriptTracer/Microwalk.Plugins.JavascriptTracer.csproj --property:PublishDir=${MWRT_INSTALL_DIR}/lib &&
        ${CMAKE_COMMAND} -E copy ${MWRT_PIN_TRACER_DIR}/obj-intel64/PinTracer.so ${MWRT_INSTALL_DIR}/lib &&
        ${CMAKE_COMMAND} -E copy ${MWRT_PIN_TRACER_DIR}/FilterEntry.h ${MWRT_INSTALL_DIR}/include/PinTracer &&
        ${CMAKE_COMMAND} -E copy_directory ${MWRT_JAVASCRIPT_TRACER_DIR} ${MWRT_INSTALL_DIR}/bin/JavascriptTracer
)
file(MAKE_DIRECTORY ${MWRT_INCLUDE_DIR}/PinTracer)
add_dependencies(microwalk intel-pin)

add_library(microwalk-headers INTERFACE IMPORTED GLOBAL)
set_target_properties(microwalk-headers PROPERTIES INTERFACE_INCLUDE_DIRECTORIES ${MWRT_INSTALL_DIR}/include)
add_dependencies(microwalk-headers microwalk)

# QuickJS
set(QJS_SRC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/quickjs)
set(QJS_PREFIX_DIR ${CMAKE_CURRENT_BINARY_DIR}/quickjs)
set(QJS_INSTALL_DIR ${QJS_PREFIX_DIR}/install)
set(QJS_LIB_SHARED "${QJS_INSTALL_DIR}/lib/quickjs/libquickjs.so")

externalproject_add(
    quickjs
    PREFIX ${QJS_PREFIX_DIR}
    SOURCE_DIR ${QJS_SRC_DIR}
    INSTALL_DIR ${QJS_INSTALL_DIR}

    CONFIGURE_COMMAND ""
    BUILD_COMMAND ""
    INSTALL_COMMAND ${CMAKE_COMMAND} -E env CPATH=${MWRT_INCLUDE_DIR} CFLAGS="-DMWRT" LDFLAGS="-DMWRT" $(MAKE) -C ${QJS_SRC_DIR} install PREFIX=${QJS_INSTALL_DIR} CC=${CMAKE_C_COMPILER}
)

add_dependencies(quickjs microwalk)

file(MAKE_DIRECTORY ${QJS_INSTALL_DIR}/include/quickjs)

add_library(quickjs-shared SHARED IMPORTED GLOBAL)
set_target_properties(quickjs-shared PROPERTIES
        IMPORTED_LOCATION ${QJS_LIB_SHARED}
        INTERFACE_INCLUDE_DIRECTORIES "${QJS_INSTALL_DIR}/include"
)
set_target_properties(quickjs-shared PROPERTIES
        IMPORTED_NO_SONAME TRUE
)
add_dependencies(quickjs-shared quickjs)
