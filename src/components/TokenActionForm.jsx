import {
    WalletContext,
    buy,
    list,
    cancelListing,
    transfer,
} from "../lib/wallet";
import { useContext, useState, useEffect } from "react";
import { formatMutez } from "../lib/utils";

function TokenActionForm({ contract, tokenId, price, owner }) {
    const wallet = useContext(WalletContext);
    const [activeAccount, setActiveAccount] = useState(null);

    useEffect(() => {
        const func = async () => {
            const account = await wallet.client.getActiveAccount();
            if (account) {
                setActiveAccount(account.address);
            }
        };
        func();
    }, [wallet]);

    const handleBuy = async (e) => {
        e.preventDefault();
        await buy(wallet, contract, tokenId, price);
    };

    const handleList = async (e) => {
        e.preventDefault();
        let price = parseFloat(e.target[1].value);
        await list(wallet, contract, tokenId, price * 1000000);
    };

    const handleCancelListing = async (e) => {
        e.preventDefault();
        await cancelListing(wallet, contract, tokenId);
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        let destination = e.target[1].value;
        await transfer(wallet, contract, tokenId, activeAccount, destination);
    };
    return (
        <div>
            {price && (
                <form onSubmit={handleBuy}>
                    <fieldset>
                        <legend>Buy</legend>
                        <div className="form-group">
                            <button
                                className="btn btn-default"
                                name="submit"
                                id="submit"
                            >
                                Buy for {formatMutez(price)}
                            </button>
                        </div>
                    </fieldset>
                </form>
            )}
            {activeAccount === owner && (
                <div>
                    <form onSubmit={handleList}>
                        <fieldset>
                            <legend>List</legend>
                            <div className="form-group">
                                <input
                                    id="price"
                                    type="number"
                                    required={true}
                                    placeholder="tez"
                                    step="0.0001"
                                />
                                <button
                                    className="btn btn-default"
                                    type="submit"
                                    name="submit"
                                    id="submit"
                                >
                                    List
                                </button>
                            </div>
                        </fieldset>
                    </form>

                    <form onSubmit={handleCancelListing}>
                        <fieldset>
                            <legend>Cancel Listing</legend>
                            <div className="form-group">
                                <button
                                    className="btn btn-default"
                                    type="submit"
                                    name="submit"
                                    id="submit"
                                >
                                    Cancel Listing
                                </button>
                            </div>
                        </fieldset>
                    </form>
                    <form onSubmit={handleTransfer}>
                        <fieldset>
                            <legend>Transfer</legend>
                            <div className="form-group">
                                <input
                                    id="text"
                                    name="text"
                                    type="text"
                                    required={true}
                                    placeholder="address"
                                />
                                <button
                                    className="btn btn-default"
                                    type="submit"
                                    name="submit"
                                    id="submit"
                                >
                                    Transfer
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            )}
        </div>
    );
}

export default TokenActionForm;
