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

add_executable(microwalk-rt-quickjs bytecode-target.c wrapper.c)
target_link_libraries(microwalk-rt-quickjs  microwalk-headers quickjs-shared)
add_dependencies(microwalk-rt-quickjs sc-analysis-mapfiles)

add_custom_command(TARGET microwalk-rt-quickjs POST_BUILD
        COMMAND ${MWRT_INSTALL_DIR}/bin/MapFileGenerator $<TARGET_FILE:microwalk-rt-quickjs> ${CMAKE_CURRENT_BINARY_DIR}/microwalk-rt-quickjs.map &&
        ${CMAKE_COMMAND} -E make_directory ${CMAKE_CURRENT_BINARY_DIR}/results
)

foreach (SCRIPT_FILE IN LISTS SCRIPT_FILES)
    get_filename_component(SCRIPT_NAME ${SCRIPT_FILE} NAME_WE)

    add_test(NAME microwalk-rt-quickjs-${SCRIPT_NAME}
            COMMAND ${MWRT_INSTALL_DIR}/bin/Microwalk ${CMAKE_CURRENT_SOURCE_DIR}/bytecode-config.yml -p ${MWRT_INSTALL_DIR}/lib
            WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
    )
    set_tests_properties(microwalk-rt-quickjs-${SCRIPT_NAME} PROPERTIES
            LABELS microwalk-rt-quickjs
            ENVIRONMENT "TARGET_NAME=microwalk-rt-quickjs;ROOT_DIR=${CMAKE_CURRENT_BINARY_DIR};SUBTARGET_NAME=${SCRIPT_NAME};SCRIPT_FILE=${SCRIPT_FILE};PIN_ROOT=${PIN_ROOT};MICROWALK_DIR=${MWRT_INSTALL_DIR};TESTCASE_DIRECTORY=${CMAKE_SOURCE_DIR}/testcases/${SCRIPT_NAME}"
            PASS_REGULAR_EXPRESSION "Unique leaking instructions"
    )

    add_test(NAME test-runner-quickjs-${SCRIPT_NAME}
            COMMAND bash ${CMAKE_CURRENT_SOURCE_DIR}/test-runner.sh $<TARGET_FILE:microwalk-rt-quickjs> ${SCRIPT_FILE} ${CMAKE_SOURCE_DIR}/testcases/${SCRIPT_NAME}
            WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
    )
    set_tests_properties(test-runner-quickjs-${SCRIPT_NAME} PROPERTIES
            LABELS test-runner-quickjs
    )
endforeach ()
