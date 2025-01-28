import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Voting } from '../target/types/voting'
import { BankrunProvider, startAnchor } from 'anchor-bankrun';

const IDL = require('../target/idl/voting.json');
const votingAddress = new PublicKey("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

describe('voting', () => {

  let context;
  let provider;
  let votingProgram: anchor.Program<Voting>;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "voting", programId: votingAddress }],
      []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider);
  })

  it('Initialize Poll', async () => {

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "WIB",
      new anchor.BN(0),
      new anchor.BN(1738166397),
      "Who is the best?",
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );
    const poll = await votingProgram.account.pollAccount.fetch(
      pollAddress
    );
    console.log(poll);
    expect(poll.pollName).toEqual("WIB");
    expect(poll.pollVotingStart.toNumber()).toEqual(0);
  })

  it('Initialize Candidate', async () => {
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),
      "Kent",
    ).accounts({
      pollAccount: pollAddress
    })
      .rpc();

    await votingProgram.methods.initializeCandidate(
      new anchor.BN(1),
      "Andy",
    ).accounts({
      pollAccount: pollAddress
    })
      .rpc();

    const [candidateAddress1] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Kent")],
      votingAddress
    );
    const candidate1 = await votingProgram.account.candidateAccount.fetch(
      candidateAddress1
    );
    console.log(candidate1);
    const [candidateAddress2] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Andy")],
      votingAddress
    );
    const candidate2 = await votingProgram.account.candidateAccount.fetch(
      candidateAddress2
    );
    console.log(candidate2);

    expect(candidate1.candidateName).toEqual("Kent");
    expect(candidate2.candidateName).toEqual("Andy");
  })

  it('vote', async () => {
    await votingProgram.methods.vote(
      new anchor.BN(1),
      "Kent",
    ).rpc();

    const [candidateAddress1] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Kent")],
      votingAddress
    );
    const candidate1 = await votingProgram.account.candidateAccount.fetch(
      candidateAddress1
    );
    console.log(candidate1);
    expect(candidate1.candidateName).toEqual("Kent");
    expect(candidate1.candidateVotes.toNumber()).toEqual(1);
  })

})
