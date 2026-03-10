import forge from "../lib/node-forge-1.3.1/lib/index.js";

export function processTestcase(testcaseBuffer) {
    const message = new forge.util.ByteBuffer([
        1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4,
    ]);
    const key = new forge.util.ByteBuffer(testcaseBuffer);

    const cipher = forge.cipher.createCipher("AES-ECB", key);
    cipher.start({});
    cipher.update(message);
    cipher.finish();

    const encrypted = cipher.output;
}
