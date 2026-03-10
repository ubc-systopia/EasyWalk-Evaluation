import { x448 } from "../lib/noble-curves-1.3.0/esm/ed448.js";

// Buffer.concat([Buffer.from(x448.utils.randomPrivateKey()), Buffer.from(x448.getPublicKey(x448.utils.randomPrivateKey()))])
export function processTestcase(testcaseBuffer) {
    const priv = new Uint8Array(testcaseBuffer.subarray(0, 56));
    const pub = new Uint8Array(testcaseBuffer.subarray(56));
    const shared = x448.getSharedSecret(priv, pub);
    console.log("    shared:", shared);
}
