// Used to generate tests for Noble Ciphers NPM library based on existing tests from that library
// Configuration for the tests can be configured here

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- File Configuration ---
const INPUT_FILE = path.join(__dirname, 'input', 'target-noble-ciphers-aes-ecb.json');
const OUTPUT_DIR = path.join(__dirname, 'output', 'target-noble-ciphers-aes-ecb');
// --- End of File Configuration ---

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function generateTestFiles() {
    try {
        const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
        const data = JSON.parse(rawData);
        const tests = data.tests;

        if (!Array.isArray(tests)) {
            throw new Error("JSON structure invalid: 'tests' array not found.");
        }

        // Configure to match the structure of the tests which you are parsing.
        tests.forEach((test, index) => {

            const keyBuffer = Buffer.from(test.key, 'hex');
            
            // dynamic or non-existent
            const ivBuffer = test.iv ? Buffer.from(test.iv, 'hex') : Buffer.alloc(0);

            const combined = Buffer.concat([keyBuffer, ivBuffer]);

            const fileName = `t${index}.testcase`;
            const filePath = path.join(OUTPUT_DIR, fileName);
            
            fs.writeFileSync(filePath, combined);

            console.log(`Extracted ${fileName}: Key(${keyBuffer.length}B) IV(${ivBuffer.length}B) Total(${combined.length}B)`);
        });

        console.log(`\nSuccess: Created ${tests.length} files in ${OUTPUT_DIR}`);
    } catch (err) {
        console.error("Error processing tests:", err.message);
    }
}

// Test parseer for xsalsa
function generateTestFilesFromList() {
    try {
        const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
        const tests = JSON.parse(rawData);

        if (!Array.isArray(tests)) {
            throw new Error("JSON structure invalid: Expected an array of test cases.");
        }

        tests.forEach((test, index) => {
            // Index 0 is Key (Base64), Index 1 is IV (Base64)
            const keyBuffer = Buffer.from(test[0], 'base64');
            const ivBuffer = Buffer.from(test[1], 'base64');

            // Verify lengths to ensure they match your processTestcase (32 + 24)
            if (keyBuffer.length !== 32 || ivBuffer.length !== 24) {
                console.warn(`Skipping t${index}: Invalid lengths (Key: ${keyBuffer.length}, IV: ${ivBuffer.length})`);
                return;
            }

            const combined = Buffer.concat([keyBuffer, ivBuffer]);

            const fileName = `t${index}.testcase`;
            const filePath = path.join(OUTPUT_DIR, fileName);
            
            fs.writeFileSync(filePath, combined);

            console.log(`Extracted ${fileName}: Key(${keyBuffer.length}B) IV(${ivBuffer.length}B) Total(${combined.length}B)`);
        });

        console.log(`\nSuccess: Created ${tests.length} files in ${OUTPUT_DIR}`);
    } catch (err) {
        console.error("Error processing tests:", err.message);
    }
}

generateTestFiles();
// generateTestFilesFromList();