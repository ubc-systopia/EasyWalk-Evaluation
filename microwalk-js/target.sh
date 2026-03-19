#!/usr/bin/env bash

set -e

mkdir -p "$WORK_DIR/js"
mkdir -p "$WORK_DIR/work/traces"

# Copy script to working directory, cleanup previous runs
export BUILD_SCRIPT_FILE="$WORK_DIR/js/$SUBTARGET_NAME.mjs"
cp -f "$SCRIPT_FILE" "$BUILD_SCRIPT_FILE"
find "$WORK_DIR/js" -type f -name "*mw*" -delete -print
cp -r "$LIBS_DIR" "$WORK_DIR"

# Append caller setup
echo -e "\n$(cat "$CURRENT_DIR/test.js")" >> "$BUILD_SCRIPT_FILE"

# Instrument and switch target file
pushd "${MWRT_INSTALL_DIR}/bin/JavascriptTracer"
$NODE_EXE "${MWRT_INSTALL_DIR}/bin/JavascriptTracer/instrument-file.mjs" "$BUILD_SCRIPT_FILE" "$RT"
popd
export BUILD_SCRIPT_FILE="$WORK_DIR/js/$SUBTARGET_NAME.mw.mjs"

# Rename .js files to .mjs so Node treats them as modules
find "$WORK_DIR/lib" -name "*.mw.js" -exec sh -c 'mv "$1" "${1%.js}.mjs"' _ {} \;

# Update references inside those files
find "$WORK_DIR" -name "*.mw.mjs" -exec sed -i 's/\.mw\.js/.mw.mjs/g' {} +

# Append wrapper script
echo -e "\n$(cat "$TEST_BASE")" >> "$BUILD_SCRIPT_FILE"

# Trace target
$RT_CMD "$BUILD_SCRIPT_FILE"

# Analyze target
"${MWRT_INSTALL_DIR}/bin/Microwalk" "${CURRENT_DIR}/source-config.yml" -p "${MWRT_INSTALL_DIR}/lib"
