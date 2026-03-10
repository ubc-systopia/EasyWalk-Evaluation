import { secp256k1 } from "../lib/noble-curves-1.3.0/esm/secp256k1.js";

// Buffer.from(secp256k1.utils.randomPrivateKey())
export function processTestcase(testcaseBuffer) {
    const msg = new Uint8Array(32).fill(0x42);
    const priv = new Uint8Array(testcaseBuffer);
    const pub = secp256k1.getPublicKey(priv);
    const sig = secp256k1.sign(msg, priv);
    const valid = secp256k1.verify(sig, msg, pub) === true;
    console.log("    sig:", sig);
    console.log("    valid:", valid);
}
