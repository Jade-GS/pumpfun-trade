import { web3 } from "@coral-xyz/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { ComputeBudgetProgram } from "@solana/web3.js";
import BN from "bn.js";
import { setup } from "./trade.js";
// sell token
(async () => {

    const {
        program,
        user,
        mint,
        
        connection
    } = await setup(new web3.PublicKey("")); // <=== pass token publicKey

    const bondingCurve = await web3.PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), mint.toBuffer()],
        program.programId
    )[0];
    console.log("🚀 ~ file: buy.ts:19 ~ bondingCurve:", bondingCurve)

    const associatedBondingCurve = await getAssociatedTokenAddress(
        mint,
        bondingCurve,
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
        .sell(
            new BN(357547483436),
            new BN(9900000)
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

    console.log("sell: ", signature);
})();