import forge from "../lib/node-forge-1.3.1/lib/index.js";

export function processTestcase(testcaseBuffer) {
    const binary = forge.util.createBuffer(testcaseBuffer);
    const b64message = forge.util.encode64(binary.data);
}
