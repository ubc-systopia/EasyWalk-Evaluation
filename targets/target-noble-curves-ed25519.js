import { ed25519 } from "../lib/noble-curves-1.3.0/esm/ed25519.js";

// Buffer.from(ed25519.utils.randomPrivateKey())
export function processTestcase(testcaseBuffer) {
    const msg = new Uint8Array(32).fill(0x42);
    const priv = new Uint8Array(testcaseBuffer);
    const pub = ed25519.getPublicKey(priv);
    const sig = ed25519.sign(msg, priv);
    const valid = ed25519.verify(sig, msg, pub) === true;
    console.log("    sig:", sig);
    console.log("    valid:", valid);
}
