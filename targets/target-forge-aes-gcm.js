import forge from "../lib/node-forge-1.3.1/lib/index.js";

// 32 + 24
export function processTestcase(testcaseBuffer) {
    const message = forge.util.createBuffer();
    message.putString("aaaabbbbaaaabbbbaaaabbbbaaaabbbb");

    const iv = forge.util.createBuffer();
    iv.putString("aaaabbbbcccc");

    const key = forge.util.createBuffer(testcaseBuffer);

    const cipher = forge.cipher.createCipher("AES-GCM", key);

    cipher.start({ iv: iv.bytes(12) });
    cipher.update(message);
    cipher.finish();

    const encrypted = cipher.output;
    const tag = cipher.mode.tag;
}
