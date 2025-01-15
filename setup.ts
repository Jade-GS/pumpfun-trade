import * as anchor from "@coral-xyz/anchor";
import { PumpFun } from "./pumpfun";


export async function setup(mint: anchor.web3.PublicKey) {
    const connection = new anchor.web3.Connection(
        anchor.web3.clusterApiUrl("mainnet-beta")
    );
    const idl = require("./pump-fun.json");
    const path_authority_key = "/auth.json";
    const operator = anchor.web3.Keypair.fromSecretKey(
        new Uint8Array(require(path_authority_key))
    ) as anchor.web3.Keypair;

    const path_user_key = "./user.json";
    const user = anchor.web3.Keypair.fromSecretKey(
        new Uint8Array(require(path_user_key))
    ) as anchor.web3.Keypair;


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
        operator,
        connection,
        mint,
        user
    };
}
