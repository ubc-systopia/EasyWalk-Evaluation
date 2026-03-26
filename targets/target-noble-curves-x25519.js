import { x25519 } from "../lib/noble-curves-1.3.0/esm/ed25519.js";

// Buffer.concat([Buffer.from(x25519.utils.randomPrivateKey()), Buffer.from(x25519.getPublicKey(x25519.utils.randomPrivateKey()))])
export function processTestcase(testcaseBuffer) {
    const priv = new Uint8Array(testcaseBuffer.slice(0, 32));
    const pub = new Uint8Array(testcaseBuffer.slice(32));
    const shared = x25519.getSharedSecret(priv, pub);
    console.log("    shared:", shared);
}
