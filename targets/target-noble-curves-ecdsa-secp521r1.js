import { secp521r1 } from "../lib/noble-curves-1.3.0/esm/p521.js";

// Buffer.from(secp521r1.utils.randomPrivateKey())
export function processTestcase(testcaseBuffer) {
    const msg = new Uint8Array(32).fill(0x42);
    const priv = new Uint8Array(testcaseBuffer);
    const pub = secp521r1.getPublicKey(priv);
    const sig = secp521r1.sign(msg, priv);
    const valid = secp521r1.verify(sig, msg, pub) === true;
    console.log("    sig:", sig);
    console.log("    valid:", valid);
}
