import * as std from "std";
import * as os from "os";

const testcase_dir = std.getenv("MW_TESTCASE_DIRECTORY");
if (!testcase_dir) {
    console.log("Could not get MW_TRACE_DIRECTORY");
    std.exit(1);
}

const trace_dir = std.getenv("MW_TRACE_DIRECTORY");
if (!trace_dir) {
    console.log("Could not get MW_TRACE_DIRECTORY");
    std.exit(2);
}

const [testcases, err] = os.readdir(testcase_dir);
if (err) {
    console.log("Could not list testcases");
    std.exit(3);
}
const filenames = testcases.filter((f) => !f.startsWith("."));

if (!processTestcase) {
    console.log("Could not get target function");
    std.exit(5);
}

console.log(`Running testcase 0 as trace prefix`);
console.log("  prefix begin");
const prefixBuffer = readFileToBuffer(`${testcase_dir}/t0.testcase`);
processTestcase(prefixBuffer);
console.log("  prefix end");

for (let i = 0; i < filenames.length; i++) {
    console.log(`Running testcase ${i}`);

    const testcaseBuffer = readFileToBuffer(`${testcase_dir}/${filenames[i]}`);
    if (!testcaseBuffer) {
        console.log("Could not read testcase file: " + filenames[i]);
        std.exit(6);
    }
    const input = testcaseBuffer;

    console.log("  begin");
    test(input);
    console.log("  end");
}

function readFileToBuffer(file) {
    const [{ size }, e] = os.stat(file);
    if (e) throw new Error(`Failed to obtain testcase file size: ${file}`);
    const buf = new ArrayBuffer(size);
    const f = std.open(file, "rb");
    if (!f) throw new Error(`Failed to read testcase file: ${file}`);
    f.read(buf, 0, size);
    f.close();
    return buf;
}
