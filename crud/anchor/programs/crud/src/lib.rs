#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("G2Zgbwy5bSK15MqwyfaVnPmuGHTAYaWjy2VAnczeyaCa");

#[program]
pub mod crud {
    use super::*;

    pub fn create_journal_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_account;
        journal_entry.title = title;
        journal_entry.message = message;
        journal_entry.owner = *ctx.accounts.payer.key;
        Ok(())
    }

    pub fn update_journal_entry(
        ctx: Context<UpdateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_account;
        journal_entry.message = message;
        Ok(())
    }

    pub fn delete_journal_entry(_ctx: Context<DeleteEntry>, title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateEntry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
    init,
    payer = payer,
    space = 8 + JournalEntry::INIT_SPACE,
    seeds = [title.as_ref(), payer.key().as_ref()],
    bump
  )]
    pub journal_account: Account<'info, JournalEntry>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
      mut,
      realloc = 8 + JournalEntry::INIT_SPACE,
      realloc::payer = payer,
      realloc::zero = true,
    seeds = [title.as_ref(), payer.key().as_ref()],
    bump,
    )]
    pub journal_account: Account<'info, JournalEntry>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  seeds = [title.as_ref(), payer.key().as_ref()],
  bump,
  close = payer, // close account and return lamports to payer
  )]
    pub journal_account: Account<'info, JournalEntry>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntry {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String,
}
