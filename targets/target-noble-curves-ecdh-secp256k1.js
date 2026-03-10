import { secp256k1 } from "../lib/noble-curves-1.3.0/esm/secp256k1.js";

// Buffer.concat([Buffer.from(secp256k1.utils.randomPrivateKey()), Buffer.from(secp256k1.getPublicKey(secp256k1.utils.randomPrivateKey()))])
export function processTestcase(testcaseBuffer) {
    const priv = new Uint8Array(testcaseBuffer.subarray(0, 32));
    const pub = new Uint8Array(testcaseBuffer.subarray(32));
    const shared = secp256k1.getSharedSecret(priv, pub);
    console.log("    shared:", valid);
}
