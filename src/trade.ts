import * as anchor from "@coral-xyz/anchor";
import { PumpFun } from "./pumpfun.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { ComputeBudgetProgram } from "@solana/web3.js";
import inquirer from "inquirer"; 

export async function setup() {
    const connection = new anchor.web3.Connection(
        anchor.web3.clusterApiUrl("mainnet-beta")
    );
    const idl = require("./pump-fun.json");

    const path_user_key = "./user.json";
    const user = anchor.web3.Keypair.fromSecretKey(
        new Uint8Array(require(path_user_key))
    ) ;


    const wallet = new anchor.Wallet(user);
    const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    });

    // mint = mint ?? new anchor.web3.PublicKey("") // <== pass token public key 


    const program = new anchor.Program(
        idl as PumpFun,
        provider
    );


    return {
        program,
        connection,
        user
    };
}

export async function buy(mint: anchor.web3.PublicKey) {

    const {
        program,
        user,
        connection
    } = await setup();

    const bondingCurve = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), mint.toBuffer()],
        program.programId
    )[0];

    const associatedBondingCurve = await getAssociatedTokenAddress(
        mint,
        bondingCurve,
        true
    );
    const associatedUser = await getAssociatedTokenAddress(
        mint,
        user.publicKey,
        true
    );
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 42000
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5000
    });


    const signature = await program.methods
        .buy(
            new anchor.BN(357547483436),
            new anchor.BN(10201000)
        )
        .accounts({
            mint,
            associatedBondingCurve: associatedBondingCurve,
            associatedUser: associatedUser,
            feeRecipient: new anchor.web3.PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM")
        })
        .preInstructions([
            modifyComputeUnits,
            addPriorityFee
        ])
        .signers([user]).rpc();

    console.log("buy: ", signature);
}


export async function sell(mint: anchor.web3.PublicKey) {
    const {
        program,
        user,
        connection
    } = await setup(); 

    const bondingCurve = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), mint.toBuffer()],
        program.programId
    )[0];

    const associatedBondingCurve = await getAssociatedTokenAddress(
        mint,
        bondingCurve,
        true
    );
    const associatedUser = await getAssociatedTokenAddress(
        mint,
        user.publicKey,
        true
    );
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 42000
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5000
    });


    const signature = await program.methods
        .sell(
            new anchor.BN(357547483436),
            new anchor.BN(9900000)
        )
        .accounts({
            mint,
            associatedBondingCurve: associatedBondingCurve,
            associatedUser: associatedUser,
            feeRecipient: new anchor.web3.PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM")
        })
        .preInstructions([
            modifyComputeUnits,
            addPriorityFee
        ])
        .signers([user]).rpc();

    console.log("sell: ", signature);
}

async function main() {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["buy", "sell"],
        },
    ]);
    const mint = new anchor.web3.PublicKey("GqtQGba6FMcddCJJpgJxHnMtV2Akwgih2RcTdwhxGT8f")
    if (action === "buy") {
        await buy(mint);
    } else if (action === "sell") {
        await sell(mint);
    }
}

// Run the main function
main().catch(err => {
    console.error(err);
});