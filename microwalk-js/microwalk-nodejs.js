import fs from "fs";

const testcase_dir = process.env["MW_TESTCASE_DIRECTORY"];
if (!testcase_dir) {
    console.log("Could not get MW_TRACE_DIRECTORY");
    process.exit(1);
}

const trace_dir = process.env["MW_TRACE_DIRECTORY"];
if (!trace_dir) {
    console.log("Could not get MW_TRACE_DIRECTORY");
    process.exit(2);
}

const testcases = fs.readdirSync(testcase_dir);
const filenames = testcases.filter((f) => !f.startsWith("."));

if (!processTestcase) {
    console.log("Could not get target function");
    process.exit(5);
}

console.log(`Running testcase 0 as trace prefix`);
console.log("  prefix begin");
const prefixBuffer = fs.readFileSync(`${testcase_dir}/t0.testcase`);
processTestcase(prefixBuffer);
console.log("  prefix end");

for (let i = 0; i < filenames.length; i++) {
    console.log(`Running testcase ${i}`);

    const testcaseBuffer = fs.readFileSync(`${testcase_dir}/${filenames[i]}`);
    if (!testcaseBuffer) {
        console.log("Could not read testcase file: " + filenames[i]);
        process.exit(6);
    }
    const input = testcaseBuffer;

    console.log("  begin");
    test(input);
    console.log("  end");
}
