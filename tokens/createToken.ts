import {
    getKeypairFromFile,
    getExplorerLink,
} from "@solana-developers/helpers";
import {
    Account,
    createMint,
    transfer, getOrCreateAssociatedTokenAccount,
    mintTo, getAccount, TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import "dotenv/config";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Signer } from "@solana/web3.js";

const web3 = require('@solana/web3.js');
const connection = new web3.Connection('http://localhost:8899', 'confirmed');
let user: Keypair;
let mint: PublicKey;
let tokenAccount: Account;

async function createToken() {
    user = await getKeypairFromFile();

    await connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL);

    console.log(
        `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
    );

    mint = await createMint(connection, user, user.publicKey, null, 2);
    console.log(
        `🔑 TokenMint public key is: ${mint.toBase58()}`
    );

    const link = getExplorerLink("address", mint.toString(), "localnet");

    console.log(`✅ Success! Created token mint: ${link}`);
}

async function createATA() {

    tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        user,
        mint,
        user.publicKey
    );
    console.log(`Created new token account: ${tokenAccount.address.toBase58()}`);
}

async function mintToAccount() {
    const transactionSignature = await mintTo(
        connection,
        user,
        mint,
        tokenAccount.address,
        user,
        1000000000
    );
    const link = getExplorerLink("transaction", transactionSignature, "localnet");

    console.log(`✅ Success! Mint Token Transaction: ${link}`);

    const accountInfo = await getAccount(connection, tokenAccount.address, undefined, TOKEN_PROGRAM_ID);
    console.log(`Token balance: ${accountInfo.amount}`);
}

async function TransferToken() {
    const receiver = Keypair.generate();
    let fromAirdropSignature = await connection.requestAirdrop(receiver.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(fromAirdropSignature);

    console.log(
        `🔑 Receiver public key is: ${receiver.publicKey.toBase58()}`
    );

    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        user,
        mint,
        receiver.publicKey
    );
    console.log(
        `🔑 Receiver ATA public key is: ${receiverTokenAccount.address.toBase58()}`
    );

    const signature = await transfer(
        connection,
        user,
        tokenAccount.address,
        receiverTokenAccount.address,
        user,
        10000
    );

    const explorerLink = getExplorerLink("transaction", signature, "devnet");

    console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}!`);

    const accountInfo = await getAccount(connection, receiverTokenAccount.address, undefined, TOKEN_PROGRAM_ID);
    console.log(`Token balance: ${accountInfo.amount}`);
}

async function main() {
    await createToken();
    await createATA();
    await mintToAccount();
    await TransferToken();
}

main();