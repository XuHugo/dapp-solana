#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        poll_id: u64,
        poll_name: String,
        start_time: u64,
        end_time: u64,
        description: String,
    ) -> Result<()> {
        ctx.accounts.poll_account.poll_id = poll_id;
        ctx.accounts.poll_account.poll_name = poll_name;
        ctx.accounts.poll_account.poll_voting_start = start_time;
        ctx.accounts.poll_account.poll_voting_end = end_time;
        ctx.accounts.poll_account.poll_description = description;
        Ok(())
    }

    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        poll_id: u64,
        candidate_name: String,
    ) -> Result<()> {
        ctx.accounts.candidate_account.candidate_name = candidate_name;
        ctx.accounts.poll_account.poll_option_index += 1;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, poll_id: u64, candidate_name: String) -> Result<()> {
        let candidate_account = &mut ctx.accounts.candidate_account;
        let current_time = Clock::get()?.unix_timestamp;
        if current_time > (ctx.accounts.poll_account.poll_voting_end as i64) {
            return Err(ErrorCode::VotingEnded.into());
        }
        if current_time < (ctx.accounts.poll_account.poll_voting_start as i64) {
            return Err(ErrorCode::VotingNotStarted.into());
        }
        candidate_account.candidate_votes += 1;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
    init_if_needed,
    payer = payer,
    space = 8 + PollAccount::INIT_SPACE,
    seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
    bump
  )]
    pub poll_account: Account<'info, PollAccount>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(poll_id: u64, candidate_name: String)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub poll_account: Account<'info, PollAccount>,

    #[account(
  init,
  payer = payer, // close account and return lamports to payer
  space = 8 + CandidateAccount::INIT_SPACE,
  seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_ref()],
  bump
  )]
    pub candidate_account: Account<'info, CandidateAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate_name: String)]
pub struct Vote<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
      mut,
      seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
      bump, // bump seed  to generate a new address
    )]
    pub poll_account: Account<'info, PollAccount>,
    #[account(
      mut,
      seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_ref()],
      bump, // bump seed  to generate a new address
    )]
    pub candidate_account: Account<'info, CandidateAccount>,
}

#[account]
#[derive(InitSpace)]
pub struct CandidateAccount {
    #[max_len(32)]
    pub candidate_name: String,
    pub candidate_votes: u64,
}

#[account]
#[derive(InitSpace)]
pub struct PollAccount {
    pub poll_id: u64,
    #[max_len(32)]
    pub poll_name: String,
    #[max_len(280)]
    pub poll_description: String,
    pub poll_voting_start: u64,
    pub poll_voting_end: u64,
    pub poll_option_index: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Voting has not started yet")]
    VotingNotStarted,
    #[msg("Voting has ended")]
    VotingEnded,
}
