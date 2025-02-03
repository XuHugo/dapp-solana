import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Voting } from "../../../../anchor/target/types/voting";
import { AnchorError, BN, Program, web3 } from "@coral-xyz/anchor";
const IDL = require("../../../../anchor/target/idl/voting.json");

export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetdata: ActionGetResponse = {
    icon: "https://i.morioh.com/2019/12/05/07a1946f41ee.jpg",
    title: "Favorite Languagee",
    description: "Vote for your favorite languagee",
    label: "Vote",
    links: {
      actions: [
        {
          label: "Vote for Rust",
          href: "/api/vote?candidate=Rust",
          type: "transaction"
        },
        {
          label: "Vote for TypeScript",
          href: "/api/vote?candidate=Typescript",
          type: "transaction"
        }
      ]
    }
  };
  return Response.json(actionMetdata, { headers: ACTIONS_CORS_HEADERS })
}

export async function POST(request: Request) {

  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");
  if (!candidate) {
    return new Response("Missing candidate parameter", { status: 400 });
  }

  if (candidate != "Rust" && candidate != "Typescript") {
    return new Response("Invalid candidate", { status: 400, headers: ACTIONS_CORS_HEADERS });
  }

  const connection = new web3.Connection("http://127.0.0.1:8899", "confirmed");
  //const connection = new Connection("https://127.0.0.1:8899", "confirmed");
  const program: Program<Voting> = new Program(IDL, { connection });
  const body: ActionPostRequest = await request.json();
  let voter;
  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid account", { status: 400, headers: ACTIONS_CORS_HEADERS });
  }
  const instruction = await program.methods
    .vote(new BN(1), candidate)
    .accounts({
      payer: voter,
    })
    .instruction();
  console.log("1---------------------");
  const blockhash = await connection.getLatestBlockhash();
  console.log("2---------------------");
  const transaction = new Transaction(
    {
      feePayer: voter,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight
    }
  )
    .add(instruction);
  const response = await createPostResponse({
    fields: {
      transaction: transaction,
      type: "transaction"
    }
  });
  console.log("3---------------------", response);
  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}