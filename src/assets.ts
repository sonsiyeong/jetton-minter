import { Address, Cell, toNano } from "@ton/core";
import { buildOnchainMetadata } from "./ton-helpers";
import { compile } from "@ton/blueprint";

export const CONTENT: Cell = buildOnchainMetadata({
    name: "NavigaTion",
    description: "MY Tion",
    symbol: "NavigaTion",
    decimals: "9",
    image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTi5809qXLKLT2Lk0d6Rzc3-BxC-ULm2dy32VVR3zFMGODjpBFNrYrHojFV_-iUWDCFejUK0eNAbt5BAAy1Aa5bR_EZhslSKcmmjywSsA"
});

export async function generateWalletArgs(owner_address: Address, jetton_master_address: Address): Promise<any> {
    return {
        balance: 0n,                                        // ton wallet balance
        owner_address: owner_address,                       // ton wallet owner
        jetton_master_address: ton_master_address,       // ton master address
        jetton_wallet_code: await compile('TonWallet')   // ton wallet code
    };
}
