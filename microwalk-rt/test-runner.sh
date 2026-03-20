#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <executable> <file> <directory>"
    exit 1
fi

EXEC="$1"
INPUT_FILE="$2"
DIR="$3"

if [ ! -x "$EXEC" ]; then
    echo "Error: executable '$EXEC' not found or not executable"
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: file '$INPUT_FILE' not found"
    exit 1
fi

if [ ! -d "$DIR" ]; then
    echo "Error: directory '$DIR' not found"
    exit 1
fi

# Generate command stream and pipe into executable
{
    testcase_id=1

    # Find all .testcase files (sorted for determinism)
    find "$DIR" -type f -name '*.testcase' | sort | while read -r testcase; do
        echo "t $testcase_id"
        echo "$testcase"
        testcase_id=$((testcase_id + 1))
    done

    # Send exit command
    echo "e 0"
} | "$EXEC" "$INPUT_FILE"
