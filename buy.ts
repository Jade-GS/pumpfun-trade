import * as anchor from "@coral-xyz/anchor";
import { BN, web3 } from "@coral-xyz/anchor";
import {
    createAssociatedTokenAccountInstruction,
    getAccount,
    getAssociatedTokenAddress,
} from "@solana/spl-token";
import { ComputeBudgetProgram } from "@solana/web3.js";
import { setup } from "./setup";

// buy token
(async () => {

    const {
        program,
        user,
        mint,
        operator,
        connection
    } = await setup(new web3.PublicKey("")); // <=== pass token publicKey
    
    const bondinfCurve = await web3.PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), mint.toBuffer()],
        program.programId
    )[0];
    console.log("🚀 ~ file: buy.ts:19 ~ bondinfCurve:", bondinfCurve)

    const associatedBondingCurve = await getAssociatedTokenAddress(
        mint,
        bondinfCurve,
        true
    );
    console.log("🚀 ~ file: buy.ts:30 ~ associatedBondingCurve:", associatedBondingCurve)
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
            new BN(357547483436),
            new BN(10201000)
        )
        .accounts({
            mint,
            associatedBondingCurve: associatedBondingCurve,
            associatedUser: associatedUser,
            feeRecipient: new web3.PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM")
        })
        .preInstructions([
            modifyComputeUnits,
            addPriorityFee
        ])
        .signers([user]).rpc();

    console.log("buy: ", signature);
})();
