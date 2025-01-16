"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sell = exports.buy = exports.setup = void 0;
var anchor = require("@coral-xyz/anchor");
var spl_token_1 = require("@solana/spl-token");
var web3_js_1 = require("@solana/web3.js");
var inquirer_1 = require("inquirer");
var dotenv = require("dotenv");
// Load environment variables
dotenv.config();
function setup() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, idl, path_user_key, user, wallet, provider, program;
        return __generator(this, function (_a) {
            connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("mainnet-beta"));
            idl = require("./src/pump-fun.json");
            path_user_key = "./user.json";
            user = anchor.web3.Keypair.fromSecretKey(new Uint8Array(require(path_user_key)));
            wallet = new anchor.Wallet(user);
            provider = new anchor.AnchorProvider(connection, wallet, {
                commitment: "confirmed",
            });
            program = new anchor.Program(idl, provider);
            return [2 /*return*/, {
                    program: program,
                    connection: connection,
                    user: user
                }];
        });
    });
}
exports.setup = setup;
function buy(mint, amount1, amount2) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, program, user, connection, bondingCurve, associatedBondingCurve, associatedUser, modifyComputeUnits, addPriorityFee, signature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, setup()];
                case 1:
                    _a = _b.sent(), program = _a.program, user = _a.user, connection = _a.connection;
                    return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("bonding-curve"), mint.toBuffer()], program.programId)[0]];
                case 2:
                    bondingCurve = _b.sent();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint, bondingCurve, true)];
                case 3:
                    associatedBondingCurve = _b.sent();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint, user.publicKey, true)];
                case 4:
                    associatedUser = _b.sent();
                    modifyComputeUnits = web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
                        units: 42000
                    });
                    addPriorityFee = web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: 50000
                    });
                    return [4 /*yield*/, program.methods
                            .buy(new anchor.BN(amount1 * 10 ^ 6), new anchor.BN(amount2 * 10 ^ 9))
                            .accounts({
                            mint: mint,
                            associatedBondingCurve: associatedBondingCurve,
                            associatedUser: associatedUser,
                            feeRecipient: new anchor.web3.PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM")
                        })
                            .preInstructions([
                            modifyComputeUnits,
                            addPriorityFee
                        ])
                            .signers([user]).rpc()];
                case 5:
                    signature = _b.sent();
                    console.log("buy: ", signature);
                    return [2 /*return*/];
            }
        });
    });
}
exports.buy = buy;
function sell(mint, amount1, amount2) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, program, user, connection, bondingCurve, associatedBondingCurve, associatedUser, modifyComputeUnits, addPriorityFee, signature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, setup()];
                case 1:
                    _a = _b.sent(), program = _a.program, user = _a.user, connection = _a.connection;
                    return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("bonding-curve"), mint.toBuffer()], program.programId)[0]];
                case 2:
                    bondingCurve = _b.sent();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint, bondingCurve, true)];
                case 3:
                    associatedBondingCurve = _b.sent();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint, user.publicKey, true)];
                case 4:
                    associatedUser = _b.sent();
                    modifyComputeUnits = web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
                        units: 42000
                    });
                    addPriorityFee = web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: 50000
                    });
                    return [4 /*yield*/, program.methods
                            .sell(new anchor.BN(amount1 * 10 ^ 6), new anchor.BN(amount2 * 10 ^ 9))
                            .accounts({
                            mint: mint,
                            associatedBondingCurve: associatedBondingCurve,
                            associatedUser: associatedUser,
                            feeRecipient: new anchor.web3.PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM")
                        })
                            .preInstructions([
                            modifyComputeUnits,
                            addPriorityFee
                        ])
                            .signers([user]).rpc()];
                case 5:
                    signature = _b.sent();
                    console.log("sell: ", signature);
                    return [2 /*return*/];
            }
        });
    });
}
exports.sell = sell;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var action, mint, _a, amount1, amount2, parsedAmount1, parsedAmount2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            type: "list",
                            name: "action",
                            message: "What would you like to do?",
                            choices: ["buy", "sell"],
                        },
                    ])];
                case 1:
                    action = (_b.sent()).action;
                    mint = new anchor.web3.PublicKey(process.env.MINT_PUBLIC_KEY);
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "input",
                                name: "amount1",
                                message: "Enter the first amount (e.g., for token quantity):",
                                validate: function (value) { return (!isNaN(Number(value)) ? true : "Please enter a valid number"); },
                            },
                            {
                                type: "input",
                                name: "amount2",
                                message: "Enter the second amount (e.g., for lamports):",
                                validate: function (value) { return (!isNaN(Number(value)) ? true : "Please enter a valid number"); },
                            },
                        ])];
                case 2:
                    _a = _b.sent(), amount1 = _a.amount1, amount2 = _a.amount2;
                    parsedAmount1 = Number(amount1);
                    parsedAmount2 = Number(amount2);
                    if (!(action === "buy")) return [3 /*break*/, 4];
                    return [4 /*yield*/, buy(mint, parsedAmount1, parsedAmount2)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    if (!(action === "sell")) return [3 /*break*/, 6];
                    return [4 /*yield*/, sell(mint, parsedAmount1, parsedAmount2)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Run the main function
main().catch(function (err) {
    console.error(err);
});
