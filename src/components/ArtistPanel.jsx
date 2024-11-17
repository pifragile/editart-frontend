import { WalletContext, togglePaused, setPrice, setNumTokens } from "../lib/wallet";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";

function ArtistPanel() {
    const wallet = useContext(WalletContext);
    let { contract } = useParams();

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
                                Set price
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
                                Toggle paused
                            </button>
                        </div>
                    </fieldset>
                </form>

                <form onSubmit={handleSetNumTokens}>
                    <fieldset>
                        <legend>Set num_tokens</legend>
                        <div className="form-group">
                            <input
                                id="price"
                                type="number"
                                required={true}
                                placeholder="num_tokens"
                                step="1"
                            />
                            <button
                                className="btn btn-default"
                                type="submit"
                                name="submit"
                                id="submit"
                            >
                                Set num_tokens
                            </button>
                        </div>
                    </fieldset>
                </form>

            </div>
        </Layout>
    );
}

export default ArtistPanel;
