import forge from "../lib/node-forge-1.3.1/lib/index.js";

export function processTestcase(testcaseBuffer) {
    const message = forge.util.createBuffer();
    message.putString("aaaabbbbaaaabbbbaaaabbbbaaaabbbb");

    const privateKey = forge.pki.ed25519.privateKeyFromAsn1(
        forge.asn1.fromDer(forge.util.createBuffer(testcaseBuffer)),
    );

    const md = forge.md.sha1.create();
    md.update(message.bytes(), "raw");

    const signature = forge.pki.ed25519.sign({
        md: md,
        privateKey: privateKey.privateKeyBytes,
    });
}
