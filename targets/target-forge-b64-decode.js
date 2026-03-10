import forge from "../lib/node-forge-1.3.1/lib/index.js";

export function processTestcase(testcaseBuffer) {
    const message = forge.util.createBuffer(testcaseBuffer).toString();
    const binary = forge.util.decode64(message);
}
