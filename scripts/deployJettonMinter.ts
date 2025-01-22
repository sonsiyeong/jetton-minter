import { Address, toNano, fromNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { CONTENT } from '../src/assets';

export async function run(provider: NetworkProvider) {
    const sender = provider.sender();

    const senderAddress = provider.sender()?.address;
    if (!senderAddress) {
        throw new Error('Sender address is undefined.');
    }

    const jettonMinter = provider.open(
        JettonMinter.createFromConfig(
            {
                total_supply: 0n,
                admin_address: provider.sender().address!,
                content: CONTENT,
                jetton_wallet_code: await compile('JettonWallet'),
            },
            await compile('JettonMinter')
        )
    );

    let mintAddress = senderAddress;
    let mintAmount = 1000000;
    const nanoMint = toNano(mintAmount);

    const res = await jettonMinter.sendMint(sender, mintAddress, nanoMint, toNano('0.05'), toNano('0.1'));

    console.log(`Minting ${mintAmount} to ${mintAddress} and waiting 20s...`);

    await new Promise((resolve) => setTimeout(resolve, 20000));
    const supplyAfter = await jettonMinter.getTotalSupply();
}