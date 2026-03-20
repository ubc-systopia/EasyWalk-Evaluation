externalproject_get_property(microwalk INSTALL_DIR)
set(MWRT_INSTALL_DIR ${INSTALL_DIR})

externalproject_get_property(quickjs INSTALL_DIR)
set(QJS_INSTALL_DIR ${INSTALL_DIR})

foreach (SCRIPT_FILE IN LISTS SCRIPT_FILES)
    get_filename_component(SCRIPT_NAME ${SCRIPT_FILE} NAME_WE)

    add_test(NAME microwalk-js-quickjs-${SCRIPT_NAME}
            COMMAND bash ${CMAKE_CURRENT_SOURCE_DIR}/target.sh
            WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
    )
    set_tests_properties(microwalk-js-quickjs-${SCRIPT_NAME} PROPERTIES
            LABELS microwalk-js-quickjs
            ENVIRONMENT "TARGET_NAME=microwalk-js-quickjs;CURRENT_DIR=${CMAKE_CURRENT_SOURCE_DIR};ROOT_DIR=${CMAKE_CURRENT_BINARY_DIR};SUBTARGET_NAME=${SCRIPT_NAME};SCRIPT_FILE=${SCRIPT_FILE};WORK_DIR=${CMAKE_CURRENT_BINARY_DIR}/results/microwalk-js-quickjs/${SCRIPT_NAME};MW_TESTCASE_DIRECTORY=${CMAKE_SOURCE_DIR}/testcases/${SCRIPT_NAME};MW_TRACE_DIRECTORY=${CMAKE_CURRENT_BINARY_DIR}/results/microwalk-js-quickjs/${SCRIPT_NAME}/work/traces;MW_PATH_PREFIX=${CMAKE_CURRENT_BINARY_DIR}/results/microwalk-js-quickjs/${SCRIPT_NAME};MWRT_INSTALL_DIR=${MWRT_INSTALL_DIR};NODE_EXE=${NODE_EXE};RT_CMD=${QJS_INSTALL_DIR}/bin/qjs -m;RT=quickjs;TEST_BASE=${CMAKE_CURRENT_SOURCE_DIR}/microwalk-quickjs.js;LIBS_DIR=${CMAKE_SOURCE_DIR}/lib"
            PASS_REGULAR_EXPRESSION "Unique leaking instructions"
    )

    add_test(NAME microwalk-js-nodejs-${SCRIPT_NAME}
            COMMAND bash ${CMAKE_CURRENT_SOURCE_DIR}/target.sh
            WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
    )
    set_tests_properties(microwalk-js-nodejs-${SCRIPT_NAME} PROPERTIES
            LABELS microwalk-js-nodejs
            ENVIRONMENT "TARGET_NAME=microwalk-js-nodejs;CURRENT_DIR=${CMAKE_CURRENT_SOURCE_DIR};ROOT_DIR=${CMAKE_CURRENT_BINARY_DIR};SUBTARGET_NAME=${SCRIPT_NAME};SCRIPT_FILE=${SCRIPT_FILE};WORK_DIR=${CMAKE_CURRENT_BINARY_DIR}/results/microwalk-js-nodejs/${SCRIPT_NAME};MW_TESTCASE_DIRECTORY=${CMAKE_SOURCE_DIR}/testcases/${SCRIPT_NAME};MW_TRACE_DIRECTORY=${CMAKE_CURRENT_BINARY_DIR}/results/microwalk-js-nodejs/${SCRIPT_NAME}/work/traces;MW_PATH_PREFIX=${CMAKE_CURRENT_BINARY_DIR}/results/microwalk-js-nodejs/${SCRIPT_NAME};MWRT_INSTALL_DIR=${MWRT_INSTALL_DIR};NODE_EXE=${NODE_EXE};RT_CMD=${NODE_EXE};RT=nodejs;TEST_BASE=${CMAKE_CURRENT_SOURCE_DIR}/microwalk-nodejs.js;LIBS_DIR=${CMAKE_SOURCE_DIR}/lib"
            PASS_REGULAR_EXPRESSION "Unique leaking instructions"
    )
endforeach ()
