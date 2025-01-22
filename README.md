# Jetton Minter

`JettonMinter` 리포지토리는 blueprint framework를 사용하여 간편하게 Jetton을 만들 수 있습니다. 자세한 사용 방법은 아래 내용을 참고해주세요.

## Architecture

`contracts`: `jetton_minter.fc`를 통해 Jetton Master를 제작히며, `jetton_wallet.fc`를 통해 Master에서 개인에게 Jetton Wallet을 배포할 수 있습니다.

`scripts`: `deployJettonMinter.ts`를 통해 Jetton을 쉽게 배포할 수 있습니다.

`src`: `assets.ts`를 통해 Jetton 정보를 입력합니다.

`wrappers`: contract와 상호작용하기 위한 함수를 정리합니다.

## 사용방법

이 리포지토리를 가져옵니다.

```bash
git clone [repository 주소]
git clone https://github.com/oueya1479/jetton-minter
```

npm으로 node_modules를 불러옵니다.

```bash
npm install
```

/src/assets.ts에서 토큰 정보를 입력해주세요. TON에서의 decimals는 보통 9를 사용합니다.

```bash
export const CONTENT: Cell = buildOnchainMetadata({
    name: "[NAME]",
    description: "[DESCRIPTION]",
    symbol: "[SYMBOL]",
    decimals: "9", 
    image: "[IMAGE_URL]"
});
```

다음 실행코드를 입력해주세요

```bash
# blueprint로 deployJettonMinter.ts 실행
npx blueprint run

# testnet 선택 [Mainnet에 배포하고 싶을 경우 mainnet 선택]
mainnet
> testnet
custom

# Wallet 사용법 선택
> TON Connect compatible mobile wallet (example: Tonkeeper)
Create a ton:// deep link
Mnemonic

# Wallet 선택 (TONKEEPER 선호)
> Tonkeeper
MyTonWallet
Tonhub

# Tonkeeper 앱에서 QR 촬영 후 Connect Wallet
# 연결되면 자동으로 트랜잭션 컨펌화면이 출력 됨
# 배포 완료시 https://testnet.tonviewer.com/[지갑주소] 에서 트랜잭션 확인 가능
# 메인넷 배포 시 https://tonviewer.com/[지갑주소] 에서 트랜잭션 확인 가능