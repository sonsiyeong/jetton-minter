import { Address, Cell, toNano } from "@ton/core";
import { buildOnchainMetadata } from "./jetton-helpers";
import { compile } from "@ton/blueprint";

export const CONTENT: Cell = buildOnchainMetadata({
    name: "PIKMINS",
    description: "MY PIKMIN",
    symbol: "PIKMIN",
    decimals: "9",
    image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTi5809qXLKLT2Lk0d6Rzc3-BxC-ULm2dy32VVR3zFMGODjpBFNrYrHojFV_-iUWDCFejUK0eNAbt5BAAy1Aa5bR_EZhslSKcmmjywSsA"
});

export async function generateWalletArgs(owner_address: Address, jetton_master_address: Address): Promise<any> {
    return {
        balance: 0n,                                        // jetton wallet balance
        owner_address: owner_address,                       // jetton wallet owner
        jetton_master_address: jetton_master_address,       // jetton master address
        jetton_wallet_code: await compile('JettonWallet')   // jetton wallet code
    };
}