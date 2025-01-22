import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from '@ton/core';

export type JettonMinterConfig = {
    total_supply: bigint;
    admin_address: Address;
    content: Cell;
    jetton_wallet_code: Cell;
};

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
    return beginCell()
        .storeCoins(config.total_supply)
        .storeAddress(config.admin_address)
        .storeRef(config.content)
        .storeRef(config.jetton_wallet_code)
        .endCell();
}

export class JettonMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonMinter(address);
    }

    static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
        const data = jettonMinterConfigToCell(config);
        const init = { code, data };
        return new JettonMinter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    static mintMessage(
        from: Address,
        to: Address,
        jetton_amount: bigint,
        forward_ton_amount: bigint,
        total_ton_amount: bigint,
        query_id: number | bigint = 0,
    ) {
        const mintMsg = beginCell()
            .storeUint(0x178d4519, 32)
            .storeUint(0, 64)
            .storeCoins(jetton_amount)
            .storeAddress(null)
            .storeAddress(from)
            .storeCoins(forward_ton_amount)
            .storeMaybeRef(null)
            .endCell();

        return beginCell()
            .storeUint(21, 32)
            .storeUint(query_id, 64)
            .storeAddress(to)
            .storeCoins(total_ton_amount)
            .storeCoins(jetton_amount)
            .storeRef(mintMsg)
            .endCell();
    }

    async sendMint(
        provider: ContractProvider,
        via: Sender,
        to: Address,
        jetton_amount: bigint,
        forward_ton_amount: bigint,
        total_ton_amount: bigint,
    ) {
        if (total_ton_amount <= forward_ton_amount) {
            throw new Error('Total ton amount should be > forward amount');
        }
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.mintMessage(this.address, to, jetton_amount, forward_ton_amount, total_ton_amount),
            value: total_ton_amount + toNano('0.015'),
        });
    }

    async getJettonData(provider: ContractProvider) {
        let res = await provider.get('get_jetton_data', []);
        let totalSupply = res.stack.readBigNumber();
        let mintable = res.stack.readBoolean();
        let adminAddress = res.stack.readAddress();
        let content = res.stack.readCell();
        let walletCode = res.stack.readCell();
        return {
            totalSupply,
            mintable,
            adminAddress,
            content,
            walletCode,
        };
    }

    async getTotalSupply(provider: ContractProvider) {
        let res = await this.getJettonData(provider);
        return res.totalSupply;
    }
}
