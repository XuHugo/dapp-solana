import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Voting } from '../target/types/voting'
import { BankrunProvider, startAnchor } from 'anchor-bankrun';

const IDL = require('../target/idl/voting.json');
const votingAddress = new PublicKey("75HvzP19wM3b1q9mdXcAkGK8rnYZ5Dsa4PXn2kvszQz5");

describe('voting', () => {

  let context;
  let provider;
  //let votingProgram: anchor.Program<Voting>;
  anchor.setProvider(anchor.AnchorProvider.env());
  let votingProgram = anchor.workspace.Voting as Program<Voting>;

  beforeAll(async () => {
    /*context = await startAnchor(
      "",
      [{ name: "voting", programId: votingAddress }],
      []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider);*/
  })

  it('Initialize Poll', async () => {

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "FL",
      new anchor.BN(0),
      new anchor.BN(1748166397),
      "favorite language",
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );
    const poll = await votingProgram.account.pollAccount.fetch(
      pollAddress
    );
    console.log(poll);
    expect(poll.pollName).toEqual("FL");
    expect(poll.pollVotingStart.toNumber()).toEqual(0);
  })

  it('Initialize Candidate', async () => {
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),
      "Rust",
    ).accounts({
      pollAccount: pollAddress
    })
      .rpc();

    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),
      "Typescript",
    ).accounts({
      pollAccount: pollAddress
    })
      .rpc();

    const [candidateAddress1] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Rust")],
      votingAddress
    );
    const candidate1 = await votingProgram.account.candidateAccount.fetch(
      candidateAddress1
    );
    console.log(candidate1);
    const [candidateAddress2] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Typescript")],
      votingAddress
    );
    const candidate2 = await votingProgram.account.candidateAccount.fetch(
      candidateAddress2
    );
    console.log(candidate2);

    expect(candidate1.candidateName).toEqual("Rust");
    expect(candidate2.candidateName).toEqual("Typescript");
  })

  it('vote', async () => {
    await votingProgram.methods.vote(
      new anchor.BN(1),
      "Rust",
    ).rpc();

    const [candidateAddress1] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Rust")],
      votingAddress
    );
    const candidate1 = await votingProgram.account.candidateAccount.fetch(
      candidateAddress1
    );
    console.log(candidate1);
    expect(candidate1.candidateName).toEqual("Rust");
    expect(candidate1.candidateVotes.toNumber()).toEqual(1);
  })

})
