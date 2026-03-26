import fs from 'node:fs';
import path from 'node:path';
import { secp256k1 } from "../lib/noble-curves-1.3.0/esm/secp256k1.js";
import { secp256r1 } from "../lib/noble-curves-1.3.0/esm/p256.js";
import { secp384r1 } from "../lib/noble-curves-1.3.0/esm/p384.js";
import { secp521r1 } from "../lib/noble-curves-1.3.0/esm/p521.js";
import { ed448 } from "../lib/noble-curves-1.3.0/esm/ed448.js";
import { ed25519 } from "../lib/noble-curves-1.3.0/esm/ed25519.js";
import { schnorr } from "../lib/noble-curves-1.3.0/esm/secp256k1.js";
import { x448 } from "../lib/noble-curves-1.3.0/esm/ed448.js";
import { x25519 } from "../lib/noble-curves-1.3.0/esm/ed25519.js";

const OUTPUT_DIR = './output/target-noble-curves-x25519';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Builds generate tests for asymmetric keys
function generateRandomTestCases(count = 15) {
    for (let i = 0; i < count; i++) {
        // Replace combined with key function and buffer generation.
        const combined = Buffer.concat([Buffer.from(x25519.utils.randomPrivateKey()), Buffer.from(x25519.getPublicKey(x25519.utils.randomPrivateKey()))]);
        // const combined = Buffer.from(schnorr.utils.randomPrivateKey());

        const fileName = `t${i}.testcase`;
        const filePath = path.join(OUTPUT_DIR, fileName);
        fs.writeFileSync(filePath, combined);

        console.log(`Generated ${fileName}: Total ${combined.length} bytes`);
    }
}

generateRandomTestCases(15);