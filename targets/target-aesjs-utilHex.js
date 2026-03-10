import aesjs from "../lib/aes-js-3.1.2/index.js";

export function processTestcase(testcaseBuffer) {
    const array = new Uint8Array(testcaseBuffer);
    const inputStr = String.fromCharCode.apply(null, array);
    const data = aesjs.utils.hex.toBytes(inputStr);
    const newStr = aesjs.utils.hex.fromBytes(data);

    console.log("    in:", inputStr);
    console.log("    out:", newStr);
}
