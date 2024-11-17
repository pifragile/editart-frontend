import React from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { TEZOS_NETWORK, RPC_NODE } from "../consts";
import { char2Bytes } from "@taquito/utils";

const options = {
    name: "EditArt",
    preferredNetwork: TEZOS_NETWORK,
};
export const beaconWallet = new BeaconWallet(options);
export const WalletContext = React.createContext(undefined);

const tezos = new TezosToolkit(RPC_NODE);
tezos.setWalletProvider(beaconWallet);

const checkIfWalletConnected = async (wallet) => {
    try {
        const activeAccount = await wallet.client.getActiveAccount();
        if (!activeAccount) {
            await wallet.client.requestPermissions({
                type: { network: TEZOS_NETWORK },
            });
        }
        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error,
        };
    }
};

export const mint = async (wallet, contractAddress, queryString, price) => {
    const response = await checkIfWalletConnected(wallet);

    if (response.success) {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods.mint(char2Bytes(queryString)).send({
            amount: price,
            mutez: true,
            gasLimit: 20000,
            fee: 3000
        });
        const result = await operation.confirmation();
        console.log(result);
    }
};

export const buy = async (wallet, contractAddress, tokenId, price) => {
    const response = await checkIfWalletConnected(wallet);

    if (response.success) {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods.buy_item(tokenId).send({
            amount: price,
            mutez: true,
        });
        const result = await operation.confirmation();
        console.log(result);
    }
};

export const list = async (wallet, contractAddress, tokenId, price) => {
    const response = await checkIfWalletConnected(wallet);

    if (response.success) {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods
            .list_item(price, tokenId)
            .send();
        const result = await operation.confirmation();
        console.log(result);
    }
};

export const cancelListing = async (wallet, contractAddress, tokenId) => {
    const response = await checkIfWalletConnected(wallet);

    if (response.success) {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods
            .cancel_listing(tokenId)
            .send({});
        const result = await operation.confirmation();
        console.log(result);
    }
};

export const transfer = async (
    wallet,
    contractAddress,
    tokenId,
    from,
    destination
) => {
    const response = await checkIfWalletConnected(wallet);

    if (response.success) {
        const contract = await tezos.wallet.at(contractAddress);
        const transferParams = [
            {
                from_: from,
                txs: [
                    {
                        to_: destination,
                        token_id: tokenId,
                        amount: 1,
                    },
                ],
            },
        ];

        const operation = await contract.methods
            .transfer(transferParams)
            .send({});
        const result = await operation.confirmation();
        console.log(result);
    }
};

export const setPrice = async (wallet, contractAddress, price) => {
    const response = await checkIfWalletConnected(wallet);

    if (response.success) {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods
            .set_price(price)
            .send({});
        const result = await operation.confirmation();
        console.log(result);
    }
};

export const togglePaused = async (wallet, contractAddress) => {
    const response = await checkIfWalletConnected(wallet);

    if (response.success) {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods
            .toggle_paused()
            .send({});
        const result = await operation.confirmation();
        console.log(result);
    }
};

export const setNumTokens = async (wallet, contractAddress, num_tokens) => {
    const response = await checkIfWalletConnected(wallet);

    if (response.success) {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods
            .set_num_tokens(num_tokens)
            .send({});
        const result = await operation.confirmation();
        console.log(result);
    }
};