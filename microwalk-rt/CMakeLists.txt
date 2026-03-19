externalproject_get_property(microwalk INSTALL_DIR)
set(MWRT_INSTALL_DIR ${INSTALL_DIR})

externalproject_get_property(intel-pin INSTALL_DIR)
set(PIN_ROOT ${INSTALL_DIR})

externalproject_get_property(quickjs INSTALL_DIR)
set(QJS_INSTALL_DIR ${INSTALL_DIR})

add_custom_target(sc-analysis-mapfiles
        COMMAND ${MWRT_INSTALL_DIR}/bin/MapFileGenerator ${QJS_INSTALL_DIR}/lib/quickjs/libquickjs.so ${CMAKE_CURRENT_BINARY_DIR}/libquickjs.so.map
)
add_dependencies(sc-analysis-mapfiles microwalk quickjs)

add_executable(quickjs-bytecode bytecode-target.c wrapper.c)
target_link_libraries(quickjs-bytecode  microwalk-headers quickjs-shared)
add_dependencies(quickjs-bytecode sc-analysis-mapfiles)

add_custom_command(TARGET quickjs-bytecode POST_BUILD
        COMMAND ${MWRT_INSTALL_DIR}/bin/MapFileGenerator $<TARGET_FILE:quickjs-bytecode> ${CMAKE_CURRENT_BINARY_DIR}/quickjs-bytecode.map &&
        ${CMAKE_COMMAND} -E make_directory ${CMAKE_CURRENT_BINARY_DIR}/results
)

foreach (SCRIPT_FILE IN LISTS SCRIPT_FILES)
    get_filename_component(SCRIPT_NAME ${SCRIPT_FILE} NAME_WE)

    add_test(NAME quickjs-bytecode-${SCRIPT_NAME}
            COMMAND ${MWRT_INSTALL_DIR}/bin/Microwalk ${CMAKE_CURRENT_SOURCE_DIR}/bytecode-config.yml -p ${MWRT_INSTALL_DIR}/lib
            WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
    )
    set_tests_properties(quickjs-bytecode-${SCRIPT_NAME} PROPERTIES
            LABELS quickjs-bytecode
            ENVIRONMENT "TARGET_NAME=quickjs-bytecode;ROOT_DIR=${CMAKE_CURRENT_BINARY_DIR};SUBTARGET_NAME=${SCRIPT_NAME};SCRIPT_FILE=${SCRIPT_FILE};PIN_ROOT=${PIN_ROOT};MICROWALK_DIR=${MWRT_INSTALL_DIR};TESTCASE_DIRECTORY=${CMAKE_SOURCE_DIR}/testcases/${SCRIPT_NAME}"
            PASS_REGULAR_EXPRESSION "Unique leaking instructions"
    )
endforeach ()
