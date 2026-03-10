import { schnorr } from "../lib/noble-curves-1.3.0/esm/secp256k1.js";

// Buffer.from(schnorr.utils.randomPrivateKey())
export function processTestcase(testcaseBuffer) {
    const msg = new Uint8Array(32).fill(0x42);
    const priv = new Uint8Array(testcaseBuffer);
    const pub = schnorr.getPublicKey(priv);
    const sig = schnorr.sign(msg, priv);
    const valid = schnorr.verify(sig, msg, pub) === true;
    console.log("    sig:", sig);
    console.log("    valid:", valid);
}
