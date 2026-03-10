import { ed448 } from "../lib/noble-curves-1.3.0/esm/ed448.js";

// Buffer.from(ed448.utils.randomPrivateKey())
export function processTestcase(testcaseBuffer) {
    const msg = new Uint8Array(32).fill(0x42);
    const priv = new Uint8Array(testcaseBuffer);
    const pub = ed448.getPublicKey(priv);
    const sig = ed448.sign(msg, priv);
    const valid = ed448.verify(sig, msg, pub) === true;
    console.log("    sig:", sig);
    console.log("    valid:", valid);
}
