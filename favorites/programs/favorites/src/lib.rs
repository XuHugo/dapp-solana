use anchor_lang::prelude::*;

declare_id!("GTQoPwpEpjS5PAcZ2tMPnuaWTq5qvHR4pSMfYJ4U1Tww");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod favorites {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        number: u64,
        color: String,
        hobbies: Vec<String>,
    ) -> Result<()> {
        let user_public_key = ctx.accounts.user.key();
        msg!("Greetings from: {:?}", ctx.program_id);
        msg!("User: {:?}", user_public_key);
        msg!("Number: {:?}", number);
        msg!("Color: {:?}", color);
        msg!("Hobbies: {:?}", hobbies);

        ctx.accounts.favorites.set_inner(Favorites {
            number,
            color,
            hobbies,
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE+Favorites::INIT_SPACE,
        seeds = [b"favourites", user.key().as_ref()],
        bump,)]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,
    #[max_len(50)]
    pub color: String,
    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}
