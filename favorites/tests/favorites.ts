import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { getCustomErrorMessage } from "@solana-developers/helpers";
import { assert } from "chai";
import { Favorites } from "../target/types/favorites";
import { systemProgramErrors } from "./system-errors";
const web3 = anchor.web3;

describe("favorites", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const user = (provider.wallet as anchor.Wallet).payer;
  const someRandomGuy = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Favorites as Program<Favorites>;

  const favoriteNumber = new anchor.BN(23);
  const favoriteColor = "blue";
  const favoriteHobbies = ["programming", "sailing", "reading"];



  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(favoriteNumber, favoriteColor, favoriteHobbies)
      .signers([user])
      .rpc();
    console.log(tx);
    const favoritesPdaAndBump = web3.PublicKey.findProgramAddressSync([Buffer.from('favourites'), user.publicKey.toBuffer()], program.programId);
    const favoritesPda = favoritesPdaAndBump[0];
    console.log(favoritesPdaAndBump);
    const dataFromPda = await program.account.favorites.fetch(favoritesPda);
    console.log(dataFromPda);
    assert.equal(dataFromPda.number.toString(), favoriteNumber.toString());
    assert.equal(dataFromPda.color, favoriteColor);
    assert.deepEqual(dataFromPda.hobbies, favoriteHobbies);
  });

  it("update", async () => {
    const nfavoriteNumber = new anchor.BN(24);
    const nfavoriteColor = "red";
    const nfavoriteHobbies = ["programming", "sailing", "reading", "skiing"];

    try {
      await program.methods.initialize(nfavoriteNumber, nfavoriteColor, nfavoriteHobbies).signers([user]).rpc();
    } catch (error) {
      console.error((error as Error).message);
      const customErrorMessage = getCustomErrorMessage(systemProgramErrors, error);
      throw new Error(customErrorMessage);
    }
  });

  it("reject tx", async () => {
    try {
      await program.methods.initialize(favoriteNumber, favoriteColor, favoriteHobbies).signers([someRandomGuy]).rpc();
    } catch (error) {
      const errorMessage = (error as Error).message;
      assert.isTrue(errorMessage.includes("unknown signer"));
    }
  });

});
