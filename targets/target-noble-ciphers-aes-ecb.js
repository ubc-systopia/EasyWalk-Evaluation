import { ecb } from "../lib/noble-ciphers-0.5.1/esm/aes.js";

// 32
export function processTestcase(testcaseBuffer) {
    const message = new Uint8Array([
        1, 1, 2, 2, 3, 3, 4, 4, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8,
        5, 5, 6, 6, 7, 7, 8, 8,
    ]);
    const key = new Uint8Array(testcaseBuffer.slice(0, 32));
    const cipher = ecb(key);
    const encrypted = cipher.encrypt(message);
    console.log(encrypted);
    const decrypted = cipher.decrypt(encrypted);
    console.log(decrypted);
}
