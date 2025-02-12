# SPL Token概述
SPL Token是 Solana 区块链的原生代币标准，提供了一套规则和协议，用于管理代币在 Solana 网络上的行为和交互方式。这种标准化确保了代币的一致性、互操作性以及在 Solana 生态系统中众多应用程序和平台上的轻松集成

# 安装命令行
需要提前安装Rust，然后运行：
```bash
cargo install spl-token-cli
```
运行spl-token --help以获取可用命令的完整描述。

# 配置环境
获取当前solana的环境：
```bash
$ solana config get
Config File: /home/xq/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: /home/xq/.config/solana/id.json
Commitment: confirmed
```
为了方便测试，我们直接将`RPC URL`设置为本地：
```bash
solana config set -ul
```
启动本地节点：
```bash
solana-test-validator
```
这样我们就在本地启动了一个验证节点，所有的操作都是本地环境进行。

# 创建SPL Token

```bash
spl-token create-token
Creating token CLQybYuKonjL4ntwNUJiqMTnGGKKJQqGPhGfaQrAMTea under program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

Address:  CLQybYuKonjL4ntwNUJiqMTnGGKKJQqGPhGfaQrAMTea
Decimals:  9

Signature: 2kQDS91WhFexDZZB2EdWKRSEEsfm2eYf2mj8APBkjMBZjSqXtfpck3NERKWUVYggP2bshq76VGkiJ1JP6P4SKbm9
```
`CLQybYuKonjL4ntwNUJiqMTnGGKKJQqGPhGfaQrAMTea`就是新创建token的地址，`Decimals`默认是9，如果需要更改，可以传参`--decimals 6`;

# 创建代币账户
在 `Solana` 中，每个账户还需要用一个专门的`token account`去存相应的代币。
所以，我们需要先给我们的账户创建一个`token account`,用来存储`token：CLQybYuKonjL4ntwNUJiqMTnGGKKJQqGPhGfaQrAMTea`。

`spl-token create-account <TOKEN_ADDRESS>` 将 `<TOKEN_ADDRESS>` 替换为你在上一步中获得的代币地址。

```bash
spl-token create-account CLQybYuKonjL4ntwNUJiqMTnGGKKJQqGPhGfaQrAMTea
Creating account 5wL4218GV5dnDKJqEQuDj3D27bgp8GeMCXNBeqjVDWDi

Signature: mbQSChvPCHV2jdrRkDJLJg1F6b9ueQDYdGUGUoChZxZEsbCqC4t9n3AU6fbN6hqwuvXWc42vzrgNnrVBux8GJik
```
# 铸造代币
现在开始铸造代币, 可以先使用`spl-token mint -h`查看一下命令格式。
```bash
spl-token mint -h
spl-token-mint
Mint new tokens

USAGE:
    spl-token mint [FLAGS] [OPTIONS] <TOKEN_MINT_ADDRESS> <TOKEN_AMOUNT> [--] [RECIPIENT_TOKEN_ACCOUNT_ADDRESS]
```
向账户内铸造 10000 枚代币.
```bash
spl-token mint CLQybYuKonjL4ntwNUJiqMTnGGKKJQqGPhGfaQrAMTea 10000
Minting 10000 tokens
  Token: CLQybYuKonjL4ntwNUJiqMTnGGKKJQqGPhGfaQrAMTea
  Recipient: 5wL4218GV5dnDKJqEQuDj3D27bgp8GeMCXNBeqjVDWDi

Signature: 65r9EaY9nSmbg5rJuCFZgzbrqUZYthay9swuqo1mMMjzAHhr2dBTMnn6DeQH6NqvPcoWapT3Pi3ZgVBxQA1Ccxs9
```
查询账户余额。
```bash
spl-token balance CLQybYuKonjL4ntwNUJiqMTnGGKKJQqGPhGfaQrAMTea
10000
```
# 转移代币
使用`spl-token transfer <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS>`可以进行转账，`--allow-unfunded-recipient`和`--fund-recipient`分别是为了允许接收账户在没有资金和创建`token account`的情况下完成交易。
```bash
spl-token transfer --allow-unfunded-recipient   --fund-recipient CLQybYuKonjL4ntwNUJiqMTnGGKKJQqGPhGfaQrAMTea 50 vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg
Transfer 50 tokens
  Sender: 5wL4218GV5dnDKJqEQuDj3D27bgp8GeMCXNBeqjVDWDi
  Recipient: vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg
  Recipient associated token account: 2q2Q5fx3oCjFjsVPanWESvMXoiHJatvqeyrTJ8iugjf7
  Funding recipient: 2q2Q5fx3oCjFjsVPanWESvMXoiHJatvqeyrTJ8iugjf7

Signature: 4RUGZy8sronCcMAHHpySR47GaDtP33hMzZXspg1MFnLE88nzz1oe2trp5Gqbh8FVZ6nVodurwdx38XYdiiBRV6ww
```
查询账户余额，
```bash
spl-token balance --address 2q2Q5fx3oCjFjsVPanWESvMXoiHJatvqeyrTJ8iugjf7
50
```
# 销毁代币

  ```bash
  spl-token burn <TOKEN_ADDRESS> <AMOUNT>
  ```

# 权限管理

  ```bash
  spl-token authorize -h
  ```