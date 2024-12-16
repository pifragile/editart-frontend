import {
    WalletContext,
    togglePaused,
    setPrice,
    setNumTokens,
} from "../lib/wallet";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import { getContractStorage } from "../lib/api";

function ArtistPanel() {
    const wallet = useContext(WalletContext);
    let { contract } = useParams();

    const [paused, setPaused] = useState(null);

    useEffect(() => {
        async function action() {
            setPaused(await getContractStorage(contract, "paused"));
        }
        action();
    }, []);

    const handleTogglePaused = async (e) => {
        e.preventDefault();
        await togglePaused(wallet, contract);
    };

    const handleSetPrice = async (e) => {
        e.preventDefault();
        let price = parseFloat(e.target[1].value);
        await setPrice(wallet, contract, price * 1000000);
    };

    const handleSetNumTokens = async (e) => {
        e.preventDefault();
        let num_tokens = parseFloat(e.target[1].value);
        await setNumTokens(wallet, contract, num_tokens);
    };

    return (
        <Layout>
            <div>
                <form onSubmit={handleSetPrice}>
                    <fieldset>
                        <legend>Set Price</legend>
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
                                Set Price
                            </button>
                        </div>
                    </fieldset>
                </form>

                <form onSubmit={handleTogglePaused}>
                    <fieldset>
                        <legend>Toggle Paused</legend>
                        <div className="form-group">
                            <button
                                className="btn btn-default"
                                type="submit"
                                name="submit"
                                id="submit"
                            >
                                {paused ? "Unpause" : "Pause"}
                            </button>
                        </div>
                    </fieldset>
                </form>

                <form onSubmit={handleSetNumTokens}>
                    <fieldset>
                        <legend>Set Number of Editions</legend>
                        <div className="form-group">
                            <input
                                id="price"
                                type="number"
                                required={true}
                                placeholder="Number of Editions"
                                step="1"
                            />
                            <button
                                className="btn btn-default"
                                type="submit"
                                name="submit"
                                id="submit"
                            >
                                Set Number of Editions
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </Layout>
    );
}

export default ArtistPanel;
