/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/voting.json`.
 */
export type Voting = {
  "address": "75HvzP19wM3b1q9mdXcAkGK8rnYZ5Dsa4PXn2kvszQz5",
  "metadata": {
    "name": "voting",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeCandidate",
      "discriminator": [
        210,
        107,
        118,
        204,
        255,
        97,
        112,
        26
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollAccount"
        },
        {
          "name": "candidateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "pollId"
              },
              {
                "kind": "arg",
                "path": "candidateName"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "candidateName",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializePoll",
      "discriminator": [
        193,
        22,
        99,
        197,
        18,
        33,
        115,
        117
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "pollId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "pollName",
          "type": "string"
        },
        {
          "name": "startTime",
          "type": "u64"
        },
        {
          "name": "endTime",
          "type": "u64"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  108,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "pollId"
              }
            ]
          }
        },
        {
          "name": "candidateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "pollId"
              },
              {
                "kind": "arg",
                "path": "candidateName"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "pollId",
          "type": "u64"
        },
        {
          "name": "candidateName",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "candidateAccount",
      "discriminator": [
        69,
        203,
        73,
        43,
        203,
        170,
        96,
        121
      ]
    },
    {
      "name": "pollAccount",
      "discriminator": [
        109,
        254,
        117,
        41,
        232,
        74,
        172,
        45
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "votingNotStarted",
      "msg": "Voting has not started yet"
    },
    {
      "code": 6001,
      "name": "votingEnded",
      "msg": "Voting has ended"
    }
  ],
  "types": [
    {
      "name": "candidateAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "candidateName",
            "type": "string"
          },
          {
            "name": "candidateVotes",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "pollAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollId",
            "type": "u64"
          },
          {
            "name": "pollName",
            "type": "string"
          },
          {
            "name": "pollDescription",
            "type": "string"
          },
          {
            "name": "pollVotingStart",
            "type": "u64"
          },
          {
            "name": "pollVotingEnd",
            "type": "u64"
          },
          {
            "name": "pollOptionIndex",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
