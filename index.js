const bip39 = require('bip39');
const crypto = require('crypto');
const HDWallet = require('ethereum-hdwallet');
const prompt = require('prompt');

prompt.start();

prompt.get(['prefix'], function (err, result) {
    if (err) { return onErr(err); }
    vanityAddressGenerator(result.prefix);
});

vanityAddressGenerator = (prefix) => {
    let entropy;
    let tried = 0;
    const path = "m/44'/60'/0'/0/0";

    while (1) {
        tried++;
        console.log(`#${tried} try`);

        entropy = crypto.randomBytes(16);

        const mnemonic = bip39.entropyToMnemonic(entropy)
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        const wallet = HDWallet.fromSeed(seed)
        const address = wallet.derive(path).getAddress().toString('hex')
        if (address.slice(0, prefix.length) == prefix) {
            console.log(`Vanity address found!`);
            console.log(`Address: 0x${address}`);
            console.log(`Private key: ${wallet.derive(path).getPrivateKey().toString('hex')}`);
            console.log(`Recovery phrase: ${mnemonic}`)
            break;
        }
    }
}