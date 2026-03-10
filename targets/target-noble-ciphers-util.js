import {
    bytesToHex,
    hexToBytes,
} from "../lib/noble-ciphers-0.5.1/esm/utils.js";

// 64
export function processTestcase(testcaseBuffer) {
    const array = new Uint8Array(testcaseBuffer);
    const inputStr = String.fromCharCode.apply(null, array);
    const data = hexToBytes(inputStr);
    const newStr = bytesToHex(data);
    console.log("    in:", inputStr);
    console.log("    out:", newStr);
}
