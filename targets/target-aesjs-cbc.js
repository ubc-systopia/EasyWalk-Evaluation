import aesjs from "../lib/aes-js-3.1.2/index.js";

export function processTestcase(testcaseBuffer) {
    const message = new Uint8Array([
        1, 1, 2, 2, 3, 3, 4, 4, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8,
        5, 5, 6, 6, 7, 7, 8, 8,
    ]);
    const iv = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const key = new Uint8Array(testcaseBuffer);
    const aes = new aesjs.ModeOfOperation.cbc(key, iv);

    const encryptedBytes = aes.encrypt(message);
    console.log(encryptedBytes);
    const decryptedBytes = aes.decrypt(encryptedBytes);
    console.log(decryptedBytes);
}
