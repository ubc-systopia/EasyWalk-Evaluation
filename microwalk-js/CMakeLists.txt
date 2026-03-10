externalproject_get_property(microwalk INSTALL_DIR)
set(MWRT_INSTALL_DIR ${INSTALL_DIR})

externalproject_get_property(quickjs INSTALL_DIR)
set(QJS_INSTALL_DIR ${INSTALL_DIR})

foreach (SCRIPT_FILE IN LISTS SCRIPT_FILES)
    get_filename_component(SCRIPT_NAME ${SCRIPT_FILE} NAME_WE)

    add_test(NAME quickjs-microwalk-js-${SCRIPT_NAME}
            COMMAND bash ${CMAKE_CURRENT_SOURCE_DIR}/target.sh
            WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
    )
    set_tests_properties(quickjs-microwalk-js-${SCRIPT_NAME} PROPERTIES
            LABELS quickjs-microwalk-js
            ENVIRONMENT "TARGET_NAME=quickjs-microwalk-js;CURRENT_DIR=${CMAKE_CURRENT_SOURCE_DIR};ROOT_DIR=${CMAKE_CURRENT_BINARY_DIR};SUBTARGET_NAME=${SCRIPT_NAME};SCRIPT_FILE=${SCRIPT_FILE};WORK_DIR=${CMAKE_CURRENT_BINARY_DIR}/results/quickjs-microwalk-js/${SCRIPT_NAME};MW_TESTCASE_DIRECTORY=${CMAKE_SOURCE_DIR}/testcases/${SCRIPT_NAME};MW_TRACE_DIRECTORY=${CMAKE_CURRENT_BINARY_DIR}/results/quickjs-microwalk-js/${SCRIPT_NAME}/work/traces;MW_PATH_PREFIX=${CMAKE_CURRENT_BINARY_DIR}/results/quickjs-microwalk-js/${SCRIPT_NAME};MWRT_INSTALL_DIR=${MWRT_INSTALL_DIR};NODE_EXE=${NODE_EXE};RT_CMD=${QJS_INSTALL_DIR}/bin/qjs -m;RT=quickjs;TEST_BASE=${CMAKE_CURRENT_SOURCE_DIR}/microwalk-quickjs.js;LIBS_DIR=${CMAKE_SOURCE_DIR}/lib"
    )

    add_test(NAME nodejs-microwalk-js-${SCRIPT_NAME}
            COMMAND bash ${CMAKE_CURRENT_SOURCE_DIR}/target.sh
            WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
    )
    set_tests_properties(nodejs-microwalk-js-${SCRIPT_NAME} PROPERTIES
            LABELS nodejs-microwalk-js
            ENVIRONMENT "TARGET_NAME=nodejs-microwalk-js;CURRENT_DIR=${CMAKE_CURRENT_SOURCE_DIR};ROOT_DIR=${CMAKE_CURRENT_BINARY_DIR};SUBTARGET_NAME=${SCRIPT_NAME};SCRIPT_FILE=${SCRIPT_FILE};WORK_DIR=${CMAKE_CURRENT_BINARY_DIR}/results/nodejs-microwalk-js/${SCRIPT_NAME};MW_TESTCASE_DIRECTORY=${CMAKE_SOURCE_DIR}/testcases/${SCRIPT_NAME};MW_TRACE_DIRECTORY=${CMAKE_CURRENT_BINARY_DIR}/results/nodejs-microwalk-js/${SCRIPT_NAME}/work/traces;MW_PATH_PREFIX=${CMAKE_CURRENT_BINARY_DIR}/results/nodejs-microwalk-js/${SCRIPT_NAME};MWRT_INSTALL_DIR=${MWRT_INSTALL_DIR};NODE_EXE=${NODE_EXE};RT_CMD=${NODE_EXE};RT=nodejs;TEST_BASE=${CMAKE_CURRENT_SOURCE_DIR}/microwalk-nodejs.js;LIBS_DIR=${CMAKE_SOURCE_DIR}/lib"
    )
endforeach ()
